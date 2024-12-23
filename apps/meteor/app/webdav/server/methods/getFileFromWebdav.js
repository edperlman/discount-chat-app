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
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../../settings/server");
const getWebdavCredentials_1 = require("../lib/getWebdavCredentials");
const webdavClientAdapter_1 = require("../lib/webdavClientAdapter");
meteor_1.Meteor.methods({
    getFileFromWebdav(accountId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid User', { method: 'getFileFromWebdav' });
            }
            if (!server_1.settings.get('Webdav_Integration_Enabled')) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'WebDAV Integration Not Allowed', {
                    method: 'getFileFromWebdav',
                });
            }
            const account = yield models_1.WebdavAccounts.findOneByIdAndUserId(accountId, userId, {});
            if (!account) {
                throw new meteor_1.Meteor.Error('error-invalid-account', 'Invalid WebDAV Account', {
                    method: 'getFileFromWebdav',
                });
            }
            try {
                const cred = (0, getWebdavCredentials_1.getWebdavCredentials)(account);
                const client = new webdavClientAdapter_1.WebdavClientAdapter(account.serverURL, cred);
                const fileContent = yield client.getFileContents(file.filename);
                const data = new Uint8Array(fileContent);
                return { success: true, data };
            }
            catch (error) {
                throw new meteor_1.Meteor.Error('unable-to-get-file', 'Unable to get file', {
                    method: 'getFileFromWebdav',
                });
            }
        });
    },
});
