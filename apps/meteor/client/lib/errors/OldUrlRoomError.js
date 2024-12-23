"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OldUrlRoomError = void 0;
const RocketChatError_1 = require("./RocketChatError");
class OldUrlRoomError extends RocketChatError_1.RocketChatError {
    constructor(message = 'Old Url Format', details) {
        super('old-url-format', message, details);
    }
}
exports.OldUrlRoomError = OldUrlRoomError;
