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
exports.getUserNotificationPreference = void 0;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../settings/server");
const getUserNotificationPreference = (user, pref) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (typeof user === 'string') {
        const u = yield models_1.Users.findOneById(user);
        if (!u) {
            return null;
        }
        user = u;
    }
    let preferenceKey;
    switch (pref) {
        case 'desktop':
            preferenceKey = 'desktopNotifications';
            break;
        case 'mobile':
            preferenceKey = 'pushNotifications';
            break;
        case 'email':
            preferenceKey = 'emailNotificationMode';
            break;
    }
    if (!preferenceKey) {
        return null;
    }
    if (((_a = user === null || user === void 0 ? void 0 : user.settings) === null || _a === void 0 ? void 0 : _a.preferences) &&
        typeof user.settings.preferences[preferenceKey] !== 'undefined' &&
        user.settings.preferences[preferenceKey] !== 'default') {
        return {
            value: user.settings.preferences[preferenceKey],
            origin: 'user',
        };
    }
    const serverValue = server_1.settings.get(`Accounts_Default_User_Preferences_${preferenceKey}`);
    if (serverValue) {
        return {
            value: serverValue,
            origin: 'server',
        };
    }
    return null;
});
exports.getUserNotificationPreference = getUserNotificationPreference;
