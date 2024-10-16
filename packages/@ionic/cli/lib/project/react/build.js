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
exports.ReactBuildCLI = exports.ReactBuildRunner = void 0;
const build_1 = require("../../build");
const color_1 = require("../../color");
class ReactBuildRunner extends build_1.BuildRunner {
    constructor(e) {
        super();
        this.e = e;
    }
    async getCommandMetadata() {
        return {
            description: `
This command will convert options to the environment variables used by React Scripts. See the ${(0, color_1.input)('create-react-app')} docs[^cra-build-docs] for explanations.
      `,
            footnotes: [
                {
                    id: 'cra-build-docs',
                    url: 'https://facebook.github.io/create-react-app/docs/advanced-configuration',
                },
            ],
            options: [
                {
                    name: 'public-url',
                    summary: 'The URL at which the app will be served',
                    groups: ['cordova'],
                    spec: { value: 'url' },
                    hint: (0, color_1.weak)('[react-scripts]'),
                },
                {
                    name: 'ci',
                    summary: `Treat warnings as build failures, test runner does not watch`,
                    type: Boolean,
                    groups: ['cordova'],
                    hint: (0, color_1.weak)('[react-scripts]'),
                },
                {
                    name: 'source-map',
                    summary: 'Do not generate source maps',
                    type: Boolean,
                    groups: ['cordova'],
                    default: true,
                    hint: (0, color_1.weak)('[react-scripts]'),
                },
                {
                    name: 'inline-runtime-chunk',
                    summary: `Do not include the runtime script in ${(0, color_1.input)('index.html')} (import instead)`,
                    type: Boolean,
                    groups: ['cordova'],
                    default: true,
                    hint: (0, color_1.weak)('[react-scripts]'),
                },
            ],
        };
    }
    createOptionsFromCommandLine(inputs, options) {
        const baseOptions = super.createBaseOptionsFromCommandLine(inputs, options);
        const publicUrl = options['public-url'] ? String(options['public-url']) : undefined;
        const ci = options['ci'] ? Boolean(options['ci']) : undefined;
        const sourceMap = options['source-map'] ? Boolean(options['source-map']) : undefined;
        const inlineRuntimeChunk = options['inline-runtime-check'] ? Boolean(options['inline-runtime-check']) : undefined;
        return {
            ...baseOptions,
            type: 'react',
            publicUrl,
            ci,
            sourceMap,
            inlineRuntimeChunk,
        };
    }
    async buildProject(options) {
        const reactScripts = new ReactBuildCLI(this.e);
        await reactScripts.build(options);
    }
}
exports.ReactBuildRunner = ReactBuildRunner;
class ReactBuildCLI extends build_1.BuildCLI {
    constructor() {
        super(...arguments);
        this.name = 'React Scripts';
        this.pkg = 'react-scripts';
        this.program = 'react-scripts';
        this.prefix = 'react-scripts';
        this.script = build_1.BUILD_SCRIPT;
    }
    async buildArgs(options) {
        const { pkgManagerArgs } = await Promise.resolve().then(() => __importStar(require('../../utils/npm')));
        if (this.resolvedProgram === this.program) {
            return ['build'];
        }
        else {
            const [, ...pkgArgs] = await pkgManagerArgs(this.e.config.get('npmClient'), { command: 'run', script: this.script });
            return pkgArgs;
        }
    }
    async buildEnvVars(options) {
        const env = {};
        if (options.publicUrl) {
            env.PUBLIC_URL = options.publicUrl;
        }
        if (options.ci) {
            env.CI = '1';
        }
        if (!options.sourceMap) {
            env.GENERATE_SOURCEMAP = 'false';
        }
        if (!options.inlineRuntimeChunk) {
            env.INLINE_RUNTIME_CHUNK = 'false';
        }
        return { ...await super.buildEnvVars(options), ...env };
    }
}
exports.ReactBuildCLI = ReactBuildCLI;
