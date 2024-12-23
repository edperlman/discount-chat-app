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
const sinon_1 = __importDefault(require("sinon"));
const MatrixEventType_1 = require("../../../../../../../server/services/federation/infrastructure/matrix/definitions/MatrixEventType");
const RoomMessageSent_1 = require("../../../../../../../server/services/federation/infrastructure/matrix/definitions/events/RoomMessageSent");
const Room_1 = require("../../../../../../../server/services/federation/infrastructure/matrix/handlers/Room");
describe('Federation - Infrastructure - handlers - Room - MatrixRoomMessageSentHandler ', () => {
    const normalMessageStub = sinon_1.default.stub();
    const editedMessageStub = sinon_1.default.stub();
    const fileMessageStub = sinon_1.default.stub();
    const threadMessageStub = sinon_1.default.stub();
    const threadFileMessageStub = sinon_1.default.stub();
    const roomService = {
        onExternalMessageReceived: normalMessageStub,
        onExternalFileMessageReceived: fileMessageStub,
        onExternalMessageEditedReceived: editedMessageStub,
        onExternalThreadedMessageReceived: threadMessageStub,
        onExternalThreadedFileMessageReceived: threadFileMessageStub,
    };
    const handler = new Room_1.MatrixRoomMessageSentHandler(roomService);
    describe('#handle()', () => {
        const handlers = {
            [RoomMessageSent_1.MatrixEnumSendMessageType.TEXT]: normalMessageStub,
            [RoomMessageSent_1.MatrixEnumSendMessageType.AUDIO]: fileMessageStub,
            [RoomMessageSent_1.MatrixEnumSendMessageType.FILE]: fileMessageStub,
            [RoomMessageSent_1.MatrixEnumSendMessageType.IMAGE]: fileMessageStub,
            [RoomMessageSent_1.MatrixEnumSendMessageType.NOTICE]: normalMessageStub,
            [RoomMessageSent_1.MatrixEnumSendMessageType.VIDEO]: fileMessageStub,
            [RoomMessageSent_1.MatrixEnumSendMessageType.EMOTE]: normalMessageStub,
        };
        Object.keys(handlers).forEach((type) => {
            it(`should call the correct handler for ${type}`, () => __awaiter(void 0, void 0, void 0, function* () {
                yield handler.handle({ content: { body: '', msgtype: type, url: 'url', info: { mimetype: 'mime', size: 12 } } });
                (0, chai_1.expect)(handlers[type].called).to.be.true;
            }));
        });
        it('should call the default handler if no handler is found', () => __awaiter(void 0, void 0, void 0, function* () {
            yield handler.handle({ content: { body: '', msgtype: 'unknown', url: 'url', info: { mimetype: 'mime', size: 12 } } });
            (0, chai_1.expect)(normalMessageStub.called).to.be.true;
        }));
        it('should throw an error if the msg type is location', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, chai_1.expect)(handler.handle({ content: { body: '', msgtype: 'm.location', url: 'url', info: { mimetype: 'mime', size: 12 } } })).to.be.rejectedWith('Location events are not supported yet');
        }));
        it('should call the edit message method when it is an edition event', () => __awaiter(void 0, void 0, void 0, function* () {
            yield handler.handle({
                content: {
                    'msgtype': RoomMessageSent_1.MatrixEnumSendMessageType.TEXT,
                    'm.new_content': { body: '' },
                    'm.relates_to': { rel_type: RoomMessageSent_1.MatrixEnumRelatesToRelType.REPLACE },
                },
            });
            (0, chai_1.expect)(editedMessageStub.called).to.be.true;
        }));
        describe('#threads', () => {
            const threadHandlers = {
                [RoomMessageSent_1.MatrixEnumSendMessageType.TEXT]: threadMessageStub,
                [RoomMessageSent_1.MatrixEnumSendMessageType.AUDIO]: threadFileMessageStub,
                [RoomMessageSent_1.MatrixEnumSendMessageType.FILE]: threadFileMessageStub,
                [RoomMessageSent_1.MatrixEnumSendMessageType.IMAGE]: threadFileMessageStub,
                [RoomMessageSent_1.MatrixEnumSendMessageType.NOTICE]: threadMessageStub,
                [RoomMessageSent_1.MatrixEnumSendMessageType.VIDEO]: threadFileMessageStub,
                [RoomMessageSent_1.MatrixEnumSendMessageType.EMOTE]: threadMessageStub,
            };
            const threadContent = { 'm.relates_to': { rel_type: MatrixEventType_1.MatrixEventType.MESSAGE_ON_THREAD } };
            Object.keys(threadHandlers).forEach((type) => {
                it(`should call the correct handler for ${type} when the message event is inside a thread`, () => __awaiter(void 0, void 0, void 0, function* () {
                    yield handler.handle({
                        content: Object.assign(Object.assign({}, threadContent), { body: '', msgtype: type, url: 'url', info: { mimetype: 'mime', size: 12 } }),
                    });
                    (0, chai_1.expect)(threadHandlers[type].called).to.be.true;
                }));
            });
            it('should call the default handler if no handler is found', () => __awaiter(void 0, void 0, void 0, function* () {
                yield handler.handle({
                    content: Object.assign(Object.assign({}, threadContent), { body: '', msgtype: 'unknown', url: 'url', info: { mimetype: 'mime', size: 12 } }),
                });
                (0, chai_1.expect)(normalMessageStub.called).to.be.true;
            }));
            it('should throw an error if the msg type is location', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, chai_1.expect)(handler.handle({
                    content: Object.assign(Object.assign({}, threadContent), { body: '', msgtype: 'm.location', url: 'url', info: { mimetype: 'mime', size: 12 } }),
                })).to.be.rejectedWith('Location events are not supported yet');
            }));
            it('should call the edit message method when it is an edition event', () => __awaiter(void 0, void 0, void 0, function* () {
                yield handler.handle({
                    content: Object.assign(Object.assign({}, threadContent), { 'msgtype': RoomMessageSent_1.MatrixEnumSendMessageType.TEXT, 'm.new_content': { body: '' }, 'm.relates_to': { rel_type: RoomMessageSent_1.MatrixEnumRelatesToRelType.REPLACE } }),
                });
                (0, chai_1.expect)(editedMessageStub.called).to.be.true;
            }));
        });
    });
});
