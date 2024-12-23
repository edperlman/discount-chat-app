"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudWorkspaceError = void 0;
class CloudWorkspaceError extends Error {
    constructor(message) {
        super(message);
        this.name = CloudWorkspaceError.name;
    }
}
exports.CloudWorkspaceError = CloudWorkspaceError;
