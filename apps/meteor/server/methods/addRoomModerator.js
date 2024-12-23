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
const utils_1 = require("../services/federation/utils");
meteor_1.Meteor.methods({
    addRoomModerator(rid, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(rid, String);
            (0, check_1.check)(userId, String);
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'addRoomModerator',
                });
            }
            const room = yield models_1.Rooms.findOneById(rid, { projection: { t: 1, federated: 1 } });
            if (!room) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                    method: 'addRoomModerator',
                });
            }
            const isFederated = (0, core_typings_1.isRoomFederated)(room);
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'set-moderator', rid)) && !isFederated) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'addRoomModerator',
                });
            }
            if (isFederated && (!(0, utils_1.isFederationEnabled)() || !(0, utils_1.isFederationReady)())) {
                throw new utils_1.FederationMatrixInvalidConfigurationError('unable to change room owners');
            }
            const user = yield models_1.Users.findOneById(userId);
            if (!(user === null || user === void 0 ? void 0 : user.username)) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'addRoomModerator',
                });
            }
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, user._id);
            if (!subscription) {
                throw new meteor_1.Meteor.Error('error-user-not-in-room', 'User is not in this room', {
                    method: 'addRoomModerator',
                });
            }
            if (subscription.roles && Array.isArray(subscription.roles) === true && subscription.roles.includes('moderator') === true) {
                throw new meteor_1.Meteor.Error('error-user-already-moderator', 'User is already a moderator', {
                    method: 'addRoomModerator',
                });
            }
            const addRoleResponse = yield models_1.Subscriptions.addRoleById(subscription._id, 'moderator');
            if (addRoleResponse.modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedById)(subscription._id);
            }
            const fromUser = yield models_1.Users.findOneById(uid);
            if (!fromUser) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'addRoomLeader',
                });
            }
            yield core_services_1.Message.saveSystemMessage('subscription-role-added', rid, user.username, fromUser, { role: 'moderator' });
            const team = yield core_services_1.Team.getOneByMainRoomId(rid);
            if (team) {
                yield core_services_1.Team.addRolesToMember(team._id, userId, ['moderator']);
            }
            const event = {
                type: 'added',
                _id: 'moderator',
                u: {
                    _id: user._id,
                    username: user.username,
                    name: fromUser.name,
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
