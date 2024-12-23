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
exports.RocketChatUserAdapter = exports.getFederatedUserByInternalUsername = void 0;
const models_1 = require("@rocket.chat/models");
const setRealName_1 = require("../../../../../../app/lib/server/functions/setRealName");
const setUserAvatar_1 = require("../../../../../../app/lib/server/functions/setUserAvatar");
const FederatedUser_1 = require("../../../domain/FederatedUser");
const RoomReceiver_1 = require("../../matrix/converters/room/RoomReceiver");
const createFederatedUserInstance = (externalUserId, user, remote = true) => {
    const federatedUser = FederatedUser_1.FederatedUser.createWithInternalReference(externalUserId, !remote, user);
    return federatedUser;
};
const getFederatedUserByInternalUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.Users.findOneByUsername(username);
    if (!user) {
        return;
    }
    const internalBridgedUser = yield models_1.MatrixBridgedUser.getBridgedUserByLocalId(user._id);
    if (!internalBridgedUser) {
        return;
    }
    const { mui: externalUserId, remote } = internalBridgedUser;
    return createFederatedUserInstance(externalUserId, user, remote);
});
exports.getFederatedUserByInternalUsername = getFederatedUserByInternalUsername;
class RocketChatUserAdapter {
    getFederatedUserByExternalId(externalUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const internalBridgedUser = yield models_1.MatrixBridgedUser.getBridgedUserByExternalUserId(externalUserId);
            if (!internalBridgedUser) {
                return;
            }
            const user = yield models_1.Users.findOneById(internalBridgedUser.uid);
            if (user) {
                return createFederatedUserInstance(externalUserId, user, internalBridgedUser.remote);
            }
        });
    }
    getFederatedUsersByExternalIds(externalUserIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const internalBridgedUsers = yield models_1.MatrixBridgedUser.getLocalUsersByExternalIds(externalUserIds);
            if (internalBridgedUsers.length === 0) {
                return [];
            }
            const internalUserIds = internalBridgedUsers.map((bridgedUser) => bridgedUser.uid);
            const internalUserIdsMap = internalBridgedUsers.reduce((acc, bridgedUser) => (Object.assign(Object.assign({}, acc), { [bridgedUser.uid]: { mui: bridgedUser.mui, remote: bridgedUser.remote } })), {});
            const users = yield models_1.Users.findByIds(internalUserIds).toArray();
            if (users.length === 0) {
                return [];
            }
            return users.map((user) => createFederatedUserInstance(internalUserIdsMap[user._id].mui, user, internalUserIdsMap[user._id].remote));
        });
    }
    getFederatedUserByInternalId(internalUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const internalBridgedUser = yield models_1.MatrixBridgedUser.getBridgedUserByLocalId(internalUserId);
            if (!internalBridgedUser) {
                return;
            }
            const { uid: userId, mui: externalUserId, remote } = internalBridgedUser;
            const user = yield models_1.Users.findOneById(userId);
            if (user) {
                return createFederatedUserInstance(externalUserId, user, remote);
            }
        });
    }
    getFederatedUserByInternalUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.Users.findOneByUsername(username);
            if (!user) {
                return;
            }
            const internalBridgedUser = yield models_1.MatrixBridgedUser.getBridgedUserByLocalId(user._id);
            if (!internalBridgedUser) {
                return;
            }
            const { mui: externalUserId, remote } = internalBridgedUser;
            return createFederatedUserInstance(externalUserId, user, remote);
        });
    }
    getInternalUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.Users.findOneById(userId);
            if (!(user === null || user === void 0 ? void 0 : user.username)) {
                throw new Error(`User with internalId ${userId} not found`);
            }
            return user;
        });
    }
    getInternalUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Users.findOneByUsername(username);
        });
    }
    createFederatedUser(federatedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingLocalUser = federatedUser.getUsername() && (yield models_1.Users.findOneByUsername(federatedUser.getUsername()));
            if (existingLocalUser) {
                return models_1.MatrixBridgedUser.createOrUpdateByLocalId(existingLocalUser._id, federatedUser.getExternalId(), federatedUser.isRemote(), (0, RoomReceiver_1.extractServerNameFromExternalIdentifier)(federatedUser.getExternalId()));
            }
            const { insertedId } = yield models_1.Users.insertOne(federatedUser.getStorageRepresentation());
            return models_1.MatrixBridgedUser.createOrUpdateByLocalId(insertedId, federatedUser.getExternalId(), federatedUser.isRemote(), (0, RoomReceiver_1.extractServerNameFromExternalIdentifier)(federatedUser.getExternalId()));
        });
    }
    setAvatar(federatedUser, avatarUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, setUserAvatar_1.setUserAvatar)(federatedUser.getInternalReference(), avatarUrl, 'image/jpeg', 'url'); // this mimetype is fixed here, but the function when called with a url as source don't use that mimetype
        });
    }
    updateFederationAvatar(internalUserId, externalAvatarUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Users.setFederationAvatarUrlById(internalUserId, externalAvatarUrl);
        });
    }
    updateRealName(internalUser, name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, setRealName_1._setRealName)(internalUser._id, name, internalUser);
        });
    }
}
exports.RocketChatUserAdapter = RocketChatUserAdapter;
