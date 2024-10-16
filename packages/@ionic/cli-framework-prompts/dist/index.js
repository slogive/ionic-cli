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
exports.createPromptChoiceSeparator = exports.createPromptModule = void 0;
const utils_terminal_1 = require("@ionic/utils-terminal");
const debug_1 = require("debug");
const debug = (0, debug_1.debug)('ionic:cli-framework-prompts');
let _inquirer;
async function loadInquirer() {
    if (!_inquirer) {
        _inquirer = await Promise.resolve().then(() => __importStar(require('inquirer')));
    }
    return _inquirer;
}
/**
 * Create a reusable CLI prompt module.
 *
 * A prompt module is a function that generates prompts. A prompt opens an
 * interactive session with the user to gather input. When a prompt is
 * resolved, the user has finished providing input.
 *
 * If non-TTY mode is detected, a system of fallbacks goes into effect:
 *      1. If the question provided 'fallback', the fallback value is resolved.
 *      2. If the prompt module has 'onFallback', it is used to generate a
 *         fallback for the question.
 *      3. If the question provided 'default', the default value is resolved.
 *      4. Finally, a falsy value suitable for the question type is resolved.
 *
 * @param options.interactive Force non-TTY mode by providing 'false'. TTY mode
 *                            cannot be forced if non-TTY mode is detected.
 * @param options.onFallback Generate a non-TTY fallback for a question without
 *                           a 'fallback'.
 */
async function createPromptModule({ interactive, onFallback } = {}) {
    const inquirer = await loadInquirer();
    const { createPromptModule: createInquirerPromptModule } = inquirer;
    const promptModule = createInquirerPromptModule();
    async function createPrompter(question) {
        const { fallback, ...promptQuestion } = question;
        if (!utils_terminal_1.TERMINAL_INFO.tty || interactive === false) {
            if (typeof fallback !== 'undefined') {
                debug('Answering with provided fallback value for non-tty mode: %o', fallback);
                return fallback;
            }
            else if (onFallback) {
                const generatedFallback = onFallback(question);
                if (typeof generatedFallback !== 'undefined') {
                    debug(`Answering with fallback value from 'onFallback' for non-tty mode: %o`, generatedFallback);
                    return generatedFallback;
                }
            }
            if (typeof promptQuestion.default !== 'undefined') {
                return promptQuestion.default;
            }
            if (question.type === 'confirm') {
                return false;
            }
            else if (question.type === 'checkbox') {
                return [];
            }
            return '';
        }
        const name = 'name';
        const prompt = promptModule({ ...promptQuestion, name });
        const result = (await prompt)[name];
        if (typeof result === 'undefined' || result === null) {
            return '';
        }
        if (typeof result !== 'string' && typeof result !== 'boolean' && !Array.isArray(result)) {
            return String(result);
        }
        return result;
    }
    Object.defineProperties(createPrompter, {
        _inquirer: { value: inquirer },
    });
    return createPrompter;
}
exports.createPromptModule = createPromptModule;
function createPromptChoiceSeparator() {
    if (!_inquirer) {
        throw new Error(`Prompt module not initialized. Call 'createPromptModule' first.`);
    }
    return new _inquirer.Separator();
}
exports.createPromptChoiceSeparator = createPromptChoiceSeparator;
