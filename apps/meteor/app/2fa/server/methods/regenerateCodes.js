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
    '2fa:regenerateCodes'(userToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('not-authorized');
            }
            const user = yield meteor_1.Meteor.userAsync();
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: '2fa:regenerateCodes',
                });
            }
            if (!((_b = (_a = user.services) === null || _a === void 0 ? void 0 : _a.totp) === null || _b === void 0 ? void 0 : _b.enabled)) {
                throw new meteor_1.Meteor.Error('invalid-totp');
            }
            const verified = yield totp_1.TOTP.verify({
                secret: user.services.totp.secret,
                token: userToken,
                userId,
                backupTokens: user.services.totp.hashedBackup,
            });
            if (verified) {
                const { codes, hashedCodes } = totp_1.TOTP.generateCodes();
                yield models_1.Users.update2FABackupCodesByUserId(userId, hashedCodes);
                return { codes };
            }
        });
    },
});
