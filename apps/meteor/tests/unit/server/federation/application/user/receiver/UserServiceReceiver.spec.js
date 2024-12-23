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
const { FederationUserServiceReceiver } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../../server/services/federation/application/user/receiver/UserServiceReceiver', {
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
const { FederatedRoom } = proxyquire_1.default.noCallThru().load('../../../../../../../server/services/federation/domain/FederatedRoom', {
    mongodb: {
        'ObjectId': class ObjectId {
            toHexString() {
                return 'hexString';
            }
        },
        '@global': true,
    },
});
describe('Federation - Application - FederationUserServiceReceiver', () => {
    let service;
    const roomAdapter = {
        getFederatedRoomByExternalId: sinon_1.default.stub(),
    };
    const userAdapter = {
        getFederatedUsersByExternalIds: sinon_1.default.stub(),
    };
    const settingsAdapter = {
        getHomeServerDomain: sinon_1.default.stub().returns('localDomain'),
    };
    const fileAdapter = {};
    const notificationAdapter = {
        notifyUserTypingOnRoom: sinon_1.default.stub(),
    };
    const bridge = {};
    beforeEach(() => {
        service = new FederationUserServiceReceiver(roomAdapter, userAdapter, fileAdapter, notificationAdapter, settingsAdapter, bridge);
    });
    afterEach(() => {
        roomAdapter.getFederatedRoomByExternalId.reset();
        userAdapter.getFederatedUsersByExternalIds.reset();
        notificationAdapter.notifyUserTypingOnRoom.reset();
        service.usersTypingByRoomIdCache.clear();
    });
    describe('#onUserTyping()', () => {
        const user = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: false,
        });
        const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT notify about the typing event internally if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(undefined);
            yield service.onUserTyping({});
            (0, chai_1.expect)(userAdapter.getFederatedUsersByExternalIds.called).to.be.false;
            (0, chai_1.expect)(notificationAdapter.notifyUserTypingOnRoom.called).to.be.false;
        }));
        it('should NOT notify about the typing nor not typing event internally there is no external users typing', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves({});
            userAdapter.getFederatedUsersByExternalIds.resolves([]);
            yield service.onUserTyping({
                externalRoomId: 'externalRoomId',
                externalUserIdsTyping: ['id1', 'id2', 'id3'],
            });
            (0, chai_1.expect)(notificationAdapter.notifyUserTypingOnRoom.called).to.be.false;
        }));
        it('should NOT notify about internally when all external users are still styping', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUsersByExternalIds.resolves([]);
            service.usersTypingByRoomIdCache.set('externalRoomId', [
                { externalUserId: 'id1', username: 'id1' },
                { externalUserId: 'id2', username: 'id2' },
                { externalUserId: 'id3', username: 'id3' },
            ]);
            yield service.onUserTyping({
                externalRoomId: 'externalRoomId',
                externalUserIdsTyping: ['id1', 'id2', 'id3'],
            });
            (0, chai_1.expect)(notificationAdapter.notifyUserTypingOnRoom.called).to.be.false;
            (0, chai_1.expect)(service.usersTypingByRoomIdCache.get('externalRoomId')).to.deep.equal([
                { externalUserId: 'id1', username: 'id1' },
                { externalUserId: 'id2', username: 'id2' },
                { externalUserId: 'id3', username: 'id3' },
            ]);
        }));
        it('should notify about internally when the external users stopped typing', () => __awaiter(void 0, void 0, void 0, function* () {
            const notTypingAnymore = ['id2', 'id3'];
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUsersByExternalIds.resolves([]);
            service.usersTypingByRoomIdCache.set('externalRoomId', [
                { externalUserId: 'id1', username: 'id1' },
                { externalUserId: 'id2', username: 'id2' },
                { externalUserId: 'id3', username: 'id3' },
            ]);
            yield service.onUserTyping({
                externalRoomId: 'externalRoomId',
                externalUserIdsTyping: ['id1'],
            });
            notTypingAnymore.forEach((username) => {
                (0, chai_1.expect)(notificationAdapter.notifyUserTypingOnRoom.calledWith('hexString', username, false)).to.be.true;
            });
            (0, chai_1.expect)(service.usersTypingByRoomIdCache.get('externalRoomId')).to.deep.equal([{ externalUserId: 'id1', username: 'id1' }]);
        }));
        it('should notify about internally when one users stopped typing and other started it', () => __awaiter(void 0, void 0, void 0, function* () {
            const notTypingAnymore = ['id3', 'id4'];
            const startedTyping = ['id1', 'id2'];
            const user1 = FederatedUser.createWithInternalReference('!externalId@id1', true, { _id: 'id1', username: 'id1' });
            const user2 = FederatedUser.createWithInternalReference('!externalId@id2', true, { _id: 'id2', username: 'id2' });
            roomAdapter.getFederatedRoomByExternalId.resolves(room);
            userAdapter.getFederatedUsersByExternalIds.resolves([user1, user2]);
            service.usersTypingByRoomIdCache.set('externalRoomId', [
                { externalUserId: 'id1', username: 'id1' },
                { externalUserId: 'id2', username: 'id2' },
                { externalUserId: 'id3', username: 'id3' },
                { externalUserId: 'id4', username: 'id4' },
            ]);
            yield service.onUserTyping({
                externalRoomId: 'externalRoomId',
                externalUserIdsTyping: ['id1', 'id2'],
            });
            notTypingAnymore.forEach((username) => {
                (0, chai_1.expect)(notificationAdapter.notifyUserTypingOnRoom.calledWith('hexString', username, false)).to.be.true;
            });
            startedTyping.forEach((username) => {
                (0, chai_1.expect)(notificationAdapter.notifyUserTypingOnRoom.calledWith('hexString', username, true)).to.be.true;
            });
            (0, chai_1.expect)(service.usersTypingByRoomIdCache.get('externalRoomId')).to.deep.equal([
                { externalUserId: 'id1', username: 'id1' },
                { externalUserId: 'id2', username: 'id2' },
            ]);
        }));
    });
});
