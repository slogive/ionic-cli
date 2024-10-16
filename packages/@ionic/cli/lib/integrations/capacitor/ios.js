"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapacitorIosInfo = exports.IOS_INFO_FILE = void 0;
const tslib_1 = require("tslib");
const utils_fs_1 = require("@ionic/utils-fs");
const et = tslib_1.__importStar(require("elementtree"));
exports.IOS_INFO_FILE = "Info.plist";
class CapacitorIosInfo {
    constructor(plistPath) {
        this.plistPath = plistPath;
        this.saving = false;
    }
    get origPlistPath() {
        return `${this.plistPath}.orig`;
    }
    get doc() {
        if (!this._doc) {
            throw new Error("No doc loaded.");
        }
        return this._doc;
    }
    static async load(plistPath) {
        if (!plistPath) {
            throw new Error(`Must supply file path for ${exports.IOS_INFO_FILE}.`);
        }
        const conf = new CapacitorIosInfo(plistPath);
        await conf.reload();
        return conf;
    }
    disableAppTransportSecurity() {
        const rootDict = this.getDictRoot();
        let valueDict = this.getValueForKey(rootDict, "NSAppTransportSecurity");
        if (valueDict) {
            const value = this.getValueForKey(valueDict, "NSAllowsArbitraryLoads");
            if (value) {
                value.tag = "true";
            }
            else {
                et.SubElement(valueDict, "true");
            }
        }
        else {
            const newKey = et.SubElement(rootDict, "key");
            newKey.text = "NSAppTransportSecurity";
            const newDict = et.SubElement(rootDict, "dict");
            const newDictKey = et.SubElement(newDict, "key");
            newDictKey.text = "NSAllowsArbitraryLoads";
            et.SubElement(newDict, "true");
        }
    }
    getValueForKey(root, key) {
        const children = root.getchildren();
        let keyFound = false;
        for (const element of children) {
            if (keyFound) {
                keyFound = false;
                return element;
            }
            if ((element.tag === 'key') && element.text === key) {
                keyFound = true;
            }
        }
        return null;
    }
    getDictRoot() {
        const root = this.doc.getroot();
        if (root.tag !== "plist") {
            throw new Error(`Info.plist is not a valid plist file because the root is not a <plist> tag`);
        }
        const rootDict = root.find('./dict');
        if (!rootDict) {
            throw new Error(`Info.plist is not a valid plist file because the first child is not a <dict> tag`);
        }
        return rootDict;
    }
    async reset() {
        const origInfoPlistContent = await (0, utils_fs_1.readFile)(this.origPlistPath, {
            encoding: "utf8",
        });
        if (!this.saving) {
            this.saving = true;
            await (0, utils_fs_1.writeFile)(this.plistPath, origInfoPlistContent, {
                encoding: "utf8",
            });
            await (0, utils_fs_1.unlink)(this.origPlistPath);
            this.saving = false;
        }
    }
    async save() {
        if (!this.saving) {
            this.saving = true;
            if (this.origInfoPlistContent) {
                await (0, utils_fs_1.writeFile)(this.origPlistPath, this.origInfoPlistContent, {
                    encoding: "utf8",
                });
                this.origInfoPlistContent = undefined;
            }
            await (0, utils_fs_1.writeFile)(this.plistPath, this.write(), { encoding: "utf8" });
            this.saving = false;
        }
    }
    async reload() {
        this.origInfoPlistContent = await (0, utils_fs_1.readFile)(this.plistPath, {
            encoding: "utf8",
        });
        try {
            this._doc = et.parse(this.origInfoPlistContent);
        }
        catch (e) {
            throw new Error(`Cannot parse ${exports.IOS_INFO_FILE} file: ${e.stack ?? e}`);
        }
    }
    write() {
        const contents = this.doc.write({ indent: 4 });
        return contents;
    }
}
exports.CapacitorIosInfo = CapacitorIosInfo;
