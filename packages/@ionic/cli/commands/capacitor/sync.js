"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncCommand = void 0;
const tslib_1 = require("tslib");
const cli_framework_1 = require("@ionic/cli-framework");
const color_1 = require("../../lib/color");
const errors_1 = require("../../lib/errors");
const hooks_1 = require("../../lib/hooks");
const base_1 = require("./base");
const semver = tslib_1.__importStar(require("semver"));
class SyncCommand extends base_1.CapacitorCommand {
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
                summary: 'Use inline source maps  (only available on capacitor 4.1.0+)',
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
            name: 'sync',
            type: 'project',
            summary: 'Sync (copy + update) an Ionic project',
            description: `
${(0, color_1.input)('ionic capacitor sync')} will do the following:
- Perform an Ionic build, which compiles web assets
- Copy web assets to Capacitor native platform(s)
- Update Capacitor native platform(s) and dependencies
- Install any discovered Capacitor or Cordova plugins
      `,
            inputs: [
                {
                    name: 'platform',
                    summary: `The platform to sync (e.g. ${['android', 'ios'].map(v => (0, color_1.input)(v)).join(', ')})`,
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
        if (!this.project) {
            throw new errors_1.FatalException(`Cannot run ${(0, color_1.input)('ionic capacitor sync')} outside a project directory.`);
        }
        const [platform] = inputs;
        if (options.build) {
            await this.runBuild(inputs, options);
        }
        const args = ['sync'];
        const capVersion = await this.getCapacitorVersion();
        if (semver.gte(capVersion, "4.1.0") && options.inline) {
            args.push("--inline");
        }
        if (platform) {
            args.push(platform);
        }
        await this.runCapacitor(args);
        const hookDeps = {
            config: this.env.config,
            project: this.project,
            shell: this.env.shell,
        };
        await this.runCapacitorSyncHook('capacitor:sync:after', inputs, options, hookDeps);
    }
    async runCapacitorSyncHook(name, inputs, options, e) {
        const hook = new CapacitorSyncHook(name, e);
        const buildRunner = await e.project.requireBuildRunner();
        try {
            await hook.run({
                name: hook.name,
                build: buildRunner.createOptionsFromCommandLine(inputs, options),
                capacitor: await this.createOptionsFromCommandLine(inputs, options),
            });
        }
        catch (e) {
            if (e instanceof cli_framework_1.BaseError) {
                throw new errors_1.FatalException(e.message);
            }
            throw e;
        }
    }
}
exports.SyncCommand = SyncCommand;
class CapacitorSyncHook extends hooks_1.Hook {
    constructor(name, e) {
        super(e);
        this.name = name;
    }
}
