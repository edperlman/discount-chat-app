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
const parseUriList_1 = require("../functions/parseUriList");
meteor_1.Meteor.methods({
    updateOAuthApp(applicationId, application) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'updateOAuthApp' });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-oauth-apps'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'updateOAuthApp' });
            }
            if (!application.name || typeof application.name.valueOf() !== 'string' || application.name.trim() === '') {
                throw new meteor_1.Meteor.Error('error-invalid-name', 'Invalid name', { method: 'updateOAuthApp' });
            }
            if (!application.redirectUri || typeof application.redirectUri.valueOf() !== 'string' || application.redirectUri.trim() === '') {
                throw new meteor_1.Meteor.Error('error-invalid-redirectUri', 'Invalid redirectUri', {
                    method: 'updateOAuthApp',
                });
            }
            if (typeof application.active !== 'boolean') {
                throw new meteor_1.Meteor.Error('error-invalid-arguments', 'Invalid arguments', {
                    method: 'updateOAuthApp',
                });
            }
            const currentApplication = yield models_1.OAuthApps.findOneById(applicationId);
            if (currentApplication == null) {
                throw new meteor_1.Meteor.Error('error-application-not-found', 'Application not found', {
                    method: 'updateOAuthApp',
                });
            }
            const redirectUri = (0, parseUriList_1.parseUriList)(application.redirectUri);
            if (redirectUri.length === 0) {
                throw new meteor_1.Meteor.Error('error-invalid-redirectUri', 'Invalid redirectUri', {
                    method: 'updateOAuthApp',
                });
            }
            yield models_1.OAuthApps.updateOne({ _id: applicationId }, {
                $set: {
                    name: application.name,
                    active: application.active,
                    redirectUri,
                    _updatedAt: new Date(),
                    _updatedBy: yield models_1.Users.findOneById(this.userId, {
                        projection: {
                            username: 1,
                        },
                    }),
                },
            });
            return models_1.OAuthApps.findOneById(applicationId);
        });
    },
});
