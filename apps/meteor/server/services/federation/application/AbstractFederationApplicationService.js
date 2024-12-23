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
exports.AbstractFederationApplicationService = void 0;
const FederatedUser_1 = require("../domain/FederatedUser");
class AbstractFederationApplicationService {
    constructor(bridge, internalUserAdapter, internalFileAdapter, internalSettingsAdapter) {
        this.bridge = bridge;
        this.internalUserAdapter = internalUserAdapter;
        this.internalFileAdapter = internalFileAdapter;
        this.internalSettingsAdapter = internalSettingsAdapter;
        this.internalHomeServerDomain = this.internalSettingsAdapter.getHomeServerDomain();
    }
    createFederatedUserInternallyOnly(externalUserId_1, username_1) {
        return __awaiter(this, arguments, void 0, function* (externalUserId, username, existsOnlyOnProxyServer = false, providedName) {
            const internalUser = yield this.internalUserAdapter.getInternalUserByUsername(username);
            const externalUserProfileInformation = yield this.bridge.getUserProfileInformation(externalUserId);
            let federatedUser;
            if (internalUser) {
                federatedUser = FederatedUser_1.FederatedUser.createWithInternalReference(externalUserId, existsOnlyOnProxyServer, internalUser);
            }
            else {
                const name = (externalUserProfileInformation === null || externalUserProfileInformation === void 0 ? void 0 : externalUserProfileInformation.displayName) || providedName || username;
                federatedUser = FederatedUser_1.FederatedUser.createInstance(externalUserId, {
                    name,
                    username,
                    existsOnlyOnProxyServer,
                });
            }
            yield this.internalUserAdapter.createFederatedUser(federatedUser);
            const insertedUser = yield this.internalUserAdapter.getFederatedUserByExternalId(externalUserId);
            if (!insertedUser) {
                return;
            }
            yield this.updateUserAvatarInternally(insertedUser, externalUserProfileInformation === null || externalUserProfileInformation === void 0 ? void 0 : externalUserProfileInformation.avatarUrl);
            yield this.updateUserDisplayNameInternally(insertedUser, externalUserProfileInformation === null || externalUserProfileInformation === void 0 ? void 0 : externalUserProfileInformation.displayName);
        });
    }
    updateUserAvatarInternally(federatedUser, avatarUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!avatarUrl) {
                return;
            }
            if (!federatedUser.isRemote()) {
                return;
            }
            if (federatedUser.shouldUpdateFederationAvatar(avatarUrl)) {
                yield this.internalUserAdapter.setAvatar(federatedUser, yield this.bridge.convertMatrixUrlToHttp(federatedUser.getExternalId(), avatarUrl));
                yield this.internalUserAdapter.updateFederationAvatar(federatedUser.getInternalId(), avatarUrl);
            }
        });
    }
    updateUserDisplayNameInternally(federatedUser, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!displayName) {
                return;
            }
            if (!federatedUser.isRemote()) {
                return;
            }
            if (federatedUser.shouldUpdateDisplayName(displayName)) {
                yield this.internalUserAdapter.updateRealName(federatedUser.getInternalReference(), displayName);
            }
        });
    }
    createFederatedUserIncludingHomeserverUsingLocalInformation(internalInviterId) {
        return __awaiter(this, void 0, void 0, function* () {
            const internalUser = yield this.internalUserAdapter.getInternalUserById(internalInviterId);
            if (!internalUser || !(internalUser === null || internalUser === void 0 ? void 0 : internalUser.username)) {
                throw new Error(`Could not find user id for ${internalInviterId}`);
            }
            const name = internalUser.name || internalUser.username;
            const externalInviterId = yield this.bridge.createUser(internalUser.username, name, this.internalHomeServerDomain);
            const existsOnlyOnProxyServer = true;
            yield this.createFederatedUserInternallyOnly(externalInviterId, internalUser.username, existsOnlyOnProxyServer, name);
            yield this.updateUserAvatarExternally(internalUser, (yield this.internalUserAdapter.getFederatedUserByExternalId(externalInviterId)));
            return externalInviterId;
        });
    }
    updateUserAvatarExternally(internalUser, externalInviter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!internalUser.username) {
                return;
            }
            const buffer = yield this.internalFileAdapter.getBufferForAvatarFile(internalUser.username);
            if (!buffer) {
                return;
            }
            const avatarFileRecord = yield this.internalFileAdapter.getFileMetadataForAvatarFile(internalUser.username);
            if (!(avatarFileRecord === null || avatarFileRecord === void 0 ? void 0 : avatarFileRecord.type) || !(avatarFileRecord === null || avatarFileRecord === void 0 ? void 0 : avatarFileRecord.name)) {
                return;
            }
            const externalFileUri = yield this.bridge.uploadContent(externalInviter.getExternalId(), buffer, {
                type: avatarFileRecord.type,
                name: avatarFileRecord.name,
            });
            if (!externalFileUri) {
                return;
            }
            yield this.internalUserAdapter.updateFederationAvatar(internalUser._id, externalFileUri);
            yield this.bridge.setUserAvatar(externalInviter.getExternalId(), externalFileUri);
        });
    }
}
exports.AbstractFederationApplicationService = AbstractFederationApplicationService;
