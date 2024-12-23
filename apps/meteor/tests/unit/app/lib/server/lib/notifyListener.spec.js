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
describe('Message Broadcast Tests', () => {
    let getSettingValueByIdStub;
    let usersFindOneStub;
    let messagesFindOneStub;
    let broadcastStub;
    let getMessageToBroadcast;
    let notifyOnMessageChange;
    let memStub;
    const sampleMessage = {
        _id: '123',
        rid: 'room1',
        msg: 'Hello',
        ts: new Date(),
        u: { _id: 'user1', username: 'user1', name: 'Real User' },
        mentions: [],
        t: 'user-muted',
        _updatedAt: new Date(),
    };
    const modelsStubs = () => ({
        Messages: {
            findOneById: messagesFindOneStub,
        },
        Users: {
            findOne: usersFindOneStub,
        },
        Settings: {
            getValueById: getSettingValueByIdStub,
        },
    });
    const coreStubs = (dbWatchersDisabled) => ({
        api: {
            broadcast: broadcastStub,
        },
        dbWatchersDisabled,
    });
    beforeEach(() => {
        getSettingValueByIdStub = sinon_1.default.stub();
        usersFindOneStub = sinon_1.default.stub();
        messagesFindOneStub = sinon_1.default.stub();
        broadcastStub = sinon_1.default.stub();
        memStub = sinon_1.default.stub().callsFake((fn) => fn);
        const proxyMock = proxyquire_1.default.noPreserveCache().load('../../../../../../app/lib/server/lib/notifyListener', {
            '@rocket.chat/models': modelsStubs(),
            '@rocket.chat/core-services': coreStubs(false),
            'mem': memStub,
        });
        getMessageToBroadcast = proxyMock.getMessageToBroadcast;
        notifyOnMessageChange = proxyMock.notifyOnMessageChange;
    });
    describe('getMessageToBroadcast', () => {
        let originalEnv;
        beforeEach(() => {
            originalEnv = Object.assign({}, process.env);
            sinon_1.default.resetHistory();
        });
        afterEach(() => {
            process.env = originalEnv;
        });
        const testCases = [
            {
                description: 'should return undefined if message is hidden',
                message: Object.assign(Object.assign({}, sampleMessage), { _hidden: true }),
                hideSystemMessages: [],
                useRealName: false,
                expectedResult: undefined,
            },
            {
                description: 'should return undefined if message is imported',
                message: Object.assign(Object.assign({}, sampleMessage), { imported: true }),
                hideSystemMessages: [],
                useRealName: false,
                expectedResult: undefined,
            },
            {
                description: 'should hide message if type is in hideSystemMessage settings',
                message: sampleMessage,
                hideSystemMessages: ['user-muted', 'mute_unmute'],
                useRealName: false,
                expectedResult: undefined,
            },
            {
                description: 'should return the message with real name if useRealName is true',
                message: sampleMessage,
                hideSystemMessages: [],
                useRealName: true,
                expectedResult: Object.assign(Object.assign({}, sampleMessage), { u: Object.assign(Object.assign({}, sampleMessage.u), { name: 'Real User' }) }),
            },
            {
                description: 'should return the message with mentions real name if useRealName is true',
                message: Object.assign(Object.assign({}, sampleMessage), { mentions: [
                        { _id: 'mention1', username: 'mention1', name: 'Mention 1' },
                        { _id: 'mention2', username: 'mention2', name: 'Mention 2' },
                    ] }),
                hideSystemMessages: [],
                useRealName: true,
                expectedResult: Object.assign(Object.assign({}, sampleMessage), { u: Object.assign(Object.assign({}, sampleMessage.u), { name: 'Real User' }), mentions: [
                        { _id: 'mention1', username: 'mention1', name: 'Mention 1' },
                        { _id: 'mention2', username: 'mention2', name: 'Mention 2' },
                    ] }),
            },
            {
                description: 'should return the message if Hide_System_Messages is undefined',
                message: sampleMessage,
                hideSystemMessages: undefined,
                useRealName: false,
                expectedResult: sampleMessage,
            },
            {
                description: 'should return undefined if the message type is muted and a mute_unmute is received',
                message: Object.assign(Object.assign({}, sampleMessage), { t: 'mute_unmute' }),
                hideSystemMessages: ['user-muted', 'mute_unmute'],
                useRealName: false,
                expectedResult: undefined,
            },
            {
                description: 'should return the message if no system messages are muted',
                message: sampleMessage,
                hideSystemMessages: [],
                useRealName: false,
                expectedResult: sampleMessage,
            },
            {
                description: 'should hide message if type is room-archived',
                message: Object.assign(Object.assign({}, sampleMessage), { t: 'room-archived' }),
                hideSystemMessages: ['room-archived'],
                useRealName: false,
                expectedResult: undefined,
            },
            {
                description: 'should hide message if type is user-unmuted',
                message: Object.assign(Object.assign({}, sampleMessage), { t: 'user-unmuted' }),
                hideSystemMessages: ['user-unmuted'],
                useRealName: false,
                expectedResult: undefined,
            },
            {
                description: 'should hide message if type is subscription-role-added',
                message: Object.assign(Object.assign({}, sampleMessage), { t: 'subscription-role-added' }),
                hideSystemMessages: ['subscription-role-added'],
                useRealName: false,
                expectedResult: undefined,
            },
            {
                description: 'should hide message if type is message_pinned',
                message: Object.assign(Object.assign({}, sampleMessage), { t: 'message_pinned' }),
                hideSystemMessages: ['message_pinned'],
                useRealName: false,
                expectedResult: undefined,
            },
            {
                description: 'should hide message if type is new-owner',
                message: Object.assign(Object.assign({}, sampleMessage), { t: 'new-owner' }),
                hideSystemMessages: ['new-owner'],
                useRealName: false,
                expectedResult: undefined,
            },
        ];
        testCases.forEach(({ description, message, hideSystemMessages, useRealName, expectedResult }) => {
            it(description, () => __awaiter(void 0, void 0, void 0, function* () {
                messagesFindOneStub.resolves(message);
                getSettingValueByIdStub.withArgs('Hide_System_Messages').resolves(hideSystemMessages);
                getSettingValueByIdStub.withArgs('UI_Use_Real_Name').resolves(useRealName);
                if (useRealName) {
                    const realNames = message.mentions && message.mentions.length > 0
                        ? [message.u.name, ...message.mentions.map((mention) => mention.name)]
                        : [message.u.name];
                    realNames.forEach((user, index) => usersFindOneStub.onCall(index).resolves({ name: user }));
                }
                const result = yield getMessageToBroadcast({ id: '123' });
                (0, chai_1.expect)(result).to.deep.equal(expectedResult);
            }));
        });
    });
    describe('notifyOnMessageChange', () => {
        const setupProxyMock = (dbWatchersDisabled) => {
            const proxyMock = proxyquire_1.default.noCallThru().load('../../../../../../app/lib/server/lib/notifyListener', {
                '@rocket.chat/models': modelsStubs(),
                '@rocket.chat/core-services': coreStubs(dbWatchersDisabled),
                'mem': memStub,
            });
            notifyOnMessageChange = proxyMock.notifyOnMessageChange;
        };
        const testCases = [
            {
                description: 'should broadcast the message if dbWatchersDisabled is true',
                dbWatchersDisabled: true,
                expectBroadcast: true,
                message: sampleMessage,
            },
            {
                description: 'should not broadcast the message if dbWatchersDisabled is false',
                dbWatchersDisabled: false,
                expectBroadcast: false,
                message: sampleMessage,
            },
            {
                description: 'should not broadcast the message if there is no data attributes',
                dbWatchersDisabled: true,
                expectBroadcast: false,
                message: null,
            },
        ];
        testCases.forEach(({ description, dbWatchersDisabled, expectBroadcast, message }) => {
            it(description, () => __awaiter(void 0, void 0, void 0, function* () {
                setupProxyMock(dbWatchersDisabled);
                messagesFindOneStub.resolves(message);
                getSettingValueByIdStub.resolves([]);
                yield notifyOnMessageChange({ id: '123', data: message });
                if (expectBroadcast) {
                    (0, chai_1.expect)(broadcastStub.calledOnce).to.be.true;
                    (0, chai_1.expect)(broadcastStub.calledOnceWith('watch.messages', { message })).to.be.true;
                }
                else {
                    (0, chai_1.expect)(broadcastStub.called).to.be.false;
                }
            }));
        });
    });
});
