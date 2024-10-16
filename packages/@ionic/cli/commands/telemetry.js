"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryCommand = void 0;
const color_1 = require("../lib/color");
const command_1 = require("../lib/command");
const errors_1 = require("../lib/errors");
class TelemetryCommand extends command_1.Command {
    async getMetadata() {
        return {
            name: 'telemetry',
            type: 'global',
            summary: 'Opt in and out of telemetry',
            groups: ["hidden" /* MetadataGroup.HIDDEN */],
            inputs: [
                {
                    name: 'status',
                    summary: `${(0, color_1.input)('on')} or ${(0, color_1.input)('off')}`,
                },
            ],
        };
    }
    async run(inputs, options) {
        throw new errors_1.FatalException(`${(0, color_1.input)('ionic telemetry')} has been removed.\n` +
            `Please use ${(0, color_1.input)('ionic config')} directly. Examples:\n\n` +
            `    ${(0, color_1.input)('ionic config get -g telemetry')}\n` +
            `    ${(0, color_1.input)('ionic config set -g telemetry true')}\n` +
            `    ${(0, color_1.input)('ionic config set -g telemetry false')}`);
    }
}
exports.TelemetryCommand = TelemetryCommand;
