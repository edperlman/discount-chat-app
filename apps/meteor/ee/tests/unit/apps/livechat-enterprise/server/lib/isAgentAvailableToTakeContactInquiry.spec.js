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
    },
};
const settingsMock = {
    get: sinon_1.default.stub(),
};
const { runIsAgentAvailableToTakeContactInquiry } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../server/patches/isAgentAvailableToTakeContactInquiry', {
    '@rocket.chat/models': modelsMock,
    '../../../app/settings/server': {
        settings: settingsMock,
    },
});
describe('isAgentAvailableToTakeContactInquiry', () => {
    beforeEach(() => {
        modelsMock.LivechatContacts.findOneById.reset();
        settingsMock.get.reset();
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it('should return false if the contact is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatContacts.findOneById.resolves(undefined);
        const { value, error } = yield runIsAgentAvailableToTakeContactInquiry(() => undefined, 'visitorId', {}, 'rid');
        (0, chai_1.expect)(value).to.be.false;
        (0, chai_1.expect)(error).to.eq('error-invalid-contact');
        (0, chai_1.expect)(modelsMock.LivechatContacts.findOneById.calledOnceWith('contactId', sinon_1.default.match({ projection: { unknown: 1, channels: 1 } })));
    }));
    it('should return false if the contact is unknown and Livechat_Block_Unknown_Contacts is true', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatContacts.findOneById.resolves({ unknown: true });
        settingsMock.get.withArgs('Livechat_Block_Unknown_Contacts').returns(true);
        const { value, error } = yield runIsAgentAvailableToTakeContactInquiry(() => undefined, 'visitorId', {}, 'rid');
        (0, chai_1.expect)(value).to.be.false;
        (0, chai_1.expect)(error).to.eq('error-unknown-contact');
    }));
    it('should return false if the contact is not verified and Livechat_Block_Unverified_Contacts is true', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatContacts.findOneById.resolves({
            unknown: false,
            channels: [
                { verified: false, visitor: { source: { type: 'channelName' }, visitorId: 'visitorId' } },
                { verified: true, visitor: { source: { type: 'othername' }, visitorId: 'visitorId' } },
            ],
        });
        settingsMock.get.withArgs('Livechat_Block_Unknown_Contacts').returns(true);
        settingsMock.get.withArgs('Livechat_Block_Unverified_Contacts').returns(true);
        const { value, error } = yield runIsAgentAvailableToTakeContactInquiry(() => undefined, 'visitorId', { type: 'channelName' }, 'rid');
        (0, chai_1.expect)(value).to.be.false;
        (0, chai_1.expect)(error).to.eq('error-unverified-contact');
    }));
    it('should return true if the contact has the verified channel', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatContacts.findOneById.resolves({
            unknown: false,
            channels: [
                { verified: true, visitor: { source: { type: 'channelName' }, visitorId: 'visitorId' } },
                { verified: false, visitor: { source: { type: 'othername' }, visitorId: 'visitorId' } },
            ],
        });
        settingsMock.get.withArgs('Livechat_Block_Unknown_Contacts').returns(true);
        settingsMock.get.withArgs('Livechat_Block_Unverified_Contacts').returns(true);
        const { value } = yield runIsAgentAvailableToTakeContactInquiry(() => undefined, 'visitorId', { type: 'channelName' }, 'rid');
        (0, chai_1.expect)(value).to.be.true;
    }));
    it('should not look at the unknown field if the setting Livechat_Block_Unknown_Contacts is false', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatContacts.findOneById.resolves({
            unknown: true,
            channels: [
                { verified: true, visitor: { source: { type: 'channelName' }, visitorId: 'visitorId' } },
                { verified: false, visitor: { source: { type: 'othername' }, visitorId: 'visitorId' } },
            ],
        });
        settingsMock.get.withArgs('Livechat_Block_Unknown_Contacts').returns(false);
        settingsMock.get.withArgs('Livechat_Block_Unverified_Contacts').returns(true);
        const { value } = yield runIsAgentAvailableToTakeContactInquiry(() => undefined, 'visitorId', { type: 'channelName' }, 'rid');
        (0, chai_1.expect)(value).to.be.true;
    }));
    it('should not look at the verified channels if Livechat_Block_Unverified_Contacts is false', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatContacts.findOneById.resolves({
            unknown: false,
            channels: [
                { verified: false, visitor: { source: { type: 'channelName' }, visitorId: 'visitorId' } },
                { verified: false, visitor: { source: { type: 'othername' }, visitorId: 'visitorId' } },
            ],
        });
        settingsMock.get.withArgs('Livechat_Block_Unknown_Contacts').returns(true);
        settingsMock.get.withArgs('Livechat_Block_Unverified_Contacts').returns(false);
        const { value } = yield runIsAgentAvailableToTakeContactInquiry(() => undefined, 'visitorId', { type: 'channelName' }, 'rid');
        (0, chai_1.expect)(value).to.be.true;
    }));
    it('should return true if there is a contact and the settings are false', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatContacts.findOneById.resolves({
            unknown: false,
            channels: [],
        });
        settingsMock.get.withArgs('Livechat_Block_Unknown_Contacts').returns(false);
        settingsMock.get.withArgs('Livechat_Block_Unverified_Contacts').returns(false);
        const { value } = yield runIsAgentAvailableToTakeContactInquiry(() => undefined, 'visitorId', { type: 'channelName' }, 'rid');
        (0, chai_1.expect)(value).to.be.true;
    }));
});
