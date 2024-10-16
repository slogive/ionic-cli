"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AngularGenerateRunner = void 0;
const tslib_1 = require("tslib");
const cli_framework_1 = require("@ionic/cli-framework");
const debug_1 = require("debug");
const lodash = tslib_1.__importStar(require("lodash"));
const color_1 = require("../../color");
const config_1 = require("../../config");
const errors_1 = require("../../errors");
const generate_1 = require("../../generate");
// https://github.com/ionic-team/angular-toolkit/blob/master/collection.json
const SCHEMATICS = ['page', 'component', 'service', 'module', 'class', 'directive', 'guard', 'pipe', 'interface', 'enum'];
const SCHEMATIC_ALIAS = new Map([
    ['pg', 'page'],
    ['cl', 'class'],
    ['c', 'component'],
    ['d', 'directive'],
    ['e', 'enum'],
    ['g', 'guard'],
    ['i', 'interface'],
    ['m', 'module'],
    ['p', 'pipe'],
    ['s', 'service'],
]);
const debug = (0, debug_1.debug)('ionic:lib:project:angular:generate');
class AngularGenerateRunner extends generate_1.GenerateRunner {
    constructor(e) {
        super();
        this.e = e;
    }
    async getCommandMetadata() {
        return {
            description: `
Automatically create framework features with Ionic Generate. This command uses the Angular CLI to generate features such as ${['pages', 'components', 'directives', 'services'].map(c => (0, color_1.input)(c)).join(', ')}, and more.

 - For a full list of available types, use ${(0, color_1.input)('npx ng g --help')}
 - For a list of options for a types, use ${(0, color_1.input)('npx ng g <type> --help')}

You can specify a path to nest your feature within any number of subdirectories. For example, specify a name of ${(0, color_1.input)('"pages/New Page"')} to generate page files at ${(0, color_1.strong)('src/app/pages/new-page/')}.

To test a generator before file modifications are made, use the ${(0, color_1.input)('--dry-run')} option.
      `,
            exampleCommands: [
                'page',
                'page contact',
                'component contact/form',
                'component login-form --change-detection=OnPush',
                'directive ripple --skip-import',
                'service api/user',
            ],
            inputs: [
                {
                    name: 'schematic',
                    summary: `The type of feature (e.g. ${['page', 'component', 'directive', 'service'].map(c => (0, color_1.input)(c)).join(', ')})`,
                    validators: [cli_framework_1.validators.required],
                },
                {
                    name: 'name',
                    summary: 'The name/path of the feature being generated',
                    validators: [cli_framework_1.validators.required],
                },
            ],
        };
    }
    async ensureCommandLine(inputs, options) {
        if (inputs[0]) {
            this.validateFeatureType(inputs[0]);
        }
        else {
            const schematic = await this.e.prompt({
                type: 'list',
                name: 'schematic',
                message: 'What would you like to generate?',
                choices: SCHEMATICS,
            });
            inputs[0] = schematic;
        }
        if (!inputs[1]) {
            const schematic = SCHEMATIC_ALIAS.get(inputs[0]) || inputs[0];
            const name = await this.e.prompt({
                type: 'input',
                name: 'name',
                message: `Name/path of ${(0, color_1.input)(schematic)}:`,
                validate: v => cli_framework_1.validators.required(v),
            });
            inputs[1] = name.trim();
        }
    }
    createOptionsFromCommandLine(inputs, options) {
        const [schematic, name] = inputs;
        const baseOptions = { name, schematic };
        const project = options['project'] ? String(options['project']) : 'app';
        // TODO: this is a little gross, is there a better way to pass in all the
        // options that the command got?
        return {
            ...lodash.omit(options, '_', '--', ...config_1.GLOBAL_OPTIONS.map(opt => opt.name)),
            project,
            ...baseOptions,
        };
    }
    async run(options) {
        const { name } = options;
        const schematic = SCHEMATIC_ALIAS.get(options.schematic) || options.schematic;
        try {
            await this.generateComponent(schematic, name, lodash.omit(options, 'schematic', 'name'));
        }
        catch (e) {
            debug(e);
            throw new errors_1.FatalException(`Could not generate ${(0, color_1.input)(schematic)}.`);
        }
        if (!options['dry-run']) {
            this.e.log.ok(`Generated ${(0, color_1.input)(schematic)}!`);
        }
    }
    validateFeatureType(schematic) {
        if (schematic === 'provider') {
            throw new errors_1.FatalException(`Please use ${(0, color_1.input)('ionic generate service')} for generating service providers.\n` +
                `For more information, please see the Angular documentation${(0, color_1.ancillary)('[1]')} on services.\n\n` +
                `${(0, color_1.ancillary)('[1]')}: ${(0, color_1.strong)('https://angular.io/guide/architecture-services')}`);
        }
        if (!SCHEMATICS.includes(schematic) && !SCHEMATIC_ALIAS.get(schematic)) {
            throw new errors_1.FatalException(`${(0, color_1.input)(schematic)} is not a known feature.\n` +
                `Use ${(0, color_1.input)('npx ng g --help')} to list available types of features.`);
        }
    }
    async generateComponent(schematic, name, options) {
        const args = {
            _: ['generate', schematic, name],
            // convert `--no-<opt>` style options to `--<opt>=false`
            ...lodash.mapValues(options, v => v === false ? 'false' : v),
        };
        await this.e.shell.run('ng', (0, cli_framework_1.unparseArgs)(args, { useEquals: true }), { cwd: this.e.ctx.execPath, stdio: 'inherit' });
    }
}
exports.AngularGenerateRunner = AngularGenerateRunner;
