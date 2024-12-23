"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInstallError = handleInstallError;
const i18n_1 = require("../../../../app/utils/lib/i18n");
const toast_1 = require("../../../lib/toast");
function handleInstallError(apiError) {
    var _a;
    if (apiError instanceof Error) {
        (0, toast_1.dispatchToastMessage)({ type: 'error', message: apiError.message });
        return;
    }
    if (!((_a = apiError.xhr) === null || _a === void 0 ? void 0 : _a.responseJSON)) {
        return;
    }
    const { status, messages, error, payload = null } = apiError.xhr.responseJSON;
    let message;
    switch (status) {
        case 'storage_error':
            message = messages.join('');
            break;
        case 'app_user_error':
            message = messages.join('');
            if (payload === null || payload === void 0 ? void 0 : payload.username) {
                message = (0, i18n_1.t)('Apps_User_Already_Exists', { username: payload.username });
            }
            break;
        default:
            if (error) {
                message = error;
            }
            else {
                message = (0, i18n_1.t)('There_has_been_an_error_installing_the_app');
            }
    }
    (0, toast_1.dispatchToastMessage)({ type: 'error', message });
}
