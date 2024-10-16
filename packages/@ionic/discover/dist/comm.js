"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommServer = void 0;
const tslib_1 = require("tslib");
const debug_1 = require("debug");
const events = tslib_1.__importStar(require("events"));
const util = tslib_1.__importStar(require("util"));
const ws_1 = tslib_1.__importDefault(require("ws"));
const debug = (0, debug_1.debug)('ionic:discover:comm');
const PREFIX = 'ION_CS';
class CommServer extends events.EventEmitter {
    constructor(namespace, 
    /**
     * Unique identifier of the publisher.
     */
    id, 
    /**
     * Port of communication server.
     */
    port) {
        super();
        this.namespace = namespace;
        this.id = id;
        this.port = port;
    }
    get clients() {
        return this.server ? this.server.clients : new Set();
    }
    start() {
        if (this.server) {
            throw new Error('server already initialized');
        }
        const server = this.server = new ws_1.default.Server({ clientTracking: true, host: '0.0.0.0', port: this.port });
        return new Promise((resolve, reject) => {
            server.on('error', err => {
                this.emit('error', err);
            });
            server.on('connection', ws => {
                debug(`Connection established. ${server.clients.size} clients.`);
                ws.on('message', data => {
                    debug(`Received %O`, data.toString());
                    const message = this.parseData(data);
                    if (message) {
                        this.emit(message.event, message);
                    }
                });
                ws.on('close', () => {
                    debug(`Connection closed. ${server.clients.size} clients.`);
                });
            });
            server.on('listening', () => {
                debug('Comm server listening: %O', { host: server.options.host, port: this.port });
                resolve();
            });
        });
    }
    parseData(data) {
        try {
            const msg = data.toString();
            const msgprefix = msg.substring(0, PREFIX.length);
            if (msgprefix !== PREFIX) {
                throw new Error(`Invalid prefix for message: ${msgprefix}`);
            }
            const payload = JSON.parse(msg.substring(PREFIX.length));
            if (!isPayload(payload)) {
                throw new Error(`Invalid payload: ${util.inspect(payload)}`);
            }
            return payload;
        }
        catch (e) {
            debug(e);
        }
    }
    stop() {
        if (!this.server) {
            throw new Error('server not initialized');
        }
        const server = this.server;
        return new Promise(resolve => {
            server.close(() => resolve());
        });
    }
}
exports.CommServer = CommServer;
function isPayload(payload) {
    return payload && typeof payload.event === 'string';
}
