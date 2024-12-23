"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warnEnableDisableApp = void 0;
const appErroredStatuses_1 = require("./appErroredStatuses");
const i18n_1 = require("../../../../app/utils/lib/i18n");
const toast_1 = require("../../../lib/toast");
const warnEnableDisableApp = (appName, status, type) => {
    if (appErroredStatuses_1.appErroredStatuses.includes(status)) {
        (0, toast_1.dispatchToastMessage)({ type: 'error', message: ((0, i18n_1.t)(`App_status_${status}`), appName) });
        return;
    }
    if (type === 'enable') {
        (0, toast_1.dispatchToastMessage)({ type: 'success', message: `${appName} enabled` });
        return;
    }
    (0, toast_1.dispatchToastMessage)({ type: 'success', message: `${appName} disabled` });
};
exports.warnEnableDisableApp = warnEnableDisableApp;
