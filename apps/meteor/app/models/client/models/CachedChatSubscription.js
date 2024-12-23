"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedChatSubscription = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const CachedChatRoom_1 = require("./CachedChatRoom");
const CachedCollection_1 = require("../../../../client/lib/cachedCollections/CachedCollection");
class CachedChatSubscription extends CachedCollection_1.CachedCollection {
    constructor() {
        super({ name: 'subscriptions' });
    }
    handleLoadFromServer(record) {
        return this.mergeWithRoom(record);
    }
    handleReceived(record) {
        return this.mergeWithRoom(record);
    }
    handleSync(record) {
        return this.mergeWithRoom(record);
    }
    mergeWithRoom(subscription) {
        var _a, _b;
        const options = {
            fields: {
                lm: 1,
                lastMessage: 1,
                uids: 1,
                usernames: 1,
                usersCount: 1,
                topic: 1,
                encrypted: 1,
                description: 1,
                announcement: 1,
                broadcast: 1,
                archived: 1,
                avatarETag: 1,
                retention: 1,
                teamId: 1,
                teamMain: 1,
                msgs: 1,
                onHold: 1,
                metrics: 1,
                muted: 1,
                servedBy: 1,
                ts: 1,
                waitingResponse: 1,
                v: 1,
                transcriptRequest: 1,
                tags: 1,
                closedAt: 1,
                responseBy: 1,
                priorityId: 1,
                priorityWeight: 1,
                slaId: 1,
                estimatedWaitingTimeQueue: 1,
                livechatData: 1,
                departmentId: 1,
                source: 1,
                queuedAt: 1,
                federated: 1,
            },
        };
        const room = CachedChatRoom_1.CachedChatRoom.collection.findOne({ _id: subscription.rid }, options);
        const lastRoomUpdate = (room === null || room === void 0 ? void 0 : room.lm) || subscription.ts || (room === null || room === void 0 ? void 0 : room.ts);
        return Object.assign(Object.assign(Object.assign({}, subscription), (() => {
            const { name } = subscription;
            const fname = subscription.fname || name;
            return {
                lowerCaseName: String(!subscription.prid ? name : fname).toLowerCase(),
                lowerCaseFName: String(fname).toLowerCase(),
            };
        })()), { encrypted: room === null || room === void 0 ? void 0 : room.encrypted, description: room === null || room === void 0 ? void 0 : room.description, cl: room === null || room === void 0 ? void 0 : room.cl, topic: room === null || room === void 0 ? void 0 : room.topic, announcement: room === null || room === void 0 ? void 0 : room.announcement, broadcast: room === null || room === void 0 ? void 0 : room.broadcast, archived: room === null || room === void 0 ? void 0 : room.archived, avatarETag: room === null || room === void 0 ? void 0 : room.avatarETag, retention: room === null || room === void 0 ? void 0 : room.retention, lastMessage: room === null || room === void 0 ? void 0 : room.lastMessage, teamId: room === null || room === void 0 ? void 0 : room.teamId, teamMain: room === null || room === void 0 ? void 0 : room.teamMain, uids: room === null || room === void 0 ? void 0 : room.uids, usernames: room === null || room === void 0 ? void 0 : room.usernames, usersCount: (_a = room === null || room === void 0 ? void 0 : room.usersCount) !== null && _a !== void 0 ? _a : 0, v: room === null || room === void 0 ? void 0 : room.v, transcriptRequest: room === null || room === void 0 ? void 0 : room.transcriptRequest, servedBy: room === null || room === void 0 ? void 0 : room.servedBy, onHold: room === null || room === void 0 ? void 0 : room.onHold, tags: room === null || room === void 0 ? void 0 : room.tags, closedAt: room === null || room === void 0 ? void 0 : room.closedAt, metrics: room === null || room === void 0 ? void 0 : room.metrics, muted: room === null || room === void 0 ? void 0 : room.muted, waitingResponse: room === null || room === void 0 ? void 0 : room.waitingResponse, responseBy: room === null || room === void 0 ? void 0 : room.responseBy, priorityId: room === null || room === void 0 ? void 0 : room.priorityId, slaId: room === null || room === void 0 ? void 0 : room.slaId, priorityWeight: (room === null || room === void 0 ? void 0 : room.priorityWeight) || core_typings_1.LivechatPriorityWeight.NOT_SPECIFIED, estimatedWaitingTimeQueue: (room === null || room === void 0 ? void 0 : room.estimatedWaitingTimeQueue) || core_typings_1.DEFAULT_SLA_CONFIG.ESTIMATED_WAITING_TIME_QUEUE, livechatData: room === null || room === void 0 ? void 0 : room.livechatData, departmentId: room === null || room === void 0 ? void 0 : room.departmentId, ts: (_b = room === null || room === void 0 ? void 0 : room.ts) !== null && _b !== void 0 ? _b : subscription.ts, source: room === null || room === void 0 ? void 0 : room.source, queuedAt: room === null || room === void 0 ? void 0 : room.queuedAt, federated: room === null || room === void 0 ? void 0 : room.federated, lm: subscription.lr ? new Date(Math.max(subscription.lr.getTime(), (lastRoomUpdate === null || lastRoomUpdate === void 0 ? void 0 : lastRoomUpdate.getTime()) || 0)) : lastRoomUpdate });
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
const instance = new CachedChatSubscription();
exports.CachedChatSubscription = instance;
