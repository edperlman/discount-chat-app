"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMeteorError = exports.MeteorError = void 0;
class MeteorError extends Error {
    constructor(error, reason, details) {
        super(`${reason ? `${reason} ` : ''}[${String(error)}]`);
        this.error = error;
        this.reason = reason;
        this.details = details;
        this.isClientSafe = true;
        this.errorType = 'Meteor.Error';
    }
    toJSON() {
        return Object.assign({ isClientSafe: this.isClientSafe, errorType: this.errorType, error: this.error, reason: this.reason, message: this.message }, (this.details && { details: this.details }));
    }
}
exports.MeteorError = MeteorError;
const isMeteorError = (error) => (error === null || error === void 0 ? void 0 : error.errorType) === 'Meteor.Error';
exports.isMeteorError = isMeteorError;
