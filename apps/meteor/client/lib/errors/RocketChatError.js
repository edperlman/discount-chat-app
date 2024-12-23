"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketChatError = void 0;
class RocketChatError extends Error {
    constructor(error, reason, details) {
        super(reason ? `${reason} [${error}]` : `[${error}]`);
        this.error = error;
        this.reason = reason;
        this.details = details;
    }
}
exports.RocketChatError = RocketChatError;
