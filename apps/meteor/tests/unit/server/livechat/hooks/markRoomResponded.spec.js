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
const models = {
    LivechatVisitors: { isVisitorActiveOnPeriod: sinon_1.default.stub(), markVisitorActiveForPeriod: sinon_1.default.stub() },
    LivechatInquiry: { markInquiryActiveForPeriod: sinon_1.default.stub() },
    LivechatRooms: {
        getVisitorActiveForPeriodUpdateQuery: sinon_1.default.stub(),
        getAgentLastMessageTsUpdateQuery: sinon_1.default.stub(),
        getResponseByRoomIdUpdateQuery: sinon_1.default.stub(),
    },
};
const { markRoomResponded } = proxyquire_1.default.load('../../../../../app/livechat/server/hooks/markRoomResponded.ts', {
    '../../../../lib/callbacks': { callbacks: { add: sinon_1.default.stub(), priority: { HIGH: 'high' } } },
    '../../../lib/server/lib/notifyListener': { notifyOnLivechatInquiryChanged: sinon_1.default.stub() },
    '@rocket.chat/models': models,
});
(0, mocha_1.describe)('markRoomResponded', () => {
    (0, mocha_1.beforeEach)(() => {
        models.LivechatVisitors.isVisitorActiveOnPeriod.reset();
        models.LivechatVisitors.markVisitorActiveForPeriod.reset();
        models.LivechatInquiry.markInquiryActiveForPeriod.reset();
        models.LivechatRooms.getVisitorActiveForPeriodUpdateQuery.reset();
        models.LivechatRooms.getAgentLastMessageTsUpdateQuery.reset();
        models.LivechatRooms.getResponseByRoomIdUpdateQuery.reset();
    });
    (0, mocha_1.it)('should return void if message is system message', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = {
            t: 'livechat-started',
        };
        const room = {};
        const res = yield markRoomResponded(message, room, {});
        (0, chai_1.expect)(res).to.be.undefined;
    }));
    (0, mocha_1.it)('should return void if message is edited message', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = {
            editedAt: new Date(),
            editedBy: { _id: '123' },
        };
        const room = {};
        const res = yield markRoomResponded(message, room, {});
        (0, chai_1.expect)(res).to.be.undefined;
    }));
    (0, mocha_1.it)('should return void if message is from visitor', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = {
            token: 'token',
        };
        const room = {};
        const res = yield markRoomResponded(message, room, {});
        (0, chai_1.expect)(res).to.be.undefined;
    }));
    (0, mocha_1.it)('should try to mark visitor as active for current period', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = {};
        const room = { v: { _id: '1234' } };
        yield markRoomResponded(message, room, {});
        (0, chai_1.expect)(models.LivechatVisitors.markVisitorActiveForPeriod.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)('should try to mark inquiry as active for current period when room.v.activity doesnt include current period', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = {};
        const room = { v: { activity: [] } };
        models.LivechatInquiry.markInquiryActiveForPeriod.resolves({});
        yield markRoomResponded(message, room, {});
        (0, chai_1.expect)(models.LivechatInquiry.markInquiryActiveForPeriod.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)('should return room.responseBy when room is not waiting for response', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = {};
        const room = { v: { _id: '1234' }, waitingResponse: false, responseBy: { _id: '1234' } };
        const res = yield markRoomResponded(message, room, {});
        (0, chai_1.expect)(res).to.be.equal(room.responseBy);
        (0, chai_1.expect)(models.LivechatRooms.getAgentLastMessageTsUpdateQuery.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)('should try to update the lastMessageTs property when a room was already answered by an agent', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = { u: { _id: '1234', username: 'username' }, ts: new Date() };
        const room = { responseBy: { _id: '1234' }, v: { _id: '1234' } };
        const res = yield markRoomResponded(message, room, {});
        (0, chai_1.expect)(res).to.be.deep.equal(room.responseBy);
        (0, chai_1.expect)(models.LivechatRooms.getAgentLastMessageTsUpdateQuery.calledOnce).to.be.true;
    }));
    (0, mocha_1.it)('should add a new responseBy object when room is waiting for response', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = { u: { _id: '1234', username: 'username' }, ts: new Date() };
        const room = { waitingResponse: true, v: { _id: '1234' } };
        const res = yield markRoomResponded(message, room, {});
        (0, chai_1.expect)(res).to.be.deep.equal({ _id: '1234', username: 'username', firstResponseTs: message.ts, lastMessageTs: message.ts });
        (0, chai_1.expect)(models.LivechatRooms.getResponseByRoomIdUpdateQuery.calledOnce).to.be.true;
        (0, chai_1.expect)(models.LivechatRooms.getResponseByRoomIdUpdateQuery.getCall(0).args[0]).to.be.deep.equal({
            _id: '1234',
            lastMessageTs: message.ts,
            firstResponseTs: message.ts,
            username: 'username',
        });
    }));
    // This should never happpen on the wild, checking because of a data inconsistency bug found
    (0, mocha_1.it)('should update only the lastMessageTs property when a room has both waitingResponse and responseBy properties', () => __awaiter(void 0, void 0, void 0, function* () {
        const message = { u: { _id: '1234', username: 'username' }, ts: new Date() };
        const room = {
            waitingResponse: true,
            responseBy: { _id: '1234', username: 'username', firstResponseTs: new Date() },
            v: { _id: '1234' },
        };
        const res = yield markRoomResponded(message, room, {});
        (0, chai_1.expect)(res).to.be.deep.equal({
            _id: '1234',
            username: 'username',
            firstResponseTs: room.responseBy.firstResponseTs,
            lastMessageTs: message.ts,
        });
    }));
});
