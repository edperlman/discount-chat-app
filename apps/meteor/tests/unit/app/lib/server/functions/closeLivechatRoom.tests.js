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
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const data_1 = require("../../../../../mocks/data");
const subscriptionsStub = {
    findOneByRoomIdAndUserId: sinon_1.default.stub(),
    removeByRoomId: sinon_1.default.stub(),
    countByRoomId: sinon_1.default.stub(),
};
const livechatRoomsStub = {
    findOneById: sinon_1.default.stub(),
};
const livechatStub = {
    closeRoom: sinon_1.default.stub(),
};
const hasPermissionStub = sinon_1.default.stub();
const { closeLivechatRoom } = proxyquire_1.default.noCallThru().load('../../../../../../app/lib/server/functions/closeLivechatRoom.ts', {
    '../../../livechat/server/lib/LivechatTyped': {
        Livechat: livechatStub,
    },
    '../../../authorization/server/functions/hasPermission': {
        hasPermissionAsync: hasPermissionStub,
    },
    '@rocket.chat/models': {
        Subscriptions: subscriptionsStub,
        LivechatRooms: livechatRoomsStub,
    },
});
(0, mocha_1.describe)('closeLivechatRoom', () => {
    const user = (0, data_1.createFakeUser)();
    const room = (0, data_1.createFakeRoom)({ t: 'l', open: true });
    const subscription = (0, data_1.createFakeSubscription)({ rid: room._id, u: { username: user.username, _id: user._id } });
    beforeEach(() => {
        subscriptionsStub.findOneByRoomIdAndUserId.reset();
        subscriptionsStub.removeByRoomId.reset();
        subscriptionsStub.countByRoomId.reset();
        livechatRoomsStub.findOneById.reset();
        livechatStub.closeRoom.reset();
        hasPermissionStub.reset();
    });
    (0, mocha_1.it)('should not perform any operation when an invalid room id is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatRoomsStub.findOneById.resolves(null);
        hasPermissionStub.resolves(true);
        yield (0, chai_1.expect)(closeLivechatRoom(user, room._id, {})).to.be.rejectedWith('error-invalid-room');
        (0, chai_1.expect)(livechatStub.closeRoom.notCalled).to.be.true;
        (0, chai_1.expect)(livechatRoomsStub.findOneById.calledOnceWith(room._id)).to.be.true;
        (0, chai_1.expect)(subscriptionsStub.findOneByRoomIdAndUserId.notCalled).to.be.true;
        (0, chai_1.expect)(subscriptionsStub.removeByRoomId.notCalled).to.be.true;
    }));
    (0, mocha_1.it)('should not perform any operation when a non-livechat room is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatRoomsStub.findOneById.resolves(Object.assign(Object.assign({}, room), { t: 'c' }));
        subscriptionsStub.findOneByRoomIdAndUserId.resolves(subscription);
        hasPermissionStub.resolves(true);
        yield (0, chai_1.expect)(closeLivechatRoom(user, room._id, {})).to.be.rejectedWith('error-invalid-room');
        (0, chai_1.expect)(livechatStub.closeRoom.notCalled).to.be.true;
        (0, chai_1.expect)(livechatRoomsStub.findOneById.calledOnceWith(room._id)).to.be.true;
        (0, chai_1.expect)(subscriptionsStub.findOneByRoomIdAndUserId.notCalled).to.be.true;
        (0, chai_1.expect)(subscriptionsStub.removeByRoomId.notCalled).to.be.true;
    }));
    (0, mocha_1.it)('should not perform any operation when a closed room with no subscriptions is provided and the caller is not subscribed to it', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatRoomsStub.findOneById.resolves(Object.assign(Object.assign({}, room), { open: false }));
        subscriptionsStub.removeByRoomId.resolves({ deletedCount: 0 });
        subscriptionsStub.findOneByRoomIdAndUserId.resolves(null);
        hasPermissionStub.resolves(true);
        yield (0, chai_1.expect)(closeLivechatRoom(user, room._id, {})).to.be.rejectedWith('error-room-already-closed');
        (0, chai_1.expect)(livechatStub.closeRoom.notCalled).to.be.true;
        (0, chai_1.expect)(livechatRoomsStub.findOneById.calledOnceWith(room._id)).to.be.true;
        (0, chai_1.expect)(subscriptionsStub.findOneByRoomIdAndUserId.notCalled).to.be.true;
        (0, chai_1.expect)(subscriptionsStub.removeByRoomId.calledOnceWith(room._id)).to.be.true;
    }));
    (0, mocha_1.it)('should remove dangling subscription when a closed room with subscriptions is provided and the caller is not subscribed to it', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatRoomsStub.findOneById.resolves(Object.assign(Object.assign({}, room), { open: false }));
        subscriptionsStub.removeByRoomId.resolves({ deletedCount: 1 });
        subscriptionsStub.findOneByRoomIdAndUserId.resolves(null);
        hasPermissionStub.resolves(true);
        yield closeLivechatRoom(user, room._id, {});
        (0, chai_1.expect)(livechatStub.closeRoom.notCalled).to.be.true;
        (0, chai_1.expect)(livechatRoomsStub.findOneById.calledOnceWith(room._id)).to.be.true;
        (0, chai_1.expect)(subscriptionsStub.findOneByRoomIdAndUserId.notCalled).to.be.true;
        (0, chai_1.expect)(subscriptionsStub.removeByRoomId.calledOnceWith(room._id)).to.be.true;
    }));
    (0, mocha_1.it)('should remove dangling subscription when a closed room is provided but the user is still subscribed to it', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatRoomsStub.findOneById.resolves(Object.assign(Object.assign({}, room), { open: false }));
        subscriptionsStub.findOneByRoomIdAndUserId.resolves(subscription);
        subscriptionsStub.removeByRoomId.resolves({ deletedCount: 1 });
        hasPermissionStub.resolves(true);
        yield closeLivechatRoom(user, room._id, {});
        (0, chai_1.expect)(livechatStub.closeRoom.notCalled).to.be.true;
        (0, chai_1.expect)(livechatRoomsStub.findOneById.calledOnceWith(room._id)).to.be.true;
        (0, chai_1.expect)(subscriptionsStub.findOneByRoomIdAndUserId.notCalled).to.be.true;
        (0, chai_1.expect)(subscriptionsStub.removeByRoomId.calledOnceWith(room._id)).to.be.true;
    }));
    (0, mocha_1.it)('should not perform any operation when the caller is not subscribed to an open room and does not have the permission to close others rooms', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatRoomsStub.findOneById.resolves(room);
        subscriptionsStub.findOneByRoomIdAndUserId.resolves(null);
        hasPermissionStub.resolves(false);
        yield (0, chai_1.expect)(closeLivechatRoom(user, room._id, {})).to.be.rejectedWith('error-not-authorized');
        (0, chai_1.expect)(livechatStub.closeRoom.notCalled).to.be.true;
        (0, chai_1.expect)(livechatRoomsStub.findOneById.calledOnceWith(room._id)).to.be.true;
        (0, chai_1.expect)(subscriptionsStub.findOneByRoomIdAndUserId.calledOnceWith(room._id, user._id)).to.be.true;
        (0, chai_1.expect)(subscriptionsStub.removeByRoomId.notCalled).to.be.true;
    }));
    (0, mocha_1.it)('should close the room when the caller is not subscribed to it but has the permission to close others rooms', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatRoomsStub.findOneById.resolves(room);
        subscriptionsStub.findOneByRoomIdAndUserId.resolves(null);
        hasPermissionStub.resolves(true);
        yield closeLivechatRoom(user, room._id, {});
        (0, chai_1.expect)(livechatStub.closeRoom.calledOnceWith(sinon_1.default.match({ room, user }))).to.be.true;
        (0, chai_1.expect)(livechatRoomsStub.findOneById.calledOnceWith(room._id)).to.be.true;
        (0, chai_1.expect)(subscriptionsStub.findOneByRoomIdAndUserId.calledOnceWith(room._id, user._id)).to.be.true;
        (0, chai_1.expect)(subscriptionsStub.removeByRoomId.notCalled).to.be.true;
    }));
    (0, mocha_1.it)('should close the room when the caller is subscribed to it and does not have the permission to close others rooms', () => __awaiter(void 0, void 0, void 0, function* () {
        livechatRoomsStub.findOneById.resolves(room);
        subscriptionsStub.findOneByRoomIdAndUserId.resolves(subscription);
        hasPermissionStub.resolves(false);
        yield closeLivechatRoom(user, room._id, {});
        (0, chai_1.expect)(livechatStub.closeRoom.calledOnceWith(sinon_1.default.match({ room, user }))).to.be.true;
        (0, chai_1.expect)(livechatRoomsStub.findOneById.calledOnceWith(room._id)).to.be.true;
        (0, chai_1.expect)(subscriptionsStub.findOneByRoomIdAndUserId.calledOnceWith(room._id, user._id)).to.be.true;
        (0, chai_1.expect)(subscriptionsStub.removeByRoomId.notCalled).to.be.true;
    }));
});
