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
exports.SSHSetupCommand = void 0;
const utils_fs_1 = require("@ionic/utils-fs");
const utils_terminal_1 = require("@ionic/utils-terminal");
const color_1 = require("../../lib/color");
const errors_1 = require("../../lib/errors");
const executor_1 = require("../../lib/executor");
const base_1 = require("./base");
class SSHSetupCommand extends base_1.SSHBaseCommand {
    async getMetadata() {
        const dashUrl = this.env.config.getDashUrl();
        return {
            name: 'setup',
            type: 'global',
            summary: 'Setup your Ionic SSH keys automatically',
            description: `
This command offers a setup wizard for Ionic SSH keys using a series of prompts. For more control, see the commands available for managing SSH keys with the ${(0, color_1.input)('ionic ssh --help')} command. For an entirely manual approach, see ${(0, color_1.strong)('Personal Settings')} => ${(0, color_1.strong)('SSH Keys')} in the Dashboard[^dashboard-settings-ssh-keys].

If you are having issues setting up SSH keys, please get in touch with our Support[^support-request].
      `,
            footnotes: [
                {
                    id: 'dashboard-settings-ssh-keys',
                    url: `${dashUrl}/settings/ssh-keys`,
                },
                {
                    id: 'support-request',
                    url: 'https://ion.link/support-request',
                },
            ],
            groups: ["deprecated" /* MetadataGroup.DEPRECATED */],
        };
    }
    async preRun() {
        await this.checkForOpenSSH();
    }
    async run(inputs, options, runinfo) {
        const { getGeneratedPrivateKeyPath } = await Promise.resolve().then(() => __importStar(require('../../lib/ssh')));
        const { getConfigPath } = await Promise.resolve().then(() => __importStar(require('../../lib/ssh-config')));
        const { promptToLogin } = await Promise.resolve().then(() => __importStar(require('../../lib/session')));
        if (!this.env.session.isLoggedIn()) {
            await promptToLogin(this.env);
        }
        const CHOICE_AUTOMATIC = 'automatic';
        const CHOICE_MANUAL = 'manual';
        const CHOICE_SKIP = 'skip';
        const CHOICE_IGNORE = 'ignore';
        if (this.env.config.get('git.setup')) {
            const rerun = await this.env.prompt({
                type: 'confirm',
                name: 'confirm',
                message: `SSH setup wizard has run before. Would you like to run it again?`,
            });
            if (!rerun) {
                return;
            }
        }
        else {
            this.env.log.msg(`Looks like you haven't configured your SSH settings yet.`);
        }
        // TODO: link to docs about manual git setup
        const setupChoice = await this.env.prompt({
            type: 'list',
            name: 'setupChoice',
            message: `How would you like to connect to Ionic?`,
            choices: [
                {
                    name: 'Automatically setup new a SSH key pair for Ionic',
                    value: CHOICE_AUTOMATIC,
                },
                {
                    name: 'Use an existing SSH key pair',
                    value: CHOICE_MANUAL,
                },
                {
                    name: 'Skip for now',
                    value: CHOICE_SKIP,
                },
                {
                    name: 'Ignore this prompt forever',
                    value: CHOICE_IGNORE,
                },
            ],
        });
        if (setupChoice === CHOICE_AUTOMATIC) {
            const sshconfigPath = getConfigPath();
            const keyPath = await getGeneratedPrivateKeyPath(this.env.config.get('user.id'));
            const pubkeyPath = `${keyPath}.pub`;
            const [pubkeyExists, keyExists] = await Promise.all([(0, utils_fs_1.pathExists)(keyPath), (0, utils_fs_1.pathExists)(pubkeyPath)]);
            if (!pubkeyExists && !keyExists) {
                this.env.log.info('The automatic SSH setup will do the following:\n' +
                    `1) Generate a new SSH key pair with OpenSSH (will not overwrite any existing keys).\n` +
                    `2) Upload the generated SSH public key to our server, registering it on your account.\n` +
                    `3) Modify your SSH config (${(0, color_1.strong)((0, utils_terminal_1.prettyPath)(sshconfigPath))}) to use the generated SSH private key for our server(s).`);
                const confirm = await this.env.prompt({
                    type: 'confirm',
                    name: 'confirm',
                    message: 'May we proceed?',
                });
                if (!confirm) {
                    throw new errors_1.FatalException();
                }
            }
            if (pubkeyExists && keyExists) {
                this.env.log.msg(`Using your previously generated key: ${(0, color_1.strong)((0, utils_terminal_1.prettyPath)(keyPath))}.\n` +
                    `You can generate a new one by deleting it.`);
            }
            else {
                await (0, executor_1.runCommand)(runinfo, ['ssh', 'generate', keyPath]);
            }
            await (0, executor_1.runCommand)(runinfo, ['ssh', 'add', pubkeyPath, '--use']);
        }
        else if (setupChoice === CHOICE_MANUAL) {
            await (0, executor_1.runCommand)(runinfo, ['ssh', 'add']);
        }
        if (setupChoice === CHOICE_SKIP) {
            this.env.log.warn(`Skipping for now. You can configure your SSH settings using ${(0, color_1.input)('ionic ssh setup')}.`);
        }
        else {
            if (setupChoice === CHOICE_IGNORE) {
                this.env.log.ok(`We won't pester you about SSH settings anymore!`);
            }
            else {
                this.env.log.ok('SSH setup successful!');
            }
            this.env.config.set('git.setup', true);
        }
    }
}
exports.SSHSetupCommand = SSHSetupCommand;
