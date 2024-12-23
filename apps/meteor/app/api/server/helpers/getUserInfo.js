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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = getUserInfo;
const server_1 = require("../../../settings/server");
const getURL_1 = require("../../../utils/server/getURL");
const getUserPreference_1 = require("../../../utils/server/lib/getUserPreference");
const isVerifiedEmail = (me) => {
    if (!me || !Array.isArray(me.emails)) {
        return false;
    }
    return me.emails.find((email) => email.verified);
};
const getUserPreferences = (me) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const defaultUserSettingPrefix = 'Accounts_Default_User_Preferences_';
    const allDefaultUserSettings = server_1.settings.getByRegexp(new RegExp(`^${defaultUserSettingPrefix}.*$`));
    const accumulator = {};
    try {
        for (var _d = true, allDefaultUserSettings_1 = __asyncValues(allDefaultUserSettings), allDefaultUserSettings_1_1; allDefaultUserSettings_1_1 = yield allDefaultUserSettings_1.next(), _a = allDefaultUserSettings_1_1.done, !_a; _d = true) {
            _c = allDefaultUserSettings_1_1.value;
            _d = false;
            const [key] = _c;
            const settingWithoutPrefix = key.replace(defaultUserSettingPrefix, ' ').trim();
            accumulator[settingWithoutPrefix] = yield (0, getUserPreference_1.getUserPreference)(me, settingWithoutPrefix);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = allDefaultUserSettings_1.return)) yield _b.call(allDefaultUserSettings_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return accumulator;
});
function getUserInfo(me) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const verifiedEmail = isVerifiedEmail(me);
        const userPreferences = (_b = (_a = me.settings) === null || _a === void 0 ? void 0 : _a.preferences) !== null && _b !== void 0 ? _b : {};
        return Object.assign(Object.assign({}, me), { email: verifiedEmail ? verifiedEmail.address : undefined, settings: {
                profile: {},
                preferences: Object.assign(Object.assign({}, (yield getUserPreferences(me))), userPreferences),
            }, avatarUrl: (0, getURL_1.getURL)(`/avatar/${me.username}`, { cdn: false, full: true }) });
    });
}
