"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appErroredStatuses = void 0;
const AppStatus_1 = require("@rocket.chat/apps-engine/definition/AppStatus");
exports.appErroredStatuses = [
    AppStatus_1.AppStatus.COMPILER_ERROR_DISABLED,
    AppStatus_1.AppStatus.ERROR_DISABLED,
    AppStatus_1.AppStatus.INVALID_SETTINGS_DISABLED,
    AppStatus_1.AppStatus.INVALID_LICENSE_DISABLED,
];
