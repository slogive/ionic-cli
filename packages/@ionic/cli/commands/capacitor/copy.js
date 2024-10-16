"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopyCommand = void 0;
const tslib_1 = require("tslib");
const color_1 = require("../../lib/color");
const base_1 = require("./base");
const semver = tslib_1.__importStar(require("semver"));
class CopyCommand extends base_1.CapacitorCommand {
    async getMetadata() {
        const options = [
            {
                name: 'build',
                summary: 'Do not invoke an Ionic build',
                type: Boolean,
                default: true,
            },
            {
                name: 'inline',
                summary: 'Use inline source maps (only available on capacitor 4.2.0+)',
                type: Boolean,
                default: false
            }
        ];
        const runner = this.project && await this.project.getBuildRunner();
        if (runner) {
            const libmetadata = await runner.getCommandMetadata();
            options.push(...libmetadata.options || []);
        }
        return {
            name: 'copy',
            type: 'project',
            summary: 'Copy web assets to native platforms',
            description: `
${(0, color_1.input)('ionic capacitor copy')} will do the following:
- Perform an Ionic build, which compiles web assets
- Copy web assets to Capacitor native platform(s)
      `,
            inputs: [
                {
                    name: 'platform',
                    summary: `The platform to copy (e.g. ${['android', 'ios'].map(v => (0, color_1.input)(v)).join(', ')})`,
                },
            ],
            options,
        };
    }
    async preRun(inputs, options, runinfo) {
        await this.preRunChecks(runinfo);
        if (inputs[0]) {
            await this.checkForPlatformInstallation(inputs[0]);
        }
    }
    async run(inputs, options) {
        const [platform] = inputs;
        if (options.build) {
            await this.runBuild(inputs, options);
        }
        const args = ['copy'];
        const capVersion = await this.getCapacitorVersion();
        if (semver.gte(capVersion, "4.2.0") && options.inline) {
            args.push("--inline");
        }
        if (platform) {
            args.push(platform);
        }
        await this.runCapacitor(args);
    }
}
exports.CopyCommand = CopyCommand;
