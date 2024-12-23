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
exports.savePageHistory = savePageHistory;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const logger_1 = require("./logger");
const server_1 = require("../../../settings/server");
function savePageHistory(token, roomId, pageInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.livechatLogger.debug({
            msg: `Saving page movement history for visitor with token ${token}`,
            pageInfo,
            roomId,
        });
        if (pageInfo.change !== server_1.settings.get('Livechat_history_monitor_type')) {
            return;
        }
        const user = yield models_1.Users.findOneById('rocket.cat');
        if (!user) {
            throw new Error('error-invalid-user');
        }
        const pageTitle = pageInfo.title;
        const pageUrl = pageInfo.location.href;
        const extraData = {
            navigation: {
                page: pageInfo,
                token,
            },
        };
        if (!roomId) {
            logger_1.livechatLogger.warn(`Saving page history without room id for visitor with token ${token}`);
            // keep history of unregistered visitors for 1 month
            const keepHistoryMiliseconds = 2592000000;
            extraData.expireAt = new Date().getTime() + keepHistoryMiliseconds;
        }
        if (!server_1.settings.get('Livechat_Visitor_navigation_as_a_message')) {
            extraData._hidden = true;
        }
        // @ts-expect-error: Investigating on which case we won't receive a roomId and where that history is supposed to be stored
        return core_services_1.Message.saveSystemMessage('livechat_navigation_history', roomId, `${pageTitle} - ${pageUrl}`, user, extraData);
    });
}
