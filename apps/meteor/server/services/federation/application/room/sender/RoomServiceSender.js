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
exports.FederationRoomServiceSender = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const FederatedRoom_1 = require("../../../domain/FederatedRoom");
const FederatedUser_1 = require("../../../domain/FederatedUser");
const MatrixPowerLevels_1 = require("../../../infrastructure/matrix/definitions/MatrixPowerLevels");
const FederatedRoomInternalRoles_1 = require("../../../infrastructure/rocket-chat/definitions/FederatedRoomInternalRoles");
const AbstractFederationApplicationService_1 = require("../../AbstractFederationApplicationService");
const message_sender_helper_1 = require("../message/sender/message-sender-helper");
class FederationRoomServiceSender extends AbstractFederationApplicationService_1.AbstractFederationApplicationService {
    constructor(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalMessageAdapter, internalSettingsAdapter, internalNotificationAdapter, bridge) {
        super(bridge, internalUserAdapter, internalFileAdapter, internalSettingsAdapter);
        this.internalRoomAdapter = internalRoomAdapter;
        this.internalUserAdapter = internalUserAdapter;
        this.internalFileAdapter = internalFileAdapter;
        this.internalMessageAdapter = internalMessageAdapter;
        this.internalSettingsAdapter = internalSettingsAdapter;
        this.internalNotificationAdapter = internalNotificationAdapter;
        this.bridge = bridge;
    }
    createDirectMessageRoomAndInviteUser(roomCreateDMAndInviteUserInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { normalizedInviteeId, rawInviteeId, internalInviterId, inviteeUsernameOnly, internalRoomId } = roomCreateDMAndInviteUserInput;
            const internalInviterUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalInviterId);
            if (!internalInviterUser) {
                yield this.createFederatedUserIncludingHomeserverUsingLocalInformation(internalInviterId);
            }
            const internalInviteeUser = yield this.internalUserAdapter.getFederatedUserByInternalId(normalizedInviteeId);
            if (!internalInviteeUser) {
                const existsOnlyOnProxyServer = false;
                yield this.createFederatedUserInternallyOnly(rawInviteeId, normalizedInviteeId, existsOnlyOnProxyServer);
            }
            const federatedInviterUser = internalInviterUser || (yield this.internalUserAdapter.getFederatedUserByInternalId(internalInviterId));
            const federatedInviteeUser = internalInviteeUser || (yield this.internalUserAdapter.getFederatedUserByInternalUsername(normalizedInviteeId));
            if (!federatedInviterUser || !federatedInviteeUser) {
                throw new Error('Could not find inviter or invitee user');
            }
            const isInviteeFromTheSameHomeServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(rawInviteeId), this.internalHomeServerDomain);
            const internalFederatedRoom = yield this.internalRoomAdapter.getDirectMessageFederatedRoomByUserIds([
                federatedInviteeUser.getInternalId(),
                federatedInviterUser.getInternalId(),
            ]);
            if (!internalFederatedRoom) {
                const externalRoomId = yield this.bridge.createDirectMessageRoom(federatedInviterUser.getExternalId(), [federatedInviteeUser.getExternalId()], { internalRoomId });
                const newFederatedRoom = FederatedRoom_1.DirectMessageFederatedRoom.createInstance(externalRoomId, federatedInviterUser, [
                    federatedInviterUser,
                    federatedInviteeUser,
                ]);
                const createdInternalRoomId = yield this.internalRoomAdapter.createFederatedRoomForDirectMessage(newFederatedRoom);
                yield this.internalNotificationAdapter.subscribeToUserTypingEventsOnFederatedRoomId(createdInternalRoomId, this.internalNotificationAdapter.broadcastUserTypingOnRoom.bind(this.internalNotificationAdapter));
            }
            const federatedRoom = internalFederatedRoom ||
                (yield this.internalRoomAdapter.getDirectMessageFederatedRoomByUserIds([
                    federatedInviteeUser.getInternalId(),
                    federatedInviterUser.getInternalId(),
                ]));
            if (!federatedRoom) {
                throw new Error(`Could not find room id for users: ${[federatedInviteeUser.getInternalId(), federatedInviterUser.getInternalId()].join(' ')}`);
            }
            if (isInviteeFromTheSameHomeServer) {
                const profile = yield this.bridge.getUserProfileInformation(federatedInviteeUser.getExternalId());
                if (!profile) {
                    yield this.bridge.createUser(inviteeUsernameOnly, federatedInviteeUser.getName() || normalizedInviteeId, this.internalHomeServerDomain);
                }
                yield this.bridge.inviteToRoom(federatedRoom.getExternalId(), federatedInviterUser.getExternalId(), federatedInviteeUser.getExternalId());
                yield this.bridge.joinRoom(federatedRoom.getExternalId(), federatedInviteeUser.getExternalId());
            }
            yield this.internalRoomAdapter.addUserToRoom(federatedRoom, federatedInviteeUser, federatedInviterUser);
        });
    }
    afterUserLeaveRoom(afterLeaveRoomInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { internalRoomId, internalUserId } = afterLeaveRoomInput;
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoomId);
            if (!federatedRoom) {
                return;
            }
            const federatedUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalUserId);
            if (!federatedUser) {
                return;
            }
            const isUserFromTheSameHomeServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(federatedUser.getExternalId()), this.internalHomeServerDomain);
            if (!isUserFromTheSameHomeServer) {
                return;
            }
            yield this.bridge.leaveRoom(federatedRoom.getExternalId(), federatedUser.getExternalId());
        });
    }
    onUserRemovedFromRoom(afterLeaveRoomInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { internalRoomId, internalUserId, actionDoneByInternalId } = afterLeaveRoomInput;
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoomId);
            if (!federatedRoom) {
                return;
            }
            const federatedUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalUserId);
            if (!federatedUser) {
                return;
            }
            const byWhom = yield this.internalUserAdapter.getFederatedUserByInternalId(actionDoneByInternalId);
            if (!byWhom) {
                return;
            }
            const isUserFromTheSameHomeServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(byWhom.getExternalId()), this.internalHomeServerDomain);
            if (!isUserFromTheSameHomeServer) {
                return;
            }
            yield this.bridge.kickUserFromRoom(federatedRoom.getExternalId(), federatedUser.getExternalId(), byWhom.getExternalId());
        });
    }
    sendExternalMessage(roomSendExternalMessageInput) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { internalRoomId, internalSenderId, message, isThreadedMessage } = roomSendExternalMessageInput;
            const federatedSender = yield this.internalUserAdapter.getFederatedUserByInternalId(internalSenderId);
            if (!federatedSender) {
                throw new Error(`Could not find user id for ${internalSenderId}`);
            }
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoomId);
            if (!federatedRoom) {
                throw new Error(`Could not find room id for ${internalRoomId}`);
            }
            if ((_a = message.federation) === null || _a === void 0 ? void 0 : _a.eventId) {
                return;
            }
            if ((_b = message.attachments) === null || _b === void 0 ? void 0 : _b.some((attachment) => (0, core_typings_1.isQuoteAttachment)(attachment) && Boolean(attachment.message_link))) {
                // TODO: move this to the domain layer in a proper entity
                const messageLink = message.attachments.find((attachment) => (0, core_typings_1.isQuoteAttachment)(attachment) && Boolean(attachment.message_link)).message_link;
                if (!messageLink) {
                    return;
                }
                const messageToReplyToId = messageLink.includes('msg=') && (messageLink === null || messageLink === void 0 ? void 0 : messageLink.split('msg=').pop());
                if (!messageToReplyToId) {
                    return;
                }
                const messageToReplyTo = yield this.internalMessageAdapter.getMessageById(messageToReplyToId);
                if (!messageToReplyTo) {
                    return;
                }
                yield (0, message_sender_helper_1.getExternalMessageSender)({
                    message,
                    isThreadedMessage,
                    bridge: this.bridge,
                    internalFileAdapter: this.internalFileAdapter,
                    internalMessageAdapter: this.internalMessageAdapter,
                    internalUserAdapter: this.internalUserAdapter,
                }).sendQuoteMessage(federatedRoom.getExternalId(), federatedSender.getExternalId(), message, messageToReplyTo);
                return;
            }
            yield (0, message_sender_helper_1.getExternalMessageSender)({
                message,
                isThreadedMessage,
                bridge: this.bridge,
                internalFileAdapter: this.internalFileAdapter,
                internalMessageAdapter: this.internalMessageAdapter,
                internalUserAdapter: this.internalUserAdapter,
            }).sendMessage(federatedRoom.getExternalId(), federatedSender.getExternalId(), message);
        });
    }
    afterMessageDeleted(internalMessage, internalRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoomId);
            if (!federatedRoom) {
                return;
            }
            const federatedUser = ((_a = internalMessage.u) === null || _a === void 0 ? void 0 : _a._id) && (yield this.internalUserAdapter.getFederatedUserByInternalId(internalMessage.u._id));
            if (!federatedUser) {
                return;
            }
            if (!(0, core_typings_1.isMessageFromMatrixFederation)(internalMessage) || (0, core_typings_1.isDeletedMessage)(internalMessage)) {
                return;
            }
            const isUserFromTheSameHomeServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(federatedUser.getExternalId()), this.internalSettingsAdapter.getHomeServerDomain());
            if (!isUserFromTheSameHomeServer) {
                return;
            }
            yield this.bridge.redactEvent(federatedRoom.getExternalId(), federatedUser.getExternalId(), (_b = internalMessage.federation) === null || _b === void 0 ? void 0 : _b.eventId);
        });
    }
    afterMessageUpdated(internalMessage, internalRoomId, internalUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoomId);
            if (!federatedRoom) {
                return;
            }
            const federatedUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalUserId);
            if (!federatedUser) {
                return;
            }
            if (!(0, core_typings_1.isMessageFromMatrixFederation)(internalMessage) || !(0, core_typings_1.isEditedMessage)(internalMessage) || internalMessage.u._id !== internalUserId) {
                return;
            }
            const isUserFromTheSameHomeServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(federatedUser.getExternalId()), this.internalSettingsAdapter.getHomeServerDomain());
            if (!isUserFromTheSameHomeServer) {
                return;
            }
            yield this.bridge.updateMessage(federatedRoom.getExternalId(), federatedUser.getExternalId(), (_a = internalMessage.federation) === null || _a === void 0 ? void 0 : _a.eventId, internalMessage.msg);
        });
    }
    onRoomOwnerAdded(internalUserId, internalTargetUserId, internalRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoomId);
            if (!federatedRoom) {
                return;
            }
            const federatedUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalUserId);
            if (!federatedUser) {
                return;
            }
            const federatedTargetUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalTargetUserId);
            if (!federatedTargetUser) {
                return;
            }
            const userRoomRoles = yield this.internalRoomAdapter.getInternalRoomRolesByUserId(internalRoomId, internalUserId);
            const myself = federatedUser.getInternalId() === federatedTargetUser.getInternalId();
            if (!(userRoomRoles === null || userRoomRoles === void 0 ? void 0 : userRoomRoles.includes(FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.OWNER)) && !myself) {
                throw new Error('Federation_Matrix_not_allowed_to_change_owner');
            }
            const isUserFromTheSameHomeServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(federatedUser.getExternalId()), this.internalSettingsAdapter.getHomeServerDomain());
            if (!isUserFromTheSameHomeServer) {
                return;
            }
            try {
                yield this.bridge.setRoomPowerLevels(federatedRoom.getExternalId(), federatedUser.getExternalId(), federatedTargetUser.getExternalId(), MatrixPowerLevels_1.MATRIX_POWER_LEVELS.ADMIN);
            }
            catch (e) {
                yield this.rollbackRoomRoles(federatedRoom, federatedTargetUser, federatedUser, [], [FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.OWNER]);
            }
        });
    }
    onRoomOwnerRemoved(internalUserId, internalTargetUserId, internalRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoomId);
            if (!federatedRoom) {
                return;
            }
            const federatedUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalUserId);
            if (!federatedUser) {
                return;
            }
            const federatedTargetUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalTargetUserId);
            if (!federatedTargetUser) {
                return;
            }
            const userRoomRoles = yield this.internalRoomAdapter.getInternalRoomRolesByUserId(internalRoomId, internalUserId);
            const myself = federatedUser.getInternalId() === federatedTargetUser.getInternalId();
            if (!(userRoomRoles === null || userRoomRoles === void 0 ? void 0 : userRoomRoles.includes(FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.OWNER)) && !myself) {
                throw new Error('Federation_Matrix_not_allowed_to_change_owner');
            }
            const isUserFromTheSameHomeServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(federatedUser.getExternalId()), this.internalSettingsAdapter.getHomeServerDomain());
            if (!isUserFromTheSameHomeServer) {
                return;
            }
            try {
                yield this.bridge.setRoomPowerLevels(federatedRoom.getExternalId(), federatedUser.getExternalId(), federatedTargetUser.getExternalId(), MatrixPowerLevels_1.MATRIX_POWER_LEVELS.USER);
            }
            catch (e) {
                yield this.rollbackRoomRoles(federatedRoom, federatedTargetUser, federatedUser, [FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.OWNER], []);
            }
        });
    }
    onRoomModeratorAdded(internalUserId, internalTargetUserId, internalRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoomId);
            if (!federatedRoom) {
                return;
            }
            const federatedUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalUserId);
            if (!federatedUser) {
                return;
            }
            const federatedTargetUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalTargetUserId);
            if (!federatedTargetUser) {
                return;
            }
            const userRoomRoles = yield this.internalRoomAdapter.getInternalRoomRolesByUserId(internalRoomId, internalUserId);
            const myself = federatedUser.getInternalId() === federatedTargetUser.getInternalId();
            if (!(userRoomRoles === null || userRoomRoles === void 0 ? void 0 : userRoomRoles.includes(FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.OWNER)) &&
                !(userRoomRoles === null || userRoomRoles === void 0 ? void 0 : userRoomRoles.includes(FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.MODERATOR)) &&
                !myself) {
                throw new Error('Federation_Matrix_not_allowed_to_change_moderator');
            }
            const isUserFromTheSameHomeServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(federatedUser.getExternalId()), this.internalSettingsAdapter.getHomeServerDomain());
            if (!isUserFromTheSameHomeServer) {
                return;
            }
            try {
                yield this.bridge.setRoomPowerLevels(federatedRoom.getExternalId(), federatedUser.getExternalId(), federatedTargetUser.getExternalId(), MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR);
            }
            catch (e) {
                yield this.rollbackRoomRoles(federatedRoom, federatedTargetUser, federatedUser, [], [FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.MODERATOR]);
            }
        });
    }
    onRoomModeratorRemoved(internalUserId, internalTargetUserId, internalRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoomId);
            if (!federatedRoom) {
                return;
            }
            const federatedUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalUserId);
            if (!federatedUser) {
                return;
            }
            const federatedTargetUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalTargetUserId);
            if (!federatedTargetUser) {
                return;
            }
            const userRoomRoles = yield this.internalRoomAdapter.getInternalRoomRolesByUserId(internalRoomId, internalUserId);
            const myself = federatedUser.getInternalId() === federatedTargetUser.getInternalId();
            if (!(userRoomRoles === null || userRoomRoles === void 0 ? void 0 : userRoomRoles.includes(FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.OWNER)) &&
                !(userRoomRoles === null || userRoomRoles === void 0 ? void 0 : userRoomRoles.includes(FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.MODERATOR)) &&
                !myself) {
                throw new Error('Federation_Matrix_not_allowed_to_change_moderator');
            }
            const isUserFromTheSameHomeServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(federatedUser.getExternalId()), this.internalSettingsAdapter.getHomeServerDomain());
            if (!isUserFromTheSameHomeServer) {
                return;
            }
            try {
                yield this.bridge.setRoomPowerLevels(federatedRoom.getExternalId(), federatedUser.getExternalId(), federatedTargetUser.getExternalId(), MatrixPowerLevels_1.MATRIX_POWER_LEVELS.USER);
            }
            catch (e) {
                yield this.rollbackRoomRoles(federatedRoom, federatedTargetUser, federatedUser, [FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.MODERATOR], []);
            }
        });
    }
    afterRoomNameChanged(internalRoomId, internalRoomName) {
        return __awaiter(this, void 0, void 0, function* () {
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoomId);
            if (!federatedRoom) {
                return;
            }
            const federatedUser = federatedRoom.getCreatorId() && (yield this.internalUserAdapter.getFederatedUserByInternalId(federatedRoom.getCreatorId()));
            if (!federatedUser) {
                return;
            }
            const isRoomFromTheSameHomeServer = FederatedRoom_1.FederatedRoom.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(federatedRoom.getExternalId()), this.internalSettingsAdapter.getHomeServerDomain());
            if (!isRoomFromTheSameHomeServer) {
                return;
            }
            const externalRoomName = yield this.bridge.getRoomName(federatedRoom.getExternalId(), federatedUser.getExternalId());
            if (!federatedRoom.shouldUpdateDisplayRoomName(externalRoomName || '')) {
                return;
            }
            yield this.bridge.setRoomName(federatedRoom.getExternalId(), federatedUser.getExternalId(), internalRoomName);
        });
    }
    afterRoomTopicChanged(internalRoomId, internalRoomTopic) {
        return __awaiter(this, void 0, void 0, function* () {
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoomId);
            if (!federatedRoom) {
                return;
            }
            const federatedUser = federatedRoom.getCreatorId() && (yield this.internalUserAdapter.getFederatedUserByInternalId(federatedRoom.getCreatorId()));
            if (!federatedUser) {
                return;
            }
            const isRoomFromTheSameHomeServer = FederatedRoom_1.FederatedRoom.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(federatedRoom.getExternalId()), this.internalSettingsAdapter.getHomeServerDomain());
            if (!isRoomFromTheSameHomeServer) {
                return;
            }
            const externalRoomTopic = yield this.bridge.getRoomTopic(federatedRoom.getExternalId(), federatedUser.getExternalId());
            if (!federatedRoom.shouldUpdateRoomTopic(externalRoomTopic || '')) {
                return;
            }
            yield this.bridge.setRoomTopic(federatedRoom.getExternalId(), federatedUser.getExternalId(), internalRoomTopic);
        });
    }
    rollbackRoomRoles(federatedRoom, targetFederatedUser, fromUser, rolesToAdd, rolesToRemove) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.internalRoomAdapter.applyRoomRolesToUser({
                federatedRoom,
                targetFederatedUser,
                fromUser,
                rolesToAdd,
                rolesToRemove,
                notifyChannel: false,
            });
            this.internalNotificationAdapter.notifyWithEphemeralMessage('Federation_Matrix_error_applying_room_roles', fromUser.getInternalId(), federatedRoom.getInternalId());
        });
    }
}
exports.FederationRoomServiceSender = FederationRoomServiceSender;
