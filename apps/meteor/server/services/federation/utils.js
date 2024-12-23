"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationMatrixInvalidConfigurationError = void 0;
exports.isFederationEnabled = isFederationEnabled;
exports.isFederationReady = isFederationReady;
exports.throwIfFederationNotEnabledOrNotReady = throwIfFederationNotEnabledOrNotReady;
exports.throwIfFederationEnabledButNotReady = throwIfFederationEnabledButNotReady;
exports.throwIfFederationNotReady = throwIfFederationNotReady;
const server_1 = require("../../../app/settings/server");
function isFederationEnabled() {
    return server_1.settings.get('Federation_Matrix_enabled');
}
function isFederationReady() {
    return server_1.settings.get('Federation_Matrix_configuration_status') === 'Valid';
}
function throwIfFederationNotEnabledOrNotReady() {
    if (!isFederationEnabled()) {
        throw new Error('Federation is not enabled');
    }
    if (!isFederationReady()) {
        throw new Error('Federation configuration is invalid');
    }
}
function throwIfFederationEnabledButNotReady() {
    if (!isFederationEnabled()) {
        return;
    }
    throwIfFederationNotReady();
}
function throwIfFederationNotReady() {
    if (!isFederationReady()) {
        throw new Error('Federation configuration is invalid');
    }
}
class FederationMatrixInvalidConfigurationError extends Error {
    constructor(cause) {
        // eslint-disable-next-line prefer-template
        const message = 'Federation configuration is invalid' + (cause ? ',' + cause[0].toLowerCase() + cause.slice(1) : '');
        super(message);
        this.name = 'FederationMatrixInvalidConfiguration';
    }
}
exports.FederationMatrixInvalidConfigurationError = FederationMatrixInvalidConfigurationError;
