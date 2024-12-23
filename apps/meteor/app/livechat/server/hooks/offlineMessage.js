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
const callbacks_1 = require("../../../../lib/callbacks");
const server_1 = require("../../../settings/server");
const LivechatTyped_1 = require("../lib/LivechatTyped");
callbacks_1.callbacks.add('livechat.offlineMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!server_1.settings.get('Livechat_webhook_on_offline_msg')) {
        return data;
    }
    const postData = {
        type: 'LivechatOfflineMessage',
        sentAt: new Date(),
        visitor: {
            name: data.name,
            email: data.email,
        },
        message: data.message,
    };
    yield LivechatTyped_1.Livechat.sendRequest(postData);
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-send-email-offline-message');
