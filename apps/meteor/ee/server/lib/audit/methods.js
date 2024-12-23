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
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const check_1 = require("meteor/check");
const ddp_rate_limiter_1 = require("meteor/ddp-rate-limiter");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../../app/authorization/server/functions/hasPermission");
const server_1 = require("../../../../app/statistics/server");
const callbacks_1 = require("../../../../lib/callbacks");
const isTruthy_1 = require("../../../../lib/isTruthy");
const i18n_1 = require("../../../../server/lib/i18n");
const getValue = (room) => room && { rids: [room._id], name: room.name };
const getUsersIdFromUserName = (usernames) => __awaiter(void 0, void 0, void 0, function* () {
    const users = usernames ? yield models_1.Users.findByUsernames(usernames.filter(isTruthy_1.isTruthy)).toArray() : undefined;
    return users === null || users === void 0 ? void 0 : users.filter(isTruthy_1.isTruthy).map((userId) => userId._id);
});
const getRoomInfoByAuditParams = (_a) => __awaiter(void 0, [_a], void 0, function* ({ type, roomId: rid, users: usernames, visitor, agent, }) {
    if (rid) {
        return getValue(yield models_1.Rooms.findOne({ _id: rid }));
    }
    if (type === 'd') {
        return getValue(yield models_1.Rooms.findDirectRoomContainingAllUsernames(usernames));
    }
    if (type === 'l') {
        console.warn('Deprecation Warning! This method will be removed in the next version (4.0.0)');
        const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
        const rooms = yield models_1.LivechatRooms.findByVisitorIdAndAgentId(visitor, agent, {
            projection: { _id: 1 },
        }, extraQuery).toArray();
        return (rooms === null || rooms === void 0 ? void 0 : rooms.length) ? { rids: rooms.map(({ _id }) => _id), name: i18n_1.i18n.t('Omnichannel') } : undefined;
    }
});
meteor_1.Meteor.methods({
    auditGetOmnichannelMessages(_a) {
        return __awaiter(this, arguments, void 0, function* ({ startDate, endDate, users: usernames, msg, type, visitor, agent }) {
            (0, check_1.check)(startDate, Date);
            (0, check_1.check)(endDate, Date);
            const user = (yield meteor_1.Meteor.userAsync());
            if (!user || !(yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'can-audit'))) {
                throw new meteor_1.Meteor.Error('Not allowed');
            }
            const userFields = Object.assign(Object.assign({ _id: user._id, username: user.username }, (user.name && { name: user.name })), (user.avatarETag && { avatarETag: user.avatarETag }));
            const rooms = yield models_1.LivechatRooms.findByVisitorIdAndAgentId(visitor, agent, {
                projection: { _id: 1 },
            }).toArray();
            const rids = (rooms === null || rooms === void 0 ? void 0 : rooms.length) ? rooms.map(({ _id }) => _id) : undefined;
            const name = i18n_1.i18n.t('Omnichannel');
            const query = {
                rid: { $in: rids },
                ts: {
                    $gt: startDate,
                    $lt: endDate,
                },
            };
            if (msg) {
                const regex = new RegExp((0, string_helpers_1.escapeRegExp)(msg).trim(), 'i');
                query.msg = regex;
            }
            const messages = yield models_1.Messages.find(query).toArray();
            // Once the filter is applied, messages will be shown and a log containing all filters will be saved for further auditing.
            yield models_1.AuditLog.insertOne({
                ts: new Date(),
                results: messages.length,
                u: userFields,
                fields: { msg, users: usernames, rids, room: name, startDate, endDate, type, visitor, agent },
            });
            return messages;
        });
    },
    auditGetMessages(_a) {
        return __awaiter(this, arguments, void 0, function* ({ rid, startDate, endDate, users: usernames, msg, type, visitor, agent }) {
            (0, check_1.check)(startDate, Date);
            (0, check_1.check)(endDate, Date);
            const user = (yield meteor_1.Meteor.userAsync());
            if (!user || !(yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'can-audit'))) {
                throw new meteor_1.Meteor.Error('Not allowed');
            }
            const userFields = Object.assign(Object.assign({ _id: user._id, username: user.username }, (user.name && { name: user.name })), (user.avatarETag && { avatarETag: user.avatarETag }));
            let rids;
            let name;
            const query = {
                ts: {
                    $gt: startDate,
                    $lt: endDate,
                },
            };
            if (type === 'u') {
                const usersId = yield getUsersIdFromUserName(usernames);
                query['u._id'] = { $in: usersId };
            }
            else {
                const roomInfo = yield getRoomInfoByAuditParams({ type, roomId: rid, users: usernames, visitor, agent });
                if (!roomInfo) {
                    throw new meteor_1.Meteor.Error('Room doesn`t exist');
                }
                rids = roomInfo.rids;
                name = roomInfo.name;
                query.rid = { $in: rids };
            }
            if (msg) {
                const regex = new RegExp((0, string_helpers_1.escapeRegExp)(msg).trim(), 'i');
                query.msg = regex;
            }
            const messages = yield models_1.Messages.find(query).toArray();
            // Once the filter is applied, messages will be shown and a log containing all filters will be saved for further auditing.
            yield models_1.AuditLog.insertOne({
                ts: new Date(),
                results: messages.length,
                u: userFields,
                fields: { msg, users: usernames, rids, room: name, startDate, endDate, type, visitor, agent },
            });
            (0, server_1.updateCounter)({ settingsId: 'Message_Auditing_Panel_Load_Count' });
            return messages;
        });
    },
    auditGetAuditions(_a) {
        return __awaiter(this, arguments, void 0, function* ({ startDate, endDate }) {
            (0, check_1.check)(startDate, Date);
            (0, check_1.check)(endDate, Date);
            const uid = meteor_1.Meteor.userId();
            if (!uid || !(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'can-audit-log'))) {
                throw new meteor_1.Meteor.Error('Not allowed');
            }
            return models_1.AuditLog.find({
                // 'u._id': userId,
                ts: {
                    $gt: startDate,
                    $lt: endDate,
                },
            }, {
                projection: {
                    'u.services': 0,
                    'u.roles': 0,
                    'u.lastLogin': 0,
                    'u.statusConnection': 0,
                    'u.emails': 0,
                },
            }).toArray();
        });
    },
});
ddp_rate_limiter_1.DDPRateLimiter.addRule({
    type: 'method',
    name: 'auditGetAuditions',
    userId( /* userId*/) {
        return true;
    },
}, 10, 60000);
ddp_rate_limiter_1.DDPRateLimiter.addRule({
    type: 'method',
    name: 'auditGetMessages',
    userId( /* userId*/) {
        return true;
    },
}, 10, 60000);
