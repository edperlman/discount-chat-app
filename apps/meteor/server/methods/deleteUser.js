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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../app/authorization/server/functions/hasPermission");
const deleteUser_1 = require("../../app/lib/server/functions/deleteUser");
meteor_1.Meteor.methods({
    deleteUser(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, confirmRelinquish = false) {
            var _a, _b;
            (0, check_1.check)(userId, String);
            const uid = meteor_1.Meteor.userId();
            if (!uid || (yield (0, hasPermission_1.hasPermissionAsync)(uid, 'delete-user')) !== true) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'deleteUser',
                });
            }
            const user = yield models_1.Users.findOneById(userId);
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user to delete', {
                    method: 'deleteUser',
                });
            }
            if (user.type === 'app') {
                throw new meteor_1.Meteor.Error('error-cannot-delete-app-user', 'Deleting app user is not allowed', {
                    method: 'deleteUser',
                });
            }
            const adminCount = yield models_1.Users.col.countDocuments({ roles: 'admin' });
            const userIsAdmin = ((_a = user.roles) === null || _a === void 0 ? void 0 : _a.indexOf('admin')) > -1;
            if (adminCount === 1 && userIsAdmin) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Leaving the app without admins is not allowed', {
                    method: 'deleteUser',
                    action: 'Remove_last_admin',
                });
            }
            yield (0, deleteUser_1.deleteUser)(userId, confirmRelinquish, uid);
            // App IPostUserDeleted event hook
            yield ((_b = apps_1.Apps.self) === null || _b === void 0 ? void 0 : _b.triggerEvent(apps_1.AppEvents.IPostUserDeleted, { user, performedBy: yield meteor_1.Meteor.userAsync() }));
            return true;
        });
    },
});
