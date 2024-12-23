"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudWorkspaceLicenseError = void 0;
const CloudWorkspaceError_1 = require("./CloudWorkspaceError");
class CloudWorkspaceLicenseError extends CloudWorkspaceError_1.CloudWorkspaceError {
    constructor(message) {
        super(message);
        this.name = CloudWorkspaceLicenseError.name;
    }
}
exports.CloudWorkspaceLicenseError = CloudWorkspaceLicenseError;
