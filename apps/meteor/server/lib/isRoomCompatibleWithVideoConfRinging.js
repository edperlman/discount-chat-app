"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRoomCompatibleWithVideoConfRinging = void 0;
const isRoomCompatibleWithVideoConfRinging = (roomType, roomUids) => Boolean(roomType === 'd' && roomUids && roomUids.length <= 2);
exports.isRoomCompatibleWithVideoConfRinging = isRoomCompatibleWithVideoConfRinging;
