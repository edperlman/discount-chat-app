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
callbacks_1.callbacks.add('livechat.newRoom', (room) => __awaiter(void 0, void 0, void 0, function* () {
    if (!room.departmentId) {
        return room;
    }
    const department = yield models_1.LivechatDepartment.findOneById(room.departmentId, {
        projection: { ancestors: 1 },
    });
    if (!(department === null || department === void 0 ? void 0 : department.ancestors)) {
        return room;
    }
    const { ancestors } = department;
    yield models_1.LivechatRooms.updateDepartmentAncestorsById(room._id, ancestors);
    return room;
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-add-department-ancestors');
