"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = exports.createRequest = exports.PROXY_ENVIRONMENT_VARIABLES = void 0;
const tslib_1 = require("tslib");
const utils_array_1 = require("@ionic/utils-array");
const utils_fs_1 = require("@ionic/utils-fs");
const debug_1 = require("debug");
const superagent_proxy_1 = tslib_1.__importDefault(require("./superagent-proxy"));
const debug = (0, debug_1.debug)('ionic:lib:utils:http');
exports.PROXY_ENVIRONMENT_VARIABLES = ['IONIC_HTTP_PROXY', 'HTTPS_PROXY', 'HTTP_PROXY', 'PROXY', 'https_proxy', 'http_proxy', 'proxy'];
function getGlobalProxy() {
    for (const envvar of exports.PROXY_ENVIRONMENT_VARIABLES) {
        const envval = process.env[envvar];
        if (envval) {
            return { envval, envvar };
        }
    }
}
async function createRequest(method, url, { userAgent, proxy, ssl }) {
    const superagent = (await Promise.resolve().then(() => tslib_1.__importStar(require('superagent')))).default;
    if (!proxy) {
        const gproxy = getGlobalProxy();
        if (gproxy) {
            proxy = gproxy.envval;
        }
    }
    const req = superagent(method, url);
    req
        .set('User-Agent', userAgent)
        .redirects(25);
    if (proxy) {
        (0, superagent_proxy_1.default)(superagent);
        if (req.proxy) {
            req.proxy(proxy);
        }
        else {
            debug(`Cannot install proxy--req.proxy not defined`);
        }
    }
    if (ssl) {
        const cafiles = (0, utils_array_1.conform)(ssl.cafile);
        const certfiles = (0, utils_array_1.conform)(ssl.certfile);
        const keyfiles = (0, utils_array_1.conform)(ssl.keyfile);
        if (cafiles.length > 0) {
            req.ca(await Promise.all(cafiles.map(p => (0, utils_fs_1.readFile)(p, { encoding: 'utf8' }))));
        }
        if (certfiles.length > 0) {
            req.cert(await Promise.all(certfiles.map(p => (0, utils_fs_1.readFile)(p, { encoding: 'utf8' }))));
        }
        if (keyfiles.length > 0) {
            req.key(await Promise.all(keyfiles.map(p => (0, utils_fs_1.readFile)(p, { encoding: 'utf8' }))));
        }
    }
    return { req };
}
exports.createRequest = createRequest;
/**
 * Initiate a request, downloading the contents to a writable stream.
 *
 * @param req The request to download to the writable stream.
 * @param ws Must be a dedicated writable stream that calls the 'close' event.
 */
async function download(req, ws, { progress }) {
    return new Promise((resolve, reject) => {
        req
            .on('response', res => {
            if (res.status !== 200) {
                reject(new Error(`Encountered bad status code (${res.status}) for ${req.url}\n` +
                    `This could mean the server is experiencing difficulties right now--please try again later.`));
            }
            if (progress) {
                let loaded = 0;
                const total = Number(res.header['content-length']);
                res.on('data', chunk => {
                    loaded += chunk.length;
                    progress(loaded, total);
                });
            }
        })
            .on('error', err => {
            if (err.code === 'ECONNABORTED') {
                reject(new Error(`Timeout of ${err.timeout}ms reached for ${req.url}`));
            }
            else {
                reject(err);
            }
        });
        ws.on('close', resolve);
        req.pipe(ws);
    });
}
exports.download = download;
