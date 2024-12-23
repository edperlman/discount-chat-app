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
const meteor_1 = require("meteor/meteor");
const totp_1 = require("../lib/totp");
meteor_1.Meteor.methods({
    '2fa:enable'() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('not-authorized');
            }
            const user = yield meteor_1.Meteor.userAsync();
            if (!(user === null || user === void 0 ? void 0 : user.username)) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: '2fa:enable',
                });
            }
            const hasUnverifiedEmail = (_a = user.emails) === null || _a === void 0 ? void 0 : _a.some((email) => !email.verified);
            if (hasUnverifiedEmail) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'You need to verify your emails before setting up 2FA', {
                    method: '2fa:enable',
                });
            }
            if ((_c = (_b = user.services) === null || _b === void 0 ? void 0 : _b.totp) === null || _c === void 0 ? void 0 : _c.enabled) {
                throw new meteor_1.Meteor.Error('error-2fa-already-enabled');
            }
            const secret = totp_1.TOTP.generateSecret();
            yield models_1.Users.disable2FAAndSetTempSecretByUserId(userId, secret.base32);
            return {
                secret: secret.base32,
                url: totp_1.TOTP.generateOtpauthURL(secret, user.username),
            };
        });
    },
});
