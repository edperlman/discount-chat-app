"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAPIError = void 0;
const i18n_1 = require("../../../../app/utils/lib/i18n");
const toast_1 = require("../../../lib/toast");
const shouldHandleErrorAsWarning = (message) => {
    const warnings = ['Could not reach the Marketplace'];
    return warnings.includes(message);
};
const handleAPIError = (errorObject) => {
    const { error = '', message = error } = errorObject;
    if (shouldHandleErrorAsWarning(message)) {
        return (0, toast_1.dispatchToastMessage)({ type: 'error', message: (0, i18n_1.t)(message) });
    }
    (0, toast_1.dispatchToastMessage)({ type: 'error', message: (0, i18n_1.t)(`Apps_Error_${error}`) });
};
exports.handleAPIError = handleAPIError;
