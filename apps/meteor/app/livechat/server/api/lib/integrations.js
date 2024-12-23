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
exports.findIntegrationSettings = findIntegrationSettings;
const models_1 = require("@rocket.chat/models");
function findIntegrationSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        const settings = yield models_1.Settings.findByIds([
            'Livechat_webhookUrl',
            'Livechat_secret_token',
            'Livechat_http_timeout',
            'Livechat_webhook_on_start',
            'Livechat_webhook_on_close',
            'Livechat_webhook_on_chat_taken',
            'Livechat_webhook_on_chat_queued',
            'Livechat_webhook_on_forward',
            'Livechat_webhook_on_offline_msg',
            'Livechat_webhook_on_visitor_message',
            'Livechat_webhook_on_agent_message',
        ]).toArray();
        return { settings };
    });
}
