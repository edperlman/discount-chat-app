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
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
const handleOnAgentAssignmentFailed = (room_1, _a) => __awaiter(void 0, [room_1, _a], void 0, function* (room, { inquiry, options, }) {
    if (!inquiry || !room) {
        return;
    }
    if (!server_1.settings.get('Livechat_waiting_queue')) {
        return;
    }
    const { forwardingToDepartment: { oldDepartmentId } = {}, forwardingToDepartment } = options;
    if (!forwardingToDepartment) {
        return;
    }
    const { department: newDepartmentId } = inquiry;
    if (!newDepartmentId || !oldDepartmentId || newDepartmentId === oldDepartmentId) {
        return;
    }
    return Object.assign(Object.assign({}, room), { chatQueued: true });
});
callbacks_1.callbacks.add('livechat.onAgentAssignmentFailed', handleOnAgentAssignmentFailed, callbacks_1.callbacks.priority.HIGH, 'livechat-agent-assignment-failed');
