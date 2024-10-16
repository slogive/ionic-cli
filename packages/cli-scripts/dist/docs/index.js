"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsCommand = void 0;
const tslib_1 = require("tslib");
const cli_1 = require("@ionic/cli");
const cli_framework_1 = require("@ionic/cli-framework");
const string_1 = require("@ionic/cli-framework/utils/string");
const help_1 = require("@ionic/cli/lib/help");
const utils_fs_1 = require("@ionic/utils-fs");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const lodash = tslib_1.__importStar(require("lodash"));
const path = tslib_1.__importStar(require("path"));
const stripAnsi = require("strip-ansi");
const utils_1 = require("./utils");
const PROJECTS_DIRECTORY = path.resolve(__dirname, '..', '..', 'projects');
const STAGING_DIRECTORY = path.resolve(__dirname, '..', '..', '..', '..', 'docs');
class DocsCommand extends cli_framework_1.Command {
    async getMetadata() {
        return {
            name: 'docs',
            summary: '',
        };
    }
    async run(inputs, options) {
        await (0, utils_fs_1.remove)(STAGING_DIRECTORY);
        await (0, utils_fs_1.mkdirp)(STAGING_DIRECTORY);
        const projectTypes = ['angular'];
        const baseCtx = await (0, cli_1.generateContext)();
        for (const projectType of projectTypes) {
            // TODO: possible to do this without a physical directory?
            const ctx = { ...baseCtx, execPath: path.resolve(PROJECTS_DIRECTORY, projectType) };
            const executor = await (0, cli_1.loadExecutor)(ctx, []);
            const location = await executor.namespace.locate([]);
            const formatter = new help_1.NamespaceSchemaHelpFormatter({ location, namespace: executor.namespace });
            const formatted = await formatter.serialize();
            const projectJson = { type: projectType, ...formatted };
            // TODO: `serialize()` from base formatter isn't typed properly
            projectJson.commands = await Promise.all(projectJson.commands.map(async (cmd) => this.extractCommand(cmd)));
            projectJson.commands.sort((a, b) => (0, string_1.strcmp)(a.name, b.name));
            await (0, utils_fs_1.writeFile)(path.resolve(STAGING_DIRECTORY, `${projectType}.json`), JSON.stringify(projectJson, undefined, 2) + '\n', { encoding: 'utf8' });
        }
        process.stdout.write(`${chalk_1.default.green('Done.')}\n`);
    }
    async extractCommand(command) {
        const processText = lodash.flow([utils_1.ansi2md, stripAnsi, utils_1.links2md, utils_1.convertHTMLEntities, text => text.trim()]);
        return {
            ...command,
            summary: processText(command.summary),
            description: await this.formatFootnotes(processText(command.description), command.footnotes),
            footnotes: command.footnotes.filter(footnote => footnote.type !== 'link'),
            inputs: await Promise.all(command.inputs.map(input => this.extractInput(input))),
            options: await Promise.all(command.options.map(opt => this.extractOption(opt))),
        };
    }
    async formatFootnotes(description, footnotes) {
        return description.replace(/(\S+)\[\^([A-z0-9-]+)\]/g, (match, p1, p2) => {
            const m = Number.parseInt(p2, 10);
            const id = !Number.isNaN(m) ? m : p2;
            const foundFootnote = footnotes.find(footnote => footnote.id === id);
            if (!foundFootnote) {
                throw new Error('Bad footnote.');
            }
            return foundFootnote.type === 'link' ? `[${p1}](${foundFootnote.url})` : match; // TODO: handle text footnotes
        });
    }
    async extractInput(input) {
        return {
            ...input,
            summary: stripAnsi((0, utils_1.links2md)((0, utils_1.ansi2md)(input.summary))).trim(),
        };
    }
    async extractOption(option) {
        return {
            ...option,
            summary: stripAnsi((0, utils_1.links2md)((0, utils_1.ansi2md)(option.summary))).trim(),
        };
    }
}
exports.DocsCommand = DocsCommand;
