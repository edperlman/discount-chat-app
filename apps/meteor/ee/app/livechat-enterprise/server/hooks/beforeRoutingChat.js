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
const notifyListener_1 = require("../../../../../app/lib/server/lib/notifyListener");
const livechat_1 = require("../../../../../app/livechat/server/api/lib/livechat");
const Helper_1 = require("../../../../../app/livechat/server/lib/Helper");
const QueueManager_1 = require("../../../../../app/livechat/server/lib/QueueManager");
const departmentsLib_1 = require("../../../../../app/livechat/server/lib/departmentsLib");
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
const logger_1 = require("../lib/logger");
callbacks_1.callbacks.add('livechat.beforeRouteChat', (inquiry, agent) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!inquiry) {
        return inquiry;
    }
    // check here if department has fallback before queueing
    if ((inquiry === null || inquiry === void 0 ? void 0 : inquiry.department) && !(yield (0, livechat_1.online)(inquiry.department, true, true))) {
        const department = yield models_1.LivechatDepartment.findOneById(inquiry.department, {
            projection: { fallbackForwardDepartment: 1 },
        });
        if (!department) {
            return inquiry;
        }
        if (department.fallbackForwardDepartment) {
            logger_1.cbLogger.info(`Inquiry ${inquiry._id} will be moved from department ${department._id} to fallback department ${department.fallbackForwardDepartment}`);
            // update visitor
            yield (0, departmentsLib_1.setDepartmentForGuest)({
                token: (_a = inquiry === null || inquiry === void 0 ? void 0 : inquiry.v) === null || _a === void 0 ? void 0 : _a.token,
                department: department.fallbackForwardDepartment,
            });
            // update inquiry
            const updatedLivechatInquiry = yield models_1.LivechatInquiry.setDepartmentByInquiryId(inquiry._id, department.fallbackForwardDepartment);
            if (updatedLivechatInquiry) {
                void (0, notifyListener_1.notifyOnLivechatInquiryChanged)(updatedLivechatInquiry, 'updated', { department: updatedLivechatInquiry.department });
            }
            inquiry = updatedLivechatInquiry !== null && updatedLivechatInquiry !== void 0 ? updatedLivechatInquiry : inquiry;
            // update room
            yield models_1.LivechatRooms.setDepartmentByRoomId(inquiry.rid, department.fallbackForwardDepartment);
        }
    }
    if (!server_1.settings.get('Livechat_waiting_queue')) {
        return inquiry;
    }
    if (agent && (yield (0, Helper_1.allowAgentSkipQueue)(agent))) {
        return inquiry;
    }
    yield (0, QueueManager_1.saveQueueInquiry)(inquiry);
    return models_1.LivechatInquiry.findOneById(inquiry._id);
}), callbacks_1.callbacks.priority.HIGH, 'livechat-before-routing-chat');
