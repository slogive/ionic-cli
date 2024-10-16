"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginCommand = void 0;
const tslib_1 = require("tslib");
const cli_framework_1 = require("@ionic/cli-framework");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const readline = tslib_1.__importStar(require("readline"));
const color_1 = require("../lib/color");
const command_1 = require("../lib/command");
const errors_1 = require("../lib/errors");
const uuid_1 = require("../lib/utils/uuid");
class LoginCommand extends command_1.Command {
    async getMetadata() {
        return {
            name: 'login',
            type: 'global',
            summary: 'Log in to Ionic',
            description: `
Authenticate with Ionic and retrieve a user token, which is stored in the CLI config. Running ${(0, color_1.input)('ionic login')} will open a browser where you can submit your credentials.

If the ${(0, color_1.input)('IONIC_TOKEN')} environment variable is set, the CLI will automatically authenticate you. Use the Dashboard to generate a Personal Access Token.

If you need to create an Ionic account, use ${(0, color_1.input)('ionic signup')} or the Ionic Website[^signup].

If you are having issues logging in, please get in touch with our Support[^support-request].
      `,
            footnotes: [
                {
                    id: 'signup',
                    url: 'https://ionicframework.com/signup',
                },
                {
                    id: 'support-request',
                    url: 'https://ion.link/support-request',
                },
            ],
            exampleCommands: [''],
            inputs: [
                {
                    name: 'email',
                    summary: 'Your email address (deprecated)',
                    private: true,
                },
                {
                    name: 'password',
                    summary: 'Your password (deprecated)',
                    private: true,
                },
            ],
        };
    }
    async preRun(inputs, options) {
        if (options['email'] || options['password']) {
            throw new errors_1.FatalException(`${(0, color_1.input)('email')} and ${(0, color_1.input)('password')} are command arguments, not options. Please try this:\n` +
                `${(0, color_1.input)('ionic login <email> <password>')}\n`);
        }
        if (options['sso']) {
            this.env.log.warn(`The ${(0, color_1.strong)('--sso')} flag is no longer necessary.\n` +
                `SSO login has been upgraded to OpenID login, which is now the new default authentication flow of ${(0, color_1.input)('ionic login')}. Refresh tokens are used to automatically re-authenticate sessions.`);
            this.env.log.nl();
        }
        if (!!inputs[0]) {
            this.env.log.warn('Authenticating using email and password is deprecated. ' +
                (this.env.flags.interactive
                    ? `Please run ${(0, color_1.input)('ionic login')} without arguments to log in.`
                    : `Please generate a Personal Access Token and set the ${(0, color_1.input)('IONIC_TOKEN')} environment variable.`));
            this.env.log.nl();
        }
        // ask for password only if the user specifies an email
        const validateEmail = !!inputs[0];
        const askForPassword = inputs[0] && !inputs[1];
        if (this.env.session.isLoggedIn()) {
            const email = this.env.config.get('user.email');
            const extra = askForPassword
                ? (this.env.flags.interactive ? `Prompting for new credentials.\n\nUse ${chalk_1.default.yellow('Ctrl+C')} to cancel and remain logged in.` : '')
                : 'You will be logged out beforehand.';
            if (this.env.flags.interactive) {
                this.env.log.warn('You will be logged out.\n' +
                    `You are already logged in${email ? ' as ' + (0, color_1.strong)(email) : ''}! ${extra}`);
                this.env.log.nl();
            }
        }
        else {
            if (this.env.flags.interactive) {
                this.env.log.info(`Log into your Ionic account!\n` +
                    `If you don't have one yet, create yours by running: ${(0, color_1.input)(`ionic signup`)}`);
                this.env.log.nl();
            }
        }
        // TODO: combine with promptToLogin ?
        if (validateEmail) {
            const validatedEmail = cli_framework_1.validators.email(inputs[0]);
            if (validatedEmail !== true) {
                this.env.log.warn(`${validatedEmail}. \n Please enter a valid email address.`);
                if (this.env.flags.interactive) {
                    const email = await this.env.prompt({
                        type: 'input',
                        name: 'email',
                        message: 'Email:',
                        validate: v => (0, cli_framework_1.combine)(cli_framework_1.validators.required, cli_framework_1.validators.email)(v),
                    });
                    inputs[0] = email;
                }
                else {
                    throw new errors_1.FatalException('Invalid email');
                }
            }
        }
        if (askForPassword) {
            if (this.env.flags.interactive) {
                const password = await this.env.prompt({
                    type: 'password',
                    name: 'password',
                    message: 'Password:',
                    mask: '*',
                    validate: v => cli_framework_1.validators.required(v),
                });
                inputs[1] = password;
            }
            else {
                inputs[1] = await this.getPasswordFromStdin();
            }
        }
    }
    getPasswordFromStdin() {
        return new Promise(resolve => {
            const rl = readline.createInterface({
                input: process.stdin,
                terminal: false,
            });
            rl.on('line', line => {
                resolve(line);
                rl.close();
            });
        });
    }
    async run(inputs, options) {
        const [email, password] = inputs;
        if (email && password) {
            await this.logout();
            await this.env.session.login(email, password);
        }
        else {
            if (!this.env.flags.interactive && !this.env.flags.confirm) {
                throw new errors_1.FatalException('Refusing to attempt browser login in non-interactive mode.\n' +
                    `If you are attempting to log in, make sure you are using a modern, interactive terminal. Otherwise, you can log in using inline username and password with ${(0, color_1.input)('ionic login <email> <password>')}. See ${(0, color_1.input)('ionic login --help')} for more details.`);
            }
            this.env.log.info(`During this process, a browser window will open to authenticate you. Please leave this process running until authentication is complete.`);
            this.env.log.nl();
            const login = await this.env.prompt({
                type: 'confirm',
                name: 'continue',
                message: 'Open the browser to log in to your Ionic account?',
                default: true,
            });
            if (login) {
                await this.logout();
                await this.env.session.webLogin();
            }
            else {
                return;
            }
        }
        this.env.log.ok((0, color_1.success)((0, color_1.strong)('You are logged in!')));
    }
    async logout() {
        if (this.env.session.isLoggedIn()) {
            await this.env.session.logout();
            this.env.config.set('tokens.telemetry', (0, uuid_1.generateUUID)());
        }
    }
}
exports.LoginCommand = LoginCommand;
