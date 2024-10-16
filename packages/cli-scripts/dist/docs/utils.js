"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertHTMLEntities = exports.ansi2md = exports.links2md = void 0;
const tslib_1 = require("tslib");
const color_1 = require("@ionic/cli/lib/color");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const escape_string_regexp_1 = tslib_1.__importDefault(require("escape-string-regexp"));
function links2md(str) {
    str = str.replace(/((http|https):\/\/(\w+:{0,1}\w*@)?([^\s\*\)`]+)(\/|\/([\w#!:.?+=&%@!\-\/]))?)/g, '[$1]($1)');
    str = str.replace(/\[(\d+)\]/g, '\\\[$1\\\]');
    return str;
}
exports.links2md = links2md;
function ansi2md(str) {
    const yellow = chalk_1.default.yellow;
    const { input, strong } = color_1.COLORS;
    str = convertAnsiToMd(str, [input._styler], { open: '`', close: '`' });
    str = convertAnsiToMd(str, [yellow._styler], { open: '', close: '' });
    str = convertAnsiToMd(str, [strong._styler], { open: '**', close: '**' });
    return str;
}
exports.ansi2md = ansi2md;
function convertHTMLEntities(str) {
    return str.replace(/(?<=^(?:[^\`]|\`[^\`]*\`)*)\<(\S+)\>/g, '&lt;$1&gt;');
}
exports.convertHTMLEntities = convertHTMLEntities;
function convertAnsiToMd(str, styles, md) {
    const start = styles.map(style => style.open).join('');
    const end = [...styles].reverse().map(style => style.close).join('');
    const re = new RegExp((0, escape_string_regexp_1.default)(start) + '(.*?)' + (0, escape_string_regexp_1.default)(end), 'g');
    return str.replace(re, md.open + '$1' + md.close);
}
