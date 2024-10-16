"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Integration = void 0;
const tslib_1 = require("tslib");
const cli_framework_1 = require("@ionic/cli-framework");
const utils_fs_1 = require("@ionic/utils-fs");
const utils_terminal_1 = require("@ionic/utils-terminal");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const debug_1 = require("debug");
const lodash = tslib_1.__importStar(require("lodash"));
const path = tslib_1.__importStar(require("path"));
const debug = (0, debug_1.debug)('ionic:lib:integrations:capacitor');
const __1 = require("../");
const color_1 = require("../../color");
const npm_1 = require("../../utils/npm");
const config_1 = require("./config");
class Integration extends __1.BaseIntegration {
    constructor() {
        super(...arguments);
        this.name = 'capacitor';
        this.summary = `Target native iOS and Android with Capacitor, Ionic's new native layer`;
        this.archiveUrl = undefined;
        this.getCapacitorCLIVersion = lodash.memoize(async () => {
            return this.e.shell.cmdinfo('capacitor', ['--version'], { cwd: this.root });
        });
        this.getCapacitorCLIConfig = lodash.memoize(async () => {
            const args = ['config', '--json'];
            debug('Getting config with Capacitor CLI: %O', args);
            let output = undefined;
            try {
                output = await (async (_command, _args = [], opts = {}) => {
                    try {
                        const proc = await this.e.shell.createSubprocess(_command, _args, opts);
                        const out = await proc.output();
                        return out.split('\n').join(' ').trim();
                    }
                    catch (err) {
                        throw err;
                    }
                })('capacitor', args, { cwd: this.root });
            }
            catch (error) {
                if (error.code === 'ERR_SUBPROCESS_COMMAND_NOT_FOUND') {
                    throw new Error(`Capacitor command not found. Is the Capacitor CLI installed? (npm i -D @capacitor/cli)`);
                }
                else {
                    throw new Error(error.message);
                }
            }
            if (!output) {
                debug('Could not get config from Capacitor CLI (probably old version)');
                return;
            }
            else {
                try {
                    // Capacitor 1 returns the `command not found` error in stdout instead of stderror like in Capacitor 2
                    // This ensures that the output from the command is valid JSON to account for this
                    return JSON.parse(output);
                }
                catch (e) {
                    debug('Could not get config from Capacitor CLI (probably old version)', e);
                    return;
                }
            }
        });
        this.getCapacitorConfig = lodash.memoize(async () => {
            try {
                const cli = await this.getCapacitorCLIConfig();
                if (cli) {
                    debug('Loaded Capacitor config!');
                    return cli.app.extConfig;
                }
            }
            catch (ex) {
                // ignore
            }
            // fallback to reading capacitor.config.json if it exists
            const confPath = this.getCapacitorConfigJsonPath();
            if (!(await (0, utils_fs_1.pathExists)(confPath))) {
                debug('Capacitor config file does not exist at %O', confPath);
                debug('Failed to load Capacitor config');
                return;
            }
            const conf = new config_1.CapacitorJSONConfig(confPath);
            const extConfig = conf.c;
            debug('Loaded Capacitor config!');
            return extConfig;
        });
    }
    get config() {
        return new __1.IntegrationConfig(this.e.project.filePath, { pathPrefix: [...this.e.project.pathPrefix, 'integrations', this.name] });
    }
    get root() {
        return this.config.get('root', this.e.project.directory);
    }
    async add(details) {
        const confPath = this.getCapacitorConfigJsonPath();
        if (await (0, utils_fs_1.pathExists)(confPath)) {
            this.e.log.nl();
            this.e.log.warn(`Capacitor already exists in project.\n` +
                `Since the Capacitor config already exists (${(0, color_1.strong)((0, utils_terminal_1.prettyPath)(confPath))}), the Capacitor integration has been ${chalk_1.default.green('enabled')}.\n\n` +
                `You can re-integrate this project by doing the following:\n\n` +
                `- Run ${(0, color_1.input)(`ionic integrations disable ${this.name}`)}\n` +
                `- Remove the ${(0, color_1.strong)((0, utils_terminal_1.prettyPath)(confPath))} file\n` +
                `- Run ${(0, color_1.input)(`ionic integrations enable ${this.name} --add`)}\n`);
        }
        else {
            let name = this.e.project.config.get('name');
            let packageId = 'io.ionic.starter';
            let webDir = await this.e.project.getDefaultDistDir();
            const options = [];
            if (details.enableArgs && details.enableArgs.length > 0) {
                const parsedArgs = (0, cli_framework_1.parseArgs)(details.enableArgs);
                name = String(parsedArgs._[0]) || name;
                packageId = parsedArgs._[1] || packageId;
                if (parsedArgs['web-dir']) {
                    webDir = parsedArgs['web-dir'];
                }
            }
            options.push('--web-dir', webDir);
            await this.installCapacitorCore();
            await this.installCapacitorCLI();
            await this.installCapacitorPlugins();
            await (0, utils_fs_1.mkdirp)(details.root);
            await this.e.shell.run('capacitor', ['init', name, packageId, ...options], { cwd: details.root });
        }
        await super.add(details);
    }
    getCapacitorConfigJsonPath() {
        return path.resolve(this.root, 'capacitor.config.json');
    }
    async installCapacitorCore() {
        const [manager, ...managerArgs] = await (0, npm_1.pkgManagerArgs)(this.e.config.get('npmClient'), { command: 'install', pkg: '@capacitor/core@latest' });
        await this.e.shell.run(manager, managerArgs, { cwd: this.root });
    }
    async installCapacitorCLI() {
        const [manager, ...managerArgs] = await (0, npm_1.pkgManagerArgs)(this.e.config.get('npmClient'), { command: 'install', pkg: '@capacitor/cli@latest', saveDev: true });
        await this.e.shell.run(manager, managerArgs, { cwd: this.root });
    }
    async installCapacitorPlugins() {
        const [manager, ...managerArgs] = await (0, npm_1.pkgManagerArgs)(this.e.config.get('npmClient'), { command: 'install', pkg: ['@capacitor/haptics', '@capacitor/app', '@capacitor/keyboard', '@capacitor/status-bar'] });
        await this.e.shell.run(manager, managerArgs, { cwd: this.root });
    }
    async personalize({ name, packageId }) {
        const confPath = this.getCapacitorConfigJsonPath();
        if (await (0, utils_fs_1.pathExists)(confPath)) {
            const conf = new config_1.CapacitorJSONConfig(confPath);
            conf.set('appName', name);
            if (packageId) {
                conf.set('appId', packageId);
            }
        }
    }
    async getInfo() {
        const conf = await this.getCapacitorConfig();
        const bundleId = conf?.appId;
        const [[capacitorCorePkg, capacitorCorePkgPath], capacitorCLIVersion, [capacitorIOSPkg, capacitorIOSPkgPath], [capacitorAndroidPkg, capacitorAndroidPkgPath],] = await (Promise.all([
            this.e.project.getPackageJson('@capacitor/core'),
            this.getCapacitorCLIVersion(),
            this.e.project.getPackageJson('@capacitor/ios'),
            this.e.project.getPackageJson('@capacitor/android'),
        ]));
        const info = [
            {
                group: 'capacitor',
                name: 'Capacitor CLI',
                key: 'capacitor_cli_version',
                value: capacitorCLIVersion || 'not installed',
            },
            {
                group: 'capacitor',
                name: '@capacitor/core',
                key: 'capacitor_core_version',
                value: capacitorCorePkg ? capacitorCorePkg.version : 'not installed',
                path: capacitorCorePkgPath,
            },
            {
                group: 'capacitor',
                name: '@capacitor/ios',
                key: 'capacitor_ios_version',
                value: capacitorIOSPkg ? capacitorIOSPkg.version : 'not installed',
                path: capacitorIOSPkgPath,
            },
            {
                group: 'capacitor',
                name: '@capacitor/android',
                key: 'capacitor_android_version',
                value: capacitorAndroidPkg ? capacitorAndroidPkg.version : 'not installed',
                path: capacitorAndroidPkgPath,
            },
            {
                group: 'capacitor',
                name: 'Bundle ID',
                key: 'bundle_id',
                value: bundleId || 'unknown',
                hidden: true,
            },
        ];
        return info;
    }
}
exports.Integration = Integration;
