"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersEE = void 0;
const readSecondaryPreferred_1 = require("../../../../server/database/readSecondaryPreferred");
const Users_1 = require("../../../../server/models/raw/Users");
class UsersEE extends Users_1.UsersRaw {
    constructor(db, trash) {
        super(db, trash);
    }
    // @ts-expect-error - typings are good, but JS is not helping
    getUnavailableAgents(departmentId, customFilter) {
        // if department is provided, remove the agents that are not from the selected department
        const departmentFilter = departmentId
            ? [
                {
                    $lookup: {
                        from: 'rocketchat_livechat_department_agents',
                        let: { departmentId: '$departmentId', agentId: '$agentId' },
                        pipeline: [
                            {
                                $match: { $expr: { $eq: ['$$agentId', '$_id'] } },
                            },
                            {
                                $match: { $expr: { $eq: ['$$departmentId', departmentId] } },
                            },
                        ],
                        as: 'department',
                    },
                },
                {
                    $match: { department: { $size: 1 } },
                },
            ]
            : [];
        return this.col
            .aggregate([
            {
                $match: {
                    status: { $exists: true, $ne: 'offline' },
                    statusLivechat: 'available',
                    roles: 'livechat-agent',
                },
            },
            ...departmentFilter,
            {
                $lookup: {
                    from: 'rocketchat_subscription',
                    localField: '_id',
                    foreignField: 'u._id',
                    as: 'subs',
                },
            },
            {
                $project: {
                    'agentId': '$_id',
                    'livechat.maxNumberSimultaneousChat': 1,
                    'username': 1,
                    'lastAssignTime': 1,
                    'lastRoutingTime': 1,
                    'queueInfo.chats': {
                        $size: {
                            $filter: {
                                input: '$subs',
                                as: 'sub',
                                cond: {
                                    $and: [{ $eq: ['$$sub.t', 'l'] }, { $eq: ['$$sub.open', true] }, { $ne: ['$$sub.onHold', true] }],
                                },
                            },
                        },
                    },
                },
            },
            ...(customFilter ? [customFilter] : []),
            {
                $sort: {
                    'queueInfo.chats': 1,
                    'lastAssignTime': 1,
                    'lastRoutingTime': 1,
                    'username': 1,
                },
            },
        ], { allowDiskUse: true, readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() })
            .toArray();
    }
}
exports.UsersEE = UsersEE;
