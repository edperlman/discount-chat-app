"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateName = void 0;
const server_1 = require("../../../settings/server");
const validateName = function (name) {
    const blockedNames = server_1.settings.get('Accounts_SystemBlockedUsernameList');
    if (!blockedNames || typeof blockedNames !== 'string') {
        return true;
    }
    if (blockedNames.split(',').includes(name.toLowerCase())) {
        return false;
    }
    return true;
};
exports.validateName = validateName;
