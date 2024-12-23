"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudWorkspaceRegistrationError = void 0;
const CloudWorkspaceError_1 = require("./CloudWorkspaceError");
class CloudWorkspaceRegistrationError extends CloudWorkspaceError_1.CloudWorkspaceError {
    constructor(message) {
        super(message);
        this.name = CloudWorkspaceRegistrationError.name;
    }
}
exports.CloudWorkspaceRegistrationError = CloudWorkspaceRegistrationError;
