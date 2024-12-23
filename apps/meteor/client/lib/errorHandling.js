"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = getErrorMessage;
const i18n_1 = require("../../app/utils/lib/i18n");
const isObject = (obj) => (typeof obj === 'object' || typeof obj === 'function') && obj !== null;
const hasProperty = (obj, property) => isObject(obj) && property in obj;
const hasXHR = (error) => hasProperty(error, 'xhr') && hasProperty(error.xhr, 'responseJSON');
function getErrorMessage(error, defaultMessage) {
    var _a, _b, _c;
    if (typeof error === 'string') {
        return (0, i18n_1.t)(error);
    }
    if (!isObject(error)) {
        if (defaultMessage)
            return getErrorMessage(defaultMessage);
        throw new TypeError('no default error message specified');
    }
    if (hasXHR(error)) {
        return getErrorMessage(error.xhr.responseJSON, defaultMessage);
    }
    const message = (_c = (_b = (_a = (hasProperty(error, 'reason') && typeof error.reason === 'string' ? error.reason : undefined)) !== null && _a !== void 0 ? _a : (hasProperty(error, 'error') && typeof error.error === 'string' ? error.error : undefined)) !== null && _b !== void 0 ? _b : (hasProperty(error, 'message') && typeof error.message === 'string' ? error.message : undefined)) !== null && _c !== void 0 ? _c : defaultMessage;
    const details = hasProperty(error, 'details') && isObject(error.details) ? error.details : undefined;
    if (message)
        return (0, i18n_1.t)(message, Object.fromEntries(Object.entries(details !== null && details !== void 0 ? details : {}).map(([key, value]) => [key, (0, i18n_1.t)(value)])));
    return getErrorMessage(defaultMessage);
}
