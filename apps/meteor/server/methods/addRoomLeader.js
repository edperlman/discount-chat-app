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
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../app/authorization/server/functions/hasPermission");
const notifyListener_1 = require("../../app/lib/server/lib/notifyListener");
const server_1 = require("../../app/settings/server");
meteor_1.Meteor.methods({
    addRoomLeader(rid, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(rid, String);
            (0, check_1.check)(userId, String);
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'addRoomLeader',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'set-leader', rid))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'addRoomLeader',
                });
            }
            const user = yield models_1.Users.findOneById(userId);
            if (!(user === null || user === void 0 ? void 0 : user.username)) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'addRoomLeader',
                });
            }
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, user._id);
            if (!subscription) {
                throw new meteor_1.Meteor.Error('error-user-not-in-room', 'User is not in this room', {
                    method: 'addRoomLeader',
                });
            }
            if (subscription.roles && Array.isArray(subscription.roles) === true && subscription.roles.includes('leader') === true) {
                throw new meteor_1.Meteor.Error('error-user-already-leader', 'User is already a leader', {
                    method: 'addRoomLeader',
                });
            }
            const addRoleResponse = yield models_1.Subscriptions.addRoleById(subscription._id, 'leader');
            if (addRoleResponse.modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedById)(subscription._id);
            }
            const fromUser = yield models_1.Users.findOneById(uid);
            if (!fromUser) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'addRoomLeader',
                });
            }
            yield core_services_1.Message.saveSystemMessage('subscription-role-added', rid, user.username, fromUser, { role: 'leader' });
            const team = yield core_services_1.Team.getOneByMainRoomId(rid);
            if (team) {
                yield core_services_1.Team.addRolesToMember(team._id, userId, ['leader']);
            }
            if (server_1.settings.get('UI_DisplayRoles')) {
                void core_services_1.api.broadcast('user.roleUpdate', {
                    type: 'added',
                    _id: 'leader',
                    u: {
                        _id: user._id,
                        username: user.username,
                    },
                    scope: rid,
                });
            }
            return true;
        });
    },
});
