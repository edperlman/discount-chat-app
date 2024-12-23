"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUsername = void 0;
const server_1 = require("../../../settings/server");
const validateUsername = (username) => {
    const settingsRegExp = server_1.settings.get('UTF8_User_Names_Validation');
    const defaultPattern = /^[0-9a-zA-Z-_.]+$/;
    let usernameRegExp;
    try {
        usernameRegExp = settingsRegExp ? new RegExp(`^${settingsRegExp}$`) : defaultPattern;
    }
    catch (e) {
        usernameRegExp = defaultPattern;
    }
    return usernameRegExp.test(username);
};
exports.validateUsername = validateUsername;
