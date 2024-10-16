"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCordovaConfig = exports.CordovaConfig = void 0;
const tslib_1 = require("tslib");
const node_1 = require("@ionic/cli-framework/utils/node");
const utils_fs_1 = require("@ionic/utils-fs");
const utils_terminal_1 = require("@ionic/utils-terminal");
const debug_1 = require("debug");
const et = tslib_1.__importStar(require("elementtree"));
const path = tslib_1.__importStar(require("path"));
const guards_1 = require("../../../guards");
const color_1 = require("../../color");
const errors_1 = require("../../errors");
const uuid_1 = require("../../utils/uuid");
const debug = (0, debug_1.debug)('ionic:lib:integrations:cordova:config');
class CordovaConfig {
    constructor(configXmlPath, packageJsonPath) {
        this.configXmlPath = configXmlPath;
        this.packageJsonPath = packageJsonPath;
        this.saving = false;
    }
    get doc() {
        if (!this._doc) {
            throw new Error('No doc loaded.');
        }
        return this._doc;
    }
    get pkg() {
        if (!this._pkg) {
            throw new Error('No package.json loaded.');
        }
        return this._pkg;
    }
    get sessionid() {
        if (!this._sessionid) {
            throw new Error('No doc loaded.');
        }
        return this._sessionid;
    }
    static async load(configXmlPath, packageJsonPath) {
        if (!configXmlPath || !packageJsonPath) {
            throw new Error('Must supply file paths for config.xml and package.json.');
        }
        const conf = new CordovaConfig(configXmlPath, packageJsonPath);
        await conf.reload();
        return conf;
    }
    async reload() {
        const configXml = await (0, utils_fs_1.readFile)(this.configXmlPath, { encoding: 'utf8' });
        if (!configXml) {
            throw new Error(`Cannot load empty config.xml file.`);
        }
        try {
            this._doc = et.parse(configXml);
            this._sessionid = (0, uuid_1.shortid)();
        }
        catch (e) {
            throw new Error(`Cannot parse config.xml file: ${e.stack ? e.stack : e}`);
        }
        const packageJson = await (0, node_1.readPackageJsonFile)(this.packageJsonPath);
        if ((0, guards_1.isCordovaPackageJson)(packageJson)) {
            this._pkg = packageJson;
        }
        else {
            this._pkg = { ...packageJson, cordova: { platforms: [], plugins: {} } };
            debug('Invalid package.json for Cordova. Missing or invalid Cordova entries in %O', this.packageJsonPath);
        }
    }
    async save() {
        if (!this.saving) {
            this.saving = true;
            await (0, utils_fs_1.writeFile)(this.configXmlPath, this.write(), { encoding: 'utf8' });
            this.saving = false;
        }
    }
    setName(name) {
        const root = this.doc.getroot();
        let nameNode = root.find('name');
        if (!nameNode) {
            nameNode = et.SubElement(root, 'name', {});
        }
        nameNode.text = name;
    }
    setBundleId(bundleId) {
        const root = this.doc.getroot();
        root.set('id', bundleId);
    }
    getBundleId() {
        const root = this.doc.getroot();
        return root.get('id');
    }
    /**
     * Update config.xml content src to be a dev server url. As part of this
     * backup the original content src for a reset to occur at a later time.
     */
    writeContentSrc(newSrc) {
        const root = this.doc.getroot();
        let contentElement = root.find('content');
        if (!contentElement) {
            contentElement = et.SubElement(root, 'content', { src: 'index.html' });
        }
        contentElement.set('original-src', contentElement.get('src'));
        contentElement.set('src', newSrc);
        let navElement = root.find(`allow-navigation[@href='${newSrc}']`);
        if (!navElement) {
            navElement = et.SubElement(root, 'allow-navigation', { sessionid: this.sessionid, href: newSrc });
        }
    }
    /**
     * Set config.xml src url back to its original url
     */
    resetContentSrc() {
        const root = this.doc.getroot();
        let contentElement = root.find('content');
        if (!contentElement) {
            contentElement = et.SubElement(root, 'content', { src: 'index.html' });
        }
        const originalSrc = contentElement.get('original-src');
        if (originalSrc) {
            contentElement.set('src', originalSrc);
            delete contentElement.attrib['original-src'];
        }
        const navElements = root.findall(`allow-navigation[@sessionid='${this.sessionid}']`);
        for (const navElement of navElements) {
            root.remove(navElement);
        }
    }
    getPreference(prefName) {
        const root = this.doc.getroot();
        const preferenceElement = root.find(`preference[@name='${prefName}']`);
        if (!preferenceElement) {
            return undefined;
        }
        const value = preferenceElement.get('value');
        if (!value) {
            return undefined;
        }
        return value;
    }
    getProjectInfo() {
        const root = this.doc.getroot();
        let id = root.get('id');
        if (!id) {
            id = '';
        }
        let version = root.get('version');
        if (!version) {
            version = '';
        }
        let nameElement = root.find('name');
        if (!nameElement) {
            nameElement = et.SubElement(root, 'name', {});
        }
        if (!nameElement.text) {
            nameElement.text = 'MyApp';
        }
        const name = nameElement.text.toString().trim();
        return { id, name, version };
    }
    getConfiguredPlatforms() {
        const deps = { ...this.pkg.devDependencies, ...this.pkg.dependencies };
        return this.pkg.cordova.platforms.map(platform => ({
            name: platform,
            spec: deps[`cordova-${platform}`],
        }));
    }
    write() {
        // Cordova hard codes an indentation of 4 spaces, so we'll follow.
        const contents = this.doc.write({ indent: 4 });
        return contents;
    }
}
exports.CordovaConfig = CordovaConfig;
async function loadCordovaConfig(integration) {
    const configXmlPath = path.resolve(integration.root, 'config.xml');
    const packageJsonPath = path.resolve(integration.root, 'package.json');
    debug('Loading Cordova Config (config.xml: %O, package.json: %O)', configXmlPath, packageJsonPath);
    try {
        return await CordovaConfig.load(configXmlPath, packageJsonPath);
    }
    catch (e) {
        const msg = e.code === 'ENOENT'
            ? (`Could not find necessary file(s): ${(0, color_1.strong)('config.xml')}, ${(0, color_1.strong)('package.json')}.\n\n` +
                ` - ${(0, color_1.strong)((0, utils_terminal_1.prettyPath)(configXmlPath))}\n` +
                ` - ${(0, color_1.strong)((0, utils_terminal_1.prettyPath)(packageJsonPath))}\n\n` +
                `You can re-add the Cordova integration with the following command: ${(0, color_1.input)('ionic integrations enable cordova --add')}`)
            : (0, color_1.failure)(e.stack ? e.stack : e);
        throw new errors_1.FatalException(`Cannot load Cordova config.\n` +
            `${msg}`);
    }
}
exports.loadCordovaConfig = loadCordovaConfig;
