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
exports.FederationFactory = void 0;
const MessageServiceReceiver_1 = require("../application/room/message/receiver/MessageServiceReceiver");
const MessageServiceSender_1 = require("../application/room/message/sender/MessageServiceSender");
const RoomServiceReceiver_1 = require("../application/room/receiver/RoomServiceReceiver");
const RoomInternalValidator_1 = require("../application/room/sender/RoomInternalValidator");
const RoomServiceSender_1 = require("../application/room/sender/RoomServiceSender");
const UserServiceReceiver_1 = require("../application/user/receiver/UserServiceReceiver");
const UserServiceSender_1 = require("../application/user/sender/UserServiceSender");
const Bridge_1 = require("./matrix/Bridge");
const handlers_1 = require("./matrix/handlers");
const Message_1 = require("./matrix/handlers/Message");
const Room_1 = require("./matrix/handlers/Room");
const User_1 = require("./matrix/handlers/User");
const InMemoryQueue_1 = require("./queue/InMemoryQueue");
const File_1 = require("./rocket-chat/adapters/File");
const Message_2 = require("./rocket-chat/adapters/Message");
const Notification_1 = require("./rocket-chat/adapters/Notification");
const Room_2 = require("./rocket-chat/adapters/Room");
const Settings_1 = require("./rocket-chat/adapters/Settings");
const User_2 = require("./rocket-chat/adapters/User");
const RoomSender_1 = require("./rocket-chat/converters/RoomSender");
const hooks_1 = require("./rocket-chat/hooks");
class FederationFactory {
    static buildInternalSettingsAdapter() {
        return new Settings_1.RocketChatSettingsAdapter();
    }
    static buildInternalRoomAdapter() {
        return new Room_2.RocketChatRoomAdapter();
    }
    static buildInternalUserAdapter() {
        return new User_2.RocketChatUserAdapter();
    }
    static buildInternalMessageAdapter() {
        return new Message_2.RocketChatMessageAdapter();
    }
    static buildInternalFileAdapter() {
        return new File_1.RocketChatFileAdapter();
    }
    static buildInternalNotificationAdapter() {
        return new Notification_1.RocketChatNotificationAdapter();
    }
    static buildFederationQueue() {
        return new InMemoryQueue_1.InMemoryQueue();
    }
    static buildRoomServiceReceiver(internalRoomAdapter, internalUserAdapter, internalMessageAdapter, internalFileAdapter, internalSettingsAdapter, internalNotificationAdapter, federationQueueInstance, bridge) {
        return new RoomServiceReceiver_1.FederationRoomServiceReceiver(internalRoomAdapter, internalUserAdapter, internalMessageAdapter, internalFileAdapter, internalSettingsAdapter, internalNotificationAdapter, federationQueueInstance, bridge);
    }
    static buildRoomServiceSender(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalMessageAdapter, internalSettingsAdapter, internalNotificationAdapter, bridge) {
        return new RoomServiceSender_1.FederationRoomServiceSender(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalMessageAdapter, internalSettingsAdapter, internalNotificationAdapter, bridge);
    }
    static buildUserServiceSender(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalSettingsAdapter, bridge) {
        return new UserServiceSender_1.FederationUserServiceSender(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalSettingsAdapter, bridge);
    }
    static buildMessageServiceSender(internalRoomAdapter, internalUserAdapter, internalSettingsAdapter, internalMessageAdapter, bridge) {
        return new MessageServiceSender_1.FederationMessageServiceSender(internalRoomAdapter, internalUserAdapter, internalSettingsAdapter, internalMessageAdapter, bridge);
    }
    static buildMessageServiceReceiver(internalRoomAdapter, internalUserAdapter, internalMessageAdapter, internalFileAdapter, internalSettingsAdapter, bridge) {
        return new MessageServiceReceiver_1.FederationMessageServiceReceiver(internalRoomAdapter, internalUserAdapter, internalMessageAdapter, internalFileAdapter, internalSettingsAdapter, bridge);
    }
    static buildUserServiceReceiver(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalNotificationAdapter, internalSettingsAdapter, bridge) {
        return new UserServiceReceiver_1.FederationUserServiceReceiver(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalNotificationAdapter, internalSettingsAdapter, bridge);
    }
    static buildRoomInternalValidator(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalSettingsAdapter, bridge) {
        return new RoomInternalValidator_1.FederationRoomInternalValidator(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalSettingsAdapter, bridge);
    }
    static buildFederationBridge(internalSettingsAdapter, queue) {
        return new Bridge_1.MatrixBridge(internalSettingsAdapter, queue.addToQueue.bind(queue));
    }
    static buildFederationEventHandler(roomServiceReceive, messageServiceReceiver, userServiceReceiver, internalSettingsAdapter) {
        return new handlers_1.MatrixEventsHandler(FederationFactory.getEventHandlers(roomServiceReceive, messageServiceReceiver, userServiceReceiver, internalSettingsAdapter));
    }
    static getEventHandlers(roomServiceReceiver, messageServiceReceiver, userServiceReceiver, internalSettingsAdapter) {
        return [
            new Room_1.MatrixRoomCreatedHandler(roomServiceReceiver),
            new Room_1.MatrixRoomMembershipChangedHandler(roomServiceReceiver, internalSettingsAdapter),
            new Room_1.MatrixRoomMessageSentHandler(roomServiceReceiver),
            new Room_1.MatrixRoomJoinRulesChangedHandler(roomServiceReceiver),
            new Room_1.MatrixRoomNameChangedHandler(roomServiceReceiver),
            new Room_1.MatrixRoomTopicChangedHandler(roomServiceReceiver),
            new Room_1.MatrixRoomEventRedactedHandler(roomServiceReceiver),
            new Message_1.MatrixMessageReactedHandler(messageServiceReceiver),
            new User_1.MatrixUserTypingStatusChangedHandler(userServiceReceiver),
            new Room_1.MatrixRoomPowerLevelsChangedHandler(roomServiceReceiver),
        ];
    }
    static setupListenersForLocalActions(roomServiceSender, messageServiceSender) {
        hooks_1.FederationHooks.afterUserLeaveRoom((user, room) => roomServiceSender.afterUserLeaveRoom(RoomSender_1.FederationRoomSenderConverter.toAfterUserLeaveRoom(user._id, room._id)));
        hooks_1.FederationHooks.onUserRemovedFromRoom((user, room, userWhoRemoved) => roomServiceSender.onUserRemovedFromRoom(RoomSender_1.FederationRoomSenderConverter.toOnUserRemovedFromRoom(user._id, room._id, userWhoRemoved._id)));
        hooks_1.FederationHooks.afterMessageReacted((message, user, reaction) => messageServiceSender.sendExternalMessageReaction(message, user, reaction));
        hooks_1.FederationHooks.afterMessageunReacted((message, user, reaction) => messageServiceSender.sendExternalMessageUnReaction(message, user, reaction));
        hooks_1.FederationHooks.afterMessageDeleted((message, roomId) => roomServiceSender.afterMessageDeleted(message, roomId));
        hooks_1.FederationHooks.afterMessageUpdated((message, roomId, userId) => roomServiceSender.afterMessageUpdated(message, roomId, userId));
        hooks_1.FederationHooks.afterMessageSent((message, roomId, userId) => roomServiceSender.sendExternalMessage(RoomSender_1.FederationRoomSenderConverter.toSendExternalMessageDto(userId, roomId, message)));
        hooks_1.FederationHooks.afterRoomNameChanged((roomId, roomName) => __awaiter(this, void 0, void 0, function* () { return roomServiceSender.afterRoomNameChanged(roomId, roomName); }));
        hooks_1.FederationHooks.afterRoomTopicChanged((roomId, roomTopic) => __awaiter(this, void 0, void 0, function* () { return roomServiceSender.afterRoomTopicChanged(roomId, roomTopic); }));
    }
    static setupValidators(roomInternalHooksValidator) {
        hooks_1.FederationHooks.canAddFederatedUserToNonFederatedRoom((user, room) => roomInternalHooksValidator.canAddFederatedUserToNonFederatedRoom(user, room));
        hooks_1.FederationHooks.canAddFederatedUserToFederatedRoom((user, inviter, room) => roomInternalHooksValidator.canAddFederatedUserToFederatedRoom(user, inviter, room));
        hooks_1.FederationHooks.canCreateDirectMessageFromUI((members) => roomInternalHooksValidator.canCreateDirectMessageFromUI(members));
    }
    static removeCEValidators() {
        hooks_1.FederationHooks.removeCEValidation();
    }
    static removeAllListeners() {
        hooks_1.FederationHooks.removeAllListeners();
    }
}
exports.FederationFactory = FederationFactory;
