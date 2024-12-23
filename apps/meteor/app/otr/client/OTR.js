"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OTRRoom_1 = require("./OTRRoom");
class OTR {
    constructor() {
        this.instancesByRoomId = {};
    }
    getInstanceByRoomId(uid, rid) {
        if (this.instancesByRoomId[rid]) {
            return this.instancesByRoomId[rid];
        }
        const otrRoom = OTRRoom_1.OTRRoom.create(uid, rid);
        if (!otrRoom) {
            return undefined;
        }
        this.instancesByRoomId[rid] = otrRoom;
        return this.instancesByRoomId[rid];
    }
    closeAllInstances() {
        // Resets state, but doesnt emit events
        // Other party should receive event and fire events
        Object.values(this.instancesByRoomId).forEach((instance) => {
            instance.softReset();
        });
        this.instancesByRoomId = {};
    }
}
exports.default = new OTR();
