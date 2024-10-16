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
exports.GitRemoteCommand = void 0;
const color_1 = require("../../lib/color");
const command_1 = require("../../lib/command");
const errors_1 = require("../../lib/errors");
class GitRemoteCommand extends command_1.Command {
    async getMetadata() {
        const dashUrl = this.env.config.getDashUrl();
        return {
            name: 'remote',
            type: 'project',
            groups: ["paid" /* MetadataGroup.PAID */],
            summary: 'Adds/updates the Appflow git remote to your local Ionic app',
            description: `
This command is used by ${(0, color_1.input)('ionic link')} when Appflow is used as the git host.

${(0, color_1.input)('ionic git remote')} will check the local repository for whether or not the git remote is properly set up. This command operates on the ${(0, color_1.strong)('ionic')} remote. For advanced configuration, see ${(0, color_1.strong)('Settings')} => ${(0, color_1.strong)('Git')} in the app settings of the Dashboard[^dashboard].
      `,
            footnotes: [
                {
                    id: 'dashboard',
                    url: dashUrl,
                },
            ],
        };
    }
    async run(inputs, options) {
        const { AppClient } = await Promise.resolve().then(() => __importStar(require('../../lib/app')));
        const { addIonicRemote, getIonicRemote, initializeRepo, isRepoInitialized, setIonicRemote } = await Promise.resolve().then(() => __importStar(require('../../lib/git')));
        if (!this.project) {
            throw new errors_1.FatalException(`Cannot run ${(0, color_1.input)('ionic git remote')} outside a project directory.`);
        }
        const token = await this.env.session.getUserToken();
        const id = await this.project.requireAppflowId();
        const appClient = new AppClient(token, this.env);
        const app = await appClient.load(id);
        if (!app.repo_url) {
            throw new errors_1.FatalException(`Missing ${(0, color_1.strong)('repo_url')} property in app.`);
        }
        if (!(await isRepoInitialized(this.project.directory))) {
            await initializeRepo({ shell: this.env.shell }, this.project.directory);
            this.env.log.warn(`Initializing a git repository for your project.\n` +
                `Before your first ${(0, color_1.input)('git push ionic master')}, you'll want to commit all the files in your project:\n\n` +
                `${(0, color_1.input)('git commit -a -m "Initial commit"')}\n`);
        }
        const remote = app.repo_url;
        const found = await getIonicRemote({ shell: this.env.shell }, this.project.directory);
        if (found) {
            if (remote === found) {
                this.env.log.msg(`Existing remote ${(0, color_1.strong)('ionic')} found.`);
            }
            else {
                await setIonicRemote({ shell: this.env.shell }, this.project.directory, remote);
                this.env.log.ok(`Updated remote ${(0, color_1.strong)('ionic')}.`);
            }
        }
        else {
            await addIonicRemote({ shell: this.env.shell }, this.project.directory, remote);
            this.env.log.ok(`Added remote ${(0, color_1.strong)('ionic')}.`);
        }
    }
}
exports.GitRemoteCommand = GitRemoteCommand;
