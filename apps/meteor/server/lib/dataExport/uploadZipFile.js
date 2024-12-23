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
exports.uploadZipFile = void 0;
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const server_1 = require("../../../app/file-upload/server");
const uploadZipFile = (filePath, userId, exportType) => __awaiter(void 0, void 0, void 0, function* () {
    const contentType = 'application/zip';
    const { size } = yield (0, promises_1.stat)(filePath);
    const user = yield models_1.Users.findOneById(userId);
    let userDisplayName = userId;
    if (user) {
        userDisplayName = user.name || user.username || userId;
    }
    const utcDate = new Date().toISOString().split('T')[0];
    const fileSuffix = exportType === 'json' ? '-data' : '';
    const fileId = random_1.Random.id();
    const newFileName = encodeURIComponent(`${utcDate}-${userDisplayName}${fileSuffix}-${fileId}.zip`);
    const details = {
        _id: fileId,
        userId,
        type: contentType,
        size,
        name: newFileName,
    };
    const stream = (0, fs_1.createReadStream)(filePath);
    const userDataStore = server_1.FileUpload.getStore('UserDataFiles');
    const file = yield userDataStore.insert(details, stream);
    return file;
});
exports.uploadZipFile = uploadZipFile;
