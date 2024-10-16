"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateCommand = void 0;
const color_1 = require("../lib/color");
const command_1 = require("../lib/command");
const errors_1 = require("../lib/errors");
const project_1 = require("../lib/project");
class GenerateCommand extends command_1.Command {
    async getMetadata() {
        const inputs = [];
        const options = [];
        const exampleCommands = [''];
        const footnotes = [];
        const groups = [];
        let description = this.project
            ? (0, color_1.failure)(`Generators are not supported in this project type (${(0, color_1.strong)((0, project_1.prettyProjectName)(this.project.type))}).`)
            : (0, color_1.failure)('Generators help is available within an Ionic project directory.');
        const runner = this.project && await this.project.getGenerateRunner();
        if (runner) {
            const libmetadata = await runner.getCommandMetadata();
            groups.push(...libmetadata.groups || []);
            inputs.push(...libmetadata.inputs || []);
            options.push(...libmetadata.options || []);
            description = (libmetadata.description || '').trim();
            footnotes.push(...libmetadata.footnotes || []);
            exampleCommands.push(...libmetadata.exampleCommands || []);
        }
        else {
            groups.push("hidden" /* MetadataGroup.HIDDEN */);
        }
        return {
            name: 'generate',
            type: 'project',
            summary: 'Create Pages, Components, & Angular Features',
            description,
            footnotes,
            inputs,
            options,
            groups,
            exampleCommands,
        };
    }
    async preRun(inputs, options) {
        const runner = this.project && await this.project.getGenerateRunner();
        if (runner) {
            await runner.ensureCommandLine(inputs, options);
        }
    }
    async run(inputs, options) {
        if (!this.project) {
            throw new errors_1.FatalException(`Cannot run ${(0, color_1.input)('ionic generate')} outside a project directory.`);
        }
        const runner = await this.project.requireGenerateRunner();
        const opts = runner.createOptionsFromCommandLine(inputs, options);
        await runner.run(opts);
    }
}
exports.GenerateCommand = GenerateCommand;
