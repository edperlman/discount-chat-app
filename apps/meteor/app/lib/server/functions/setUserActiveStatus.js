"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.setUserActiveStatus = setUserActiveStatus;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const accounts_base_1 = require("meteor/accounts-base");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const closeOmnichannelConversations_1 = require("./closeOmnichannelConversations");
const getRoomsWithSingleOwner_1 = require("./getRoomsWithSingleOwner");
const getUserSingleOwnedRooms_1 = require("./getUserSingleOwnedRooms");
const relinquishRoomOwnerships_1 = require("./relinquishRoomOwnerships");
const callbacks_1 = require("../../../../lib/callbacks");
const Mailer = __importStar(require("../../../mailer/server/api"));
const server_1 = require("../../../settings/server");
const notifyListener_1 = require("../lib/notifyListener");
function reactivateDirectConversations(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // since both users can be deactivated at the same time, we should just reactivate rooms if both users are active
        // for that, we need to fetch the direct messages, fetch the users involved and then the ids of rooms we can reactivate
        const directConversations = yield models_1.Rooms.getDirectConversationsByUserId(userId, {
            projection: { _id: 1, uids: 1, t: 1 },
        }).toArray();
        const userIds = directConversations.reduce((acc, r) => {
            if ((0, core_typings_1.isDirectMessageRoom)(r)) {
                acc.push(...r.uids);
            }
            return acc;
        }, []);
        const uniqueUserIds = [...new Set(userIds)];
        const activeUsers = yield models_1.Users.findActiveByUserIds(uniqueUserIds, { projection: { _id: 1 } }).toArray();
        const activeUserIds = activeUsers.map((u) => u._id);
        const roomsToReactivate = directConversations.reduce((acc, room) => {
            const otherUserId = (0, core_typings_1.isDirectMessageRoom)(room) ? room.uids.find((u) => u !== userId) : undefined;
            if (otherUserId && activeUserIds.includes(otherUserId)) {
                acc.push(room._id);
            }
            return acc;
        }, []);
        const setDmReadOnlyResponse = yield models_1.Rooms.setDmReadOnlyByUserId(userId, roomsToReactivate, false, false);
        if (setDmReadOnlyResponse.modifiedCount) {
            void (0, notifyListener_1.notifyOnRoomChangedById)(roomsToReactivate);
        }
    });
}
function setUserActiveStatus(userId_1, active_1) {
    return __awaiter(this, arguments, void 0, function* (userId, active, confirmRelinquish = false) {
        (0, check_1.check)(userId, String);
        (0, check_1.check)(active, Boolean);
        const user = yield models_1.Users.findOneById(userId);
        if (!user) {
            return false;
        }
        if ((0, core_typings_1.isUserFederated)(user)) {
            throw new meteor_1.Meteor.Error('error-user-is-federated', 'Cannot change federated users status', {
                method: 'setUserActiveStatus',
            });
        }
        if (user.active !== active) {
            const remoteUser = yield models_1.MatrixBridgedUser.getExternalUserIdByLocalUserId(userId);
            if (remoteUser) {
                if (active) {
                    throw new meteor_1.Meteor.Error('error-not-allowed', 'Deactivated federated users can not be re-activated', {
                        method: 'setUserActiveStatus',
                    });
                }
                const federation = (yield core_services_1.License.hasValidLicense()) ? core_services_1.FederationEE : core_services_1.Federation;
                yield federation.deactivateRemoteUser(remoteUser);
            }
        }
        // Users without username can't do anything, so there is no need to check for owned rooms
        if (user.username != null && !active) {
            const userAdmin = yield models_1.Users.findOneAdmin(userId || '');
            const adminsCount = yield models_1.Users.countActiveUsersInRoles(['admin']);
            if (userAdmin && adminsCount === 1) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Leaving the app without an active admin is not allowed', {
                    method: 'removeUserFromRole',
                    action: 'Remove_last_admin',
                });
            }
            const subscribedRooms = yield (0, getRoomsWithSingleOwner_1.getSubscribedRoomsForUserWithDetails)(userId);
            // give omnichannel rooms a special treatment :)
            const chatSubscribedRooms = subscribedRooms.filter(({ t }) => t !== 'l');
            const livechatSubscribedRooms = subscribedRooms.filter(({ t }) => t === 'l');
            if ((0, getRoomsWithSingleOwner_1.shouldRemoveOrChangeOwner)(chatSubscribedRooms) && !confirmRelinquish) {
                const rooms = yield (0, getUserSingleOwnedRooms_1.getUserSingleOwnedRooms)(chatSubscribedRooms);
                throw new meteor_1.Meteor.Error('user-last-owner', '', rooms);
            }
            // We don't want one killing the other :)
            yield Promise.allSettled([
                (0, closeOmnichannelConversations_1.closeOmnichannelConversations)(user, livechatSubscribedRooms),
                (0, relinquishRoomOwnerships_1.relinquishRoomOwnerships)(user._id, chatSubscribedRooms, false),
            ]);
        }
        if (active && !user.active) {
            yield callbacks_1.callbacks.run('beforeActivateUser', user);
        }
        yield models_1.Users.setUserActive(userId, active);
        if (active && !user.active) {
            yield callbacks_1.callbacks.run('afterActivateUser', user);
        }
        if (!active && user.active) {
            yield callbacks_1.callbacks.run('afterDeactivateUser', user);
        }
        if (user.username) {
            const { modifiedCount } = yield models_1.Subscriptions.setArchivedByUsername(user.username, !active);
            if (modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedByNameAndRoomType)({ t: 'd', name: user.username });
            }
        }
        if (active === false) {
            yield models_1.Users.unsetLoginTokens(userId);
            yield models_1.Rooms.setDmReadOnlyByUserId(userId, undefined, true, false);
            void (0, notifyListener_1.notifyOnUserChange)({ clientAction: 'updated', id: userId, diff: { 'services.resume.loginTokens': [], active } });
            void (0, notifyListener_1.notifyOnRoomChangedByUserDM)(userId);
        }
        else {
            yield models_1.Users.unsetReason(userId);
            void (0, notifyListener_1.notifyOnUserChange)({ clientAction: 'updated', id: userId, diff: { active } });
            yield reactivateDirectConversations(userId);
        }
        if (active && !server_1.settings.get('Accounts_Send_Email_When_Activating')) {
            return true;
        }
        if (!active && !server_1.settings.get('Accounts_Send_Email_When_Deactivating')) {
            return true;
        }
        if (!user.emails || !Array.isArray(user.emails) || user.emails.length === 0) {
            return true;
        }
        const destinations = user.emails.map((email) => `${user.name || user.username}<${email.address}>`);
        const { subject, html } = accounts_base_1.Accounts.emailTemplates.userActivated;
        const email = {
            to: String(destinations),
            from: String(server_1.settings.get('From_Email')),
            subject: subject({ active }),
            html: html({
                active,
                name: user.name,
                username: user.username,
            }),
        };
        void Mailer.sendNoWrap(email);
    });
}
