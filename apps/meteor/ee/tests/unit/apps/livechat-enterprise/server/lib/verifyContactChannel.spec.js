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
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const modelsMock = {
    LivechatContacts: {
        updateContactChannel: sinon_1.default.stub(),
    },
    LivechatRooms: {
        update: sinon_1.default.stub(),
        findOneById: sinon_1.default.stub(),
    },
    LivechatInquiry: {
        findOneByRoomId: sinon_1.default.stub(),
        saveQueueInquiry: sinon_1.default.stub(),
    },
};
const sessionMock = {
    startTransaction: sinon_1.default.stub(),
    commitTransaction: sinon_1.default.stub(),
    abortTransaction: sinon_1.default.stub(),
    endSession: sinon_1.default.stub(),
};
const clientMock = {
    startSession: sinon_1.default.stub().returns(sessionMock),
};
const mergeContactsStub = sinon_1.default.stub();
const queueManager = {
    processNewInquiry: sinon_1.default.stub(),
    verifyInquiry: sinon_1.default.stub(),
};
const { runVerifyContactChannel } = proxyquire_1.default.noCallThru().load('../../../../../../server/patches/verifyContactChannel', {
    '../../../app/livechat/server/lib/contacts/mergeContacts': { mergeContacts: mergeContactsStub },
    '../../../app/livechat/server/lib/contacts/verifyContactChannel': { verifyContactChannel: { patch: sinon_1.default.stub() } },
    '../../../app/livechat/server/lib/QueueManager': { QueueManager: queueManager },
    '../../../server/database/utils': { client: clientMock },
    '../../../app/livechat-enterprise/server/lib/logger': { logger: { info: sinon_1.default.stub(), debug: sinon_1.default.stub() } },
    '@rocket.chat/models': modelsMock,
});
describe('verifyContactChannel', () => {
    beforeEach(() => {
        modelsMock.LivechatContacts.updateContactChannel.reset();
        modelsMock.LivechatRooms.update.reset();
        modelsMock.LivechatInquiry.findOneByRoomId.reset();
        modelsMock.LivechatRooms.findOneById.reset();
        sessionMock.startTransaction.reset();
        sessionMock.commitTransaction.reset();
        sessionMock.abortTransaction.reset();
        sessionMock.endSession.reset();
        mergeContactsStub.reset();
        queueManager.processNewInquiry.reset();
        queueManager.verifyInquiry.reset();
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it('should be able to verify a contact channel', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatInquiry.findOneByRoomId.resolves({ _id: 'inquiryId', status: 'verifying' });
        modelsMock.LivechatRooms.findOneById.resolves({ _id: 'roomId', source: { type: 'sms' } });
        mergeContactsStub.resolves({ _id: 'contactId' });
        yield runVerifyContactChannel(() => undefined, {
            contactId: 'contactId',
            field: 'field',
            value: 'value',
            visitorId: 'visitorId',
            roomId: 'roomId',
        });
        (0, chai_1.expect)(modelsMock.LivechatContacts.updateContactChannel.calledOnceWith(sinon_1.default.match({
            visitorId: 'visitorId',
            source: sinon_1.default.match({
                type: 'sms',
            }),
        }), sinon_1.default.match({
            verified: true,
            field: 'field',
            value: 'value',
        }))).to.be.true;
        (0, chai_1.expect)(modelsMock.LivechatRooms.update.calledOnceWith({ _id: 'roomId' }, { $set: { verified: true } })).to.be.true;
        (0, chai_1.expect)(mergeContactsStub.calledOnceWith('contactId', sinon_1.default.match({
            visitorId: 'visitorId',
            source: sinon_1.default.match({
                type: 'sms',
            }),
        }))).to.be.true;
        (0, chai_1.expect)(queueManager.verifyInquiry.calledOnceWith({ _id: 'inquiryId', status: 'verifying' }, { _id: 'roomId', source: { type: 'sms' } }))
            .to.be.true;
    }));
    it('should not add inquiry if status is not ready', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatInquiry.findOneByRoomId.resolves({ _id: 'inquiryId', status: 'taken' });
        modelsMock.LivechatRooms.findOneById.resolves({ _id: 'roomId', source: { type: 'sms' } });
        mergeContactsStub.resolves({ _id: 'contactId' });
        yield runVerifyContactChannel(() => undefined, {
            contactId: 'contactId',
            field: 'field',
            value: 'value',
            visitorId: 'visitorId',
            roomId: 'roomId',
        });
        (0, chai_1.expect)(modelsMock.LivechatContacts.updateContactChannel.calledOnceWith(sinon_1.default.match({
            visitorId: 'visitorId',
            source: sinon_1.default.match({
                type: 'sms',
            }),
        }), sinon_1.default.match({
            verified: true,
            field: 'field',
            value: 'value',
        }))).to.be.true;
        (0, chai_1.expect)(modelsMock.LivechatRooms.update.calledOnceWith({ _id: 'roomId' }, { $set: { verified: true } })).to.be.true;
        (0, chai_1.expect)(mergeContactsStub.calledOnceWith('contactId', sinon_1.default.match({
            visitorId: 'visitorId',
            source: sinon_1.default.match({
                type: 'sms',
            }),
        }))).to.be.true;
        (0, chai_1.expect)(queueManager.verifyInquiry.calledOnceWith({ _id: 'inquiryId', status: 'ready' }, { _id: 'roomId', source: { type: 'sms' } })).to
            .be.false;
    }));
    it('should fail if no matching room is found', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatInquiry.findOneByRoomId.resolves(undefined);
        modelsMock.LivechatRooms.findOneById.resolves(undefined);
        yield (0, chai_1.expect)(runVerifyContactChannel(() => undefined, {
            contactId: 'contactId',
            field: 'field',
            value: 'value',
            visitorId: 'visitorId',
            roomId: 'roomId',
        })).to.be.rejectedWith('error-invalid-room');
        (0, chai_1.expect)(modelsMock.LivechatContacts.updateContactChannel.notCalled).to.be.true;
        (0, chai_1.expect)(modelsMock.LivechatRooms.update.notCalled).to.be.true;
        (0, chai_1.expect)(mergeContactsStub.notCalled).to.be.true;
        (0, chai_1.expect)(queueManager.verifyInquiry.notCalled).to.be.true;
    }));
    it('should fail if no matching inquiry is found', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatInquiry.findOneByRoomId.resolves(undefined);
        modelsMock.LivechatRooms.findOneById.resolves({ _id: 'roomId', source: { type: 'sms' } });
        mergeContactsStub.resolves({ _id: 'contactId' });
        yield (0, chai_1.expect)(runVerifyContactChannel(() => undefined, {
            contactId: 'contactId',
            field: 'field',
            value: 'value',
            visitorId: 'visitorId',
            roomId: 'roomId',
        })).to.be.rejectedWith('error-invalid-inquiry');
        (0, chai_1.expect)(modelsMock.LivechatContacts.updateContactChannel.calledOnceWith(sinon_1.default.match({
            visitorId: 'visitorId',
            source: sinon_1.default.match({
                type: 'sms',
            }),
        }), sinon_1.default.match({
            verified: true,
            field: 'field',
            value: 'value',
        }))).to.be.true;
        (0, chai_1.expect)(modelsMock.LivechatRooms.update.calledOnceWith({ _id: 'roomId' }, { $set: { verified: true } })).to.be.true;
        (0, chai_1.expect)(mergeContactsStub.calledOnceWith('contactId', sinon_1.default.match({
            visitorId: 'visitorId',
            source: sinon_1.default.match({
                type: 'sms',
            }),
        }))).to.be.true;
        (0, chai_1.expect)(queueManager.verifyInquiry.notCalled).to.be.true;
    }));
    it('should abort transaction if an error occurs', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatInquiry.findOneByRoomId.resolves({ _id: 'inquiryId' });
        modelsMock.LivechatRooms.findOneById.resolves({ _id: 'roomId', source: { type: 'sms' } });
        mergeContactsStub.rejects();
        yield (0, chai_1.expect)(runVerifyContactChannel(() => undefined, {
            contactId: 'contactId',
            field: 'field',
            value: 'value',
            visitorId: 'visitorId',
            roomId: 'roomId',
        })).to.be.rejected;
        (0, chai_1.expect)(sessionMock.abortTransaction.calledOnce).to.be.true;
        (0, chai_1.expect)(sessionMock.commitTransaction.notCalled).to.be.true;
        (0, chai_1.expect)(sessionMock.endSession.calledOnce).to.be.true;
    }));
});
