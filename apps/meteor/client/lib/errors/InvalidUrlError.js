"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidUrlError = void 0;
const RocketChatError_1 = require("./RocketChatError");
class InvalidUrlError extends RocketChatError_1.RocketChatError {
    constructor(message = 'Invalid url', details) {
        super('invalid-url', message, details);
    }
}
exports.InvalidUrlError = InvalidUrlError;
