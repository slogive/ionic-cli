"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const tslib_1 = require("tslib");
const utils_fs_1 = require("@ionic/utils-fs");
const utils_subprocess_1 = require("@ionic/utils-subprocess");
const path = tslib_1.__importStar(require("path"));
async function sendMessage({ config, ctx }, msg) {
    const dir = path.dirname(config.p);
    await (0, utils_fs_1.mkdirp)(dir);
    const fd = await (0, utils_fs_1.open)(path.resolve(dir, 'helper.log'), 'a');
    const p = (0, utils_subprocess_1.fork)(ctx.binPath, ['_', '--no-interactive'], { stdio: ['ignore', fd, fd, 'ipc'] });
    p.send(msg);
    p.disconnect();
    p.unref();
}
exports.sendMessage = sendMessage;
