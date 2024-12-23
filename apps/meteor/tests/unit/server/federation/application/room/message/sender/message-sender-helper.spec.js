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
const message_sender_helper_1 = require("../../../../../../../../server/services/federation/application/room/message/sender/message-sender-helper");
const FederatedUser_1 = require("../../../../../../../../server/services/federation/domain/FederatedUser");
describe('Federation - Application - Message Senders', () => {
    const bridge = {
        sendMessage: sinon_1.default.stub(),
        sendMessageFileToRoom: sinon_1.default.stub(),
        sendReplyToMessage: sinon_1.default.stub(),
        sendReplyMessageFileToRoom: sinon_1.default.stub(),
        sendThreadMessage: sinon_1.default.stub(),
        sendThreadReplyToMessage: sinon_1.default.stub(),
        sendMessageFileToThread: sinon_1.default.stub(),
        sendReplyMessageFileToThread: sinon_1.default.stub(),
    };
    const fileAdapter = {
        getBufferFromFileRecord: sinon_1.default.stub(),
        getFileRecordById: sinon_1.default.stub(),
        extractMetadataFromFile: sinon_1.default.stub(),
    };
    const messageAdapter = {
        setExternalFederationEventOnMessage: sinon_1.default.stub(),
        getMessageById: sinon_1.default.stub(),
    };
    const userAdapter = {
        getFederatedUserByInternalId: sinon_1.default.stub(),
    };
    afterEach(() => {
        bridge.sendMessage.reset();
        bridge.sendMessageFileToRoom.reset();
        bridge.sendReplyMessageFileToRoom.reset();
        bridge.sendThreadReplyToMessage.reset();
        bridge.sendMessageFileToThread.reset();
        bridge.sendReplyMessageFileToThread.reset();
        fileAdapter.getBufferFromFileRecord.reset();
        fileAdapter.getFileRecordById.reset();
        fileAdapter.extractMetadataFromFile.reset();
        messageAdapter.setExternalFederationEventOnMessage.reset();
        messageAdapter.getMessageById.reset();
        userAdapter.getFederatedUserByInternalId.reset();
    });
    describe('TextExternalMessageSender', () => {
        const roomId = 'roomId';
        const senderId = 'senderId';
        const message = { _id: '_id', msg: 'text' };
        const user = FederatedUser_1.FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: true,
        });
        describe('#sendMessage()', () => {
            it('should send a message through the bridge', () => __awaiter(void 0, void 0, void 0, function* () {
                bridge.sendMessage.resolves('externalMessageId');
                yield (0, message_sender_helper_1.getExternalMessageSender)({
                    message: {},
                    isThreadedMessage: false,
                    bridge: bridge,
                    internalFileAdapter: fileAdapter,
                    internalMessageAdapter: messageAdapter,
                    internalUserAdapter: userAdapter,
                }).sendMessage(roomId, senderId, message);
                (0, chai_1.expect)(bridge.sendMessage.calledWith(roomId, senderId, message)).to.be.true;
                (0, chai_1.expect)(messageAdapter.setExternalFederationEventOnMessage.calledWith(message._id, 'externalMessageId')).to.be.true;
            }));
        });
        describe('#sendQuoteMessage()', () => {
            it('should send a quote message through the bridge', () => __awaiter(void 0, void 0, void 0, function* () {
                userAdapter.getFederatedUserByInternalId.resolves(user);
                bridge.sendReplyToMessage.resolves('externalMessageId');
                yield (0, message_sender_helper_1.getExternalMessageSender)({
                    message: {},
                    isThreadedMessage: false,
                    bridge: bridge,
                    internalFileAdapter: fileAdapter,
                    internalMessageAdapter: messageAdapter,
                    internalUserAdapter: userAdapter,
                }).sendQuoteMessage(roomId, senderId, message, { federation: { eventId: 'idToReplyTo' } });
                (0, chai_1.expect)(bridge.sendReplyToMessage.calledWith(roomId, senderId, 'idToReplyTo', user.getExternalId(), message.msg)).to.be.true;
                (0, chai_1.expect)(messageAdapter.setExternalFederationEventOnMessage.calledWith(message._id, 'externalMessageId')).to.be.true;
            }));
        });
    });
    describe('FileExternalMessageSender', () => {
        const roomId = 'roomId';
        const senderId = 'senderId';
        const message = { _id: '_id', msg: 'text', files: [{ _id: 'fileId' }] };
        describe('#sendMessage()', () => {
            it('should not upload the file to the bridge if the file does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                fileAdapter.getFileRecordById.resolves(undefined);
                yield (0, message_sender_helper_1.getExternalMessageSender)({
                    message,
                    isThreadedMessage: false,
                    bridge: bridge,
                    internalFileAdapter: fileAdapter,
                    internalMessageAdapter: messageAdapter,
                    internalUserAdapter: userAdapter,
                }).sendMessage(roomId, senderId, message);
                (0, chai_1.expect)(bridge.sendMessageFileToRoom.called).to.be.false;
                (0, chai_1.expect)(fileAdapter.getBufferFromFileRecord.called).to.be.false;
            }));
            it('should not upload the file to the bridge if the file size does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                fileAdapter.getFileRecordById.resolves({});
                yield (0, message_sender_helper_1.getExternalMessageSender)({
                    message,
                    isThreadedMessage: false,
                    bridge: bridge,
                    internalFileAdapter: fileAdapter,
                    internalMessageAdapter: messageAdapter,
                    internalUserAdapter: userAdapter,
                }).sendMessage(roomId, senderId, message);
                (0, chai_1.expect)(bridge.sendMessageFileToRoom.called).to.be.false;
                (0, chai_1.expect)(fileAdapter.getBufferFromFileRecord.called).to.be.false;
            }));
            it('should not upload the file to the bridge if the file type does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                fileAdapter.getFileRecordById.resolves({ size: 12 });
                yield (0, message_sender_helper_1.getExternalMessageSender)({
                    message,
                    isThreadedMessage: false,
                    bridge: bridge,
                    internalFileAdapter: fileAdapter,
                    internalMessageAdapter: messageAdapter,
                    internalUserAdapter: userAdapter,
                }).sendMessage(roomId, senderId, message);
                (0, chai_1.expect)(bridge.sendMessageFileToRoom.called).to.be.false;
                (0, chai_1.expect)(fileAdapter.getBufferFromFileRecord.called).to.be.false;
            }));
            it('should send a message (upload the file) through the bridge', () => __awaiter(void 0, void 0, void 0, function* () {
                fileAdapter.getFileRecordById.resolves({ name: 'filename', size: 12, type: 'image/png' });
                fileAdapter.getBufferFromFileRecord.resolves({ buffer: 'buffer' });
                fileAdapter.extractMetadataFromFile.resolves({ width: 100, height: 100, format: 'png' });
                bridge.sendMessageFileToRoom.resolves('externalMessageId');
                yield (0, message_sender_helper_1.getExternalMessageSender)({
                    message,
                    isThreadedMessage: false,
                    bridge: bridge,
                    internalFileAdapter: fileAdapter,
                    internalMessageAdapter: messageAdapter,
                    internalUserAdapter: userAdapter,
                }).sendMessage(roomId, senderId, message);
                (0, chai_1.expect)(fileAdapter.getBufferFromFileRecord.calledWith({ name: 'filename', size: 12, type: 'image/png' })).to.be.true;
                (0, chai_1.expect)(bridge.sendMessageFileToRoom.calledWith(roomId, senderId, { buffer: 'buffer' }, {
                    filename: 'filename',
                    fileSize: 12,
                    mimeType: 'image/png',
                    metadata: { width: 100, height: 100, format: 'png' },
                })).to.be.true;
                (0, chai_1.expect)(messageAdapter.setExternalFederationEventOnMessage.calledWith(message._id, 'externalMessageId')).to.be.true;
            }));
        });
        describe('#sendQuoteMessage()', () => {
            it('should not upload the file to the bridge if the file does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                fileAdapter.getFileRecordById.resolves(undefined);
                yield (0, message_sender_helper_1.getExternalMessageSender)({
                    message,
                    isThreadedMessage: false,
                    bridge: bridge,
                    internalFileAdapter: fileAdapter,
                    internalMessageAdapter: messageAdapter,
                    internalUserAdapter: userAdapter,
                }).sendQuoteMessage(roomId, senderId, message, { federation: { eventId: 'idToReplyTo' } });
                (0, chai_1.expect)(bridge.sendReplyMessageFileToRoom.called).to.be.false;
                (0, chai_1.expect)(fileAdapter.getBufferFromFileRecord.called).to.be.false;
            }));
            it('should not upload the file to the bridge if the file size does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                fileAdapter.getFileRecordById.resolves({});
                yield (0, message_sender_helper_1.getExternalMessageSender)({
                    message,
                    isThreadedMessage: false,
                    bridge: bridge,
                    internalFileAdapter: fileAdapter,
                    internalMessageAdapter: messageAdapter,
                    internalUserAdapter: userAdapter,
                }).sendQuoteMessage(roomId, senderId, message, { federation: { eventId: 'idToReplyTo' } });
                (0, chai_1.expect)(bridge.sendMessageFileToRoom.called).to.be.false;
                (0, chai_1.expect)(fileAdapter.getBufferFromFileRecord.called).to.be.false;
            }));
            it('should not upload the file to the bridge if the file type does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                fileAdapter.getFileRecordById.resolves({ size: 12 });
                yield (0, message_sender_helper_1.getExternalMessageSender)({
                    message,
                    isThreadedMessage: false,
                    bridge: bridge,
                    internalFileAdapter: fileAdapter,
                    internalMessageAdapter: messageAdapter,
                    internalUserAdapter: userAdapter,
                }).sendQuoteMessage(roomId, senderId, message, { federation: { eventId: 'idToReplyTo' } });
                (0, chai_1.expect)(bridge.sendReplyMessageFileToRoom.called).to.be.false;
                (0, chai_1.expect)(fileAdapter.getBufferFromFileRecord.called).to.be.false;
            }));
            it('should send a message (upload the file) through the bridge', () => __awaiter(void 0, void 0, void 0, function* () {
                fileAdapter.getFileRecordById.resolves({ name: 'filename', size: 12, type: 'image/png' });
                fileAdapter.getBufferFromFileRecord.resolves({ buffer: 'buffer' });
                fileAdapter.extractMetadataFromFile.resolves({ width: 100, height: 100, format: 'png' });
                bridge.sendReplyMessageFileToRoom.resolves('externalMessageId');
                yield (0, message_sender_helper_1.getExternalMessageSender)({
                    message,
                    isThreadedMessage: false,
                    bridge: bridge,
                    internalFileAdapter: fileAdapter,
                    internalMessageAdapter: messageAdapter,
                    internalUserAdapter: userAdapter,
                }).sendQuoteMessage(roomId, senderId, message, { federation: { eventId: 'idToReplyTo' } });
                (0, chai_1.expect)(fileAdapter.getBufferFromFileRecord.calledWith({ name: 'filename', size: 12, type: 'image/png' })).to.be.true;
                (0, chai_1.expect)(bridge.sendReplyMessageFileToRoom.calledWith(roomId, senderId, { buffer: 'buffer' }, {
                    filename: 'filename',
                    fileSize: 12,
                    mimeType: 'image/png',
                    metadata: { width: 100, height: 100, format: 'png' },
                }, 'idToReplyTo')).to.be.true;
                (0, chai_1.expect)(messageAdapter.setExternalFederationEventOnMessage.calledWith(message._id, 'externalMessageId')).to.be.true;
            }));
        });
    });
    describe('#threads', () => {
        describe('ThreadTextExternalMessageSender', () => {
            const roomId = 'roomId';
            const senderId = 'senderId';
            const threadMessage = { _id: '_id', msg: 'text', tmid: 'tmid' };
            const user = FederatedUser_1.FederatedUser.createInstance('externalInviterId', {
                name: 'normalizedInviterId',
                username: 'normalizedInviterId',
                existsOnlyOnProxyServer: true,
            });
            describe('#sendMessage()', () => {
                it('should NOT send a message through the bridge if the message does not contain a thread id', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: {},
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendMessage(roomId, senderId, threadMessage);
                    (0, chai_1.expect)(bridge.sendThreadMessage.called).to.be.false;
                }));
                it('should NOT send a message through the bridge if the parent message does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
                    messageAdapter.getMessageById.resolves(undefined);
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: {},
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendMessage(roomId, senderId, threadMessage);
                    (0, chai_1.expect)(bridge.sendThreadMessage.called).to.be.false;
                }));
                it('should send a message in the thread through the bridge', () => __awaiter(void 0, void 0, void 0, function* () {
                    messageAdapter.getMessageById.resolves({ federation: { eventId: 'eventId' } });
                    bridge.sendThreadMessage.resolves('externalMessageId');
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: {},
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendMessage(roomId, senderId, threadMessage);
                    (0, chai_1.expect)(bridge.sendThreadMessage.calledWith(roomId, senderId, threadMessage, 'eventId')).to.be.true;
                    (0, chai_1.expect)(messageAdapter.setExternalFederationEventOnMessage.calledWith(threadMessage._id, 'externalMessageId')).to.be.true;
                }));
            });
            describe('#sendQuoteMessage()', () => {
                it('should NOT send a message through the bridge if the message does not contain a thread id', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: {},
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendQuoteMessage(roomId, senderId, threadMessage, { federation: { eventId: 'idToReplyTo' } });
                    (0, chai_1.expect)(bridge.sendThreadReplyToMessage.called).to.be.false;
                }));
                it('should NOT send a message through the bridge if the parent message does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
                    messageAdapter.getMessageById.resolves({ federation: { eventId: 'eventId' } });
                    messageAdapter.getMessageById.resolves(undefined);
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: {},
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendQuoteMessage(roomId, senderId, threadMessage, { federation: { eventId: 'idToReplyTo' } });
                    (0, chai_1.expect)(bridge.sendThreadReplyToMessage.called).to.be.false;
                }));
                it('should send a quote message in a thread through the bridge', () => __awaiter(void 0, void 0, void 0, function* () {
                    messageAdapter.getMessageById.resolves({ federation: { eventId: 'eventId' } });
                    userAdapter.getFederatedUserByInternalId.resolves(user);
                    bridge.sendThreadReplyToMessage.resolves('externalMessageId');
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: {},
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendQuoteMessage(roomId, senderId, threadMessage, {
                        federation: { eventId: 'idToReplyTo' },
                    });
                    (0, chai_1.expect)(bridge.sendThreadReplyToMessage.calledWith(roomId, senderId, 'idToReplyTo', user.getExternalId(), threadMessage.msg, 'eventId')).to.be.true;
                    (0, chai_1.expect)(messageAdapter.setExternalFederationEventOnMessage.calledWith(threadMessage._id, 'externalMessageId')).to.be.true;
                }));
            });
        });
        describe('ThreadFileExternalMessageSender', () => {
            const roomId = 'roomId';
            const senderId = 'senderId';
            const threadMessage = { _id: '_id', msg: 'text', files: [{ _id: 'fileId' }], tmid: 'tmid' };
            describe('#sendMessage()', () => {
                it('should NOT send a message through the bridge if the message does not contain a thread id', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: {},
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendMessage(roomId, senderId, threadMessage);
                    (0, chai_1.expect)(bridge.sendMessageFileToThread.called).to.be.false;
                }));
                it('should NOT send a message through the bridge if the parent message does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
                    messageAdapter.getMessageById.resolves(undefined);
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: threadMessage,
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendMessage(roomId, senderId, threadMessage);
                    (0, chai_1.expect)(bridge.sendMessageFileToThread.called).to.be.false;
                }));
                it('should not upload the file to the bridge if the file does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                    messageAdapter.getMessageById.resolves({ federation: { eventId: 'eventId' } });
                    bridge.sendThreadMessage.resolves('externalMessageId');
                    fileAdapter.getFileRecordById.resolves(undefined);
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: threadMessage,
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendMessage(roomId, senderId, threadMessage);
                    (0, chai_1.expect)(bridge.sendMessageFileToThread.called).to.be.false;
                    (0, chai_1.expect)(fileAdapter.getBufferFromFileRecord.called).to.be.false;
                }));
                it('should not upload the file to the bridge if the file size does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                    messageAdapter.getMessageById.resolves({ federation: { eventId: 'eventId' } });
                    bridge.sendThreadMessage.resolves('externalMessageId');
                    fileAdapter.getFileRecordById.resolves({});
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: threadMessage,
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendMessage(roomId, senderId, threadMessage);
                    (0, chai_1.expect)(bridge.sendMessageFileToThread.called).to.be.false;
                    (0, chai_1.expect)(fileAdapter.getBufferFromFileRecord.called).to.be.false;
                }));
                it('should not upload the file to the bridge if the file type does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                    messageAdapter.getMessageById.resolves({ federation: { eventId: 'eventId' } });
                    bridge.sendThreadMessage.resolves('externalMessageId');
                    fileAdapter.getFileRecordById.resolves({ size: 12 });
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: threadMessage,
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendMessage(roomId, senderId, threadMessage);
                    (0, chai_1.expect)(bridge.sendMessageFileToThread.called).to.be.false;
                    (0, chai_1.expect)(fileAdapter.getBufferFromFileRecord.called).to.be.false;
                }));
                it('should send a message (upload the file) in a thread through the bridge', () => __awaiter(void 0, void 0, void 0, function* () {
                    messageAdapter.getMessageById.resolves({ federation: { eventId: 'eventId' } });
                    bridge.sendThreadMessage.resolves('externalMessageId');
                    fileAdapter.getFileRecordById.resolves({ name: 'filename', size: 12, type: 'image/png' });
                    fileAdapter.getBufferFromFileRecord.resolves({ buffer: 'buffer' });
                    fileAdapter.extractMetadataFromFile.resolves({ width: 100, height: 100, format: 'png' });
                    bridge.sendMessageFileToThread.resolves('externalMessageId');
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: threadMessage,
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendMessage(roomId, senderId, threadMessage);
                    (0, chai_1.expect)(fileAdapter.getBufferFromFileRecord.calledWith({ name: 'filename', size: 12, type: 'image/png' })).to.be.true;
                    (0, chai_1.expect)(bridge.sendMessageFileToThread.calledWith(roomId, senderId, { buffer: 'buffer' }, {
                        filename: 'filename',
                        fileSize: 12,
                        mimeType: 'image/png',
                        metadata: { width: 100, height: 100, format: 'png' },
                    }), 'eventId').to.be.true;
                    (0, chai_1.expect)(messageAdapter.setExternalFederationEventOnMessage.calledWith(threadMessage._id, 'externalMessageId')).to.be.true;
                }));
            });
            describe('#sendQuoteMessage()', () => {
                it('should NOT send a message through the bridge if the message does not contain a thread id', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: {},
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendQuoteMessage(roomId, senderId, threadMessage, { federation: { eventId: 'idToReplyTo' } });
                    (0, chai_1.expect)(bridge.sendReplyMessageFileToThread.called).to.be.false;
                }));
                it('should NOT send a message through the bridge if the parent message does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
                    messageAdapter.getMessageById.resolves(undefined);
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: threadMessage,
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendQuoteMessage(roomId, senderId, threadMessage, { federation: { eventId: 'idToReplyTo' } });
                    (0, chai_1.expect)(bridge.sendReplyMessageFileToThread.called).to.be.false;
                }));
                it('should not upload the file to the bridge if the file does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                    messageAdapter.getMessageById.resolves({ federation: { eventId: 'eventId' } });
                    fileAdapter.getFileRecordById.resolves(undefined);
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: threadMessage,
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendQuoteMessage(roomId, senderId, threadMessage, { federation: { eventId: 'idToReplyTo' } });
                    (0, chai_1.expect)(bridge.sendReplyMessageFileToThread.called).to.be.false;
                    (0, chai_1.expect)(fileAdapter.getBufferFromFileRecord.called).to.be.false;
                }));
                it('should not upload the file to the bridge if the file size does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                    messageAdapter.getMessageById.resolves({ federation: { eventId: 'eventId' } });
                    fileAdapter.getFileRecordById.resolves({});
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: threadMessage,
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendQuoteMessage(roomId, senderId, threadMessage, { federation: { eventId: 'idToReplyTo' } });
                    (0, chai_1.expect)(bridge.sendReplyMessageFileToThread.called).to.be.false;
                    (0, chai_1.expect)(fileAdapter.getBufferFromFileRecord.called).to.be.false;
                }));
                it('should not upload the file to the bridge if the file type does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                    messageAdapter.getMessageById.resolves({ federation: { eventId: 'eventId' } });
                    fileAdapter.getFileRecordById.resolves({ size: 12 });
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: threadMessage,
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendQuoteMessage(roomId, senderId, threadMessage, { federation: { eventId: 'idToReplyTo' } });
                    (0, chai_1.expect)(bridge.sendReplyMessageFileToThread.called).to.be.false;
                    (0, chai_1.expect)(fileAdapter.getBufferFromFileRecord.called).to.be.false;
                }));
                it('should send a message (upload the file) through the bridge', () => __awaiter(void 0, void 0, void 0, function* () {
                    messageAdapter.getMessageById.resolves({ federation: { eventId: 'eventId' } });
                    fileAdapter.getFileRecordById.resolves({ name: 'filename', size: 12, type: 'image/png' });
                    fileAdapter.getBufferFromFileRecord.resolves({ buffer: 'buffer' });
                    fileAdapter.extractMetadataFromFile.resolves({ width: 100, height: 100, format: 'png' });
                    bridge.sendReplyMessageFileToThread.resolves('externalMessageId');
                    yield (0, message_sender_helper_1.getExternalMessageSender)({
                        message: threadMessage,
                        isThreadedMessage: true,
                        bridge: bridge,
                        internalFileAdapter: fileAdapter,
                        internalMessageAdapter: messageAdapter,
                        internalUserAdapter: userAdapter,
                    }).sendQuoteMessage(roomId, senderId, threadMessage, { federation: { eventId: 'idToReplyTo' } });
                    (0, chai_1.expect)(fileAdapter.getBufferFromFileRecord.calledWith({ name: 'filename', size: 12, type: 'image/png' })).to.be.true;
                    (0, chai_1.expect)(bridge.sendReplyMessageFileToThread.calledWith(roomId, senderId, { buffer: 'buffer' }, {
                        filename: 'filename',
                        fileSize: 12,
                        mimeType: 'image/png',
                        metadata: { width: 100, height: 100, format: 'png' },
                    }, 'idToReplyTo', 'eventId')).to.be.true;
                    (0, chai_1.expect)(messageAdapter.setExternalFederationEventOnMessage.calledWith(threadMessage._id, 'externalMessageId')).to.be.true;
                }));
            });
        });
    });
});
