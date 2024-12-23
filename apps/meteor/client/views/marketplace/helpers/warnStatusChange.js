"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warnStatusChange = void 0;
const appErroredStatuses_1 = require("./appErroredStatuses");
const i18n_1 = require("../../../../app/utils/lib/i18n");
const toast_1 = require("../../../lib/toast");
const warnStatusChange = (appName, status) => {
    if (appErroredStatuses_1.appErroredStatuses.includes(status)) {
        (0, toast_1.dispatchToastMessage)({ type: 'error', message: ((0, i18n_1.t)(`App_status_${status}`), appName) });
        return;
    }
    (0, toast_1.dispatchToastMessage)({ type: 'info', message: ((0, i18n_1.t)(`App_status_${status}`), appName) });
};
exports.warnStatusChange = warnStatusChange;
