"use strict";
/*
 * Invite is a named function that will replace /invite commands
 * @param {Object} message - The message object
 */
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
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const isTruthy_1 = require("../../../lib/isTruthy");
const i18n_1 = require("../../../server/lib/i18n");
const server_1 = require("../../authorization/server");
const addUsersToRoom_1 = require("../../lib/server/methods/addUsersToRoom");
const createChannel_1 = require("../../lib/server/methods/createChannel");
const createPrivateGroup_1 = require("../../lib/server/methods/createPrivateGroup");
const server_2 = require("../../settings/server");
const slashCommand_1 = require("../../utils/server/slashCommand");
function inviteAll(type) {
    return function inviteAll(_a) {
        return __awaiter(this, arguments, void 0, function* ({ command, params, message, userId }) {
            var _b;
            if (!/invite\-all-(to|from)/.test(command)) {
                return;
            }
            let channel = params.trim();
            if (channel === '') {
                return;
            }
            channel = channel.replace('#', '');
            if (!channel) {
                return;
            }
            if (!userId) {
                return;
            }
            const user = yield models_1.Users.findOneById(userId);
            if (!user) {
                return;
            }
            const lng = (user === null || user === void 0 ? void 0 : user.language) || server_2.settings.get('Language') || 'en';
            const baseChannel = type === 'to' ? yield models_1.Rooms.findOneById(message.rid) : yield models_1.Rooms.findOneByName(channel);
            const targetChannel = type === 'from' ? yield models_1.Rooms.findOneById(message.rid) : yield models_1.Rooms.findOneByName(channel);
            if (!baseChannel) {
                void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                    msg: i18n_1.i18n.t('Channel_doesnt_exist', {
                        postProcess: 'sprintf',
                        sprintf: [channel],
                        lng,
                    }),
                });
                return;
            }
            if (!(yield (0, server_1.canAccessRoomAsync)(baseChannel, user))) {
                void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                    msg: i18n_1.i18n.t('Room_not_exist_or_not_permission', { lng }),
                });
                return;
            }
            try {
                const APIsettings = server_2.settings.get('API_User_Limit');
                if (!APIsettings) {
                    return;
                }
                if ((yield models_1.Subscriptions.countByRoomIdWhenUsernameExists(baseChannel._id)) > APIsettings) {
                    throw new meteor_1.Meteor.Error('error-user-limit-exceeded', 'User Limit Exceeded', {
                        method: 'addAllToRoom',
                    });
                }
                const cursor = models_1.Subscriptions.findByRoomIdWhenUsernameExists(baseChannel._id, {
                    projection: { 'u.username': 1 },
                });
                const users = (yield cursor.toArray()).map((s) => s.u.username).filter(isTruthy_1.isTruthy);
                if (!targetChannel && ['c', 'p'].indexOf(baseChannel.t) > -1) {
                    baseChannel.t === 'c' ? yield (0, createChannel_1.createChannelMethod)(userId, channel, users) : yield (0, createPrivateGroup_1.createPrivateGroupMethod)(user, channel, users);
                    void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                        msg: i18n_1.i18n.t('Channel_created', {
                            postProcess: 'sprintf',
                            sprintf: [channel],
                            lng,
                        }),
                    });
                }
                else {
                    yield (0, addUsersToRoom_1.addUsersToRoomMethod)(userId, {
                        rid: (_b = targetChannel === null || targetChannel === void 0 ? void 0 : targetChannel._id) !== null && _b !== void 0 ? _b : '',
                        users,
                    });
                }
                void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                    msg: i18n_1.i18n.t('Users_added', { lng }),
                });
            }
            catch (e) {
                const msg = e.error === 'cant-invite-for-direct-room' ? 'Cannot_invite_users_to_direct_rooms' : e.error;
                void core_services_1.api.broadcast('notify.ephemeralMessage', userId, message.rid, {
                    msg: i18n_1.i18n.t(msg, { lng }),
                });
            }
        });
    };
}
slashCommand_1.slashCommands.add({
    command: 'invite-all-to',
    callback: inviteAll('to'),
    options: {
        description: 'Invite_user_to_join_channel_all_to',
        params: '#room',
        permission: ['add-user-to-joined-room', 'add-user-to-any-c-room', 'add-user-to-any-p-room'],
    },
});
slashCommand_1.slashCommands.add({
    command: 'invite-all-from',
    callback: inviteAll('from'),
    options: {
        description: 'Invite_user_to_join_channel_all_from',
        params: '#room',
        permission: 'add-user-to-joined-room',
    },
});
module.exports = inviteAll;
