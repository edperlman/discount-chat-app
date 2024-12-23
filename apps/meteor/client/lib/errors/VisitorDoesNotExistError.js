"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorDoesNotExistError = void 0;
const RocketChatError_1 = require("./RocketChatError");
class VisitorDoesNotExistError extends RocketChatError_1.RocketChatError {
    constructor(message = 'Visitor does not exist', details) {
        super('visitor-does-not-exist', message, details);
    }
}
exports.VisitorDoesNotExistError = VisitorDoesNotExistError;
