"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receive = exports.run = exports.loadExecutor = exports.generateContext = void 0;
const tslib_1 = require("tslib");
const cli_framework_1 = require("@ionic/cli-framework");
const node_1 = require("@ionic/cli-framework/utils/node");
const utils_process_1 = require("@ionic/utils-process");
const debug_1 = require("debug");
const path = tslib_1.__importStar(require("path"));
const util = tslib_1.__importStar(require("util"));
const commands_1 = require("./commands");
const guards_1 = require("./guards");
const lib_1 = require("./lib");
const color_1 = require("./lib/color");
const executor_1 = require("./lib/executor");
tslib_1.__exportStar(require("./constants"), exports);
tslib_1.__exportStar(require("./guards"), exports);
tslib_1.__exportStar(require("./definitions"), exports);
const debug = (0, debug_1.debug)('ionic');
const PACKAGE_ROOT_PATH = __dirname;
const PACKAGE_JSON_PATH = path.resolve(PACKAGE_ROOT_PATH, 'package.json');
let _pkg;
let _executor;
async function loadPackageJson() {
    if (!_pkg) {
        _pkg = await (0, node_1.readPackageJsonFile)(PACKAGE_JSON_PATH);
    }
    return _pkg;
}
async function generateContext() {
    const pkg = await loadPackageJson();
    if (!pkg.bin || !pkg.bin.ionic) {
        throw new Error(`Missing "${(0, color_1.strong)('bin.ionic')}" in Ionic CLI package.json`);
    }
    if (!pkg.main) {
        throw new Error(`Missing "${(0, color_1.strong)('main')}" in Ionic CLI package.json`);
    }
    return {
        binPath: path.resolve(PACKAGE_ROOT_PATH, pkg.bin.ionic),
        libPath: PACKAGE_ROOT_PATH,
        execPath: process.cwd(),
        version: pkg.version,
    };
}
exports.generateContext = generateContext;
async function loadExecutor(ctx, pargv) {
    if (!_executor) {
        const deps = await (0, lib_1.generateIonicEnvironment)(ctx, pargv);
        const namespace = new commands_1.IonicNamespace(deps);
        _executor = new executor_1.Executor({ namespace });
    }
    return _executor;
}
exports.loadExecutor = loadExecutor;
async function authenticateFromEnvironment(ienv) {
    const token = process.env['IONIC_TOKEN'];
    const email = process.env['IONIC_EMAIL'];
    const password = process.env['IONIC_PASSWORD'];
    if (token) {
        const wasLoggedIn = ienv.session.isLoggedIn();
        debug(`${(0, color_1.strong)('IONIC_TOKEN')} environment variable detected`);
        if (ienv.config.get('tokens.user') !== token) {
            debug(`${(0, color_1.strong)('IONIC_TOKEN')} mismatch with current session--attempting login`);
            await ienv.session.tokenLogin(token);
            if (wasLoggedIn) {
                ienv.log.info(`You have been logged out--using ${(0, color_1.strong)('IONIC_TOKEN')} environment variable`);
            }
        }
    }
    else if (email && password) {
        debug(`${(0, color_1.strong)('IONIC_EMAIL')} / ${(0, color_1.strong)('IONIC_PASSWORD')} environment variables detected`);
        if (ienv.config.get('user.email') !== email) {
            debug(`${(0, color_1.strong)('IONIC_EMAIL')} mismatch with current session--attempting login`);
            ienv.log.warn('Authenticating using email and password is deprecated. Please generate a Personal Access Token and set the ' +
                (0, color_1.strong)('IONIC_TOKEN') +
                ' environment variable.');
            ienv.log.nl();
            try {
                await ienv.session.login(email, password);
            }
            catch (e) {
                ienv.log.error(`Error occurred during automatic login via ${(0, color_1.strong)('IONIC_EMAIL')} / ${(0, color_1.strong)('IONIC_PASSWORD')} environment variables.`);
                throw e;
            }
        }
    }
}
async function run(pargv) {
    let err;
    let executor;
    try {
        executor = await loadExecutor(await generateContext(), pargv);
    }
    catch (e) {
        process.stderr.write(`${e.message ? e.message : (e.stack ? e.stack : e)}\n`);
        process.exitCode = 1;
        return;
    }
    const ienv = executor.namespace.env;
    if (pargv[0] === '_') {
        return;
    }
    try {
        debug('Context: %o', ienv.ctx);
        ienv.config.set('version', ienv.ctx.version);
        const location = await executor.locate(pargv);
        const [, [cmd = ''] = []] = location.path;
        if (!['config', 'completion', 'help', 'login', 'logout', 'version'].includes(cmd)) {
            await authenticateFromEnvironment(ienv);
        }
        await executor.execute(location, process.env);
    }
    catch (e) {
        err = e;
    }
    finally {
        if (ienv.flags.interactive) {
            const { runUpdateNotify } = await Promise.resolve().then(() => tslib_1.__importStar(require('./lib/updates')));
            await runUpdateNotify(ienv, await loadPackageJson());
        }
    }
    if (err) {
        process.exitCode = 1;
        if (err instanceof cli_framework_1.InputValidationError) {
            for (const e of err.errors) {
                ienv.log.error(e.message);
            }
            ienv.log.msg(`Use the ${(0, color_1.input)('--help')} flag for more details.`);
        }
        else if ((0, guards_1.isSuperAgentError)(err)) {
            const { formatSuperAgentError } = await Promise.resolve().then(() => tslib_1.__importStar(require('./lib/http')));
            ienv.log.rawmsg(formatSuperAgentError(err));
        }
        else if (err.code && err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
            ienv.log.error(`Network connectivity error occurred, are you offline?\n` +
                `If you are behind a firewall and need to configure proxy settings, see: ${(0, color_1.strong)('https://ion.link/cli-proxy-docs')}\n\n` +
                (0, color_1.failure)(String(err.stack ? err.stack : err)));
        }
        else if ((0, guards_1.isExitCodeException)(err)) {
            if (err.message) {
                if (err.exitCode > 0) {
                    ienv.log.error(err.message);
                }
                else {
                    ienv.log.msg(err.message);
                }
            }
            await (0, utils_process_1.processExit)(err.exitCode);
        }
        else if (err instanceof cli_framework_1.BaseError) {
            ienv.log.error(err.message);
        }
        else {
            ienv.log.rawmsg((0, color_1.failure)(util.inspect(err)));
        }
    }
}
exports.run = run;
async function receive(msg) {
    if (!_executor) {
        throw new Error('Executor not initialized.');
    }
    const { env, project } = _executor.namespace;
    if (msg.type === 'telemetry') {
        const { sendCommand } = await Promise.resolve().then(() => tslib_1.__importStar(require('./lib/telemetry')));
        await sendCommand({
            getInfo: env.getInfo,
            client: env.client,
            config: env.config,
            ctx: env.ctx,
            project,
            session: env.session,
        }, msg.data.command, msg.data.args);
    }
    else if (msg.type === 'update-check') {
        const { runUpdateCheck } = await Promise.resolve().then(() => tslib_1.__importStar(require('./lib/updates')));
        await runUpdateCheck(env);
    }
}
exports.receive = receive;
