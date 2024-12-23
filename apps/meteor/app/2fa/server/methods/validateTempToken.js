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
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const totp_1 = require("../lib/totp");
meteor_1.Meteor.methods({
    '2fa:validateTempToken'(userToken) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('not-authorized');
            }
            const user = yield meteor_1.Meteor.userAsync();
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: '2fa:validateTempToken',
                });
            }
            if (!((_b = (_a = user.services) === null || _a === void 0 ? void 0 : _a.totp) === null || _b === void 0 ? void 0 : _b.tempSecret)) {
                throw new meteor_1.Meteor.Error('invalid-totp');
            }
            const verified = yield totp_1.TOTP.verify({
                secret: user.services.totp.tempSecret,
                token: userToken,
            });
            if (!verified) {
                throw new meteor_1.Meteor.Error('invalid-totp');
            }
            const { codes, hashedCodes } = totp_1.TOTP.generateCodes();
            yield models_1.Users.enable2FAAndSetSecretAndCodesByUserId(userId, user.services.totp.tempSecret, hashedCodes);
            // Once the TOTP is validated we logout all other clients
            const { 'x-auth-token': xAuthToken } = (_d = (_c = this.connection) === null || _c === void 0 ? void 0 : _c.httpHeaders) !== null && _d !== void 0 ? _d : {};
            if (xAuthToken && this.userId) {
                const hashedToken = Accounts._hashLoginToken(xAuthToken);
                const { modifiedCount } = yield models_1.Users.removeNonPATLoginTokensExcept(this.userId, hashedToken);
                if (modifiedCount > 0) {
                    // TODO this can be optmized so places that care about loginTokens being removed are invoked directly
                    // instead of having to listen to every watch.users event
                    void (0, notifyListener_1.notifyOnUserChangeAsync)(() => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b;
                        if (!this.userId) {
                            return;
                        }
                        const userTokens = yield models_1.Users.findOneById(this.userId, { projection: { 'services.resume.loginTokens': 1 } });
                        return {
                            clientAction: 'updated',
                            id: this.userId,
                            diff: { 'services.resume.loginTokens': (_b = (_a = userTokens === null || userTokens === void 0 ? void 0 : userTokens.services) === null || _a === void 0 ? void 0 : _a.resume) === null || _b === void 0 ? void 0 : _b.loginTokens },
                        };
                    }));
                }
            }
            return { codes };
        });
    },
});
