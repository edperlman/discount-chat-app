"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivechatDepartmentAgents = void 0;
const LivechatDepartmentAgents_1 = require("../../../../server/models/raw/LivechatDepartmentAgents");
class LivechatDepartmentAgents extends LivechatDepartmentAgents_1.LivechatDepartmentAgentsRaw {
    findAgentsByAgentIdAndBusinessHourId(agentId, businessHourId) {
        const match = {
            $match: { agentId },
        };
        const lookup = {
            $lookup: {
                from: 'rocketchat_livechat_department',
                localField: 'departmentId',
                foreignField: '_id',
                as: 'departments',
            },
        };
        const unwind = {
            $unwind: {
                path: '$departments',
                preserveNullAndEmptyArrays: true,
            },
        };
        const withBusinessHourId = { $match: { 'departments.businessHourId': businessHourId } };
        const project = { $project: { departments: 0 } };
        return this.col.aggregate([match, lookup, unwind, withBusinessHourId, project]).toArray();
    }
}
exports.LivechatDepartmentAgents = LivechatDepartmentAgents;
