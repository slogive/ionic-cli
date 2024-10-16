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
exports.PrepareCommand = void 0;
const color_1 = require("../../lib/color");
const errors_1 = require("../../lib/errors");
const utils_1 = require("../../lib/integrations/cordova/utils");
const base_1 = require("./base");
class PrepareCommand extends base_1.CordovaCommand {
    async getMetadata() {
        const options = [
            {
                name: 'build',
                summary: 'Do not invoke an Ionic build',
                type: Boolean,
                default: true,
            },
        ];
        const footnotes = [];
        const runner = this.project && await this.project.getBuildRunner();
        if (runner) {
            const libmetadata = await runner.getCommandMetadata();
            options.push(...libmetadata.options || []);
            footnotes.push(...libmetadata.footnotes || []);
        }
        return {
            name: 'prepare',
            type: 'project',
            summary: 'Copies assets to Cordova platforms, preparing them for native builds',
            description: `
${(0, color_1.input)('ionic cordova prepare')} will do the following:

- Perform an Ionic build, which compiles web assets to ${(0, color_1.strong)('www/')}.
- Copy the ${(0, color_1.strong)('www/')} directory into your Cordova platforms.
- Transform ${(0, color_1.strong)('config.xml')} into platform-specific manifest files.
- Copy icons and splash screens from ${(0, color_1.strong)('resources/')} to into your Cordova platforms.
- Copy plugin files into specified platforms.

You may wish to use ${(0, color_1.input)('ionic cordova prepare')} if you run your project with Android Studio or Xcode.
      `,
            footnotes,
            exampleCommands: ['', 'ios', 'android'],
            inputs: [
                {
                    name: 'platform',
                    summary: `The platform you would like to prepare (e.g. ${['android', 'ios'].map(v => (0, color_1.input)(v)).join(', ')})`,
                },
            ],
            options,
        };
    }
    async preRun(inputs, options, runinfo) {
        await this.preRunChecks(runinfo);
    }
    async run(inputs, options) {
        const { loadCordovaConfig } = await Promise.resolve().then(() => __importStar(require('../../lib/integrations/cordova/config')));
        const { getPlatforms } = await Promise.resolve().then(() => __importStar(require('../../lib/integrations/cordova/project')));
        const [platform] = inputs;
        if (!this.project) {
            throw new errors_1.FatalException(`Cannot run ${(0, color_1.input)('ionic cordova prepare')} outside a project directory.`);
        }
        if (platform) {
            await this.checkForPlatformInstallation(platform, {
                promptToInstall: true,
                promptToInstallRefusalMsg: (`Cannot prepare for ${(0, color_1.input)(platform)} unless the platform is installed.\n` +
                    `Did you mean just ${(0, color_1.input)('ionic cordova prepare')}?\n`),
            });
        }
        else {
            const conf = await loadCordovaConfig(this.integration);
            const platforms = await getPlatforms(this.integration.root);
            const configuredPlatforms = conf.getConfiguredPlatforms();
            if (configuredPlatforms.length === 0 && platforms.length === 0) {
                this.env.log.warn(`No platforms added to this project. Cannot prepare native platforms without any installed.\n` +
                    `Run ${(0, color_1.input)('ionic cordova platform add <platform>')} to add native platforms.`);
                throw new errors_1.FatalException('', 0);
            }
        }
        const metadata = await this.getMetadata();
        if (options.build) {
            const buildOptions = (0, utils_1.generateOptionsForCordovaBuild)(metadata, inputs, options);
            if (buildOptions['platform']) {
                try {
                    const runner = await this.project.requireBuildRunner();
                    const runnerOpts = runner.createOptionsFromCommandLine(inputs, buildOptions);
                    await runner.run(runnerOpts);
                }
                catch (e) {
                    if (e instanceof errors_1.RunnerException) {
                        throw new errors_1.FatalException(e.message);
                    }
                    throw e;
                }
            }
            else {
                this.env.log.warn(`Cannot perform Ionic build without ${(0, color_1.input)('platform')}. Falling back to just ${(0, color_1.input)('cordova prepare')}.\n` +
                    `Please supply a ${(0, color_1.input)('platform')} (e.g. ${['android', 'ios'].map(v => (0, color_1.input)(v)).join(', ')}) so the Ionic CLI can build web assets. The ${(0, color_1.input)('--no-build')} option will hide this warning.`);
                this.env.log.nl();
            }
        }
        await this.runCordova((0, utils_1.filterArgumentsForCordova)(metadata, options), { stdio: 'inherit' });
    }
}
exports.PrepareCommand = PrepareCommand;
