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
Object.defineProperty(exports, "__esModule", { value: true });
const ddp_rate_limiter_1 = require("meteor/ddp-rate-limiter");
const meteor_1 = require("meteor/meteor");
const Mailer = __importStar(require("../../../mailer/server/api"));
const server_1 = require("../../../settings/server");
meteor_1.Meteor.methods({
    sendSMTPTestEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!meteor_1.Meteor.userId()) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'sendSMTPTestEmail',
                });
            }
            const user = yield meteor_1.Meteor.userAsync();
            if (!((_b = (_a = user === null || user === void 0 ? void 0 : user.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.address)) {
                throw new meteor_1.Meteor.Error('error-invalid-email', 'Invalid email', {
                    method: 'sendSMTPTestEmail',
                });
            }
            try {
                yield Mailer.send({
                    to: user.emails[0].address,
                    from: server_1.settings.get('From_Email'),
                    subject: 'SMTP Test Email',
                    html: '<p>You have successfully sent an email</p>',
                });
            }
            catch ({ message }) {
                throw new meteor_1.Meteor.Error('error-email-send-failed', `Error trying to send email: ${message}`, {
                    method: 'sendSMTPTestEmail',
                    message,
                });
            }
            return {
                message: 'Sending_your_mail_to_s',
                params: [user.emails[0].address],
            };
        });
    },
});
ddp_rate_limiter_1.DDPRateLimiter.addRule({
    type: 'method',
    name: 'sendSMTPTestEmail',
    userId() {
        return true;
    },
}, 1, 1000);
