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
        findContactMatchingVisitor: sinon_1.default.stub(),
    },
    LivechatRooms: {
        setContactByVisitorAssociation: sinon_1.default.stub(),
        findNewestByContactVisitorAssociation: sinon_1.default.stub(),
    },
};
const createContactFromVisitor = sinon_1.default.stub();
const mergeVisitorIntoContact = sinon_1.default.stub();
const { migrateVisitorToContactId } = proxyquire_1.default.noCallThru().load('./migrateVisitorToContactId', {
    './createContactFromVisitor': {
        createContactFromVisitor,
    },
    './ContactMerger': {
        ContactMerger: {
            mergeVisitorIntoContact,
        },
    },
    '@rocket.chat/models': modelsMock,
    '../logger': {
        livechatContactsLogger: {
            debug: sinon_1.default.stub(),
        },
    },
});
describe('migrateVisitorToContactId', () => {
    beforeEach(() => {
        modelsMock.LivechatContacts.findContactMatchingVisitor.reset();
        modelsMock.LivechatRooms.setContactByVisitorAssociation.reset();
        modelsMock.LivechatRooms.findNewestByContactVisitorAssociation.reset();
        createContactFromVisitor.reset();
        mergeVisitorIntoContact.reset();
    });
    it('should not create a contact if there is no source for the visitor', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, chai_1.expect)(yield migrateVisitorToContactId({ visitor: { _id: 'visitor1' } })).to.be.null;
    }));
    it('should attempt to create a new contact if there is no free existing contact matching the visitor data', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatContacts.findContactMatchingVisitor.resolves(undefined);
        const visitor = { _id: 'visitor1' };
        const source = { type: 'other' };
        modelsMock.LivechatRooms.findNewestByContactVisitorAssociation.resolves({ _id: 'room1', v: { _id: visitor._id }, source });
        createContactFromVisitor.resolves('contactCreated');
        (0, chai_1.expect)(yield migrateVisitorToContactId({ visitor: { _id: 'visitor1' }, source })).to.be.equal('contactCreated');
    }));
    it('should not attempt to create a new contact if one is found for the visitor', () => __awaiter(void 0, void 0, void 0, function* () {
        const visitor = { _id: 'visitor1' };
        const contact = { _id: 'contact1' };
        const source = { type: 'sms' };
        modelsMock.LivechatRooms.findNewestByContactVisitorAssociation.resolves({ _id: 'room1', v: { _id: visitor._id }, source });
        modelsMock.LivechatContacts.findContactMatchingVisitor.resolves(contact);
        createContactFromVisitor.resolves('contactCreated');
        (0, chai_1.expect)(yield migrateVisitorToContactId({ visitor, source })).to.be.equal('contact1');
        (0, chai_1.expect)(mergeVisitorIntoContact.calledOnceWith(visitor, contact, source)).to.be.true;
    }));
});
