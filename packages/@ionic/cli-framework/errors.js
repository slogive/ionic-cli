"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPCError = exports.CommandNotFoundError = exports.InputValidationError = exports.BaseError = exports.ERROR_IPC_UNKNOWN_PROCEDURE = exports.ERROR_IPC_MODULE_INACCESSIBLE = exports.ERROR_COMMAND_NOT_FOUND = exports.ERROR_INPUT_VALIDATION = void 0;
const tslib_1 = require("tslib");
const util = tslib_1.__importStar(require("util"));
exports.ERROR_INPUT_VALIDATION = 'ERR_ICF_INPUT_VALIDATION';
exports.ERROR_COMMAND_NOT_FOUND = 'ERR_ICF_COMMAND_NOT_FOUND';
exports.ERROR_IPC_MODULE_INACCESSIBLE = 'ERR_ICF_IPC_MODULE_INACCESSIBLE';
exports.ERROR_IPC_UNKNOWN_PROCEDURE = 'ERR_ICF_IPC_UNKNOWN_PROCEDURE';
class BaseError extends Error {
    toString() {
        return util.inspect(this);
    }
    inspect() {
        return this.toString();
    }
}
exports.BaseError = BaseError;
class InputValidationError extends BaseError {
    constructor(message, errors) {
        super(message);
        this.errors = errors;
        this.name = 'InputValidationError';
        this.code = exports.ERROR_INPUT_VALIDATION;
    }
}
exports.InputValidationError = InputValidationError;
class CommandNotFoundError extends BaseError {
    constructor(message, args) {
        super(message);
        this.args = args;
        this.name = 'CommandNotFoundError';
        this.code = exports.ERROR_COMMAND_NOT_FOUND;
    }
}
exports.CommandNotFoundError = CommandNotFoundError;
class IPCError extends BaseError {
    constructor() {
        super(...arguments);
        this.name = 'IPCError';
    }
}
exports.IPCError = IPCError;
