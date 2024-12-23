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
    Users: {
        findOneById: sinon_1.default.stub(),
    },
    LivechatVisitors: {
        findOneById: sinon_1.default.stub(),
    },
};
const settingsGetMock = {
    get: sinon_1.default.stub(),
};
const { parseTranscriptRequest } = proxyquire_1.default.noCallThru().load('../../../../../../app/livechat/server/lib/parseTranscriptRequest', {
    '@rocket.chat/models': modelsMock,
    '../../../settings/server': { settings: settingsGetMock },
});
describe('parseTranscriptRequest', () => {
    beforeEach(() => {
        settingsGetMock.get.reset();
        modelsMock.Users.findOneById.reset();
        modelsMock.LivechatVisitors.findOneById.reset();
    });
    it('should return `options` param with no changes when Livechat_enable_transcript setting is true', () => __awaiter(void 0, void 0, void 0, function* () {
        settingsGetMock.get.withArgs('Livechat_enable_transcript').returns(true);
        const options = yield parseTranscriptRequest({}, {});
        (0, chai_1.expect)(options).to.be.deep.equal({});
    }));
    it('should return `options` param with no changes when send always is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
        settingsGetMock.get.withArgs('Livechat_enable_transcript').returns(false);
        settingsGetMock.get.withArgs('Livechat_transcript_send_always').returns(false);
        const options = yield parseTranscriptRequest({}, {});
        (0, chai_1.expect)(options).to.be.deep.equal({});
    }));
    it('should return `options` param with no changes when visitor is not provided and its not found on db', () => __awaiter(void 0, void 0, void 0, function* () {
        settingsGetMock.get.withArgs('Livechat_enable_transcript').returns(false);
        settingsGetMock.get.withArgs('Livechat_transcript_send_always').returns(true);
        modelsMock.LivechatVisitors.findOneById.resolves(null);
        const options = yield parseTranscriptRequest({ v: { _id: '123' } }, {});
        (0, chai_1.expect)(options).to.be.deep.equal({});
    }));
    it('should return `options` param with no changes when visitor is passed but no email is found', () => __awaiter(void 0, void 0, void 0, function* () {
        settingsGetMock.get.withArgs('Livechat_enable_transcript').returns(false);
        settingsGetMock.get.withArgs('Livechat_transcript_send_always').returns(true);
        modelsMock.LivechatVisitors.findOneById.resolves({});
        const options = yield parseTranscriptRequest({ v: { _id: '123' } }, {}, { _id: '123' });
        (0, chai_1.expect)(options).to.be.deep.equal({});
    }));
    it('should return `options` param with no changes when visitor is fetched from db, but no email is found', () => __awaiter(void 0, void 0, void 0, function* () {
        settingsGetMock.get.withArgs('Livechat_enable_transcript').returns(false);
        settingsGetMock.get.withArgs('Livechat_transcript_send_always').returns(true);
        modelsMock.LivechatVisitors.findOneById.resolves({});
        const options = yield parseTranscriptRequest({ v: { _id: '123' } }, {});
        (0, chai_1.expect)(options).to.be.deep.equal({});
    }));
    it('should return `options` param with no changes when no user is passed, room is not being served and rocketcat is not present', () => __awaiter(void 0, void 0, void 0, function* () {
        settingsGetMock.get.withArgs('Livechat_enable_transcript').returns(false);
        settingsGetMock.get.withArgs('Livechat_transcript_send_always').returns(true);
        modelsMock.Users.findOneById.resolves(null);
        modelsMock.LivechatVisitors.findOneById.resolves({ visitorEmails: [{ address: 'abc@rocket.chat' }] });
        const options = yield parseTranscriptRequest({ v: { _id: '123' } }, {});
        (0, chai_1.expect)(options).to.be.deep.equal({});
    }));
    it('should return `options` param with `transcriptRequest` key attached when user is passed', () => __awaiter(void 0, void 0, void 0, function* () {
        settingsGetMock.get.withArgs('Livechat_enable_transcript').returns(false);
        settingsGetMock.get.withArgs('Livechat_transcript_send_always').returns(true);
        modelsMock.LivechatVisitors.findOneById.resolves({ visitorEmails: [{ address: 'abc@rocket.chat' }] });
        const options = yield parseTranscriptRequest({ v: { _id: '123' } }, {}, undefined, { _id: '123' });
        (0, chai_1.expect)(modelsMock.LivechatVisitors.findOneById.getCall(0).firstArg).to.be.equal('123');
        (0, chai_1.expect)(options).to.have.property('emailTranscript').that.is.an('object');
        (0, chai_1.expect)(options.emailTranscript.requestData).to.have.property('email', 'abc@rocket.chat');
        (0, chai_1.expect)(options.emailTranscript.requestData).to.have.property('subject', '');
        (0, chai_1.expect)(options.emailTranscript.requestData.requestedBy).to.be.deep.equal({ _id: '123' });
    }));
    it('should return `options` param with `transcriptRequest` key attached when no user is passed, but theres an agent serving the room', () => __awaiter(void 0, void 0, void 0, function* () {
        settingsGetMock.get.withArgs('Livechat_enable_transcript').returns(false);
        settingsGetMock.get.withArgs('Livechat_transcript_send_always').returns(true);
        modelsMock.Users.findOneById.resolves({ _id: '123', username: 'kevsxxx', name: 'Kev' });
        modelsMock.LivechatVisitors.findOneById.resolves({ visitorEmails: [{ address: 'abc@rocket.chat' }] });
        const options = yield parseTranscriptRequest({ v: { _id: '123' }, servedBy: { _id: '123' } }, {});
        (0, chai_1.expect)(modelsMock.Users.findOneById.getCall(0).firstArg).to.be.equal('123');
        (0, chai_1.expect)(options).to.have.property('emailTranscript').that.is.an('object');
        (0, chai_1.expect)(options.emailTranscript.requestData).to.have.property('email', 'abc@rocket.chat');
        (0, chai_1.expect)(options.emailTranscript.requestData).to.have.property('subject', '');
        (0, chai_1.expect)(options.emailTranscript.requestData.requestedBy).to.be.deep.equal({ _id: '123', username: 'kevsxxx', name: 'Kev' });
    }));
    it('should return `options` param with `transcriptRequest` key attached when no user is passed, no agent is serving but rocket.cat is present', () => __awaiter(void 0, void 0, void 0, function* () {
        settingsGetMock.get.withArgs('Livechat_enable_transcript').returns(false);
        settingsGetMock.get.withArgs('Livechat_transcript_send_always').returns(true);
        modelsMock.Users.findOneById.resolves({ _id: 'rocket.cat', username: 'rocket.cat', name: 'Rocket Cat' });
        modelsMock.LivechatVisitors.findOneById.resolves({ visitorEmails: [{ address: 'abc@rocket.chat' }] });
        const options = yield parseTranscriptRequest({ v: { _id: '123' } }, {});
        (0, chai_1.expect)(modelsMock.Users.findOneById.getCall(0).firstArg).to.be.equal('rocket.cat');
        (0, chai_1.expect)(options).to.have.property('emailTranscript').that.is.an('object');
        (0, chai_1.expect)(options.emailTranscript.requestData).to.have.property('email', 'abc@rocket.chat');
        (0, chai_1.expect)(options.emailTranscript.requestData).to.have.property('subject', '');
        (0, chai_1.expect)(options.emailTranscript.requestData.requestedBy).to.be.deep.equal({
            _id: 'rocket.cat',
            username: 'rocket.cat',
            name: 'Rocket Cat',
        });
    }));
});
