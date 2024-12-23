"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSecondLevelOpenedRoom = exports.useOpenedRoom = exports.RoomManager = void 0;
const emitter_1 = require("@rocket.chat/emitter");
const shim_1 = require("use-sync-external-store/shim");
const getConfig_1 = require("./utils/getConfig");
const RoomHistoryManager_1 = require("../../app/ui-utils/client/lib/RoomHistoryManager");
const debug = !!((0, getConfig_1.getConfig)('debug') || (0, getConfig_1.getConfig)('debug-RoomStore'));
class RoomStore extends emitter_1.Emitter {
    constructor(rid) {
        super();
        this.rid = rid;
        this.atBottom = true;
        debug && this.on('changed', () => console.log(`RoomStore ${this.rid} changed`, this));
    }
    update({ scroll, lastTime, atBottom }) {
        if (scroll !== undefined) {
            this.scroll = scroll;
        }
        if (lastTime !== undefined) {
            this.lastTime = lastTime;
        }
        if (atBottom !== undefined) {
            this.atBottom = atBottom;
        }
        if (scroll || lastTime) {
            this.emit('changed');
        }
    }
}
const debugRoomManager = !!((0, getConfig_1.getConfig)('debug') || (0, getConfig_1.getConfig)('debug-RoomManager'));
exports.RoomManager = new (class RoomManager extends emitter_1.Emitter {
    constructor() {
        super();
        this.rooms = new Map();
        debugRoomManager &&
            this.on('opened', (rid) => {
                console.log('room opened ->', rid);
            });
        debugRoomManager &&
            this.on('back', (rid) => {
                console.log('room moved to back ->', rid);
            });
        debugRoomManager &&
            this.on('closed', (rid) => {
                console.log('room close ->', rid);
            });
    }
    get lastOpened() {
        return this.lastRid;
    }
    get opened() {
        var _a;
        return (_a = this.parentRid) !== null && _a !== void 0 ? _a : this.rid;
    }
    get openedSecondLevel() {
        if (!this.parentRid) {
            return undefined;
        }
        return this.rid;
    }
    visitedRooms() {
        return [...this.rooms.keys()];
    }
    back(rid) {
        if (rid === this.rid) {
            this.lastRid = rid;
            this.rid = undefined;
            this.emit('back', rid);
            this.emit('changed', this.rid);
        }
    }
    getMore(rid) {
        RoomHistoryManager_1.RoomHistoryManager.getMore(rid);
    }
    close(rid) {
        if (this.rooms.has(rid)) {
            this.rooms.delete(rid);
            this.emit('closed', rid);
        }
        this.emit('changed', this.rid);
    }
    _open(rid, parent) {
        if (rid === this.rid) {
            return;
        }
        this.back(rid);
        if (!this.rooms.has(rid)) {
            this.rooms.set(rid, new RoomStore(rid));
        }
        this.rid = rid;
        this.parentRid = parent;
        this.emit('opened', this.rid);
        this.emit('changed', this.rid);
    }
    open(rid) {
        this._open(rid);
    }
    openSecondLevel(parentId, rid) {
        this._open(rid, parentId);
    }
    getStore(rid) {
        return this.rooms.get(rid);
    }
})();
const subscribeOpenedRoom = [
    (callback) => exports.RoomManager.on('changed', callback),
    () => exports.RoomManager.opened,
];
const subscribeOpenedSecondLevelRoom = [
    (callback) => exports.RoomManager.on('changed', callback),
    () => exports.RoomManager.openedSecondLevel,
];
const useOpenedRoom = () => (0, shim_1.useSyncExternalStore)(...subscribeOpenedRoom);
exports.useOpenedRoom = useOpenedRoom;
const useSecondLevelOpenedRoom = () => (0, shim_1.useSyncExternalStore)(...subscribeOpenedSecondLevelRoom);
exports.useSecondLevelOpenedRoom = useSecondLevelOpenedRoom;
