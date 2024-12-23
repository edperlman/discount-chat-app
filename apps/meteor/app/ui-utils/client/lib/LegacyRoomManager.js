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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyRoomManager = void 0;
const reactive_var_1 = require("meteor/reactive-var");
const tracker_1 = require("meteor/tracker");
const RoomHistoryManager_1 = require("./RoomHistoryManager");
const mainReady_1 = require("./mainReady");
const RoomManager_1 = require("../../../../client/lib/RoomManager");
const roomCoordinator_1 = require("../../../../client/lib/rooms/roomCoordinator");
const fireGlobalEvent_1 = require("../../../../client/lib/utils/fireGlobalEvent");
const getConfig_1 = require("../../../../client/lib/utils/getConfig");
const callbacks_1 = require("../../../../lib/callbacks");
const client_1 = require("../../../models/client");
const SDKClient_1 = require("../../../utils/client/lib/SDKClient");
const maxRoomsOpen = parseInt((_a = (0, getConfig_1.getConfig)('maxRoomsOpen')) !== null && _a !== void 0 ? _a : '5') || 5;
const openedRooms = {};
const openedRoomsDependency = new tracker_1.Tracker.Dependency();
function close(typeName) {
    if (openedRooms[typeName]) {
        if (openedRooms[typeName].rid) {
            SDKClient_1.sdk.stop('room-messages', openedRooms[typeName].rid);
            SDKClient_1.sdk.stop('notify-room', `${openedRooms[typeName].rid}/deleteMessage`);
            SDKClient_1.sdk.stop('notify-room', `${openedRooms[typeName].rid}/deleteMessageBulk`);
        }
        openedRooms[typeName].ready = false;
        openedRooms[typeName].active = false;
        delete openedRooms[typeName].dom;
        const { rid } = openedRooms[typeName];
        delete openedRooms[typeName];
        if (rid) {
            RoomManager_1.RoomManager.close(rid);
            return RoomHistoryManager_1.RoomHistoryManager.clear(rid);
        }
    }
}
function closeOlderRooms() {
    if (Object.keys(openedRooms).length <= maxRoomsOpen) {
        return;
    }
    const roomsToClose = Object.values(openedRooms)
        .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())
        .slice(maxRoomsOpen);
    return Array.from(roomsToClose).map((roomToClose) => close(roomToClose.typeName));
}
function closeAllRooms() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        try {
            for (var _d = true, _e = __asyncValues(Object.values(openedRooms)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const openedRoom = _c;
                yield close(openedRoom.typeName);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
function getOpenedRoomByRid(rid) {
    openedRoomsDependency.depend();
    return Object.keys(openedRooms)
        .map((typeName) => openedRooms[typeName])
        .find((openedRoom) => openedRoom.rid === rid);
}
const computation = tracker_1.Tracker.autorun(() => {
    const ready = client_1.CachedChatRoom.ready.get() && mainReady_1.mainReady.get();
    if (ready !== true) {
        return;
    }
    tracker_1.Tracker.nonreactive(() => Object.entries(openedRooms).forEach(([typeName, record]) => {
        if (record.active !== true || record.ready === true) {
            return;
        }
        const type = typeName.slice(0, 1);
        const name = typeName.slice(1);
        const room = roomCoordinator_1.roomCoordinator.getRoomDirectives(type).findRoom(name);
        void RoomHistoryManager_1.RoomHistoryManager.getMoreIfIsEmpty(record.rid);
        if (room) {
            if (record.streamActive !== true) {
                void SDKClient_1.sdk
                    .stream('room-messages', [record.rid], (msg) => __awaiter(void 0, void 0, void 0, function* () {
                    // Should not send message to room if room has not loaded all the current messages
                    // if (RoomHistoryManager.hasMoreNext(record.rid) !== false) {
                    // 	return;
                    // }
                    // Do not load command messages into channel
                    if (msg.t !== 'command') {
                        const subscription = client_1.Subscriptions.findOne({ rid: record.rid }, { reactive: false });
                        const isNew = !client_1.Messages.findOne({ _id: msg._id, temp: { $ne: true } });
                        yield (0, RoomHistoryManager_1.upsertMessage)({ msg, subscription });
                        if (isNew) {
                            yield callbacks_1.callbacks.run('streamNewMessage', msg);
                        }
                    }
                    yield callbacks_1.callbacks.run('streamMessage', Object.assign(Object.assign({}, msg), { name: room.name || '' }));
                    (0, fireGlobalEvent_1.fireGlobalEvent)('new-message', Object.assign(Object.assign({}, msg), { name: room.name || '', room: {
                            type,
                            name,
                        } }));
                }))
                    .ready()
                    .then(() => {
                    record.streamActive = true;
                    openedRoomsDependency.changed();
                });
                // when we receive a messages imported event we just clear the room history and fetch it again
                SDKClient_1.sdk.stream('notify-room', [`${record.rid}/messagesImported`], () => __awaiter(void 0, void 0, void 0, function* () {
                    yield RoomHistoryManager_1.RoomHistoryManager.clear(record.rid);
                    yield RoomHistoryManager_1.RoomHistoryManager.getMore(record.rid);
                }));
                SDKClient_1.sdk.stream('notify-room', [`${record.rid}/deleteMessage`], (msg) => {
                    client_1.Messages.remove({ _id: msg._id });
                    // remove thread refenrece from deleted message
                    client_1.Messages.update({ tmid: msg._id }, { $unset: { tmid: 1 } }, { multi: true });
                });
                SDKClient_1.sdk.stream('notify-room', [`${record.rid}/deleteMessageBulk`], ({ rid, ts, excludePinned, ignoreDiscussion, users, ids, showDeletedStatus }) => {
                    const query = { rid };
                    if (ids) {
                        query._id = { $in: ids };
                    }
                    else {
                        query.ts = ts;
                    }
                    if (excludePinned) {
                        query.pinned = { $ne: true };
                    }
                    if (ignoreDiscussion) {
                        query.drid = { $exists: false };
                    }
                    if (users === null || users === void 0 ? void 0 : users.length) {
                        query['u.username'] = { $in: users };
                    }
                    if (showDeletedStatus) {
                        return client_1.Messages.update(query, { $set: { t: 'rm', msg: '', urls: [], mentions: [], attachments: [], reactions: {} } }, { multi: true });
                    }
                    return client_1.Messages.remove(query);
                });
                SDKClient_1.sdk.stream('notify-room', [`${record.rid}/messagesRead`], ({ tmid, until }) => {
                    if (tmid) {
                        return client_1.Messages.update({
                            tmid,
                            unread: true,
                        }, { $unset: { unread: 1 } }, { multi: true });
                    }
                    client_1.Messages.update({
                        rid: record.rid,
                        unread: true,
                        ts: { $lt: until },
                        $or: [
                            {
                                tmid: { $exists: false },
                            },
                            {
                                tshow: true,
                            },
                        ],
                    }, { $unset: { unread: 1 } }, { multi: true });
                });
            }
        }
        record.ready = true;
    }));
    openedRoomsDependency.changed();
});
function open({ typeName, rid }) {
    if (!openedRooms[typeName]) {
        openedRooms[typeName] = {
            typeName,
            rid,
            active: false,
            ready: false,
            unreadSince: new reactive_var_1.ReactiveVar(undefined),
            lastSeen: new Date(),
        };
    }
    openedRooms[typeName].lastSeen = new Date();
    if (openedRooms[typeName].ready) {
        closeOlderRooms();
    }
    if (client_1.CachedChatSubscription.ready.get() === true) {
        if (openedRooms[typeName].active !== true) {
            openedRooms[typeName].active = true;
            if (computation) {
                computation.invalidate();
            }
        }
    }
    return {
        ready() {
            openedRoomsDependency.depend();
            return openedRooms[typeName].ready;
        },
    };
}
let openedRoom = undefined;
exports.LegacyRoomManager = {
    get openedRoom() {
        return openedRoom;
    },
    set openedRoom(rid) {
        openedRoom = rid;
    },
    get openedRooms() {
        return openedRooms;
    },
    getOpenedRoomByRid,
    close,
    closeAllRooms,
    get computation() {
        return computation;
    },
    open,
};
