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
exports.addWebdavAccountByToken = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../../settings/server");
const webdavClientAdapter_1 = require("../lib/webdavClientAdapter");
const addWebdavAccountByToken = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!userId) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid User', { method: 'addWebdavAccount' });
    }
    if (!server_1.settings.get('Webdav_Integration_Enabled')) {
        throw new meteor_1.Meteor.Error('error-not-allowed', 'WebDAV Integration Not Allowed', {
            method: 'addWebdavAccount',
        });
    }
    (0, check_1.check)(data, check_1.Match.ObjectIncluding({
        serverURL: String,
        token: check_1.Match.ObjectIncluding({
            access_token: String,
            token_type: String,
            refresh_token: check_1.Match.Optional(String),
        }),
        name: check_1.Match.Maybe(String),
    }));
    try {
        const client = new webdavClientAdapter_1.WebdavClientAdapter(data.serverURL, { token: data.token });
        const accountData = {
            userId,
            serverURL: data.serverURL,
            token: data.token,
            name: (_a = data.name) !== null && _a !== void 0 ? _a : '',
        };
        yield client.stat('/');
        yield models_1.WebdavAccounts.updateOne({
            userId,
            serverURL: data.serverURL,
            name: (_b = data.name) !== null && _b !== void 0 ? _b : '',
        }, {
            $set: accountData,
        }, {
            upsert: true,
        });
        void core_services_1.api.broadcast('notify.webdav', userId, {
            type: 'changed',
            account: accountData,
        });
    }
    catch (error) {
        throw new meteor_1.Meteor.Error('could-not-access-webdav', 'Could not access webdav', {
            method: 'addWebdavAccount',
        });
    }
    return true;
});
exports.addWebdavAccountByToken = addWebdavAccountByToken;
meteor_1.Meteor.methods({
    addWebdavAccount(formData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid User', { method: 'addWebdavAccount' });
            }
            if (!server_1.settings.get('Webdav_Integration_Enabled')) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'WebDAV Integration Not Allowed', {
                    method: 'addWebdavAccount',
                });
            }
            (0, check_1.check)(formData, check_1.Match.ObjectIncluding({
                serverURL: String,
                username: String,
                password: String,
                name: check_1.Match.Maybe(String),
            }));
            const duplicateAccount = yield models_1.WebdavAccounts.findOneByUserIdServerUrlAndUsername({ userId, serverURL: formData.serverURL, username: formData.username }, {});
            if (duplicateAccount !== null) {
                throw new meteor_1.Meteor.Error('duplicated-account', 'Account not found', {
                    method: 'addWebdavAccount',
                });
            }
            try {
                const client = new webdavClientAdapter_1.WebdavClientAdapter(formData.serverURL, {
                    username: formData.username,
                    password: formData.password,
                });
                const accountData = {
                    userId,
                    serverURL: formData.serverURL,
                    username: formData.username,
                    password: formData.password,
                    name: (_a = formData.name) !== null && _a !== void 0 ? _a : '',
                };
                yield client.stat('/');
                yield models_1.WebdavAccounts.insertOne(accountData);
                void core_services_1.api.broadcast('notify.webdav', userId, {
                    type: 'changed',
                    account: accountData,
                });
            }
            catch (error) {
                throw new meteor_1.Meteor.Error('could-not-access-webdav', 'Could not access webdav', {
                    method: 'addWebdavAccount',
                });
            }
            return true;
        });
    },
    addWebdavAccountByToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid User', { method: 'addWebdavAccount' });
            }
            return (0, exports.addWebdavAccountByToken)(userId, data);
        });
    },
});
