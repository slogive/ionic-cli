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
exports.AngularBuildCLI = exports.AngularBuildRunner = void 0;
const cli_framework_1 = require("@ionic/cli-framework");
const build_1 = require("../../build");
const color_1 = require("../../color");
const NG_BUILD_OPTIONS = [
    {
        name: 'configuration',
        aliases: ['c'],
        summary: 'Specify the configuration to use.',
        type: String,
        groups: ["advanced" /* MetadataGroup.ADVANCED */, 'cordova'],
        hint: (0, color_1.weak)('[ng]'),
        spec: { value: 'conf' },
    },
    {
        name: 'source-map',
        summary: 'Output source maps',
        type: Boolean,
        groups: ["advanced" /* MetadataGroup.ADVANCED */, 'cordova'],
        hint: (0, color_1.weak)('[ng]'),
    },
    {
        name: 'watch',
        summary: 'Rebuild when files change',
        type: Boolean,
        groups: ["advanced" /* MetadataGroup.ADVANCED */],
        hint: (0, color_1.weak)('[ng]'),
    },
];
class AngularBuildRunner extends build_1.BuildRunner {
    constructor(e) {
        super();
        this.e = e;
    }
    async getCommandMetadata() {
        return {
            description: `
${(0, color_1.input)('ionic build')} uses the Angular CLI. Use ${(0, color_1.input)('ng build --help')} to list all Angular CLI options for building your app. See the ${(0, color_1.input)('ng build')} docs[^ng-build-docs] for explanations. Options not listed below are considered advanced and can be passed to the ${(0, color_1.input)('ng')} CLI using the ${(0, color_1.input)('--')} separator after the Ionic CLI arguments. See the examples.
`,
            footnotes: [
                {
                    id: 'ng-build-docs',
                    url: 'https://angular.io/cli/build',
                },
            ],
            options: [
                {
                    name: 'prod',
                    summary: `Flag to use the ${(0, color_1.input)('production')} configuration`,
                    type: Boolean,
                    hint: (0, color_1.weak)('[ng]'),
                    groups: ['cordova'],
                },
                ...NG_BUILD_OPTIONS,
                {
                    name: 'cordova-assets',
                    summary: 'Do not bundle Cordova assets during Cordova build',
                    type: Boolean,
                    groups: ["hidden" /* MetadataGroup.HIDDEN */, 'cordova'],
                    default: true,
                },
            ],
            exampleCommands: [
                '--prod',
                '--watch',
            ],
        };
    }
    createOptionsFromCommandLine(inputs, options) {
        const baseOptions = super.createBaseOptionsFromCommandLine(inputs, options);
        const prod = options['prod'] ? Boolean(options['prod']) : undefined;
        const configuration = options['configuration'] ? String(options['configuration']) : (prod ? 'production' : undefined);
        const project = options['project'] ? String(options['project']) : 'app';
        const sourcemaps = typeof options['source-map'] === 'boolean' ? Boolean(options['source-map']) : undefined;
        const cordovaAssets = typeof options['cordova-assets'] === 'boolean' ? Boolean(options['cordova-assets']) : undefined;
        const watch = typeof options['watch'] === 'boolean' ? Boolean(options['watch']) : undefined;
        return {
            ...baseOptions,
            configuration,
            project,
            sourcemaps,
            cordovaAssets,
            watch,
            type: 'angular',
        };
    }
    async buildProject(options) {
        const ng = new AngularBuildCLI(this.e);
        await ng.build(options);
    }
}
exports.AngularBuildRunner = AngularBuildRunner;
class AngularBuildCLI extends build_1.BuildCLI {
    constructor() {
        super(...arguments);
        this.name = 'Angular CLI';
        this.pkg = '@angular/cli';
        this.program = 'ng';
        this.prefix = 'ng';
        this.script = build_1.BUILD_SCRIPT;
    }
    async buildArgs(options) {
        const { pkgManagerArgs } = await Promise.resolve().then(() => __importStar(require('../../utils/npm')));
        const args = await this.buildOptionsToNgArgs(options);
        if (this.resolvedProgram === this.program) {
            return [...this.buildArchitectCommand(options), ...args];
        }
        else {
            const [, ...pkgArgs] = await pkgManagerArgs(this.e.config.get('npmClient'), { command: 'run', script: this.script, scriptArgs: [...args] });
            return pkgArgs;
        }
    }
    async buildOptionsToNgArgs(options) {
        const args = {
            _: [],
            'source-map': options.sourcemaps !== false ? options.sourcemaps : 'false',
            'cordova-assets': options.cordovaAssets !== false ? undefined : 'false',
            'watch': options.watch !== false ? options.watch : 'false',
        };
        const projectArgs = [];
        let separatedArgs = options['--'];
        if (options.engine === 'cordova') {
            const integration = this.e.project.requireIntegration('cordova');
            args.platform = options.platform;
            if (this.e.project.rootDirectory !== integration.root) {
                args.cordovaBasePath = integration.root;
            }
            separatedArgs = [];
        }
        if (this.resolvedProgram !== this.program) {
            if (options.configuration) {
                projectArgs.push(`--configuration=${options.configuration}`);
            }
            if (options.project) {
                projectArgs.push(`--project=${options.project}`);
            }
        }
        if (options.verbose) {
            projectArgs.push('--verbose');
        }
        return [...(0, cli_framework_1.unparseArgs)(args), ...projectArgs, ...separatedArgs];
    }
    buildArchitectCommand(options) {
        const cmd = options.engine === 'cordova' ? 'ionic-cordova-build' : 'build';
        return ['run', `${options.project}:${cmd}${options.configuration ? `:${options.configuration}` : ''}`];
    }
}
exports.AngularBuildCLI = AngularBuildCLI;
