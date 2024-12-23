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
exports.FederationFactoryEE = void 0;
const Factory_1 = require("../../../../../server/services/federation/infrastructure/Factory");
const Notification_1 = require("../../../../../server/services/federation/infrastructure/rocket-chat/adapters/Notification");
const UserService_1 = require("../application/UserService");
const DirectMessageRoomServiceSender_1 = require("../application/room/sender/DirectMessageRoomServiceSender");
const RoomServiceSender_1 = require("../application/room/sender/RoomServiceSender");
const Bridge_1 = require("./matrix/Bridge");
const Queue_1 = require("./rocket-chat/adapters/Queue");
const Room_1 = require("./rocket-chat/adapters/Room");
const User_1 = require("./rocket-chat/adapters/User");
const RoomSender_1 = require("./rocket-chat/converters/RoomSender");
const hooks_1 = require("./rocket-chat/hooks");
class FederationFactoryEE extends Factory_1.FederationFactory {
    static buildFederationBridge(internalSettingsAdapter, queue) {
        return new Bridge_1.MatrixBridgeEE(internalSettingsAdapter, queue.addToQueue.bind(queue));
    }
    static buildInternalRoomAdapter() {
        return new Room_1.RocketChatRoomAdapterEE();
    }
    static buildInternalNotificationAdapter() {
        return new Notification_1.RocketChatNotificationAdapter();
    }
    static buildInternalUserAdapter() {
        return new User_1.RocketChatUserAdapterEE();
    }
    static buildInternalQueueAdapter() {
        return new Queue_1.RocketChatQueueAdapterEE();
    }
    static buildRoomServiceSenderEE(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalSettingsAdapter, internalMessageAdapter, internalNotificationAdapter, internalQueueAdapter, bridge) {
        return new RoomServiceSender_1.FederationRoomServiceSender(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalSettingsAdapter, internalMessageAdapter, internalNotificationAdapter, internalQueueAdapter, bridge);
    }
    static buildDirectMessageRoomServiceSender(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalSettingsAdapter, bridge) {
        return new DirectMessageRoomServiceSender_1.FederationDirectMessageRoomServiceSender(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalSettingsAdapter, bridge);
    }
    static buildRoomApplicationService(internalSettingsAdapter, internalUserAdapter, internalFileAdapter, bridge) {
        return new UserService_1.FederationUserServiceEE(internalSettingsAdapter, internalFileAdapter, internalUserAdapter, bridge);
    }
    static setupListenersForLocalActionsEE(roomInternalHooksServiceSender, dmRoomInternalHooksServiceSender, settingsAdapter) {
        const homeServerDomain = settingsAdapter.getHomeServerDomain();
        hooks_1.FederationHooksEE.onFederatedRoomCreated((room, owner, originalMemberList) => __awaiter(this, void 0, void 0, function* () {
            return roomInternalHooksServiceSender.onRoomCreated(RoomSender_1.FederationRoomSenderConverterEE.toOnRoomCreationDto(owner._id, owner.username || '', room._id, originalMemberList, homeServerDomain));
        }));
        hooks_1.FederationHooksEE.onUsersAddedToARoom((room, members, owner) => __awaiter(this, void 0, void 0, function* () {
            return roomInternalHooksServiceSender.onUsersAddedToARoom(RoomSender_1.FederationRoomSenderConverterEE.toOnAddedUsersToARoomDto((owner === null || owner === void 0 ? void 0 : owner._id) || '', (owner === null || owner === void 0 ? void 0 : owner.username) || '', room._id, members, homeServerDomain));
        }));
        hooks_1.FederationHooksEE.beforeDirectMessageRoomCreate((members) => __awaiter(this, void 0, void 0, function* () {
            return dmRoomInternalHooksServiceSender.beforeDirectMessageRoomCreation(RoomSender_1.FederationRoomSenderConverterEE.toBeforeDirectMessageCreatedDto(members, homeServerDomain));
        }));
        hooks_1.FederationHooksEE.onDirectMessageRoomCreated((room, ownerId, members) => __awaiter(this, void 0, void 0, function* () {
            return dmRoomInternalHooksServiceSender.onDirectMessageRoomCreation(RoomSender_1.FederationRoomSenderConverterEE.toOnDirectMessageCreatedDto(ownerId, room._id, members, homeServerDomain));
        }));
        hooks_1.FederationHooksEE.beforeAddUserToARoom((user, room, inviter) => __awaiter(this, void 0, void 0, function* () {
            return roomInternalHooksServiceSender.beforeAddUserToARoom(RoomSender_1.FederationRoomSenderConverterEE.toBeforeAddUserToARoomDto([user], room, homeServerDomain, inviter));
        }));
    }
    static removeAllListeners() {
        super.removeAllListeners();
        hooks_1.FederationHooksEE.removeAllListeners();
    }
}
exports.FederationFactoryEE = FederationFactoryEE;
