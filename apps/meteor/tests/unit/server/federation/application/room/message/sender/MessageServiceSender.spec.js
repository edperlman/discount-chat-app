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
const MessageServiceSender_1 = require("../../../../../../../../server/services/federation/application/room/message/sender/MessageServiceSender");
const { FederatedUser } = proxyquire_1.default.noCallThru().load('../../../../../../../../server/services/federation/domain/FederatedUser', {
    mongodb: {
        'ObjectId': class ObjectId {
            toHexString() {
                return 'hexString';
            }
        },
        '@global': true,
    },
});
const { FederatedRoom } = proxyquire_1.default.noCallThru().load('../../../../../../../../server/services/federation/domain/FederatedRoom', {
    mongodb: {
        'ObjectId': class ObjectId {
            toHexString() {
                return 'hexString';
            }
        },
        '@global': true,
    },
});
describe('Federation - Application - FederationMessageServiceSender', () => {
    let service;
    const roomAdapter = {
        getFederatedRoomByInternalId: sinon_1.default.stub(),
    };
    const userAdapter = {
        getFederatedUserByInternalId: sinon_1.default.stub(),
    };
    const settingsAdapter = {
        getHomeServerDomain: sinon_1.default.stub().returns('localDomain'),
    };
    const messageAdapter = {
        setExternalFederationEventOnMessageReaction: sinon_1.default.stub(),
        unsetExternalFederationEventOnMessageReaction: sinon_1.default.stub(),
    };
    const bridge = {
        extractHomeserverOrigin: sinon_1.default.stub(),
        sendMessageReaction: sinon_1.default.stub(),
        redactEvent: sinon_1.default.stub(),
    };
    beforeEach(() => {
        service = new MessageServiceSender_1.FederationMessageServiceSender(roomAdapter, userAdapter, settingsAdapter, messageAdapter, bridge);
    });
    afterEach(() => {
        roomAdapter.getFederatedRoomByInternalId.reset();
        userAdapter.getFederatedUserByInternalId.reset();
        bridge.extractHomeserverOrigin.reset();
        messageAdapter.setExternalFederationEventOnMessageReaction.reset();
        messageAdapter.unsetExternalFederationEventOnMessageReaction.reset();
        bridge.sendMessageReaction.reset();
        bridge.redactEvent.reset();
    });
    describe('#sendExternalMessageReaction()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: true,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should not send the reaction if the internal message does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            yield service.sendExternalMessageReaction(undefined, {}, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
            (0, chai_1.expect)(userAdapter.getFederatedUserByInternalId.called).to.be.false;
        }));
        it('should not send the reaction if the internal user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            yield service.sendExternalMessageReaction({}, undefined, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
            (0, chai_1.expect)(userAdapter.getFederatedUserByInternalId.called).to.be.false;
        }));
        it('should not send the reaction if the internal user id does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            yield service.sendExternalMessageReaction({}, {}, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
            (0, chai_1.expect)(userAdapter.getFederatedUserByInternalId.called).to.be.false;
        }));
        it('should not send the reaction if the internal message room id does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            yield service.sendExternalMessageReaction({}, { _id: 'id' }, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
            (0, chai_1.expect)(userAdapter.getFederatedUserByInternalId.called).to.be.false;
        }));
        it('should not send the reaction the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            yield service.sendExternalMessageReaction({ rid: 'roomId' }, { _id: 'id' }, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
        }));
        it('should not send the reaction the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            yield service.sendExternalMessageReaction({ rid: 'roomId' }, { _id: 'id' }, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
        }));
        it('should not send the reaction the the message is not from matrix federation', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            yield service.sendExternalMessageReaction({ rid: 'roomId' }, { _id: 'id' }, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
        }));
        it('should not send the reaction if the user is not from the same home server', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('externalDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            yield service.sendExternalMessageReaction({ rid: 'roomId', federation: { eventId: 'eventId' } }, { _id: 'id' }, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
        }));
        it('should send the reaction', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('localDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            bridge.sendMessageReaction.resolves('returnedEventId');
            yield service.sendExternalMessageReaction({ rid: 'roomId', federation: { eventId: 'eventId' } }, { _id: 'id' }, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.calledWith(room.getExternalId(), user.getExternalId(), 'eventId', 'reaction')).to.be.true;
            (0, chai_1.expect)(messageAdapter.setExternalFederationEventOnMessageReaction.calledWith(user.getUsername(), { rid: 'roomId', federation: { eventId: 'eventId' } }, 'reaction', 'returnedEventId')).to.be.true;
        }));
    });
    describe('#sendExternalMessageUnReaction()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: true,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should not send the unreaction if the internal message does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            yield service.sendExternalMessageUnReaction(undefined, {}, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
            (0, chai_1.expect)(userAdapter.getFederatedUserByInternalId.called).to.be.false;
        }));
        it('should not send the unreaction if the internal user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            yield service.sendExternalMessageUnReaction({}, undefined, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
            (0, chai_1.expect)(userAdapter.getFederatedUserByInternalId.called).to.be.false;
        }));
        it('should not send the unreaction if the internal user id does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            yield service.sendExternalMessageUnReaction({}, {}, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
            (0, chai_1.expect)(userAdapter.getFederatedUserByInternalId.called).to.be.false;
        }));
        it('should not send the unreaction if the internal message room id does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            yield service.sendExternalMessageUnReaction({}, { _id: 'id' }, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
            (0, chai_1.expect)(userAdapter.getFederatedUserByInternalId.called).to.be.false;
        }));
        it('should not send the unreaction the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            yield service.sendExternalMessageUnReaction({ rid: 'roomId' }, { _id: 'id' }, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
        }));
        it('should not send the unreaction the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            yield service.sendExternalMessageUnReaction({ rid: 'roomId' }, { _id: 'id' }, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
        }));
        it('should not send the unreaction the the message is not from matrix federation', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            yield service.sendExternalMessageUnReaction({ rid: 'roomId' }, { _id: 'id' }, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
        }));
        it('should not send the unreaction if the user is not from the same home server', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.onCall(0).returns('localDomain');
            bridge.extractHomeserverOrigin.onCall(1).returns('externalDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            yield service.sendExternalMessageUnReaction({ rid: 'roomId', federation: { eventId: 'eventId' } }, { _id: 'id' }, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
        }));
        it('should not send the unreaction if the user is not from the same home server', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('externalDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            yield service.sendExternalMessageUnReaction({ rid: 'roomId', federation: { eventId: 'eventId' } }, { _id: 'id' }, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
        }));
        it('should not send the unreaction if there is no existing reaction', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('localDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            yield service.sendExternalMessageUnReaction({ rid: 'roomId', federation: { eventId: 'eventId' } }, { _id: 'id' }, 'reaction');
            (0, chai_1.expect)(bridge.sendMessageReaction.called).to.be.false;
        }));
        it('should send the unreaction', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = {
                rid: 'roomId',
                federation: { eventId: 'eventId' },
                reactions: {
                    reaction: {
                        federationReactionEventIds: {
                            eventId: user.getUsername(),
                        },
                    },
                },
            };
            bridge.extractHomeserverOrigin.returns('localDomain');
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            yield service.sendExternalMessageUnReaction(message, { _id: 'id', username: user.getUsername() }, 'reaction');
            (0, chai_1.expect)(bridge.redactEvent.calledWith(room.getExternalId(), user.getExternalId(), 'eventId')).to.be.true;
            (0, chai_1.expect)(messageAdapter.unsetExternalFederationEventOnMessageReaction.calledWith('eventId', message, 'reaction')).to.be.true;
        }));
    });
});
