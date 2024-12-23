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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetTOTP = resetTOTP;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const i18n_1 = require("../../../../server/lib/i18n");
const isUserIdFederated_1 = require("../../../../server/lib/isUserIdFederated");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const Mailer = __importStar(require("../../../mailer/server/api"));
const server_1 = require("../../../settings/server");
const sendResetNotification = function (uid) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        var _d;
        const user = yield models_1.Users.findOneById(uid, {
            projection: { language: 1, emails: 1 },
        });
        if (!user) {
            throw new meteor_1.Meteor.Error('invalid-user');
        }
        const language = user.language || server_1.settings.get('Language') || 'en';
        const addresses = (_d = user.emails) === null || _d === void 0 ? void 0 : _d.filter(({ verified }) => Boolean(verified)).map((e) => e.address);
        if (!(addresses === null || addresses === void 0 ? void 0 : addresses.length)) {
            return;
        }
        const t = i18n_1.i18n.getFixedT(language);
        const text = `
	${t('Your_TOTP_has_been_reset')}

	${t('TOTP_Reset_Other_Key_Warning')}
	`;
        const html = `
		<p>${t('Your_TOTP_has_been_reset')}</p>
		<p>${t('TOTP_Reset_Other_Key_Warning')}</p>
	`;
        const from = server_1.settings.get('From_Email');
        const subject = t('TOTP_reset_email');
        try {
            for (var _e = true, addresses_1 = __asyncValues(addresses), addresses_1_1; addresses_1_1 = yield addresses_1.next(), _a = addresses_1_1.done, !_a; _e = true) {
                _c = addresses_1_1.value;
                _e = false;
                const address = _c;
                try {
                    yield Mailer.send({
                        to: address,
                        from,
                        subject,
                        text,
                        html,
                    });
                }
                catch (error) {
                    const message = error instanceof Error ? error.message : String(error);
                    throw new meteor_1.Meteor.Error('error-email-send-failed', `Error trying to send email: ${message}`, {
                        function: 'resetUserTOTP',
                        message,
                    });
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_e && !_a && (_b = addresses_1.return)) yield _b.call(addresses_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
};
function resetTOTP(userId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, notifyUser = false) {
        if (notifyUser) {
            yield sendResetNotification(userId);
        }
        const isUserFederated = yield (0, isUserIdFederated_1.isUserIdFederated)(userId);
        if (isUserFederated) {
            throw new meteor_1.Meteor.Error('error-not-allowed', 'Federated Users cant have TOTP', { function: 'resetTOTP' });
        }
        const result = yield models_1.Users.resetTOTPById(userId);
        if ((result === null || result === void 0 ? void 0 : result.modifiedCount) === 1) {
            yield models_1.Users.unsetLoginTokens(userId);
            void (0, notifyListener_1.notifyOnUserChange)({
                clientAction: 'updated',
                id: userId,
                diff: {
                    'services.resume.loginTokens': [],
                },
            });
            return true;
        }
        return false;
    });
}
