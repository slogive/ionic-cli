"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveBin = exports.compileNodeModulesPaths = exports.readPackageJsonFile = exports.isValidPackageName = exports.ERROR_BIN_NOT_FOUND = exports.ERROR_INVALID_PACKAGE_JSON = void 0;
const tslib_1 = require("tslib");
const utils_fs_1 = require("@ionic/utils-fs");
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const guards_1 = require("../guards");
exports.ERROR_INVALID_PACKAGE_JSON = 'INVALID_PACKAGE_JSON';
exports.ERROR_BIN_NOT_FOUND = 'BIN_NOT_FOUND';
/**
 * Lightweight version of https://github.com/npm/validate-npm-package-name
 */
function isValidPackageName(name) {
    return encodeURIComponent(name) === name;
}
exports.isValidPackageName = isValidPackageName;
async function readPackageJsonFile(p) {
    const packageJson = await (0, utils_fs_1.readJson)(p);
    if (!(0, guards_1.isPackageJson)(packageJson)) {
        throw exports.ERROR_INVALID_PACKAGE_JSON;
    }
    return packageJson;
}
exports.readPackageJsonFile = readPackageJsonFile;
function compileNodeModulesPaths(filePath) {
    return (0, utils_fs_1.compilePaths)(filePath).map(f => path.join(f, 'node_modules'));
}
exports.compileNodeModulesPaths = compileNodeModulesPaths;
function resolveBin(m, bin, options) {
    const packageJsonPath = require.resolve(`${m}/package`, options);
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, { encoding: 'utf8' }));
    if (!(0, guards_1.isPackageJson)(packageJson) || !packageJson.bin) {
        throw exports.ERROR_INVALID_PACKAGE_JSON;
    }
    const desiredBin = packageJson.bin[bin];
    if (!desiredBin) {
        throw exports.ERROR_BIN_NOT_FOUND;
    }
    return path.resolve(path.dirname(packageJsonPath), desiredBin);
}
exports.resolveBin = resolveBin;
