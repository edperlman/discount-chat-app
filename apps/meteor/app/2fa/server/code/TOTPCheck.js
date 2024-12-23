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
exports.TOTPCheck = void 0;
const server_1 = require("../../../settings/server");
const totp_1 = require("../lib/totp");
class TOTPCheck {
    constructor() {
        this.name = 'totp';
    }
    isEnabled(user) {
        var _a, _b;
        if (!server_1.settings.get('Accounts_TwoFactorAuthentication_By_TOTP_Enabled')) {
            return false;
        }
        return ((_b = (_a = user.services) === null || _a === void 0 ? void 0 : _a.totp) === null || _b === void 0 ? void 0 : _b.enabled) === true;
    }
    verify(user, code) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            if (!this.isEnabled(user)) {
                return false;
            }
            if (!((_b = (_a = user.services) === null || _a === void 0 ? void 0 : _a.totp) === null || _b === void 0 ? void 0 : _b.secret)) {
                return false;
            }
            return totp_1.TOTP.verify({
                secret: (_d = (_c = user.services) === null || _c === void 0 ? void 0 : _c.totp) === null || _d === void 0 ? void 0 : _d.secret,
                token: code,
                userId: user._id,
                backupTokens: (_f = (_e = user.services) === null || _e === void 0 ? void 0 : _e.totp) === null || _f === void 0 ? void 0 : _f.hashedBackup,
            });
        });
    }
    processInvalidCode() {
        return __awaiter(this, void 0, void 0, function* () {
            // Nothing to do
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
exports.TOTPCheck = TOTPCheck;
