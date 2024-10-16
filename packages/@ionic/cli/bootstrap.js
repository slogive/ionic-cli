"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectLocalCLI = exports.ERROR_VERSION_TOO_OLD = exports.ERROR_LOCAL_CLI_NOT_FOUND = exports.ERROR_BASE_DIRECTORY_NOT_FOUND = void 0;
const tslib_1 = require("tslib");
const node_1 = require("@ionic/cli-framework/utils/node");
const debug_1 = require("debug");
const path = tslib_1.__importStar(require("path"));
const semver = tslib_1.__importStar(require("semver"));
const color_1 = require("./lib/color");
const debug = (0, debug_1.debug)('ionic:bootstrap');
exports.ERROR_BASE_DIRECTORY_NOT_FOUND = 'BASE_DIRECTORY_NOT_FOUND';
exports.ERROR_LOCAL_CLI_NOT_FOUND = 'LOCAL_CLI_NOT_FOUND';
exports.ERROR_VERSION_TOO_OLD = 'VERSION_TOO_OLD';
async function detectLocalCLI() {
    let pkgPath;
    try {
        pkgPath = require.resolve('ionic/package', { paths: (0, node_1.compileNodeModulesPaths)(process.cwd()) });
    }
    catch (e) {
        // ignore
    }
    if (pkgPath && process.env.IONIC_CLI_LIB !== path.dirname(pkgPath)) {
        const pkg = await (0, node_1.readPackageJsonFile)(pkgPath);
        debug(`local CLI ${(0, color_1.strong)(pkg.version)} found at ${(0, color_1.strong)(pkgPath)}`);
        if (semver.lt(pkg.version, '4.0.0')) {
            throw exports.ERROR_VERSION_TOO_OLD;
        }
        return path.dirname(pkgPath);
    }
    throw exports.ERROR_LOCAL_CLI_NOT_FOUND;
}
exports.detectLocalCLI = detectLocalCLI;
