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
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../lib/callbacks");
const i18n_1 = require("../../../../server/lib/i18n");
const sendMessage_1 = require("../../../lib/server/functions/sendMessage");
const server_1 = require("../../../settings/server");
callbacks_1.callbacks.add('livechat.offlineMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!server_1.settings.get('Livechat_OfflineMessageToChannel_enabled')) {
        return data;
    }
    let channelName = server_1.settings.get('Livechat_OfflineMessageToChannel_channel_name');
    let departmentName;
    const { name, email, department, message: text, host } = data;
    if (department && department !== '') {
        const dept = yield models_1.LivechatDepartment.findOneById(department, {
            projection: { name: 1, offlineMessageChannelName: 1 },
        });
        departmentName = dept === null || dept === void 0 ? void 0 : dept.name;
        if (dept === null || dept === void 0 ? void 0 : dept.offlineMessageChannelName) {
            channelName = dept.offlineMessageChannelName;
        }
    }
    if (!channelName || channelName === '') {
        return data;
    }
    const room = yield models_1.Rooms.findOneByName(channelName, { projection: { t: 1, archived: 1 } });
    if (!room || room.archived || ((0, core_typings_1.isOmnichannelRoom)(room) && room.closedAt)) {
        return data;
    }
    const user = yield models_1.Users.findOneById('rocket.cat', { projection: { username: 1 } });
    if (!user) {
        return data;
    }
    const lng = server_1.settings.get('Language') || 'en';
    let msg = `${i18n_1.i18n.t('New_Livechat_offline_message_has_been_sent', { lng })}: \n`;
    if (host && host !== '') {
        msg = msg.concat(`${i18n_1.i18n.t('Sent_from', { lng })}: ${host} \n`);
    }
    msg = msg.concat(`${i18n_1.i18n.t('Visitor_Name', { lng })}: ${name} \n`);
    msg = msg.concat(`${i18n_1.i18n.t('Visitor_Email', { lng })}: ${email} \n`);
    if (departmentName) {
        msg = msg.concat(`${i18n_1.i18n.t('Department', { lng })}: ${departmentName} \n`);
    }
    msg = msg.concat(`${i18n_1.i18n.t('Message', { lng })}: ${text} \n`);
    const message = {
        rid: room._id,
        msg,
        groupable: false,
    };
    yield (0, sendMessage_1.sendMessage)(user, message, room, true);
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-send-email-offline-message-to-channel');
