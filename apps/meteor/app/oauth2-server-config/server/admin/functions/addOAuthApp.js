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
exports.addOAuthApp = addOAuthApp;
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const meteor_1 = require("meteor/meteor");
const parseUriList_1 = require("./parseUriList");
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
function addOAuthApp(applicationParams, uid) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!uid) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'addOAuthApp' });
        }
        const user = yield models_1.Users.findOneById(uid, { projection: { username: 1 } });
        if (!(user === null || user === void 0 ? void 0 : user.username)) {
            // TODO: username is required, but not always present
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'addOAuthApp' });
        }
        if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'manage-oauth-apps'))) {
            throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'addOAuthApp' });
        }
        if (!applicationParams.name || typeof applicationParams.name.valueOf() !== 'string' || applicationParams.name.trim() === '') {
            throw new meteor_1.Meteor.Error('error-invalid-name', 'Invalid name', { method: 'addOAuthApp' });
        }
        if (!applicationParams.redirectUri ||
            typeof applicationParams.redirectUri.valueOf() !== 'string' ||
            applicationParams.redirectUri.trim() === '') {
            throw new meteor_1.Meteor.Error('error-invalid-redirectUri', 'Invalid redirectUri', {
                method: 'addOAuthApp',
            });
        }
        if (typeof applicationParams.active !== 'boolean') {
            throw new meteor_1.Meteor.Error('error-invalid-arguments', 'Invalid arguments', {
                method: 'addOAuthApp',
            });
        }
        const application = Object.assign(Object.assign({}, applicationParams), { redirectUri: (0, parseUriList_1.parseUriList)(applicationParams.redirectUri), clientId: random_1.Random.id(), clientSecret: random_1.Random.secret(), _createdAt: new Date(), _updatedAt: new Date(), _createdBy: {
                _id: user._id,
                username: user.username,
            } });
        if (application.redirectUri.length === 0) {
            throw new meteor_1.Meteor.Error('error-invalid-redirectUri', 'Invalid redirectUri', {
                method: 'addOAuthApp',
            });
        }
        return Object.assign(Object.assign({}, application), { _id: (yield models_1.OAuthApps.insertOne(application)).insertedId });
    });
}
