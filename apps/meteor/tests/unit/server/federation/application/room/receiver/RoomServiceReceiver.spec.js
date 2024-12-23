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
const rooms_1 = require("@rocket.chat/apps-engine/definition/rooms");
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const IFederationBridge_1 = require("../../../../../../../server/services/federation/domain/IFederationBridge");
const { FederationRoomServiceReceiver } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../../server/services/federation/application/room/receiver/RoomServiceReceiver', {
    mongodb: {
        'ObjectId': class ObjectId {
            toHexString() {
                return 'hexString';
            }
        },
        '@global': true,
    },
});
const { FederatedUser } = proxyquire_1.default.noCallThru().load('../../../../../../../server/services/federation/domain/FederatedUser', {
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
describe('Federation - Application - FederationRoomServiceReceiver', () => {
    let service;
    const roomAdapter = {
        getFederatedRoomByExternalId: sinon_1.default.stub(),
        createFederatedRoom: sinon_1.default.stub(),
        createFederatedRoomForDirectMessage: sinon_1.default.stub(),
        removeDirectMessageRoom: sinon_1.default.stub(),
        removeUserFromRoom: sinon_1.default.stub(),
        addUserToRoom: sinon_1.default.stub(),
        isUserAlreadyJoined: sinon_1.default.stub(),
        getInternalRoomById: sinon_1.default.stub(),
        updateFederatedRoomByInternalRoomId: sinon_1.default.stub(),
        updateRoomType: sinon_1.default.stub(),
        updateRoomName: sinon_1.default.stub(),
        updateRoomTopic: sinon_1.default.stub(),
        applyRoomRolesToUser: sinon_1.default.stub(),
        updateDisplayRoomName: sinon_1.default.stub(),
        addUsersToRoomWhenJoinExternalPublicRoom: sinon_1.default.stub(),
    };
    const userAdapter = {
        getFederatedUserByExternalId: sinon_1.default.stub(),
        createFederatedUser: sinon_1.default.stub(),
        updateFederationAvatar: sinon_1.default.stub(),
        setAvatar: sinon_1.default.stub(),
        getInternalUserByUsername: sinon_1.default.stub(),
        updateRealName: sinon_1.default.stub(),
        getFederatedUsersByExternalIds: sinon_1.default.stub(),
    };
    const messageAdapter = {
        sendMessage: sinon_1.default.stub(),
        sendFileMessage: sinon_1.default.stub(),
        deleteMessage: sinon_1.default.stub(),
        getMessageByFederationId: sinon_1.default.stub(),
        editMessage: sinon_1.default.stub(),
        findOneByFederationIdOnReactions: sinon_1.default.stub(),
        unreactToMessage: sinon_1.default.stub(),
        sendQuoteMessage: sinon_1.default.stub(),
        sendQuoteFileMessage: sinon_1.default.stub(),
        editQuotedMessage: sinon_1.default.stub(),
        getMessageToEditWhenReplyAndQuote: sinon_1.default.stub(),
        sendThreadQuoteMessage: sinon_1.default.stub(),
        sendThreadMessage: sinon_1.default.stub(),
        sendThreadFileMessage: sinon_1.default.stub(),
        sendThreadQuoteFileMessage: sinon_1.default.stub(),
    };
    const settingsAdapter = {
        getHomeServerDomain: sinon_1.default.stub().returns('localDomain'),
    };
    const notificationsAdapter = {
        subscribeToUserTypingEventsOnFederatedRoomId: sinon_1.default.stub(),
        broadcastUserTypingOnRoom: sinon_1.default.stub(),
    };
    const fileAdapter = {
        uploadFile: sinon_1.default.stub(),
    };
    const queueInstance = {
        addToQueue: sinon_1.default.stub(),
    };
    const bridge = {
        getUserProfileInformation: sinon_1.default.stub().resolves({}),
        extractHomeserverOrigin: sinon_1.default.stub().returns('localDomain'),
        joinRoom: sinon_1.default.stub(),
        convertMatrixUrlToHttp: sinon_1.default.stub().returns('toHttpUrl'),
        getReadStreamForFileFromUrl: sinon_1.default.stub(),
        getRoomHistoricalJoinEvents: sinon_1.default.stub(),
        getRoomData: sinon_1.default.stub(),
    };
    beforeEach(() => {
        service = new FederationRoomServiceReceiver(roomAdapter, userAdapter, messageAdapter, fileAdapter, settingsAdapter, notificationsAdapter, queueInstance, bridge);
    });
    afterEach(() => {
        roomAdapter.getFederatedRoomByExternalId.reset();
        roomAdapter.createFederatedRoom.reset();
        roomAdapter.createFederatedRoomForDirectMessage.reset();
        roomAdapter.removeDirectMessageRoom.reset();
        roomAdapter.updateRoomType.reset();
        roomAdapter.updateRoomName.reset();
        roomAdapter.updateFederatedRoomByInternalRoomId.reset();
        roomAdapter.updateRoomTopic.reset();
        roomAdapter.removeUserFromRoom.reset();
        roomAdapter.isUserAlreadyJoined.reset();
        roomAdapter.addUsersToRoomWhenJoinExternalPublicRoom.reset();
        roomAdapter.getInternalRoomById.reset();
        roomAdapter.addUserToRoom.reset();
        roomAdapter.applyRoomRolesToUser.reset();
        roomAdapter.updateDisplayRoomName.reset();
        userAdapter.getFederatedUserByExternalId.reset();
        userAdapter.createFederatedUser.reset();
        userAdapter.updateFederationAvatar.reset();
        userAdapter.setAvatar.reset();
        userAdapter.getInternalUserByUsername.reset();
        userAdapter.updateRealName.reset();
        userAdapter.getFederatedUsersByExternalIds.reset();
        messageAdapter.sendMessage.reset();
        messageAdapter.sendFileMessage.reset();
        messageAdapter.deleteMessage.reset();
        messageAdapter.getMessageByFederationId.reset();
        messageAdapter.editMessage.reset();
        messageAdapter.unreactToMessage.reset();
        messageAdapter.findOneByFederationIdOnReactions.reset();
        messageAdapter.sendQuoteFileMessage.reset();
        messageAdapter.sendQuoteMessage.reset();
        messageAdapter.sendThreadQuoteMessage.reset();
        messageAdapter.sendThreadMessage.reset();
        messageAdapter.sendThreadFileMessage.reset();
        messageAdapter.sendThreadQuoteFileMessage.reset();
        bridge.extractHomeserverOrigin.reset();
        bridge.joinRoom.reset();
        bridge.getUserProfileInformation.reset();
        bridge.getReadStreamForFileFromUrl.reset();
        bridge.getRoomData.reset();
        bridge.getRoomHistoricalJoinEvents.reset();
        fileAdapter.uploadFile.reset();
        queueInstance.addToQueue.reset();
    });
    describe('#onCreateRoom()', () => {
        it('should NOT create users nor room if the room already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves({});
            yield service.onCreateRoom({});
            (0, chai_1.expect)(roomAdapter.createFederatedRoom.called).to.be.false;
            (0, chai_1.expect)(userAdapter.createFederatedUser.called).to.be.false;
        }));
        it('should NOT create users nor room if the room was created internally and programatically even if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            yield service.onCreateRoom({ wasInternallyProgramaticallyCreated: true });
            (0, chai_1.expect)(roomAdapter.createFederatedRoom.called).to.be.false;
            (0, chai_1.expect)(userAdapter.createFederatedUser.called).to.be.false;
        }));
        it('should NOT update the room if it was created internally and programatically but it is not a DM message and dont create the room', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            roomAdapter.getInternalRoomById.resolves({ t: 'c' });
            yield service.onCreateRoom({ wasInternallyProgramaticallyCreated: true });
            (0, chai_1.expect)(roomAdapter.updateFederatedRoomByInternalRoomId.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.createFederatedRoom.called).to.be.false;
            (0, chai_1.expect)(userAdapter.createFederatedUser.called).to.be.false;
        }));
        it('should NOT update the room if it was created internally and programatically but it does not exists and dont create the room', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            roomAdapter.getInternalRoomById.resolves(undefined);
            yield service.onCreateRoom({ wasInternallyProgramaticallyCreated: true });
            (0, chai_1.expect)(roomAdapter.updateFederatedRoomByInternalRoomId.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.createFederatedRoom.called).to.be.false;
            (0, chai_1.expect)(userAdapter.createFederatedUser.called).to.be.false;
        }));
        it('should update the room if it was created internally and programatically but it is a DM message but it should NOT create a new DM Room(this is necessary due to a race condition on matrix events)', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            roomAdapter.getInternalRoomById.resolves({ t: 'd' });
            yield service.onCreateRoom({
                wasInternallyProgramaticallyCreated: true,
                internalRoomId: 'internalRoomId',
                externalRoomId: 'externalRoomId',
            });
            (0, chai_1.expect)(roomAdapter.updateFederatedRoomByInternalRoomId.calledWith('internalRoomId', 'externalRoomId')).to.be.true;
            (0, chai_1.expect)(roomAdapter.createFederatedRoom.called).to.be.false;
            (0, chai_1.expect)(userAdapter.createFederatedUser.called).to.be.false;
        }));
    });
    describe('#onChangeRoomMembership()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: false,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT process the method if the room already exists AND event origin is equal to LOCAL', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            yield service.onChangeRoomMembership({ externalRoomId: 'externalRoomId', eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL });
            (0, chai_1.expect)(userAdapter.createFederatedUser.called).to.be.false;
        }));
        it('should NOT process the method if the room already exists AND event origin is equal to REMOTE', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            yield service.onChangeRoomMembership({ externalRoomId: 'externalRoomId', eventOrigin: IFederationBridge_1.EVENT_ORIGIN.REMOTE });
            (0, chai_1.expect)(userAdapter.createFederatedUser.called).to.be.false;
        }));
        it('should NOT process the method logic if the event was generated on the proxy home server, it is NOT a join event (user joining himself), but the room does not exists yet', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            userAdapter.getFederatedUserByExternalId.onFirstCall().resolves(undefined);
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                externalInviterId: 'externalInviterId',
                externalInviteeId: 'externalInviteeId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
            });
            (0, chai_1.expect)(userAdapter.createFederatedUser.called).to.be.false;
        }));
        it('should NOT create the inviter if it already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            yield service.onChangeRoomMembership({ externalRoomId: 'externalRoomId', eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL });
            (0, chai_1.expect)(userAdapter.createFederatedUser.called).to.be.false;
        }));
        it('should create the inviter if it does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const inviter = FederatedUser.createInstance('externalInviterId', {
                name: 'inviterUsernameOnly',
                username: 'inviterUsernameOnly',
                existsOnlyOnProxyServer: true,
            });
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.onFirstCall().resolves(undefined);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            bridge.extractHomeserverOrigin.returns('localDomain');
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                externalInviterId: 'externalInviterId',
                normalizedInviterId: 'normalizedInviterId',
                inviterUsernameOnly: 'inviterUsernameOnly',
            });
            (0, chai_1.expect)(userAdapter.createFederatedUser.calledWith(inviter)).to.be.true;
        }));
        it('should NOT create the invitee if it already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            yield service.onChangeRoomMembership({ externalRoomId: 'externalRoomId', eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL });
            (0, chai_1.expect)(userAdapter.createFederatedUser.called).to.be.false;
        }));
        it('should create the invitee if it does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const invitee = FederatedUser.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: false,
            });
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(invitee);
            userAdapter.getFederatedUserByExternalId.onSecondCall().resolves(undefined);
            bridge.extractHomeserverOrigin.onCall(1).returns('externalDomain');
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                externalInviteeId: 'externalInviteeId',
                normalizedInviteeId: 'normalizedInviteeId',
            });
            (0, chai_1.expect)(userAdapter.createFederatedUser.calledWith(invitee)).to.be.true;
        }));
        it('should throw an error if the invitee user does not exists at all', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(undefined);
            yield (0, chai_1.expect)(service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                externalInviteeId: 'externalInviteeId',
                normalizedInviteeId: 'normalizedInviteeId',
            })).to.be.rejectedWith('Invitee or inviter user not found');
        }));
        it('should throw an error if the inviter user does not exists at all', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(undefined);
            yield (0, chai_1.expect)(service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                externalInviteeId: 'externalInviteeId',
                normalizedInviteeId: 'normalizedInviteeId',
            })).to.be.rejectedWith('Invitee or inviter user not found');
        }));
        it('should NOT create the room if it does not exists yet AND the event origin is REMOTE but there is no room type on the event', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.onCall(0).resolves(undefined);
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.REMOTE,
                roomType: undefined,
                externalInviteeId: 'externalInviteeId',
                normalizedInviteeId: 'normalizedInviteeId',
            });
            (0, chai_1.expect)(roomAdapter.createFederatedRoom.called).to.be.false;
        }));
        it('should create a room for DM if the room type is equal a direct message and it is handling regular events (m.room.member)(not using the property extracted from the invite_room_state)', () => __awaiter(void 0, void 0, void 0, function* () {
            const inviter = user;
            const invitee = FederatedUser.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: false,
            });
            roomAdapter.getFederatedRoomByExternalId.onCall(0).resolves(undefined);
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.onCall(0).resolves(inviter);
            userAdapter.getFederatedUserByExternalId.resolves(invitee);
            bridge.extractHomeserverOrigin.returns('localDomain');
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.REMOTE,
                roomType: rooms_1.RoomType.DIRECT_MESSAGE,
                externalInviteeId: 'externalInviteeId',
                normalizedInviteeId: 'normalizedInviteeId',
            });
            const createdRoom = DirectMessageFederatedRoom.createInstance('externalRoomId', inviter, [inviter, invitee]);
            (0, chai_1.expect)(roomAdapter.createFederatedRoomForDirectMessage.calledWith(createdRoom)).to.be.true;
            (0, chai_1.expect)(roomAdapter.createFederatedRoom.called).to.be.false;
            (0, chai_1.expect)(bridge.joinRoom.calledOnceWith('externalRoomId', 'externalInviteeId')).to.be.true;
        }));
        it('should create a room for DM if the room type is equal a direct message and it is handling regular events (m.room.member)(not using the property extracted from the invite_room_state), but not automatically join the invitee if he/she is not from the proxy homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            const inviter = user;
            const invitee = FederatedUser.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: false,
            });
            roomAdapter.getFederatedRoomByExternalId.onCall(0).resolves(undefined);
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.onCall(0).resolves(inviter);
            userAdapter.getFederatedUserByExternalId.resolves(invitee);
            bridge.extractHomeserverOrigin.returns('externalDomain');
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.REMOTE,
                roomType: rooms_1.RoomType.DIRECT_MESSAGE,
                externalInviteeId: 'externalInviteeId',
                normalizedInviteeId: 'normalizedInviteeId',
            });
            const createdRoom = DirectMessageFederatedRoom.createInstance('externalRoomId', inviter, [inviter, invitee]);
            (0, chai_1.expect)(roomAdapter.createFederatedRoomForDirectMessage.calledWith(createdRoom)).to.be.true;
            (0, chai_1.expect)(roomAdapter.createFederatedRoom.called).to.be.false;
            (0, chai_1.expect)(bridge.joinRoom.called).to.be.false;
        }));
        it('should create a room for DM if the room type is equal a direct message handling the property extracted from the invite_room_state', () => __awaiter(void 0, void 0, void 0, function* () {
            const inviter = user;
            const invitee = FederatedUser.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: false,
            });
            roomAdapter.getFederatedRoomByExternalId.onCall(0).resolves(undefined);
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.onCall(0).resolves(inviter);
            userAdapter.getFederatedUserByExternalId.resolves(invitee);
            bridge.extractHomeserverOrigin.returns('localDomain');
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.REMOTE,
                roomType: rooms_1.RoomType.DIRECT_MESSAGE,
                externalInviteeId: 'externalInviteeId',
                normalizedInviteeId: 'normalizedInviteeId',
                allInviteesExternalIdsWhenDM: [
                    {
                        externalInviteeId: 'externalInviteeId',
                        normalizedInviteeId: 'normalizedInviteeId',
                        inviteeUsernameOnly: 'inviteeUsernameOnly',
                    },
                ],
            });
            const createdRoom = DirectMessageFederatedRoom.createInstance('externalRoomId', inviter, [inviter, invitee]);
            (0, chai_1.expect)(roomAdapter.createFederatedRoomForDirectMessage.calledWith(createdRoom)).to.be.true;
            (0, chai_1.expect)(roomAdapter.createFederatedRoom.called).to.be.false;
            (0, chai_1.expect)(bridge.joinRoom.calledOnceWith('externalRoomId', 'externalInviteeId')).to.be.true;
        }));
        it('should create a room for DM if the room type is equal a direct message handling the property extracted from the invite_room_state, but not automatically join the user if he/she is not from the proxy homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            const inviter = user;
            const invitee = FederatedUser.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: false,
            });
            roomAdapter.getFederatedRoomByExternalId.onCall(0).resolves(undefined);
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.onCall(0).resolves(inviter);
            userAdapter.getFederatedUserByExternalId.resolves(invitee);
            bridge.extractHomeserverOrigin.returns('externalDomain');
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.REMOTE,
                roomType: rooms_1.RoomType.DIRECT_MESSAGE,
                externalInviteeId: 'externalInviteeId',
                normalizedInviteeId: 'normalizedInviteeId',
                allInviteesExternalIdsWhenDM: [
                    {
                        externalInviteeId: 'externalInviteeId',
                        normalizedInviteeId: 'normalizedInviteeId',
                        inviteeUsernameOnly: 'inviteeUsernameOnly',
                    },
                ],
            });
            const createdRoom = DirectMessageFederatedRoom.createInstance('externalRoomId', inviter, [inviter, invitee]);
            (0, chai_1.expect)(roomAdapter.createFederatedRoomForDirectMessage.calledWith(createdRoom)).to.be.true;
            (0, chai_1.expect)(roomAdapter.createFederatedRoom.called).to.be.false;
            (0, chai_1.expect)(bridge.joinRoom.called).to.be.false;
        }));
        it('should create a room (not DM) if the room type is NOT equal a direct message AND to add the historical room events to the processing queue when they exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const invitee = FederatedUser.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: false,
            });
            roomAdapter.getFederatedRoomByExternalId.onCall(0).resolves(undefined);
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(invitee);
            bridge.getRoomHistoricalJoinEvents.resolves(['event1', 'event2']);
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.REMOTE,
                roomType: rooms_1.RoomType.CHANNEL,
                externalInviteeId: 'externalInviteeId',
                normalizedInviteeId: 'normalizedInviteeId',
                externalRoomName: 'externalRoomName',
            });
            const createdRoom = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', invitee, rooms_1.RoomType.CHANNEL);
            (0, chai_1.expect)(roomAdapter.createFederatedRoom.calledWith(createdRoom)).to.be.true;
            (0, chai_1.expect)(roomAdapter.createFederatedRoomForDirectMessage.called).to.be.false;
            (0, chai_1.expect)(bridge.joinRoom.calledWith('externalRoomId', 'externalInviteeId')).to.be.true;
            ['event1', 'event2'].forEach((event) => (0, chai_1.expect)(queueInstance.addToQueue.calledWith(event)).to.be.true);
        }));
        it('should create a room (not DM) if the room type is NOT equal a direct message AND NOT to add the historical room events to the processing queue when they exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const invitee = FederatedUser.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: false,
            });
            roomAdapter.getFederatedRoomByExternalId.onCall(0).resolves(undefined);
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(invitee);
            bridge.getRoomHistoricalJoinEvents.resolves([]);
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.REMOTE,
                roomType: rooms_1.RoomType.CHANNEL,
                externalInviteeId: 'externalInviteeId',
                normalizedInviteeId: 'normalizedInviteeId',
                externalRoomName: 'externalRoomName',
            });
            const createdRoom = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', invitee, rooms_1.RoomType.CHANNEL);
            (0, chai_1.expect)(roomAdapter.createFederatedRoom.calledWith(createdRoom)).to.be.true;
            (0, chai_1.expect)(roomAdapter.createFederatedRoomForDirectMessage.called).to.be.false;
            (0, chai_1.expect)(bridge.joinRoom.calledWith('externalRoomId', 'externalInviteeId')).to.be.true;
            (0, chai_1.expect)(queueInstance.addToQueue.called).to.be.false;
        }));
        it('should call the update name function if the name is inside the received input', () => __awaiter(void 0, void 0, void 0, function* () {
            const invitee = FederatedUser.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: false,
            });
            roomAdapter.getFederatedRoomByExternalId.onCall(0).resolves(undefined);
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(invitee);
            bridge.getRoomHistoricalJoinEvents.resolves([]);
            const spy = sinon_1.default.spy(service, 'onChangeRoomName');
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.REMOTE,
                roomType: rooms_1.RoomType.CHANNEL,
                externalInviteeId: 'externalInviteeId',
                normalizedInviteeId: 'normalizedInviteeId',
                externalRoomName: 'externalRoomName',
                externalEventId: 'externalEventId',
                externalInviterId: 'externalInviterId',
            });
            (0, chai_1.expect)(spy.calledWith({
                externalRoomId: 'externalRoomId',
                normalizedRoomName: 'externalRoomName',
                externalEventId: 'externalEventId',
                externalSenderId: 'externalInviterId',
                normalizedRoomId: 'normalizedRoomId',
            })).to.be.true;
        }));
        it('should NOT create the room if it already exists yet AND the event origin is REMOTE', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.REMOTE,
                roomType: rooms_1.RoomType.CHANNEL,
                externalInviteeId: 'externalInviteeId',
                normalizedInviteeId: 'normalizedInviteeId',
            });
            (0, chai_1.expect)(roomAdapter.createFederatedRoom.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.createFederatedRoomForDirectMessage.called).to.be.false;
            (0, chai_1.expect)(bridge.joinRoom.called).to.be.false;
        }));
        it('should remove the user from room if its a LEAVE event and the user is in the room already', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            roomAdapter.isUserAlreadyJoined.resolves(true);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                roomType: rooms_1.RoomType.CHANNEL,
                externalInviteeId: 'externalInviteeId',
                leave: true,
                normalizedInviteeId: 'normalizedInviteeId',
            });
            (0, chai_1.expect)(roomAdapter.removeUserFromRoom.calledWith(room, user, user)).to.be.true;
            (0, chai_1.expect)(roomAdapter.addUserToRoom.called).to.be.false;
        }));
        it('should NOT remove the user from room if its a LEAVE event and the user is NOT in the room anymore', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            roomAdapter.isUserAlreadyJoined.resolves(false);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                roomType: rooms_1.RoomType.CHANNEL,
                externalInviteeId: 'externalInviteeId',
                leave: true,
                normalizedInviteeId: 'normalizedInviteeId',
            });
            (0, chai_1.expect)(roomAdapter.removeUserFromRoom.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.addUserToRoom.called).to.be.false;
        }));
        it('should NOT remove and recreate the DM room if the user is already part of the room (in case of being a multiple DM, Matrix send events for each user at a time, which requires us to remove and recreate the DM room)', () => __awaiter(void 0, void 0, void 0, function* () {
            const dmRoom = DirectMessageFederatedRoom.createWithInternalReference('externalRoomId', { usernames: [user.getUsername()] }, [user, user]);
            roomAdapter.getFederatedRoomByExternalId.resolves(dmRoom);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.REMOTE,
                roomType: rooms_1.RoomType.DIRECT_MESSAGE,
                externalInviteeId: 'externalInviteeId',
                normalizedInviteeId: 'normalizedInviteeId',
            });
            (0, chai_1.expect)(roomAdapter.removeDirectMessageRoom.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.createFederatedRoomForDirectMessage.called).to.be.false;
        }));
        it('should remove and recreate the DM room if the user is part of the room yet (in case of being a multiple DM, Matrix send events for each user at a time, which requires us to remove and recreate the DM room)', () => __awaiter(void 0, void 0, void 0, function* () {
            const dmRoom = DirectMessageFederatedRoom.createWithInternalReference('externalRoomId', { usernames: [] }, [user, user]);
            const invitee = FederatedUser.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: false,
            });
            roomAdapter.getFederatedRoomByExternalId.resolves(dmRoom);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            userAdapter.getFederatedUserByExternalId.onCall(1).resolves(invitee);
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.REMOTE,
                roomType: rooms_1.RoomType.DIRECT_MESSAGE,
                externalInviteeId: 'externalInviteeId',
                normalizedInviteeId: 'normalizedInviteeId',
            });
            const createdRoom = DirectMessageFederatedRoom.createInstance('externalRoomId', user, [user, user, invitee]);
            (0, chai_1.expect)(roomAdapter.removeDirectMessageRoom.calledWith(dmRoom)).to.be.true;
            (0, chai_1.expect)(roomAdapter.createFederatedRoomForDirectMessage.calledWith(createdRoom)).to.be.true;
            (0, chai_1.expect)(roomAdapter.addUserToRoom.called).to.be.false;
        }));
        it('should NOT add the user to the room if its NOT a LEAVE event but the user is already in the room', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            roomAdapter.isUserAlreadyJoined.resolves(true);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                roomType: rooms_1.RoomType.CHANNEL,
                externalInviteeId: 'externalInviteeId',
                leave: false,
                normalizedInviteeId: 'normalizedInviteeId',
            });
            (0, chai_1.expect)(roomAdapter.removeUserFromRoom.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.removeDirectMessageRoom.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.createFederatedRoomForDirectMessage.called).to.be.false;
            (0, chai_1.expect)(bridge.joinRoom.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.addUserToRoom.called).to.be.false;
        }));
        it('should add the user into the room if its NOT a LEAVE event providing the inviter when the user is NOT joining by himself', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.REMOTE,
                roomType: rooms_1.RoomType.CHANNEL,
                externalInviteeId: 'externalInviteeId',
                leave: false,
                normalizedInviteeId: 'normalizedInviteeId',
            });
            (0, chai_1.expect)(roomAdapter.removeUserFromRoom.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.removeDirectMessageRoom.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.createFederatedRoomForDirectMessage.called).to.be.false;
            (0, chai_1.expect)(bridge.joinRoom.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.addUserToRoom.calledWith(room, user, user)).to.be.true;
        }));
        it('should join the room using the bridge if its NOT a leave event AND the invitee is from the proxy home server', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            bridge.extractHomeserverOrigin.returns('localDomain');
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                roomType: rooms_1.RoomType.CHANNEL,
                externalInviteeId: 'externalInviteeId',
                leave: false,
                normalizedInviteeId: 'normalizedInviteeId',
            });
            (0, chai_1.expect)(roomAdapter.addUserToRoom.calledWith(room, user, user)).to.be.true;
            (0, chai_1.expect)(bridge.joinRoom.calledWith('externalRoomId', 'externalInviteeId')).to.be.true;
        }));
        it('should NOT join the room using the bridge if its NOT a leave event AND the invitee is NOT from the proxy home server', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            bridge.extractHomeserverOrigin.returns('externalDomain');
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                roomType: rooms_1.RoomType.CHANNEL,
                externalInviteeId: 'externalInviteeId',
                leave: false,
                normalizedInviteeId: 'normalizedInviteeId',
            });
            (0, chai_1.expect)(roomAdapter.addUserToRoom.calledWith(room, user, user)).to.be.true;
            (0, chai_1.expect)(bridge.joinRoom.called).to.be.false;
        }));
        it('should add the user into the room if its NOT a LEAVE event NOT providing the inviter when the user is joining by himself', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            yield service.onChangeRoomMembership({
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.REMOTE,
                roomType: rooms_1.RoomType.CHANNEL,
                externalInviteeId: 'externalInviteeId',
                externalInviterId: 'externalInviteeId',
                leave: false,
                normalizedInviteeId: 'normalizedInviteeId',
            });
            (0, chai_1.expect)(roomAdapter.removeUserFromRoom.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.removeDirectMessageRoom.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.createFederatedRoomForDirectMessage.called).to.be.false;
            (0, chai_1.expect)(bridge.joinRoom.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.addUserToRoom.calledWith(room, user)).to.be.true;
        }));
        describe('Handling users auto-joining', () => {
            it('should subscribe to the typings events if the room already exists', () => __awaiter(void 0, void 0, void 0, function* () {
                roomAdapter.getFederatedRoomByExternalId.resolves(room);
                userAdapter.getFederatedUserByExternalId.resolves(user);
                yield service.onChangeRoomMembership({
                    externalRoomId: 'externalRoomId',
                    normalizedRoomId: 'normalizedRoomId',
                    eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                    roomType: rooms_1.RoomType.CHANNEL,
                    externalInviteeId: 'externalInviteeId',
                    externalInviterId: 'externalInviteeId',
                    leave: false,
                    normalizedInviteeId: 'normalizedInviteeId',
                });
                (0, chai_1.expect)(notificationsAdapter.subscribeToUserTypingEventsOnFederatedRoomId.called).to.be.true;
            }));
            it('should NOT add the user to the room if the user is already a room member', () => __awaiter(void 0, void 0, void 0, function* () {
                roomAdapter.getFederatedRoomByExternalId.resolves(room);
                userAdapter.getFederatedUserByExternalId.resolves(user);
                roomAdapter.isUserAlreadyJoined.resolves(true);
                yield service.onChangeRoomMembership({
                    externalRoomId: 'externalRoomId',
                    normalizedRoomId: 'normalizedRoomId',
                    eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                    roomType: rooms_1.RoomType.CHANNEL,
                    externalInviteeId: 'externalInviteeId',
                    externalInviterId: 'externalInviteeId',
                    leave: false,
                    normalizedInviteeId: 'normalizedInviteeId',
                });
                (0, chai_1.expect)(roomAdapter.addUserToRoom.called).to.be.false;
            }));
            it('should add the user to the room if the user is NOT a room member yet', () => __awaiter(void 0, void 0, void 0, function* () {
                roomAdapter.getFederatedRoomByExternalId.resolves(room);
                userAdapter.getFederatedUserByExternalId.resolves(user);
                roomAdapter.isUserAlreadyJoined.resolves(false);
                yield service.onChangeRoomMembership({
                    externalRoomId: 'externalRoomId',
                    normalizedRoomId: 'normalizedRoomId',
                    eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                    roomType: rooms_1.RoomType.CHANNEL,
                    externalInviteeId: 'externalInviteeId',
                    externalInviterId: 'externalInviteeId',
                    leave: false,
                    normalizedInviteeId: 'normalizedInviteeId',
                });
                (0, chai_1.expect)(roomAdapter.addUserToRoom.calledWith(room, user)).to.be.true;
            }));
            it('should NOT create the room if it was not possible to retrieve the information from the room from the bridge', () => __awaiter(void 0, void 0, void 0, function* () {
                roomAdapter.getFederatedRoomByExternalId.onCall(0).resolves(room);
                roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
                userAdapter.getFederatedUserByExternalId.resolves(user);
                roomAdapter.isUserAlreadyJoined.resolves(false);
                bridge.getRoomData.resolves(undefined);
                yield service.onChangeRoomMembership({
                    externalRoomId: 'externalRoomId',
                    normalizedRoomId: 'normalizedRoomId',
                    eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                    roomType: rooms_1.RoomType.CHANNEL,
                    externalInviteeId: 'externalInviteeId',
                    externalInviterId: 'externalInviteeId',
                    leave: false,
                    normalizedInviteeId: 'normalizedInviteeId',
                });
                (0, chai_1.expect)(roomAdapter.createFederatedRoom.called).to.be.false;
            }));
            it('should NOT create the room if it there is already a room creation process already running', () => __awaiter(void 0, void 0, void 0, function* () {
                roomAdapter.getFederatedRoomByExternalId.onCall(0).resolves(room);
                roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
                userAdapter.getFederatedUserByExternalId.resolves(user);
                roomAdapter.isUserAlreadyJoined.resolves(false);
                bridge.getRoomData.resolves({ creator: {} });
                yield service.onChangeRoomMembership({
                    externalRoomId: 'externalRoomId',
                    normalizedRoomId: 'normalizedRoomId',
                    eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                    roomType: rooms_1.RoomType.CHANNEL,
                    externalInviteeId: 'externalInviteeId',
                    externalInviterId: 'externalInviteeId',
                    leave: false,
                    normalizedInviteeId: 'normalizedInviteeId',
                });
                (0, chai_1.expect)(roomAdapter.createFederatedRoom.called).to.be.false;
            }));
            it('should create the creator user only if it does not exists yet and use the provided username if its from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
                const spy = sinon_1.default.spy(service, 'createFederatedUserInternallyOnly');
                roomAdapter.getFederatedRoomByExternalId.onCall(0).resolves(room);
                userAdapter.getFederatedUserByExternalId.onCall(0).resolves(user);
                userAdapter.getFederatedUserByExternalId.onCall(1).resolves(user);
                userAdapter.getFederatedUserByExternalId.onCall(2).resolves(undefined);
                userAdapter.getFederatedUserByExternalId.onCall(3).resolves(undefined);
                bridge.getRoomData.resolves({ creator: { id: 'creatorId', username: 'creatorUsername' } });
                bridge.extractHomeserverOrigin.returns('localDomain');
                yield service.onChangeRoomMembership({
                    externalRoomId: 'externalRoomId',
                    normalizedRoomId: 'normalizedRoomId',
                    eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                    roomType: rooms_1.RoomType.CHANNEL,
                    externalInviteeId: 'externalInviteeId',
                    externalInviterId: 'externalInviteeId',
                    leave: false,
                    normalizedInviteeId: 'normalizedInviteeId',
                });
                const existsOnlyOnProxyServer = true;
                (0, chai_1.expect)(spy.calledWith('creatorId', 'creatorUsername', existsOnlyOnProxyServer)).to.be.true;
            }));
            it('should create the creator user if it does not exists yet and use the external id as username if its not from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
                const spy = sinon_1.default.spy(service, 'createFederatedUserInternallyOnly');
                roomAdapter.getFederatedRoomByExternalId.onCall(0).resolves(room);
                userAdapter.getFederatedUserByExternalId.onCall(0).resolves(user);
                userAdapter.getFederatedUserByExternalId.onCall(1).resolves(user);
                userAdapter.getFederatedUserByExternalId.onCall(2).resolves(undefined);
                userAdapter.getFederatedUserByExternalId.onCall(3).resolves(undefined);
                bridge.getRoomData.resolves({ creator: { id: '@creatorId:externalserver.com', username: 'creatorUsername' } });
                bridge.extractHomeserverOrigin.returns('externalDomain');
                yield service.onChangeRoomMembership({
                    externalRoomId: 'externalRoomId',
                    normalizedRoomId: 'normalizedRoomId',
                    eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                    roomType: rooms_1.RoomType.CHANNEL,
                    externalInviteeId: 'externalInviteeId',
                    externalInviterId: 'externalInviteeId',
                    leave: false,
                    normalizedInviteeId: 'normalizedInviteeId',
                });
                const existsOnlyOnProxyServer = false;
                (0, chai_1.expect)(spy.calledWith('@creatorId:externalserver.com', 'creatorId:externalserver.com', existsOnlyOnProxyServer)).to.be.true;
            }));
            it('should NOT create the room if the creator does not exists nor was created successfully previously', () => __awaiter(void 0, void 0, void 0, function* () {
                sinon_1.default.stub(service, 'createFederatedUserAndReturnIt').resolves();
                roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
                userAdapter.getFederatedUserByExternalId.onCall(0).resolves(user);
                userAdapter.getFederatedUserByExternalId.onCall(1).resolves(user);
                userAdapter.getFederatedUserByExternalId.onCall(2).resolves(undefined);
                bridge.getRoomData.resolves({ creator: { id: '@creatorId:externalserver.com', username: 'creatorUsername' } });
                bridge.extractHomeserverOrigin.returns('externalDomain');
                yield service.onChangeRoomMembership({
                    externalRoomId: 'externalRoomId',
                    normalizedRoomId: 'normalizedRoomId',
                    eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                    roomType: rooms_1.RoomType.CHANNEL,
                    externalInviteeId: 'externalInviteeId',
                    externalInviterId: 'externalInviteeId',
                    leave: false,
                    normalizedInviteeId: 'normalizedInviteeId',
                });
                (0, chai_1.expect)(roomAdapter.createFederatedRoom.called).to.be.false;
            }));
            it('should create the room using the external room name if its original from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
                sinon_1.default.stub(service, 'createFederatedUserAndReturnIt').resolves();
                roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
                userAdapter.getFederatedUserByExternalId.onCall(0).resolves(user);
                userAdapter.getFederatedUserByExternalId.onCall(1).resolves(user);
                userAdapter.getFederatedUserByExternalId.onCall(2).resolves(undefined);
                userAdapter.getFederatedUserByExternalId.onCall(3).resolves(user);
                bridge.getRoomData.resolves({ name: 'roomName', creator: { id: '@creatorId:externalserver.com', username: 'creatorUsername' } });
                bridge.extractHomeserverOrigin.returns('localDomain');
                yield service.onChangeRoomMembership({
                    externalRoomId: 'externalRoomId',
                    normalizedRoomId: 'normalizedRoomId',
                    eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                    roomType: rooms_1.RoomType.CHANNEL,
                    externalInviteeId: 'externalInviteeId',
                    externalInviterId: 'externalInviteeId',
                    leave: false,
                    normalizedInviteeId: 'normalizedInviteeId',
                });
                (0, chai_1.expect)(roomAdapter.createFederatedRoom.calledWith(FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'roomName'))).to.be.true;
            }));
            it('should create the room using nothing if its not original from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
                sinon_1.default.stub(service, 'createFederatedUserAndReturnIt').resolves();
                roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
                userAdapter.getFederatedUserByExternalId.onCall(0).resolves(user);
                userAdapter.getFederatedUserByExternalId.onCall(1).resolves(user);
                userAdapter.getFederatedUserByExternalId.onCall(2).resolves(undefined);
                userAdapter.getFederatedUserByExternalId.onCall(3).resolves(user);
                bridge.getRoomData.resolves({ name: 'roomName', creator: { id: '@creatorId:externalserver.com', username: 'creatorUsername' } });
                bridge.extractHomeserverOrigin.returns('externalDomain');
                yield service.onChangeRoomMembership({
                    externalRoomId: 'externalRoomId',
                    normalizedRoomId: 'normalizedRoomId',
                    eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                    roomType: rooms_1.RoomType.CHANNEL,
                    externalInviteeId: 'externalInviteeId',
                    externalInviterId: 'externalInviteeId',
                    leave: false,
                    normalizedInviteeId: 'normalizedInviteeId',
                });
                (0, chai_1.expect)(roomAdapter.createFederatedRoom.calledWith(FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, undefined))).to.be.true;
            }));
            it('should dispatch a room name event if its not from the same homeserver and it was possible to retrieve the name from the bridge query', () => __awaiter(void 0, void 0, void 0, function* () {
                const spy = sinon_1.default.spy(service, 'onChangeRoomName');
                sinon_1.default.stub(service, 'createFederatedUserAndReturnIt').resolves();
                roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
                userAdapter.getFederatedUserByExternalId.onCall(0).resolves(user);
                userAdapter.getFederatedUserByExternalId.onCall(1).resolves(user);
                userAdapter.getFederatedUserByExternalId.onCall(2).resolves(undefined);
                userAdapter.getFederatedUserByExternalId.onCall(3).resolves(user);
                roomAdapter.createFederatedRoom.resolves();
                bridge.getRoomData.resolves({ name: 'roomName', creator: { id: '@creatorId:externalserver.com', username: 'creatorUsername' } });
                bridge.extractHomeserverOrigin.returns('externalDomain');
                yield service.onChangeRoomMembership({
                    externalRoomId: 'externalRoomId',
                    normalizedRoomId: 'normalizedRoomId',
                    eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                    roomType: rooms_1.RoomType.CHANNEL,
                    externalInviteeId: 'externalInviteeId',
                    externalInviterId: 'externalInviteeId',
                    leave: false,
                    normalizedInviteeId: 'normalizedInviteeId',
                });
                (0, chai_1.expect)(spy.calledWith({
                    externalRoomId: 'externalRoomId',
                    normalizedRoomName: 'roomName',
                    externalEventId: '',
                    externalSenderId: user.getExternalId(),
                    normalizedRoomId: 'normalizedRoomId',
                })).to.be.true;
            }));
            it('should create federated users for each member of the room excluding the one joining and the creator, and add them to the room ', () => __awaiter(void 0, void 0, void 0, function* () {
                const stub = sinon_1.default.stub(service, 'createFederatedUserAndReturnIt');
                roomAdapter.getFederatedRoomByExternalId.onCall(0).resolves(undefined);
                roomAdapter.getFederatedRoomByExternalId.onCall(1).resolves(undefined);
                roomAdapter.getFederatedRoomByExternalId.onCall(2).resolves(room);
                userAdapter.getFederatedUserByExternalId.onCall(0).resolves(user);
                userAdapter.getFederatedUserByExternalId.onCall(1).resolves(user);
                userAdapter.getFederatedUserByExternalId.onCall(2).resolves(undefined);
                userAdapter.getFederatedUserByExternalId.onCall(3).resolves(user);
                stub.resolves(user);
                roomAdapter.createFederatedRoom.resolves({});
                bridge.getRoomData.resolves({
                    joinedMembers: ['user1', '@creatorId:externalserver.com', user.getExternalId(), 'user2'],
                    creator: { id: '@creatorId:externalserver.com', username: 'creatorUsername' },
                });
                bridge.extractHomeserverOrigin.returns('localDomain');
                yield service.onChangeRoomMembership({
                    externalRoomId: 'externalRoomId',
                    normalizedRoomId: 'normalizedRoomId',
                    eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                    roomType: rooms_1.RoomType.CHANNEL,
                    externalInviteeId: 'externalInviteeId',
                    externalInviterId: 'externalInviteeId',
                    leave: false,
                    normalizedInviteeId: 'normalizedInviteeId',
                });
                (0, chai_1.expect)(stub.callCount).to.be.equal(3);
                (0, chai_1.expect)(stub.getCall(1).calledWith('user1')).to.be.true;
                (0, chai_1.expect)(stub.getCall(2).calledWith('user2')).to.be.true;
                (0, chai_1.expect)(roomAdapter.addUsersToRoomWhenJoinExternalPublicRoom.calledWith([user, user])).to.be.true;
            }));
            it('should add the user to the room and subscribe to typings events if everything was done correctly', () => __awaiter(void 0, void 0, void 0, function* () {
                sinon_1.default.stub(service, 'createFederatedUserAndReturnIt').resolves(user);
                roomAdapter.getFederatedRoomByExternalId.onCall(0).resolves(undefined);
                roomAdapter.getFederatedRoomByExternalId.onCall(1).resolves(undefined);
                roomAdapter.getFederatedRoomByExternalId.onCall(2).resolves(room);
                userAdapter.getFederatedUserByExternalId.onCall(0).resolves(user);
                userAdapter.getFederatedUserByExternalId.onCall(1).resolves(user);
                userAdapter.getFederatedUserByExternalId.onCall(2).resolves(undefined);
                userAdapter.getFederatedUserByExternalId.onCall(3).resolves(user);
                roomAdapter.createFederatedRoom.resolves({});
                bridge.getRoomData.resolves({
                    joinedMembers: ['user1', '@creatorId:externalserver.com', user.getExternalId(), 'user2'],
                    creator: { id: '@creatorId:externalserver.com', username: 'creatorUsername' },
                });
                bridge.extractHomeserverOrigin.returns('localDomain');
                yield service.onChangeRoomMembership({
                    externalRoomId: 'externalRoomId',
                    normalizedRoomId: 'normalizedRoomId',
                    eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                    roomType: rooms_1.RoomType.CHANNEL,
                    externalInviteeId: 'externalInviteeId',
                    externalInviterId: 'externalInviteeId',
                    leave: false,
                    normalizedInviteeId: 'normalizedInviteeId',
                });
                (0, chai_1.expect)(notificationsAdapter.subscribeToUserTypingEventsOnFederatedRoomId.called).to.be.true;
                (0, chai_1.expect)(roomAdapter.addUserToRoom.calledWith(room, user)).to.be.true;
            }));
        });
        describe('User profile changed event', () => {
            it('should NOT call the function to update the user avatar if the event does not include an avatarUrl property', () => __awaiter(void 0, void 0, void 0, function* () {
                const spy = sinon_1.default.spy(service, 'updateUserAvatarInternally');
                yield service.onChangeRoomMembership({
                    externalRoomId: 'externalRoomId',
                    normalizedRoomId: 'normalizedRoomId',
                    eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                    roomType: rooms_1.RoomType.CHANNEL,
                    externalInviteeId: 'externalInviteeId',
                    leave: false,
                    normalizedInviteeId: 'normalizedInviteeId',
                });
                (0, chai_1.expect)(spy.called).to.be.false;
            }));
            const eventForUserProfileChanges = {
                externalRoomId: 'externalRoomId',
                normalizedRoomId: 'normalizedRoomId',
                eventOrigin: IFederationBridge_1.EVENT_ORIGIN.LOCAL,
                roomType: rooms_1.RoomType.CHANNEL,
                externalInviteeId: 'externalInviteeId',
                leave: false,
                normalizedInviteeId: 'normalizedInviteeId',
                userProfile: {
                    avatarUrl: 'avatarUrl',
                    displayName: 'displayName',
                },
            };
            it('should NOT call the function to update the avatar internally if the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                const spy = sinon_1.default.spy(service, 'updateUserAvatarInternally');
                userAdapter.getFederatedUserByExternalId.resolves(undefined);
                yield service.onChangeRoomMembership(eventForUserProfileChanges);
                (0, chai_1.expect)(spy.called).to.be.false;
            }));
            it('should NOT update the avatar nor the display name if both does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                userAdapter.getFederatedUserByExternalId.resolves(user);
                yield service.onChangeRoomMembership(Object.assign(Object.assign({}, eventForUserProfileChanges), { userProfile: {} }));
                (0, chai_1.expect)(userAdapter.setAvatar.called).to.be.false;
                (0, chai_1.expect)(userAdapter.updateFederationAvatar.called).to.be.false;
                (0, chai_1.expect)(userAdapter.updateRealName.called).to.be.false;
            }));
            it('should NOT update the avatar url nor the display name if the user is from the local home server', () => __awaiter(void 0, void 0, void 0, function* () {
                userAdapter.getFederatedUserByExternalId.resolves(FederatedUser.createInstance('externalInviterId', {
                    name: 'normalizedInviterId',
                    username: 'normalizedInviterId',
                    existsOnlyOnProxyServer: true,
                }));
                yield service.onChangeRoomMembership(eventForUserProfileChanges);
                (0, chai_1.expect)(userAdapter.setAvatar.called).to.be.false;
                (0, chai_1.expect)(userAdapter.updateFederationAvatar.called).to.be.false;
                (0, chai_1.expect)(userAdapter.updateRealName.called).to.be.false;
            }));
            it('should NOT update the avatar url if the url received in the event is equal to the one already used', () => __awaiter(void 0, void 0, void 0, function* () {
                const existsOnlyOnProxyServer = false;
                userAdapter.getFederatedUserByExternalId.resolves(FederatedUser.createWithInternalReference('externalInviterId', existsOnlyOnProxyServer, {
                    federation: {
                        avatarUrl: 'avatarUrl',
                    },
                }));
                yield service.onChangeRoomMembership(Object.assign(Object.assign({}, eventForUserProfileChanges), { userProfile: { avatarUrl: 'avatarUrl' } }));
                (0, chai_1.expect)(userAdapter.setAvatar.called).to.be.false;
                (0, chai_1.expect)(userAdapter.updateFederationAvatar.called).to.be.false;
            }));
            it('should call the functions to update the avatar internally correctly', () => __awaiter(void 0, void 0, void 0, function* () {
                const existsOnlyOnProxyServer = false;
                const userAvatar = FederatedUser.createWithInternalReference('externalInviterId', existsOnlyOnProxyServer, {
                    federation: {
                        avatarUrl: 'currentAvatarUrl',
                    },
                    _id: 'userId',
                });
                userAdapter.getFederatedUserByExternalId.resolves(userAvatar);
                yield service.onChangeRoomMembership(eventForUserProfileChanges);
                (0, chai_1.expect)(userAdapter.setAvatar.calledWith(userAvatar, 'toHttpUrl')).to.be.true;
                (0, chai_1.expect)(userAdapter.updateFederationAvatar.calledWith(userAvatar.getInternalId(), 'avatarUrl')).to.be.true;
            }));
            it('should NOT update the display name if the name received in the event is equal to the one already used', () => __awaiter(void 0, void 0, void 0, function* () {
                const existsOnlyOnProxyServer = false;
                userAdapter.getFederatedUserByExternalId.resolves(FederatedUser.createWithInternalReference('externalInviterId', existsOnlyOnProxyServer, {
                    name: 'displayName',
                }));
                yield service.onChangeRoomMembership(Object.assign(Object.assign({}, eventForUserProfileChanges), { userProfile: { displayName: 'displayName' } }));
                (0, chai_1.expect)(userAdapter.setAvatar.called).to.be.false;
                (0, chai_1.expect)(userAdapter.updateFederationAvatar.called).to.be.false;
                (0, chai_1.expect)(userAdapter.updateRealName.called).to.be.false;
            }));
            it('should call the functions to update the display name internally correctly', () => __awaiter(void 0, void 0, void 0, function* () {
                const existsOnlyOnProxyServer = false;
                const user = FederatedUser.createWithInternalReference('externalInviterId', existsOnlyOnProxyServer, {
                    _id: 'userId',
                    name: 'currentName',
                });
                userAdapter.getFederatedUserByExternalId.resolves(user);
                yield service.onChangeRoomMembership(Object.assign(Object.assign({}, eventForUserProfileChanges), { userProfile: { displayName: 'displayName' } }));
                (0, chai_1.expect)(userAdapter.setAvatar.called).to.be.false;
                (0, chai_1.expect)(userAdapter.updateFederationAvatar.called).to.be.false;
                (0, chai_1.expect)(userAdapter.updateRealName.calledWith(user.getInternalReference(), 'displayName')).to.be.true;
            }));
        });
    });
    describe('#onExternalFileMessageReceived()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: false,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT send a message if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            yield service.onExternalFileMessageReceived({
                messageText: 'text',
            });
            (0, chai_1.expect)(messageAdapter.sendFileMessage.called).to.be.false;
        }));
        it('should NOT send a message if the sender does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves({});
            userAdapter.getFederatedUserByExternalId.resolves(undefined);
            yield service.onExternalFileMessageReceived({
                messageText: 'text',
            });
            (0, chai_1.expect)(messageAdapter.sendFileMessage.called).to.be.false;
        }));
        it('should send a message if the room and the sender already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            bridge.getReadStreamForFileFromUrl.resolves();
            const files = [{ id: 'fileId', name: 'filename' }];
            const attachments = ['attachment', 'attachment2'];
            fileAdapter.uploadFile.resolves({ files, attachments });
            yield service.onExternalFileMessageReceived({
                messageBody: {
                    filename: 'filename',
                    size: 12,
                    mimetype: 'mimetype',
                    url: 'url',
                },
            });
            (0, chai_1.expect)(messageAdapter.sendFileMessage.calledWith(user, room, files, attachments)).to.be.true;
        }));
        describe('Quoting messages', () => {
            it('should NOT send a quote message if its necessary to quote but the message to quote does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                roomAdapter.getFederatedRoomByExternalId.resolves(room);
                userAdapter.getFederatedUserByExternalId.resolves(user);
                messageAdapter.getMessageByFederationId.resolves(undefined);
                fileAdapter.uploadFile.resolves({});
                yield service.onExternalFileMessageReceived({
                    messageBody: {
                        filename: 'filename',
                        size: 12,
                        mimetype: 'mimetype',
                        url: 'url',
                    },
                    replyToEventId: 'replyToEventId',
                });
                (0, chai_1.expect)(messageAdapter.sendQuoteFileMessage.called).to.be.false;
                (0, chai_1.expect)(messageAdapter.sendFileMessage.called).to.be.false;
            }));
            it('should send a quote message if its necessary to quote and the message to quote exists', () => __awaiter(void 0, void 0, void 0, function* () {
                const messageToReplyTo = { federation: { eventId: 'eventId' } };
                roomAdapter.getFederatedRoomByExternalId.resolves(room);
                userAdapter.getFederatedUserByExternalId.resolves(user);
                messageAdapter.getMessageByFederationId.onFirstCall().resolves(undefined);
                messageAdapter.getMessageByFederationId.onSecondCall().resolves(messageToReplyTo);
                const files = [{ id: 'fileId', name: 'filename' }];
                const attachments = ['attachment', 'attachment2'];
                fileAdapter.uploadFile.resolves({ files, attachments });
                yield service.onExternalFileMessageReceived({
                    messageBody: {
                        filename: 'filename',
                        size: 12,
                        mimetype: 'mimetype',
                        url: 'url',
                    },
                    replyToEventId: 'replyToEventId',
                    externalEventId: 'externalEventId',
                });
                (0, chai_1.expect)(messageAdapter.sendQuoteFileMessage.calledWith(user, room, files, attachments, 'externalEventId', messageToReplyTo, 'localDomain')).to.be.true;
                (0, chai_1.expect)(messageAdapter.sendFileMessage.called).to.be.false;
            }));
        });
    });
    describe('#onExternalMessageReceived()', () => {
        it('should NOT send a message if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            yield service.onExternalMessageReceived({
                messageText: 'text',
            });
            (0, chai_1.expect)(messageAdapter.sendMessage.called).to.be.false;
        }));
        it('should NOT send a message if the sender does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves({});
            userAdapter.getFederatedUserByExternalId.resolves(undefined);
            yield service.onExternalMessageReceived({
                messageText: 'text',
            });
            (0, chai_1.expect)(messageAdapter.sendMessage.called).to.be.false;
        }));
        it('should NOT send a message if the message was already be sent through federation and is just a reply back event', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves({});
            userAdapter.getFederatedUserByExternalId.resolves({});
            messageAdapter.getMessageByFederationId.resolves({});
            yield service.onExternalMessageReceived({
                messageText: 'text',
            });
            (0, chai_1.expect)(messageAdapter.sendMessage.called).to.be.false;
        }));
        it('should send a message if the room, the sender already exists and the message does not exists, because it was sent originally from Matrix', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves({});
            userAdapter.getFederatedUserByExternalId.resolves({});
            messageAdapter.getMessageByFederationId.resolves(undefined);
            yield service.onExternalMessageReceived({
                messageText: 'text',
                rawMessage: 'rawMessage',
                externalFormattedText: 'externalFormattedText',
                externalEventId: 'externalEventId',
            });
            (0, chai_1.expect)(messageAdapter.sendMessage.calledWith({}, {}, 'rawMessage', 'externalFormattedText', 'externalEventId', 'localDomain')).to.be
                .true;
            (0, chai_1.expect)(messageAdapter.sendQuoteMessage.called).to.be.false;
        }));
        describe('Quoting messages', () => {
            it('should NOT send a quote message if its necessary to quote but the message to quote does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                roomAdapter.getFederatedRoomByExternalId.resolves({});
                userAdapter.getFederatedUserByExternalId.resolves({});
                messageAdapter.getMessageByFederationId.resolves(undefined);
                yield service.onExternalMessageReceived({
                    messageText: 'text',
                    replyToEventId: 'replyToEventId',
                });
                (0, chai_1.expect)(messageAdapter.sendQuoteMessage.called).to.be.false;
                (0, chai_1.expect)(messageAdapter.sendMessage.called).to.be.false;
            }));
            it('should send a quote message if its necessary to quote and the message to quote exists', () => __awaiter(void 0, void 0, void 0, function* () {
                roomAdapter.getFederatedRoomByExternalId.resolves({});
                userAdapter.getFederatedUserByExternalId.resolves({});
                messageAdapter.getMessageByFederationId.onFirstCall().resolves(undefined);
                messageAdapter.getMessageByFederationId.onSecondCall().resolves({});
                yield service.onExternalMessageReceived({
                    messageText: 'text',
                    externalEventId: 'externalEventId',
                    replyToEventId: 'replyToEventId',
                    rawMessage: 'rawMessage',
                    externalFormattedText: 'externalFormattedText',
                });
                (0, chai_1.expect)(messageAdapter.sendQuoteMessage.calledWith({}, {}, 'externalFormattedText', 'rawMessage', 'externalEventId', {}, 'localDomain')).to.be.true;
                (0, chai_1.expect)(messageAdapter.sendMessage.called).to.be.false;
            }));
        });
    });
    describe('#onChangeJoinRules()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: false,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT change the room type if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            yield service.onChangeJoinRules({
                roomType: rooms_1.RoomType.CHANNEL,
            });
            (0, chai_1.expect)(roomAdapter.updateRoomType.called).to.be.false;
        }));
        it('should NOT change the room type if it exists and is a direct message', () => __awaiter(void 0, void 0, void 0, function* () {
            const dmRoom = DirectMessageFederatedRoom.createInstance('externalRoomId', user, [user, user]);
            roomAdapter.getFederatedRoomByExternalId.resolves(dmRoom);
            yield service.onChangeJoinRules({
                roomType: rooms_1.RoomType.CHANNEL,
            });
            (0, chai_1.expect)(roomAdapter.updateRoomType.called).to.be.false;
        }));
        it('should change the room type if it exists and is NOT a direct message', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            yield service.onChangeJoinRules({
                roomType: rooms_1.RoomType.PRIVATE_GROUP,
            });
            room.changeRoomType(rooms_1.RoomType.PRIVATE_GROUP);
            (0, chai_1.expect)(roomAdapter.updateRoomType.calledWith(room)).to.be.true;
        }));
    });
    describe('#onChangeRoomName()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: false,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT change the room name if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            yield service.onChangeRoomName({
                normalizedRoomName: 'normalizedRoomName',
            });
            (0, chai_1.expect)(roomAdapter.updateRoomName.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.updateDisplayRoomName.called).to.be.false;
        }));
        it('should NOT change the room name if the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(undefined);
            yield service.onChangeRoomName({
                normalizedRoomName: 'normalizedRoomName',
            });
            (0, chai_1.expect)(roomAdapter.updateRoomName.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.updateDisplayRoomName.called).to.be.false;
        }));
        it('should NOT change the room name if the room is an internal room', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            bridge.extractHomeserverOrigin.returns('localDomain');
            yield service.onChangeRoomName({
                externalRoomId: '!externalRoomId:localDomain',
                normalizedRoomName: 'normalizedRoomName',
            });
            (0, chai_1.expect)(roomAdapter.updateRoomName.called).to.be.false;
        }));
        it('should change the room name if the room is NOT an internal room', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            bridge.extractHomeserverOrigin.returns('externalDomain');
            yield service.onChangeRoomName({
                externalRoomId: '!externalRoomId:externalDomain',
                normalizedRoomName: 'normalizedRoomName',
            });
            room.changeRoomName('!externalRoomId:externalDomain');
            (0, chai_1.expect)(roomAdapter.updateRoomName.calledWith(room)).to.be.true;
        }));
        it('should NOT change the room fname if it exists and is a direct message', () => __awaiter(void 0, void 0, void 0, function* () {
            const dmRoom = DirectMessageFederatedRoom.createInstance('externalRoomId', user, [user, user]);
            roomAdapter.getFederatedRoomByExternalId.resolves(dmRoom);
            yield service.onChangeRoomName({
                normalizedRoomName: 'normalizedRoomName',
            });
            (0, chai_1.expect)(roomAdapter.updateDisplayRoomName.called).to.be.false;
        }));
        it('should change the room fname if it exists and is NOT a direct message', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            yield service.onChangeRoomName({
                normalizedRoomName: 'normalizedRoomName2',
            });
            room.changeDisplayRoomName('normalizedRoomName2');
            (0, chai_1.expect)(roomAdapter.updateDisplayRoomName.calledWith(room, user)).to.be.true;
        }));
    });
    describe('#onChangeRoomTopic()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: false,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT change the room topic if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            yield service.onChangeRoomTopic({
                roomTopic: 'roomTopic',
            });
            (0, chai_1.expect)(roomAdapter.updateRoomTopic.called).to.be.false;
        }));
        it('should NOT change the room topic if it exists and is a direct message', () => __awaiter(void 0, void 0, void 0, function* () {
            const dmRoom = DirectMessageFederatedRoom.createInstance('externalRoomId', user, [user, user]);
            roomAdapter.getFederatedRoomByExternalId.resolves(dmRoom);
            yield service.onChangeRoomTopic({
                roomTopic: 'roomTopic',
            });
            (0, chai_1.expect)(roomAdapter.updateRoomTopic.called).to.be.false;
        }));
        it('should change the room topic if it exists and is NOT a direct message', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            yield service.onChangeRoomTopic({
                roomTopic: 'roomTopic',
            });
            room.changeRoomTopic('roomTopic');
            (0, chai_1.expect)(roomAdapter.updateRoomTopic.calledWith(room, user)).to.be.true;
        }));
    });
    describe('#onRedactEvent()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: false,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT delete the message if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            yield service.onRedactEvent({
                redactsEvent: 'redactsEvent',
            });
            (0, chai_1.expect)(messageAdapter.deleteMessage.called).to.be.false;
            (0, chai_1.expect)(messageAdapter.unreactToMessage.called).to.be.false;
        }));
        it('should NOT delete the message if the sender does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(undefined);
            yield service.onRedactEvent({
                redactsEvent: 'redactsEvent',
            });
            (0, chai_1.expect)(messageAdapter.deleteMessage.called).to.be.false;
            (0, chai_1.expect)(messageAdapter.unreactToMessage.called).to.be.false;
        }));
        it('should NOT delete the message if the message does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            messageAdapter.getMessageByFederationId.resolves(undefined);
            yield service.onRedactEvent({
                redactsEvent: 'redactsEvent',
            });
            (0, chai_1.expect)(messageAdapter.deleteMessage.called).to.be.false;
            (0, chai_1.expect)(messageAdapter.unreactToMessage.called).to.be.false;
        }));
        it('should delete the message if its a raw text redact handler', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            messageAdapter.getMessageByFederationId.resolves({ msg: 'msg' });
            messageAdapter.findOneByFederationIdOnReactions.resolves(undefined);
            yield service.onRedactEvent({
                redactsEvent: 'redactsEvent',
            });
            (0, chai_1.expect)(messageAdapter.deleteMessage.calledWith({ msg: 'msg' }, user)).to.be.true;
            (0, chai_1.expect)(messageAdapter.unreactToMessage.called).to.be.false;
        }));
        it('should NOT unreact if the message was not reacted before by the user', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            messageAdapter.getMessageByFederationId.resolves(undefined);
            messageAdapter.findOneByFederationIdOnReactions.resolves({
                msg: 'msg',
                reactions: {
                    reaction: {
                        federationReactionEventIds: {},
                        usernames: [],
                    },
                },
            });
            yield service.onRedactEvent({
                redactsEvent: 'redactsEvent',
            });
            (0, chai_1.expect)(messageAdapter.deleteMessage.called).to.be.false;
            (0, chai_1.expect)(messageAdapter.unreactToMessage.called).to.be.false;
        }));
        it('should unreact if the message was reacted before by the user', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = {
                msg: 'msg',
                reactions: {
                    reaction: {
                        federationReactionEventIds: {
                            redactsEvent: user.getUsername(),
                        },
                        usernames: [user.getUsername()],
                    },
                },
            };
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            messageAdapter.getMessageByFederationId.resolves(undefined);
            messageAdapter.findOneByFederationIdOnReactions.resolves(message);
            yield service.onRedactEvent({
                redactsEvent: 'redactsEvent',
            });
            (0, chai_1.expect)(messageAdapter.deleteMessage.called).to.be.false;
            (0, chai_1.expect)(messageAdapter.unreactToMessage.calledWith(user, message, 'reaction', 'redactsEvent')).to.be.true;
        }));
    });
    describe('#onExternalMessageEditedReceived()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: false,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT update the message if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            yield service.onExternalMessageEditedReceived({
                editsEvent: 'editsEvent',
            });
            (0, chai_1.expect)(messageAdapter.editMessage.called).to.be.false;
        }));
        it('should NOT update the message if the sender does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(undefined);
            yield service.onExternalMessageEditedReceived({
                editsEvent: 'editsEvent',
            });
            (0, chai_1.expect)(messageAdapter.editMessage.called).to.be.false;
        }));
        it('should NOT update the message if the message does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            messageAdapter.getMessageByFederationId.resolves(undefined);
            yield service.onExternalMessageEditedReceived({
                editsEvent: 'editsEvent',
            });
            (0, chai_1.expect)(messageAdapter.editMessage.called).to.be.false;
        }));
        it('should NOT update the message if the content of the message is equal of the oldest one', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            messageAdapter.getMessageByFederationId.resolves({ msg: 'newRawMessage' });
            yield service.onExternalMessageEditedReceived({
                editsEvent: 'editsEvent',
                newRawMessage: 'newRawMessage',
            });
            (0, chai_1.expect)(messageAdapter.editMessage.called).to.be.false;
        }));
        it('should update the message', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            messageAdapter.getMessageByFederationId.resolves({ msg: 'differentOne' });
            yield service.onExternalMessageEditedReceived({
                editsEvent: 'editsEvent',
                newMessageText: 'newMessageText',
                newRawMessage: 'newRawMessage',
                newExternalFormattedText: 'newExternalFormattedText',
            });
            (0, chai_1.expect)(messageAdapter.editMessage.calledWith(user, 'newRawMessage', 'newExternalFormattedText', { msg: 'differentOne' }, 'localDomain')).to.be.true;
        }));
        describe('Editing quoted messages', () => {
            it('should NOT edit the quoted message if the event was generated locally (the message edited was on local server only)', () => __awaiter(void 0, void 0, void 0, function* () {
                roomAdapter.getFederatedRoomByExternalId.resolves(room);
                userAdapter.getFederatedUserByExternalId.resolves(user);
                messageAdapter.getMessageByFederationId.resolves({ msg: 'differentOne', attachments: [{ message_link: 'link' }] });
                bridge.extractHomeserverOrigin.returns('localDomain');
                yield service.onExternalMessageEditedReceived({
                    editsEvent: 'editsEvent',
                    newMessageText: 'newMessageText',
                    newRawMessage: 'newRawMessage',
                    newExternalFormattedText: 'newExternalFormattedText',
                    externalSenderId: 'externalSenderId:localDomain',
                });
                (0, chai_1.expect)(messageAdapter.editMessage.called).to.be.false;
                (0, chai_1.expect)(messageAdapter.editQuotedMessage.called).to.be.false;
            }));
            it('should NOT edit the quoted message if the event was remotely generated but the message content is the same as the current one (the message is already up to date)', () => __awaiter(void 0, void 0, void 0, function* () {
                roomAdapter.getFederatedRoomByExternalId.resolves(room);
                userAdapter.getFederatedUserByExternalId.resolves(user);
                messageAdapter.getMessageByFederationId.resolves({
                    msg: 'internalFormattedMessageToBeEdited',
                    attachments: [{ message_link: 'link' }],
                });
                bridge.extractHomeserverOrigin.returns('externalDomain');
                messageAdapter.getMessageToEditWhenReplyAndQuote.resolves('internalFormattedMessageToBeEdited');
                yield service.onExternalMessageEditedReceived({
                    editsEvent: 'editsEvent',
                    newMessageText: 'newMessageText',
                    newRawMessage: 'newRawMessage',
                    newExternalFormattedText: 'newExternalFormattedText',
                    externalSenderId: 'externalSenderId:externalDomain',
                });
                (0, chai_1.expect)(messageAdapter.editMessage.called).to.be.false;
                (0, chai_1.expect)(messageAdapter.editQuotedMessage.called).to.be.false;
            }));
            it('should edit the quoted message if the event was remotely the message content is outdated', () => __awaiter(void 0, void 0, void 0, function* () {
                const message = {
                    msg: 'differentOne',
                    attachments: [{ message_link: 'link' }],
                };
                roomAdapter.getFederatedRoomByExternalId.resolves(room);
                userAdapter.getFederatedUserByExternalId.resolves(user);
                messageAdapter.getMessageByFederationId.resolves(message);
                bridge.extractHomeserverOrigin.returns('externalDomain');
                messageAdapter.getMessageToEditWhenReplyAndQuote.resolves('internalFormattedMessageToBeEdited');
                yield service.onExternalMessageEditedReceived({
                    editsEvent: 'editsEvent',
                    newMessageText: 'newMessageText',
                    newRawMessage: 'newRawMessage',
                    newExternalFormattedText: 'newExternalFormattedText',
                    externalSenderId: 'externalSenderId:externalDomain',
                });
                (0, chai_1.expect)(messageAdapter.editMessage.called).to.be.false;
                (0, chai_1.expect)(messageAdapter.editQuotedMessage.calledWith(user, 'newRawMessage', 'newExternalFormattedText', message, 'localDomain')).to.be
                    .true;
            }));
        });
    });
    describe('#onChangeRoomPowerLevels()', () => {
        const user = FederatedUser.createInstance('externalUserId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: false,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT update the room roles if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            yield service.onChangeRoomPowerLevels({
                externalRoomId: 'externalRoomId',
                externalSenderId: 'externalSenderId',
                rolesChangesToApply: [],
            });
            (0, chai_1.expect)(roomAdapter.applyRoomRolesToUser.called).to.be.false;
        }));
        it('should NOT update the room roles if the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(undefined);
            yield service.onChangeRoomPowerLevels({
                externalRoomId: 'externalRoomId',
                externalSenderId: 'externalSenderId',
                rolesChangesToApply: [],
            });
            (0, chai_1.expect)(roomAdapter.applyRoomRolesToUser.called).to.be.false;
        }));
        it('should NOT update the room roles if there is no target users', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            userAdapter.getFederatedUsersByExternalIds.resolves([]);
            yield service.onChangeRoomPowerLevels({
                externalRoomId: 'externalRoomId',
                externalSenderId: 'externalSenderId',
                rolesChangesToApply: [],
            });
            (0, chai_1.expect)(roomAdapter.applyRoomRolesToUser.called).to.be.false;
        }));
        it('should update the room roles adding one role to be added', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            userAdapter.getFederatedUsersByExternalIds.resolves([user]);
            yield service.onChangeRoomPowerLevels({
                externalRoomId: 'externalRoomId',
                externalSenderId: 'externalSenderId',
                roleChangesToApply: {
                    externalUserId: [
                        {
                            action: 'add',
                            role: 'owner',
                        },
                    ],
                },
            });
            (0, chai_1.expect)(roomAdapter.applyRoomRolesToUser.calledWith({
                federatedRoom: room,
                targetFederatedUser: user,
                fromUser: user,
                rolesToAdd: ['owner'],
                rolesToRemove: [],
                notifyChannel: true,
            })).to.be.true;
        }));
        it('should update the room roles adding one role to be removed', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            userAdapter.getFederatedUsersByExternalIds.resolves([user]);
            yield service.onChangeRoomPowerLevels({
                externalRoomId: 'externalRoomId',
                externalSenderId: 'externalSenderId',
                roleChangesToApply: {
                    externalUserId: [
                        {
                            action: 'remove',
                            role: 'owner',
                        },
                    ],
                },
            });
            (0, chai_1.expect)(roomAdapter.applyRoomRolesToUser.calledWith({
                federatedRoom: room,
                targetFederatedUser: user,
                fromUser: user,
                rolesToAdd: [],
                rolesToRemove: ['owner'],
                notifyChannel: true,
            })).to.be.true;
        }));
    });
    describe('#onExternalThreadedMessageReceived()', () => {
        it('should NOT send a message if the thread root event id does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield service.onExternalThreadedMessageReceived({
                rawMessage: 'text',
            });
            (0, chai_1.expect)(messageAdapter.sendThreadMessage.called).to.be.false;
            (0, chai_1.expect)(messageAdapter.sendThreadQuoteMessage.called).to.be.false;
        }));
        it('should NOT send a message if the internal thread parent message does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            messageAdapter.getMessageByFederationId.resolves(undefined);
            yield service.onExternalThreadedMessageReceived({
                rawMessage: 'text',
                thread: { rootEventId: 'rootEventId' },
            });
            (0, chai_1.expect)(messageAdapter.sendThreadMessage.called).to.be.false;
            (0, chai_1.expect)(messageAdapter.sendThreadQuoteMessage.called).to.be.false;
        }));
        it('should NOT send a message if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            messageAdapter.getMessageByFederationId.resolves({});
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            yield service.onExternalThreadedMessageReceived({
                rawMessage: 'text',
                thread: { rootEventId: 'rootEventId' },
            });
            (0, chai_1.expect)(messageAdapter.sendThreadQuoteMessage.called).to.be.false;
            (0, chai_1.expect)(messageAdapter.sendThreadMessage.called).to.be.false;
        }));
        it('should NOT send a message if the sender does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            messageAdapter.getMessageByFederationId.resolves({});
            roomAdapter.getFederatedRoomByExternalId.resolves({});
            userAdapter.getFederatedUserByExternalId.resolves(undefined);
            yield service.onExternalThreadedMessageReceived({
                rawMessage: 'text',
                thread: { rootEventId: 'rootEventId' },
            });
            (0, chai_1.expect)(messageAdapter.sendThreadQuoteMessage.called).to.be.false;
            (0, chai_1.expect)(messageAdapter.sendThreadMessage.called).to.be.false;
        }));
        it('should NOT send a message if the message was already be sent through federation and is just a reply back event', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves({});
            userAdapter.getFederatedUserByExternalId.resolves({});
            messageAdapter.getMessageByFederationId.resolves({});
            yield service.onExternalThreadedMessageReceived({
                messageText: 'text',
                thread: { rootEventId: 'rootEventId' },
            });
            (0, chai_1.expect)(messageAdapter.sendThreadQuoteMessage.called).to.be.false;
            (0, chai_1.expect)(messageAdapter.sendThreadMessage.called).to.be.false;
        }));
        it('should send a message if the room, the sender already exists and the message does not exists, because it was sent originally from Matrix', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves({});
            userAdapter.getFederatedUserByExternalId.resolves({});
            messageAdapter.getMessageByFederationId.onFirstCall().resolves({ _id: 'messageThreadId' });
            roomAdapter.getFederatedRoomByExternalId.onSecondCall().resolves(undefined);
            yield service.onExternalThreadedMessageReceived({
                messageText: 'text',
                rawMessage: 'rawMessage',
                externalFormattedText: 'externalFormattedText',
                externalEventId: 'externalEventId',
                thread: { rootEventId: 'rootEventId' },
            });
            (0, chai_1.expect)(messageAdapter.sendThreadMessage.calledWith({}, {}, 'rawMessage', 'externalEventId', 'messageThreadId', 'externalFormattedText', 'localDomain')).to.be.true;
            (0, chai_1.expect)(messageAdapter.sendThreadQuoteMessage.called).to.be.false;
        }));
        describe('Quoting messages', () => {
            it('should NOT send a quote message if its necessary to quote but the message to quote does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                messageAdapter.getMessageByFederationId.onFirstCall().resolves({ _id: 'messageThreadId' });
                roomAdapter.getFederatedRoomByExternalId.onSecondCall().resolves(undefined);
                roomAdapter.getFederatedRoomByExternalId.onThirdCall().resolves(undefined);
                roomAdapter.getFederatedRoomByExternalId.resolves({});
                userAdapter.getFederatedUserByExternalId.resolves({});
                messageAdapter.getMessageByFederationId.resolves(undefined);
                yield service.onExternalThreadedMessageReceived({
                    messageText: 'text',
                    replyToEventId: 'replyToEventId',
                    thread: { rootEventId: 'rootEventId' },
                });
                (0, chai_1.expect)(messageAdapter.sendThreadQuoteMessage.called).to.be.false;
                (0, chai_1.expect)(messageAdapter.sendThreadMessage.called).to.be.false;
            }));
            it('should send a quote message if its necessary to quote and the message to quote exists', () => __awaiter(void 0, void 0, void 0, function* () {
                messageAdapter.getMessageByFederationId.onFirstCall().resolves({ _id: 'messageThreadId' });
                roomAdapter.getFederatedRoomByExternalId.resolves({});
                userAdapter.getFederatedUserByExternalId.resolves({});
                messageAdapter.getMessageByFederationId.onSecondCall().resolves(undefined);
                messageAdapter.getMessageByFederationId.onThirdCall().resolves({});
                yield service.onExternalThreadedMessageReceived({
                    messageText: 'text',
                    externalEventId: 'externalEventId',
                    replyToEventId: 'replyToEventId',
                    rawMessage: 'rawMessage',
                    externalFormattedText: 'externalFormattedText',
                    thread: { rootEventId: 'rootEventId' },
                });
                (0, chai_1.expect)(messageAdapter.sendThreadQuoteMessage.calledWith({}, {}, 'rawMessage', 'externalEventId', {}, 'localDomain', 'messageThreadId', 'externalFormattedText')).to.be.true;
                (0, chai_1.expect)(messageAdapter.sendThreadMessage.called).to.be.false;
            }));
        });
    });
    describe('#onExternalThreadedFileMessageReceived()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: false,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT send a message if the thread root event id does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            yield service.onExternalThreadedFileMessageReceived({
                rawMessage: 'text',
            });
            (0, chai_1.expect)(messageAdapter.sendThreadQuoteFileMessage.called).to.be.false;
            (0, chai_1.expect)(messageAdapter.sendThreadFileMessage.called).to.be.false;
        }));
        it('should NOT send a message if the internal thread parent message does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            messageAdapter.getMessageByFederationId.resolves(undefined);
            yield service.onExternalThreadedFileMessageReceived({
                rawMessage: 'text',
                thread: { rootEventId: 'rootEventId' },
            });
            (0, chai_1.expect)(messageAdapter.sendThreadQuoteFileMessage.called).to.be.false;
            (0, chai_1.expect)(messageAdapter.sendThreadFileMessage.called).to.be.false;
        }));
        it('should NOT send a message if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            messageAdapter.getMessageByFederationId.resolves({});
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            yield service.onExternalThreadedFileMessageReceived({
                rawMessage: 'text',
                thread: { rootEventId: 'rootEventId' },
            });
            (0, chai_1.expect)(messageAdapter.sendThreadQuoteFileMessage.called).to.be.false;
            (0, chai_1.expect)(messageAdapter.sendThreadFileMessage.called).to.be.false;
        }));
        it('should NOT send a message if the sender does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves({});
            userAdapter.getFederatedUserByExternalId.resolves(undefined);
            messageAdapter.getMessageByFederationId.resolves({});
            yield service.onExternalThreadedFileMessageReceived({
                rawMessage: 'text',
                thread: { rootEventId: 'rootEventId' },
            });
            (0, chai_1.expect)(messageAdapter.sendThreadQuoteFileMessage.called).to.be.false;
            (0, chai_1.expect)(messageAdapter.sendThreadFileMessage.called).to.be.false;
        }));
        it('should send a message if the room and the sender already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            bridge.getReadStreamForFileFromUrl.resolves();
            const files = [{ id: 'fileId', name: 'filename' }];
            const attachments = ['attachment', 'attachment2'];
            fileAdapter.uploadFile.resolves({ files, attachments });
            messageAdapter.getMessageByFederationId.onFirstCall().resolves({ _id: 'messageThreadId' });
            messageAdapter.getMessageByFederationId.onSecondCall().resolves(undefined);
            yield service.onExternalThreadedFileMessageReceived({
                thread: { rootEventId: 'rootEventId' },
                externalEventId: 'externalEventId',
                messageBody: {
                    filename: 'filename',
                    size: 12,
                    mimetype: 'mimetype',
                    url: 'url',
                },
            });
            (0, chai_1.expect)(messageAdapter.sendThreadFileMessage.calledWith(user, room, files, attachments, 'externalEventId', 'messageThreadId')).to.be
                .true;
            (0, chai_1.expect)(messageAdapter.sendThreadQuoteFileMessage.called).to.be.false;
        }));
        describe('Quoting messages', () => {
            it('should NOT send a quote message if its necessary to quote but the message to quote does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                roomAdapter.getFederatedRoomByExternalId.resolves(room);
                userAdapter.getFederatedUserByExternalId.resolves(user);
                messageAdapter.getMessageByFederationId.resolves(undefined);
                fileAdapter.uploadFile.resolves({});
                messageAdapter.getMessageByFederationId.onFirstCall().resolves({ _id: 'messageThreadId' });
                messageAdapter.getMessageByFederationId.onSecondCall().resolves(undefined);
                messageAdapter.getMessageByFederationId.onThirdCall().resolves(undefined);
                yield service.onExternalThreadedFileMessageReceived({
                    thread: { rootEventId: 'rootEventId' },
                    externalEventId: 'externalEventId',
                    replyToEventId: 'replyToEventId',
                    messageBody: {
                        filename: 'filename',
                        size: 12,
                        mimetype: 'mimetype',
                        url: 'url',
                    },
                });
                (0, chai_1.expect)(messageAdapter.sendThreadQuoteFileMessage.called).to.be.false;
                (0, chai_1.expect)(messageAdapter.sendThreadFileMessage.called).to.be.false;
            }));
            it('should send a quote message if its necessary to quote and the message to quote exists', () => __awaiter(void 0, void 0, void 0, function* () {
                const messageToReplyTo = { federation: { eventId: 'eventId' } };
                roomAdapter.getFederatedRoomByExternalId.resolves(room);
                userAdapter.getFederatedUserByExternalId.resolves(user);
                messageAdapter.getMessageByFederationId.onFirstCall().resolves({ _id: 'messageThreadId' });
                messageAdapter.getMessageByFederationId.onSecondCall().resolves(undefined);
                messageAdapter.getMessageByFederationId.onThirdCall().resolves(messageToReplyTo);
                const files = [{ id: 'fileId', name: 'filename' }];
                const attachments = ['attachment', 'attachment2'];
                fileAdapter.uploadFile.resolves({ files, attachments });
                yield service.onExternalThreadedFileMessageReceived({
                    thread: { rootEventId: 'rootEventId' },
                    externalEventId: 'externalEventId',
                    replyToEventId: 'replyToEventId',
                    messageBody: {
                        filename: 'filename',
                        size: 12,
                        mimetype: 'mimetype',
                        url: 'url',
                    },
                });
                (0, chai_1.expect)(messageAdapter.sendThreadQuoteFileMessage.calledWith(user, room, files, attachments, 'externalEventId', messageToReplyTo, 'localDomain', 'messageThreadId')).to.be.true;
                (0, chai_1.expect)(messageAdapter.sendThreadFileMessage.called).to.be.false;
            }));
        });
    });
});
