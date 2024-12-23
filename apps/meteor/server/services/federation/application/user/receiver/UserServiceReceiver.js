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
exports.FederationUserServiceReceiver = void 0;
const AbstractFederationApplicationService_1 = require("../../AbstractFederationApplicationService");
class FederationUserServiceReceiver extends AbstractFederationApplicationService_1.AbstractFederationApplicationService {
    constructor(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalNotificationAdapter, internalSettingsAdapter, bridge) {
        super(bridge, internalUserAdapter, internalFileAdapter, internalSettingsAdapter);
        this.internalRoomAdapter = internalRoomAdapter;
        this.internalUserAdapter = internalUserAdapter;
        this.internalFileAdapter = internalFileAdapter;
        this.internalNotificationAdapter = internalNotificationAdapter;
        this.internalSettingsAdapter = internalSettingsAdapter;
        this.bridge = bridge;
        this.usersTypingByRoomIdCache = new Map();
    }
    handleUsersWhoStoppedTyping(externalRoomId, internalRoomId, externalUserIdsTyping) {
        var _a, _b;
        const isTyping = false;
        const notTypingAnymore = (_a = this.usersTypingByRoomIdCache
            .get(externalRoomId)) === null || _a === void 0 ? void 0 : _a.filter((user) => !externalUserIdsTyping.includes(user.externalUserId));
        const stillTyping = (_b = this.usersTypingByRoomIdCache
            .get(externalRoomId)) === null || _b === void 0 ? void 0 : _b.filter((user) => externalUserIdsTyping.includes(user.externalUserId));
        notTypingAnymore === null || notTypingAnymore === void 0 ? void 0 : notTypingAnymore.forEach((user) => this.internalNotificationAdapter.notifyUserTypingOnRoom(internalRoomId, user.username, isTyping));
        this.usersTypingByRoomIdCache.set(externalRoomId, stillTyping || []);
    }
    onUserTyping(userTypingInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { externalUserIdsTyping, externalRoomId } = userTypingInput;
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId);
            if (!federatedRoom) {
                return;
            }
            if (this.usersTypingByRoomIdCache.has(externalRoomId)) {
                this.handleUsersWhoStoppedTyping(externalRoomId, federatedRoom.getInternalId(), externalUserIdsTyping);
            }
            if (externalUserIdsTyping.length === 0) {
                return;
            }
            const federatedUsers = yield this.internalUserAdapter.getFederatedUsersByExternalIds(externalUserIdsTyping);
            if (federatedUsers.length === 0) {
                return;
            }
            const isTyping = true;
            this.usersTypingByRoomIdCache.set(externalRoomId, federatedUsers.map((federatedUser) => {
                void this.internalNotificationAdapter.notifyUserTypingOnRoom(federatedRoom.getInternalId(), federatedUser.getUsername(), isTyping);
                return {
                    externalUserId: federatedUser.getInternalId(),
                    username: federatedUser.getUsername(),
                };
            }));
        });
    }
}
exports.FederationUserServiceReceiver = FederationUserServiceReceiver;
