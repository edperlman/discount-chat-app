"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createRoom;
const room_ts_1 = require("./room.ts");
const jsonrpc_lite_1 = require("jsonrpc-lite");
const getMockAppManager = (senderFn) => ({
    getBridges: () => ({
        getInternalBridge: () => ({
            doGetUsernamesOfRoomById: (roomId) => {
                return senderFn({
                    method: 'bridges:getInternalBridge:doGetUsernamesOfRoomById',
                    params: [roomId],
                }).then((result) => result.result).catch((err) => {
                    throw new jsonrpc_lite_1.JsonRpcError(`Error getting usernames of room: ${err}`, -32000);
                });
            },
        }),
    }),
});
function createRoom(room, senderFn) {
    const mockAppManager = getMockAppManager(senderFn);
    return new room_ts_1.Room(room, mockAppManager);
}
