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
exports.uploadFileToWebdav = void 0;
const models_1 = require("@rocket.chat/models");
const getWebdavCredentials_1 = require("./getWebdavCredentials");
const webdavClientAdapter_1 = require("./webdavClientAdapter");
const uploadFileToWebdav = (accountId, fileData, name) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield models_1.WebdavAccounts.findOneById(accountId);
    if (!account) {
        throw new Error('error-invalid-account');
    }
    const uploadFolder = 'Rocket.Chat Uploads/';
    const buffer = Buffer.from(fileData);
    const cred = (0, getWebdavCredentials_1.getWebdavCredentials)(account);
    const client = new webdavClientAdapter_1.WebdavClientAdapter(account.serverURL, cred);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    yield client.createDirectory(uploadFolder).catch(() => { });
    yield client.putFileContents(`${uploadFolder}/${name}`, buffer, { overwrite: false });
});
exports.uploadFileToWebdav = uploadFileToWebdav;
