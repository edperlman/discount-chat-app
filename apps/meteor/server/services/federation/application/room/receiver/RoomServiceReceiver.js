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
exports.FederationRoomServiceReceiver = void 0;
// TODO: Refactor this file splitting it into smaller files + removing the complexity of the most important method (changeMembership)
const rooms_1 = require("@rocket.chat/apps-engine/definition/rooms");
const core_typings_1 = require("@rocket.chat/core-typings");
const FederatedRoom_1 = require("../../../domain/FederatedRoom");
const FederatedUser_1 = require("../../../domain/FederatedUser");
const IFederationBridge_1 = require("../../../domain/IFederationBridge");
const RoomReceiver_1 = require("../../../infrastructure/matrix/converters/room/RoomReceiver");
const AbstractFederationApplicationService_1 = require("../../AbstractFederationApplicationService");
const message_redaction_helper_1 = require("../message/receiver/message-redaction-helper");
class FederationRoomServiceReceiver extends AbstractFederationApplicationService_1.AbstractFederationApplicationService {
    constructor(internalRoomAdapter, internalUserAdapter, internalMessageAdapter, internalFileAdapter, internalSettingsAdapter, internalNotificationAdapter, federationQueueInstance, bridge) {
        super(bridge, internalUserAdapter, internalFileAdapter, internalSettingsAdapter);
        this.internalRoomAdapter = internalRoomAdapter;
        this.internalUserAdapter = internalUserAdapter;
        this.internalMessageAdapter = internalMessageAdapter;
        this.internalFileAdapter = internalFileAdapter;
        this.internalSettingsAdapter = internalSettingsAdapter;
        this.internalNotificationAdapter = internalNotificationAdapter;
        this.federationQueueInstance = federationQueueInstance;
        this.bridge = bridge;
    }
    onCreateRoom(roomCreateInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { externalRoomId, wasInternallyProgramaticallyCreated = false, internalRoomId = '' } = roomCreateInput;
            if (yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId)) {
                return;
            }
            if (!wasInternallyProgramaticallyCreated) {
                return;
            }
            const room = yield this.internalRoomAdapter.getInternalRoomById(internalRoomId);
            if (!room || !(0, core_typings_1.isDirectMessageRoom)(room)) {
                return;
            }
            yield this.internalRoomAdapter.updateFederatedRoomByInternalRoomId(internalRoomId, externalRoomId);
        });
    }
    onChangeRoomMembership(roomChangeMembershipInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { externalRoomId, normalizedInviteeId, normalizedRoomId, normalizedInviterId, externalInviteeId, externalInviterId, inviteeUsernameOnly, inviterUsernameOnly, eventOrigin, roomType, leave, userProfile, allInviteesExternalIdsWhenDM, externalRoomName, externalEventId, } = roomChangeMembershipInput;
            const wasGeneratedOnTheProxyServer = eventOrigin === IFederationBridge_1.EVENT_ORIGIN.LOCAL;
            const affectedFederatedRoom = yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId);
            const isUserJoiningByHimself = externalInviterId === externalInviteeId && !leave;
            if (userProfile === null || userProfile === void 0 ? void 0 : userProfile.avatarUrl) {
                const federatedUser = yield this.internalUserAdapter.getFederatedUserByExternalId(externalInviteeId);
                federatedUser && (yield this.updateUserAvatarInternally(federatedUser, userProfile === null || userProfile === void 0 ? void 0 : userProfile.avatarUrl));
            }
            if (userProfile === null || userProfile === void 0 ? void 0 : userProfile.displayName) {
                const federatedUser = yield this.internalUserAdapter.getFederatedUserByExternalId(externalInviteeId);
                federatedUser && (yield this.updateUserDisplayNameInternally(federatedUser, userProfile === null || userProfile === void 0 ? void 0 : userProfile.displayName));
            }
            if (wasGeneratedOnTheProxyServer && !isUserJoiningByHimself && !affectedFederatedRoom) {
                return;
            }
            const isInviterFromTheSameHomeServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(externalInviterId), this.internalHomeServerDomain);
            const isInviteeFromTheSameHomeServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(externalInviteeId), this.internalHomeServerDomain);
            const inviterUsername = isInviterFromTheSameHomeServer ? inviterUsernameOnly : normalizedInviterId;
            const inviteeUsername = isInviteeFromTheSameHomeServer ? inviteeUsernameOnly : normalizedInviteeId;
            const inviterUser = yield this.internalUserAdapter.getFederatedUserByExternalId(externalInviterId);
            if (!inviterUser) {
                yield this.createFederatedUserInternallyOnly(externalInviterId, inviterUsername, isInviterFromTheSameHomeServer);
            }
            const inviteeUser = yield this.internalUserAdapter.getFederatedUserByExternalId(externalInviteeId);
            if (!inviteeUser) {
                yield this.createFederatedUserInternallyOnly(externalInviteeId, inviteeUsername, isInviteeFromTheSameHomeServer);
            }
            const federatedInviteeUser = inviteeUser || (yield this.internalUserAdapter.getFederatedUserByExternalId(externalInviteeId));
            const federatedInviterUser = inviterUser || (yield this.internalUserAdapter.getFederatedUserByExternalId(externalInviterId));
            if (!federatedInviteeUser || !federatedInviterUser) {
                throw new Error('Invitee or inviter user not found');
            }
            if (isUserJoiningByHimself) {
                yield this.whenUserIsJoiningByHimself(externalRoomId, normalizedRoomId, federatedInviterUser, federatedInviteeUser);
                return;
            }
            if (!wasGeneratedOnTheProxyServer && !affectedFederatedRoom) {
                if (!roomType) {
                    return;
                }
                if ((0, core_typings_1.isDirectMessageRoom)({ t: roomType })) {
                    const wereAllInviteesProvidedByCreationalEventAtOnce = allInviteesExternalIdsWhenDM && allInviteesExternalIdsWhenDM.length > 0;
                    if (wereAllInviteesProvidedByCreationalEventAtOnce) {
                        return this.handleDMRoomInviteWhenAllUsersWereBeingProvidedInTheCreationalEvent(allInviteesExternalIdsWhenDM, externalRoomId, federatedInviterUser);
                    }
                    return this.handleDMRoomInviteWhenNotifiedByRegularEventsOnly(federatedInviteeUser, federatedInviterUser, externalRoomId);
                }
                const newFederatedRoom = FederatedRoom_1.FederatedRoom.createInstance(externalRoomId, normalizedRoomId, federatedInviterUser, roomType);
                const createdInternalRoomId = yield this.internalRoomAdapter.createFederatedRoom(newFederatedRoom);
                yield this.bridge.joinRoom(externalRoomId, externalInviteeId);
                if (externalRoomName) {
                    yield this.onChangeRoomName({
                        externalRoomId,
                        normalizedRoomName: externalRoomName,
                        externalEventId,
                        externalSenderId: externalInviterId,
                        normalizedRoomId,
                    });
                }
                yield this.internalNotificationAdapter.subscribeToUserTypingEventsOnFederatedRoomId(createdInternalRoomId, this.internalNotificationAdapter.broadcastUserTypingOnRoom.bind(this.internalNotificationAdapter));
                const roomHistoricalJoinEvents = yield this.bridge.getRoomHistoricalJoinEvents(externalRoomId, externalInviteeId, [
                    externalInviterId,
                    externalInviteeId,
                ]);
                roomHistoricalJoinEvents.forEach((event) => this.federationQueueInstance.addToQueue(event));
            }
            const federatedRoom = affectedFederatedRoom || (yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId));
            if (!federatedRoom) {
                return;
            }
            const inviteeAlreadyJoinedTheInternalRoom = yield this.internalRoomAdapter.isUserAlreadyJoined(federatedRoom.getInternalId(), federatedInviteeUser.getInternalId());
            if (!leave && inviteeAlreadyJoinedTheInternalRoom) {
                return;
            }
            if (leave) {
                if (!inviteeAlreadyJoinedTheInternalRoom) {
                    return;
                }
                yield this.internalRoomAdapter.removeUserFromRoom(federatedRoom, federatedInviteeUser, federatedInviterUser);
                return;
            }
            if (!wasGeneratedOnTheProxyServer && federatedRoom.isDirectMessage()) {
                const directMessageRoom = federatedRoom;
                if (directMessageRoom.isUserPartOfTheRoom(federatedInviteeUser)) {
                    return;
                }
                directMessageRoom.addMember(federatedInviteeUser);
                const newFederatedRoom = FederatedRoom_1.DirectMessageFederatedRoom.createInstance(externalRoomId, federatedInviterUser, directMessageRoom.getMembers());
                yield this.internalRoomAdapter.removeDirectMessageRoom(federatedRoom);
                const createdInternalRoomId = yield this.internalRoomAdapter.createFederatedRoomForDirectMessage(newFederatedRoom);
                yield this.internalNotificationAdapter.subscribeToUserTypingEventsOnFederatedRoomId(createdInternalRoomId, this.internalNotificationAdapter.broadcastUserTypingOnRoom.bind(this.internalNotificationAdapter));
                return;
            }
            yield this.internalRoomAdapter.addUserToRoom(federatedRoom, federatedInviteeUser, federatedInviterUser);
            if (isInviteeFromTheSameHomeServer) {
                yield this.bridge.joinRoom(externalRoomId, externalInviteeId);
            }
        });
    }
    whenUserIsJoiningByHimself(externalRoomId, normalizedRoomId, federatedInviterUser, federatedInviteeUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId);
            if (room) {
                yield this.internalNotificationAdapter.subscribeToUserTypingEventsOnFederatedRoomId(room.getInternalId(), this.internalNotificationAdapter.broadcastUserTypingOnRoom.bind(this.internalNotificationAdapter));
                const inviteeAlreadyJoinedTheInternalRoom = yield this.internalRoomAdapter.isUserAlreadyJoined(room.getInternalId(), federatedInviteeUser.getInternalId());
                if (inviteeAlreadyJoinedTheInternalRoom) {
                    return;
                }
                yield this.internalRoomAdapter.addUserToRoom(room, federatedInviteeUser);
                return;
            }
            const externalRoomData = yield this.bridge.getRoomData(federatedInviterUser.getExternalId(), externalRoomId);
            if (!externalRoomData) {
                return;
            }
            const creatorUser = yield this.internalUserAdapter.getFederatedUserByExternalId(externalRoomData.creator.id);
            const roomCreationProcessIsRunningLocallyAlready = !room && creatorUser && federatedInviterUser.getInternalId() === creatorUser.getInternalId();
            if (roomCreationProcessIsRunningLocallyAlready) {
                return;
            }
            if (!creatorUser) {
                yield this.createFederatedUserAndReturnIt(externalRoomData.creator.id, externalRoomData.creator.username);
            }
            const federatedCreatorUser = yield this.internalUserAdapter.getFederatedUserByExternalId(externalRoomData.creator.id);
            if (!federatedCreatorUser) {
                return;
            }
            const isRoomFromTheSameHomeServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(externalRoomId), this.internalHomeServerDomain);
            const newFederatedRoom = FederatedRoom_1.FederatedRoom.createInstance(externalRoomId, normalizedRoomId, federatedCreatorUser, rooms_1.RoomType.CHANNEL, isRoomFromTheSameHomeServer ? externalRoomData.name : undefined);
            const createdInternalRoomId = yield this.internalRoomAdapter.createFederatedRoom(newFederatedRoom);
            if (!isRoomFromTheSameHomeServer && externalRoomData.name) {
                yield this.onChangeRoomName({
                    externalRoomId,
                    normalizedRoomName: externalRoomData.name,
                    externalEventId: '',
                    externalSenderId: federatedCreatorUser.getExternalId(),
                    normalizedRoomId,
                });
            }
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId);
            if (!federatedRoom) {
                return;
            }
            // Do not need to await this, this can be done in parallel
            void this.createFederatedUsersForRoomMembers(federatedRoom, externalRoomData.joinedMembers, externalRoomData.creator.id, federatedInviteeUser.getExternalId());
            yield this.internalNotificationAdapter.subscribeToUserTypingEventsOnFederatedRoomId(createdInternalRoomId, this.internalNotificationAdapter.broadcastUserTypingOnRoom.bind(this.internalNotificationAdapter));
            yield this.internalRoomAdapter.addUserToRoom(federatedRoom, federatedInviteeUser);
        });
    }
    createFederatedUserAndReturnIt(externalUserId, externalUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.internalUserAdapter.getFederatedUserByExternalId(externalUserId);
            if (user) {
                return user;
            }
            const isUserFromTheSameHomeserver = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(externalUserId), this.internalHomeServerDomain);
            const existsOnlyOnProxyServer = isUserFromTheSameHomeserver;
            const localUsername = externalUsername || (0, RoomReceiver_1.removeExternalSpecificCharsFromExternalIdentifier)(externalUserId);
            const username = isUserFromTheSameHomeserver ? localUsername : (0, RoomReceiver_1.removeExternalSpecificCharsFromExternalIdentifier)(externalUserId); // TODO: move these common functions to a proper layer
            yield this.createFederatedUserInternallyOnly(externalUserId, username, existsOnlyOnProxyServer);
            return (yield this.internalUserAdapter.getFederatedUserByExternalId(externalUserId));
        });
    }
    createFederatedUsersForRoomMembers(federatedRoom, externalMembersExternalIds, creatorExternalId, myselfExternalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const membersExcludingOnesInvolvedInTheCreationProcess = externalMembersExternalIds.filter((externalMemberId) => externalMemberId !== creatorExternalId && externalMemberId !== myselfExternalId);
            const federatedUsers = yield Promise.all(membersExcludingOnesInvolvedInTheCreationProcess.map((externalMemberId) => this.createFederatedUserAndReturnIt(externalMemberId)));
            yield this.internalRoomAdapter.addUsersToRoomWhenJoinExternalPublicRoom(federatedUsers.filter(Boolean), federatedRoom);
        });
    }
    handleDMRoomInviteWhenAllUsersWereBeingProvidedInTheCreationalEvent(allInviteesExternalIds, externalRoomId, federatedInviterUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const allInvitees = yield Promise.all(allInviteesExternalIds.map((dmExternalInviteeId) => __awaiter(this, void 0, void 0, function* () {
                const invitee = yield this.internalUserAdapter.getFederatedUserByExternalId(dmExternalInviteeId.externalInviteeId);
                if (!invitee) {
                    const isDMInviteeFromTheSameHomeServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(dmExternalInviteeId.externalInviteeId), this.internalHomeServerDomain);
                    const dmInviteeUsername = isDMInviteeFromTheSameHomeServer
                        ? dmExternalInviteeId.inviteeUsernameOnly
                        : dmExternalInviteeId.normalizedInviteeId;
                    yield this.createFederatedUserInternallyOnly(dmExternalInviteeId.externalInviteeId, dmInviteeUsername, isDMInviteeFromTheSameHomeServer);
                }
                return (invitee ||
                    (yield this.internalUserAdapter.getFederatedUserByExternalId(dmExternalInviteeId.externalInviteeId)));
            })));
            const newFederatedRoom = FederatedRoom_1.DirectMessageFederatedRoom.createInstance(externalRoomId, federatedInviterUser, [
                federatedInviterUser,
                ...allInvitees,
            ]);
            const createdInternalRoomId = yield this.internalRoomAdapter.createFederatedRoomForDirectMessage(newFederatedRoom);
            yield this.internalNotificationAdapter.subscribeToUserTypingEventsOnFederatedRoomId(createdInternalRoomId, this.internalNotificationAdapter.broadcastUserTypingOnRoom.bind(this.internalNotificationAdapter));
            yield Promise.all(allInvitees
                .filter((invitee) => FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(invitee.getExternalId()), this.internalHomeServerDomain))
                .map((invitee) => this.bridge.joinRoom(externalRoomId, invitee.getExternalId())));
        });
    }
    handleDMRoomInviteWhenNotifiedByRegularEventsOnly(federatedInviteeUser, federatedInviterUser, externalRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const members = [federatedInviterUser, federatedInviteeUser];
            const newFederatedRoom = FederatedRoom_1.DirectMessageFederatedRoom.createInstance(externalRoomId, federatedInviterUser, members);
            const createdInternalRoomId = yield this.internalRoomAdapter.createFederatedRoomForDirectMessage(newFederatedRoom);
            const isInviteeFromTheSameHomeServer = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(federatedInviteeUser.getExternalId()), this.internalHomeServerDomain);
            yield this.internalNotificationAdapter.subscribeToUserTypingEventsOnFederatedRoomId(createdInternalRoomId, this.internalNotificationAdapter.broadcastUserTypingOnRoom.bind(this.internalNotificationAdapter));
            if (isInviteeFromTheSameHomeServer) {
                yield this.bridge.joinRoom(externalRoomId, federatedInviteeUser.getExternalId());
            }
        });
    }
    onExternalMessageReceived(roomReceiveExternalMessageInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { externalRoomId, externalSenderId, rawMessage, externalFormattedText, externalEventId, replyToEventId } = roomReceiveExternalMessageInput;
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId);
            if (!federatedRoom) {
                return;
            }
            const senderUser = yield this.internalUserAdapter.getFederatedUserByExternalId(externalSenderId);
            if (!senderUser) {
                return;
            }
            const message = yield this.internalMessageAdapter.getMessageByFederationId(externalEventId);
            if (message) {
                return;
            }
            if (replyToEventId) {
                const messageToReplyTo = yield this.internalMessageAdapter.getMessageByFederationId(replyToEventId);
                if (!messageToReplyTo) {
                    return;
                }
                yield this.internalMessageAdapter.sendQuoteMessage(senderUser, federatedRoom, externalFormattedText, rawMessage, externalEventId, messageToReplyTo, this.internalHomeServerDomain);
                return;
            }
            yield this.internalMessageAdapter.sendMessage(senderUser, federatedRoom, rawMessage, externalFormattedText, externalEventId, this.internalHomeServerDomain);
        });
    }
    onExternalMessageEditedReceived(roomEditExternalMessageInput) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { externalRoomId, externalSenderId, editsEvent, newExternalFormattedText, newRawMessage } = roomEditExternalMessageInput;
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId);
            if (!federatedRoom) {
                return;
            }
            const senderUser = yield this.internalUserAdapter.getFederatedUserByExternalId(externalSenderId);
            if (!senderUser) {
                return;
            }
            const message = yield this.internalMessageAdapter.getMessageByFederationId(editsEvent);
            if (!message) {
                return;
            }
            // TODO: leaked business logic, move this to its proper place
            const isAQuotedMessage = (_a = message.attachments) === null || _a === void 0 ? void 0 : _a.some((attachment) => (0, core_typings_1.isQuoteAttachment)(attachment) && Boolean(attachment.message_link));
            if (isAQuotedMessage) {
                const wasGeneratedLocally = FederatedUser_1.FederatedUser.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(externalSenderId), this.internalHomeServerDomain);
                if (wasGeneratedLocally) {
                    return;
                }
                const internalFormattedMessageToBeEdited = yield this.internalMessageAdapter.getMessageToEditWhenReplyAndQuote(message, newExternalFormattedText, newRawMessage, this.internalHomeServerDomain, senderUser);
                // TODO: create an entity to abstract all the message logic
                if (!FederatedRoom_1.FederatedRoom.shouldUpdateMessage(internalFormattedMessageToBeEdited, message)) {
                    return;
                }
                yield this.internalMessageAdapter.editQuotedMessage(senderUser, newRawMessage, newExternalFormattedText, message, this.internalHomeServerDomain);
                return;
            }
            if (!FederatedRoom_1.FederatedRoom.shouldUpdateMessage(newRawMessage, message)) {
                return;
            }
            yield this.internalMessageAdapter.editMessage(senderUser, newRawMessage, newExternalFormattedText, message, this.internalHomeServerDomain);
        });
    }
    onExternalFileMessageReceived(roomReceiveExternalMessageInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { externalRoomId, externalSenderId, messageBody, externalEventId, replyToEventId } = roomReceiveExternalMessageInput;
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId);
            if (!federatedRoom) {
                return;
            }
            const senderUser = yield this.internalUserAdapter.getFederatedUserByExternalId(externalSenderId);
            if (!senderUser) {
                return;
            }
            const message = yield this.internalMessageAdapter.getMessageByFederationId(externalEventId);
            if (message) {
                return;
            }
            const fileDetails = {
                name: messageBody.filename,
                size: messageBody.size,
                type: messageBody.mimetype,
                rid: federatedRoom.getInternalId(),
                userId: senderUser.getInternalId(),
            };
            const readableStream = yield this.bridge.getReadStreamForFileFromUrl(senderUser.getExternalId(), messageBody.url);
            const { files = [], attachments } = yield this.internalFileAdapter.uploadFile(readableStream, federatedRoom.getInternalId(), senderUser.getInternalReference(), fileDetails);
            if (replyToEventId) {
                const messageToReplyTo = yield this.internalMessageAdapter.getMessageByFederationId(replyToEventId);
                if (!messageToReplyTo) {
                    return;
                }
                yield this.internalMessageAdapter.sendQuoteFileMessage(senderUser, federatedRoom, files, attachments, externalEventId, messageToReplyTo, this.internalHomeServerDomain);
                return;
            }
            yield this.internalMessageAdapter.sendFileMessage(senderUser, federatedRoom, files, attachments, externalEventId);
        });
    }
    onChangeJoinRules(roomJoinRulesChangeInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { externalRoomId, roomType } = roomJoinRulesChangeInput;
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId);
            if (!federatedRoom) {
                return;
            }
            const notAllowedChangeJoinRules = federatedRoom.isDirectMessage();
            if (notAllowedChangeJoinRules) {
                return;
            }
            federatedRoom.changeRoomType(roomType);
            yield this.internalRoomAdapter.updateRoomType(federatedRoom);
        });
    }
    onChangeRoomName(roomChangeNameInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { externalRoomId, normalizedRoomName, externalSenderId } = roomChangeNameInput;
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId);
            if (!federatedRoom) {
                return;
            }
            const federatedUser = yield this.internalUserAdapter.getFederatedUserByExternalId(externalSenderId);
            if (!federatedUser) {
                return;
            }
            const shouldUseExternalRoomIdAsRoomName = !FederatedRoom_1.FederatedRoom.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(externalRoomId), this.internalHomeServerDomain);
            if (shouldUseExternalRoomIdAsRoomName && federatedRoom.shouldUpdateRoomName(externalRoomId)) {
                federatedRoom.changeRoomName(externalRoomId);
                yield this.internalRoomAdapter.updateRoomName(federatedRoom);
            }
            if (!federatedRoom.shouldUpdateDisplayRoomName(normalizedRoomName)) {
                return;
            }
            federatedRoom.changeDisplayRoomName(normalizedRoomName);
            yield this.internalRoomAdapter.updateDisplayRoomName(federatedRoom, federatedUser);
        });
    }
    onChangeRoomTopic(roomChangeTopicInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { externalRoomId, roomTopic, externalSenderId } = roomChangeTopicInput;
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId);
            if (!federatedRoom) {
                return;
            }
            if (!federatedRoom.shouldUpdateRoomTopic(roomTopic)) {
                return;
            }
            const federatedUser = yield this.internalUserAdapter.getFederatedUserByExternalId(externalSenderId);
            if (!federatedUser) {
                return;
            }
            federatedRoom.changeRoomTopic(roomTopic);
            yield this.internalRoomAdapter.updateRoomTopic(federatedRoom, federatedUser);
        });
    }
    onRedactEvent(roomRedactEventInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { externalRoomId, redactsEvent, externalSenderId } = roomRedactEventInput;
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId);
            if (!federatedRoom) {
                return;
            }
            const federatedUser = yield this.internalUserAdapter.getFederatedUserByExternalId(externalSenderId);
            if (!federatedUser) {
                return;
            }
            const handler = yield (0, message_redaction_helper_1.getMessageRedactionHandler)(this.internalMessageAdapter, redactsEvent, federatedUser);
            if (!handler) {
                return;
            }
            yield handler.handle();
        });
    }
    onChangeRoomPowerLevels(roomPowerLevelsInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { externalRoomId, roleChangesToApply = {}, externalSenderId } = roomPowerLevelsInput;
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId);
            if (!federatedRoom) {
                return;
            }
            const federatedUserWhoChangedThePermission = yield this.internalUserAdapter.getFederatedUserByExternalId(externalSenderId);
            if (!federatedUserWhoChangedThePermission) {
                return;
            }
            const federatedUsers = yield this.internalUserAdapter.getFederatedUsersByExternalIds(Object.keys(roleChangesToApply));
            yield Promise.all(federatedUsers.map((targetFederatedUser) => {
                const changes = roleChangesToApply[targetFederatedUser.getExternalId()];
                if (!changes) {
                    return;
                }
                const rolesToRemove = changes.filter((change) => change.action === 'remove').map((change) => change.role);
                const rolesToAdd = changes.filter((change) => change.action === 'add').map((change) => change.role);
                return this.internalRoomAdapter.applyRoomRolesToUser({
                    federatedRoom,
                    targetFederatedUser,
                    fromUser: federatedUserWhoChangedThePermission,
                    rolesToAdd,
                    rolesToRemove,
                    notifyChannel: true,
                });
            }));
        });
    }
    onExternalThreadedMessageReceived(roomReceiveExternalMessageInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { externalRoomId, externalSenderId, rawMessage, externalFormattedText, externalEventId, replyToEventId, thread } = roomReceiveExternalMessageInput;
            if (!(thread === null || thread === void 0 ? void 0 : thread.rootEventId)) {
                return;
            }
            const parentMessage = yield this.internalMessageAdapter.getMessageByFederationId(thread.rootEventId);
            if (!parentMessage) {
                return;
            }
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId);
            if (!federatedRoom) {
                return;
            }
            const senderUser = yield this.internalUserAdapter.getFederatedUserByExternalId(externalSenderId);
            if (!senderUser) {
                return;
            }
            const message = yield this.internalMessageAdapter.getMessageByFederationId(externalEventId);
            if (message) {
                return;
            }
            if (replyToEventId) {
                const messageToReplyTo = yield this.internalMessageAdapter.getMessageByFederationId(replyToEventId);
                if (!messageToReplyTo) {
                    return;
                }
                yield this.internalMessageAdapter.sendThreadQuoteMessage(senderUser, federatedRoom, rawMessage, externalEventId, messageToReplyTo, this.internalHomeServerDomain, parentMessage._id, externalFormattedText);
                return;
            }
            yield this.internalMessageAdapter.sendThreadMessage(senderUser, federatedRoom, rawMessage, externalEventId, parentMessage._id, externalFormattedText, this.internalHomeServerDomain);
        });
    }
    onExternalThreadedFileMessageReceived(roomReceiveExternalMessageInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { externalRoomId, externalSenderId, messageBody, externalEventId, replyToEventId, thread } = roomReceiveExternalMessageInput;
            if (!(thread === null || thread === void 0 ? void 0 : thread.rootEventId)) {
                return;
            }
            const parentMessage = yield this.internalMessageAdapter.getMessageByFederationId(thread.rootEventId);
            if (!parentMessage) {
                return;
            }
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId);
            if (!federatedRoom) {
                return;
            }
            const senderUser = yield this.internalUserAdapter.getFederatedUserByExternalId(externalSenderId);
            if (!senderUser) {
                return;
            }
            const message = yield this.internalMessageAdapter.getMessageByFederationId(externalEventId);
            if (message) {
                return;
            }
            const fileDetails = {
                name: messageBody.filename,
                size: messageBody.size,
                type: messageBody.mimetype,
                rid: federatedRoom.getInternalId(),
                userId: senderUser.getInternalId(),
            };
            const readableStream = yield this.bridge.getReadStreamForFileFromUrl(senderUser.getExternalId(), messageBody.url);
            const { files = [], attachments } = yield this.internalFileAdapter.uploadFile(readableStream, federatedRoom.getInternalId(), senderUser.getInternalReference(), fileDetails);
            if (replyToEventId) {
                const messageToReplyTo = yield this.internalMessageAdapter.getMessageByFederationId(replyToEventId);
                if (!messageToReplyTo) {
                    return;
                }
                yield this.internalMessageAdapter.sendThreadQuoteFileMessage(senderUser, federatedRoom, files, attachments, externalEventId, messageToReplyTo, this.internalHomeServerDomain, parentMessage._id);
                return;
            }
            yield this.internalMessageAdapter.sendThreadFileMessage(senderUser, federatedRoom, files, attachments, externalEventId, parentMessage._id);
        });
    }
}
exports.FederationRoomServiceReceiver = FederationRoomServiceReceiver;
