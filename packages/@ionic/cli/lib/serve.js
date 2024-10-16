"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BunServeCLI = exports.YarnServeCLI = exports.PnpmServeCLI = exports.NpmServeCLI = exports.ServeCLI = exports.ServeRunner = exports.COMMON_SERVE_COMMAND_OPTIONS = exports.SERVE_SCRIPT = exports.BROWSERS = exports.LOCAL_ADDRESSES = exports.BIND_ALL_ADDRESS = exports.DEFAULT_ADDRESS = exports.DEFAULT_DEVAPP_COMM_PORT = exports.DEFAULT_SERVER_PORT = exports.DEFAULT_LIVERELOAD_PORT = exports.DEFAULT_DEV_LOGGER_PORT = void 0;
const tslib_1 = require("tslib");
const cli_framework_1 = require("@ionic/cli-framework");
const cli_framework_output_1 = require("@ionic/cli-framework-output");
const string_1 = require("@ionic/cli-framework/utils/string");
const utils_network_1 = require("@ionic/utils-network");
const utils_process_1 = require("@ionic/utils-process");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const debug_1 = require("debug");
const events_1 = require("events");
const lodash = tslib_1.__importStar(require("lodash"));
const split2_1 = tslib_1.__importDefault(require("split2"));
const stream = tslib_1.__importStar(require("stream"));
const color_1 = require("./color");
const errors_1 = require("./errors");
const events_2 = require("./events");
const hooks_1 = require("./hooks");
const open_1 = require("./open");
const logger_1 = require("./utils/logger");
const debug = (0, debug_1.debug)('ionic:lib:serve');
exports.DEFAULT_DEV_LOGGER_PORT = 53703;
exports.DEFAULT_LIVERELOAD_PORT = 35729;
exports.DEFAULT_SERVER_PORT = 8100;
exports.DEFAULT_DEVAPP_COMM_PORT = 53233;
exports.DEFAULT_ADDRESS = 'localhost';
exports.BIND_ALL_ADDRESS = '0.0.0.0';
exports.LOCAL_ADDRESSES = ['localhost', '127.0.0.1'];
exports.BROWSERS = ['safari', 'firefox', process.platform === 'win32' ? 'chrome' : (process.platform === 'darwin' ? 'google chrome' : 'google-chrome')];
// npm script name
exports.SERVE_SCRIPT = 'ionic:serve';
exports.COMMON_SERVE_COMMAND_OPTIONS = [
    {
        name: 'external',
        summary: `Host dev server on all network interfaces (i.e. ${(0, color_1.input)('--host=0.0.0.0')})`,
        type: Boolean,
    },
    {
        name: 'address',
        summary: '',
        groups: ["hidden" /* MetadataGroup.HIDDEN */],
    },
    {
        name: 'host',
        summary: 'Use specific host for the dev server',
        default: exports.DEFAULT_ADDRESS,
        groups: ["advanced" /* MetadataGroup.ADVANCED */],
    },
    {
        name: 'port',
        summary: 'Use specific port for the dev server',
        default: exports.DEFAULT_SERVER_PORT.toString(),
        aliases: ['p'],
        groups: ["advanced" /* MetadataGroup.ADVANCED */],
    },
    {
        name: 'public-host',
        summary: 'The host used for the browser or web view',
        groups: ["advanced" /* MetadataGroup.ADVANCED */],
        spec: { value: 'host' },
    },
    {
        name: 'livereload',
        summary: 'Do not spin up dev server--just serve files',
        type: Boolean,
        default: true,
    },
    {
        name: 'engine',
        summary: `Target engine (e.g. ${['browser', 'cordova'].map(e => (0, color_1.input)(e)).join(', ')})`,
        groups: ["hidden" /* MetadataGroup.HIDDEN */, "advanced" /* MetadataGroup.ADVANCED */],
    },
    {
        name: 'platform',
        summary: `Target platform on chosen engine (e.g. ${['ios', 'android'].map(e => (0, color_1.input)(e)).join(', ')})`,
        groups: ["hidden" /* MetadataGroup.HIDDEN */, "advanced" /* MetadataGroup.ADVANCED */],
    },
];
class ServeRunner {
    constructor() {
        this.devAppConnectionMade = false;
    }
    getPkgManagerServeCLI() {
        const pkgManagerCLIs = {
            npm: NpmServeCLI,
            pnpm: PnpmServeCLI,
            yarn: YarnServeCLI,
            bun: BunServeCLI,
        };
        const client = this.e.config.get('npmClient');
        const CLI = pkgManagerCLIs[client];
        if (CLI) {
            return new CLI(this.e);
        }
        throw new errors_1.ServeCLIProgramNotFoundException('Unknown CLI client: ' + client);
    }
    createOptionsFromCommandLine(inputs, options) {
        const separatedArgs = options['--'];
        if (options['external'] && options['host'] === exports.DEFAULT_ADDRESS) {
            options['host'] = '0.0.0.0';
        }
        if (options['address'] && options['host'] === exports.DEFAULT_ADDRESS) {
            this.e.log.warn(`The ${(0, color_1.input)('--address')} option is deprecated in favor of ${(0, color_1.input)('--host')}.\n` +
                `Please use the ${(0, color_1.input)('--host')} option (e.g. ${(0, color_1.input)(`--host=${options['address']}`)}) to specify the host of the dev server.\n`);
            options['host'] = options['address'];
        }
        const engine = this.determineEngineFromCommandLine(options);
        const host = options['host'] ? String(options['host']) : exports.DEFAULT_ADDRESS;
        const port = (0, string_1.str2num)(options['port'], exports.DEFAULT_SERVER_PORT);
        const [platform] = options['platform'] ? [String(options['platform'])] : inputs;
        return {
            '--': separatedArgs ? separatedArgs : [],
            host,
            browser: options['browser'] ? String(options['browser']) : undefined,
            browserOption: options['browseroption'] ? String(options['browseroption']) : undefined,
            engine,
            externalAddressRequired: !!options['externalAddressRequired'],
            livereload: typeof options['livereload'] === 'boolean' ? Boolean(options['livereload']) : true,
            open: !!options['open'],
            platform,
            port,
            proxy: typeof options['proxy'] === 'boolean' ? Boolean(options['proxy']) : true,
            project: options['project'] ? String(options['project']) : undefined,
            publicHost: options['public-host'] ? String(options['public-host']) : undefined,
            verbose: !!options['verbose'],
        };
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
    async beforeServe(options) {
        const hook = new ServeBeforeHook(this.e);
        try {
            await hook.run({ name: hook.name, serve: options });
        }
        catch (e) {
            if (e instanceof cli_framework_1.BaseError) {
                throw new errors_1.FatalException(e.message);
            }
            throw e;
        }
    }
    async run(options) {
        debug('serve options: %O', options);
        await this.beforeServe(options);
        const details = await this.serveProject(options);
        const localAddress = `${details.protocol}://${options.publicHost ? options.publicHost : 'localhost'}:${details.port}`;
        const fmtExternalAddress = (host) => `${details.protocol}://${host}:${details.port}`;
        this.e.log.nl();
        this.e.log.info(`Development server running!` +
            `\nLocal: ${(0, color_1.strong)(localAddress)}` +
            (details.externalNetworkInterfaces.length > 0 ? `\nExternal: ${details.externalNetworkInterfaces.map(v => (0, color_1.strong)(fmtExternalAddress(v.address))).join(', ')}` : '') +
            `\n\n${chalk_1.default.yellow('Use Ctrl+C to quit this process')}`);
        this.e.log.nl();
        if (options.open) {
            const openAddress = localAddress;
            const url = this.modifyOpenUrl(openAddress, options);
            await (0, open_1.openUrl)(url, { app: options.browser });
            this.e.log.info(`Browser window opened to ${(0, color_1.strong)(url)}!`);
            this.e.log.nl();
        }
        (0, events_2.emit)('serve:ready', details);
        debug('serve details: %O', details);
        this.scheduleAfterServe(options, details);
        return details;
    }
    async afterServe(options, details) {
        const hook = new ServeAfterHook(this.e);
        try {
            await hook.run({ name: hook.name, serve: lodash.assign({}, options, details) });
        }
        catch (e) {
            if (e instanceof cli_framework_1.BaseError) {
                throw new errors_1.FatalException(e.message);
            }
            throw e;
        }
    }
    scheduleAfterServe(options, details) {
        (0, utils_process_1.onBeforeExit)(async () => this.afterServe(options, details));
    }
    getUsedPorts(options, details) {
        return [details.port];
    }
    async selectExternalIP(options) {
        let availableInterfaces = [];
        let chosenIP = options.host;
        if (options.host === exports.BIND_ALL_ADDRESS) {
            // ignore link-local addresses
            availableInterfaces = (0, utils_network_1.getExternalIPv4Interfaces)().filter(i => !i.address.startsWith('169.254'));
            if (options.publicHost) {
                chosenIP = options.publicHost;
            }
            else {
                if (availableInterfaces.length === 0) {
                    if (options.externalAddressRequired) {
                        throw new errors_1.FatalException(`No external network interfaces detected. In order to use the dev server externally you will need one.\n` +
                            `Are you connected to a local network?\n`);
                    }
                }
                else if (availableInterfaces.length === 1) {
                    chosenIP = availableInterfaces[0].address;
                }
                else if (availableInterfaces.length > 1) {
                    if (options.externalAddressRequired) {
                        if (this.e.flags.interactive) {
                            this.e.log.warn('Multiple network interfaces detected!\n' +
                                `You will be prompted to select an external-facing IP for the dev server that your device or emulator can access. Make sure your device is on the same Wi-Fi network as your computer. Learn more about Live Reload in the docs${(0, color_1.ancillary)('[1]')}.\n\n` +
                                `To bypass this prompt, use the ${(0, color_1.input)('--public-host')} option (e.g. ${(0, color_1.input)(`--public-host=${availableInterfaces[0].address}`)}). You can alternatively bind the dev server to a specific IP (e.g. ${(0, color_1.input)(`--host=${availableInterfaces[0].address}`)}).\n\n` +
                                `${(0, color_1.ancillary)('[1]')}: ${(0, color_1.strong)('https://ion.link/livereload-docs')}\n`);
                            const promptedIp = await this.e.prompt({
                                type: 'list',
                                name: 'promptedIp',
                                message: 'Please select which IP to use:',
                                choices: availableInterfaces.map(i => ({
                                    name: `${i.address} ${(0, color_1.weak)(`(${i.device})`)}`,
                                    value: i.address,
                                })),
                            });
                            chosenIP = promptedIp;
                        }
                        else {
                            throw new errors_1.FatalException(`Multiple network interfaces detected!\n` +
                                `You must select an external-facing IP for the dev server that your device or emulator can access with the ${(0, color_1.input)('--public-host')} option.`);
                        }
                    }
                }
            }
        }
        else if (options.externalAddressRequired && exports.LOCAL_ADDRESSES.includes(options.host)) {
            this.e.log.warn('An external host may be required to serve for this target device/platform.\n' +
                'If you get connection issues on your device or emulator, try connecting the device to the same Wi-Fi network and selecting an accessible IP address for your computer on that network.\n\n' +
                `You can use ${(0, color_1.input)('--external')} to run the dev server on all network interfaces, in which case an external address will be selected.\n`);
        }
        return [chosenIP, availableInterfaces];
    }
}
exports.ServeRunner = ServeRunner;
class ServeBeforeHook extends hooks_1.Hook {
    constructor() {
        super(...arguments);
        this.name = 'serve:before';
    }
}
class ServeAfterHook extends hooks_1.Hook {
    constructor() {
        super(...arguments);
        this.name = 'serve:after';
    }
}
class ServeCLI extends events_1.EventEmitter {
    constructor(e) {
        super();
        this.e = e;
        /**
         * If true, the Serve CLI will not prompt to be installed.
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
     * Build the environment variables to be passed to the Serve CLI. Called by `this.start()`;
     */
    async buildEnvVars(options) {
        return process.env;
    }
    /**
     * Called whenever a line of stdout is received.
     *
     * If `false` is returned, the line is not emitted to the log.
     *
     * By default, the CLI is considered ready whenever stdout is emitted. This
     * method should be overridden to more accurately portray readiness.
     *
     * @param line A line of stdout.
     */
    stdoutFilter(line) {
        this.emit('ready');
        return true;
    }
    /**
     * Called whenever a line of stderr is received.
     *
     * If `false` is returned, the line is not emitted to the log.
     */
    stderrFilter(line) {
        return true;
    }
    async resolveScript() {
        if (typeof this.script === 'undefined') {
            return;
        }
        const [pkg] = await this.e.project.getPackageJson(undefined, { logErrors: false });
        if (!pkg) {
            return;
        }
        return pkg.scripts && pkg.scripts[this.script];
    }
    async serve(options) {
        this._resolvedProgram = await this.resolveProgram();
        await this.spawnWrapper(options);
        const interval = setInterval(() => {
            this.e.log.info(`Waiting for connectivity with ${(0, color_1.input)(this.resolvedProgram)}...`);
        }, 5000);
        debug('awaiting TCP connection to %s:%d', options.host, options.port);
        await (0, utils_network_1.isHostConnectable)(options.host, options.port);
        clearInterval(interval);
    }
    async spawnWrapper(options) {
        try {
            return await this.spawn(options);
        }
        catch (e) {
            if (!(e instanceof errors_1.ServeCLIProgramNotFoundException)) {
                throw e;
            }
            if (this.global) {
                this.e.log.nl();
                throw new errors_1.FatalException(`${(0, color_1.input)(this.pkg)} is required for this command to work properly.`);
            }
            this.e.log.nl();
            this.e.log.info(`Looks like ${(0, color_1.input)(this.pkg)} isn't installed in this project.\n` +
                `This package is required for this command to work properly. The package provides a CLI utility, but the ${(0, color_1.input)(this.resolvedProgram)} binary was not found in your PATH.`);
            const installed = await this.promptToInstall();
            if (!installed) {
                this.e.log.nl();
                throw new errors_1.FatalException(`${(0, color_1.input)(this.pkg)} is required for this command to work properly.`);
            }
            return this.spawn(options);
        }
    }
    async spawn(options) {
        const args = await this.buildArgs(options);
        const env = await this.buildEnvVars(options);
        const p = await this.e.shell.spawn(this.resolvedProgram, args, { stdio: ['inherit', 'pipe', 'pipe'], cwd: this.e.project.directory, env: (0, utils_process_1.createProcessEnv)(env) });
        return new Promise((resolve, reject) => {
            const errorHandler = (err) => {
                debug('received error for %s: %o', this.resolvedProgram, err);
                if (this.resolvedProgram === this.program && err.code === 'ENOENT') {
                    p.removeListener('close', closeHandler); // do not exit Ionic CLI, we can gracefully ask to install this CLI
                    reject(new errors_1.ServeCLIProgramNotFoundException(`${(0, color_1.strong)(this.resolvedProgram)} command not found.`));
                }
                else {
                    reject(err);
                }
            };
            const closeHandler = (code) => {
                if (code !== null) {
                    debug('received unexpected close for %s (code: %d)', this.resolvedProgram, code);
                    this.e.log.nl();
                    this.e.log.error(`${(0, color_1.input)(this.resolvedProgram)} has unexpectedly closed (exit code ${code}).\n` +
                        'The Ionic CLI will exit. Please check any output above for error details.');
                    (0, utils_process_1.processExit)(1);
                }
            };
            p.on('error', errorHandler);
            p.on('close', closeHandler);
            (0, utils_process_1.onBeforeExit)(async () => {
                p.removeListener('close', closeHandler);
                if (p.pid) {
                    await (0, utils_process_1.killProcessTree)(p.pid);
                }
            });
            const ws = this.createLoggerStream();
            p.stdout?.pipe((0, split2_1.default)()).pipe(this.createStreamFilter(line => this.stdoutFilter(line))).pipe(ws);
            p.stderr?.pipe((0, split2_1.default)()).pipe(this.createStreamFilter(line => this.stderrFilter(line))).pipe(ws);
            this.once('ready', () => {
                resolve();
            });
        });
    }
    createLoggerStream() {
        const log = this.e.log.clone();
        log.handlers = (0, logger_1.createDefaultLoggerHandlers)((0, cli_framework_output_1.createPrefixedFormatter)((0, color_1.weak)(`[${this.resolvedProgram === this.program ? this.prefix : this.resolvedProgram}]`)));
        return log.createWriteStream(cli_framework_output_1.LOGGER_LEVELS.INFO);
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
    createStreamFilter(filter) {
        return new stream.Transform({
            transform(chunk, enc, callback) {
                const str = chunk.toString();
                if (filter(str)) {
                    this.push(chunk);
                }
                callback();
            },
        });
    }
    async promptToInstall() {
        const { pkgManagerArgs } = await Promise.resolve().then(() => tslib_1.__importStar(require('./utils/npm')));
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
exports.ServeCLI = ServeCLI;
class PkgManagerServeCLI extends ServeCLI {
    constructor() {
        super(...arguments);
        this.global = true;
        this.script = exports.SERVE_SCRIPT;
    }
    async resolveProgram() {
        return this.program;
    }
    async buildArgs(options) {
        const { pkgManagerArgs } = await Promise.resolve().then(() => tslib_1.__importStar(require('./utils/npm')));
        // The Ionic CLI decides the host/port of the dev server, so --host and
        // --port are provided to the downstream npm script as a best-effort
        // attempt.
        const args = {
            _: [],
            host: options.host,
            port: options.port.toString(),
        };
        const scriptArgs = [...(0, cli_framework_1.unparseArgs)(args), ...options['--'] || []];
        const [, ...pkgArgs] = await pkgManagerArgs(this.program, { command: 'run', script: this.script, scriptArgs });
        return pkgArgs;
    }
}
class NpmServeCLI extends PkgManagerServeCLI {
    constructor() {
        super(...arguments);
        this.name = 'npm CLI';
        this.pkg = 'npm';
        this.program = 'npm';
        this.prefix = 'npm';
    }
}
exports.NpmServeCLI = NpmServeCLI;
class PnpmServeCLI extends PkgManagerServeCLI {
    constructor() {
        super(...arguments);
        this.name = 'pnpm CLI';
        this.pkg = 'pnpm';
        this.program = 'pnpm';
        this.prefix = 'pnpm';
    }
}
exports.PnpmServeCLI = PnpmServeCLI;
class YarnServeCLI extends PkgManagerServeCLI {
    constructor() {
        super(...arguments);
        this.name = 'Yarn';
        this.pkg = 'yarn';
        this.program = 'yarn';
        this.prefix = 'yarn';
    }
}
exports.YarnServeCLI = YarnServeCLI;
class BunServeCLI extends PkgManagerServeCLI {
    constructor() {
        super(...arguments);
        this.name = 'Bun';
        this.pkg = 'bun';
        this.program = 'bun';
        this.prefix = 'bun';
    }
}
exports.BunServeCLI = BunServeCLI;
