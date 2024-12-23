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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const stringUtils_1 = require("../../../../../lib/utils/stringUtils");
const auditedSettingUpdates_1 = require("../../../../../server/settings/lib/auditedSettingUpdates");
const server_1 = require("../../../../api/server");
const notifyListener_1 = require("../../../../lib/server/lib/notifyListener");
server_1.API.v1.addRoute('omnichannel/integrations', { authRequired: true, permissionsRequired: ['view-livechat-manager'], validateParams: { POST: rest_typings_1.isPOSTomnichannelIntegrations } }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { LivechatWebhookUrl, LivechatSecretToken, LivechatHttpTimeout, LivechatWebhookOnStart, LivechatWebhookOnClose, LivechatWebhookOnChatTaken, LivechatWebhookOnChatQueued, LivechatWebhookOnForward, LivechatWebhookOnOfflineMsg, LivechatWebhookOnVisitorMessage, LivechatWebhookOnAgentMessage, } = this.bodyParams;
            const settingsIds = [
                typeof LivechatWebhookUrl !== 'undefined' && { _id: 'Livechat_webhookUrl', value: (0, stringUtils_1.trim)(LivechatWebhookUrl) },
                typeof LivechatSecretToken !== 'undefined' && { _id: 'Livechat_secret_token', value: (0, stringUtils_1.trim)(LivechatSecretToken) },
                typeof LivechatHttpTimeout !== 'undefined' && { _id: 'Livechat_http_timeout', value: LivechatHttpTimeout },
                typeof LivechatWebhookOnStart !== 'undefined' && { _id: 'Livechat_webhook_on_start', value: !!LivechatWebhookOnStart },
                typeof LivechatWebhookOnClose !== 'undefined' && { _id: 'Livechat_webhook_on_close', value: !!LivechatWebhookOnClose },
                typeof LivechatWebhookOnChatTaken !== 'undefined' && { _id: 'Livechat_webhook_on_chat_taken', value: !!LivechatWebhookOnChatTaken },
                typeof LivechatWebhookOnChatQueued !== 'undefined' && {
                    _id: 'Livechat_webhook_on_chat_queued',
                    value: !!LivechatWebhookOnChatQueued,
                },
                typeof LivechatWebhookOnForward !== 'undefined' && { _id: 'Livechat_webhook_on_forward', value: !!LivechatWebhookOnForward },
                typeof LivechatWebhookOnOfflineMsg !== 'undefined' && {
                    _id: 'Livechat_webhook_on_offline_msg',
                    value: !!LivechatWebhookOnOfflineMsg,
                },
                typeof LivechatWebhookOnVisitorMessage !== 'undefined' && {
                    _id: 'Livechat_webhook_on_visitor_message',
                    value: !!LivechatWebhookOnVisitorMessage,
                },
                typeof LivechatWebhookOnAgentMessage !== 'undefined' && {
                    _id: 'Livechat_webhook_on_agent_message',
                    value: !!LivechatWebhookOnAgentMessage,
                },
            ].filter(Boolean);
            const auditSettingOperation = (0, auditedSettingUpdates_1.updateAuditedByUser)({
                _id: this.userId,
                username: this.user.username,
                ip: this.requestIp,
                useragent: this.request.headers['user-agent'] || '',
            });
            const promises = settingsIds.map((setting) => auditSettingOperation(models_1.Settings.updateValueById, setting._id, setting.value));
            (yield Promise.all(promises)).forEach((value, index) => {
                if (value === null || value === void 0 ? void 0 : value.modifiedCount) {
                    void (0, notifyListener_1.notifyOnSettingChangedById)(settingsIds[index]._id);
                }
            });
            return server_1.API.v1.success();
        });
    },
});
