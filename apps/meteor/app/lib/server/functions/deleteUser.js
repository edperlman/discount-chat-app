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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = deleteUser;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const getRoomsWithSingleOwner_1 = require("./getRoomsWithSingleOwner");
const getUserSingleOwnedRooms_1 = require("./getUserSingleOwnedRooms");
const relinquishRoomOwnerships_1 = require("./relinquishRoomOwnerships");
const updateGroupDMsName_1 = require("./updateGroupDMsName");
const callbacks_1 = require("../../../../lib/callbacks");
const i18n_1 = require("../../../../server/lib/i18n");
const server_1 = require("../../../file-upload/server");
const server_2 = require("../../../settings/server");
const notifyListener_1 = require("../lib/notifyListener");
function deleteUser(userId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, confirmRelinquish = false, deletedBy) {
        var _a, e_1, _b, _c;
        if (userId === 'rocket.cat') {
            throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Deleting the rocket.cat user is not allowed', {
                method: 'deleteUser',
                action: 'Delete_user',
            });
        }
        const user = yield models_1.Users.findOneById(userId, {
            projection: { username: 1, avatarOrigin: 1, roles: 1, federated: 1 },
        });
        if (!user) {
            return;
        }
        if ((0, core_typings_1.isUserFederated)(user)) {
            throw new meteor_1.Meteor.Error('error-not-allowed', 'Deleting federated, external user is not allowed', {
                method: 'deleteUser',
            });
        }
        const remoteUser = yield models_1.MatrixBridgedUser.getExternalUserIdByLocalUserId(userId);
        if (remoteUser) {
            throw new meteor_1.Meteor.Error('error-not-allowed', 'User participated in federation, this user can only be deactivated permanently', {
                method: 'deleteUser',
            });
        }
        const subscribedRooms = yield (0, getRoomsWithSingleOwner_1.getSubscribedRoomsForUserWithDetails)(userId);
        if ((0, getRoomsWithSingleOwner_1.shouldRemoveOrChangeOwner)(subscribedRooms) && !confirmRelinquish) {
            const rooms = yield (0, getUserSingleOwnedRooms_1.getUserSingleOwnedRooms)(subscribedRooms);
            throw new meteor_1.Meteor.Error('user-last-owner', '', rooms);
        }
        // Users without username can't do anything, so there is nothing to remove
        if (user.username != null) {
            let userToReplaceWhenUnlinking = null;
            const nameAlias = i18n_1.i18n.t('Removed_User');
            yield (0, relinquishRoomOwnerships_1.relinquishRoomOwnerships)(userId, subscribedRooms);
            const messageErasureType = server_2.settings.get('Message_ErasureType');
            switch (messageErasureType) {
                case 'Delete':
                    const store = server_1.FileUpload.getStore('Uploads');
                    const cursor = models_1.Messages.findFilesByUserId(userId);
                    try {
                        for (var _d = true, cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _a = cursor_1_1.done, !_a; _d = true) {
                            _c = cursor_1_1.value;
                            _d = false;
                            const { file } = _c;
                            if (!file) {
                                continue;
                            }
                            yield store.deleteById(file._id);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_d && !_a && (_b = cursor_1.return)) yield _b.call(cursor_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    yield models_1.Messages.removeByUserId(userId);
                    yield models_1.ReadReceipts.removeByUserId(userId);
                    yield models_1.ModerationReports.hideMessageReportsByUserId(userId, deletedBy || userId, deletedBy === userId ? 'user deleted own account' : 'user account deleted', 'DELETE_USER');
                    break;
                case 'Unlink':
                    userToReplaceWhenUnlinking = yield models_1.Users.findOneById('rocket.cat');
                    if (!(userToReplaceWhenUnlinking === null || userToReplaceWhenUnlinking === void 0 ? void 0 : userToReplaceWhenUnlinking._id) || !(userToReplaceWhenUnlinking === null || userToReplaceWhenUnlinking === void 0 ? void 0 : userToReplaceWhenUnlinking.username)) {
                        break;
                    }
                    yield models_1.Messages.unlinkUserId(userId, userToReplaceWhenUnlinking === null || userToReplaceWhenUnlinking === void 0 ? void 0 : userToReplaceWhenUnlinking._id, userToReplaceWhenUnlinking === null || userToReplaceWhenUnlinking === void 0 ? void 0 : userToReplaceWhenUnlinking.username, nameAlias);
                    break;
            }
            yield models_1.Rooms.updateGroupDMsRemovingUsernamesByUsername(user.username, userId); // Remove direct rooms with the user
            yield models_1.Rooms.removeDirectRoomContainingUsername(user.username); // Remove direct rooms with the user
            const rids = subscribedRooms.map((room) => room.rid);
            void (0, notifyListener_1.notifyOnRoomChangedById)(rids);
            yield models_1.Subscriptions.removeByUserId(userId);
            // Remove user as livechat agent
            if (user.roles.includes('livechat-agent')) {
                const departmentAgents = yield models_1.LivechatDepartmentAgents.findByAgentId(userId).toArray();
                const { deletedCount } = yield models_1.LivechatDepartmentAgents.removeByAgentId(userId);
                if (deletedCount > 0) {
                    departmentAgents.forEach((depAgent) => {
                        void (0, notifyListener_1.notifyOnLivechatDepartmentAgentChanged)({
                            _id: depAgent._id,
                            agentId: userId,
                            departmentId: depAgent.departmentId,
                        }, 'removed');
                    });
                }
            }
            if (user.roles.includes('livechat-monitor')) {
                // Remove user as Unit Monitor
                yield models_1.LivechatUnitMonitors.removeByMonitorId(userId);
            }
            // This is for compatibility. Since we allowed any user to be contact manager b4, we need to have the same logic
            // for deletion.
            yield models_1.LivechatVisitors.removeContactManagerByUsername(user.username);
            // removes user's avatar
            if (user.avatarOrigin === 'upload' || user.avatarOrigin === 'url' || user.avatarOrigin === 'rest') {
                yield server_1.FileUpload.getStore('Avatars').deleteByName(user.username);
            }
            // Disables all the integrations which rely on the user being deleted.
            yield models_1.Integrations.disableByUserId(userId);
            void (0, notifyListener_1.notifyOnIntegrationChangedByUserId)(userId);
            // Don't broadcast user.deleted for Erasure Type of 'Keep' so that messages don't disappear from logged in sessions
            if (messageErasureType === 'Delete') {
                void core_services_1.api.broadcast('user.deleted', user, {
                    messageErasureType,
                });
            }
            if (messageErasureType === 'Unlink' && userToReplaceWhenUnlinking) {
                void core_services_1.api.broadcast('user.deleted', user, {
                    messageErasureType,
                    replaceByUser: { _id: userToReplaceWhenUnlinking._id, username: userToReplaceWhenUnlinking === null || userToReplaceWhenUnlinking === void 0 ? void 0 : userToReplaceWhenUnlinking.username, alias: nameAlias },
                });
            }
        }
        // Remove user from users database
        yield models_1.Users.removeById(userId);
        // update name and fname of group direct messages
        yield (0, updateGroupDMsName_1.updateGroupDMsName)(user);
        // Refresh the servers list
        yield models_1.FederationServers.refreshServers();
        void (0, notifyListener_1.notifyOnUserChange)({ clientAction: 'removed', id: user._id });
        yield callbacks_1.callbacks.run('afterDeleteUser', user);
    });
}
