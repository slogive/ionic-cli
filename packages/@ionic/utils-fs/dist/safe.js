"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readdir = exports.stat = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs-extra"));
async function stat(p) {
    try {
        return await fs.stat(p);
    }
    catch (e) {
        // ignore
    }
}
exports.stat = stat;
async function readdir(dir) {
    try {
        return await fs.readdir(dir);
    }
    catch (e) {
        return [];
    }
}
exports.readdir = readdir;
