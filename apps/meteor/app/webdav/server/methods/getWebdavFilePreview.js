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
const webdav_1 = require("webdav");
const server_1 = require("../../../settings/server");
const getWebdavCredentials_1 = require("../lib/getWebdavCredentials");
meteor_1.Meteor.methods({
    getWebdavFilePreview(accountId, path) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid User', {
                    method: 'getWebdavFilePreview',
                });
            }
            if (!server_1.settings.get('Webdav_Integration_Enabled') || !server_1.settings.get('Accounts_OAuth_Nextcloud_URL')) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'WebDAV Integration Not Allowed', {
                    method: 'getWebdavFilePreview',
                });
            }
            const account = yield models_1.WebdavAccounts.findOneByIdAndUserId(accountId, userId, {});
            if (!account) {
                throw new meteor_1.Meteor.Error('error-invalid-account', 'Invalid WebDAV Account', {
                    method: 'getWebdavFilePreview',
                });
            }
            try {
                const cred = (0, getWebdavCredentials_1.getWebdavCredentials)(account);
                const client = (0, webdav_1.createClient)(account.serverURL, cred);
                const serverURL = server_1.settings.get('Accounts_OAuth_Nextcloud_URL');
                const res = yield client.customRequest(`${serverURL}/index.php/core/preview.png?file=${path}&x=64&y=64`, {
                    method: 'GET',
                    responseType: 'arraybuffer',
                });
                return { success: true, data: res.data };
            }
            catch (error) {
                // ignore error
            }
        });
    },
});
