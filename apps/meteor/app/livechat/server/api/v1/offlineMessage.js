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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const i18n_1 = require("../../../../../server/lib/i18n");
const server_1 = require("../../../../api/server");
const messages_1 = require("../../lib/messages");
server_1.API.v1.addRoute('livechat/offline.message', {
    validateParams: rest_typings_1.isPOSTLivechatOfflineMessageParams,
    rateLimiterOptions: { numRequestsAllowed: 1, intervalTimeInMS: 5000 },
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, message, department, host } = this.bodyParams;
            try {
                yield (0, messages_1.sendOfflineMessage)({ name, email, message, department, host });
                return server_1.API.v1.success({ message: i18n_1.i18n.t('Livechat_offline_message_sent') });
            }
            catch (e) {
                return server_1.API.v1.failure(i18n_1.i18n.t('Error_sending_livechat_offline_message'));
            }
        });
    },
});
