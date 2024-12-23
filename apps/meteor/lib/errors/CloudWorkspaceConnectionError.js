"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudWorkspaceConnectionError = void 0;
const CloudWorkspaceError_1 = require("./CloudWorkspaceError");
class CloudWorkspaceConnectionError extends CloudWorkspaceError_1.CloudWorkspaceError {
    constructor(message) {
        super(message);
        this.name = CloudWorkspaceConnectionError.name;
    }
}
exports.CloudWorkspaceConnectionError = CloudWorkspaceConnectionError;
