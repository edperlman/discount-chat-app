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
exports.FederationUserServiceSender = void 0;
const AbstractFederationApplicationService_1 = require("../../AbstractFederationApplicationService");
class FederationUserServiceSender extends AbstractFederationApplicationService_1.AbstractFederationApplicationService {
    constructor(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalSettingsAdapter, bridge) {
        super(bridge, internalUserAdapter, internalFileAdapter, internalSettingsAdapter);
        this.internalRoomAdapter = internalRoomAdapter;
        this.internalUserAdapter = internalUserAdapter;
        this.internalFileAdapter = internalFileAdapter;
        this.internalSettingsAdapter = internalSettingsAdapter;
        this.bridge = bridge;
    }
    afterUserAvatarChanged(internalUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const federatedUser = yield this.internalUserAdapter.getFederatedUserByInternalUsername(internalUsername);
            if (!federatedUser) {
                const internalUser = yield this.internalUserAdapter.getInternalUserByUsername(internalUsername);
                if (!internalUser) {
                    return;
                }
                yield this.createFederatedUserIncludingHomeserverUsingLocalInformation(internalUser._id);
                return;
            }
            if (federatedUser.isRemote()) {
                return;
            }
            yield this.updateUserAvatarExternally(federatedUser.getInternalReference(), federatedUser);
        });
    }
    afterUserRealNameChanged(internalUserId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const federatedUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalUserId);
            if (!federatedUser) {
                const internalUser = yield this.internalUserAdapter.getInternalUserById(internalUserId);
                if (!internalUser) {
                    return;
                }
                yield this.createFederatedUserIncludingHomeserverUsingLocalInformation(internalUser._id);
                return;
            }
            if (federatedUser.isRemote()) {
                return;
            }
            const externalUserProfileInformation = yield this.bridge.getUserProfileInformation(federatedUser.getExternalId());
            if (!federatedUser.shouldUpdateDisplayName((externalUserProfileInformation === null || externalUserProfileInformation === void 0 ? void 0 : externalUserProfileInformation.displayName) || '')) {
                return;
            }
            yield this.bridge.setUserDisplayName(federatedUser.getExternalId(), name);
        });
    }
    onUserTyping(internalUsername, internalRoomId, isTyping) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.internalSettingsAdapter.isTypingStatusEnabled()) {
                return;
            }
            const federatedUser = yield this.internalUserAdapter.getFederatedUserByInternalUsername(internalUsername);
            if (!federatedUser) {
                return;
            }
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoomId);
            if (!federatedRoom) {
                return;
            }
            yield this.bridge.notifyUserTyping(federatedRoom.getExternalId(), federatedUser.getExternalId(), isTyping);
        });
    }
}
exports.FederationUserServiceSender = FederationUserServiceSender;
