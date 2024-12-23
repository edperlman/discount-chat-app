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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LivechatAgentActivityRaw = void 0;
const moment_1 = __importDefault(require("moment"));
const BaseRaw_1 = require("./BaseRaw");
const readSecondaryPreferred_1 = require("../../database/readSecondaryPreferred");
class LivechatAgentActivityRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'livechat_agent_activity', trash);
    }
    modelIndexes() {
        return [{ key: { date: 1 } }, { key: { agentId: 1, date: 1 }, unique: true }];
    }
    findOneByAgendIdAndDate(agentId, date) {
        return this.findOne({ agentId, date });
    }
    createOrUpdate() {
        return __awaiter(this, arguments, void 0, function* (data = {}) {
            const { date, agentId, lastStartedAt } = data;
            if (!date || !agentId) {
                return;
            }
            return this.findOneAndUpdate({ agentId, date }, {
                $unset: {
                    lastStoppedAt: 1,
                },
                $set: {
                    lastStartedAt: lastStartedAt || new Date(),
                },
                $setOnInsert: {
                    date,
                    agentId,
                },
            }, { upsert: true });
        });
    }
    updateLastStoppedAt({ agentId, date, lastStoppedAt, availableTime, }) {
        const query = {
            agentId,
            date,
        };
        const update = {
            $inc: { availableTime },
            $set: {
                lastStoppedAt,
            },
        };
        return this.updateMany(query, update);
    }
    updateServiceHistory({ agentId, date, serviceHistory, }) {
        const query = {
            agentId,
            date,
        };
        const update = {
            $addToSet: {
                serviceHistory,
            },
        };
        return this.updateMany(query, update);
    }
    findOpenSessions() {
        const query = {
            lastStoppedAt: { $exists: false },
        };
        return this.find(query);
    }
    findAllAverageAvailableServiceTime({ date, departmentId }) {
        const match = { $match: { date } };
        const lookup = {
            $lookup: {
                from: 'rocketchat_livechat_department_agents',
                localField: 'agentId',
                foreignField: 'agentId',
                as: 'departments',
            },
        };
        const unwind = {
            $unwind: {
                path: '$departments',
                preserveNullAndEmptyArrays: true,
            },
        };
        const departmentsMatch = {
            $match: {
                'departments.departmentId': departmentId,
            },
        };
        const sumAvailableTimeWithCurrentTime = {
            $sum: [{ $divide: [{ $subtract: [new Date(), '$lastStartedAt'] }, 1000] }, '$availableTime'],
        };
        const group = {
            $group: {
                _id: null,
                allAvailableTimeInSeconds: {
                    $sum: {
                        $cond: [{ $ifNull: ['$lastStoppedAt', false] }, '$availableTime', sumAvailableTimeWithCurrentTime],
                    },
                },
                rooms: { $sum: 1 },
            },
        };
        const project = {
            $project: {
                averageAvailableServiceTimeInSeconds: {
                    $trunc: {
                        $cond: [{ $eq: ['$rooms', 0] }, 0, { $divide: ['$allAvailableTimeInSeconds', '$rooms'] }],
                    },
                },
            },
        };
        const params = [match];
        if (departmentId && (departmentId !== 'undefined' || departmentId !== undefined)) {
            params.push(lookup);
            params.push(unwind);
            params.push(departmentsMatch);
        }
        params.push(group);
        params.push(project);
        return this.col
            .aggregate(params, { readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() })
            .toArray();
    }
    findAvailableServiceTimeHistory({ start, end, fullReport, onlyCount = false, options = {}, }) {
        const match = {
            $match: {
                date: {
                    $gte: parseInt((0, moment_1.default)(start).format('YYYYMMDD')),
                    $lte: parseInt((0, moment_1.default)(end).format('YYYYMMDD')),
                },
            },
        };
        const lookup = {
            $lookup: {
                from: 'users',
                localField: 'agentId',
                foreignField: '_id',
                as: 'user',
            },
        };
        const unwind = {
            $unwind: {
                path: '$user',
            },
        };
        const group = {
            $group: {
                _id: { _id: '$user._id', username: '$user.username' },
                serviceHistory: { $first: '$serviceHistory' },
                availableTimeInSeconds: { $sum: '$availableTime' },
            },
        };
        const project = {
            $project: Object.assign({ _id: 0, username: '$_id.username', availableTimeInSeconds: 1 }, (fullReport && { serviceHistory: 1 })),
        };
        const sort = { $sort: options.sort || { username: 1 } };
        const params = [match, lookup, unwind, group, project, sort];
        if (onlyCount) {
            params.push({ $count: 'total' });
            return this.col.aggregate(params);
        }
        if (options.offset) {
            params.push({ $skip: options.offset });
        }
        if (options.count) {
            params.push({ $limit: options.count });
        }
        return this.col.aggregate(params, { allowDiskUse: true, readPreference: (0, readSecondaryPreferred_1.readSecondaryPreferred)() });
    }
}
exports.LivechatAgentActivityRaw = LivechatAgentActivityRaw;
