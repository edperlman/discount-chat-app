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
exports.PasswordCheckFallback = void 0;
const accounts_base_1 = require("meteor/accounts-base");
const server_1 = require("../../../settings/server");
class PasswordCheckFallback {
    constructor() {
        this.name = 'password';
    }
    isEnabled(user, force) {
        var _a, _b;
        if (force) {
            return true;
        }
        // TODO: Remove this setting for version 4.0 forcing the
        // password fallback for who has password set.
        if (server_1.settings.get('Accounts_TwoFactorAuthentication_Enforce_Password_Fallback')) {
            return ((_b = (_a = user.services) === null || _a === void 0 ? void 0 : _a.password) === null || _b === void 0 ? void 0 : _b.bcrypt) != null;
        }
        return false;
    }
    verify(user, code, force) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isEnabled(user, force)) {
                return false;
            }
            const passCheck = yield accounts_base_1.Accounts._checkPasswordAsync(user, {
                digest: code.toLowerCase(),
                algorithm: 'sha-256',
            });
            if (passCheck.error) {
                return false;
            }
            return true;
        });
    }
    processInvalidCode() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                codeGenerated: false,
            };
        });
    }
    maxFaildedAttemtpsReached(_user) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
}
exports.PasswordCheckFallback = PasswordCheckFallback;
