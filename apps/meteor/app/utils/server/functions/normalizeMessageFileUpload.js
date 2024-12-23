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
exports.normalizeMessageFileUpload = void 0;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../file-upload/server");
const getURL_1 = require("../getURL");
const normalizeMessageFileUpload = (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.file && !message.fileUpload) {
        const jwt = server_1.FileUpload.generateJWTToFileUrls({
            rid: message.rid,
            userId: message.u._id,
            fileId: message.file._id,
        });
        const file = yield models_1.Uploads.findOne({ _id: message.file._id });
        if (!file) {
            return message;
        }
        message.fileUpload = {
            publicFilePath: file.name
                ? (0, getURL_1.getURL)(`${server_1.FileUpload.getPath(`${file._id}/${encodeURI(file.name)}`).substring(1)}${jwt ? `?token=${jwt}` : ''}`, {
                    cdn: false,
                    full: true,
                })
                : '',
            type: file.type,
            size: file.size,
        };
    }
    return message;
});
exports.normalizeMessageFileUpload = normalizeMessageFileUpload;
