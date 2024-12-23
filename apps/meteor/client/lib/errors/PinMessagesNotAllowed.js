"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinMessagesNotAllowed = void 0;
const RocketChatError_1 = require("./RocketChatError");
class PinMessagesNotAllowed extends RocketChatError_1.RocketChatError {
    constructor(message = 'Pinning messages is not allowed', details) {
        super('error-pinning-message', message, details);
    }
}
exports.PinMessagesNotAllowed = PinMessagesNotAllowed;
