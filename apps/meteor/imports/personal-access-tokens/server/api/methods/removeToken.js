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
const meteor_1 = require("meteor/meteor");
const models_1 = require("@rocket.chat/models");
const hasPermission_1 = require("../../../../../app/authorization/server/functions/hasPermission");
const twoFactorRequired_1 = require("../../../../../app/2fa/server/twoFactorRequired");
meteor_1.Meteor.methods({
    'personalAccessTokens:removeToken': (0, twoFactorRequired_1.twoFactorRequired)(function (_a) {
        return __awaiter(this, arguments, void 0, function* ({ tokenName }) {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('not-authorized', 'Not Authorized', {
                    method: 'personalAccessTokens:removeToken',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'create-personal-access-tokens'))) {
                throw new meteor_1.Meteor.Error('not-authorized', 'Not Authorized', {
                    method: 'personalAccessTokens:removeToken',
                });
            }
            const tokenExist = yield models_1.Users.findPersonalAccessTokenByTokenNameAndUserId({
                userId: uid,
                tokenName,
            });
            if (!tokenExist) {
                throw new meteor_1.Meteor.Error('error-token-does-not-exists', 'Token does not exist', {
                    method: 'personalAccessTokens:removeToken',
                });
            }
            yield models_1.Users.removePersonalAccessTokenOfUser({
                userId: uid,
                loginTokenObject: {
                    type: 'personalAccessToken',
                    name: tokenName,
                },
            });
        });
    }),
});
