"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapacitorCommand = void 0;
const tslib_1 = require("tslib");
const utils_fs_1 = require("@ionic/utils-fs");
const utils_process_1 = require("@ionic/utils-process");
const utils_subprocess_1 = require("@ionic/utils-subprocess");
const lodash = tslib_1.__importStar(require("lodash"));
const path = tslib_1.__importStar(require("path"));
const semver = tslib_1.__importStar(require("semver"));
const color_1 = require("../../lib/color");
const command_1 = require("../../lib/command");
const errors_1 = require("../../lib/errors");
const executor_1 = require("../../lib/executor");
const android_1 = require("../../lib/integrations/capacitor/android");
const config_1 = require("../../lib/integrations/capacitor/config");
const ios_1 = require("../../lib/integrations/capacitor/ios");
const utils_1 = require("../../lib/integrations/capacitor/utils");
const logger_1 = require("../../lib/utils/logger");
const npm_1 = require("../../lib/utils/npm");
class CapacitorCommand extends command_1.Command {
    constructor() {
        super(...arguments);
        this.getCapacitorIntegration = lodash.memoize(async () => {
            if (!this.project) {
                throw new errors_1.FatalException(`Cannot use Capacitor outside a project directory.`);
            }
            return this.project.createIntegration('capacitor');
        });
        this.getCapacitorVersion = lodash.memoize(async () => {
            try {
                const proc = await this.env.shell.createSubprocess('capacitor', ['--version'], { cwd: this.integration.root });
                const version = semver.parse((await proc.output()).trim());
                if (!version) {
                    throw new errors_1.FatalException('Error while parsing Capacitor CLI version.');
                }
                return version;
            }
            catch (e) {
                if (e instanceof utils_subprocess_1.SubprocessError) {
                    if (e.code === utils_subprocess_1.ERROR_COMMAND_NOT_FOUND) {
                        throw new errors_1.FatalException('Error while getting Capacitor CLI version. Is Capacitor installed?');
                    }
                    throw new errors_1.FatalException('Error while getting Capacitor CLI version.\n' + (e.output ? e.output : e.code));
                }
                throw e;
            }
        });
    }
    get integration() {
        if (!this.project) {
            throw new errors_1.FatalException(`Cannot use Capacitor outside a project directory.`);
        }
        if (!this._integration) {
            this._integration = this.project.requireIntegration('capacitor');
        }
        return this._integration;
    }
    async getGeneratedConfig(platform) {
        if (!this.project) {
            throw new errors_1.FatalException(`Cannot use Capacitor outside a project directory.`);
        }
        const p = await this.getGeneratedConfigPath(platform);
        return new config_1.CapacitorJSONConfig(p);
    }
    async getGeneratedConfigPath(platform) {
        if (!this.project) {
            throw new errors_1.FatalException(`Cannot use Capacitor outside a project directory.`);
        }
        const p = await this.getGeneratedConfigDir(platform);
        return path.resolve(this.integration.root, p, config_1.CAPACITOR_CONFIG_JSON_FILE);
    }
    async getAndroidManifest() {
        const p = await this.getAndroidManifestPath();
        return android_1.CapacitorAndroidManifest.load(p);
    }
    async getAndroidManifestPath() {
        const cli = await this.getCapacitorCLIConfig();
        const srcDir = cli?.android.srcMainDirAbs ?? 'android/app/src/main';
        return path.resolve(this.integration.root, srcDir, android_1.ANDROID_MANIFEST_FILE);
    }
    async getiOSAppInfo() {
        const p = await this.getiOSAppInfoPath();
        return ios_1.CapacitorIosInfo.load(p);
    }
    async getiOSAppInfoPath() {
        const cli = await this.getCapacitorCLIConfig();
        const srcDir = cli?.ios.nativeTargetDirAbs ?? 'ios/App/App';
        return path.resolve(this.integration.root, srcDir, ios_1.IOS_INFO_FILE);
    }
    async getGeneratedConfigDir(platform) {
        const cli = await this.getCapacitorCLIConfig();
        switch (platform) {
            case 'android':
                return cli?.android.assetsDirAbs ?? 'android/app/src/main/assets';
            case 'ios':
                return cli?.ios.nativeTargetDirAbs ?? 'ios/App/App';
        }
        throw new errors_1.FatalException(`Could not determine generated Capacitor config path for ${(0, color_1.input)(platform)} platform.`);
    }
    async getCapacitorCLIConfig() {
        const capacitor = await this.getCapacitorIntegration();
        return capacitor.getCapacitorCLIConfig();
    }
    async getCapacitorConfig() {
        const capacitor = await this.getCapacitorIntegration();
        return capacitor.getCapacitorConfig();
    }
    isCorePlatform(platform) {
        const platforms = ['android', 'ios'];
        return platforms.includes(platform);
    }
    async getInstalledPlatforms() {
        const cli = await this.getCapacitorCLIConfig();
        const androidPlatformDirAbs = cli?.android.platformDirAbs ?? path.resolve(this.integration.root, 'android');
        const iosPlatformDirAbs = cli?.ios.platformDirAbs ?? path.resolve(this.integration.root, 'ios');
        const platforms = [];
        if (await (0, utils_fs_1.pathExists)(androidPlatformDirAbs)) {
            platforms.push('android');
        }
        if (await (0, utils_fs_1.pathExists)(iosPlatformDirAbs)) {
            platforms.push('ios');
        }
        if (await (0, utils_fs_1.pathExists)(path.resolve(this.integration.root, 'electron'))) {
            platforms.push('electron');
        }
        return platforms;
    }
    async isPlatformInstalled(platform) {
        const platforms = await this.getInstalledPlatforms();
        return platforms.includes(platform);
    }
    async checkCapacitor(runinfo) {
        if (!this.project) {
            throw new errors_1.FatalException(`Cannot use Capacitor outside a project directory.`);
        }
        const capacitor = this.project.getIntegration('capacitor');
        if (!capacitor) {
            await (0, executor_1.runCommand)(runinfo, ['integrations', 'enable', 'capacitor']);
        }
    }
    async preRunChecks(runinfo) {
        await this.checkCapacitor(runinfo);
    }
    async runCapacitor(argList) {
        if (!this.project) {
            throw new errors_1.FatalException(`Cannot use Capacitor outside a project directory.`);
        }
        const stream = (0, logger_1.createPrefixedWriteStream)(this.env.log, (0, color_1.weak)(`[capacitor]`));
        await this.env.shell.run('capacitor', argList, { stream, fatalOnNotFound: false, truncateErrorOutput: 5000, cwd: this.integration.root });
    }
    async runBuild(inputs, options) {
        if (!this.project) {
            throw new errors_1.FatalException(`Cannot use Capacitor outside a project directory.`);
        }
        const conf = await this.getCapacitorConfig();
        if (conf?.server?.url) {
            this.env.log.warn(`Capacitor server URL is in use.\n` +
                `This may result in unexpected behavior for this build, where an external server is used in the Web View instead of your app. This likely occurred because of ${(0, color_1.input)('--livereload')} usage in the past and the CLI improperly exiting without cleaning up.\n\n` +
                `Delete the ${(0, color_1.input)('server')} key in the Capacitor config file if you did not intend to use an external server.`);
            this.env.log.nl();
        }
        if (options['build']) {
            try {
                const runner = await this.project.requireBuildRunner();
                const runnerOpts = runner.createOptionsFromCommandLine(inputs, (0, utils_1.generateOptionsForCapacitorBuild)(inputs, options));
                await runner.run(runnerOpts);
            }
            catch (e) {
                if (e instanceof errors_1.RunnerException) {
                    throw new errors_1.FatalException(e.message);
                }
                throw e;
            }
        }
    }
    async runServe(inputs, options) {
        if (!this.project) {
            throw new errors_1.FatalException(`Cannot run ${(0, color_1.input)('ionic capacitor run')} outside a project directory.`);
        }
        const [platform] = inputs;
        try {
            const runner = await this.project.requireServeRunner();
            const runnerOpts = runner.createOptionsFromCommandLine(inputs, (0, utils_1.generateOptionsForCapacitorBuild)(inputs, options));
            let serverUrl = options['livereload-url'] ? String(options['livereload-url']) : undefined;
            if (!serverUrl) {
                const details = await runner.run(runnerOpts);
                serverUrl = `${details.protocol || 'http'}://${details.externalAddress}:${details.port}`;
            }
            const conf = await this.getGeneratedConfig(platform);
            (0, utils_process_1.onBeforeExit)(async () => {
                conf.resetServerUrl();
            });
            conf.setServerUrl(serverUrl);
            if (platform === 'android') {
                const manifest = await this.getAndroidManifest();
                (0, utils_process_1.onBeforeExit)(async () => {
                    await manifest.reset();
                });
                manifest.enableCleartextTraffic();
                await manifest.save();
            }
            if (platform === 'ios' && !options['external']) {
                const appInfo = await this.getiOSAppInfo();
                (0, utils_process_1.onBeforeExit)(async () => {
                    await appInfo.reset();
                });
                appInfo.disableAppTransportSecurity();
                await appInfo.save();
            }
        }
        catch (e) {
            if (e instanceof errors_1.RunnerException) {
                throw new errors_1.FatalException(e.message);
            }
            throw e;
        }
    }
    async checkForPlatformInstallation(platform) {
        if (!this.project) {
            throw new errors_1.FatalException('Cannot use Capacitor outside a project directory.');
        }
        if (platform) {
            const capacitor = this.project.getIntegration('capacitor');
            if (!capacitor) {
                throw new errors_1.FatalException('Cannot check platform installations--Capacitor not yet integrated.');
            }
            if (!(await this.isPlatformInstalled(platform))) {
                await this.installPlatform(platform);
            }
        }
    }
    async installPlatform(platform) {
        const version = await this.getCapacitorVersion();
        const installedPlatforms = await this.getInstalledPlatforms();
        if (installedPlatforms.includes(platform)) {
            throw new errors_1.FatalException(`The ${(0, color_1.input)(platform)} platform is already installed!`);
        }
        if (semver.gte(version, '3.0.0-alpha.1')) {
            if (this.isCorePlatform(platform)) {
                const [manager, ...managerArgs] = await (0, npm_1.pkgManagerArgs)(this.env.config.get('npmClient'), { command: 'install', pkg: `@capacitor/${platform}@${version}`, saveDev: false });
                await this.env.shell.run(manager, managerArgs, { cwd: this.integration.root });
            }
        }
        await this.runCapacitor(['add', platform]);
    }
    async createOptionsFromCommandLine(inputs, options) {
        const separatedArgs = options['--'];
        const verbose = !!options['verbose'];
        const conf = await this.getCapacitorConfig();
        return {
            '--': separatedArgs ? separatedArgs : [],
            verbose,
            ...conf,
        };
    }
}
exports.CapacitorCommand = CapacitorCommand;
