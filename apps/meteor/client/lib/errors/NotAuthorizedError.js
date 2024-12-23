"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthorizedError = void 0;
const RocketChatError_1 = require("./RocketChatError");
class NotAuthorizedError extends RocketChatError_1.RocketChatError {
    constructor(message = 'Not authorized', details) {
        super('not-authorized', message, details);
    }
}
exports.NotAuthorizedError = NotAuthorizedError;
