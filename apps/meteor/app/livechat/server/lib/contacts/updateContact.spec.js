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
        updateContact: sinon_1.default.stub(),
    },
    LivechatRooms: {
        updateContactDataByContactId: sinon_1.default.stub(),
    },
};
const { updateContact } = proxyquire_1.default.noCallThru().load('./updateContact', {
    './getAllowedCustomFields': {
        getAllowedCustomFields: sinon_1.default.stub(),
    },
    './validateContactManager': {
        validateContactManager: sinon_1.default.stub(),
    },
    './validateCustomFields': {
        validateCustomFields: sinon_1.default.stub(),
    },
    '@rocket.chat/models': modelsMock,
});
describe('updateContact', () => {
    beforeEach(() => {
        modelsMock.LivechatContacts.findOneById.reset();
        modelsMock.LivechatContacts.updateContact.reset();
        modelsMock.LivechatRooms.updateContactDataByContactId.reset();
    });
    it('should throw an error if the contact does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatContacts.findOneById.resolves(undefined);
        yield (0, chai_1.expect)(updateContact('any_id')).to.be.rejectedWith('error-contact-not-found');
        (0, chai_1.expect)(modelsMock.LivechatContacts.updateContact.getCall(0)).to.be.null;
    }));
    it('should update the contact with correct params', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatContacts.findOneById.resolves({ _id: 'contactId' });
        modelsMock.LivechatContacts.updateContact.resolves({ _id: 'contactId', name: 'John Doe' });
        const updatedContact = yield updateContact({ contactId: 'contactId', name: 'John Doe' });
        (0, chai_1.expect)(modelsMock.LivechatContacts.updateContact.getCall(0).args[0]).to.be.equal('contactId');
        (0, chai_1.expect)(modelsMock.LivechatContacts.updateContact.getCall(0).args[1]).to.be.deep.contain({ name: 'John Doe' });
        (0, chai_1.expect)(updatedContact).to.be.deep.equal({ _id: 'contactId', name: 'John Doe' });
    }));
});
