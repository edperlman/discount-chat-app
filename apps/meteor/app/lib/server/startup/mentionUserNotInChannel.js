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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const moment_1 = __importDefault(require("moment"));
const callbacks_1 = require("../../../../lib/callbacks");
const getUserDisplayName_1 = require("../../../../lib/getUserDisplayName");
const isTruthy_1 = require("../../../../lib/isTruthy");
const i18n_1 = require("../../../../server/lib/i18n");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../settings/server");
const APP_ID = 'mention-core';
const getBlocks = (mentions, messageId, lng) => {
    const stringifiedMentions = JSON.stringify(mentions);
    return {
        addUsersBlock: {
            type: 'button',
            appId: APP_ID,
            blockId: messageId,
            value: stringifiedMentions,
            actionId: 'add-users',
            text: {
                type: 'plain_text',
                text: i18n_1.i18n.t('Add_them', { lng }),
            },
        },
        dismissBlock: {
            type: 'button',
            appId: APP_ID,
            blockId: messageId,
            value: stringifiedMentions,
            actionId: 'dismiss',
            text: {
                type: 'plain_text',
                text: i18n_1.i18n.t('Do_nothing', { lng }),
            },
        },
        dmBlock: {
            type: 'button',
            appId: APP_ID,
            value: stringifiedMentions,
            blockId: messageId,
            actionId: 'share-message',
            text: {
                type: 'plain_text',
                text: i18n_1.i18n.t('Let_them_know', { lng }),
            },
        },
    };
};
callbacks_1.callbacks.add('afterSaveMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room }) {
    // TODO: check if I need to test this 60 second rule.
    // If the message was edited, or is older than 60 seconds (imported)
    // the notifications will be skipped, so we can also skip this validation
    if ((0, core_typings_1.isEditedMessage)(message) || (message.ts && Math.abs((0, moment_1.default)(message.ts).diff((0, moment_1.default)())) > 60000) || !message.mentions) {
        return message;
    }
    const mentions = message.mentions.filter(({ _id, type }) => _id !== 'all' && _id !== 'here' && type !== 'team');
    if (!mentions.length) {
        return message;
    }
    if ((0, core_typings_1.isDirectMessageRoom)(room) || (0, core_typings_1.isRoomFederated)(room) || (0, core_typings_1.isOmnichannelRoom)(room)) {
        return message;
    }
    const subs = yield models_1.Subscriptions.findByRoomIdAndUserIds(message.rid, mentions.map(({ _id }) => _id), { projection: { u: 1 } }).toArray();
    // get all users that are mentioned but not in the channel
    const mentionsUsersNotInChannel = mentions.filter(({ _id }) => !subs.some((sub) => sub.u._id === _id));
    if (!mentionsUsersNotInChannel.length) {
        return message;
    }
    const canAddUsersToThisRoom = yield (0, hasPermission_1.hasPermissionAsync)(message.u._id, 'add-user-to-joined-room', message.rid);
    const canAddToAnyRoom = yield (room.t === 'c'
        ? (0, hasPermission_1.hasPermissionAsync)(message.u._id, 'add-user-to-any-c-room')
        : (0, hasPermission_1.hasPermissionAsync)(message.u._id, 'add-user-to-any-p-room'));
    const canDMUsers = yield (0, hasPermission_1.hasPermissionAsync)(message.u._id, 'create-d'); // TODO: Perhaps check if user has DM with mentioned user (might be too expensive)
    const canAddUsers = canAddUsersToThisRoom || canAddToAnyRoom;
    const { language } = (yield models_1.Users.findOneById(message.u._id)) || {};
    const actionBlocks = getBlocks(mentionsUsersNotInChannel, message._id, language);
    const elements = [
        canAddUsers && actionBlocks.addUsersBlock,
        (canAddUsers || canDMUsers) && actionBlocks.dismissBlock,
        canDMUsers && actionBlocks.dmBlock,
    ].filter(isTruthy_1.isTruthy);
    const messageLabel = canAddUsers
        ? 'You_mentioned___mentions__but_theyre_not_in_this_room'
        : 'You_mentioned___mentions__but_theyre_not_in_this_room_You_can_ask_a_room_admin_to_add_them';
    const useRealName = server_1.settings.get('UI_Use_Real_Name');
    const usernamesOrNames = mentionsUsersNotInChannel.map(({ username, name }) => `*${(0, getUserDisplayName_1.getUserDisplayName)(name, username, useRealName)}*`);
    const mentionsText = usernamesOrNames.join(', ');
    // TODO: Mentions style
    void core_services_1.api.broadcast('notify.ephemeralMessage', message.u._id, message.rid, {
        msg: '',
        mentions: mentionsUsersNotInChannel,
        tmid: message.tmid,
        blocks: [
            {
                appId: APP_ID,
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: i18n_1.i18n.t(messageLabel, { mentions: mentionsText, lng: language }),
                },
            },
            Boolean(elements.length) &&
                {
                    type: 'actions',
                    appId: APP_ID,
                    elements,
                },
        ].filter(isTruthy_1.isTruthy),
        private: true,
    });
    return message;
}), callbacks_1.callbacks.priority.LOW, 'mention-user-not-in-channel');
