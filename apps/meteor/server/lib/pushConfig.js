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
exports.executePushTest = void 0;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const i18n_1 = require("./i18n");
const hasPermission_1 = require("../../app/authorization/server/functions/hasPermission");
const server_1 = require("../../app/cloud/server");
const lib_1 = require("../../app/lib/server/lib");
const server_2 = require("../../app/push/server");
const server_3 = require("../../app/settings/server");
const executePushTest = (userId, username) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = yield models_1.AppsTokens.countTokensByUserId(userId);
    if (tokens === 0) {
        throw new meteor_1.Meteor.Error('error-no-tokens-for-this-user', 'There are no tokens for this user', {
            method: 'push_test',
        });
    }
    yield server_2.Push.send({
        from: 'push',
        title: `@${username}`,
        text: i18n_1.i18n.t('This_is_a_push_test_messsage'),
        sound: 'default',
        userId,
    });
    return tokens;
});
exports.executePushTest = executePushTest;
meteor_1.Meteor.methods({
    push_test() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield meteor_1.Meteor.userAsync();
            if (!user) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'push_test',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'test-push-notifications'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'push_test',
                });
            }
            if (server_3.settings.get('Push_enable') !== true) {
                throw new meteor_1.Meteor.Error('error-push-disabled', 'Push is disabled', {
                    method: 'push_test',
                });
            }
            const tokensCount = yield (0, exports.executePushTest)(user._id, user.username);
            return {
                message: 'Your_push_was_sent_to_s_devices',
                params: [tokensCount],
            };
        });
    },
});
lib_1.RateLimiter.limitMethod('push_test', 1, 1000, {
    userId: () => true,
});
server_3.settings.watch('Push_enable', (enabled) => __awaiter(void 0, void 0, void 0, function* () {
    if (!enabled) {
        return;
    }
    const gateways = server_3.settings.get('Push_enable_gateway') && server_3.settings.get('Register_Server') && server_3.settings.get('Cloud_Service_Agree_PrivacyTerms')
        ? server_3.settings.get('Push_gateway').split('\n')
        : undefined;
    let apn;
    let gcm;
    if (!gateways) {
        gcm = {
            apiKey: server_3.settings.get('Push_gcm_api_key'),
            projectNumber: server_3.settings.get('Push_gcm_project_number'),
        };
        apn = {
            passphrase: server_3.settings.get('Push_apn_passphrase'),
            key: server_3.settings.get('Push_apn_key'),
            cert: server_3.settings.get('Push_apn_cert'),
        };
        if (server_3.settings.get('Push_production') !== true) {
            apn = {
                passphrase: server_3.settings.get('Push_apn_dev_passphrase'),
                key: server_3.settings.get('Push_apn_dev_key'),
                cert: server_3.settings.get('Push_apn_dev_cert'),
                gateway: 'gateway.sandbox.push.apple.com',
            };
        }
        if (!apn.key || apn.key.trim() === '' || !apn.cert || apn.cert.trim() === '') {
            apn = undefined;
        }
        if (!gcm.apiKey || gcm.apiKey.trim() === '' || !gcm.projectNumber || gcm.projectNumber.trim() === '') {
            gcm = undefined;
        }
    }
    server_2.Push.configure({
        apn,
        gcm,
        production: server_3.settings.get('Push_production'),
        gateways,
        uniqueId: server_3.settings.get('uniqueID'),
        getAuthorization() {
            return __awaiter(this, void 0, void 0, function* () {
                return `Bearer ${yield (0, server_1.getWorkspaceAccessToken)()}`;
            });
        },
    });
}));
