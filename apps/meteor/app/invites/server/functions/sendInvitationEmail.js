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
exports.sendInvitationEmail = void 0;
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const Mailer = __importStar(require("../../../mailer/server/api"));
const server_1 = require("../../../settings/server");
let html = '';
meteor_1.Meteor.startup(() => {
    Mailer.getTemplate('Invitation_Email', (value) => {
        html = value;
    });
});
const sendInvitationEmail = (userId, emails) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    (0, check_1.check)(emails, [String]);
    if (!userId) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
            method: 'sendInvitationEmail',
        });
    }
    if (!(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'bulk-register-user'))) {
        throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
            method: 'sendInvitationEmail',
        });
    }
    const validEmails = emails.filter(Mailer.checkAddressFormat);
    if (!validEmails || validEmails.length === 0) {
        throw new meteor_1.Meteor.Error('error-email-send-failed', 'No valid email addresses', {
            method: 'sendInvitationEmail',
        });
    }
    const subject = server_1.settings.get('Invitation_Subject');
    if (!subject) {
        throw new meteor_1.Meteor.Error('error-email-send-failed', 'No subject', {
            method: 'sendInvitationEmail',
        });
    }
    try {
        for (var _d = true, validEmails_1 = __asyncValues(validEmails), validEmails_1_1; validEmails_1_1 = yield validEmails_1.next(), _a = validEmails_1_1.done, !_a; _d = true) {
            _c = validEmails_1_1.value;
            _d = false;
            const email = _c;
            try {
                yield Mailer.send({
                    to: email,
                    from: server_1.settings.get('From_Email'),
                    subject,
                    html,
                    data: {
                        email,
                    },
                });
                const { value } = yield models_1.Settings.incrementValueById('Invitation_Email_Count', 1, { returnDocument: 'after' });
                if (value) {
                    void (0, notifyListener_1.notifyOnSettingChanged)(value);
                }
                continue;
            }
            catch ({ message }) {
                throw new meteor_1.Meteor.Error('error-email-send-failed', `Error trying to send email: ${message}`, {
                    method: 'sendInvitationEmail',
                    message,
                });
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = validEmails_1.return)) yield _b.call(validEmails_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
exports.sendInvitationEmail = sendInvitationEmail;
