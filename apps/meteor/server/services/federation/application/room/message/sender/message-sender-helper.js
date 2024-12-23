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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExternalMessageSender = void 0;
class TextExternalMessageSender {
    constructor(bridge, internalMessageAdapter, internalUserAdapter) {
        this.bridge = bridge;
        this.internalMessageAdapter = internalMessageAdapter;
        this.internalUserAdapter = internalUserAdapter;
    }
    sendMessage(externalRoomId, externalSenderId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const externalMessageId = yield this.bridge.sendMessage(externalRoomId, externalSenderId, message);
            yield this.internalMessageAdapter.setExternalFederationEventOnMessage(message._id, externalMessageId);
        });
    }
    sendQuoteMessage(externalRoomId, externalSenderId, message, messageToReplyTo) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const originalSender = yield this.internalUserAdapter.getFederatedUserByInternalId((_a = messageToReplyTo === null || messageToReplyTo === void 0 ? void 0 : messageToReplyTo.u) === null || _a === void 0 ? void 0 : _a._id);
            const externalMessageId = yield this.bridge.sendReplyToMessage(externalRoomId, externalSenderId, (_b = messageToReplyTo.federation) === null || _b === void 0 ? void 0 : _b.eventId, originalSender === null || originalSender === void 0 ? void 0 : originalSender.getExternalId(), message.msg);
            yield this.internalMessageAdapter.setExternalFederationEventOnMessage(message._id, externalMessageId);
        });
    }
}
class FileExternalMessageSender {
    constructor(bridge, internalFileHelper, internalMessageAdapter) {
        this.bridge = bridge;
        this.internalFileHelper = internalFileHelper;
        this.internalMessageAdapter = internalMessageAdapter;
    }
    sendMessage(externalRoomId, externalSenderId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const file = yield this.internalFileHelper.getFileRecordById((_a = (message.files || [])[0]) === null || _a === void 0 ? void 0 : _a._id);
            if (!(file === null || file === void 0 ? void 0 : file.size) || !file.type) {
                return;
            }
            const buffer = yield this.internalFileHelper.getBufferFromFileRecord(file);
            const metadata = yield this.internalFileHelper.extractMetadataFromFile(file);
            const externalMessageId = yield this.bridge.sendMessageFileToRoom(externalRoomId, externalSenderId, buffer, {
                filename: file.name || '',
                fileSize: file.size,
                mimeType: file.type,
                metadata: {
                    width: metadata === null || metadata === void 0 ? void 0 : metadata.width,
                    height: metadata === null || metadata === void 0 ? void 0 : metadata.height,
                    format: metadata === null || metadata === void 0 ? void 0 : metadata.format,
                },
            });
            yield this.internalMessageAdapter.setExternalFederationEventOnMessage(message._id, externalMessageId);
        });
    }
    sendQuoteMessage(externalRoomId, externalSenderId, message, messageToReplyTo) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const file = yield this.internalFileHelper.getFileRecordById((_a = (message.files || [])[0]) === null || _a === void 0 ? void 0 : _a._id);
            if (!(file === null || file === void 0 ? void 0 : file.size) || !file.type) {
                return;
            }
            const buffer = yield this.internalFileHelper.getBufferFromFileRecord(file);
            const metadata = yield this.internalFileHelper.extractMetadataFromFile(file);
            const externalMessageId = yield this.bridge.sendReplyMessageFileToRoom(externalRoomId, externalSenderId, buffer, {
                filename: file.name || '',
                fileSize: file.size,
                mimeType: file.type,
                metadata: {
                    width: metadata === null || metadata === void 0 ? void 0 : metadata.width,
                    height: metadata === null || metadata === void 0 ? void 0 : metadata.height,
                    format: metadata === null || metadata === void 0 ? void 0 : metadata.format,
                },
            }, (_b = messageToReplyTo.federation) === null || _b === void 0 ? void 0 : _b.eventId);
            yield this.internalMessageAdapter.setExternalFederationEventOnMessage(message._id, externalMessageId);
        });
    }
}
class ThreadTextExternalMessageSender {
    constructor(bridge, internalMessageAdapter, internalUserAdapter) {
        this.bridge = bridge;
        this.internalMessageAdapter = internalMessageAdapter;
        this.internalUserAdapter = internalUserAdapter;
    }
    sendMessage(externalRoomId, externalSenderId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!message.tmid) {
                return;
            }
            const parentMessage = yield this.internalMessageAdapter.getMessageById(message.tmid);
            if (!((_a = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.federation) === null || _a === void 0 ? void 0 : _a.eventId)) {
                return;
            }
            const externalMessageId = yield this.bridge.sendThreadMessage(externalRoomId, externalSenderId, message, parentMessage.federation.eventId);
            yield this.internalMessageAdapter.setExternalFederationEventOnMessage(message._id, externalMessageId);
        });
    }
    sendQuoteMessage(externalRoomId, externalSenderId, message, messageToReplyTo) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!message.tmid) {
                return;
            }
            const parentMessage = yield this.internalMessageAdapter.getMessageById(message.tmid);
            if (!((_a = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.federation) === null || _a === void 0 ? void 0 : _a.eventId)) {
                return;
            }
            const originalSender = yield this.internalUserAdapter.getFederatedUserByInternalId((_b = messageToReplyTo === null || messageToReplyTo === void 0 ? void 0 : messageToReplyTo.u) === null || _b === void 0 ? void 0 : _b._id);
            const externalMessageId = yield this.bridge.sendThreadReplyToMessage(externalRoomId, externalSenderId, (_c = messageToReplyTo.federation) === null || _c === void 0 ? void 0 : _c.eventId, originalSender === null || originalSender === void 0 ? void 0 : originalSender.getExternalId(), message.msg, parentMessage.federation.eventId);
            yield this.internalMessageAdapter.setExternalFederationEventOnMessage(message._id, externalMessageId);
        });
    }
}
class ThreadFileExternalMessageSender {
    constructor(bridge, internalFileHelper, internalMessageAdapter) {
        this.bridge = bridge;
        this.internalFileHelper = internalFileHelper;
        this.internalMessageAdapter = internalMessageAdapter;
    }
    sendMessage(externalRoomId, externalSenderId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const file = yield this.internalFileHelper.getFileRecordById((_a = (message.files || [])[0]) === null || _a === void 0 ? void 0 : _a._id);
            if (!(file === null || file === void 0 ? void 0 : file.size) || !file.type || !file.name) {
                return;
            }
            if (!message.tmid) {
                return;
            }
            const parentMessage = yield this.internalMessageAdapter.getMessageById(message.tmid);
            if (!((_b = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.federation) === null || _b === void 0 ? void 0 : _b.eventId)) {
                return;
            }
            const buffer = yield this.internalFileHelper.getBufferFromFileRecord(file);
            const metadata = yield this.internalFileHelper.extractMetadataFromFile(file);
            const externalMessageId = yield this.bridge.sendMessageFileToThread(externalRoomId, externalSenderId, buffer, {
                filename: file.name,
                fileSize: file.size,
                mimeType: file.type,
                metadata: {
                    width: metadata === null || metadata === void 0 ? void 0 : metadata.width,
                    height: metadata === null || metadata === void 0 ? void 0 : metadata.height,
                    format: metadata === null || metadata === void 0 ? void 0 : metadata.format,
                },
            }, parentMessage.federation.eventId);
            yield this.internalMessageAdapter.setExternalFederationEventOnMessage(message._id, externalMessageId);
        });
    }
    sendQuoteMessage(externalRoomId, externalSenderId, message, messageToReplyTo) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const file = yield this.internalFileHelper.getFileRecordById((_a = (message.files || [])[0]) === null || _a === void 0 ? void 0 : _a._id);
            if (!(file === null || file === void 0 ? void 0 : file.size) || !file.type || !file.name) {
                return;
            }
            if (!message.tmid) {
                return;
            }
            const parentMessage = yield this.internalMessageAdapter.getMessageById(message.tmid);
            if (!((_b = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.federation) === null || _b === void 0 ? void 0 : _b.eventId)) {
                return;
            }
            const buffer = yield this.internalFileHelper.getBufferFromFileRecord(file);
            const metadata = yield this.internalFileHelper.extractMetadataFromFile(file);
            const externalMessageId = yield this.bridge.sendReplyMessageFileToThread(externalRoomId, externalSenderId, buffer, {
                filename: file.name,
                fileSize: file.size,
                mimeType: file.type,
                metadata: {
                    width: metadata === null || metadata === void 0 ? void 0 : metadata.width,
                    height: metadata === null || metadata === void 0 ? void 0 : metadata.height,
                    format: metadata === null || metadata === void 0 ? void 0 : metadata.format,
                },
            }, (_c = messageToReplyTo.federation) === null || _c === void 0 ? void 0 : _c.eventId, parentMessage.federation.eventId);
            yield this.internalMessageAdapter.setExternalFederationEventOnMessage(message._id, externalMessageId);
        });
    }
}
const getExternalMessageSender = ({ message, bridge, internalFileAdapter, internalMessageAdapter, internalUserAdapter, isThreadedMessage, }) => {
    if (isThreadedMessage) {
        return message.files
            ? new ThreadFileExternalMessageSender(bridge, internalFileAdapter, internalMessageAdapter)
            : new ThreadTextExternalMessageSender(bridge, internalMessageAdapter, internalUserAdapter);
    }
    return message.files
        ? new FileExternalMessageSender(bridge, internalFileAdapter, internalMessageAdapter)
        : new TextExternalMessageSender(bridge, internalMessageAdapter, internalUserAdapter);
};
exports.getExternalMessageSender = getExternalMessageSender;
