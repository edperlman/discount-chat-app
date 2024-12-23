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
exports.compareUserPassword = compareUserPassword;
const accounts_base_1 = require("meteor/accounts-base");
/**
 * Check if a given password is the one user by given user or if the user doesn't have a password
 * @param {object} user User object
 * @param {object} pass Object with { plain: 'plain-test-password' } or { sha256: 'sha256password' }
 */
function compareUserPassword(user, pass) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        if (!((_c = (_b = (_a = user === null || user === void 0 ? void 0 : user.services) === null || _a === void 0 ? void 0 : _a.password) === null || _b === void 0 ? void 0 : _b.bcrypt) === null || _c === void 0 ? void 0 : _c.trim())) {
            return false;
        }
        if (!pass || (!pass.plain && !pass.sha256)) {
            return false;
        }
        const password = pass.plain || {
            digest: ((_d = pass.sha256) === null || _d === void 0 ? void 0 : _d.toLowerCase()) || '',
            algorithm: 'sha-256',
        };
        const passCheck = yield accounts_base_1.Accounts._checkPasswordAsync(user, password);
        if (passCheck.error) {
            return false;
        }
        return true;
    });
}
