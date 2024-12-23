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
exports.UploadService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const server_1 = require("../../../app/file-upload/server");
const sendFileMessage_1 = require("../../../app/file-upload/server/methods/sendFileMessage");
const sendFileLivechatMessage_1 = require("../../../app/livechat/server/methods/sendFileLivechatMessage");
class UploadService extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'upload';
    }
    uploadFile(_a) {
        return __awaiter(this, arguments, void 0, function* ({ buffer, details }) {
            const fileStore = server_1.FileUpload.getStore('Uploads');
            return fileStore.insert(details, buffer);
        });
    }
    sendFileMessage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ roomId, file, userId, message }) {
            return (0, sendFileMessage_1.sendFileMessage)(userId, { roomId, file, msgData: message });
        });
    }
    sendFileLivechatMessage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ roomId, visitorToken, file, message }) {
            return (0, sendFileLivechatMessage_1.sendFileLivechatMessage)({ roomId, visitorToken, file, msgData: message });
        });
    }
    getFileBuffer(_a) {
        return __awaiter(this, arguments, void 0, function* ({ file }) {
            const buffer = yield server_1.FileUpload.getBuffer(file);
            if (!(buffer instanceof Buffer)) {
                throw new Error('Unknown error');
            }
            return buffer;
        });
    }
    extractMetadata(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return server_1.FileUpload.extractMetadata(file);
        });
    }
    parseFileIntoMessageAttachments(file, roomId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, sendFileMessage_1.parseFileIntoMessageAttachments)(file, roomId, user);
        });
    }
}
exports.UploadService = UploadService;
