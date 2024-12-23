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
const filesize_1 = __importDefault(require("filesize"));
const server_1 = require("../../../../api/server");
const getUploadFormData_1 = require("../../../../api/server/lib/getUploadFormData");
const server_2 = require("../../../../file-upload/server");
const server_3 = require("../../../../settings/server");
const restrictions_1 = require("../../../../utils/server/restrictions");
const sendFileLivechatMessage_1 = require("../../../server/methods/sendFileLivechatMessage");
server_1.API.v1.addRoute('livechat/upload/:rid', {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.request.headers['x-visitor-token']) {
                return server_1.API.v1.unauthorized();
            }
            const canUpload = server_3.settings.get('Livechat_fileupload_enabled') && server_3.settings.get('FileUpload_Enabled');
            if (!canUpload) {
                return server_1.API.v1.failure({
                    reason: 'error-file-upload-disabled',
                });
            }
            const visitorToken = this.request.headers['x-visitor-token'];
            const visitor = yield models_1.LivechatVisitors.getVisitorByToken(visitorToken, {});
            if (!visitor) {
                return server_1.API.v1.unauthorized();
            }
            const room = yield models_1.LivechatRooms.findOneOpenByRoomIdAndVisitorToken(this.urlParams.rid, visitorToken);
            if (!room) {
                return server_1.API.v1.unauthorized();
            }
            const maxFileSize = server_3.settings.get('FileUpload_MaxFileSize') || 104857600;
            const file = yield (0, getUploadFormData_1.getUploadFormData)({
                request: this.request,
            }, { field: 'file', sizeLimit: maxFileSize });
            const { fields, fileBuffer, filename, mimetype } = file;
            if (!(0, restrictions_1.fileUploadIsValidContentType)(mimetype)) {
                return server_1.API.v1.failure({
                    reason: 'error-type-not-allowed',
                });
            }
            const buffLength = fileBuffer.length;
            // -1 maxFileSize means there is no limit
            if (maxFileSize > -1 && buffLength > maxFileSize) {
                return server_1.API.v1.failure({
                    reason: 'error-size-not-allowed',
                    sizeAllowed: (0, filesize_1.default)(maxFileSize),
                });
            }
            const fileStore = server_2.FileUpload.getStore('Uploads');
            const details = {
                name: filename,
                size: buffLength,
                type: mimetype,
                rid: this.urlParams.rid,
                visitorToken,
            };
            const uploadedFile = yield fileStore.insert(details, fileBuffer);
            if (!uploadedFile) {
                return server_1.API.v1.failure('Invalid file');
            }
            uploadedFile.description = fields.description;
            delete fields.description;
            return server_1.API.v1.success(yield (0, sendFileLivechatMessage_1.sendFileLivechatMessage)({ roomId: this.urlParams.rid, visitorToken, file: uploadedFile, msgData: fields }));
        });
    },
});
