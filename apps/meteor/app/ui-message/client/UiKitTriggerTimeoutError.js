"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiKitTriggerTimeoutError = void 0;
const RocketChatError_1 = require("../../../client/lib/errors/RocketChatError");
class UiKitTriggerTimeoutError extends RocketChatError_1.RocketChatError {
    constructor(message = 'Timeout', details) {
        super('trigger-timeout', message, details);
    }
}
exports.UiKitTriggerTimeoutError = UiKitTriggerTimeoutError;
