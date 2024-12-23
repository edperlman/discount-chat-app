"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordPolicyError = void 0;
class PasswordPolicyError extends Error {
    constructor(message, error, details) {
        super(message);
        this.error = error;
        this.details = details;
    }
}
exports.PasswordPolicyError = PasswordPolicyError;
