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
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../lib/callbacks");
const system_1 = require("../../../server/lib/logger/system");
const server_1 = require("../../settings/server");
const addWebdavAccount_1 = require("../../webdav/server/methods/addWebdavAccount");
meteor_1.Meteor.startup(() => {
    server_1.settings.watch('Webdav_Integration_Enabled', (value) => {
        if (value) {
            return callbacks_1.callbacks.add('afterValidateLogin', (login) => __awaiter(void 0, void 0, void 0, function* () {
                const { user } = login;
                const { services } = user;
                if (!(services === null || services === void 0 ? void 0 : services.nextcloud)) {
                    return;
                }
                const token = {
                    token_type: 'Bearer',
                    access_token: services.nextcloud.accessToken,
                    refresh_token: services.nextcloud.refreshToken,
                };
                const data = {
                    name: 'Nextcloud',
                    serverURL: `${services.nextcloud.serverURL}/remote.php/webdav/`,
                    token,
                };
                try {
                    yield (0, addWebdavAccount_1.addWebdavAccountByToken)(user._id, data);
                }
                catch (error) {
                    system_1.SystemLogger.error(error);
                }
            }), callbacks_1.callbacks.priority.MEDIUM, 'add-webdav-server');
        }
        callbacks_1.callbacks.remove('afterValidateLogin', 'add-webdav-server');
    });
});
