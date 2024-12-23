"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPreference = getUserPreference;
const client_1 = require("../../../models/client");
const client_2 = require("../../../settings/client");
function getUserPreference(userIdOrUser, key, defaultValue) {
    var _a, _b, _c, _d;
    const user = typeof userIdOrUser === 'string' ? client_1.Users.findOne(userIdOrUser, { fields: { [`settings.preferences.${key}`]: 1 } }) : userIdOrUser;
    return (_d = (_c = (_b = (_a = user === null || user === void 0 ? void 0 : user.settings) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b[key]) !== null && _c !== void 0 ? _c : defaultValue) !== null && _d !== void 0 ? _d : client_2.settings.get(`Accounts_Default_User_Preferences_${key}`);
}
