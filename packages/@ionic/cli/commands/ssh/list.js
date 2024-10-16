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
exports.SSHListCommand = void 0;
const utils_terminal_1 = require("@ionic/utils-terminal");
const constants_1 = require("../../constants");
const color_1 = require("../../lib/color");
const base_1 = require("./base");
class SSHListCommand extends base_1.SSHBaseCommand {
    async getMetadata() {
        return {
            name: 'list',
            type: 'global',
            summary: 'List your SSH public keys on Ionic',
            options: [
                {
                    name: 'json',
                    summary: 'Output SSH keys in JSON',
                    type: Boolean,
                },
            ],
            groups: ["deprecated" /* MetadataGroup.DEPRECATED */],
        };
    }
    async preRun() {
        await this.checkForOpenSSH();
    }
    async run(inputs, options) {
        const { SSHKeyClient } = await Promise.resolve().then(() => __importStar(require('../../lib/ssh')));
        const { findHostSection, getConfigPath, isDirective, loadFromPath } = await Promise.resolve().then(() => __importStar(require('../../lib/ssh-config')));
        const { json } = options;
        const user = this.env.session.getUser();
        const token = await this.env.session.getUserToken();
        const sshkeyClient = new SSHKeyClient({ client: this.env.client, user, token });
        const paginator = sshkeyClient.paginate();
        const [r] = paginator;
        const res = await r;
        if (json) {
            process.stdout.write(JSON.stringify(res.data));
        }
        else {
            let activeFingerprint;
            let foundActiveKey = false;
            const sshConfigPath = getConfigPath();
            const conf = await loadFromPath(sshConfigPath);
            const section = findHostSection(conf, this.env.config.getGitHost());
            if (section && section.config) {
                const [identityFile] = section.config.filter(line => {
                    return isDirective(line) && line.param === 'IdentityFile';
                });
                if (isDirective(identityFile)) {
                    const output = await this.env.shell.output('ssh-keygen', ['-E', 'sha256', '-lf', identityFile.value], { fatalOnError: false });
                    activeFingerprint = output.trim().split(' ')[1];
                }
            }
            if (res.data.length === 0) {
                this.env.log.warn(`No SSH keys found. Use ${(0, color_1.input)('ionic ssh add')} to add keys to Ionic.`);
                return;
            }
            const keysMatrix = res.data.map(sshkey => {
                const data = [sshkey.fingerprint, sshkey.name, sshkey.annotation];
                if (sshkey.fingerprint === activeFingerprint) {
                    foundActiveKey = true;
                    return data.map(v => (0, color_1.strong)(v));
                }
                return data;
            });
            const table = (0, utils_terminal_1.columnar)(keysMatrix, {
                ...constants_1.COLUMNAR_OPTIONS,
                headers: ['fingerprint', 'name', 'annotation'].map(h => (0, color_1.strong)(h)),
            });
            if (foundActiveKey) {
                this.env.log.nl();
                this.env.log.msg(`The row in ${(0, color_1.strong)('bold')} is the key that this computer is using. To change, use ${(0, color_1.input)('ionic ssh use')}.`);
            }
            this.env.log.nl();
            this.env.log.rawmsg(table);
            this.env.log.nl();
            this.env.log.ok(`Showing ${(0, color_1.strong)(String(res.data.length))} SSH key${res.data.length === 1 ? '' : 's'}.`);
            this.env.log.nl();
        }
    }
}
exports.SSHListCommand = SSHListCommand;
