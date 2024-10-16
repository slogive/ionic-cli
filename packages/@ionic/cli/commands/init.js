"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitCommand = void 0;
const tslib_1 = require("tslib");
const cli_framework_1 = require("@ionic/cli-framework");
const string_1 = require("@ionic/cli-framework/utils/string");
const utils_terminal_1 = require("@ionic/utils-terminal");
const path = tslib_1.__importStar(require("path"));
const constants_1 = require("../constants");
const color_1 = require("../lib/color");
const command_1 = require("../lib/command");
const errors_1 = require("../lib/errors");
const project_1 = require("../lib/project");
class InitCommand extends command_1.Command {
    async getMetadata() {
        return {
            name: 'init',
            type: 'global',
            summary: 'Initialize existing projects with Ionic',
            description: `
This command will initialize an Ionic app within the current directory. Usually, this means an ${(0, color_1.input)(constants_1.PROJECT_FILE)} file is created. If used within a multi-app project, the app is initialized in the root ${(0, color_1.input)(constants_1.PROJECT_FILE)}.

${(0, color_1.input)('ionic init')} will prompt for a project name and then proceed to determine the type of your project. You can specify the ${(0, color_1.input)('name')} argument and ${(0, color_1.input)('--type')} option to provide these values via command-line.

If the ${(0, color_1.input)('--multi-app')} flag is specified, this command will initialize your project as a multi-app project, allowing for apps within monorepos and unconventional repository structures. See the multi-app docs[^multi-app-docs] for details. Once a multi-app project is initialized, you can run ${(0, color_1.input)('ionic init')} again within apps in your project to initialize them.
      `,
            exampleCommands: [
                '',
                '"My App"',
                '"My App" --type=angular',
                '--multi-app',
            ],
            inputs: [
                {
                    name: 'name',
                    summary: `The name of your project (e.g. ${(0, color_1.input)('myApp')}, ${(0, color_1.input)('"My App"')})`,
                },
            ],
            options: [
                {
                    name: 'type',
                    summary: `Type of project (e.g. ${constants_1.MODERN_PROJECT_TYPES.map(type => (0, color_1.input)(type)).join(', ')})`,
                },
                {
                    name: 'force',
                    summary: 'Initialize even if a project already exists',
                    type: Boolean,
                    aliases: ['f'],
                    default: false,
                },
                {
                    name: 'multi-app',
                    summary: 'Initialize a multi-app project',
                    type: Boolean,
                    default: false,
                },
                {
                    name: 'project-id',
                    summary: 'Specify a slug for your app',
                    groups: ["advanced" /* MetadataGroup.ADVANCED */],
                    spec: { value: 'slug' },
                    hint: (0, color_1.weak)('[multi-app]'),
                },
                {
                    name: 'default',
                    summary: 'Mark the initialized app as the default project',
                    type: Boolean,
                    groups: ["advanced" /* MetadataGroup.ADVANCED */],
                    hint: (0, color_1.weak)('[multi-app]'),
                },
            ],
            groups: ["beta" /* MetadataGroup.BETA */],
            footnotes: [
                {
                    id: 'multi-app-docs',
                    url: 'https://ionicframework.com/docs/cli/configuration#multi-app-projects',
                    shortUrl: 'https://ion.link/multi-app-docs',
                },
            ],
        };
    }
    async preRun(inputs, options) {
        const force = options['force'] ? true : false;
        if (this.project && !force) {
            // TODO: check for existing project config in multi-app
            if (this.project.details.context === 'app' || (this.project.details.context === 'multiapp' && options['multi-app'])) {
                throw new errors_1.FatalException(`Existing Ionic project file found: ${(0, color_1.strong)((0, utils_terminal_1.prettyPath)(this.project.filePath))}\n` +
                    `You can re-initialize your project using the ${(0, color_1.input)('--force')} option.`);
            }
        }
        if (!options['multi-app']) {
            if (!inputs[0]) {
                const name = await this.env.prompt({
                    type: 'input',
                    name: 'name',
                    message: 'Project name:',
                    validate: v => cli_framework_1.validators.required(v),
                });
                inputs[0] = name;
            }
            if (!options['type']) {
                const details = new project_1.ProjectDetails({ rootDirectory: this.env.ctx.execPath, e: this.env });
                options['type'] = await details.getTypeFromDetection();
            }
            if (!options['type']) {
                if (this.env.flags.interactive) {
                    this.env.log.warn(`Could not determine project type.\n` +
                        `Please choose a project type from the list.`);
                    this.env.log.nl();
                }
                const type = await this.env.prompt({
                    type: 'list',
                    name: 'type',
                    message: 'Project type:',
                    choices: constants_1.MODERN_PROJECT_TYPES.map(t => ({
                        name: `${(0, project_1.prettyProjectName)(t)} (${(0, color_1.input)(t)})`,
                        value: t,
                    })),
                });
                options['type'] = type;
            }
        }
    }
    async run(inputs, options) {
        if (options['multi-app']) {
            await this.initializeMultiProject(inputs, options);
        }
        else {
            await this.initializeApp(inputs, options);
        }
        this.env.log.ok('Your Ionic project has been initialized!');
    }
    async initializeMultiProject(inputs, options) {
        const configPath = this.getProjectFilePath();
        const config = new project_1.MultiProjectConfig(configPath);
        config.c = { projects: {} };
    }
    async initializeApp(inputs, options) {
        const name = inputs[0] ? inputs[0].trim() : '';
        const type = options['type'] ? String(options['type']) : undefined;
        const projectId = options['project-id'] ? String(options['project-id']) : (0, string_1.slugify)(name); // TODO validate --project-id
        if (!name) {
            throw new errors_1.FatalException(`Project name not specified.\n` +
                `Please specify ${(0, color_1.input)('name')}, the first argument of ${(0, color_1.input)('ionic init')}. See ${(0, color_1.input)('ionic init --help')} for details.`);
        }
        if (!type) {
            throw new errors_1.FatalException(`Could not determine project type.\n` +
                `Please specify ${(0, color_1.input)('--type')}. See ${(0, color_1.input)('ionic init --help')} for details.`);
        }
        let project;
        if (this.project && this.project.details.context === 'multiapp') {
            const configPath = path.resolve(this.project.rootDirectory, constants_1.PROJECT_FILE);
            const projectRoot = path.relative(this.project.rootDirectory, this.env.ctx.execPath);
            const config = new project_1.MultiProjectConfig(configPath);
            if (!projectRoot) {
                if (this.env.flags.interactive) {
                    this.env.log.warn(`About to initialize app in the root directory of your multi-app project.\n` +
                        `Please confirm that you want your app initialized in the root of your multi-app project. If this wasn't intended, please ${(0, color_1.input)('cd')} into the appropriate directory and run ${(0, color_1.input)('ionic init')} again.\n`);
                }
                const confirm = await this.env.prompt({
                    type: 'confirm',
                    message: 'Continue?',
                    default: false,
                });
                if (!confirm) {
                    throw new errors_1.FatalException(`Not initializing app in root directory.`);
                }
            }
            const defaultProject = config.get('defaultProject');
            if (!defaultProject && typeof options['default'] !== 'boolean') {
                const confirm = await this.env.prompt({
                    type: 'confirm',
                    message: `Would you like to make this app the default project?`,
                    default: true,
                });
                if (confirm) {
                    options['default'] = true;
                }
            }
            if (options['default']) {
                config.set('defaultProject', projectId);
            }
            project = await (0, project_1.createProjectFromDetails)({ context: 'multiapp', configPath, id: projectId, type, errors: [] }, this.env);
            project.config.set('root', projectRoot);
        }
        else {
            const configPath = this.getProjectFilePath();
            project = await (0, project_1.createProjectFromDetails)({ context: 'app', configPath, type, errors: [] }, this.env);
        }
        project.config.set('name', name);
        project.config.set('type', type);
    }
    getProjectFilePath() {
        return path.resolve(this.env.ctx.execPath, constants_1.PROJECT_FILE);
    }
}
exports.InitCommand = InitCommand;
