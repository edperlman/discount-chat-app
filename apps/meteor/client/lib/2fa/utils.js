"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTotpMaxAttemptsError = exports.isTotpInvalidError = exports.isTotpRequiredError = void 0;
const isTotpRequiredError = (error) => typeof error === 'object' &&
    ((error === null || error === void 0 ? void 0 : error.error) === 'totp-required' ||
        (error === null || error === void 0 ? void 0 : error.errorType) === 'totp-required');
exports.isTotpRequiredError = isTotpRequiredError;
const isTotpInvalidError = (error) => (error === null || error === void 0 ? void 0 : error.error) === 'totp-invalid' ||
    (error === null || error === void 0 ? void 0 : error.errorType) === 'totp-invalid';
exports.isTotpInvalidError = isTotpInvalidError;
const isTotpMaxAttemptsError = (error) => (error === null || error === void 0 ? void 0 : error.error) === 'totp-max-attempts' ||
    (error === null || error === void 0 ? void 0 : error.errorType) === 'totp-max-attempts';
exports.isTotpMaxAttemptsError = isTotpMaxAttemptsError;
