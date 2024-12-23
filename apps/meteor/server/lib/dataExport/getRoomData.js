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
exports.getRoomData = void 0;
const models_1 = require("@rocket.chat/models");
const getRoomData = (roomId, ownUserId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const roomData = yield models_1.Rooms.findOneById(roomId);
    if (!roomData) {
        return {};
    }
    const roomName = roomData.name && roomData.t !== 'd' ? roomData.name : roomId;
    const userId = roomData.t === 'd' ? (_a = roomData.uids) === null || _a === void 0 ? void 0 : _a.find((uid) => uid !== ownUserId) : undefined;
    return {
        roomId,
        roomName,
        userId,
        exportedCount: 0,
        status: 'pending',
        type: roomData.t,
        targetFile: '',
    };
});
exports.getRoomData = getRoomData;
