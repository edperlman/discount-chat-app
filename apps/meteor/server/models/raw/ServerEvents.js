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
exports.ServerEventsRaw = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const BaseRaw_1 = require("./BaseRaw");
class ServerEventsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'server_events', trash);
    }
    modelIndexes() {
        return [{ key: { t: 1, ip: 1, ts: -1 } }, { key: { 't': 1, 'u.username': 1, 'ts': -1 } }];
    }
    findLastFailedAttemptByIp(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({
                ip,
                t: core_typings_1.ServerEventType.FAILED_LOGIN_ATTEMPT,
            }, { sort: { ts: -1 } });
        });
    }
    findLastFailedAttemptByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({
                'u.username': username,
                't': core_typings_1.ServerEventType.FAILED_LOGIN_ATTEMPT,
            }, { sort: { ts: -1 } });
        });
    }
    findLastSuccessfulAttemptByIp(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({
                ip,
                t: core_typings_1.ServerEventType.LOGIN,
            }, { sort: { ts: -1 } });
        });
    }
    findLastSuccessfulAttemptByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({
                'u.username': username,
                't': core_typings_1.ServerEventType.LOGIN,
            }, { sort: { ts: -1 } });
        });
    }
    countFailedAttemptsByUsernameSince(username, since) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.countDocuments({
                'u.username': username,
                't': core_typings_1.ServerEventType.FAILED_LOGIN_ATTEMPT,
                'ts': {
                    $gte: since,
                },
            });
        });
    }
    countFailedAttemptsByIpSince(ip, since) {
        return this.countDocuments({
            ip,
            t: core_typings_1.ServerEventType.FAILED_LOGIN_ATTEMPT,
            ts: {
                $gte: since,
            },
        });
    }
    countFailedAttemptsByIp(ip) {
        return this.countDocuments({
            ip,
            t: core_typings_1.ServerEventType.FAILED_LOGIN_ATTEMPT,
        });
    }
    countFailedAttemptsByUsername(username) {
        return this.countDocuments({
            'u.username': username,
            't': core_typings_1.ServerEventType.FAILED_LOGIN_ATTEMPT,
        });
    }
    createAuditServerEvent(key, data, actor) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.insertOne(Object.assign({ t: key, ts: new Date(), actor, data: Object.entries(data).map(([key, value]) => ({ key, value })), 
                // deprecated just to keep backward compatibility
                ip: '0.0.0.0' }, (actor.type === 'user' && { ip: (actor === null || actor === void 0 ? void 0 : actor.ip) || '0.0.0.0', u: { _id: actor._id, username: actor.username } })));
        });
    }
}
exports.ServerEventsRaw = ServerEventsRaw;
