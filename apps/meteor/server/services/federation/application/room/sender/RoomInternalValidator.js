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
exports.FederationRoomInternalValidator = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const FederatedRoom_1 = require("../../../domain/FederatedRoom");
const FederatedUser_1 = require("../../../domain/FederatedUser");
const AbstractFederationApplicationService_1 = require("../../AbstractFederationApplicationService");
class FederationRoomInternalValidator extends AbstractFederationApplicationService_1.AbstractFederationApplicationService {
    constructor(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalSettingsAdapter, bridge) {
        super(bridge, internalUserAdapter, internalFileAdapter, internalSettingsAdapter);
        this.internalRoomAdapter = internalRoomAdapter;
        this.internalUserAdapter = internalUserAdapter;
        this.internalFileAdapter = internalFileAdapter;
        this.internalSettingsAdapter = internalSettingsAdapter;
        this.bridge = bridge;
    }
    canAddFederatedUserToNonFederatedRoom(internalUser, internalRoom) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, core_typings_1.isRoomFederated)(internalRoom)) {
                return;
            }
            if (this.isAddingANewExternalUser(internalUser)) {
                throw new Error('error-cant-add-federated-users');
            }
            const user = yield this.internalUserAdapter.getFederatedUserByInternalId(internalUser._id);
            const isAFederatedUser = user === null || user === void 0 ? void 0 : user.isRemote();
            if (isAFederatedUser) {
                throw new Error('error-cant-add-federated-users');
            }
        });
    }
    canAddFederatedUserToFederatedRoom(internalUser, internalInviter, internalRoom) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, core_typings_1.isRoomFederated)(internalRoom)) {
                return;
            }
            if (this.isAddingANewExternalUser(internalUser) && !(0, core_typings_1.isDirectMessageRoom)(internalRoom)) {
                throw new Error('error-this-is-a-premium-feature');
            }
            const inviter = yield this.internalUserAdapter.getFederatedUserByInternalId(internalInviter._id);
            const externalRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoom._id);
            if (!externalRoom || !inviter) {
                return;
            }
            const isRoomFromTheProxyServer = FederatedRoom_1.FederatedRoom.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(externalRoom.getExternalId()), this.internalHomeServerDomain);
            const isInviterFromTheProxyServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(inviter.getExternalId()), this.internalHomeServerDomain);
            const fullActionExecutedOnTheRemoteHomeServer = !isRoomFromTheProxyServer && !isInviterFromTheProxyServer;
            if (fullActionExecutedOnTheRemoteHomeServer) {
                return;
            }
            const invitee = yield this.internalUserAdapter.getFederatedUserByInternalId(internalUser._id);
            const addingAnExternalUser = invitee === null || invitee === void 0 ? void 0 : invitee.isRemote();
            const addingExternalUserToNonDirectMessageRoom = addingAnExternalUser && !(0, core_typings_1.isDirectMessageRoom)(internalRoom);
            if (addingExternalUserToNonDirectMessageRoom) {
                throw new Error('error-this-is-a-premium-feature');
            }
        });
    }
    canCreateDirectMessageFromUI(internalUsers) {
        return __awaiter(this, void 0, void 0, function* () {
            const usernames = internalUsers.map((user) => {
                if (this.isAddingANewExternalUser(user)) {
                    return user;
                }
                return user.username || '';
            });
            const atLeastOneExternalUser = usernames.some((username) => !FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(username), this.internalHomeServerDomain)) || internalUsers.filter((user) => !this.isAddingANewExternalUser(user)).some((user) => (0, core_typings_1.isUserFederated)(user));
            if (atLeastOneExternalUser) {
                throw new Error('error-this-is-a-premium-feature');
            }
        });
    }
    isAddingANewExternalUser(user) {
        return typeof user === 'string';
    }
}
exports.FederationRoomInternalValidator = FederationRoomInternalValidator;
