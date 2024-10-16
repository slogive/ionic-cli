"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureHostAndKeyPath = exports.findHostSection = exports.getConfigPath = exports.isHostDirective = exports.isDirective = exports.loadFromPath = exports.SSHConfig = void 0;
const tslib_1 = require("tslib");
const utils_fs_1 = require("@ionic/utils-fs");
const os_1 = tslib_1.__importDefault(require("os"));
const path = tslib_1.__importStar(require("path"));
const ssh_config_1 = tslib_1.__importDefault(require("ssh-config"));
exports.SSHConfig = ssh_config_1.default;
async function loadFromPath(p) {
    const s = await (0, utils_fs_1.fileToString)(p);
    return ssh_config_1.default.parse(s);
}
exports.loadFromPath = loadFromPath;
function isDirective(entry) {
    return entry && entry.type === ssh_config_1.default.DIRECTIVE;
}
exports.isDirective = isDirective;
function isHostDirective(entry) {
    return isDirective(entry) && entry.param === 'Host';
}
exports.isHostDirective = isHostDirective;
function getConfigPath() {
    return path.resolve(os_1.default.homedir(), '.ssh', 'config');
}
exports.getConfigPath = getConfigPath;
function findHostSection(conf, host) {
    return conf.find({ Host: host });
}
exports.findHostSection = findHostSection;
function ensureHostAndKeyPath(conf, conn, keyPath) {
    const section = ensureHostSection(conf, conn.host);
    const index = conf.indexOf(section);
    ensureSectionLine(section, 'IdentityFile', keyPath);
    if (typeof conn.port === 'number' && conn.port !== 22) {
        ensureSectionLine(section, 'Port', String(conn.port));
    }
    // massage the section for proper whitespace
    if (index === 0) {
        section.before = '';
    }
    else {
        const previousSection = conf[index - 1];
        if (isHostDirective(previousSection)) {
            const previousSectionLastEntry = previousSection.config[previousSection.config.length - 1];
            if (previousSectionLastEntry) {
                previousSectionLastEntry.after = '\n';
            }
        }
        else {
            previousSection.after = '\n';
        }
        section.before = '\n';
    }
    section.after = '\n';
    if (!section.config) {
        section.config = [];
    }
    for (const entry of section.config) {
        entry.before = '    ';
        entry.after = '\n';
    }
    if (index !== conf.length - 1) {
        const lastEntry = section.config[section.config.length - 1];
        lastEntry.after = '\n\n';
    }
}
exports.ensureHostAndKeyPath = ensureHostAndKeyPath;
function ensureHostSection(conf, host) {
    let section = findHostSection(conf, host);
    if (!section) {
        conf.push(ssh_config_1.default.parse(`\nHost ${host}\n`)[0]);
        section = findHostSection(conf, host);
    }
    if (!section) {
        throw new Error(`Could not find/insert section for host: ${host}`);
    }
    return section;
}
function ensureSectionLine(section, key, value) {
    const found = section.config.some(line => {
        if (isDirective(line)) {
            if (line.param === key) {
                line.value = value;
                return true;
            }
        }
        return false;
    });
    if (!found) {
        section.config = section.config.concat(ssh_config_1.default.parse(`${key} ${value}\n`));
    }
}
