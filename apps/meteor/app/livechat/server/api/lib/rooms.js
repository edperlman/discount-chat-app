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
exports.findRooms = findRooms;
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../../lib/callbacks");
function findRooms(_a) {
    return __awaiter(this, arguments, void 0, function* ({ agents, roomName, departmentId, open, createdAt, closedAt, tags, customFields, onhold, queued, options: { offset, count, fields, sort }, }) {
        const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
        const { cursor, totalCount } = models_1.LivechatRooms.findRoomsWithCriteria({
            agents,
            roomName,
            departmentId,
            open,
            createdAt,
            closedAt,
            tags,
            customFields,
            onhold: ['t', 'true', '1'].includes(`${onhold}`),
            queued: ['t', 'true', '1'].includes(`${queued}`),
            options: {
                sort: sort || { ts: -1 },
                offset,
                count,
                fields,
            },
            extraQuery,
        });
        const [rooms, total] = yield Promise.all([cursor.toArray(), totalCount]);
        const isRoomWithDepartmentId = (depId) => !!depId;
        const departmentsIds = [...new Set(rooms.map((room) => room.departmentId).filter(isRoomWithDepartmentId))];
        if (departmentsIds.length) {
            const departments = yield models_1.LivechatDepartment.findInIds(departmentsIds, {
                projection: { name: 1 },
            }).toArray();
            rooms.forEach((room) => {
                if (!room.departmentId) {
                    return;
                }
                const department = departments.find((dept) => dept._id === room.departmentId);
                if (department) {
                    room.department = department;
                }
            });
        }
        return {
            rooms,
            count: rooms.length,
            offset,
            total,
        };
    });
}
