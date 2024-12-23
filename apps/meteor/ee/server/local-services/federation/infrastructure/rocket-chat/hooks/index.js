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
exports.FederationHooksEE = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const callbacks_1 = require("../../../../../../../lib/callbacks");
const utils_1 = require("../../../../../../../server/services/federation/utils");
class FederationHooksEE {
    static onFederatedRoomCreated(callback) {
        callbacks_1.callbacks.add('federation.afterCreateFederatedRoom', (room, params) => __awaiter(this, void 0, void 0, function* () {
            if (!room || !(0, core_typings_1.isRoomFederated)(room) || !params || !params.owner || !params.originalMemberList) {
                return;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
            yield callback(room, params.owner, params.originalMemberList);
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-after-create-room');
    }
    static onUsersAddedToARoom(callback) {
        callbacks_1.callbacks.add('federation.onAddUsersToARoom', (params, room) => __awaiter(this, void 0, void 0, function* () {
            if (!room || !(0, core_typings_1.isRoomFederated)(room) || !params || !params.invitees || !params.inviter) {
                return;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
            yield callback(room, params.invitees, params.inviter);
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-on-add-users-to-a-room');
        callbacks_1.callbacks.add('afterAddedToRoom', (params, room) => __awaiter(this, void 0, void 0, function* () {
            if (!room || !(0, core_typings_1.isRoomFederated)(room) || !params || !params.user) {
                return;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
            yield callback(room, [params.user], params === null || params === void 0 ? void 0 : params.inviter);
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-after-add-user-to-a-room');
    }
    static onDirectMessageRoomCreated(callback) {
        callbacks_1.callbacks.add('afterCreateDirectRoom', (room, params) => __awaiter(this, void 0, void 0, function* () {
            if (!room || !params || !params.creatorId || !params.creatorId) {
                return;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
            yield callback(room, params.creatorId, params.members);
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-after-create-direct-message-room');
    }
    static beforeDirectMessageRoomCreate(callback) {
        callbacks_1.callbacks.add('beforeCreateDirectRoom', (members) => __awaiter(this, void 0, void 0, function* () {
            if (!members) {
                return;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
            yield callback(members);
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-before-create-direct-message-room');
    }
    static beforeAddUserToARoom(callback) {
        callbacks_1.callbacks.add('federation.beforeAddUserToARoom', (params, room) => __awaiter(this, void 0, void 0, function* () {
            if (!room || !(0, core_typings_1.isRoomFederated)(room) || !params || !params.user) {
                return;
            }
            (0, utils_1.throwIfFederationNotEnabledOrNotReady)();
            yield callback(params.user, room, params.inviter);
        }), callbacks_1.callbacks.priority.HIGH, 'federation-v2-before-add-user-to-the-room');
    }
    static removeAllListeners() {
        callbacks_1.callbacks.remove('beforeCreateDirectRoom', 'federation-v2-before-create-direct-message-room');
        callbacks_1.callbacks.remove('afterCreateDirectRoom', 'federation-v2-after-create-direct-message-room');
        callbacks_1.callbacks.remove('federation.onAddUsersToARoom', 'federation-v2-on-add-users-to-a-room');
        callbacks_1.callbacks.remove('afterAddedToRoom', 'federation-v2-after-add-user-to-a-room');
        callbacks_1.callbacks.remove('federation.afterCreateFederatedRoom', 'federation-v2-after-create-room');
        callbacks_1.callbacks.remove('federation.beforeAddUserToARoom', 'federation-v2-before-add-user-to-the-room');
    }
}
exports.FederationHooksEE = FederationHooksEE;
