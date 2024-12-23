"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudWorkspaceAccessError = void 0;
const CloudWorkspaceError_1 = require("./CloudWorkspaceError");
class CloudWorkspaceAccessError extends CloudWorkspaceError_1.CloudWorkspaceError {
    constructor(message) {
        super(message);
        this.name = CloudWorkspaceAccessError.name;
    }
}
exports.CloudWorkspaceAccessError = CloudWorkspaceAccessError;
