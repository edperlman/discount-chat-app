"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationUtils = exports.CONSTANTS = exports.getSettingPermissionId = void 0;
const getSettingPermissionId = function (settingId) {
    // setting-based permissions
    return `change-setting-${settingId}`;
};
exports.getSettingPermissionId = getSettingPermissionId;
exports.CONSTANTS = {
    SETTINGS_LEVEL: 'settings',
};
var AuthorizationUtils_1 = require("./AuthorizationUtils");
Object.defineProperty(exports, "AuthorizationUtils", { enumerable: true, get: function () { return AuthorizationUtils_1.AuthorizationUtils; } });
