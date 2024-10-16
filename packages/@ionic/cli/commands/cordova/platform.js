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
exports.PlatformCommand = void 0;
const cli_framework_1 = require("@ionic/cli-framework");
const color_1 = require("../../lib/color");
const cordova_res_1 = require("../../lib/cordova-res");
const errors_1 = require("../../lib/errors");
const executor_1 = require("../../lib/executor");
const base_1 = require("./base");
class PlatformCommand extends base_1.CordovaCommand {
    async getMetadata() {
        return {
            name: 'platform',
            type: 'project',
            summary: 'Manage Cordova platform targets',
            description: `
Like running ${(0, color_1.input)('cordova platform')} directly, but adds default Ionic icons and splash screen resources (during ${(0, color_1.input)('add')}) and provides friendly checks.
      `,
            exampleCommands: ['', 'add ios', 'add android', 'rm ios'],
            inputs: [
                {
                    name: 'action',
                    summary: `${(0, color_1.input)('add')}, ${(0, color_1.input)('remove')}, or ${(0, color_1.input)('update')} a platform; ${(0, color_1.input)('ls')}, ${(0, color_1.input)('check')}, or ${(0, color_1.input)('save')} all project platforms`,
                },
                {
                    name: 'platform',
                    summary: `The platform that you would like to add (${['android', 'ios'].map(v => (0, color_1.input)(v)).join(', ')})`,
                },
            ],
            options: [
                {
                    name: 'resources',
                    summary: `Do not pregenerate icons and splash screen resources (corresponds to ${(0, color_1.input)('add')})`,
                    type: Boolean,
                    default: true,
                },
            ],
        };
    }
    async preRun(inputs, options, runinfo) {
        await this.preRunChecks(runinfo);
        if (options['r'] || options['noresources']) {
            options['resources'] = false;
        }
        inputs[0] = !inputs[0] ? 'ls' : inputs[0];
        inputs[0] = (inputs[0] === 'rm') ? 'remove' : inputs[0];
        inputs[0] = (inputs[0] === 'list') ? 'ls' : inputs[0];
        (0, cli_framework_1.validate)(inputs[0], 'action', [(0, cli_framework_1.contains)(['add', 'remove', 'update', 'ls', 'check', 'save'], {})]);
        // If the action is list, check, or save, then just end here.
        if (['ls', 'check', 'save'].includes(inputs[0])) {
            await this.runCordova(['platform', inputs[0]], {});
            throw new errors_1.FatalException('', 0);
        }
        if (!inputs[1]) {
            const platform = await this.env.prompt({
                type: 'input',
                name: 'platform',
                message: `What platform would you like to ${inputs[0]} (${['android', 'ios'].map(v => (0, color_1.input)(v)).join(', ')}):`,
            });
            inputs[1] = platform.trim();
        }
        (0, cli_framework_1.validate)(inputs[1], 'platform', [cli_framework_1.validators.required]);
    }
    async run(inputs, options, runinfo) {
        const { getPlatforms } = await Promise.resolve().then(() => __importStar(require('../../lib/integrations/cordova/project')));
        const { confirmCordovaBrowserUsage, filterArgumentsForCordova } = await Promise.resolve().then(() => __importStar(require('../../lib/integrations/cordova/utils')));
        if (!this.project) {
            throw new errors_1.FatalException(`Cannot run ${(0, color_1.input)('ionic cordova platform')} outside a project directory.`);
        }
        const [action, platformName] = inputs;
        const platforms = await getPlatforms(this.integration.root);
        if (action === 'add') {
            if (platforms.includes(platformName)) {
                this.env.log.msg(`Platform ${platformName} already exists.`);
                return;
            }
            if (platformName === 'browser') {
                const confirm = await confirmCordovaBrowserUsage(this.env);
                if (!confirm) {
                    return;
                }
            }
        }
        const metadata = await this.getMetadata();
        const cordovaArgs = filterArgumentsForCordova(metadata, options);
        await this.runCordova(cordovaArgs, {});
        if (action === 'add' && options['resources'] && cordova_res_1.SUPPORTED_PLATFORMS.includes(platformName)) {
            const args = ['cordova', 'resources', platformName, '--force'];
            const p = await (0, cordova_res_1.findCordovaRes)();
            if (p) {
                await (0, executor_1.runCommand)(runinfo, args);
            }
            else {
                this.env.log.warn(await (0, cordova_res_1.createCordovaResNotFoundMessage)(this.env.config.get('npmClient')));
                this.env.log.warn(`Cannot generate resources without ${(0, color_1.input)('cordova-res')} installed.\n` +
                    `Once installed, you can generate resources with the following command:\n\n` +
                    (0, color_1.input)(['ionic', ...args].join(' ')));
            }
        }
    }
}
exports.PlatformCommand = PlatformCommand;
