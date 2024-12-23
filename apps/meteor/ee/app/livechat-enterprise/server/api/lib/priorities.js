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
exports.removePriorityFromRoom = exports.updateRoomPriority = void 0;
exports.findPriority = findPriority;
exports.updatePriority = updatePriority;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const logger_1 = require("../../lib/logger");
function findPriority(_a) {
    return __awaiter(this, arguments, void 0, function* ({ text, pagination: { offset, count, sort }, }) {
        const query = Object.assign({}, (text && { $or: [{ name: new RegExp((0, string_helpers_1.escapeRegExp)(text), 'i') }, { description: new RegExp((0, string_helpers_1.escapeRegExp)(text), 'i') }] }));
        const { cursor, totalCount } = yield models_1.LivechatPriority.findPaginated(query, {
            sort: sort || { name: 1 },
            skip: offset,
            limit: count,
        });
        const [priorities, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            priorities,
            count: priorities.length,
            offset,
            total,
        };
    });
}
function updatePriority(_id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (data.name) {
            // If we want to enforce translated duplicates we need to change this
            const priority = yield models_1.LivechatPriority.findOneNameUsingRegex(data.name, { projection: { name: 1 } });
            if (priority && priority._id !== _id) {
                throw new Error('error-duplicate-priority-name');
            }
        }
        const createdResult = yield models_1.LivechatPriority.updatePriority(_id, data.reset || false, data.name);
        if (!createdResult.ok || !createdResult.value) {
            logger_1.logger.error(`Error updating priority: ${_id}. Unsuccessful result from mongodb. Result`, createdResult);
            throw Error('error-unable-to-update-priority');
        }
        return createdResult.value;
    });
}
const updateRoomPriority = (rid, user, priorityId) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield models_1.LivechatRooms.findOneById(rid, { projection: { _id: 1 } });
    if (!room) {
        throw new Error('error-room-does-not-exist');
    }
    const priority = yield models_1.LivechatPriority.findOneById(priorityId);
    if (!priority) {
        throw new Error('error-invalid-priority');
    }
    yield Promise.all([
        models_1.LivechatRooms.setPriorityByRoomId(rid, priority),
        models_1.LivechatInquiry.setPriorityForRoom(rid, priority),
        addPriorityChangeHistoryToRoom(room._id, user, priority),
    ]);
});
exports.updateRoomPriority = updateRoomPriority;
const removePriorityFromRoom = (rid, user) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield models_1.LivechatRooms.findOneById(rid, { projection: { _id: 1 } });
    if (!room) {
        throw new Error('error-room-does-not-exist');
    }
    yield Promise.all([
        models_1.LivechatRooms.unsetPriorityByRoomId(rid),
        models_1.LivechatInquiry.unsetPriorityForRoom(rid),
        addPriorityChangeHistoryToRoom(rid, user),
    ]);
});
exports.removePriorityFromRoom = removePriorityFromRoom;
const addPriorityChangeHistoryToRoom = (roomId, user, priority) => __awaiter(void 0, void 0, void 0, function* () {
    yield core_services_1.Message.saveSystemMessage('omnichannel_priority_change_history', roomId, '', user, {
        priorityData: Object.assign({ definedBy: {
                _id: user._id,
                username: user.username,
            } }, (priority && { priority })),
    });
});
