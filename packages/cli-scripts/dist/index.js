"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const cli_framework_1 = require("@ionic/cli-framework");
const docs_1 = require("./docs");
class CLIScriptsNamespace extends cli_framework_1.Namespace {
    async getMetadata() {
        return {
            name: 'ionic-cli-scripts',
            summary: '',
        };
    }
    async getCommands() {
        return new cli_framework_1.CommandMap([
            ['docs', async () => new docs_1.DocsCommand(this)],
        ]);
    }
}
const namespace = new CLIScriptsNamespace();
async function run(argv, env) {
    await (0, cli_framework_1.execute)({ namespace, argv, env });
}
exports.run = run;
