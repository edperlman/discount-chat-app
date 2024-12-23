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
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const afterLeaveRoomCallback_1 = require("../../../../../../../lib/callbacks/afterLeaveRoomCallback");
const afterRemoveFromRoomCallback_1 = require("../../../../../../../lib/callbacks/afterRemoveFromRoomCallback");
const remove = sinon_1.default.stub();
const throwIfFederationNotEnabledOrNotReady = sinon_1.default.stub();
const throwIfFederationNotReady = sinon_1.default.stub();
const isFederationEnabled = sinon_1.default.stub();
const hooks = {};
const { FederationHooks } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../../server/services/federation/infrastructure/rocket-chat/hooks', {
    'meteor/meteor': {
        '@global': true,
    },
    '@rocket.chat/random': {
        '@global': true,
    },
    '../../../../../../lib/callbacks': {
        callbacks: {
            priority: { HIGH: 'high' },
            remove,
            add: (_name, callback, _priority, _id) => {
                hooks[_id] = callback;
            },
        },
    },
    '../../../../../../lib/callbacks/afterLeaveRoomCallback': {
        afterLeaveRoomCallback: afterLeaveRoomCallback_1.afterLeaveRoomCallback,
    },
    '../../../../../../lib/callbacks/afterRemoveFromRoomCallback': {
        afterRemoveFromRoomCallback: afterRemoveFromRoomCallback_1.afterRemoveFromRoomCallback,
    },
    '../../../utils': {
        throwIfFederationNotEnabledOrNotReady,
        throwIfFederationNotReady,
        isFederationEnabled,
    },
});
describe('Federation - Infrastructure - RocketChat - Hooks', () => {
    beforeEach(() => {
        FederationHooks.removeAllListeners();
        remove.reset();
        throwIfFederationNotEnabledOrNotReady.reset();
        throwIfFederationNotReady.reset();
        isFederationEnabled.reset();
    });
    describe('#afterUserLeaveRoom()', () => {
        it('should NOT execute the callback if no room was provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon_1.default.stub();
            FederationHooks.afterUserLeaveRoom(stub);
            // @ts-expect-error
            yield afterLeaveRoomCallback_1.afterLeaveRoomCallback.run();
            (0, chai_1.expect)(stub.called).to.be.false;
        }));
        it('should NOT execute the callback if the provided room is not federated', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon_1.default.stub();
            FederationHooks.afterUserLeaveRoom(stub);
            // @ts-expect-error
            yield afterLeaveRoomCallback_1.afterLeaveRoomCallback.run({}, {});
            (0, chai_1.expect)(stub.called).to.be.false;
        }));
        it('should NOT execute the callback if no user was provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon_1.default.stub();
            FederationHooks.afterUserLeaveRoom(stub);
            // @ts-expect-error
            yield afterLeaveRoomCallback_1.afterLeaveRoomCallback.run(undefined, { federated: true });
            (0, chai_1.expect)(stub.called).to.be.false;
        }));
        it('should NOT execute the callback if federation module was disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error();
            throwIfFederationNotEnabledOrNotReady.throws(error);
            const stub = sinon_1.default.stub();
            FederationHooks.afterUserLeaveRoom(stub);
            // @ts-expect-error
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            (0, chai_1.expect)(afterLeaveRoomCallback_1.afterLeaveRoomCallback.run({}, { federated: true })).to.have.rejectedWith(error);
            (0, chai_1.expect)(stub.called).to.be.false;
        }));
        it('should execute the callback when everything is correct', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon_1.default.stub();
            FederationHooks.afterUserLeaveRoom(stub);
            // @ts-expect-error
            yield afterLeaveRoomCallback_1.afterLeaveRoomCallback.run({}, { federated: true });
            (0, chai_1.expect)(stub.calledWith({}, { federated: true })).to.be.true;
        }));
    });
    describe('#onUserRemovedFromRoom()', () => {
        it('should NOT execute the callback if no room was provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon_1.default.stub();
            FederationHooks.onUserRemovedFromRoom(stub);
            // @ts-expect-error
            yield afterRemoveFromRoomCallback_1.afterRemoveFromRoomCallback.run();
            (0, chai_1.expect)(stub.called).to.be.false;
        }));
        it('should NOT execute the callback if the provided room is not federated', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon_1.default.stub();
            FederationHooks.onUserRemovedFromRoom(stub);
            // @ts-expect-error
            yield afterRemoveFromRoomCallback_1.afterRemoveFromRoomCallback.run({}, {});
            (0, chai_1.expect)(stub.called).to.be.false;
        }));
        it('should NOT execute the callback if no params were provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon_1.default.stub();
            FederationHooks.onUserRemovedFromRoom(stub);
            // @ts-expect-error
            yield afterRemoveFromRoomCallback_1.afterRemoveFromRoomCallback.run({}, { federated: true });
            (0, chai_1.expect)(stub.called).to.be.false;
        }));
        it('should NOT execute the callback if no removedUser was provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon_1.default.stub();
            FederationHooks.onUserRemovedFromRoom(stub);
            // @ts-expect-error
            yield afterRemoveFromRoomCallback_1.afterRemoveFromRoomCallback.run({}, { federated: true }, {});
            (0, chai_1.expect)(stub.called).to.be.false;
        }));
        it('should NOT execute the callback if no userWhoRemoved was provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon_1.default.stub();
            FederationHooks.onUserRemovedFromRoom(stub);
            // @ts-expect-error
            yield afterRemoveFromRoomCallback_1.afterRemoveFromRoomCallback.run({ removedUser: 'removedUser' }, { federated: true });
            (0, chai_1.expect)(stub.called).to.be.false;
        }));
        it('should NOT execute the callback if federation module was disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error();
            throwIfFederationNotEnabledOrNotReady.throws(error);
            const stub = sinon_1.default.stub();
            FederationHooks.onUserRemovedFromRoom(stub);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            (0, chai_1.expect)(
            // @ts-ignore-error
            afterRemoveFromRoomCallback_1.afterRemoveFromRoomCallback.run({ removedUser: 'removedUser', userWhoRemoved: 'userWhoRemoved' }, { federated: true })).to.have.rejectedWith(error);
            (0, chai_1.expect)(stub.called).to.be.false;
        }));
        it('should execute the callback when everything is correct', () => __awaiter(void 0, void 0, void 0, function* () {
            const stub = sinon_1.default.stub();
            FederationHooks.onUserRemovedFromRoom(stub);
            // @ts-expect-error
            yield afterRemoveFromRoomCallback_1.afterRemoveFromRoomCallback.run({ removedUser: 'removedUser', userWhoRemoved: 'userWhoRemoved' }, { federated: true });
            (0, chai_1.expect)(stub.calledWith('removedUser', { federated: true }, 'userWhoRemoved')).to.be.true;
        }));
    });
    describe('#canAddFederatedUserToNonFederatedRoom()', () => {
        it('should NOT execute the callback if no room was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.canAddFederatedUserToNonFederatedRoom(stub);
            hooks['federation-v2-can-add-federated-user-to-non-federated-room']();
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if no params were provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.canAddFederatedUserToNonFederatedRoom(stub);
            hooks['federation-v2-can-add-federated-user-to-non-federated-room']({}, { federated: true });
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if no user was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.canAddFederatedUserToNonFederatedRoom(stub);
            hooks['federation-v2-can-add-federated-user-to-non-federated-room']({}, { federated: true }, {});
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should execute the callback when everything is correct', () => {
            isFederationEnabled.returns(true);
            const stub = sinon_1.default.stub();
            FederationHooks.canAddFederatedUserToNonFederatedRoom(stub);
            hooks['federation-v2-can-add-federated-user-to-non-federated-room']({ user: 'user' }, { federated: true });
            (0, chai_1.expect)(stub.calledWith('user', { federated: true })).to.be.true;
        });
    });
    describe('#canAddFederatedUserToFederatedRoom()', () => {
        it('should NOT execute the callback if no room was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.canAddFederatedUserToFederatedRoom(stub);
            hooks['federation-v2-can-add-federated-user-to-federated-room']();
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if no params were provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.canAddFederatedUserToFederatedRoom(stub);
            hooks['federation-v2-can-add-federated-user-to-federated-room']({}, { federated: true });
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if no user was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.canAddFederatedUserToFederatedRoom(stub);
            hooks['federation-v2-can-add-federated-user-to-federated-room']({}, { federated: true }, {});
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if no inviter was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.canAddFederatedUserToFederatedRoom(stub);
            hooks['federation-v2-can-add-federated-user-to-federated-room']({ user: 'user' }, { federated: true }, {});
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if federation module was disabled', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.canAddFederatedUserToFederatedRoom(stub);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            hooks['federation-v2-can-add-federated-user-to-federated-room']({ user: 'user', inviter: 'inviter' }, { federated: true });
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should execute the callback when everything is correct', () => {
            isFederationEnabled.returns(true);
            const stub = sinon_1.default.stub();
            FederationHooks.canAddFederatedUserToFederatedRoom(stub);
            hooks['federation-v2-can-add-federated-user-to-federated-room']({ user: 'user', inviter: 'inviter' }, { federated: true });
            (0, chai_1.expect)(stub.calledWith('user', 'inviter', { federated: true })).to.be.true;
        });
    });
    describe('#canCreateDirectMessageFromUI()', () => {
        it('should NOT execute the callback if no members was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.canCreateDirectMessageFromUI(stub);
            hooks['federation-v2-can-create-direct-message-from-ui-ce']();
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if federation module was disabled', () => {
            const error = new Error();
            throwIfFederationNotEnabledOrNotReady.throws(error);
            const stub = sinon_1.default.stub();
            FederationHooks.canCreateDirectMessageFromUI(stub);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            (0, chai_1.expect)(hooks['federation-v2-can-create-direct-message-from-ui-ce']([])).to.have.rejectedWith(error);
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should execute the callback when everything is correct', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.canCreateDirectMessageFromUI(stub);
            hooks['federation-v2-can-create-direct-message-from-ui-ce']([]);
            (0, chai_1.expect)(stub.calledWith([])).to.be.true;
        });
    });
    describe('#afterMessageReacted()', () => {
        it('should NOT execute the callback if no message was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageReacted(stub);
            hooks['federation-v2-after-message-reacted']();
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if the provided message is not from a federated room', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageReacted(stub);
            hooks['federation-v2-after-message-reacted']({});
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if no params were provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageReacted(stub);
            hooks['federation-v2-after-message-reacted']({ federation: { eventId: 'eventId' } }, {});
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if no user was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageReacted(stub);
            hooks['federation-v2-after-message-reacted']({ federation: { eventId: 'eventId' } }, { federated: true }, {});
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if no reaction was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageReacted(stub);
            hooks['federation-v2-after-message-reacted']({ federation: { eventId: 'eventId' } }, { user: 'user' });
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if federation module was disabled', () => {
            const error = new Error();
            throwIfFederationNotEnabledOrNotReady.throws(error);
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageReacted(stub);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            (0, chai_1.expect)(hooks['federation-v2-after-message-reacted']({ federation: { eventId: 'eventId' } }, { user: 'user', reaction: 'reaction' })).to.have.rejectedWith(error);
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should execute the callback when everything is correct', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageReacted(stub);
            hooks['federation-v2-after-message-reacted']({ federation: { eventId: 'eventId' } }, { user: 'user', reaction: 'reaction' });
            (0, chai_1.expect)(stub.calledWith({ federation: { eventId: 'eventId' } }, 'user', 'reaction')).to.be.true;
        });
    });
    describe('#afterMessageunReacted()', () => {
        it('should NOT execute the callback if no message was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageunReacted(stub);
            hooks['federation-v2-after-message-unreacted']();
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if the provided message is not from a federated room', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageunReacted(stub);
            hooks['federation-v2-after-message-unreacted']({});
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if no params were provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageunReacted(stub);
            hooks['federation-v2-after-message-unreacted']({ federation: { eventId: 'eventId' } }, {});
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if no user was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageunReacted(stub);
            hooks['federation-v2-after-message-unreacted']({ federation: { eventId: 'eventId' } }, { federated: true }, {});
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if no reaction was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageunReacted(stub);
            hooks['federation-v2-after-message-unreacted']({ federation: { eventId: 'eventId' } }, { user: 'user' });
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if no oldMessage was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageunReacted(stub);
            hooks['federation-v2-after-message-unreacted']({ federation: { eventId: 'eventId' } }, { user: 'user', reaction: 'reaction' });
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if federation module was disabled', () => {
            const error = new Error();
            throwIfFederationNotEnabledOrNotReady.throws(error);
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageunReacted(stub);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            (0, chai_1.expect)(hooks['federation-v2-after-message-unreacted']({ federation: { eventId: 'eventId' } }, { user: 'user', reaction: 'reaction', oldMessage: {} })).to.have.rejectedWith(error);
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should execute the callback when everything is correct', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageunReacted(stub);
            hooks['federation-v2-after-message-unreacted']({ federation: { eventId: 'eventId' } }, { user: 'user', reaction: 'reaction', oldMessage: {} });
            (0, chai_1.expect)(stub.calledWith({}, 'user', 'reaction')).to.be.true;
        });
    });
    describe('#afterMessageDeleted()', () => {
        it('should NOT execute the callback if no room was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageDeleted(stub);
            hooks['federation-v2-after-room-message-deleted']();
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if the provided room is not federated', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageDeleted(stub);
            hooks['federation-v2-after-room-message-deleted']({}, {});
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if the provided message is not from a federated room', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageDeleted(stub);
            hooks['federation-v2-after-room-message-deleted']({}, { federated: true });
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if federation module was disabled', () => {
            const error = new Error();
            throwIfFederationNotEnabledOrNotReady.throws(error);
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageDeleted(stub);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            (0, chai_1.expect)(hooks['federation-v2-after-room-message-deleted']({ federation: { eventId: 'eventId' } }, { federated: true })).to.have.rejectedWith(error);
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should execute the callback when everything is correct', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageDeleted(stub);
            hooks['federation-v2-after-room-message-deleted']({ federation: { eventId: 'eventId' } }, { federated: true, _id: 'roomId' });
            (0, chai_1.expect)(stub.calledWith({ federation: { eventId: 'eventId' } }, 'roomId')).to.be.true;
        });
    });
    describe('#afterMessageUpdated()', () => {
        it('should NOT execute the callback if no room was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageUpdated(stub);
            hooks['federation-v2-after-room-message-updated']();
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if the provided room is not federated', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageUpdated(stub);
            hooks['federation-v2-after-room-message-updated']({}, {});
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if the provided message is not from a federated room', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageUpdated(stub);
            hooks['federation-v2-after-room-message-updated']({}, { federated: true });
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if federation module was disabled', () => {
            const error = new Error();
            throwIfFederationNotEnabledOrNotReady.throws(error);
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageUpdated(stub);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            (0, chai_1.expect)(hooks['federation-v2-after-room-message-updated']({ federation: { eventId: 'eventId' } }, { federated: true })).to.have.rejectedWith(error);
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if the message is not a edited one', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageUpdated(stub);
            hooks['federation-v2-after-room-message-updated']({ federation: { eventId: 'eventId' } }, { federated: true });
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should execute the callback when everything is correct', () => {
            const editedAt = faker_1.faker.date.recent();
            const editedBy = { _id: 'userId' };
            const message = { federation: { eventId: 'eventId' }, editedAt, editedBy };
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageUpdated(stub);
            hooks['federation-v2-after-room-message-updated'](message, { room: { federated: true, _id: 'roomId' } });
            (0, chai_1.expect)(stub.calledWith(message, 'roomId', 'userId')).to.be.true;
        });
    });
    describe('#afterMessageSent()', () => {
        it('should NOT execute the callback if no room was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageSent(stub);
            hooks['federation-v2-after-room-message-sent']();
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if the provided room is not federated', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageSent(stub);
            hooks['federation-v2-after-room-message-sent']({}, {});
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if federation module was disabled', () => {
            const error = new Error();
            throwIfFederationNotEnabledOrNotReady.throws(error);
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageSent(stub);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            (0, chai_1.expect)(hooks['federation-v2-after-room-message-sent']({}, { federated: true })).to.have.rejectedWith(error);
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if the message is edited one', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageSent(stub);
            const editedAt = faker_1.faker.date.recent();
            const editedBy = { _id: 'userId' };
            hooks['federation-v2-after-room-message-sent']({ editedAt, editedBy }, { federated: true });
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should execute the callback when everything is correct', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterMessageSent(stub);
            hooks['federation-v2-after-room-message-sent']({ u: { _id: 'userId' } }, { room: { federated: true, _id: 'roomId' } });
            (0, chai_1.expect)(stub.calledWith({ u: { _id: 'userId' } }, 'roomId', 'userId')).to.be.true;
        });
    });
    describe('#afterRoomRoleChanged', () => {
        const handlers = {
            onRoomOwnerAdded: sinon_1.default.stub(),
            onRoomOwnerRemoved: sinon_1.default.stub(),
            onRoomModeratorAdded: sinon_1.default.stub(),
            onRoomModeratorRemoved: sinon_1.default.stub(),
        };
        afterEach(() => {
            handlers.onRoomOwnerAdded.reset();
            handlers.onRoomOwnerRemoved.reset();
            handlers.onRoomModeratorAdded.reset();
            handlers.onRoomModeratorRemoved.reset();
        });
        it('should NOT call the handler if the event is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            yield FederationHooks.afterRoomRoleChanged(handlers, undefined);
            (0, chai_1.expect)(handlers.onRoomOwnerAdded.called).to.be.false;
            (0, chai_1.expect)(handlers.onRoomOwnerRemoved.called).to.be.false;
            (0, chai_1.expect)(handlers.onRoomModeratorAdded.called).to.be.false;
            (0, chai_1.expect)(handlers.onRoomModeratorRemoved.called).to.be.false;
        }));
        it('should NOT call the Federation module is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            isFederationEnabled.returns(false);
            yield FederationHooks.afterRoomRoleChanged(handlers, undefined);
            (0, chai_1.expect)(handlers.onRoomOwnerAdded.called).to.be.false;
            (0, chai_1.expect)(handlers.onRoomOwnerRemoved.called).to.be.false;
            (0, chai_1.expect)(handlers.onRoomModeratorAdded.called).to.be.false;
            (0, chai_1.expect)(handlers.onRoomModeratorRemoved.called).to.be.false;
        }));
        it('should NOT call the handler if the event is not for roles we are interested in on Federation', () => __awaiter(void 0, void 0, void 0, function* () {
            isFederationEnabled.returns(true);
            // verifyFederationReady doesn't throw by default in here
            yield FederationHooks.afterRoomRoleChanged(handlers, { _id: 'not-interested' });
            (0, chai_1.expect)(handlers.onRoomOwnerAdded.called).to.be.false;
            (0, chai_1.expect)(handlers.onRoomOwnerRemoved.called).to.be.false;
            (0, chai_1.expect)(handlers.onRoomModeratorAdded.called).to.be.false;
            (0, chai_1.expect)(handlers.onRoomModeratorRemoved.called).to.be.false;
        }));
        it('should NOT call the handler there is no handler for the event', () => __awaiter(void 0, void 0, void 0, function* () {
            isFederationEnabled.returns(true);
            yield FederationHooks.afterRoomRoleChanged(handlers, { _id: 'owner', type: 'not-existing-type' });
            (0, chai_1.expect)(handlers.onRoomOwnerAdded.called).to.be.false;
            (0, chai_1.expect)(handlers.onRoomOwnerRemoved.called).to.be.false;
            (0, chai_1.expect)(handlers.onRoomModeratorAdded.called).to.be.false;
            (0, chai_1.expect)(handlers.onRoomModeratorRemoved.called).to.be.false;
        }));
        ['owner-added', 'owner-removed', 'moderator-added', 'moderator-removed'].forEach((type) => {
            const internalRoomId = 'internalRoomId';
            const internalTargetUserId = 'internalTargetUserId';
            const internalUserId = 'internalUserId';
            it(`should call the handler for the event ${type}`, () => __awaiter(void 0, void 0, void 0, function* () {
                isFederationEnabled.returns(true);
                yield FederationHooks.afterRoomRoleChanged(handlers, {
                    _id: type.split('-')[0],
                    type: type.split('-')[1],
                    scope: internalRoomId,
                    u: { _id: internalTargetUserId },
                    givenByUserId: internalUserId,
                });
                (0, chai_1.expect)(handlers[`onRoom${type.charAt(0).toUpperCase() + type.slice(1).replace(/-./g, (x) => x[1].toUpperCase())}`].calledWith(internalUserId, internalTargetUserId, internalRoomId)).to.be.true;
            }));
        });
    });
    describe('#afterRoomNameChanged()', () => {
        it('should NOT execute the callback if no params was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterRoomNameChanged(stub);
            hooks['federation-v2-after-room-name-changed']();
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if no roomId was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterRoomNameChanged(stub);
            hooks['federation-v2-after-room-name-changed']({});
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if no roomName was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterRoomNameChanged(stub);
            hooks['federation-v2-after-room-name-changed']({ rid: 'roomId' });
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if federation module was disabled', () => {
            const error = new Error();
            throwIfFederationNotEnabledOrNotReady.throws(error);
            const stub = sinon_1.default.stub();
            FederationHooks.afterRoomNameChanged(stub);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            (0, chai_1.expect)(hooks['federation-v2-after-room-name-changed']({ rid: 'roomId', name: 'roomName' })).to.have.rejectedWith(error);
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should execute the callback when everything is correct', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterRoomNameChanged(stub);
            hooks['federation-v2-after-room-name-changed']({ rid: 'roomId', name: 'roomName' });
            (0, chai_1.expect)(stub.calledWith('roomId', 'roomName')).to.be.true;
        });
    });
    describe('#afterRoomTopicChanged()', () => {
        it('should NOT execute the callback if no params was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterRoomTopicChanged(stub);
            hooks['federation-v2-after-room-topic-changed']();
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if no roomId was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterRoomTopicChanged(stub);
            hooks['federation-v2-after-room-topic-changed']({});
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if no topic was provided', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterRoomTopicChanged(stub);
            hooks['federation-v2-after-room-topic-changed']({ rid: 'roomId' });
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should NOT execute the callback if federation module was disabled', () => {
            const error = new Error();
            throwIfFederationNotEnabledOrNotReady.throws(error);
            const stub = sinon_1.default.stub();
            FederationHooks.afterRoomTopicChanged(stub);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            (0, chai_1.expect)(hooks['federation-v2-after-room-topic-changed']({ rid: 'roomId', topic: 'topic' })).to.have.rejectedWith(error);
            (0, chai_1.expect)(stub.called).to.be.false;
        });
        it('should execute the callback when everything is correct', () => {
            const stub = sinon_1.default.stub();
            FederationHooks.afterRoomTopicChanged(stub);
            hooks['federation-v2-after-room-topic-changed']({ rid: 'roomId', topic: 'topic' });
            (0, chai_1.expect)(stub.calledWith('roomId', 'topic')).to.be.true;
        });
    });
    describe('#removeCEValidation()', () => {
        it('should remove the specific validation for CE environments', () => {
            FederationHooks.removeCEValidation();
            (0, chai_1.expect)(remove.calledTwice).to.be.equal(true);
            (0, chai_1.expect)(remove.firstCall.calledWith('federation.beforeAddUserToARoom', 'federation-v2-can-add-federated-user-to-federated-room')).to.be.equal(true);
            (0, chai_1.expect)(remove.secondCall.calledWith('federation.beforeCreateDirectMessage', 'federation-v2-can-create-direct-message-from-ui-ce')).to.be.equal(true);
        });
    });
    describe('#removeAllListeners()', () => {
        it('should remove all the listeners', () => {
            FederationHooks.removeAllListeners();
            (0, chai_1.expect)(remove.callCount).to.be.equal(11);
            (0, chai_1.expect)(remove.getCall(0).calledWith('federation.beforeAddUserToARoom', 'federation-v2-can-add-federated-user-to-non-federated-room')).to.be.equal(true);
            (0, chai_1.expect)(remove.getCall(1).calledWith('federation.beforeAddUserToARoom', 'federation-v2-can-add-federated-user-to-federated-room')).to.be.equal(true);
            (0, chai_1.expect)(remove.getCall(2).calledWith('federation.beforeCreateDirectMessage', 'federation-v2-can-create-direct-message-from-ui-ce')).to.be.equal(true);
            (0, chai_1.expect)(remove.getCall(3).calledWith('afterSetReaction', 'federation-v2-after-message-reacted')).to.be.equal(true);
            (0, chai_1.expect)(remove.getCall(4).calledWith('afterUnsetReaction', 'federation-v2-after-message-unreacted')).to.be.equal(true);
            (0, chai_1.expect)(remove.getCall(5).calledWith('afterDeleteMessage', 'federation-v2-after-room-message-deleted')).to.be.equal(true);
            (0, chai_1.expect)(remove.getCall(6).calledWith('afterSaveMessage', 'federation-v2-after-room-message-updated')).to.be.equal(true);
            (0, chai_1.expect)(remove.getCall(7).calledWith('afterSaveMessage', 'federation-v2-after-room-message-sent')).to.be.equal(true);
            (0, chai_1.expect)(remove.getCall(8).calledWith('afterSaveMessage', 'federation-v2-after-room-message-sent')).to.be.equal(true);
            (0, chai_1.expect)(remove.getCall(9).calledWith('afterRoomNameChange', 'federation-v2-after-room-name-changed')).to.be.equal(true);
            (0, chai_1.expect)(remove.getCall(10).calledWith('afterRoomTopicChange', 'federation-v2-after-room-topic-changed')).to.be.equal(true);
        });
    });
});
