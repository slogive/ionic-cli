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
exports.ReactViteServeCLI = exports.ReactViteServeRunner = void 0;
const cli_framework_1 = require("@ionic/cli-framework");
const cli_framework_output_1 = require("@ionic/cli-framework-output");
const utils_network_1 = require("@ionic/utils-network");
const color_1 = require("../../color");
const serve_1 = require("../../serve");
class ReactViteServeRunner extends serve_1.ServeRunner {
    constructor(e) {
        super();
        this.e = e;
    }
    async getCommandMetadata() {
        return {};
    }
    modifyOpenUrl(url, _options) {
        return url;
    }
    async serveProject(options) {
        const [externalIP, availableInterfaces] = await this.selectExternalIP(options);
        const port = (options.port = await (0, utils_network_1.findClosestOpenPort)(options.port));
        const reactScripts = new ReactViteServeCLI(this.e);
        await reactScripts.serve(options);
        return {
            custom: reactScripts.resolvedProgram !== reactScripts.program,
            protocol: options.https ? 'https' : 'http',
            localAddress: 'localhost',
            externalAddress: externalIP,
            externalNetworkInterfaces: availableInterfaces,
            port,
            externallyAccessible: ![serve_1.BIND_ALL_ADDRESS, ...serve_1.LOCAL_ADDRESSES].includes(externalIP),
        };
    }
}
exports.ReactViteServeRunner = ReactViteServeRunner;
class ReactViteServeCLI extends serve_1.ServeCLI {
    constructor() {
        super(...arguments);
        this.name = 'Vite CLI Service';
        this.pkg = 'vite';
        this.program = 'vite';
        this.prefix = 'vite';
        this.script = serve_1.SERVE_SCRIPT;
        this.chunks = 0;
    }
    async serve(options) {
        this.on('compile', (chunks) => {
            if (chunks > 0) {
                this.e.log.info(`... and ${(0, color_1.strong)(chunks.toString())} additional chunks`);
            }
        });
        return super.serve(options);
    }
    stdoutFilter(line) {
        if (this.resolvedProgram !== this.program) {
            return super.stdoutFilter(line);
        }
        const strippedLine = (0, cli_framework_output_1.stripAnsi)(line);
        const compileMsgs = [
            'Compiled successfully',
            'Compiled with warnings',
            'Failed to compile',
            "ready in"
        ];
        if (compileMsgs.some((msg) => strippedLine.includes(msg))) {
            this.emit('ready');
            return false;
        }
        if (strippedLine.match(/.*chunk\s{\d+}.+/)) {
            this.chunks++;
            return false;
        }
        if (strippedLine.includes('Compiled successfully')) {
            this.emit('compile', this.chunks);
            this.chunks = 0;
        }
        if (strippedLine.includes('has unexpectedly closed')) {
            return false;
        }
        return true;
    }
    stderrFilter(line) {
        if (this.resolvedProgram !== this.program) {
            return super.stderrFilter(line);
        }
        const strippedLine = (0, cli_framework_output_1.stripAnsi)(line);
        if (strippedLine.includes('webpack.Progress')) {
            return false;
        }
        if (strippedLine.includes('has unexpectedly closed')) {
            return false;
        }
        return true;
    }
    async buildArgs(options) {
        const args = {
            _: [],
            host: options.host,
            port: options.port ? options.port.toString() : undefined,
        };
        const { pkgManagerArgs } = await Promise.resolve().then(() => __importStar(require('../../utils/npm')));
        const separatedArgs = options['--'];
        if (this.resolvedProgram === this.program) {
            return [...(0, cli_framework_1.unparseArgs)(args), ...separatedArgs];
        }
        else {
            const [, ...pkgArgs] = await pkgManagerArgs(this.e.config.get('npmClient'), {
                command: 'run',
                script: this.script,
                scriptArgs: [...(0, cli_framework_1.unparseArgs)(args), ...separatedArgs],
            });
            return pkgArgs;
        }
    }
    async buildEnvVars(options) {
        const env = {};
        // // Vite binds to `localhost` by default, but if specified it prints a
        // // warning, so don't set `HOST` if the host is set to `localhost`.
        if (options.host !== serve_1.DEFAULT_ADDRESS) {
            env.HOST = options.host;
        }
        env.PORT = String(options.port);
        env.HTTPS = options.https ? 'true' : 'false';
        return { ...(await super.buildEnvVars(options)), ...env };
    }
}
exports.ReactViteServeCLI = ReactViteServeCLI;
