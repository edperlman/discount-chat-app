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
exports.processDirectEmail = void 0;
const models_1 = require("@rocket.chat/models");
const moment_1 = __importDefault(require("moment"));
const server_1 = require("../../../authorization/server");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const server_2 = require("../../../metrics/server");
const server_3 = require("../../../settings/server");
const sendMessage_1 = require("../functions/sendMessage");
const isParsedEmail = (email) => 'date' in email && 'html' in email;
const processDirectEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isParsedEmail(email)) {
            return;
        }
        const to = Array.isArray(email.to) ? email.to.find((email) => email.text) : email.to;
        const mid = to === null || to === void 0 ? void 0 : to.text.split('@')[0].split('+')[1];
        if (!mid) {
            return;
        }
        const ts = new Date(email.date);
        const tsDiff = Math.abs((0, moment_1.default)(ts).diff(new Date()));
        let msg = email.text.split('\n\n').join('\n');
        if (msg && msg.length > server_3.settings.get('Message_MaxAllowedSize')) {
            return;
        }
        const emailAdress = email.from.value[0].address;
        if (!emailAdress) {
            return;
        }
        const user = yield models_1.Users.findOneByEmailAddress(emailAdress, {
            projection: {
                username: 1,
                name: 1,
            },
        });
        if (!(user === null || user === void 0 ? void 0 : user.username)) {
            // user not found
            return;
        }
        const prevMessage = yield models_1.Messages.findOneById(mid, {
            rid: 1,
            u: 1,
        });
        if (!prevMessage) {
            // message doesn't exist anymore
            return;
        }
        const roomInfo = yield models_1.Rooms.findOneById(prevMessage.rid);
        if (!roomInfo) {
            // room doesn't exist anymore
            return;
        }
        const room = yield (0, server_1.canAccessRoomAsync)(roomInfo, user);
        if (!room) {
            return;
        }
        // check mention
        if (msg.indexOf(`@${prevMessage.u.username}`) === -1 && roomInfo.t !== 'd') {
            msg = `@${prevMessage.u.username} ${msg}`;
        }
        // reply message link WE HA THREADS KNOW DONT NEED TO QUOTE THE previous message
        // let prevMessageLink = `[ ](${ Meteor.absoluteUrl().replace(/\/$/, '') }`;
        // if (roomInfo.t === 'c') {
        // 	prevMessageLink += `/channel/${ roomInfo.name }?msg=${ mid }) `;
        // } else if (roomInfo.t === 'd') {
        // 	prevMessageLink += `/direct/${ prevMessage.u.username }?msg=${ mid }) `;
        // } else if (roomInfo.t === 'p') {
        // 	prevMessageLink += `/group/${ roomInfo.name }?msg=${ mid }) `;
        // }
        // // add reply message link
        // msg = prevMessageLink + msg;
        const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(prevMessage.rid, user._id);
        if (subscription && (subscription.blocked || subscription.blocker)) {
            // room is blocked
            return;
        }
        if ((roomInfo.muted || []).includes(user.username || '')) {
            // user is muted
            return;
        }
        // room is readonly
        if (roomInfo.ro === true) {
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'post-readonly', roomInfo._id))) {
                // Check if the user was manually unmuted
                if (!(roomInfo.unmuted || []).includes(user.username || '')) {
                    return;
                }
            }
        }
        server_2.metrics.messagesSent.inc(); // TODO This line needs to be moved to it's proper place. See the comments on: https://github.com/RocketChat/Rocket.Chat/pull/5736
        const message = {
            ts: tsDiff < 10000 ? ts : new Date(),
            msg,
            sentByEmail: true,
            groupable: false,
            tmid: mid,
            rid: prevMessage.rid,
        };
        return (0, sendMessage_1.sendMessage)(user, message, roomInfo);
    });
};
exports.processDirectEmail = processDirectEmail;
