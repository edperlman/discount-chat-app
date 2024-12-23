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
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
meteor_1.Meteor.methods({
    deleteOAuthApp(applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'deleteOAuthApp' });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-oauth-apps'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'deleteOAuthApp' });
            }
            const application = yield models_1.OAuthApps.findOneById(applicationId);
            if (!application) {
                throw new meteor_1.Meteor.Error('error-application-not-found', 'Application not found', {
                    method: 'deleteOAuthApp',
                });
            }
            yield models_1.OAuthApps.deleteOne({ _id: applicationId });
            yield models_1.OAuthAccessTokens.deleteMany({ clientId: application.clientId });
            yield models_1.OAuthAuthCodes.deleteMany({ clientId: application.clientId });
            return true;
        });
    },
});
