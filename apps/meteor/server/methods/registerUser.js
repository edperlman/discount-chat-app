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
const validateInviteToken_1 = require("../../app/invites/server/functions/validateInviteToken");
const server_1 = require("../../app/lib/server");
const server_2 = require("../../app/settings/server");
const stringUtils_1 = require("../../lib/utils/stringUtils");
meteor_1.Meteor.methods({
    registerUser(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            const AllowAnonymousRead = server_2.settings.get('Accounts_AllowAnonymousRead');
            const AllowAnonymousWrite = server_2.settings.get('Accounts_AllowAnonymousWrite');
            const manuallyApproveNewUsers = server_2.settings.get('Accounts_ManuallyApproveNewUsers');
            if (AllowAnonymousRead === true && AllowAnonymousWrite === true && !formData.email) {
                const userId = yield accounts_base_1.Accounts.insertUserDoc({}, {
                    globalRoles: ['anonymous'],
                    active: true,
                });
                const stampedLoginToken = yield accounts_base_1.Accounts._generateStampedLoginToken();
                yield accounts_base_1.Accounts._insertLoginToken(userId, stampedLoginToken);
                return stampedLoginToken;
            }
            (0, check_1.check)(formData, check_1.Match.ObjectIncluding({
                email: String,
                pass: String,
                name: String,
                secretURL: check_1.Match.Optional(String),
                reason: check_1.Match.Optional(String),
            }));
            if (server_2.settings.get('Accounts_RegistrationForm') === 'Disabled') {
                throw new meteor_1.Meteor.Error('error-user-registration-disabled', 'User registration is disabled', {
                    method: 'registerUser',
                });
            }
            if (server_2.settings.get('Accounts_RegistrationForm') === 'Secret URL' &&
                (!formData.secretURL || formData.secretURL !== server_2.settings.get('Accounts_RegistrationForm_SecretURL'))) {
                if (!formData.secretURL) {
                    throw new meteor_1.Meteor.Error('error-user-registration-secret', 'User registration is only allowed via Secret URL', {
                        method: 'registerUser',
                    });
                }
                try {
                    yield (0, validateInviteToken_1.validateInviteToken)(formData.secretURL);
                }
                catch (e) {
                    throw new meteor_1.Meteor.Error('error-user-registration-secret', 'User registration is only allowed via Secret URL', {
                        method: 'registerUser',
                    });
                }
            }
            server_1.passwordPolicy.validate(formData.pass);
            yield (0, server_1.validateEmailDomain)(formData.email);
            const userData = {
                email: (0, stringUtils_1.trim)(formData.email.toLowerCase()),
                password: formData.pass,
                name: formData.name,
                reason: formData.reason,
            };
            let userId;
            try {
                userId = yield accounts_base_1.Accounts.createUserAsync(userData);
            }
            catch (e) {
                if (e instanceof meteor_1.Meteor.Error) {
                    throw e;
                }
                if (e instanceof Error) {
                    throw new meteor_1.Meteor.Error(e.message);
                }
                throw new meteor_1.Meteor.Error(String(e));
            }
            yield models_1.Users.setName(userId, (0, stringUtils_1.trim)(formData.name));
            const reason = (0, stringUtils_1.trim)(formData.reason);
            if (manuallyApproveNewUsers && reason) {
                yield models_1.Users.setReason(userId, reason);
            }
            try {
                accounts_base_1.Accounts.sendVerificationEmail(userId, userData.email);
            }
            catch (error) {
                // throw new Meteor.Error 'error-email-send-failed', 'Error trying to send email: ' + error.message, { method: 'registerUser', message: error.message }
            }
            return userId;
        });
    },
});
let registerUserRuleId = server_1.RateLimiter.limitMethod('registerUser', server_2.settings.get('Rate_Limiter_Limit_RegisterUser'), server_2.settings.get('API_Enable_Rate_Limiter_Limit_Time_Default'), {
    userId() {
        return true;
    },
});
server_2.settings.watch('Rate_Limiter_Limit_RegisterUser', (value) => {
    // When running on testMode, there's no rate limiting added, so this function throws an error
    if (process.env.TEST_MODE === 'true') {
        return;
    }
    if (!registerUserRuleId) {
        throw new Error('Rate limiter rule for "registerUser" not found');
    }
    // remove old DDP rate limiter rule and create a new one with the updated setting value
    ddp_rate_limiter_1.DDPRateLimiter.removeRule(registerUserRuleId);
    registerUserRuleId = server_1.RateLimiter.limitMethod('registerUser', value, server_2.settings.get('API_Enable_Rate_Limiter_Limit_Time_Default'), {
        userId() {
            return true;
        },
    });
});
