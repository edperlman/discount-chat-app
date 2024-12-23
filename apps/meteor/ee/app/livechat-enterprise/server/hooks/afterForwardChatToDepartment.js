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
const callbacks_1 = require("../../../../../lib/callbacks");
const logger_1 = require("../lib/logger");
callbacks_1.callbacks.add('livechat.afterForwardChatToDepartment', (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { rid, newDepartmentId } = options;
    const room = yield models_1.LivechatRooms.findOneById(rid, {
        projection: { departmentAncestors: 1 },
    });
    if (!room) {
        return options;
    }
    yield models_1.LivechatRooms.unsetPredictedVisitorAbandonmentByRoomId(room._id);
    const department = yield models_1.LivechatDepartment.findOneById(newDepartmentId, {
        projection: { ancestors: 1 },
    });
    if (!department) {
        return options;
    }
    const { departmentAncestors } = room;
    const { ancestors } = department;
    if (!ancestors && !departmentAncestors) {
        return options;
    }
    logger_1.cbLogger.debug(`Updating department ${newDepartmentId} ancestors for room ${rid}`);
    yield models_1.LivechatRooms.updateDepartmentAncestorsById(room._id, ancestors);
    return options;
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-after-forward-room-to-department');
