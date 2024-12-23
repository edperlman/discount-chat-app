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
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../app/authorization/server/functions/hasPermission");
const notifyListener_1 = require("../../app/lib/server/lib/notifyListener");
const server_1 = require("../../app/settings/server");
meteor_1.Meteor.methods({
    removeRoomOwner(rid, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            (0, check_1.check)(rid, String);
            (0, check_1.check)(userId, String);
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'removeRoomOwner',
                });
            }
            const room = yield models_1.Rooms.findOneById(rid, { projection: { t: 1, federated: 1 } });
            if (!room) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                    method: 'removeRoomOwner',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'set-owner', rid)) && !(0, core_typings_1.isRoomFederated)(room)) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'removeRoomOwner',
                });
            }
            const user = yield models_1.Users.findOneById(userId);
            if (!(user === null || user === void 0 ? void 0 : user.username)) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'removeRoomOwner',
                });
            }
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, user._id);
            if (!subscription) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                    method: 'removeRoomOwner',
                });
            }
            if (Array.isArray(subscription.roles) === false || ((_a = subscription.roles) === null || _a === void 0 ? void 0 : _a.includes('owner')) === false) {
                throw new meteor_1.Meteor.Error('error-user-not-owner', 'User is not an owner', {
                    method: 'removeRoomOwner',
                });
            }
            const numOwners = yield models_1.Roles.countUsersInRole('owner', rid);
            if (numOwners === 1) {
                throw new meteor_1.Meteor.Error('error-remove-last-owner', 'This is the last owner. Please set a new owner before removing this one.', {
                    method: 'removeRoomOwner',
                });
            }
            const removeRoleResponse = yield models_1.Subscriptions.removeRoleById(subscription._id, 'owner');
            if (removeRoleResponse.modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedById)(subscription._id);
            }
            const fromUser = yield models_1.Users.findOneById(uid);
            if (!fromUser) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'removeRoomOwner',
                });
            }
            yield core_services_1.Message.saveSystemMessage('subscription-role-removed', rid, user.username, fromUser, { role: 'owner' });
            const team = yield core_services_1.Team.getOneByMainRoomId(rid);
            if (team) {
                yield core_services_1.Team.removeRolesFromMember(team._id, userId, ['owner']);
            }
            const event = {
                type: 'removed',
                _id: 'owner',
                u: {
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                },
                scope: rid,
            };
            if (server_1.settings.get('UI_DisplayRoles')) {
                void core_services_1.api.broadcast('user.roleUpdate', event);
            }
            void core_services_1.api.broadcast('federation.userRoleChanged', Object.assign(Object.assign({}, event), { givenByUserId: uid }));
            return true;
        });
    },
});
