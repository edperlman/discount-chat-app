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
        findOneById: sinon_1.default.stub(),
        findSimilarVerifiedContacts: sinon_1.default.stub(),
        deleteMany: sinon_1.default.stub(),
    },
    LivechatRooms: {
        updateMergedContactIds: sinon_1.default.stub(),
    },
};
const contactMergerStub = {
    getAllFieldsFromContact: sinon_1.default.stub(),
    mergeFieldsIntoContact: sinon_1.default.stub(),
};
const { runMergeContacts } = proxyquire_1.default.noCallThru().load('../../../../../../server/patches/mergeContacts', {
    '../../../app/livechat/server/lib/contacts/mergeContacts': { mergeContacts: { patch: sinon_1.default.stub() } },
    '../../../app/livechat/server/lib/contacts/ContactMerger': { ContactMerger: contactMergerStub },
    '../../../app/livechat-enterprise/server/lib/logger': { logger: { info: sinon_1.default.stub(), debug: sinon_1.default.stub() } },
    '@rocket.chat/models': modelsMock,
});
describe('mergeContacts', () => {
    const targetChannel = {
        name: 'channelName',
        visitor: {
            visitorId: 'visitorId',
            source: {
                type: 'sms',
            },
        },
        verified: true,
        verifiedAt: new Date(),
        field: 'field',
        value: 'value',
    };
    beforeEach(() => {
        modelsMock.LivechatContacts.findOneById.reset();
        modelsMock.LivechatContacts.findSimilarVerifiedContacts.reset();
        modelsMock.LivechatContacts.deleteMany.reset();
        modelsMock.LivechatRooms.updateMergedContactIds.reset();
        contactMergerStub.getAllFieldsFromContact.reset();
        contactMergerStub.mergeFieldsIntoContact.reset();
        modelsMock.LivechatContacts.deleteMany.resolves({ deletedCount: 0 });
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it('should throw an error if contact does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatContacts.findOneById.resolves(undefined);
        yield (0, chai_1.expect)(runMergeContacts(() => undefined, 'invalidId', { visitorId: 'visitorId', source: { type: 'sms' } })).to.be.rejectedWith('error-invalid-contact');
    }));
    it('should throw an error if contact channel does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatContacts.findOneById.resolves({
            _id: 'contactId',
            channels: [{ name: 'channelName', visitor: { visitorId: 'visitorId', source: { type: 'sms' } } }],
        });
        yield (0, chai_1.expect)(runMergeContacts(() => undefined, 'contactId', { visitorId: 'invalidVisitorId', source: { type: 'sms' } })).to.be.rejectedWith('error-invalid-channel');
    }));
    it('should do nothing if there are no similar verified contacts', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatContacts.findOneById.resolves({ _id: 'contactId', channels: [targetChannel] });
        modelsMock.LivechatContacts.findSimilarVerifiedContacts.resolves([]);
        yield runMergeContacts(() => undefined, 'contactId', { visitorId: 'visitorId', source: { type: 'sms' } });
        (0, chai_1.expect)(modelsMock.LivechatContacts.findOneById.calledOnceWith('contactId')).to.be.true;
        (0, chai_1.expect)(modelsMock.LivechatContacts.findSimilarVerifiedContacts.calledOnceWith(targetChannel, 'contactId')).to.be.true;
        (0, chai_1.expect)(modelsMock.LivechatContacts.deleteMany.notCalled).to.be.true;
        (0, chai_1.expect)(contactMergerStub.getAllFieldsFromContact.notCalled).to.be.true;
        (0, chai_1.expect)(contactMergerStub.mergeFieldsIntoContact.notCalled).to.be.true;
    }));
    it('should be able to merge similar contacts', () => __awaiter(void 0, void 0, void 0, function* () {
        const similarContact = {
            _id: 'differentId',
            emails: ['email2'],
            phones: ['phone2'],
            channels: [{ name: 'channelName2', visitorId: 'visitorId2', field: 'field', value: 'value' }],
        };
        const originalContact = {
            _id: 'contactId',
            emails: ['email1'],
            phones: ['phone1'],
            channels: [targetChannel],
        };
        modelsMock.LivechatContacts.findOneById.resolves(originalContact);
        modelsMock.LivechatContacts.findSimilarVerifiedContacts.resolves([similarContact]);
        yield runMergeContacts(() => undefined, 'contactId', { visitorId: 'visitorId', source: { type: 'sms' } });
        (0, chai_1.expect)(modelsMock.LivechatContacts.findOneById.calledTwice).to.be.true;
        (0, chai_1.expect)(modelsMock.LivechatContacts.findOneById.calledWith('contactId')).to.be.true;
        (0, chai_1.expect)(modelsMock.LivechatContacts.findSimilarVerifiedContacts.calledOnceWith(targetChannel, 'contactId')).to.be.true;
        (0, chai_1.expect)(contactMergerStub.getAllFieldsFromContact.calledOnceWith(similarContact)).to.be.true;
        (0, chai_1.expect)(contactMergerStub.mergeFieldsIntoContact.getCall(0).args[0].contact).to.be.deep.equal(originalContact);
        (0, chai_1.expect)(modelsMock.LivechatContacts.deleteMany.calledOnceWith({ _id: { $in: ['differentId'] } })).to.be.true;
        (0, chai_1.expect)(modelsMock.LivechatRooms.updateMergedContactIds.calledOnceWith(['differentId'], 'contactId')).to.be.true;
    }));
});
