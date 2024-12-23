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
exports.addSlaChangeHistoryToRoom = exports.removeSlaFromRoom = exports.removeInquiryQueueSla = exports.updateRoomSlaWeights = exports.updateInquiryQueueSla = exports.removeSLAFromRooms = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../../lib/callbacks");
const removeSLAFromRooms = (slaId) => __awaiter(void 0, void 0, void 0, function* () {
    const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
    const openRooms = yield models_1.LivechatRooms.findOpenBySlaId(slaId, { projection: { _id: 1 } }, extraQuery).toArray();
    if (openRooms.length) {
        const openRoomIds = openRooms.map(({ _id }) => _id);
        yield models_1.LivechatInquiry.bulkUnsetSla(openRoomIds);
    }
    yield models_1.LivechatRooms.bulkRemoveSlaFromRoomsById(slaId);
});
exports.removeSLAFromRooms = removeSLAFromRooms;
const updateInquiryQueueSla = (roomId, sla) => __awaiter(void 0, void 0, void 0, function* () {
    const inquiry = yield models_1.LivechatInquiry.findOneByRoomId(roomId, { projection: { rid: 1, ts: 1 } });
    if (!inquiry) {
        return;
    }
    const { dueTimeInMinutes, _id: slaId } = sla;
    const estimatedWaitingTimeQueue = dueTimeInMinutes;
    yield models_1.LivechatInquiry.setSlaForRoom(inquiry.rid, {
        slaId,
        estimatedWaitingTimeQueue,
    });
});
exports.updateInquiryQueueSla = updateInquiryQueueSla;
const updateRoomSlaWeights = (roomId, sla) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.LivechatRooms.setSlaForRoomById(roomId, sla);
});
exports.updateRoomSlaWeights = updateRoomSlaWeights;
const removeInquiryQueueSla = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.LivechatInquiry.unsetSlaForRoom(roomId);
});
exports.removeInquiryQueueSla = removeInquiryQueueSla;
const removeSlaFromRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.LivechatRooms.removeSlaFromRoomById(roomId);
});
exports.removeSlaFromRoom = removeSlaFromRoom;
const addSlaChangeHistoryToRoom = (roomId, user, sla) => __awaiter(void 0, void 0, void 0, function* () {
    yield core_services_1.Message.saveSystemMessage('omnichannel_sla_change_history', roomId, '', user, {
        slaData: Object.assign({ definedBy: {
                _id: user._id,
                username: user.username,
            } }, (sla && { sla })),
    });
});
exports.addSlaChangeHistoryToRoom = addSlaChangeHistoryToRoom;
