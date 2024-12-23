"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedChatRoom = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const CachedChatSubscription_1 = require("./CachedChatSubscription");
const CachedCollection_1 = require("../../../../client/lib/cachedCollections/CachedCollection");
class CachedChatRoom extends CachedCollection_1.CachedCollection {
    constructor() {
        super({ name: 'rooms' });
    }
    handleLoadFromServer(record) {
        return this.mergeWithSubscription(record);
    }
    handleReceived(record) {
        return this.mergeWithSubscription(record);
    }
    handleSync(record) {
        return this.mergeWithSubscription(record);
    }
    mergeWithSubscription(room) {
        const sub = CachedChatSubscription_1.CachedChatSubscription.collection.findOne({ rid: room._id });
        if (!sub) {
            return room;
        }
        CachedChatSubscription_1.CachedChatSubscription.collection.update({
            rid: room._id,
        }, {
            $set: Object.assign({ encrypted: room.encrypted, description: room.description, cl: room.cl, topic: room.topic, announcement: room.announcement, broadcast: room.broadcast, archived: room.archived, avatarETag: room.avatarETag, retention: room === null || room === void 0 ? void 0 : room.retention, uids: room.uids, usernames: room.usernames, usersCount: room.usersCount, lastMessage: room.lastMessage, teamId: room.teamId, teamMain: room.teamMain, v: room === null || room === void 0 ? void 0 : room.v, transcriptRequest: room === null || room === void 0 ? void 0 : room.transcriptRequest, servedBy: room === null || room === void 0 ? void 0 : room.servedBy, onHold: room === null || room === void 0 ? void 0 : room.onHold, tags: room === null || room === void 0 ? void 0 : room.tags, closedAt: room === null || room === void 0 ? void 0 : room.closedAt, metrics: room === null || room === void 0 ? void 0 : room.metrics, muted: room.muted, waitingResponse: room === null || room === void 0 ? void 0 : room.waitingResponse, responseBy: room === null || room === void 0 ? void 0 : room.responseBy, priorityId: room === null || room === void 0 ? void 0 : room.priorityId, priorityWeight: (room === null || room === void 0 ? void 0 : room.priorityWeight) || core_typings_1.LivechatPriorityWeight.NOT_SPECIFIED, estimatedWaitingTimeQueue: (room === null || room === void 0 ? void 0 : room.estimatedWaitingTimeQueue) || core_typings_1.DEFAULT_SLA_CONFIG.ESTIMATED_WAITING_TIME_QUEUE, slaId: room === null || room === void 0 ? void 0 : room.slaId, livechatData: room === null || room === void 0 ? void 0 : room.livechatData, departmentId: room === null || room === void 0 ? void 0 : room.departmentId, ts: room.ts, source: room === null || room === void 0 ? void 0 : room.source, queuedAt: room === null || room === void 0 ? void 0 : room.queuedAt, federated: room.federated }, (() => {
                const name = room.name || sub.name;
                const fname = room.fname || sub.fname || name;
                return {
                    lowerCaseName: String(!room.prid ? name : fname).toLowerCase(),
                    lowerCaseFName: String(fname).toLowerCase(),
                };
            })()),
        });
        CachedChatSubscription_1.CachedChatSubscription.collection.update({
            rid: room._id,
            lm: { $lt: room.lm },
        }, {
            $set: {
                lm: room.lm,
            },
        });
        return room;
    }
    deserializeFromCache(record) {
        var _a;
        const deserialized = super.deserializeFromCache(record);
        if ((_a = deserialized === null || deserialized === void 0 ? void 0 : deserialized.lastMessage) === null || _a === void 0 ? void 0 : _a._updatedAt) {
            deserialized.lastMessage._updatedAt = new Date(deserialized.lastMessage._updatedAt);
        }
        return deserialized;
    }
}
const instance = new CachedChatRoom();
exports.CachedChatRoom = instance;
