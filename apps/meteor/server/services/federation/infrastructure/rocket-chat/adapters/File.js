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
exports.RocketChatFileAdapter = void 0;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../../../../app/file-upload/server");
const sendFileMessage_1 = require("../../../../../../app/file-upload/server/methods/sendFileMessage");
class RocketChatFileAdapter {
    uploadFile(readableStream, internalRoomId, internalUser, fileRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileStore = server_1.FileUpload.getStore('Uploads');
            const uploadedFile = yield fileStore.insert(fileRecord, readableStream);
            const { files, attachments } = yield (0, sendFileMessage_1.parseFileIntoMessageAttachments)(uploadedFile, internalRoomId, internalUser);
            return { files, attachments };
        });
    }
    getBufferFromFileRecord(fileRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield server_1.FileUpload.getBuffer(fileRecord);
            if (!(buffer instanceof Buffer)) {
                throw new Error('Unknown error');
            }
            return buffer;
        });
    }
    getFileRecordById(fileId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Uploads.findOneById(fileId);
        });
    }
    extractMetadataFromFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if ((_a = file.type) === null || _a === void 0 ? void 0 : _a.startsWith('image/')) {
                const metadata = yield server_1.FileUpload.extractMetadata(file);
                return {
                    format: metadata.format,
                    height: metadata.height,
                    width: metadata.width,
                };
            }
            if ((_b = file.type) === null || _b === void 0 ? void 0 : _b.startsWith('video/')) {
                return {
                    height: 200,
                    width: 250,
                };
            }
            return {};
        });
    }
    getBufferForAvatarFile(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield models_1.Avatars.findOneByName(username);
            if (!(file === null || file === void 0 ? void 0 : file._id)) {
                return;
            }
            return server_1.FileUpload.getBuffer(file);
        });
    }
    getFileMetadataForAvatarFile(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = (yield models_1.Avatars.findOneByName(username));
            return {
                type: file.type,
                name: file.name,
            };
        });
    }
}
exports.RocketChatFileAdapter = RocketChatFileAdapter;
