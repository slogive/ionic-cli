"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepairCommand = void 0;
const tslib_1 = require("tslib");
const utils_fs_1 = require("@ionic/utils-fs");
const utils_terminal_1 = require("@ionic/utils-terminal");
const path = tslib_1.__importStar(require("path"));
const color_1 = require("../lib/color");
const command_1 = require("../lib/command");
const errors_1 = require("../lib/errors");
const executor_1 = require("../lib/executor");
class RepairCommand extends command_1.Command {
    async getMetadata() {
        return {
            name: 'repair',
            type: 'project',
            summary: 'Remove and recreate dependencies and generated files',
            description: `
This command may be useful when obscure errors or issues are encountered. It removes and recreates dependencies of your project.

For Cordova apps, it removes and recreates the generated native project and the native dependencies of your project.
`,
            options: [
                {
                    name: 'cordova',
                    summary: 'Only perform the repair steps for Cordova platforms and plugins.',
                    type: Boolean,
                },
            ],
        };
    }
    async run(inputs, options, runinfo) {
        if (!this.project) {
            throw new errors_1.FatalException(`Cannot run ${(0, color_1.input)('ionic repair')} outside a project directory.`);
        }
        const { pkgManagerArgs } = await Promise.resolve().then(() => tslib_1.__importStar(require('../lib/utils/npm')));
        const [installer, ...installerArgs] = await pkgManagerArgs(this.env.config.get('npmClient'), { command: 'install' });
        const cordovaOnly = !!options['cordova'];
        const cordova = this.project.getIntegration('cordova');
        if (cordovaOnly && !cordova) {
            throw new errors_1.FatalException(`${(0, color_1.input)('--cordova')} was specified, but Cordova has not been added to this project.`);
        }
        if (cordova && !cordova.enabled) {
            this.env.log.warn(`Cordova integration found, but is disabled--not running repair for Cordova.`);
        }
        if (this.env.flags.interactive) {
            const steps = [];
            if (!cordovaOnly) {
                steps.push(`- Remove ${(0, color_1.strong)('node_modules/')} and ${(0, color_1.strong)('package-lock.json')}\n` +
                    `- Run ${(0, color_1.input)([installer, ...installerArgs].join(' '))} to restore dependencies\n`);
            }
            if (cordova && cordova.enabled) {
                steps.push(`- Remove ${(0, color_1.strong)('platforms/')} and ${(0, color_1.strong)('plugins/')}\n` +
                    `- Run ${(0, color_1.input)('cordova prepare')} to restore platforms and plugins\n`);
            }
            if (steps.length === 0) {
                this.env.log.ok(`${(0, color_1.input)('ionic repair')} has nothing to do.`);
                throw new errors_1.FatalException('', 0);
            }
            this.env.log.info(`${(0, color_1.input)('ionic repair')} will do the following:\n\n` + steps.join(''));
        }
        const confirm = await this.env.prompt({
            type: 'confirm',
            name: 'confirm',
            message: 'Continue?',
            default: false,
        });
        if (!confirm) {
            throw new errors_1.FatalException(`Not running ${(0, color_1.input)('ionic repair')}.`);
        }
        this.env.log.nl();
        if (!cordovaOnly) {
            await this.npmRepair(this.project);
        }
        if (cordova && cordova.enabled) {
            await this.cordovaRepair(cordova, runinfo);
        }
    }
    async npmRepair(project) {
        const { pkgManagerArgs } = await Promise.resolve().then(() => tslib_1.__importStar(require('../lib/utils/npm')));
        const [installer, ...installerArgs] = await pkgManagerArgs(this.env.config.get('npmClient'), { command: 'install' });
        const tasks = this.createTaskChain();
        const packageLockFile = path.resolve(project.directory, 'package-lock.json');
        const nodeModulesDir = path.resolve(project.directory, 'node_modules');
        tasks.next(`Removing ${(0, color_1.strong)((0, utils_terminal_1.prettyPath)(packageLockFile))}`);
        const packageLockFileExists = await (0, utils_fs_1.pathExists)(packageLockFile);
        if (packageLockFileExists) {
            await (0, utils_fs_1.unlink)(packageLockFile);
        }
        tasks.next(`Removing ${(0, color_1.strong)((0, utils_terminal_1.prettyPath)(nodeModulesDir))}`);
        await (0, utils_fs_1.remove)(nodeModulesDir);
        tasks.end();
        await this.env.shell.run(installer, installerArgs, { cwd: project.directory, stdio: 'inherit' });
    }
    async cordovaRepair(cordova, runinfo) {
        const tasks = this.createTaskChain();
        const platformsDir = path.resolve(cordova.root, 'platforms');
        const pluginsDir = path.resolve(cordova.root, 'plugins');
        tasks.next(`Removing ${(0, color_1.strong)((0, utils_terminal_1.prettyPath)(platformsDir))}`);
        await (0, utils_fs_1.remove)(platformsDir);
        tasks.next(`Removing ${(0, color_1.strong)((0, utils_terminal_1.prettyPath)(pluginsDir))}`);
        await (0, utils_fs_1.remove)(pluginsDir);
        tasks.end();
        await (0, executor_1.runCommand)(runinfo, ['cordova', 'prepare', '--no-build']);
    }
}
exports.RepairCommand = RepairCommand;
