"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomNotFoundError = void 0;
const RocketChatError_1 = require("./RocketChatError");
class RoomNotFoundError extends RocketChatError_1.RocketChatError {
    constructor(message = 'Room not found', details) {
        super('room-not-found', message, details);
    }
}
exports.RoomNotFoundError = RoomNotFoundError;
