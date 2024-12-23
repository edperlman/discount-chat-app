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
exports.ListenersModule = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const logger_1 = require("@rocket.chat/logger");
const message_parser_1 = require("@rocket.chat/message-parser");
const cached_1 = require("../../../app/settings/server/cached");
const isMessageParserDisabled = process.env.DISABLE_MESSAGE_PARSER === 'true';
const STATUS_MAP = {
    [core_typings_1.UserStatus.OFFLINE]: 0,
    [core_typings_1.UserStatus.ONLINE]: 1,
    [core_typings_1.UserStatus.AWAY]: 2,
    [core_typings_1.UserStatus.BUSY]: 3,
    [core_typings_1.UserStatus.DISABLED]: 0,
};
const minimongoChangeMap = {
    inserted: 'added',
    updated: 'changed',
    removed: 'removed',
};
class ListenersModule {
    constructor(service, notifications) {
        const logger = new logger_1.Logger('ListenersModule');
        service.onEvent('license.sync', () => notifications.notifyAllInThisInstance('license'));
        service.onEvent('license.actions', () => notifications.notifyAllInThisInstance('license'));
        service.onEvent('emoji.deleteCustom', (emoji) => {
            notifications.notifyLoggedInThisInstance('deleteEmojiCustom', {
                emojiData: emoji,
            });
        });
        service.onEvent('emoji.updateCustom', (emoji) => {
            notifications.notifyLoggedInThisInstance('updateEmojiCustom', {
                emojiData: emoji,
            });
        });
        service.onEvent('user.forceLogout', (uid) => {
            notifications.notifyUserInThisInstance(uid, 'force_logout');
        });
        service.onEvent('notify.ephemeralMessage', (uid, rid, message) => {
            if (!isMessageParserDisabled && message.msg) {
                const customDomains = cached_1.settings.get('Message_CustomDomain_AutoLink')
                    ? cached_1.settings
                        .get('Message_CustomDomain_AutoLink')
                        .split(',')
                        .map((domain) => domain.trim())
                    : [];
                message.md = (0, message_parser_1.parse)(message.msg, Object.assign({ colors: cached_1.settings.get('HexColorPreview_Enabled'), emoticons: true, customDomains }, (cached_1.settings.get('Katex_Enabled') && {
                    katex: {
                        dollarSyntax: cached_1.settings.get('Katex_Dollar_Syntax'),
                        parenthesisSyntax: cached_1.settings.get('Katex_Parenthesis_Syntax'),
                    },
                })));
            }
            notifications.notifyUserInThisInstance(uid, 'message', Object.assign({ groupable: false, u: {
                    _id: 'rocket.cat',
                    username: 'rocket.cat',
                }, private: true, _id: message._id || String(Date.now()), rid, ts: new Date(), _updatedAt: new Date() }, message));
        });
        service.onEvent('permission.changed', ({ clientAction, data }) => {
            notifications.notifyLoggedInThisInstance('permissions-changed', clientAction, data);
        });
        service.onEvent('room.avatarUpdate', ({ _id: rid, avatarETag: etag }) => {
            notifications.notifyLoggedInThisInstance('updateAvatar', {
                rid,
                etag,
            });
        });
        service.onEvent('user.avatarUpdate', ({ username, avatarETag: etag }) => {
            notifications.notifyLoggedInThisInstance('updateAvatar', {
                username,
                etag,
            });
        });
        service.onEvent('user.deleted', ({ _id: userId }, data) => {
            notifications.notifyLoggedInThisInstance('Users:Deleted', Object.assign({ userId }, data));
        });
        service.onEvent('user.deleteCustomStatus', (userStatus) => {
            notifications.notifyLoggedInThisInstance('deleteCustomUserStatus', {
                userStatusData: userStatus,
            });
        });
        service.onEvent('user.nameChanged', (user) => {
            notifications.notifyLoggedInThisInstance('Users:NameChanged', user);
        });
        service.onEvent('user.roleUpdate', (update) => {
            notifications.notifyLoggedInThisInstance('roles-change', update);
        });
        service.onEvent('user.video-conference', ({ userId, action, params, }) => {
            notifications.notifyUserInThisInstance(userId, 'video-conference', { action, params });
        });
        service.onEvent('room.video-conference', ({ rid, callId }) => {
            /* deprecated */
            notifications.notifyRoom(rid, callId);
            notifications.notifyRoom(rid, 'videoconf', callId);
        });
        service.onEvent('presence.status', ({ user }) => {
            const { _id, username, name, status, statusText, roles } = user;
            if (!status || !username) {
                return;
            }
            notifications.notifyUserInThisInstance(_id, 'userData', {
                type: 'updated',
                id: _id,
                diff: Object.assign({ status }, (statusText && { statusText })),
                unset: {},
            });
            notifications.notifyLoggedInThisInstance('user-status', [_id, username, STATUS_MAP[status], statusText, name, roles]);
            if (_id) {
                notifications.sendPresence(_id, username, STATUS_MAP[status], statusText);
            }
        });
        service.onEvent('user.updateCustomStatus', (userStatus) => {
            notifications.notifyLoggedInThisInstance('updateCustomUserStatus', {
                userStatusData: userStatus,
            });
        });
        service.onEvent('watch.messages', (_a) => __awaiter(this, [_a], void 0, function* ({ message }) {
            if (!message.rid) {
                return;
            }
            notifications.streamRoomMessage._emit('__my_messages__', [message], undefined, false, (streamer, _sub, eventName, args, allowed) => streamer.changedPayload(streamer.subscriptionName, 'id', {
                eventName,
                args: [...args, allowed],
            }));
            notifications.streamRoomMessage.emitWithoutBroadcast(message.rid, message);
        }));
        service.onEvent('notify.messagesRead', ({ rid, until, tmid }) => {
            notifications.notifyRoomInThisInstance(rid, 'messagesRead', { tmid, until });
        });
        service.onEvent('watch.subscriptions', ({ clientAction, subscription }) => {
            var _a;
            if (!((_a = subscription.u) === null || _a === void 0 ? void 0 : _a._id)) {
                return;
            }
            // emit a removed event on msg stream to remove the user's stream-room-messages subscription when the user is removed from room
            if (clientAction === 'removed') {
                notifications.streamRoomMessage.__emit(subscription.u._id, clientAction, subscription);
            }
            notifications.streamUser.__emit(subscription.u._id, clientAction, subscription);
            notifications.notifyUserInThisInstance(subscription.u._id, 'subscriptions-changed', clientAction, subscription);
        });
        service.onEvent('watch.roles', ({ clientAction, role }) => {
            notifications.streamRoles.emitWithoutBroadcast('roles', Object.assign({ type: clientAction }, role));
        });
        service.onEvent('watch.inquiries', (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, inquiry, diff }) {
            const type = minimongoChangeMap[clientAction];
            if (clientAction === 'removed') {
                notifications.streamLivechatQueueData.emitWithoutBroadcast(inquiry._id, {
                    _id: inquiry._id,
                    clientAction,
                });
                if (inquiry.department) {
                    return notifications.streamLivechatQueueData.emitWithoutBroadcast(`department/${inquiry.department}`, Object.assign({ type }, inquiry));
                }
                return notifications.streamLivechatQueueData.emitWithoutBroadcast('public', Object.assign({ type }, inquiry));
            }
            // Don't do notifications for updating inquiries when the only thing changing is the queue metadata
            if (clientAction === 'updated' &&
                (diff === null || diff === void 0 ? void 0 : diff.hasOwnProperty('lockedAt')) &&
                (diff === null || diff === void 0 ? void 0 : diff.hasOwnProperty('locked')) &&
                (diff === null || diff === void 0 ? void 0 : diff.hasOwnProperty('_updatedAt')) &&
                Object.keys(diff).length === 3) {
                return;
            }
            notifications.streamLivechatQueueData.emitWithoutBroadcast(inquiry._id, Object.assign(Object.assign({}, inquiry), { clientAction }));
            if (!inquiry.department) {
                return notifications.streamLivechatQueueData.emitWithoutBroadcast('public', Object.assign({ type }, inquiry));
            }
            notifications.streamLivechatQueueData.emitWithoutBroadcast(`department/${inquiry.department}`, Object.assign({ type }, inquiry));
            if (clientAction === 'updated' && !(diff === null || diff === void 0 ? void 0 : diff.department)) {
                notifications.streamLivechatQueueData.emitWithoutBroadcast('public', Object.assign({ type }, inquiry));
            }
        }));
        service.onEvent('watch.settings', (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, setting }) {
            // if a EE setting changed make sure we broadcast the correct value according to license
            if (clientAction !== 'removed' && (0, core_typings_1.isSettingEnterprise)(setting)) {
                try {
                    const result = yield core_services_1.EnterpriseSettings.changeSettingValue(setting);
                    if (result !== undefined && !(result instanceof Error)) {
                        setting.value = result;
                    }
                }
                catch (err) {
                    logger.error({ msg: 'Error getting proper enterprise setting value. Returning `invalidValue` instead.', err });
                    setting.value = setting.invalidValue;
                }
            }
            if (setting.hidden) {
                return;
            }
            const value = Object.assign(Object.assign({ _id: setting._id, value: setting.value }, ((0, core_typings_1.isSettingColor)(setting) && { editor: setting.editor })), { properties: setting.properties, enterprise: setting.enterprise, requiredOnWizard: setting.requiredOnWizard });
            if (setting.public === true) {
                notifications.notifyAllInThisInstance('public-settings-changed', clientAction, value);
                notifications.notifyAllInThisInstance('public-info', ['public-settings-changed', [clientAction, value]]);
            }
            notifications.notifyLoggedInThisInstance('private-settings-changed', clientAction, value);
        }));
        service.onEvent('watch.rooms', ({ clientAction, room }) => {
            // this emit will cause the user to receive a 'rooms-changed' event
            notifications.streamUser.__emit(room._id, clientAction, room);
            notifications.streamRoomData.emitWithoutBroadcast(room._id, room);
        });
        service.onEvent('watch.users', (event) => {
            switch (event.clientAction) {
                case 'updated':
                    notifications.notifyUserInThisInstance(event.id, 'userData', {
                        id: event.id,
                        diff: event.diff,
                        unset: event.unset,
                        type: 'updated',
                    });
                    break;
                case 'inserted':
                    notifications.notifyUserInThisInstance(event.id, 'userData', { id: event.id, data: event.data, type: 'inserted' });
                    break;
                case 'removed':
                    notifications.notifyUserInThisInstance(event.id, 'userData', { id: event.id, type: 'removed' });
                    break;
            }
        });
        service.onEvent('watch.integrationHistory', ({ clientAction, data, diff, id }) => {
            var _a;
            if (!((_a = data === null || data === void 0 ? void 0 : data.integration) === null || _a === void 0 ? void 0 : _a._id)) {
                return;
            }
            switch (clientAction) {
                case 'updated': {
                    notifications.streamIntegrationHistory.emitWithoutBroadcast(data.integration._id, {
                        id,
                        diff,
                        type: clientAction,
                    });
                    break;
                }
                case 'inserted': {
                    notifications.streamIntegrationHistory.emitWithoutBroadcast(data.integration._id, {
                        data,
                        type: clientAction,
                    });
                    break;
                }
            }
        });
        service.onEvent('watch.livechatDepartmentAgents', ({ clientAction, data }) => {
            const { agentId } = data;
            if (!agentId) {
                return;
            }
            notifications.notifyUserInThisInstance(agentId, 'departmentAgentData', Object.assign({ action: clientAction }, data));
        });
        service.onEvent('banner.user', (userId, banner) => {
            notifications.notifyUserInThisInstance(userId, 'banners', banner);
        });
        service.onEvent('banner.new', (bannerId) => {
            notifications.notifyLoggedInThisInstance('new-banner', { bannerId }); // deprecated
            notifications.notifyLoggedInThisInstance('banner-changed', { bannerId });
        });
        service.onEvent('banner.disabled', (bannerId) => {
            notifications.notifyLoggedInThisInstance('banner-changed', { bannerId });
        });
        service.onEvent('banner.enabled', (bannerId) => {
            notifications.notifyLoggedInThisInstance('banner-changed', { bannerId });
        });
        service.onEvent('voip.events', (userId, data) => {
            notifications.notifyUserInThisInstance(userId, 'voip.events', data);
        });
        service.onEvent('call.callerhangup', (userId, data) => {
            notifications.notifyUserInThisInstance(userId, 'call.hangup', data);
        });
        service.onEvent('notify.desktop', (uid, notification) => {
            notifications.notifyUserInThisInstance(uid, 'notification', notification);
        });
        service.onEvent('notify.uiInteraction', (uid, interaction) => {
            notifications.notifyUserInThisInstance(uid, 'uiInteraction', interaction);
        });
        service.onEvent('notify.updateInvites', (uid, data) => {
            notifications.notifyUserInThisInstance(uid, 'updateInvites', data);
        });
        service.onEvent('notify.webdav', (uid, data) => {
            notifications.notifyUserInThisInstance(uid, 'webdav', data);
        });
        service.onEvent('notify.e2e.keyRequest', (rid, data) => {
            notifications.notifyRoomInThisInstance(rid, 'e2e.keyRequest', data);
        });
        service.onEvent('notify.deleteMessage', (rid, data) => {
            notifications.notifyRoomInThisInstance(rid, 'deleteMessage', data);
        });
        service.onEvent('notify.deleteMessageBulk', (rid, data) => {
            notifications.notifyRoomInThisInstance(rid, 'deleteMessageBulk', data);
        });
        service.onEvent('notify.deleteCustomSound', (data) => {
            notifications.notifyAllInThisInstance('deleteCustomSound', data);
            notifications.notifyAllInThisInstance('public-info', ['deleteCustomSound', [data]]);
        });
        service.onEvent('notify.updateCustomSound', (data) => {
            notifications.notifyAllInThisInstance('updateCustomSound', data);
            notifications.notifyAllInThisInstance('public-info', ['updateCustomSound', [data]]);
        });
        service.onEvent('notify.calendar', (uid, data) => {
            notifications.notifyUserInThisInstance(uid, 'calendar', data);
        });
        service.onEvent('notify.importedMessages', ({ roomIds }) => {
            roomIds.forEach((rid) => {
                // couldnt get TS happy by providing no data, so had to provide null
                notifications.notifyRoomInThisInstance(rid, 'messagesImported', null);
            });
        });
        service.onEvent('connector.statuschanged', (enabled) => {
            notifications.notifyLoggedInThisInstance('voip.statuschanged', enabled);
        });
        service.onEvent('omnichannel.room', (roomId, data) => {
            notifications.streamLivechatRoom.emitWithoutBroadcast(roomId, data);
        });
        service.onEvent('watch.priorities', (_a) => __awaiter(this, [_a], void 0, function* ({ clientAction, diff, id }) {
            notifications.notifyLoggedInThisInstance('omnichannel.priority-changed', { id, clientAction, name: diff === null || diff === void 0 ? void 0 : diff.name });
        }));
        service.onEvent('apps.added', (appId) => {
            notifications.streamApps.emitWithoutBroadcast('app/added', appId);
            notifications.streamApps.emitWithoutBroadcast('apps', ['app/added', [appId]]);
        });
        service.onEvent('apps.removed', (appId) => {
            notifications.streamApps.emitWithoutBroadcast('app/removed', appId);
            notifications.streamApps.emitWithoutBroadcast('apps', ['app/removed', [appId]]);
        });
        service.onEvent('apps.updated', (appId) => {
            notifications.streamApps.emitWithoutBroadcast('app/updated', appId);
            notifications.streamApps.emitWithoutBroadcast('apps', ['app/updated', [appId]]);
        });
        service.onEvent('apps.statusUpdate', (appId, status) => {
            notifications.streamApps.emitWithoutBroadcast('app/statusUpdate', { appId, status });
            notifications.streamApps.emitWithoutBroadcast('apps', ['app/statusUpdate', [{ appId, status }]]);
        });
        service.onEvent('apps.settingUpdated', (appId, setting) => {
            notifications.streamApps.emitWithoutBroadcast('app/settingUpdated', { appId, setting });
            notifications.streamApps.emitWithoutBroadcast('apps', ['app/settingUpdated', [{ appId, setting }]]);
        });
        service.onEvent('command.added', (command) => {
            notifications.streamApps.emitWithoutBroadcast('command/added', command);
            notifications.streamApps.emitWithoutBroadcast('apps', ['command/added', [command]]);
        });
        service.onEvent('command.disabled', (command) => {
            notifications.streamApps.emitWithoutBroadcast('command/disabled', command);
            notifications.streamApps.emitWithoutBroadcast('apps', ['command/disabled', [command]]);
        });
        service.onEvent('command.updated', (command) => {
            notifications.streamApps.emitWithoutBroadcast('command/updated', command);
            notifications.streamApps.emitWithoutBroadcast('apps', ['command/updated', [command]]);
        });
        service.onEvent('command.removed', (command) => {
            notifications.streamApps.emitWithoutBroadcast('command/removed', command);
            notifications.streamApps.emitWithoutBroadcast('apps', ['command/removed', [command]]);
        });
        service.onEvent('actions.changed', () => {
            notifications.streamApps.emitWithoutBroadcast('actions/changed');
            notifications.streamApps.emitWithoutBroadcast('apps', ['actions/changed', []]);
        });
        service.onEvent('otrMessage', ({ roomId, message, user, room }) => {
            notifications.streamRoomMessage.emit(roomId, message, user, room);
        });
        service.onEvent('otrAckUpdate', ({ roomId, acknowledgeMessage }) => {
            notifications.streamRoomMessage.emit(roomId, acknowledgeMessage);
        });
    }
}
exports.ListenersModule = ListenersModule;
