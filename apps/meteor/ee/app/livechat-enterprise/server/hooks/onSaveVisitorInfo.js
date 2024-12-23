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
const priorities_1 = require("../api/lib/priorities");
const sla_1 = require("../api/lib/sla");
const updateSLA = (room, user, slaId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!slaId) {
        return (0, sla_1.removeRoomSLA)(room._id, user);
    }
    const sla = yield models_1.OmnichannelServiceLevelAgreements.findOneById(slaId, {
        projection: { _id: 1, name: 1, dueTimeInMinutes: 1 },
    });
    if (!sla) {
        throw new Error(`SLA not found with id: ${slaId}`);
    }
    yield (0, sla_1.updateRoomSLA)(room._id, user, sla);
});
const updatePriority = (room, user, priorityId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!priorityId) {
        return (0, priorities_1.removePriorityFromRoom)(room._id, user);
    }
    yield (0, priorities_1.updateRoomPriority)(room._id, user, priorityId);
});
callbacks_1.callbacks.add('livechat.saveInfo', (room_1, _a) => __awaiter(void 0, [room_1, _a], void 0, function* (room, { user, oldRoom }) {
    const { slaId: oldSlaId, priorityId: oldPriorityId } = oldRoom;
    const { slaId: newSlaId, priorityId: newPriorityId } = room;
    if (oldSlaId === newSlaId && oldPriorityId === newPriorityId) {
        return room;
    }
    if (oldSlaId === newSlaId && oldPriorityId !== newPriorityId) {
        yield updatePriority(room, user, newPriorityId);
    }
    else if (oldSlaId !== newSlaId && oldPriorityId === newPriorityId) {
        yield updateSLA(room, user, newSlaId);
    }
    else {
        yield Promise.all([updateSLA(room, user, newSlaId), updatePriority(room, user, newPriorityId)]);
    }
    return room;
}), callbacks_1.callbacks.priority.HIGH, 'livechat-on-save-room-info');
