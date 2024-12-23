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
const models_1 = require("@rocket.chat/models");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const sinon_1 = __importDefault(require("sinon"));
const BaseRaw_1 = require("../../../../../../server/models/raw/BaseRaw");
const BeforeSaveCannedResponse_1 = require("../../../../../server/hooks/messages/BeforeSaveCannedResponse");
const createMessage = (msg, extra = {}) => (Object.assign({ _id: 'msg-id', rid: 'GENERAL', ts: new Date(), u: {
        _id: 'user-id',
        username: 'user',
    }, _updatedAt: new Date(), msg: msg }, extra));
const createRoom = (extra = {}) => (Object.assign({ _id: 'GENERAL', name: 'general' }, extra));
const createUser = (extra = {}) => (Object.assign({ _id: 'user-id', name: 'User Name', username: 'user', emails: [{ address: 'user@user.com' }] }, extra));
class LivechatVisitorsModel extends BaseRaw_1.BaseRaw {
    findOneEnabledById() {
        return {};
    }
}
class UsersModel extends BaseRaw_1.BaseRaw {
    findOneById() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                name: 'John Doe Agent',
            };
        });
    }
}
const db = {
    collection: () => ({}),
};
(0, mocha_1.describe)('Omnichannel canned responses', () => {
    (0, mocha_1.before)(() => {
        (0, models_1.registerModel)('ILivechatVisitorsModel', () => new LivechatVisitorsModel(db, 'visitor'));
        (0, models_1.registerModel)('IUsersModel', () => new UsersModel(db, 'user'));
    });
    (0, mocha_1.it)('should do nothing if canned response is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
        BeforeSaveCannedResponse_1.BeforeSaveCannedResponse.enabled = false;
        const canned = new BeforeSaveCannedResponse_1.BeforeSaveCannedResponse();
        const message = yield canned.replacePlaceholders({
            message: createMessage('{{agent.name}}'),
            room: createRoom({ t: 'l', servedBy: { _id: 'agent' }, v: { _id: 'visitor' } }),
            user: createUser(),
        });
        (0, chai_1.expect)(message).to.have.property('msg', '{{agent.name}}');
    }));
    (0, mocha_1.it)('should do nothing if not an omnichannel room', () => __awaiter(void 0, void 0, void 0, function* () {
        BeforeSaveCannedResponse_1.BeforeSaveCannedResponse.enabled = true;
        const canned = new BeforeSaveCannedResponse_1.BeforeSaveCannedResponse();
        const message = yield canned.replacePlaceholders({
            message: createMessage('{{agent.name}}'),
            room: createRoom(),
            user: createUser(),
        });
        (0, chai_1.expect)(message).to.have.property('msg', '{{agent.name}}');
    }));
    (0, mocha_1.it)('should do nothing if the message is from a visitor', () => __awaiter(void 0, void 0, void 0, function* () {
        BeforeSaveCannedResponse_1.BeforeSaveCannedResponse.enabled = true;
        const canned = new BeforeSaveCannedResponse_1.BeforeSaveCannedResponse();
        const message = yield canned.replacePlaceholders({
            message: createMessage('{{agent.name}}'),
            room: createRoom({ t: 'l', servedBy: { _id: 'agent' }, v: { _id: 'visitor' } }),
            user: createUser({ token: 'visitor-token' }),
        });
        (0, chai_1.expect)(message).to.have.property('msg', '{{agent.name}}');
    }));
    (0, mocha_1.it)('should do nothing if room is not served by an agent', () => __awaiter(void 0, void 0, void 0, function* () {
        BeforeSaveCannedResponse_1.BeforeSaveCannedResponse.enabled = true;
        const canned = new BeforeSaveCannedResponse_1.BeforeSaveCannedResponse();
        const message = yield canned.replacePlaceholders({
            message: createMessage('{{agent.name}}'),
            room: createRoom({ t: 'l', v: { _id: 'visitor' } }),
            user: createUser(),
        });
        (0, chai_1.expect)(message).to.have.property('msg', '{{agent.name}}');
    }));
    (0, mocha_1.it)('should do nothing for an empty message', () => __awaiter(void 0, void 0, void 0, function* () {
        BeforeSaveCannedResponse_1.BeforeSaveCannedResponse.enabled = true;
        const canned = new BeforeSaveCannedResponse_1.BeforeSaveCannedResponse();
        const message = yield canned.replacePlaceholders({
            message: createMessage(''),
            room: createRoom({ t: 'l', servedBy: { _id: 'agent' }, v: { _id: 'visitor' } }),
            user: createUser(),
        });
        (0, chai_1.expect)(message).to.have.property('msg', '');
    }));
    (0, mocha_1.it)('should replace {{agent.name}} without finding the user from DB (sender is the agent of room)', () => __awaiter(void 0, void 0, void 0, function* () {
        BeforeSaveCannedResponse_1.BeforeSaveCannedResponse.enabled = true;
        const usersModel = new UsersModel(db, 'user');
        const spy = sinon_1.default.spy(usersModel, 'findOneById');
        (0, models_1.registerModel)('IUsersModel', () => usersModel);
        const canned = new BeforeSaveCannedResponse_1.BeforeSaveCannedResponse();
        const message = yield canned.replacePlaceholders({
            message: createMessage('{{agent.name}}'),
            room: createRoom({ t: 'l', servedBy: { _id: 'agent' }, v: { _id: 'visitor' } }),
            user: createUser({ _id: 'agent', name: 'User As Agent' }),
        });
        (0, chai_1.expect)(message).to.have.property('msg', 'User As Agent');
        (0, chai_1.expect)(spy.called).to.be.false;
    }));
    (0, mocha_1.it)('should replace {{agent.name}} when canned response is enabled', () => __awaiter(void 0, void 0, void 0, function* () {
        BeforeSaveCannedResponse_1.BeforeSaveCannedResponse.enabled = true;
        const usersModel = new UsersModel(db, 'user');
        const spy = sinon_1.default.spy(usersModel, 'findOneById');
        (0, models_1.registerModel)('IUsersModel', () => usersModel);
        const canned = new BeforeSaveCannedResponse_1.BeforeSaveCannedResponse();
        const message = yield canned.replacePlaceholders({
            message: createMessage('{{agent.name}}'),
            room: createRoom({ t: 'l', servedBy: { _id: 'agent' }, v: { _id: 'visitor' } }),
            user: createUser(),
        });
        (0, chai_1.expect)(message).to.have.property('msg', 'John Doe Agent');
        (0, chai_1.expect)(spy.called).to.be.true;
    }));
});
