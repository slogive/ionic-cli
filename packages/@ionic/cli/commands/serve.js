"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServeCommand = void 0;
const tslib_1 = require("tslib");
const utils_process_1 = require("@ionic/utils-process");
const lodash = tslib_1.__importStar(require("lodash"));
const color_1 = require("../lib/color");
const command_1 = require("../lib/command");
const errors_1 = require("../lib/errors");
const serve_1 = require("../lib/serve");
class ServeCommand extends command_1.Command {
    async getMetadata() {
        const groups = [];
        let options = [
            ...serve_1.COMMON_SERVE_COMMAND_OPTIONS,
            {
                name: 'open',
                summary: 'Do not open a browser window',
                type: Boolean,
                default: true,
                // TODO: Adding 'b' to aliases here has some weird behavior with minimist.
            },
            {
                name: 'browser',
                summary: `Specifies the browser to use (${serve_1.BROWSERS.map(b => (0, color_1.input)(b)).join(', ')})`,
                aliases: ['w'],
                groups: ["advanced" /* MetadataGroup.ADVANCED */],
            },
            {
                name: 'browseroption',
                summary: `Specifies a path to open to (${(0, color_1.input)('/#/tab/dash')})`,
                aliases: ['o'],
                groups: ["advanced" /* MetadataGroup.ADVANCED */],
                spec: { value: 'path' },
            },
        ];
        const exampleCommands = ['', '--external'];
        const footnotes = [];
        let description = `
Easily spin up a development server which launches in your browser. It watches for changes in your source files and automatically reloads with the updated build.

By default, ${(0, color_1.input)('ionic serve')} boots up a development server on ${(0, color_1.input)('localhost')}. To serve to your LAN, specify the ${(0, color_1.input)('--external')} option, which will use all network interfaces and print the external address(es) on which your app is being served.`;
        const runner = this.project && await this.project.getServeRunner();
        if (runner) {
            const libmetadata = await runner.getCommandMetadata();
            groups.push(...libmetadata.groups || []);
            options = lodash.uniqWith([...libmetadata.options || [], ...options], (optionA, optionB) => optionA.name === optionB.name);
            description += `\n\n${(libmetadata.description || '').trim()}`;
            footnotes.push(...libmetadata.footnotes || []);
            exampleCommands.push(...libmetadata.exampleCommands || []);
        }
        return {
            name: 'serve',
            type: 'project',
            summary: 'Start a local dev server for app dev/testing',
            description,
            footnotes,
            groups,
            exampleCommands,
            options,
        };
    }
    async preRun(inputs, options, { location }) {
        if (options['nolivereload']) {
            this.env.log.warn(`The ${(0, color_1.input)('--nolivereload')} option has been deprecated. Please use ${(0, color_1.input)('--no-livereload')}.`);
            options['livereload'] = false;
        }
        if (options['nobrowser']) {
            this.env.log.warn(`The ${(0, color_1.input)('--nobrowser')} option has been deprecated. Please use ${(0, color_1.input)('--no-open')}.`);
            options['open'] = false;
        }
        if (options['b']) {
            options['open'] = false;
        }
        if (options['noproxy']) {
            this.env.log.warn(`The ${(0, color_1.input)('--noproxy')} option has been deprecated. Please use ${(0, color_1.input)('--no-proxy')}.`);
            options['proxy'] = false;
        }
        if (options['x']) {
            options['proxy'] = false;
        }
    }
    async run(inputs, options, runinfo) {
        if (!this.project) {
            throw new errors_1.FatalException(`Cannot run ${(0, color_1.input)('ionic serve')} outside a project directory.`);
        }
        try {
            const runner = await this.project.requireServeRunner();
            const runnerOpts = runner.createOptionsFromCommandLine(inputs, options);
            await runner.run(runnerOpts);
        }
        catch (e) {
            if (e instanceof errors_1.RunnerException) {
                throw new errors_1.FatalException(e.message);
            }
            throw e;
        }
        await (0, utils_process_1.sleepForever)();
    }
}
exports.ServeCommand = ServeCommand;
