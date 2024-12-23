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
exports.compareUserPasswordHistory = compareUserPasswordHistory;
const accounts_base_1 = require("meteor/accounts-base");
const server_1 = require("../../app/settings/server");
/**
 * Check if a given password is the one user by given user or if the user doesn't have a password
 * @param {object} user User object
 * @param {object} pass Object with { plain: 'plain-test-password' } or { sha256: 'sha256password' }
 */
function compareUserPasswordHistory(user, pass) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        var _d, _e, _f;
        if (!((_d = user === null || user === void 0 ? void 0 : user.services) === null || _d === void 0 ? void 0 : _d.passwordHistory) || !server_1.settings.get('Accounts_Password_History_Enabled')) {
            return true;
        }
        if (!pass || (!pass.plain && !pass.sha256) || !((_f = (_e = user === null || user === void 0 ? void 0 : user.services) === null || _e === void 0 ? void 0 : _e.password) === null || _f === void 0 ? void 0 : _f.bcrypt)) {
            return false;
        }
        const currentPassword = user.services.password.bcrypt;
        const passwordHistory = user.services.passwordHistory.slice(-Number(server_1.settings.get('Accounts_Password_History_Amount')));
        try {
            for (var _g = true, passwordHistory_1 = __asyncValues(passwordHistory), passwordHistory_1_1; passwordHistory_1_1 = yield passwordHistory_1.next(), _a = passwordHistory_1_1.done, !_a; _g = true) {
                _c = passwordHistory_1_1.value;
                _g = false;
                const password = _c;
                if (!password.trim()) {
                    user.services.password.bcrypt = currentPassword;
                    return false;
                }
                user.services.password.bcrypt = password;
                const historyPassword = pass.plain || {
                    digest: pass.sha256 ? pass.sha256.toLowerCase() : '',
                    algorithm: 'sha-256',
                };
                const passCheck = yield accounts_base_1.Accounts._checkPasswordAsync(user, historyPassword);
                if (!passCheck.error) {
                    user.services.password.bcrypt = currentPassword;
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_g && !_a && (_b = passwordHistory_1.return)) yield _b.call(passwordHistory_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        user.services.password.bcrypt = currentPassword;
        return true;
    });
}
