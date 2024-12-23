"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotOnDesktopError = void 0;
class NotOnDesktopError extends Error {
    constructor() {
        super('Not on desktop');
    }
}
exports.NotOnDesktopError = NotOnDesktopError;
