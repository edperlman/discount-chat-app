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
exports.findInquiries = findInquiries;
exports.findOneInquiryByRoomId = findOneInquiryByRoomId;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const inquiries_1 = require("../../../lib/inquiries");
const settings_1 = require("../../lib/settings");
const agentDepartments = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const agentDepartments = (yield models_1.LivechatDepartmentAgents.findByAgentId(userId, { projection: { departmentId: 1 } }).toArray()).map(({ departmentId }) => departmentId);
    return (yield models_1.LivechatDepartment.findEnabledInIds(agentDepartments, { projection: { _id: 1 } }).toArray()).map(({ _id }) => _id);
});
const applyDepartmentRestrictions = (userId, filterDepartment) => __awaiter(void 0, void 0, void 0, function* () {
    const allowedDepartments = yield agentDepartments(userId);
    if (allowedDepartments && Array.isArray(allowedDepartments) && allowedDepartments.length > 0) {
        if (!filterDepartment) {
            return { $in: allowedDepartments };
        }
        if (!allowedDepartments.includes(filterDepartment)) {
            throw new Error('error-not-authorized');
        }
        return filterDepartment;
    }
    return { $exists: false };
});
function findInquiries(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, department: filterDepartment, status, pagination: { offset, count, sort }, }) {
        const department = yield applyDepartmentRestrictions(userId, filterDepartment);
        const defaultSort = (0, inquiries_1.getOmniChatSortQuery)((0, settings_1.getInquirySortMechanismSetting)());
        const options = {
            limit: count,
            skip: offset,
            sort: Object.assign(Object.assign({}, sort), defaultSort),
        };
        const filter = Object.assign(Object.assign({}, (status && Object.values(core_typings_1.LivechatInquiryStatus).includes(status) && { status })), { $or: [
                {
                    $and: [{ defaultAgent: { $exists: true } }, { 'defaultAgent.agentId': userId }],
                },
                Object.assign({}, (department && { department })),
                // Add _always_ the "public queue" to returned list of inquiries, even if agent already has departments
                { department: { $exists: false } },
            ] });
        const { cursor, totalCount } = models_1.LivechatInquiry.findPaginated(filter, options);
        const [inquiries, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            inquiries,
            count: inquiries.length,
            offset,
            total,
        };
    });
}
function findOneInquiryByRoomId(_a) {
    return __awaiter(this, arguments, void 0, function* ({ roomId }) {
        return {
            inquiry: yield models_1.LivechatInquiry.findOneByRoomId(roomId, {}),
        };
    });
}
