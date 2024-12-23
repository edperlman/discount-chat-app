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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const rooms_1 = require("@rocket.chat/apps-engine/definition/rooms");
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const MatrixPowerLevels_1 = require("../../../../../../../server/services/federation/infrastructure/matrix/definitions/MatrixPowerLevels");
const data_1 = require("../../../../../../mocks/data");
const sendMessageStub = sinon_1.default.stub();
const sendQuoteMessageStub = sinon_1.default.stub();
const { FederationRoomServiceSender } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../../server/services/federation/application/room/sender/RoomServiceSender', {
    'mongodb': {
        'ObjectId': class ObjectId {
            toHexString() {
                return 'hexString';
            }
        },
        '@global': true,
    },
    '../message/sender/message-sender-helper': {
        getExternalMessageSender: () => ({ sendMessage: sendMessageStub, sendQuoteMessage: sendQuoteMessageStub }),
    },
});
const { FederatedUser } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../../server/services/federation/domain/FederatedUser', {
    mongodb: {
        'ObjectId': class ObjectId {
            toHexString() {
                return 'hexString';
            }
        },
        '@global': true,
    },
});
const { DirectMessageFederatedRoom, FederatedRoom } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../../server/services/federation/domain/FederatedRoom', {
    mongodb: {
        'ObjectId': class ObjectId {
            toHexString() {
                return 'hexString';
            }
        },
        '@global': true,
    },
});
describe('Federation - Application - FederationRoomServiceSender', () => {
    let service;
    const roomAdapter = {
        getFederatedRoomByInternalId: sinon_1.default.stub(),
        createFederatedRoomForDirectMessage: sinon_1.default.stub(),
        getDirectMessageFederatedRoomByUserIds: sinon_1.default.stub(),
        addUserToRoom: sinon_1.default.stub(),
        createFederatedRoom: sinon_1.default.stub(),
        getInternalRoomRolesByUserId: sinon_1.default.stub(),
        applyRoomRolesToUser: sinon_1.default.stub(),
    };
    const userAdapter = {
        getFederatedUserByExternalId: sinon_1.default.stub(),
        getFederatedUserByInternalId: sinon_1.default.stub(),
        createFederatedUser: sinon_1.default.stub(),
        getInternalUserById: sinon_1.default.stub(),
        getFederatedUserByInternalUsername: sinon_1.default.stub(),
        getInternalUserByUsername: sinon_1.default.stub(),
    };
    const settingsAdapter = {
        getHomeServerDomain: sinon_1.default.stub().returns('localDomain'),
    };
    const fileAdapter = {
        getBufferForAvatarFile: sinon_1.default.stub().resolves(undefined),
    };
    const messageAdapter = {
        getMessageById: sinon_1.default.stub(),
        setExternalFederationEventOnMessage: sinon_1.default.stub(),
    };
    const notificationsAdapter = {
        subscribeToUserTypingEventsOnFederatedRoomId: sinon_1.default.stub(),
        broadcastUserTypingOnRoom: sinon_1.default.stub(),
        notifyWithEphemeralMessage: sinon_1.default.stub(),
    };
    const bridge = {
        getUserProfileInformation: sinon_1.default.stub().resolves({}),
        extractHomeserverOrigin: sinon_1.default.stub(),
        sendMessage: sinon_1.default.stub(),
        createUser: sinon_1.default.stub(),
        inviteToRoom: sinon_1.default.stub().returns(new Promise((resolve) => resolve({}))),
        createDirectMessageRoom: sinon_1.default.stub(),
        joinRoom: sinon_1.default.stub(),
        leaveRoom: sinon_1.default.stub(),
        kickUserFromRoom: sinon_1.default.stub(),
        redactEvent: sinon_1.default.stub(),
        updateMessage: sinon_1.default.stub(),
        setRoomPowerLevels: sinon_1.default.stub(),
        setRoomName: sinon_1.default.stub(),
        getRoomName: sinon_1.default.stub(),
        setRoomTopic: sinon_1.default.stub(),
        getRoomTopic: sinon_1.default.stub(),
    };
    beforeEach(() => {
        service = new FederationRoomServiceSender(roomAdapter, userAdapter, fileAdapter, messageAdapter, settingsAdapter, notificationsAdapter, bridge);
    });
    afterEach(() => {
        roomAdapter.getFederatedRoomByInternalId.reset();
        roomAdapter.createFederatedRoomForDirectMessage.reset();
        roomAdapter.getDirectMessageFederatedRoomByUserIds.reset();
        roomAdapter.addUserToRoom.reset();
        roomAdapter.createFederatedRoom.reset();
        roomAdapter.getInternalRoomRolesByUserId.reset();
        roomAdapter.applyRoomRolesToUser.reset();
        userAdapter.getFederatedUserByInternalId.reset();
        userAdapter.getFederatedUserByExternalId.reset();
        userAdapter.getInternalUserById.reset();
        userAdapter.createFederatedUser.reset();
        userAdapter.getFederatedUserByInternalUsername.reset();
        userAdapter.getInternalUserByUsername.reset();
        bridge.extractHomeserverOrigin.reset();
        bridge.sendMessage.reset();
        bridge.createUser.reset();
        bridge.createDirectMessageRoom.reset();
        bridge.inviteToRoom.reset();
        bridge.joinRoom.reset();
        bridge.leaveRoom.reset();
        bridge.kickUserFromRoom.reset();
        bridge.redactEvent.reset();
        bridge.updateMessage.reset();
        bridge.setRoomPowerLevels.reset();
        bridge.setRoomTopic.reset();
        bridge.setRoomName.reset();
        bridge.getRoomName.reset();
        bridge.getRoomTopic.reset();
        messageAdapter.getMessageById.reset();
        messageAdapter.setExternalFederationEventOnMessage.reset();
        notificationsAdapter.subscribeToUserTypingEventsOnFederatedRoomId.reset();
        notificationsAdapter.notifyWithEphemeralMessage.reset();
        notificationsAdapter.broadcastUserTypingOnRoom.reset();
        sendMessageStub.reset();
        sendQuoteMessageStub.reset();
    });
    describe('#createDirectMessageRoomAndInviteUser()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: true,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT create the inviter user if the user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            roomAdapter.getDirectMessageFederatedRoomByUserIds.resolves(room);
            yield service.createDirectMessageRoomAndInviteUser({});
            sinon_1.default.assert.notCalled(userAdapter.createFederatedUser);
        }));
        it('should create the inviter user both externally and internally if it does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.onCall(0).resolves(undefined);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getInternalUserById.resolves({ username: 'username', name: 'name' });
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            roomAdapter.getDirectMessageFederatedRoomByUserIds.resolves(room);
            bridge.createUser.resolves('externalInviterId');
            yield service.createDirectMessageRoomAndInviteUser({ externalInviterId: 'externalInviterId' });
            const inviter = FederatedUser.createInstance('externalInviterId', {
                name: 'name',
                username: 'username',
                existsOnlyOnProxyServer: true,
            });
            sinon_1.default.assert.calledWith(bridge.createUser, 'username', 'name', 'localDomain');
            sinon_1.default.assert.calledWith(userAdapter.createFederatedUser, inviter);
        }));
        it('should NOT create the invitee user if the user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getInternalUserById.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            roomAdapter.getDirectMessageFederatedRoomByUserIds.resolves(room);
            yield service.createDirectMessageRoomAndInviteUser({
                normalizedInviteeId: 'normalizedInviteeId',
                rawInviteeId: 'rawInviteeId',
            });
            sinon_1.default.assert.notCalled(userAdapter.createFederatedUser);
        }));
        it('should create the invitee user internally if it does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            userAdapter.getFederatedUserByInternalId.onCall(1).resolves(undefined);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            roomAdapter.getDirectMessageFederatedRoomByUserIds.resolves(room);
            userAdapter.getInternalUserById.resolves(user);
            yield service.createDirectMessageRoomAndInviteUser({
                normalizedInviteeId: 'normalizedInviteeId',
                rawInviteeId: 'rawInviteeId',
            });
            const invitee = FederatedUser.createInstance('rawInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: false,
            });
            sinon_1.default.assert.calledWith(userAdapter.createFederatedUser, invitee);
        }));
        it('should throw an error when the inviter does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            userAdapter.getInternalUserById.resolves({ username: 'username' });
            yield (0, chai_1.expect)(service.createDirectMessageRoomAndInviteUser({
                normalizedInviteeId: 'normalizedInviteeId',
                rawInviteeId: 'rawInviteeId',
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
                inviteeUsernameOnly: 'true',
            })).to.be.rejectedWith('Could not find inviter or invitee user');
        }));
        it('should throw an error when the invitee does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            userAdapter.getInternalUserById.resolves({ username: 'username' });
            yield (0, chai_1.expect)(service.createDirectMessageRoomAndInviteUser({
                normalizedInviteeId: 'normalizedInviteeId',
                rawInviteeId: 'rawInviteeId',
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
                inviteeUsernameOnly: 'true',
            })).to.be.rejectedWith('Could not find inviter or invitee user');
        }));
        it('should NOT create the room if it already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getDirectMessageFederatedRoomByUserIds.resolves(room);
            yield service.createDirectMessageRoomAndInviteUser({
                normalizedInviteeId: 'normalizedInviteeId',
                rawInviteeId: 'rawInviteeId',
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
                inviteeUsernameOnly: 'true',
            });
            sinon_1.default.assert.notCalled(roomAdapter.createFederatedRoomForDirectMessage);
        }));
        it('should create the room both externally and internally if it does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const invitee = FederatedUser.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: false,
            });
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalId.onCall(1).resolves(invitee);
            roomAdapter.getDirectMessageFederatedRoomByUserIds.onCall(0).resolves(undefined);
            roomAdapter.getDirectMessageFederatedRoomByUserIds.resolves(room);
            bridge.createDirectMessageRoom.resolves('externalRoomId');
            yield service.createDirectMessageRoomAndInviteUser({
                normalizedInviteeId: 'normalizedInviteeId',
                rawInviteeId: 'rawInviteeId',
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
                inviteeUsernameOnly: 'true',
            });
            const roomResult = DirectMessageFederatedRoom.createInstance('externalRoomId', user, [user, invitee]);
            sinon_1.default.assert.calledWith(bridge.createDirectMessageRoom, 'externalInviterId', ['externalInviteeId']);
            sinon_1.default.assert.calledWith(roomAdapter.createFederatedRoomForDirectMessage, roomResult);
        }));
        it('should throw an error if the federated room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getDirectMessageFederatedRoomByUserIds.resolves(undefined);
            bridge.createDirectMessageRoom.resolves('externalRoomId');
            yield (0, chai_1.expect)(service.createDirectMessageRoomAndInviteUser({
                normalizedInviteeId: 'normalizedInviteeId',
                rawInviteeId: 'rawInviteeId',
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
                inviteeUsernameOnly: 'true',
            })).to.be.rejectedWith('Could not find room id for users: hexString hexString');
        }));
        it('should create the invitee user on the proxy home server if the invitee is from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            const invitee = FederatedUser.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: true,
            });
            userAdapter.getFederatedUserByInternalId.onCall(0).resolves(user);
            userAdapter.getFederatedUserByInternalId.onCall(1).resolves(invitee);
            roomAdapter.getDirectMessageFederatedRoomByUserIds.resolves(room);
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.getUserProfileInformation.resolves(undefined);
            yield service.createDirectMessageRoomAndInviteUser({
                normalizedInviteeId: 'normalizedInviteeId',
                rawInviteeId: 'rawInviteeId',
                inviteeUsernameOnly: 'inviteeUsernameOnly',
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
            });
            sinon_1.default.assert.calledWith(bridge.createUser, 'inviteeUsernameOnly', 'normalizedInviteeId', 'localDomain');
        }));
        it('should invite and join the user to the room in the proxy home server if the invitee is from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            const invitee = FederatedUser.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: true,
            });
            userAdapter.getFederatedUserByInternalId.onCall(0).resolves(user);
            userAdapter.getFederatedUserByInternalId.onCall(1).resolves(invitee);
            roomAdapter.getDirectMessageFederatedRoomByUserIds.resolves(room);
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.getUserProfileInformation.resolves(undefined);
            yield service.createDirectMessageRoomAndInviteUser({
                normalizedInviteeId: 'normalizedInviteeId',
                rawInviteeId: 'rawInviteeId',
                inviteeUsernameOnly: 'inviteeUsernameOnly',
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
            });
            sinon_1.default.assert.calledWith(bridge.inviteToRoom, 'externalRoomId', 'externalInviterId', 'externalInviteeId');
            sinon_1.default.assert.calledWith(bridge.joinRoom, 'externalRoomId', 'externalInviteeId');
        }));
        it('should NOT invite any user externally if the user is not from the same home server', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getDirectMessageFederatedRoomByUserIds.resolves(room);
            bridge.extractHomeserverOrigin.returns('externalDomain');
            yield service.createDirectMessageRoomAndInviteUser({
                normalizedInviteeId: 'normalizedInviteeId',
                rawInviteeId: 'rawInviteeId',
                inviteeUsernameOnly: 'inviteeUsernameOnly',
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
            });
            sinon_1.default.assert.notCalled(bridge.inviteToRoom);
            sinon_1.default.assert.notCalled(bridge.createUser);
            sinon_1.default.assert.notCalled(bridge.joinRoom);
        }));
        it('should always add the user to the internal room', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getDirectMessageFederatedRoomByUserIds.resolves(room);
            bridge.extractHomeserverOrigin.returns('externalDomain');
            yield service.createDirectMessageRoomAndInviteUser({
                normalizedInviteeId: 'normalizedInviteeId',
                rawInviteeId: 'rawInviteeId',
                inviteeUsernameOnly: 'inviteeUsernameOnly',
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
            });
            sinon_1.default.assert.calledWith(roomAdapter.addUserToRoom, room, user, user);
        }));
    });
    describe('#afterUserLeaveRoom()', () => {
        it('should not remove the user from the room if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            yield service.afterUserLeaveRoom({});
            sinon_1.default.assert.notCalled(bridge.leaveRoom);
        }));
        it('should not remove the user from the room if the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves({});
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            yield service.afterUserLeaveRoom({});
            sinon_1.default.assert.notCalled(bridge.leaveRoom);
        }));
        it('should not remove the user from the room if the  who executed the action is not from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = FederatedUser.createInstance('externalInviterId', {
                name: 'normalizedInviterId',
                username: 'normalizedInviterId',
                existsOnlyOnProxyServer: false,
            });
            bridge.extractHomeserverOrigin.returns('externalDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves({});
            userAdapter.getFederatedUserByInternalId.resolves(user);
            yield service.afterUserLeaveRoom({});
            sinon_1.default.assert.notCalled(bridge.leaveRoom);
        }));
        it('should remove the user from the room if the room and the user exists, and is from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = FederatedUser.createInstance('externalInviterId', {
                name: 'normalizedInviterId',
                username: 'normalizedInviterId',
                existsOnlyOnProxyServer: true,
            });
            const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
            bridge.extractHomeserverOrigin.returns('localDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            yield service.afterUserLeaveRoom({});
            sinon_1.default.assert.calledWith(bridge.leaveRoom, room.getExternalId(), user.getExternalId());
        }));
    });
    describe('#onUserRemovedFromRoom()', () => {
        it('should not kick the user from the room if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            yield service.onUserRemovedFromRoom({});
            sinon_1.default.assert.notCalled(bridge.kickUserFromRoom);
        }));
        it('should not kick the user from the room if the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves({});
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            yield service.onUserRemovedFromRoom({});
            sinon_1.default.assert.notCalled(bridge.kickUserFromRoom);
        }));
        it('should not kick the user from the room if the user who executed the action does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves({});
            userAdapter.getFederatedUserByInternalId.onCall(0).resolves({});
            userAdapter.getFederatedUserByInternalId.onCall(1).resolves(undefined);
            yield service.onUserRemovedFromRoom({});
            sinon_1.default.assert.notCalled(bridge.kickUserFromRoom);
        }));
        it('should not kick the user from the room if the user who executed the action is not from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('externalDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves({});
            userAdapter.getFederatedUserByInternalId.onCall(0).resolves({});
            userAdapter.getFederatedUserByInternalId.onCall(1).resolves(undefined);
            yield service.onUserRemovedFromRoom({});
            sinon_1.default.assert.notCalled(bridge.kickUserFromRoom);
        }));
        it('should remove the user from the room if the room, user and the user who executed the action exists, and is from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = FederatedUser.createInstance('externalInviterId', {
                name: 'normalizedInviterId',
                username: 'normalizedInviterId',
                existsOnlyOnProxyServer: true,
            });
            const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
            bridge.extractHomeserverOrigin.returns('localDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            yield service.onUserRemovedFromRoom({});
            sinon_1.default.assert.calledWith(bridge.kickUserFromRoom, room.getExternalId(), user.getExternalId(), user.getExternalId());
        }));
    });
    describe('#sendExternalMessage()', () => {
        it('should throw an error if the sender does not exists ', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            yield (0, chai_1.expect)(service.sendExternalMessage({ internalSenderId: 'internalSenderId' })).to.be.rejectedWith('Could not find user id for internalSenderId');
        }));
        it('should throw an error if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves({});
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            yield (0, chai_1.expect)(service.sendExternalMessage({ internalRoomId: 'internalRoomId' })).to.be.rejectedWith('Could not find room id for internalRoomId');
        }));
        it('should NOT send any message if the message was already sent through federation', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves({});
            roomAdapter.getFederatedRoomByInternalId.resolves({});
            yield service.sendExternalMessage({ internalRoomId: 'internalRoomId', message: { federation: { eventId: 'eventId' } } });
            sinon_1.default.assert.notCalled(sendMessageStub);
            sinon_1.default.assert.notCalled(sendQuoteMessageStub);
        }));
        it('should send the message through the bridge', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = FederatedUser.createInstance('externalInviterId', {
                name: 'normalizedInviterId',
                username: 'normalizedInviterId',
                existsOnlyOnProxyServer: true,
            });
            const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            yield service.sendExternalMessage({ message: { msg: 'text' } });
            sinon_1.default.assert.calledWith(sendMessageStub, room.getExternalId(), user.getExternalId(), { msg: 'text' });
        }));
        describe('Quoting messages', () => {
            it('should NOT send a quote message if the current attachment does not have a valid message_link (with a valid msg to reply to)', () => __awaiter(void 0, void 0, void 0, function* () {
                userAdapter.getFederatedUserByInternalId.resolves({});
                roomAdapter.getFederatedRoomByInternalId.resolves({});
                yield service.sendExternalMessage({
                    internalRoomId: 'internalRoomId',
                    message: { attachments: [{ message_link: 'http://localhost:3000/group/1' }] },
                });
                sinon_1.default.assert.notCalled(sendMessageStub);
                sinon_1.default.assert.notCalled(sendQuoteMessageStub);
            }));
            it('should send a quote message if the current attachment is valid', () => __awaiter(void 0, void 0, void 0, function* () {
                const user = FederatedUser.createInstance('externalInviterId', {
                    name: 'normalizedInviterId',
                    username: 'normalizedInviterId',
                    existsOnlyOnProxyServer: true,
                });
                const originalSender = FederatedUser.createInstance('originalSenderExternalInviterId', {
                    name: 'normalizedInviterId',
                    username: 'normalizedInviterId',
                    existsOnlyOnProxyServer: true,
                });
                const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
                userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(user);
                userAdapter.getFederatedUserByInternalId.onSecondCall().resolves(originalSender);
                roomAdapter.getFederatedRoomByInternalId.resolves(room);
                messageAdapter.getMessageById.resolves({ federation: { eventId: 'eventId' } });
                const message = {
                    _id: '_id',
                    msg: 'message',
                    attachments: [{ message_link: 'http://localhost:3000/group/1?msg=1' }],
                };
                yield service.sendExternalMessage({
                    internalRoomId: 'internalRoomId',
                    message,
                });
                (0, chai_1.expect)(sendQuoteMessageStub.calledWith(room.getExternalId(), user.getExternalId(), message, { federation: { eventId: 'eventId' } }))
                    .to.be.true;
                sinon_1.default.assert.notCalled(sendMessageStub);
            }));
        });
    });
    describe('#afterMessageDeleted()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: true,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should not delete the message remotely if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            yield service.afterMessageDeleted({ msg: 'msg', u: { _id: 'id' } }, 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.redactEvent);
        }));
        it('should not delete the message remotely if the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            yield service.afterMessageDeleted({ msg: 'msg', u: { _id: 'id' } }, 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.redactEvent);
        }));
        it('should not delete the message remotely if the message is not an external one', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            yield service.afterMessageDeleted({ msg: 'msg', u: { _id: 'id' } }, 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.redactEvent);
        }));
        it('should not delete the message remotely if the message was already deleted (it was just updated to keep the chat history)', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            const internalMessage = (0, data_1.createFakeMessage)({
                msg: 'msg',
                federation: { eventId: 'id' },
                editedAt: faker_1.faker.date.recent(),
                editedBy: (0, data_1.createFakeUser)(),
                t: 'rm',
                u: (0, data_1.createFakeUser)({
                    username: faker_1.faker.internet.userName(),
                    name: faker_1.faker.person.fullName(),
                }),
            });
            yield service.afterMessageDeleted(internalMessage, 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.redactEvent);
        }));
        it('should not delete the message remotely if the user is not from the same home server', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('externalDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            yield service.afterMessageDeleted({
                msg: 'msg',
                federationEventId: 'id',
                u: { _id: 'id' },
            }, 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.redactEvent);
        }));
        it('should delete the message remotely', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('localDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            yield service.afterMessageDeleted({
                msg: 'msg',
                federation: { eventId: 'federationEventId' },
                u: { _id: 'id' },
            }, 'internalRoomId');
            sinon_1.default.assert.calledWith(bridge.redactEvent, room.getExternalId(), user.getExternalId(), 'federationEventId');
        }));
    });
    describe('#afterMessageUpdated()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: true,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should not update the message remotely if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            yield service.afterMessageUpdated({ msg: 'msg' }, 'internalRoomId', 'internalUserId');
            sinon_1.default.assert.notCalled(bridge.updateMessage);
        }));
        it('should not update the message remotely if the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            yield service.afterMessageUpdated({ msg: 'msg' }, 'internalRoomId', 'internalUserId');
            sinon_1.default.assert.notCalled(bridge.updateMessage);
        }));
        it('should not update the message remotely if the message is not an external one', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            yield service.afterMessageUpdated({ msg: 'msg' }, 'internalRoomId', 'internalUserId');
            sinon_1.default.assert.notCalled(bridge.updateMessage);
        }));
        it('should not update the message remotely if it was updated not by the sender', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            yield service.afterMessageUpdated({ msg: 'msg', federation: { eventId: 'federationEventId' }, u: { _id: 'sender' } }, 'internalRoomId', 'internalUserId');
            sinon_1.default.assert.notCalled(bridge.updateMessage);
        }));
        it('should not update the message remotely if the user is not from the same home server', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('externalDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            const internalMessage = (0, data_1.createFakeMessage)({
                msg: 'msg',
                federation: { eventId: 'federationEventId' },
                editedAt: faker_1.faker.date.recent(),
                editedBy: (0, data_1.createFakeUser)(),
                u: (0, data_1.createFakeUser)({
                    username: faker_1.faker.internet.userName(),
                    name: faker_1.faker.person.fullName(),
                }),
            });
            yield service.afterMessageUpdated(internalMessage, 'internalRoomId', 'internalUserId');
            sinon_1.default.assert.notCalled(bridge.updateMessage);
        }));
        it('should update the message remotely', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('localDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            const internalMessage = (0, data_1.createFakeMessage)({
                msg: 'msg',
                federation: { eventId: 'federationEventId' },
                editedAt: faker_1.faker.date.recent(),
                editedBy: (0, data_1.createFakeUser)(),
                u: (0, data_1.createFakeUser)({
                    _id: 'internalUserId',
                    username: faker_1.faker.internet.userName(),
                    name: faker_1.faker.person.fullName(),
                }),
            });
            yield service.afterMessageUpdated(internalMessage, 'internalRoomId', 'internalUserId');
            sinon_1.default.assert.calledWith(bridge.updateMessage, room.getExternalId(), user.getExternalId(), 'federationEventId', 'msg');
        }));
    });
    describe('#onRoomOwnerAdded()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: true,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT set the user power level in the room if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            yield service.onRoomOwnerAdded('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should NOT set the user power level in the room if the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            yield service.onRoomOwnerAdded('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should NOT set the user power level in the room if the target user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(user);
            userAdapter.getFederatedUserByInternalId.onSecondCall().resolves(undefined);
            yield service.onRoomOwnerAdded('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should throw an error if the user is trying to make the target user (not himself) an owner, but he is not an owner', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            roomAdapter.getInternalRoomRolesByUserId.resolves([]);
            userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(user);
            userAdapter.getFederatedUserByInternalId.onSecondCall().resolves({ getInternalId: () => 'internalTargetUserId' });
            yield (0, chai_1.expect)(service.onRoomOwnerAdded('internalUserId', 'internalTargetUserId', 'internalRoomId')).to.be.rejectedWith('Federation_Matrix_not_allowed_to_change_owner');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should NOT set the user power level in the room if the user is not from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(user);
            roomAdapter.getInternalRoomRolesByUserId.resolves(['owner']);
            userAdapter.getFederatedUserByInternalId.onSecondCall().resolves({ getInternalId: () => 'internalTargetUserId' });
            bridge.extractHomeserverOrigin.returns('externalDomain');
            yield service.onRoomOwnerAdded('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should set the user power level in the room when the user is an owner giving an ownership to someone else', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(user);
            roomAdapter.getInternalRoomRolesByUserId.resolves(['owner']);
            userAdapter.getFederatedUserByInternalId
                .onSecondCall()
                .resolves({ getInternalId: () => 'internalTargetUserId', getExternalId: () => 'externalTargetUserId' });
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.setRoomPowerLevels.resolves();
            yield service.onRoomOwnerAdded('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.calledWith(bridge.setRoomPowerLevels, room.getExternalId(), user.getExternalId(), 'externalTargetUserId', MatrixPowerLevels_1.MATRIX_POWER_LEVELS.ADMIN);
        }));
        it('should set the user power level in the room when the user is an owner giving an ownership to himself', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getInternalRoomRolesByUserId.resolves(['owner']);
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.setRoomPowerLevels.resolves();
            yield service.onRoomOwnerAdded('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.calledWith(bridge.setRoomPowerLevels, room.getExternalId(), user.getExternalId(), user.getExternalId(), MatrixPowerLevels_1.MATRIX_POWER_LEVELS.ADMIN);
        }));
        it('should roll back the role change if some error happens in the set power level remotely', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getInternalRoomRolesByUserId.resolves(['owner']);
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.setRoomPowerLevels.rejects();
            yield service.onRoomOwnerAdded('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.calledWith(roomAdapter.applyRoomRolesToUser, {
                federatedRoom: room,
                targetFederatedUser: user,
                fromUser: user,
                rolesToAdd: [],
                rolesToRemove: ['owner'],
                notifyChannel: false,
            });
            sinon_1.default.assert.calledWith(notificationsAdapter.notifyWithEphemeralMessage, 'Federation_Matrix_error_applying_room_roles', user.getInternalId(), room.getInternalId());
        }));
    });
    describe('#onRoomOwnerRemoved()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: true,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT set the user power level in the room if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            yield service.onRoomOwnerRemoved('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should NOT set the user power level in the room if the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            yield service.onRoomOwnerRemoved('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should NOT set the user power level in the room if the target user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(user);
            userAdapter.getFederatedUserByInternalId.onSecondCall().resolves(undefined);
            yield service.onRoomOwnerRemoved('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should throw an error if the user is trying to make the target user (not himself) an owner, but he is not an owner', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            roomAdapter.getInternalRoomRolesByUserId.resolves([]);
            userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(user);
            userAdapter.getFederatedUserByInternalId.onSecondCall().resolves({ getInternalId: () => 'internalTargetUserId' });
            yield (0, chai_1.expect)(service.onRoomOwnerRemoved('internalUserId', 'internalTargetUserId', 'internalRoomId')).to.be.rejectedWith('Federation_Matrix_not_allowed_to_change_owner');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should NOT set the user power level in the room if the user is not from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(user);
            roomAdapter.getInternalRoomRolesByUserId.resolves(['owner']);
            userAdapter.getFederatedUserByInternalId.onSecondCall().resolves({ getInternalId: () => 'internalTargetUserId' });
            bridge.extractHomeserverOrigin.returns('externalDomain');
            yield service.onRoomOwnerRemoved('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should set the user power level in the room when everything is correct', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.setRoomPowerLevels.resolves();
            yield service.onRoomOwnerRemoved('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.calledWith(bridge.setRoomPowerLevels, room.getExternalId(), user.getExternalId(), user.getExternalId(), MatrixPowerLevels_1.MATRIX_POWER_LEVELS.USER);
        }));
        it('should roll back the role change if some error happens in the set power level remotely', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.setRoomPowerLevels.rejects();
            yield service.onRoomOwnerRemoved('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.calledWith(roomAdapter.applyRoomRolesToUser, {
                federatedRoom: room,
                targetFederatedUser: user,
                fromUser: user,
                rolesToAdd: ['owner'],
                rolesToRemove: [],
                notifyChannel: false,
            });
            sinon_1.default.assert.calledWith(notificationsAdapter.notifyWithEphemeralMessage, 'Federation_Matrix_error_applying_room_roles', user.getInternalId(), room.getInternalId());
        }));
    });
    describe('#onRoomModeratorAdded()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: true,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT set the user power level in the room if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            yield service.onRoomModeratorAdded('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should NOT set the user power level in the room if the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            yield service.onRoomModeratorAdded('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should NOT set the user power level in the room if the target user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(user);
            userAdapter.getFederatedUserByInternalId.onSecondCall().resolves(undefined);
            yield service.onRoomModeratorAdded('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should throw an error if the user is trying to make the target user (not himself) an owner, but he is not an owner nor a moderator', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            roomAdapter.getInternalRoomRolesByUserId.resolves([]);
            userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(user);
            userAdapter.getFederatedUserByInternalId.onSecondCall().resolves({ getInternalId: () => 'internalTargetUserId' });
            yield (0, chai_1.expect)(service.onRoomModeratorAdded('internalUserId', 'internalTargetUserId', 'internalRoomId')).to.be.rejectedWith('Federation_Matrix_not_allowed_to_change_moderator');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should NOT set the user power level in the room if the user is not from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(user);
            roomAdapter.getInternalRoomRolesByUserId.resolves(['owner']);
            userAdapter.getFederatedUserByInternalId.onSecondCall().resolves({ getInternalId: () => 'internalTargetUserId' });
            bridge.extractHomeserverOrigin.returns('externalDomain');
            yield service.onRoomModeratorAdded('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should set the user power level in the room when the user is an owner giving an ownership to someone else', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(user);
            roomAdapter.getInternalRoomRolesByUserId.resolves(['owner']);
            userAdapter.getFederatedUserByInternalId
                .onSecondCall()
                .resolves({ getInternalId: () => 'internalTargetUserId', getExternalId: () => 'externalTargetUserId' });
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.setRoomPowerLevels.resolves();
            yield service.onRoomModeratorAdded('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.calledWith(bridge.setRoomPowerLevels, room.getExternalId(), user.getExternalId(), 'externalTargetUserId', MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR);
        }));
        it('should set the user power level in the room when the user is a moderator giving an ownership to someone else', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(user);
            roomAdapter.getInternalRoomRolesByUserId.resolves(['moderator']);
            userAdapter.getFederatedUserByInternalId
                .onSecondCall()
                .resolves({ getInternalId: () => 'internalTargetUserId', getExternalId: () => 'externalTargetUserId' });
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.setRoomPowerLevels.resolves();
            yield service.onRoomModeratorAdded('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.calledWith(bridge.setRoomPowerLevels, room.getExternalId(), user.getExternalId(), 'externalTargetUserId', MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR);
        }));
        it('should set the user power level in the room when the user is an owner giving an ownership to himself', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getInternalRoomRolesByUserId.resolves(['owner']);
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.setRoomPowerLevels.resolves();
            yield service.onRoomModeratorAdded('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.calledWith(bridge.setRoomPowerLevels, room.getExternalId(), user.getExternalId(), user.getExternalId(), MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR);
        }));
        it('should roll back the role change if some error happens in the set power level remotely', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getInternalRoomRolesByUserId.resolves(['owner']);
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.setRoomPowerLevels.rejects();
            yield service.onRoomModeratorAdded('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.calledWith(roomAdapter.applyRoomRolesToUser, {
                federatedRoom: room,
                targetFederatedUser: user,
                fromUser: user,
                rolesToAdd: [],
                rolesToRemove: ['moderator'],
                notifyChannel: false,
            });
            sinon_1.default.assert.calledWith(notificationsAdapter.notifyWithEphemeralMessage, 'Federation_Matrix_error_applying_room_roles', user.getInternalId(), room.getInternalId());
        }));
    });
    describe('#onRoomModeratorRemoved()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: true,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT set the user power level in the room if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            yield service.onRoomModeratorRemoved('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should NOT set the user power level in the room if the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            yield service.onRoomModeratorRemoved('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should NOT set the user power level in the room if the target user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(user);
            userAdapter.getFederatedUserByInternalId.onSecondCall().resolves(undefined);
            yield service.onRoomModeratorRemoved('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should throw an error if the user is trying to make the target user (not himself) an owner, but he is not an owner nor a moderator', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            roomAdapter.getInternalRoomRolesByUserId.resolves([]);
            userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(user);
            userAdapter.getFederatedUserByInternalId.onSecondCall().resolves({ getInternalId: () => 'internalTargetUserId' });
            yield (0, chai_1.expect)(service.onRoomModeratorRemoved('internalUserId', 'internalTargetUserId', 'internalRoomId')).to.be.rejectedWith('Federation_Matrix_not_allowed_to_change_moderator');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should NOT set the user power level in the room if the user is not from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(user);
            roomAdapter.getInternalRoomRolesByUserId.resolves(['owner']);
            userAdapter.getFederatedUserByInternalId.onSecondCall().resolves({ getInternalId: () => 'internalTargetUserId' });
            bridge.extractHomeserverOrigin.returns('externalDomain');
            yield service.onRoomModeratorRemoved('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.notCalled(bridge.setRoomPowerLevels);
        }));
        it('should set the user power level in the room when everything is correct', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            roomAdapter.getInternalRoomRolesByUserId.resolves(['owner']);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.setRoomPowerLevels.resolves();
            yield service.onRoomModeratorRemoved('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.calledWith(bridge.setRoomPowerLevels, room.getExternalId(), user.getExternalId(), user.getExternalId(), MatrixPowerLevels_1.MATRIX_POWER_LEVELS.USER);
        }));
        it('should roll back the role change if some error happens in the set power level remotely', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getInternalRoomRolesByUserId.resolves(['owner']);
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.setRoomPowerLevels.rejects();
            yield service.onRoomModeratorRemoved('internalUserId', 'internalTargetUserId', 'internalRoomId');
            sinon_1.default.assert.calledWith(roomAdapter.applyRoomRolesToUser, {
                federatedRoom: room,
                targetFederatedUser: user,
                fromUser: user,
                rolesToAdd: ['moderator'],
                rolesToRemove: [],
                notifyChannel: false,
            });
            sinon_1.default.assert.calledWith(notificationsAdapter.notifyWithEphemeralMessage, 'Federation_Matrix_error_applying_room_roles', user.getInternalId(), room.getInternalId());
        }));
    });
    describe('#afterRoomNameChanged()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: true,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should not change the room remotely if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            yield service.afterRoomNameChanged('internalRoomId', 'internalRoomName');
            (0, chai_1.expect)(bridge.setRoomName.called).to.be.false;
            (0, chai_1.expect)(bridge.getRoomName.called).to.be.false;
        }));
        it('should not change the room remotely if the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            yield service.afterRoomNameChanged('internalRoomId', 'internalRoomName');
            (0, chai_1.expect)(bridge.setRoomName.called).to.be.false;
            (0, chai_1.expect)(bridge.getRoomName.called).to.be.false;
        }));
        it('should not change the room remotely if the room is not from the same home server', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('externalDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            yield service.afterRoomNameChanged('internalRoomId', 'internalRoomName');
            (0, chai_1.expect)(bridge.setRoomName.called).to.be.false;
            (0, chai_1.expect)(bridge.getRoomName.called).to.be.false;
        }));
        it('should not change the room remotely if the name is equal to the current name', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('localDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            bridge.getRoomName.resolves('externalRoomName');
            yield service.afterRoomNameChanged('internalRoomId', 'internalRoomName');
            (0, chai_1.expect)(bridge.setRoomName.called).to.be.false;
        }));
        it('should change the room name remotely if its different the current one', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('localDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            bridge.getRoomName.resolves('currentRoomName');
            yield service.afterRoomNameChanged('internalRoomId', 'internalRoomName');
            (0, chai_1.expect)(bridge.setRoomName.calledWith(room.getExternalId(), user.getExternalId(), 'internalRoomName')).to.be.true;
        }));
    });
    describe('#afterRoomTopicChanged()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: true,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should not change the room remotely if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            yield service.afterRoomTopicChanged('internalRoomId', 'internalRoomTopic');
            (0, chai_1.expect)(bridge.setRoomTopic.called).to.be.false;
            (0, chai_1.expect)(bridge.getRoomTopic.called).to.be.false;
        }));
        it('should not change the room remotely if the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            yield service.afterRoomTopicChanged('internalRoomId', 'internalRoomTopic');
            (0, chai_1.expect)(bridge.setRoomTopic.called).to.be.false;
            (0, chai_1.expect)(bridge.getRoomTopic.called).to.be.false;
        }));
        it('should not change the room remotely if the room is not from the same home server', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('externalDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            yield service.afterRoomTopicChanged('internalRoomId', 'internalRoomTopic');
            (0, chai_1.expect)(bridge.setRoomTopic.called).to.be.false;
            (0, chai_1.expect)(bridge.getRoomTopic.called).to.be.false;
        }));
        it('should not change the room remotely if the topic is equal to the current topic', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('localDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            bridge.getRoomTopic.resolves('internalRoomTopic');
            room.changeRoomTopic('internalRoomTopic');
            yield service.afterRoomTopicChanged('internalRoomId', 'internalRoomTopic');
            (0, chai_1.expect)(bridge.setRoomTopic.called).to.be.false;
        }));
        it('should change the room topic remotely if its different the current one', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('localDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            bridge.getRoomTopic.resolves('currentRoomTopic');
            yield service.afterRoomTopicChanged('internalRoomId', 'internalRoomTopic');
            (0, chai_1.expect)(bridge.setRoomTopic.calledWith(room.getExternalId(), user.getExternalId(), 'internalRoomTopic')).to.be.true;
        }));
    });
});
