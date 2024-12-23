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
exports.FederationHooks = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const callbacks_1 = require("../../../../../../lib/callbacks");
const afterLeaveRoomCallback_1 = require("../../../../../../lib/callbacks/afterLeaveRoomCallback");
const afterRemoveFromRoomCallback_1 = require("../../../../../../lib/callbacks/afterRemoveFromRoomCallback");
const utils_1 = require("../../../utils");
class FederationHooks {
    static afterUserLeaveRoom(callback) {
        afterLeaveRoomCallback_1.afterLeaveRoomCallback.add((user, room) => __awaiter(this, void 0, void 0, function* () {
            if (!room || !(0, core_typings_1.isRoomFederated)(room) || !user) {
                return;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
            yield callback(user, room);
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-after-leave-room');
    }
    static onUserRemovedFromRoom(callback) {
        afterRemoveFromRoomCallback_1.afterRemoveFromRoomCallback.add((params, room) => __awaiter(this, void 0, void 0, function* () {
            if (!room || !(0, core_typings_1.isRoomFederated)(room) || !params || !params.removedUser || !params.userWhoRemoved) {
                return;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
            yield callback(params.removedUser, room, params.userWhoRemoved);
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-after-remove-from-room');
    }
    static canAddFederatedUserToNonFederatedRoom(callback) {
        callbacks_1.callbacks.add('federation.beforeAddUserToARoom', (params, room) => __awaiter(this, void 0, void 0, function* () {
            if (!(params === null || params === void 0 ? void 0 : params.user) || !room || !(0, utils_1.isFederationEnabled)()) {
                return;
            }
            yield callback(params.user, room);
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-can-add-federated-user-to-non-federated-room');
    }
    static canAddFederatedUserToFederatedRoom(callback) {
        callbacks_1.callbacks.add('federation.beforeAddUserToARoom', (params, room) => __awaiter(this, void 0, void 0, function* () {
            if (!(params === null || params === void 0 ? void 0 : params.user) || !params.inviter || !room || !(0, utils_1.isFederationEnabled)()) {
                return;
            }
            yield callback(params.user, params.inviter, room);
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-can-add-federated-user-to-federated-room');
    }
    static canCreateDirectMessageFromUI(callback) {
        callbacks_1.callbacks.add('federation.beforeCreateDirectMessage', (members) => __awaiter(this, void 0, void 0, function* () {
            if (!members) {
                return;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
            yield callback(members);
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-can-create-direct-message-from-ui-ce');
    }
    static afterMessageReacted(callback) {
        callbacks_1.callbacks.add('afterSetReaction', (message, params) => __awaiter(this, void 0, void 0, function* () {
            if (!message || !(0, core_typings_1.isMessageFromMatrixFederation)(message) || !params || !params.user || !params.reaction) {
                return;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
            yield callback(message, params.user, params.reaction);
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-after-message-reacted');
    }
    static afterMessageunReacted(callback) {
        callbacks_1.callbacks.add('afterUnsetReaction', (message, params) => __awaiter(this, void 0, void 0, function* () {
            if (!message || !(0, core_typings_1.isMessageFromMatrixFederation)(message) || !params || !params.user || !params.reaction || !params.oldMessage) {
                return;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
            yield callback(params.oldMessage, params.user, params.reaction);
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-after-message-unreacted');
    }
    static afterMessageDeleted(callback) {
        callbacks_1.callbacks.add('afterDeleteMessage', (message, room) => __awaiter(this, void 0, void 0, function* () {
            if (!room || !message || !(0, core_typings_1.isRoomFederated)(room) || !(0, core_typings_1.isMessageFromMatrixFederation)(message)) {
                return;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
            yield callback(message, room._id);
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-after-room-message-deleted');
    }
    static afterMessageUpdated(callback) {
        callbacks_1.callbacks.add('afterSaveMessage', (message_1, _a) => __awaiter(this, [message_1, _a], void 0, function* (message, { room }) {
            if (!room || !(0, core_typings_1.isRoomFederated)(room) || !message || !(0, core_typings_1.isMessageFromMatrixFederation)(message)) {
                return message;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
            if (!(0, core_typings_1.isEditedMessage)(message)) {
                return message;
            }
            yield callback(message, room._id, message.editedBy._id);
            return message;
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-after-room-message-updated');
    }
    static afterMessageSent(callback) {
        callbacks_1.callbacks.add('afterSaveMessage', (message_1, _a) => __awaiter(this, [message_1, _a], void 0, function* (message, { room }) {
            var _b;
            if (!room || !(0, core_typings_1.isRoomFederated)(room) || !message) {
                return message;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
            if ((0, core_typings_1.isEditedMessage)(message)) {
                return message;
            }
            yield callback(message, room._id, (_b = message.u) === null || _b === void 0 ? void 0 : _b._id);
            return message;
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-after-room-message-sent');
    }
    static afterRoomRoleChanged(federationRoomService, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data) {
                return;
            }
            if (!(0, utils_1.isFederationEnabled)()) {
                return;
            }
            (0, utils_1.throwIfFederationNotReady)();
            const { _id: role, type: action, scope: internalRoomId, u: { _id: internalTargetUserId = undefined } = {}, givenByUserId: internalUserId, } = data;
            const roleEventsInterestedIn = ['moderator', 'owner'];
            if (!roleEventsInterestedIn.includes(role)) {
                return;
            }
            const handlers = {
                'owner-added': (internalUserId, internalTargetUserId, internalRoomId) => federationRoomService.onRoomOwnerAdded(internalUserId, internalTargetUserId, internalRoomId),
                'owner-removed': (internalUserId, internalTargetUserId, internalRoomId) => federationRoomService.onRoomOwnerRemoved(internalUserId, internalTargetUserId, internalRoomId),
                'moderator-added': (internalUserId, internalTargetUserId, internalRoomId) => federationRoomService.onRoomModeratorAdded(internalUserId, internalTargetUserId, internalRoomId),
                'moderator-removed': (internalUserId, internalTargetUserId, internalRoomId) => federationRoomService.onRoomModeratorRemoved(internalUserId, internalTargetUserId, internalRoomId),
            };
            if (!handlers[`${role}-${action}`]) {
                return;
            }
            yield handlers[`${role}-${action}`](internalUserId, internalTargetUserId, internalRoomId);
        });
    }
    static afterRoomNameChanged(callback) {
        callbacks_1.callbacks.add('afterRoomNameChange', (params) => __awaiter(this, void 0, void 0, function* () {
            if (!(params === null || params === void 0 ? void 0 : params.rid) || !params.name) {
                return;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
            yield callback(params.rid, params.name);
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-after-room-name-changed');
    }
    static afterRoomTopicChanged(callback) {
        callbacks_1.callbacks.add('afterRoomTopicChange', (params) => __awaiter(this, void 0, void 0, function* () {
            if (!(params === null || params === void 0 ? void 0 : params.rid) || !params.topic) {
                return;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
            yield callback(params.rid, params.topic);
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-after-room-topic-changed');
    }
    static removeCEValidation() {
        callbacks_1.callbacks.remove('federation.beforeAddUserToARoom', 'federation-v2-can-add-federated-user-to-federated-room');
        callbacks_1.callbacks.remove('federation.beforeCreateDirectMessage', 'federation-v2-can-create-direct-message-from-ui-ce');
    }
    static removeAllListeners() {
        afterLeaveRoomCallback_1.afterLeaveRoomCallback.remove('federation-v2-after-leave-room');
        afterRemoveFromRoomCallback_1.afterRemoveFromRoomCallback.remove('federation-v2-after-remove-from-room');
        callbacks_1.callbacks.remove('federation.beforeAddUserToARoom', 'federation-v2-can-add-federated-user-to-non-federated-room');
        callbacks_1.callbacks.remove('federation.beforeAddUserToARoom', 'federation-v2-can-add-federated-user-to-federated-room');
        callbacks_1.callbacks.remove('federation.beforeCreateDirectMessage', 'federation-v2-can-create-direct-message-from-ui-ce');
        callbacks_1.callbacks.remove('afterSetReaction', 'federation-v2-after-message-reacted');
        callbacks_1.callbacks.remove('afterUnsetReaction', 'federation-v2-after-message-unreacted');
        callbacks_1.callbacks.remove('afterDeleteMessage', 'federation-v2-after-room-message-deleted');
        callbacks_1.callbacks.remove('afterSaveMessage', 'federation-v2-after-room-message-updated');
        callbacks_1.callbacks.remove('afterSaveMessage', 'federation-v2-after-room-message-sent');
        callbacks_1.callbacks.remove('afterSaveMessage', 'federation-v2-after-room-message-sent');
        callbacks_1.callbacks.remove('afterRoomNameChange', 'federation-v2-after-room-name-changed');
        callbacks_1.callbacks.remove('afterRoomTopicChange', 'federation-v2-after-room-topic-changed');
    }
}
exports.FederationHooks = FederationHooks;
