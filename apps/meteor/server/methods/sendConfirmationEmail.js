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
const models_1 = require("@rocket.chat/models");
const accounts_base_1 = require("meteor/accounts-base");
const check_1 = require("meteor/check");
const ddp_rate_limiter_1 = require("meteor/ddp-rate-limiter");
const meteor_1 = require("meteor/meteor");
const deprecationWarningLogger_1 = require("../../app/lib/server/lib/deprecationWarningLogger");
meteor_1.Meteor.methods({
    sendConfirmationEmail(to) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(to, String);
            deprecationWarningLogger_1.methodDeprecationLogger.method('sendConfirmationEmail', '7.0.0');
            const email = to.trim();
            const user = yield models_1.Users.findOneByEmailAddress(email, { projection: { _id: 1 } });
            if (!user) {
                return false;
            }
            try {
                accounts_base_1.Accounts.sendVerificationEmail(user._id, email);
                return true;
            }
            catch (error) {
                throw new meteor_1.Meteor.Error('error-email-send-failed', `Error trying to send email: ${error.message}`, {
                    method: 'registerUser',
                    message: error.message,
                });
            }
        });
    },
});
ddp_rate_limiter_1.DDPRateLimiter.addRule({
    type: 'method',
    name: 'sendConfirmationEmail',
    userId() {
        return true;
    },
}, 5, 60000);
