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
exports.RocketChatRoomAdapter = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const User_1 = require("./User");
const server_1 = require("../../../../../../app/channel-settings/server");
const addUserToRoom_1 = require("../../../../../../app/lib/server/functions/addUserToRoom");
const createRoom_1 = require("../../../../../../app/lib/server/functions/createRoom");
const removeUserFromRoom_1 = require("../../../../../../app/lib/server/functions/removeUserFromRoom");
const notifyListener_1 = require("../../../../../../app/lib/server/lib/notifyListener");
const server_2 = require("../../../../../../app/settings/server");
const getDefaultSubscriptionPref_1 = require("../../../../../../app/utils/lib/getDefaultSubscriptionPref");
const getValidRoomName_1 = require("../../../../../../app/utils/server/lib/getValidRoomName");
const FederatedRoom_1 = require("../../../domain/FederatedRoom");
const RoomReceiver_1 = require("../../matrix/converters/room/RoomReceiver");
class RocketChatRoomAdapter {
    getFederatedRoomByExternalId(externalRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const internalBridgedRoomId = yield models_1.MatrixBridgedRoom.getLocalRoomId(externalRoomId);
            if (!internalBridgedRoomId) {
                return;
            }
            const room = yield models_1.Rooms.findOneById(internalBridgedRoomId);
            if (room) {
                return this.createFederatedRoomInstance(externalRoomId, room);
            }
        });
    }
    getFederatedRoomByInternalId(internalRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const externalRoomId = yield models_1.MatrixBridgedRoom.getExternalRoomId(internalRoomId);
            if (!externalRoomId) {
                return;
            }
            const room = yield models_1.Rooms.findOneById(internalRoomId);
            if (room) {
                return this.createFederatedRoomInstance(externalRoomId, room);
            }
        });
    }
    getInternalRoomById(internalRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Rooms.findOneById(internalRoomId);
        });
    }
    createFederatedRoom(federatedRoom) {
        return __awaiter(this, void 0, void 0, function* () {
            const usernameOrId = federatedRoom.getCreatorUsername() || federatedRoom.getCreatorId();
            if (!usernameOrId) {
                throw new Error('Cannot create a room without a creator');
            }
            const roomName = yield (0, getValidRoomName_1.getValidRoomName)((federatedRoom.getDisplayName() || '')
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .trim()
                .replace(/ /g, '-'));
            const owner = yield models_1.Users.findOneByUsernameIgnoringCase(usernameOrId);
            if (!owner) {
                throw new Error('Cannot create a room without a creator');
            }
            const { rid, _id } = yield (0, createRoom_1.createRoom)(federatedRoom.getRoomType(), roomName, owner);
            const roomId = rid || _id;
            yield models_1.MatrixBridgedRoom.createOrUpdateByLocalRoomId(roomId, federatedRoom.getExternalId(), (0, RoomReceiver_1.extractServerNameFromExternalIdentifier)(federatedRoom.getExternalId()));
            yield models_1.Rooms.setAsFederated(roomId);
            return roomId;
        });
    }
    removeDirectMessageRoom(federatedRoom) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomId = federatedRoom.getInternalId();
            yield Promise.all([
                models_1.Rooms.removeById(roomId),
                models_1.Subscriptions.removeByRoomId(roomId, {
                    onTrash(doc) {
                        return __awaiter(this, void 0, void 0, function* () {
                            void (0, notifyListener_1.notifyOnSubscriptionChanged)(doc, 'removed');
                        });
                    },
                }),
                models_1.MatrixBridgedRoom.removeByLocalRoomId(roomId),
            ]);
        });
    }
    createFederatedRoomForDirectMessage(federatedRoom) {
        return __awaiter(this, void 0, void 0, function* () {
            const creatorId = federatedRoom.getCreatorId();
            const usernameOrId = federatedRoom.getCreatorUsername() || creatorId;
            if (!usernameOrId) {
                throw new Error('Cannot create a room without a creator');
            }
            if (!creatorId) {
                throw new Error('Cannot create a room without a creator');
            }
            const readonly = false;
            const excludeSelf = false;
            const extraData = undefined;
            const owner = yield models_1.Users.findOneByUsernameIgnoringCase(usernameOrId);
            if (!owner) {
                throw new Error('Cannot create a room without a creator');
            }
            const { rid, _id } = yield (0, createRoom_1.createRoom)(federatedRoom.getRoomType(), federatedRoom.getDisplayName(), owner, federatedRoom.getMembersUsernames(), excludeSelf, readonly, extraData, { creator: creatorId });
            const roomId = rid || _id;
            yield models_1.MatrixBridgedRoom.createOrUpdateByLocalRoomId(roomId, federatedRoom.getExternalId(), (0, RoomReceiver_1.extractServerNameFromExternalIdentifier)(federatedRoom.getExternalId()));
            yield models_1.Rooms.setAsFederated(roomId);
            return roomId;
        });
    }
    getDirectMessageFederatedRoomByUserIds(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield models_1.Rooms.findOneDirectRoomContainingAllUserIDs(userIds);
            if (!room) {
                return;
            }
            const externalRoomId = yield models_1.MatrixBridgedRoom.getExternalRoomId(room._id);
            if (!externalRoomId) {
                return;
            }
            if (room) {
                return this.createFederatedRoomInstance(externalRoomId, room);
            }
        });
    }
    addUserToRoom(federatedRoom, inviteeUser, inviterUser) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, addUserToRoom_1.addUserToRoom)(federatedRoom.getInternalId(), inviteeUser.getInternalReference(), inviterUser === null || inviterUser === void 0 ? void 0 : inviterUser.getInternalReference());
        });
    }
    addUsersToRoomWhenJoinExternalPublicRoom(federatedUsers, federatedRoom) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield models_1.Rooms.findOneById(federatedRoom.getInternalId());
            if (!room) {
                throw new Error('Room not found - addUsersToRoomWhenJoinExternalPublicRoom');
            }
            yield Promise.all(federatedUsers
                .map((federatedUser) => __awaiter(this, void 0, void 0, function* () {
                const internalUser = yield models_1.Users.findOneById(federatedUser.getInternalId());
                if (!internalUser) {
                    return;
                }
                const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(federatedRoom.getInternalId(), internalUser._id);
                if (subscription) {
                    return;
                }
                const user = federatedUser.getInternalReference();
                const { insertedId } = yield models_1.Subscriptions.createWithRoomAndUser(room, user, Object.assign({ ts: new Date() }, (0, getDefaultSubscriptionPref_1.getDefaultSubscriptionPref)(user)));
                if (insertedId) {
                    void (0, notifyListener_1.notifyOnSubscriptionChangedById)(insertedId, 'inserted');
                }
            }))
                .filter(Boolean));
        });
    }
    removeUserFromRoom(federatedRoom, affectedUser, byUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const userHasBeenRemoved = byUser.getInternalId() !== affectedUser.getInternalId();
            const options = userHasBeenRemoved ? { byUser: byUser.getInternalReference() } : undefined;
            yield (0, removeUserFromRoom_1.removeUserFromRoom)(federatedRoom.getInternalId(), affectedUser.getInternalReference(), options);
        });
    }
    isUserAlreadyJoined(internalRoomId, internalUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(internalRoomId, internalUserId, { projection: { _id: 1 } });
            return Boolean(subscription);
        });
    }
    updateRoomType(federatedRoom) {
        return __awaiter(this, void 0, void 0, function* () {
            const rid = federatedRoom.getInternalId();
            const roomType = federatedRoom.getRoomType();
            yield models_1.Rooms.setRoomTypeById(rid, roomType);
            yield models_1.Subscriptions.updateAllRoomTypesByRoomId(rid, roomType);
            void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(rid);
        });
    }
    updateDisplayRoomName(federatedRoom, federatedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const rid = federatedRoom.getInternalId();
            const roomName = federatedRoom.getName() || '';
            const displayName = federatedRoom.getDisplayName() || '';
            const internalReference = federatedUser.getInternalReference();
            yield models_1.Rooms.setFnameById(rid, displayName);
            yield models_1.Subscriptions.updateNameAndFnameByRoomId(rid, roomName, displayName);
            yield core_services_1.Message.saveSystemMessage('r', rid, displayName, internalReference);
            void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(rid);
        });
    }
    updateRoomName(federatedRoom) {
        return __awaiter(this, void 0, void 0, function* () {
            const rid = federatedRoom.getInternalId();
            const roomName = federatedRoom.getName() || '';
            const displayName = federatedRoom.getDisplayName() || '';
            yield models_1.Rooms.setRoomNameById(rid, roomName);
            yield models_1.Subscriptions.updateNameAndFnameByRoomId(rid, roomName, displayName);
            void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(rid);
        });
    }
    updateRoomTopic(federatedRoom, federatedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, server_1.saveRoomTopic)(federatedRoom.getInternalId(), federatedRoom.getTopic(), federatedUser.getInternalReference());
        });
    }
    createFederatedRoomInstance(externalRoomId, room) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, core_typings_1.isDirectMessageRoom)(room)) {
                const members = (yield Promise.all((room.usernames || []).map((username) => (0, User_1.getFederatedUserByInternalUsername)(username)).filter(Boolean)));
                return FederatedRoom_1.DirectMessageFederatedRoom.createWithInternalReference(externalRoomId, room, members);
            }
            return FederatedRoom_1.FederatedRoom.createWithInternalReference(externalRoomId, room);
        });
    }
    updateFederatedRoomByInternalRoomId(internalRoomId, externalRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.MatrixBridgedRoom.createOrUpdateByLocalRoomId(internalRoomId, externalRoomId, (0, RoomReceiver_1.extractServerNameFromExternalIdentifier)(externalRoomId));
            yield models_1.Rooms.setAsFederated(internalRoomId);
        });
    }
    getInternalRoomRolesByUserId(internalRoomId, internalUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(internalRoomId, internalUserId, { projection: { roles: 1 } });
            if (!subscription) {
                return [];
            }
            return subscription.roles || [];
        });
    }
    applyRoomRolesToUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ federatedRoom, fromUser, targetFederatedUser, notifyChannel, rolesToAdd, rolesToRemove, }) {
            const uid = targetFederatedUser.getInternalId();
            const rid = federatedRoom.getInternalId();
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, uid, { projection: { roles: 1 } });
            if (!subscription) {
                return;
            }
            const { roles: currentRoles = [] } = subscription;
            const toAdd = rolesToAdd.filter((role) => !currentRoles.includes(role));
            const toRemove = rolesToRemove.filter((role) => currentRoles.includes(role));
            const whoDidTheChange = {
                _id: fromUser.getInternalId(),
                username: fromUser.getUsername(),
            };
            if (toAdd.length > 0) {
                const addRolesResponse = yield models_1.Subscriptions.addRolesByUserId(uid, toAdd, rid);
                if (addRolesResponse.modifiedCount) {
                    void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserId)(rid, uid);
                }
                if (notifyChannel) {
                    yield Promise.all(toAdd.map((role) => core_services_1.Message.saveSystemMessage('subscription-role-added', rid, targetFederatedUser.getInternalReference().username || '', whoDidTheChange, { role })));
                }
            }
            if (toRemove.length > 0) {
                const removeRolesResponse = yield models_1.Subscriptions.removeRolesByUserId(uid, toRemove, rid);
                if (removeRolesResponse.modifiedCount) {
                    void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserId)(rid, uid);
                }
                if (notifyChannel) {
                    yield Promise.all(toRemove.map((role) => core_services_1.Message.saveSystemMessage('subscription-role-removed', rid, targetFederatedUser.getInternalReference().username || '', whoDidTheChange, { role })));
                }
            }
            if (server_2.settings.get('UI_DisplayRoles')) {
                this.notifyUIAboutRoomRolesChange(targetFederatedUser, federatedRoom, toAdd, toRemove);
            }
        });
    }
    notifyUIAboutRoomRolesChange(targetFederatedUser, federatedRoom, addedRoles, removedRoles) {
        const eventsForAddedRoles = addedRoles.map((role) => this.createRoleUpdateEvent(targetFederatedUser, federatedRoom, role, 'added'));
        const eventsForRemovedRoles = removedRoles.map((role) => this.createRoleUpdateEvent(targetFederatedUser, federatedRoom, role, 'removed'));
        [...eventsForAddedRoles, ...eventsForRemovedRoles].forEach((event) => core_services_1.api.broadcast('user.roleUpdate', event));
    }
    createRoleUpdateEvent(federatedUser, federatedRoom, role, action) {
        return {
            type: action,
            _id: role,
            u: {
                _id: federatedUser.getInternalId(),
                username: federatedUser.getUsername(),
                name: federatedUser.getName(),
            },
            scope: federatedRoom.getInternalId(),
        };
    }
}
exports.RocketChatRoomAdapter = RocketChatRoomAdapter;
