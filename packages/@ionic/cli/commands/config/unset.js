"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigUnsetCommand = void 0;
const cli_framework_1 = require("@ionic/cli-framework");
const utils_terminal_1 = require("@ionic/utils-terminal");
const constants_1 = require("../../constants");
const color_1 = require("../../lib/color");
const errors_1 = require("../../lib/errors");
const base_1 = require("./base");
class ConfigUnsetCommand extends base_1.BaseConfigCommand {
    async getMetadata() {
        const projectFile = this.project ? (0, utils_terminal_1.prettyPath)(this.project.filePath) : constants_1.PROJECT_FILE;
        return {
            name: 'unset',
            type: 'global',
            summary: 'Delete config values',
            description: `
This command deletes configuration values from the project's ${(0, color_1.strong)((0, utils_terminal_1.prettyPath)(projectFile))} file. It can also operate on the global CLI configuration (${(0, color_1.strong)('~/.ionic/config.json')}) using the ${(0, color_1.input)('--global')} option.

For nested properties, separate nest levels with dots. For example, the property name ${(0, color_1.input)('integrations.cordova')} will look in the ${(0, color_1.strong)('integrations')} object for the ${(0, color_1.strong)('cordova')} property.

For multi-app projects, this command is scoped to the current project by default. To operate at the root of the project configuration file instead, use the ${(0, color_1.input)('--root')} option.
      `,
            inputs: [
                {
                    name: 'property',
                    summary: 'The property name you wish to delete',
                    validators: [cli_framework_1.validators.required],
                },
            ],
            options: [
                {
                    name: 'global',
                    summary: 'Use global CLI config',
                    type: Boolean,
                    aliases: ['g'],
                },
                {
                    name: 'root',
                    summary: `Operate on root of ${(0, color_1.strong)((0, utils_terminal_1.prettyPath)(projectFile))}`,
                    type: Boolean,
                    hint: (0, color_1.weak)('[multi-app]'),
                    groups: ["advanced" /* MetadataGroup.ADVANCED */],
                },
            ],
            exampleCommands: ['', 'type', '--global git.setup', '-g interactive'],
        };
    }
    async run(inputs, options) {
        const ctx = this.generateContext(inputs, options);
        const { property } = ctx;
        if (typeof property === 'undefined') {
            throw new errors_1.FatalException(`Cannot unset config entry without a property.`);
        }
        const propertyExists = typeof (0, base_1.getConfigValue)(ctx) !== 'undefined';
        (0, base_1.unsetConfigValue)({ ...ctx, property });
        if (propertyExists) {
            this.env.log.ok(`${(0, color_1.input)(property)} unset!`);
        }
        else {
            this.env.log.warn(`Property ${(0, color_1.input)(property)} does not exist--cannot unset.`);
        }
    }
}
exports.ConfigUnsetCommand = ConfigUnsetCommand;
