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
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../../../lib/callbacks");
callbacks_1.callbacks.add('livechat.beforeForwardRoomToDepartment', (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { room, transferData } = options;
    if (!room || !transferData) {
        return options;
    }
    const { departmentId } = room;
    if (!departmentId) {
        return options;
    }
    const { department: departmentToTransfer } = transferData;
    const currentDepartment = yield models_1.LivechatDepartment.findOneById(departmentId, {
        projection: { departmentsAllowedToForward: 1 },
    });
    if (!currentDepartment) {
        return options;
    }
    const { departmentsAllowedToForward } = currentDepartment;
    const isAllowedToTransfer = !(departmentsAllowedToForward === null || departmentsAllowedToForward === void 0 ? void 0 : departmentsAllowedToForward.length) ||
        (Array.isArray(departmentsAllowedToForward) && departmentsAllowedToForward.includes(departmentToTransfer._id));
    if (isAllowedToTransfer) {
        return options;
    }
    throw new meteor_1.Meteor.Error('error-forwarding-department-target-not-allowed', 'The forwarding to the target department is not allowed.');
}), callbacks_1.callbacks.priority.HIGH, 'livechat-before-forward-room-to-department');
