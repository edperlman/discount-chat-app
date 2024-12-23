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
const apps_1 = require("@rocket.chat/apps");
const models_1 = require("@rocket.chat/models");
const sha256_1 = require("@rocket.chat/sha256");
const accounts_base_1 = require("meteor/accounts-base");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const stringUtils_1 = require("../../../../lib/utils/stringUtils");
const server_1 = require("../../../settings/server");
const deleteUser_1 = require("../functions/deleteUser");
meteor_1.Meteor.methods({
    deleteUserOwnAccount(password, confirmRelinquish) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            (0, check_1.check)(password, String);
            if (!meteor_1.Meteor.userId()) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'deleteUserOwnAccount',
                });
            }
            if (!server_1.settings.get('Accounts_AllowDeleteOwnAccount')) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'deleteUserOwnAccount',
                });
            }
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'deleteUserOwnAccount',
                });
            }
            const user = yield models_1.Users.findOneById(uid);
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'deleteUserOwnAccount',
                });
            }
            if (((_a = user.services) === null || _a === void 0 ? void 0 : _a.password) && (0, stringUtils_1.trim)(user.services.password.bcrypt)) {
                const result = yield accounts_base_1.Accounts._checkPasswordAsync(user, {
                    digest: password.toLowerCase(),
                    algorithm: 'sha-256',
                });
                if (result.error) {
                    throw new meteor_1.Meteor.Error('error-invalid-password', 'Invalid password', {
                        method: 'deleteUserOwnAccount',
                    });
                }
            }
            else if (!user.username || (0, sha256_1.SHA256)(user.username) !== password.trim()) {
                throw new meteor_1.Meteor.Error('error-invalid-username', 'Invalid username', {
                    method: 'deleteUserOwnAccount',
                });
            }
            yield (0, deleteUser_1.deleteUser)(uid, confirmRelinquish);
            // App IPostUserDeleted event hook
            yield ((_b = apps_1.Apps.self) === null || _b === void 0 ? void 0 : _b.triggerEvent(apps_1.AppEvents.IPostUserDeleted, { user }));
            return true;
        });
    },
});
