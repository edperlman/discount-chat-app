"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailCheck = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const bcrypt_1 = __importDefault(require("bcrypt"));
const accounts_base_1 = require("meteor/accounts-base");
const i18n_1 = require("../../../../server/lib/i18n");
const Mailer = __importStar(require("../../../mailer/server/api"));
const server_1 = require("../../../settings/server");
class EmailCheck {
    constructor() {
        this.name = 'email';
    }
    getUserVerifiedEmails(user) {
        if (!Array.isArray(user.emails)) {
            return [];
        }
        return user.emails.filter(({ verified }) => verified).map((e) => e.address);
    }
    isEnabled(user) {
        var _a, _b;
        if (!server_1.settings.get('Accounts_TwoFactorAuthentication_By_Email_Enabled')) {
            return false;
        }
        if (!server_1.settings.get('Accounts_twoFactorAuthentication_email_available_for_OAuth_users') && (0, core_typings_1.isOAuthUser)(user)) {
            return false;
        }
        if (!((_b = (_a = user.services) === null || _a === void 0 ? void 0 : _a.email2fa) === null || _b === void 0 ? void 0 : _b.enabled)) {
            return false;
        }
        return this.getUserVerifiedEmails(user).length > 0;
    }
    send2FAEmail(address, random, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = user.language || server_1.settings.get('Language') || 'en';
            const t = i18n_1.i18n.getFixedT(language);
            yield Mailer.send({
                to: address,
                from: server_1.settings.get('From_Email'),
                subject: 'Authentication code',
                replyTo: undefined,
                data: {
                    code: random.replace(/^(\d{3})/, '$1-'),
                },
                headers: undefined,
                text: `
${t('Here_is_your_authentication_code')}

__code__

${t('Do_not_provide_this_code_to_anyone')}
${t('If_you_didnt_try_to_login_in_your_account_please_ignore_this_email')}
`,
                html: `
				<p>${t('Here_is_your_authentication_code')}</p>
				<p style="font-size: 30px;">
					<b>__code__</b>
				</p>
				<p>${t('Do_not_provide_this_code_to_anyone')}</p>
				<p>${t('If_you_didnt_try_to_login_in_your_account_please_ignore_this_email')}</p>
			`,
            });
        });
    }
    verify(user, codeFromEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.isEnabled(user)) {
                return false;
            }
            if (!((_a = user.services) === null || _a === void 0 ? void 0 : _a.emailCode)) {
                return false;
            }
            // Remove non digits
            codeFromEmail = codeFromEmail.replace(/([^\d])/g, '');
            const { code, expire } = user.services.emailCode;
            if (expire < new Date()) {
                return false;
            }
            if (yield bcrypt_1.default.compare(codeFromEmail, code)) {
                yield models_1.Users.removeEmailCodeOfUserId(user._id);
                return true;
            }
            yield models_1.Users.incrementInvalidEmailCodeAttempt(user._id);
            return false;
        });
    }
    sendEmailCode(user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const emails = this.getUserVerifiedEmails(user);
            const random = random_1.Random._randomString(6, '0123456789');
            const encryptedRandom = yield bcrypt_1.default.hash(random, accounts_base_1.Accounts._bcryptRounds());
            const expire = new Date();
            const expirationInSeconds = parseInt(server_1.settings.get('Accounts_TwoFactorAuthentication_By_Email_Code_Expiration'), 10);
            expire.setSeconds(expire.getSeconds() + expirationInSeconds);
            yield models_1.Users.addEmailCodeByUserId(user._id, encryptedRandom, expire);
            try {
                for (var _d = true, emails_1 = __asyncValues(emails), emails_1_1; emails_1_1 = yield emails_1.next(), _a = emails_1_1.done, !_a; _d = true) {
                    _c = emails_1_1.value;
                    _d = false;
                    const address = _c;
                    yield this.send2FAEmail(address, random, user);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = emails_1.return)) yield _b.call(emails_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    processInvalidCode(user) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            yield models_1.Users.removeExpiredEmailCodeOfUserId(user._id);
            // Generate new code if the there isn't any code with more than 5 minutes to expire
            const expireWithDelta = new Date();
            expireWithDelta.setMinutes(expireWithDelta.getMinutes() - 5);
            const emails = this.getUserVerifiedEmails(user);
            const emailOrUsername = user.username || emails[0];
            const hasValidCode = ((_b = (_a = user.services) === null || _a === void 0 ? void 0 : _a.emailCode) === null || _b === void 0 ? void 0 : _b.expire) &&
                ((_d = (_c = user.services) === null || _c === void 0 ? void 0 : _c.emailCode) === null || _d === void 0 ? void 0 : _d.expire) > expireWithDelta &&
                !(yield this.maxFaildedAttemtpsReached(user));
            if (hasValidCode) {
                return {
                    emailOrUsername,
                    codeGenerated: false,
                    codeExpires: (_f = (_e = user.services) === null || _e === void 0 ? void 0 : _e.emailCode) === null || _f === void 0 ? void 0 : _f.expire,
                };
            }
            yield this.sendEmailCode(user);
            return {
                codeGenerated: true,
                emailOrUsername,
            };
        });
    }
    maxFaildedAttemtpsReached(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const maxAttempts = server_1.settings.get('Accounts_TwoFactorAuthentication_Max_Invalid_Email_Code_Attempts');
            return (yield models_1.Users.maxInvalidEmailCodeAttemptsReached(user._id, maxAttempts));
        });
    }
}
exports.EmailCheck = EmailCheck;
