"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSDKVersion = exports.locateSDKHome = exports.getAndroidSdkToolsVersion = void 0;
const tslib_1 = require("tslib");
const utils_fs_1 = require("@ionic/utils-fs");
const path = tslib_1.__importStar(require("path"));
async function getAndroidSdkToolsVersion() {
    const androidHome = await locateSDKHome();
    if (androidHome) {
        try {
            const f = await (0, utils_fs_1.readFile)(path.join(androidHome, 'tools', 'source.properties'), { encoding: 'utf8' });
            return `${await parseSDKVersion(f)} (${androidHome})`;
        }
        catch (e) {
            if (e.code !== 'ENOENT') {
                throw e;
            }
        }
    }
}
exports.getAndroidSdkToolsVersion = getAndroidSdkToolsVersion;
async function locateSDKHome() {
    return process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
}
exports.locateSDKHome = locateSDKHome;
async function parseSDKVersion(contents) {
    for (const l of contents.split('\n')) {
        const [a, b] = l.split('=');
        if (a === 'Pkg.Revision') {
            return b;
        }
    }
}
exports.parseSDKVersion = parseSDKVersion;
