"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidPreview = void 0;
const RocketChatError_1 = require("./RocketChatError");
class InvalidPreview extends RocketChatError_1.RocketChatError {
    constructor(message = 'Preview Item must have an id, type, and value.', details) {
        super('error-invalid-preview', message, details);
    }
}
exports.InvalidPreview = InvalidPreview;
