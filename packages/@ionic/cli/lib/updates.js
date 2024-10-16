"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runUpdateNotify = exports.runNotify = exports.IONIC_CLOUD_CLI_MIGRATION = exports.runUpdateCheck = exports.getUpdateConfig = exports.writeUpdateConfig = exports.readUpdateConfig = void 0;
const tslib_1 = require("tslib");
const utils_fs_1 = require("@ionic/utils-fs");
const utils_terminal_1 = require("@ionic/utils-terminal");
const path = tslib_1.__importStar(require("path"));
const semver = tslib_1.__importStar(require("semver"));
const color_1 = require("./color");
const helper_1 = require("./helper");
const npm_1 = require("./utils/npm");
const UPDATE_CONFIG_FILE = 'update.json';
const UPDATE_CHECK_INTERVAL = 60 * 60 * 24 * 1000; // 1 day
const UPDATE_NOTIFY_INTERVAL = 60 * 60 * 12 * 1000; // 12 hours
const PACKAGES = ['@ionic/cli', 'native-run', 'cordova-res'];
async function readUpdateConfig(dir) {
    return (0, utils_fs_1.readJson)(path.resolve(dir, UPDATE_CONFIG_FILE));
}
exports.readUpdateConfig = readUpdateConfig;
async function writeUpdateConfig(dir, config) {
    await (0, utils_fs_1.writeJson)(path.resolve(dir, UPDATE_CONFIG_FILE), config, { spaces: 2 });
}
exports.writeUpdateConfig = writeUpdateConfig;
async function getUpdateConfig({ config }) {
    const dir = path.dirname(config.p);
    try {
        return await readUpdateConfig(dir);
    }
    catch (e) {
        if (e.code !== 'ENOENT') {
            process.stderr.write(`${e.stack ? e.stack : e}\n`);
        }
        return { packages: [] };
    }
}
exports.getUpdateConfig = getUpdateConfig;
async function runUpdateCheck({ config }) {
    const dir = path.dirname(config.p);
    const pkgs = (await Promise.all(PACKAGES.map(pkg => (0, npm_1.pkgFromRegistry)(config.get('npmClient'), { pkg }))))
        .filter((pkg) => typeof pkg !== 'undefined');
    const updateConfig = await getUpdateConfig({ config });
    const newUpdateConfig = {
        ...updateConfig,
        lastUpdate: new Date().toISOString(),
        packages: pkgs.map(pkg => ({
            name: pkg.name,
            version: pkg.version,
        })),
    };
    await writeUpdateConfig(dir, newUpdateConfig);
}
exports.runUpdateCheck = runUpdateCheck;
exports.IONIC_CLOUD_CLI_MIGRATION = (() => `${(0, color_1.strong)((0, color_1.WARN)('Deprecated: Ionic Appflow functionality has moved to the new Ionic Cloud CLI'))}.\n` +
    `Existing functionality in the Ionic CLI is deprecated as of ${(0, color_1.WARN)('v6.18.0')}. ` +
    `This functionality will be removed from the Ionic CLI in the next major version. ` +
    `Please visit our simple guide to migrate to the Ionic Cloud CLI, available now.\n` +
    `${(0, color_1.strong)('https://ionic.io/docs/appflow/cli/migration/')}\n`)();
async function runNotify(env, pkg, latestVersion) {
    const dir = path.dirname(env.config.p);
    const args = await (0, npm_1.pkgManagerArgs)(env.config.get('npmClient'), { command: 'install', pkg: pkg.name, global: true });
    const lines = [
        `Ionic CLI update available: ${(0, color_1.weak)(pkg.version)} → ${(0, color_1.success)(latestVersion)}`,
        `Run ${(0, color_1.input)(args.join(' '))} to update`,
    ];
    // TODO: Pull this into utils/format
    const padding = 3;
    const longestLineLength = Math.max(...lines.map(line => (0, utils_terminal_1.stringWidth)(line)));
    const horizontalRule = `  ${'─'.repeat(longestLineLength + padding * 2)}`;
    const output = (`\n${horizontalRule}\n\n` +
        `${lines.map(line => `  ${' '.repeat((longestLineLength - (0, utils_terminal_1.stringWidth)(line)) / 2 + padding)}${line}`).join('\n')}\n\n` +
        `${horizontalRule}\n\n`);
    process.stderr.write(output);
    const updateConfig = await getUpdateConfig(env);
    updateConfig.lastNotify = new Date().toISOString();
    await writeUpdateConfig(dir, updateConfig);
}
exports.runNotify = runNotify;
async function runUpdateNotify(env, pkg) {
    const { name, version } = pkg;
    const { lastUpdate, lastNotify, packages } = await getUpdateConfig(env);
    const latestPkg = packages.find(pkg => pkg.name === name);
    const latestVersion = latestPkg ? latestPkg.version : undefined;
    if ((!lastNotify || new Date(lastNotify).getTime() + UPDATE_NOTIFY_INTERVAL < new Date().getTime()) && latestVersion && semver.gt(latestVersion, version)) {
        await runNotify(env, pkg, latestVersion);
    }
    if (!lastUpdate || new Date(lastUpdate).getTime() + UPDATE_CHECK_INTERVAL < new Date().getTime()) {
        await (0, helper_1.sendMessage)(env, { type: 'update-check' });
    }
}
exports.runUpdateNotify = runUpdateNotify;
