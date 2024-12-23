"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCommandUsage = void 0;
const RocketChatError_1 = require("./RocketChatError");
class InvalidCommandUsage extends RocketChatError_1.RocketChatError {
    constructor(message = 'Executing a command requires at least a message with a room id.', details) {
        super('invalid-command-usage', message, details);
    }
}
exports.InvalidCommandUsage = InvalidCommandUsage;
