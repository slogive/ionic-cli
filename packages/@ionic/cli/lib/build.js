"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BunBuildCLI = exports.YarnBuildCLI = exports.PnpmBuildCLI = exports.NpmBuildCLI = exports.BuildCLI = exports.BuildRunner = exports.COMMON_BUILD_COMMAND_OPTIONS = exports.BUILD_SCRIPT = void 0;
const cli_framework_1 = require("@ionic/cli-framework");
const utils_process_1 = require("@ionic/utils-process");
const utils_subprocess_1 = require("@ionic/utils-subprocess");
const debug_1 = require("debug");
const color_1 = require("./color");
const errors_1 = require("./errors");
const hooks_1 = require("./hooks");
const debug = (0, debug_1.debug)('ionic:lib:build');
exports.BUILD_SCRIPT = 'ionic:build';
exports.COMMON_BUILD_COMMAND_OPTIONS = [
    {
        name: 'engine',
        summary: `Target engine (e.g. ${['browser', 'cordova'].map(e => (0, color_1.input)(e)).join(', ')})`,
        groups: ["advanced" /* MetadataGroup.ADVANCED */],
    },
    {
        name: 'platform',
        summary: `Target platform on chosen engine (e.g. ${['ios', 'android'].map(e => (0, color_1.input)(e)).join(', ')})`,
        groups: ["advanced" /* MetadataGroup.ADVANCED */],
    },
];
class BuildRunner {
    getPkgManagerBuildCLI() {
        const pkgManagerCLIs = {
            npm: NpmBuildCLI,
            pnpm: PnpmBuildCLI,
            yarn: YarnBuildCLI,
            bun: BunBuildCLI,
        };
        const client = this.e.config.get('npmClient');
        const CLI = pkgManagerCLIs[client];
        if (CLI) {
            return new CLI(this.e);
        }
        throw new errors_1.BuildCLIProgramNotFoundException('Unknown CLI client: ' + client);
    }
    createBaseOptionsFromCommandLine(inputs, options) {
        const separatedArgs = options['--'];
        const [platform] = options['platform'] ? [String(options['platform'])] : inputs;
        const engine = this.determineEngineFromCommandLine(options);
        const project = options['project'] ? String(options['project']) : undefined;
        const verbose = !!options['verbose'];
        return { '--': separatedArgs ? separatedArgs : [], engine, platform, project, verbose };
    }
    determineEngineFromCommandLine(options) {
        if (options['engine']) {
            return String(options['engine']);
        }
        if (options['cordova']) {
            return 'cordova';
        }
        return 'browser';
    }
    async beforeBuild(options) {
        const hook = new BuildBeforeHook(this.e);
        try {
            await hook.run({ name: hook.name, build: options });
        }
        catch (e) {
            if (e instanceof cli_framework_1.BaseError) {
                throw new errors_1.FatalException(e.message);
            }
            throw e;
        }
    }
    async run(options) {
        debug('build options: %O', options);
        if (options.engine === 'cordova' && !options.platform) {
            this.e.log.warn(`Cordova engine chosen without a target platform. This could cause issues. Please use the ${(0, color_1.input)('--platform')} option.`);
        }
        await this.beforeBuild(options);
        await this.buildProject(options);
        await this.afterBuild(options);
    }
    async afterBuild(options) {
        const hook = new BuildAfterHook(this.e);
        try {
            await hook.run({ name: hook.name, build: options });
        }
        catch (e) {
            if (e instanceof cli_framework_1.BaseError) {
                throw new errors_1.FatalException(e.message);
            }
            throw e;
        }
    }
}
exports.BuildRunner = BuildRunner;
class BuildCLI {
    constructor(e) {
        this.e = e;
        /**
         * If true, the Build CLI will not prompt to be installed.
         */
        this.global = false;
    }
    get resolvedProgram() {
        if (this._resolvedProgram) {
            return this._resolvedProgram;
        }
        return this.program;
    }
    /**
     * Build the environment variables for this Build CLI. Called by `this.run()`.
     */
    async buildEnvVars(options) {
        return process.env;
    }
    async resolveScript() {
        if (typeof this.script === 'undefined') {
            return;
        }
        const pkg = await this.e.project.requirePackageJson();
        return pkg.scripts && pkg.scripts[this.script];
    }
    async build(options) {
        this._resolvedProgram = await this.resolveProgram();
        await this.runWrapper(options);
    }
    async runWrapper(options) {
        try {
            return await this.run(options);
        }
        catch (e) {
            if (!(e instanceof errors_1.BuildCLIProgramNotFoundException)) {
                throw e;
            }
            if (this.global) {
                this.e.log.nl();
                throw new errors_1.FatalException(`${(0, color_1.input)(this.pkg)} is required for this command to work properly.`);
            }
            this.e.log.nl();
            this.e.log.info(`Looks like ${(0, color_1.input)(this.pkg)} isn't installed in this project.\n` +
                `This package is required for this command to work properly.`);
            const installed = await this.promptToInstall();
            if (!installed) {
                this.e.log.nl();
                throw new errors_1.FatalException(`${(0, color_1.input)(this.pkg)} is required for this command to work properly.`);
            }
            return this.run(options);
        }
    }
    async run(options) {
        const args = await this.buildArgs(options);
        const env = await this.buildEnvVars(options);
        try {
            await this.e.shell.run(this.resolvedProgram, args, { stdio: 'inherit', cwd: this.e.project.directory, fatalOnNotFound: false, env: (0, utils_process_1.createProcessEnv)(env) });
        }
        catch (e) {
            if (e instanceof utils_subprocess_1.SubprocessError && e.code === utils_subprocess_1.ERROR_COMMAND_NOT_FOUND) {
                throw new errors_1.BuildCLIProgramNotFoundException(`${(0, color_1.strong)(this.resolvedProgram)} command not found.`);
            }
            throw e;
        }
    }
    async resolveProgram() {
        if (typeof this.script !== 'undefined') {
            debug(`Looking for ${(0, color_1.ancillary)(this.script)} npm script.`);
            if (await this.resolveScript()) {
                debug(`Using ${(0, color_1.ancillary)(this.script)} npm script.`);
                return this.e.config.get('npmClient');
            }
        }
        return this.program;
    }
    async promptToInstall() {
        const { pkgManagerArgs } = await Promise.resolve().then(() => __importStar(require('./utils/npm')));
        const [manager, ...managerArgs] = await pkgManagerArgs(this.e.config.get('npmClient'), { command: 'install', pkg: this.pkg, saveDev: true, saveExact: true });
        this.e.log.nl();
        const confirm = await this.e.prompt({
            name: 'confirm',
            message: `Install ${(0, color_1.input)(this.pkg)}?`,
            type: 'confirm',
        });
        if (!confirm) {
            this.e.log.warn(`Not installing--here's how to install manually: ${(0, color_1.input)(`${manager} ${managerArgs.join(' ')}`)}`);
            return false;
        }
        await this.e.shell.run(manager, managerArgs, { cwd: this.e.project.directory });
        return true;
    }
}
exports.BuildCLI = BuildCLI;
class PkgManagerBuildCLI extends BuildCLI {
    constructor() {
        super(...arguments);
        this.global = true;
        this.script = exports.BUILD_SCRIPT;
    }
    async resolveProgram() {
        return this.program;
    }
    async buildArgs(options) {
        const { pkgManagerArgs } = await Promise.resolve().then(() => __importStar(require('./utils/npm')));
        const [, ...pkgArgs] = await pkgManagerArgs(this.program, { command: 'run', script: this.script, scriptArgs: [...options['--'] || []] });
        return pkgArgs;
    }
}
class NpmBuildCLI extends PkgManagerBuildCLI {
    constructor() {
        super(...arguments);
        this.name = 'npm CLI';
        this.pkg = 'npm';
        this.program = 'npm';
    }
}
exports.NpmBuildCLI = NpmBuildCLI;
class PnpmBuildCLI extends PkgManagerBuildCLI {
    constructor() {
        super(...arguments);
        this.name = 'pnpm CLI';
        this.pkg = 'pnpm';
        this.program = 'pnpm';
    }
}
exports.PnpmBuildCLI = PnpmBuildCLI;
class YarnBuildCLI extends PkgManagerBuildCLI {
    constructor() {
        super(...arguments);
        this.name = 'Yarn';
        this.pkg = 'yarn';
        this.program = 'yarn';
    }
}
exports.YarnBuildCLI = YarnBuildCLI;
class BunBuildCLI extends PkgManagerBuildCLI {
    constructor() {
        super(...arguments);
        this.name = 'Bun';
        this.pkg = 'bun';
        this.program = 'bun';
    }
}
exports.BunBuildCLI = BunBuildCLI;
class BuildBeforeHook extends hooks_1.Hook {
    constructor() {
        super(...arguments);
        this.name = 'build:before';
    }
}
class BuildAfterHook extends hooks_1.Hook {
    constructor() {
        super(...arguments);
        this.name = 'build:after';
    }
}
