"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCoreAppInteractionError = void 0;
class InvalidCoreAppInteractionError extends Error {
    constructor() {
        super(...arguments);
        this.name = InvalidCoreAppInteractionError.name;
    }
}
exports.InvalidCoreAppInteractionError = InvalidCoreAppInteractionError;
