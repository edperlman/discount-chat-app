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
exports.copyFileUpload = void 0;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../app/file-upload/server");
const fileUtils_1 = require("../fileUtils");
const copyFileUpload = (attachmentData, assetsPath) => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield models_1.Uploads.findOneById(attachmentData._id);
    if (!file) {
        return;
    }
    yield server_1.FileUpload.copy(file, (0, fileUtils_1.joinPath)(assetsPath, `${attachmentData._id}-${attachmentData.name}`));
});
exports.copyFileUpload = copyFileUpload;
