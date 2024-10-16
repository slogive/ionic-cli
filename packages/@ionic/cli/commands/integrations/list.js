"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsListCommand = void 0;
const tslib_1 = require("tslib");
const utils_terminal_1 = require("@ionic/utils-terminal");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const color_1 = require("../../lib/color");
const command_1 = require("../../lib/command");
const errors_1 = require("../../lib/errors");
const integrations_1 = require("../../lib/integrations");
class IntegrationsListCommand extends command_1.Command {
    async getMetadata() {
        return {
            name: 'list',
            type: 'project',
            summary: 'List available and active integrations in your app',
            description: `
This command will print the status of integrations in Ionic projects. Integrations can be ${(0, color_1.strong)('enabled')} (added and enabled), ${(0, color_1.strong)('disabled')} (added but disabled), and ${(0, color_1.strong)('not added')} (never added to the project).

- To enable or add integrations, see ${(0, color_1.input)('ionic integrations enable --help')}
- To disable integrations, see ${(0, color_1.input)('ionic integrations disable --help')}
      `,
        };
    }
    async run(inputs, options) {
        const { project } = this;
        if (!project) {
            throw new errors_1.FatalException(`Cannot run ${(0, color_1.input)('ionic integrations list')} outside a project directory.`);
        }
        const integrations = await Promise.all(integrations_1.INTEGRATION_NAMES.map(async (name) => project.createIntegration(name)));
        const status = (name) => {
            const c = project.config.get('integrations')[name];
            if (c) {
                if (c.enabled === false) {
                    return chalk_1.default.dim.red('disabled');
                }
                return chalk_1.default.green('enabled');
            }
            return chalk_1.default.dim('not added');
        };
        this.env.log.rawmsg((0, utils_terminal_1.columnar)(integrations.map(i => [(0, color_1.input)(i.name), i.summary, status(i.name)]), { headers: ['name', 'summary', 'status'] }));
    }
}
exports.IntegrationsListCommand = IntegrationsListCommand;
