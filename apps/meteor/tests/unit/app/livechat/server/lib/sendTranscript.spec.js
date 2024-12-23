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
    LivechatRooms: {
        findOneById: sinon_1.default.stub(),
    },
    Messages: {
        findLivechatClosingMessage: sinon_1.default.stub(),
        findVisibleByRoomIdNotContainingTypesBeforeTs: sinon_1.default.stub(),
    },
    Users: {
        findOneById: sinon_1.default.stub(),
    },
};
const checkMock = sinon_1.default.stub();
const mockLogger = class {
    debug() {
        return null;
    }
    error() {
        return null;
    }
    warn() {
        return null;
    }
    info() {
        return null;
    }
};
const mockSettingValues = {
    Livechat_show_agent_info: true,
    Language: 'en',
    From_Email: 'test@rocket.chat',
};
const settingsMock = function (key) {
    return mockSettingValues[key] || null;
};
const getTimezoneMock = sinon_1.default.stub();
const mailerMock = sinon_1.default.stub();
const tStub = sinon_1.default.stub();
const { sendTranscript } = proxyquire_1.default.noCallThru().load('../../../../../../app/livechat/server/lib/sendTranscript', {
    '@rocket.chat/models': modelsMock,
    '@rocket.chat/logger': { Logger: mockLogger },
    'meteor/check': { check: checkMock },
    '../../../../lib/callbacks': {
        callbacks: {
            run: sinon_1.default.stub(),
        },
    },
    '../../../../server/lib/i18n': { i18n: { t: tStub } },
    '../../../mailer/server/api': { send: mailerMock },
    '../../../settings/server': { settings: { get: settingsMock } },
    '../../../utils/server/lib/getTimezone': { getTimezone: getTimezoneMock },
    // TODO: add tests for file handling on transcripts
    '../../../file-upload/server': { FileUpload: {} },
});
describe('Send transcript', () => {
    beforeEach(() => {
        checkMock.reset();
        modelsMock.LivechatRooms.findOneById.reset();
        modelsMock.Messages.findLivechatClosingMessage.reset();
        modelsMock.Messages.findVisibleByRoomIdNotContainingTypesBeforeTs.reset();
        modelsMock.Users.findOneById.reset();
        mailerMock.reset();
        tStub.reset();
    });
    it('should throw error when rid or email are invalid params', () => __awaiter(void 0, void 0, void 0, function* () {
        checkMock.throws(new Error('Invalid params'));
        yield (0, chai_1.expect)(sendTranscript({})).to.be.rejectedWith(Error);
    }));
    it('should throw error when visitor not found', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, chai_1.expect)(sendTranscript({ rid: 'rid', email: 'email', logger: mockLogger })).to.be.rejectedWith(Error);
    }));
    it('should attempt to send an email when params are valid using default subject', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatRooms.findOneById.resolves({ t: 'l', v: { token: 'token' } });
        modelsMock.Messages.findVisibleByRoomIdNotContainingTypesBeforeTs.resolves([]);
        tStub.returns('Conversation Transcript');
        yield sendTranscript({
            rid: 'rid',
            token: 'token',
            email: 'email',
            user: { _id: 'x', name: 'x', utcOffset: '-6', username: 'x' },
        });
        (0, chai_1.expect)(getTimezoneMock.calledWith({ _id: 'x', name: 'x', utcOffset: '-6', username: 'x' })).to.be.true;
        (0, chai_1.expect)(modelsMock.Messages.findLivechatClosingMessage.calledWith('rid', { projection: { ts: 1 } })).to.be.true;
        (0, chai_1.expect)(modelsMock.Messages.findVisibleByRoomIdNotContainingTypesBeforeTs.called).to.be.true;
        (0, chai_1.expect)(mailerMock.calledWith({
            to: 'email',
            from: 'test@rocket.chat',
            subject: 'Conversation Transcript',
            replyTo: 'test@rocket.chat',
            html: '<div> <hr></div>',
        })).to.be.true;
    }));
    it('should use provided subject', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatRooms.findOneById.resolves({ t: 'l', v: { token: 'token' } });
        modelsMock.Messages.findVisibleByRoomIdNotContainingTypesBeforeTs.resolves([]);
        yield sendTranscript({
            rid: 'rid',
            token: 'token',
            email: 'email',
            subject: 'A custom subject',
            user: { _id: 'x', name: 'x', utcOffset: '-6', username: 'x' },
        });
        (0, chai_1.expect)(getTimezoneMock.calledWith({ _id: 'x', name: 'x', utcOffset: '-6', username: 'x' })).to.be.true;
        (0, chai_1.expect)(modelsMock.Messages.findLivechatClosingMessage.calledWith('rid', { projection: { ts: 1 } })).to.be.true;
        (0, chai_1.expect)(modelsMock.Messages.findVisibleByRoomIdNotContainingTypesBeforeTs.called).to.be.true;
        (0, chai_1.expect)(mailerMock.calledWith({
            to: 'email',
            from: 'test@rocket.chat',
            subject: 'A custom subject',
            replyTo: 'test@rocket.chat',
            html: '<div> <hr></div>',
        })).to.be.true;
    }));
    it('should use subject from setting (when configured) when no subject provided', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatRooms.findOneById.resolves({ t: 'l', v: { token: 'token' } });
        modelsMock.Messages.findVisibleByRoomIdNotContainingTypesBeforeTs.resolves([]);
        mockSettingValues.Livechat_transcript_email_subject = 'A custom subject obtained from setting.get';
        yield sendTranscript({
            rid: 'rid',
            token: 'token',
            email: 'email',
            user: { _id: 'x', name: 'x', utcOffset: '-6', username: 'x' },
        });
        (0, chai_1.expect)(getTimezoneMock.calledWith({ _id: 'x', name: 'x', utcOffset: '-6', username: 'x' })).to.be.true;
        (0, chai_1.expect)(modelsMock.Messages.findLivechatClosingMessage.calledWith('rid', { projection: { ts: 1 } })).to.be.true;
        (0, chai_1.expect)(modelsMock.Messages.findVisibleByRoomIdNotContainingTypesBeforeTs.called).to.be.true;
        (0, chai_1.expect)(mailerMock.calledWith({
            to: 'email',
            from: 'test@rocket.chat',
            subject: 'A custom subject obtained from setting.get',
            replyTo: 'test@rocket.chat',
            html: '<div> <hr></div>',
        })).to.be.true;
    }));
    it('should fail if room provided is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatRooms.findOneById.resolves(null);
        yield (0, chai_1.expect)(sendTranscript({ rid: 'rid', email: 'email', logger: mockLogger })).to.be.rejectedWith(Error);
    }));
    it('should fail if room provided is of different type', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatRooms.findOneById.resolves({ t: 'c' });
        yield (0, chai_1.expect)(sendTranscript({ rid: 'rid', email: 'email' })).to.be.rejectedWith(Error);
    }));
    it('should fail if room is of valid type, but doesnt doesnt have `v` property', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatRooms.findOneById.resolves({ t: 'l' });
        yield (0, chai_1.expect)(sendTranscript({ rid: 'rid', email: 'email' })).to.be.rejectedWith(Error);
    }));
    it('should fail if room is of valid type, has `v` prop, but it doesnt contain `token`', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatRooms.findOneById.resolves({ t: 'l', v: { otherProp: 'xxx' } });
        yield (0, chai_1.expect)(sendTranscript({ rid: 'rid', email: 'email' })).to.be.rejectedWith(Error);
    }));
    it('should fail if room is of valid type, has `v.token`, but its different from the one on param (room from another visitor)', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatRooms.findOneById.resolves({ t: 'l', v: { token: 'xxx' } });
        yield (0, chai_1.expect)(sendTranscript({ rid: 'rid', email: 'email', token: 'xveasdf' })).to.be.rejectedWith(Error);
    }));
    it('should throw an error when token is not the one on room.v', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatRooms.findOneById.resolves({ t: 'l', v: { token: 'xxx' } });
        yield (0, chai_1.expect)(sendTranscript({ rid: 'rid', email: 'email', token: 'xveasdf' })).to.be.rejectedWith(Error);
    }));
    it('should work when token matches room.v', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatRooms.findOneById.resolves({ t: 'l', v: { token: 'token-123' } });
        modelsMock.Messages.findVisibleByRoomIdNotContainingTypesBeforeTs.resolves([]);
        delete mockSettingValues.Livechat_transcript_email_subject;
        tStub.returns('Conversation Transcript');
        yield sendTranscript({
            rid: 'rid',
            token: 'token-123',
            email: 'email',
            user: { _id: 'x', name: 'x', utcOffset: '-6', username: 'x' },
        });
        (0, chai_1.expect)(getTimezoneMock.calledWith({ _id: 'x', name: 'x', utcOffset: '-6', username: 'x' })).to.be.true;
        (0, chai_1.expect)(modelsMock.Messages.findLivechatClosingMessage.calledWith('rid', { projection: { ts: 1 } })).to.be.true;
        (0, chai_1.expect)(modelsMock.Messages.findVisibleByRoomIdNotContainingTypesBeforeTs.called).to.be.true;
        (0, chai_1.expect)(mailerMock.calledWith({
            to: 'email',
            from: 'test@rocket.chat',
            subject: 'Conversation Transcript',
            replyTo: 'test@rocket.chat',
            html: '<div> <hr></div>',
        })).to.be.true;
    }));
});
