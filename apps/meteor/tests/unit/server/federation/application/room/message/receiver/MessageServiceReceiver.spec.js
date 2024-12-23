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
const MessageServiceReceiver_1 = require("../../../../../../../../server/services/federation/application/room/message/receiver/MessageServiceReceiver");
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
describe('Federation - Application - FederationMessageServiceReceiver', () => {
    let service;
    const roomAdapter = {
        getFederatedRoomByExternalId: sinon_1.default.stub(),
    };
    const userAdapter = {
        getFederatedUserByExternalId: sinon_1.default.stub(),
    };
    const messageAdapter = {
        getMessageByFederationId: sinon_1.default.stub(),
        reactToMessage: sinon_1.default.stub(),
    };
    const settingsAdapter = {
        getHomeServerDomain: sinon_1.default.stub().returns('localDomain'),
    };
    beforeEach(() => {
        service = new MessageServiceReceiver_1.FederationMessageServiceReceiver(roomAdapter, userAdapter, messageAdapter, {}, settingsAdapter, {});
    });
    afterEach(() => {
        roomAdapter.getFederatedRoomByExternalId.reset();
        userAdapter.getFederatedUserByExternalId.reset();
        messageAdapter.getMessageByFederationId.reset();
        messageAdapter.reactToMessage.reset();
    });
    describe('#onMessageReaction()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: false,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT react to the message if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            yield service.onMessageReaction({
                externalReactedEventId: 'externalReactedEventId',
            });
            (0, chai_1.expect)(messageAdapter.reactToMessage.called).to.be.false;
        }));
        it('should NOT react to the message if the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(undefined);
            yield service.onMessageReaction({
                externalReactedEventId: 'externalReactedEventId',
            });
            (0, chai_1.expect)(messageAdapter.reactToMessage.called).to.be.false;
        }));
        it('should NOT react to the message if the message does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            messageAdapter.getMessageByFederationId.resolves(undefined);
            yield service.onMessageReaction({
                externalReactedEventId: 'externalReactedEventId',
            });
            (0, chai_1.expect)(messageAdapter.reactToMessage.called).to.be.false;
        }));
        it('should NOT react to the message if it is not a Matrix federation one', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            messageAdapter.getMessageByFederationId.resolves({ msg: 'newMessageText' });
            yield service.onMessageReaction({
                externalReactedEventId: 'externalReactedEventId',
            });
            (0, chai_1.expect)(messageAdapter.reactToMessage.called).to.be.false;
        }));
        it('should NOT react to the message if the user already reacted to it', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            messageAdapter.getMessageByFederationId.resolves({
                msg: 'newMessageText',
                federation: { eventId: 'eventId' },
                reactions: {
                    ':emoji:': {
                        usernames: ['normalizedInviterId'],
                    },
                },
            });
            yield service.onMessageReaction({
                externalReactedEventId: 'externalReactedEventId',
                emoji: ':emoji:',
            });
            (0, chai_1.expect)(messageAdapter.reactToMessage.called).to.be.false;
        }));
        it('should react to the message', () => __awaiter(void 0, void 0, void 0, function* () {
            const message = {
                msg: 'newMessageText',
                federation: { eventId: 'eventId' },
                reactions: {
                    ':emoji:': {
                        usernames: [],
                    },
                },
            };
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUserByExternalId.resolves(user);
            messageAdapter.getMessageByFederationId.resolves(message);
            yield service.onMessageReaction({
                externalEventId: 'externalEventId',
                externalReactedEventId: 'externalReactedEventId',
                emoji: ':emoji:',
            });
            (0, chai_1.expect)(messageAdapter.reactToMessage.calledWith(user, message, ':emoji:', 'externalEventId')).to.be.true;
        }));
    });
});
