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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOTP = void 0;
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const sha256_1 = require("@rocket.chat/sha256");
const speakeasy_1 = __importDefault(require("speakeasy"));
const server_1 = require("../../../settings/server");
exports.TOTP = {
    generateSecret() {
        return speakeasy_1.default.generateSecret();
    },
    generateOtpauthURL(secret, username) {
        return speakeasy_1.default.otpauthURL({
            secret: secret.ascii,
            label: `Rocket.Chat:${username}`,
        });
    },
    verify(_a) {
        return __awaiter(this, arguments, void 0, function* ({ secret, token, backupTokens, userId, }) {
            // validates a backup code
            if (token.length === 8 && backupTokens) {
                const hashedCode = (0, sha256_1.SHA256)(token);
                const usedCode = backupTokens.indexOf(hashedCode);
                if (usedCode !== -1 && userId) {
                    backupTokens.splice(usedCode, 1);
                    // mark the code as used (remove it from the list)
                    yield models_1.Users.update2FABackupCodesByUserId(userId, backupTokens);
                    return true;
                }
                return false;
            }
            const maxDelta = server_1.settings.get('Accounts_TwoFactorAuthentication_MaxDelta');
            if (maxDelta) {
                const verifiedDelta = speakeasy_1.default.totp.verifyDelta({
                    secret,
                    encoding: 'base32',
                    token,
                    window: maxDelta,
                });
                return verifiedDelta !== undefined;
            }
            return speakeasy_1.default.totp.verify({
                secret,
                encoding: 'base32',
                token,
            });
        });
    },
    generateCodes() {
        // generate 12 backup codes
        const codes = [];
        const hashedCodes = [];
        for (let i = 0; i < 12; i++) {
            const code = random_1.Random.id(8);
            codes.push(code);
            hashedCodes.push((0, sha256_1.SHA256)(code));
        }
        return { codes, hashedCodes };
    },
};
