"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPreference = void 0;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../settings/server");
/**
 * @summary Get a user preference
 * @param {String} userId The user ID
 * @param {String} preference The preference name
 * @param {unknown?} defaultValue The default value
 * @returns {unknown} The preference value
 */
const getUserPreference = (user_1, key_1, ...args_1) => __awaiter(void 0, [user_1, key_1, ...args_1], void 0, function* (user, key, defaultValue = undefined) {
    var _a, _b;
    let preference;
    if (typeof user === 'string') {
        const dbUser = yield models_1.Users.findOneById(user, { projection: { [`settings.preferences.${key}`]: 1 } });
        if (dbUser) {
            user = dbUser;
        }
    }
    if (typeof user === 'string') {
        return defaultValue;
    }
    if ((_b = (_a = user === null || user === void 0 ? void 0 : user.settings) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.hasOwnProperty(key)) {
        preference = user.settings.preferences[key];
    }
    else if (defaultValue === undefined) {
        preference = server_1.settings.get(`Accounts_Default_User_Preferences_${key}`);
    }
    return preference !== undefined ? preference : defaultValue;
});
exports.getUserPreference = getUserPreference;
