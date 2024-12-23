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
exports.notifyDesktopUser = notifyDesktopUser;
exports.shouldNotifyDesktop = shouldNotifyDesktop;
const core_services_1 = require("@rocket.chat/core-services");
const roomCoordinator_1 = require("../../../../../server/lib/rooms/roomCoordinator");
const server_1 = require("../../../../metrics/server");
const server_2 = require("../../../../settings/server");
/**
 * Send notification to user
 *
 * @param {string} userId The user to notify
 * @param {object} user The sender
 * @param {object} room The room send from
 * @param {object} message The message object
 * @param {number} duration Duration of notification
 * @param {string} notificationMessage The message text to send on notification body
 */
function notifyDesktopUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, user, message, room, duration, notificationMessage, }) {
        const { title, text, name } = yield roomCoordinator_1.roomCoordinator
            .getRoomDirectives(room.t)
            .getNotificationDetails(room, user, notificationMessage, userId);
        const payload = {
            title: title || '',
            text,
            duration,
            payload: Object.assign(Object.assign({ _id: '', rid: '', tmid: '' }, ('_id' in message && {
                // TODO: omnichannel is not sending _id, rid, tmid
                _id: message._id,
                rid: message.rid,
                tmid: message.tmid,
            })), { sender: message.u, type: room.t, message: Object.assign({ msg: 'msg' in message ? message.msg : '' }, ('t' in message && {
                    t: message.t,
                })), name }),
        };
        server_1.metrics.notificationsSent.inc({ notification_type: 'desktop' });
        void core_services_1.api.broadcast('notify.desktop', userId, payload);
    });
}
function shouldNotifyDesktop({ disableAllMessageNotifications, status, statusConnection, desktopNotifications, hasMentionToAll, hasMentionToHere, isHighlighted, hasMentionToUser, hasReplyToThread, roomType, isThread, }) {
    if (disableAllMessageNotifications && !desktopNotifications && !isHighlighted && !hasMentionToUser && !hasReplyToThread) {
        return false;
    }
    if (statusConnection === 'offline' || status === 'busy' || desktopNotifications === 'nothing') {
        return false;
    }
    if (!desktopNotifications) {
        if (server_2.settings.get('Accounts_Default_User_Preferences_desktopNotifications') === 'all' && (!isThread || hasReplyToThread)) {
            return true;
        }
        if (server_2.settings.get('Accounts_Default_User_Preferences_desktopNotifications') === 'nothing') {
            return false;
        }
    }
    return ((roomType === 'd' ||
        (!disableAllMessageNotifications && (hasMentionToAll || hasMentionToHere)) ||
        isHighlighted ||
        desktopNotifications === 'all' ||
        hasMentionToUser) &&
        (isHighlighted || !isThread || hasReplyToThread));
}
