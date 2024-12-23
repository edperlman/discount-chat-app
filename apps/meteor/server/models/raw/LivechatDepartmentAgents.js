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
exports.LivechatDepartmentAgentsRaw = void 0;
const models_1 = require("@rocket.chat/models");
const BaseRaw_1 = require("./BaseRaw");
class LivechatDepartmentAgentsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'livechat_department_agents', trash);
    }
    modelIndexes() {
        return [
            {
                key: {
                    departmentId: 1,
                },
            },
            {
                key: {
                    departmentEnabled: 1,
                },
            },
            {
                key: {
                    agentId: 1,
                },
            },
            {
                key: {
                    username: 1,
                },
            },
        ];
    }
    findUsersInQueue(usersList, options) {
        const query = {};
        if (Array.isArray(usersList) && usersList.length) {
            // TODO: Remove
            query.username = {
                $in: usersList,
            };
        }
        if (options === undefined) {
            return this.find(query);
        }
        return this.find(query, options);
    }
    findByAgentIds(agentIds, options) {
        return this.find({ agentId: { $in: agentIds } }, options);
    }
    findByAgentId(agentId, options) {
        return this.find({ agentId }, options);
    }
    findAgentsByDepartmentId(departmentId, options) {
        const query = { departmentId };
        if (options === undefined) {
            return this.findPaginated(query);
        }
        return this.findPaginated(query, options);
    }
    findByDepartmentIds(departmentIds, options = {}) {
        return this.find({ departmentId: { $in: departmentIds } }, options);
    }
    findAgentsByAgentIdAndBusinessHourId(_agentId, _businessHourId) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    setDepartmentEnabledByDepartmentId(departmentId, departmentEnabled) {
        return this.updateMany({ departmentId }, { $set: { departmentEnabled } });
    }
    removeByDepartmentId(departmentId) {
        return this.deleteMany({ departmentId });
    }
    findByDepartmentId(departmentId, options) {
        return this.find({ departmentId }, options);
    }
    findOneByAgentIdAndDepartmentId(agentId, departmentId, options) {
        return this.findOne({ agentId, departmentId }, options);
    }
    saveAgent(agent) {
        return this.updateOne({
            agentId: agent.agentId,
            departmentId: agent.departmentId,
        }, {
            $set: {
                username: agent.username,
                departmentEnabled: agent.departmentEnabled,
                count: parseInt(`${agent.count}`),
                order: parseInt(`${agent.order}`),
            },
        }, { upsert: true });
    }
    removeByAgentId(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteMany({ agentId });
        });
    }
    removeByDepartmentIdAndAgentId(departmentId, agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.deleteMany({ departmentId, agentId });
        });
    }
    getNextAgentForDepartment(departmentId, isLivechatEnabledWhenAgentIdle, ignoreAgentId, extraQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const agents = yield this.findByDepartmentId(departmentId).toArray();
            if (agents.length === 0) {
                return;
            }
            const onlineUsers = yield models_1.Users.findOnlineUserFromList(agents.map((agent) => agent.username), isLivechatEnabledWhenAgentIdle).toArray();
            const onlineUsernames = onlineUsers.map((user) => user.username).filter(isStringValue);
            // get fully booked agents, to ignore them from the query
            const currentUnavailableAgents = (yield models_1.Users.getUnavailableAgents(departmentId, extraQuery)).map((u) => u.username);
            const query = Object.assign({ departmentId, username: {
                    $in: onlineUsernames,
                    $nin: currentUnavailableAgents,
                } }, (ignoreAgentId && { agentId: { $ne: ignoreAgentId } }));
            const update = {
                $inc: {
                    count: 1,
                },
            };
            const sort = {
                count: 1,
                order: 1,
                username: 1,
            };
            const projection = {
                _id: 1,
                agentId: 1,
                departmentId: 1,
                username: 1,
            };
            const agent = yield this.findOneAndUpdate(query, update, { sort, projection, returnDocument: 'after' });
            return agent.value;
        });
    }
    checkOnlineForDepartment(departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const agents = yield this.findByDepartmentId(departmentId).toArray();
            if (agents.length === 0) {
                return false;
            }
            const onlineUser = yield models_1.Users.findOneOnlineAgentByUserList(agents.map((agent) => agent.username));
            return Boolean(onlineUser);
        });
    }
    getOnlineForDepartment(departmentId, isLivechatEnabledWhenAgentIdle) {
        return __awaiter(this, void 0, void 0, function* () {
            const agents = yield this.findByDepartmentId(departmentId).toArray();
            if (agents.length === 0) {
                return;
            }
            const onlineUsers = yield models_1.Users.findOnlineUserFromList(agents.map((a) => a.username), isLivechatEnabledWhenAgentIdle).toArray();
            const onlineUsernames = onlineUsers.map((user) => user.username).filter(isStringValue);
            const query = {
                departmentId,
                username: {
                    $in: onlineUsernames,
                },
            };
            return this.find(query);
        });
    }
    countOnlineForDepartment(departmentId, isLivechatEnabledWhenAgentIdle) {
        return __awaiter(this, void 0, void 0, function* () {
            const agents = yield this.findByDepartmentId(departmentId, { projection: { username: 1 } }).toArray();
            if (agents.length === 0) {
                return 0;
            }
            return models_1.Users.countOnlineUserFromList(agents.map((a) => a.username), isLivechatEnabledWhenAgentIdle);
        });
    }
    getBotsForDepartment(departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const agents = yield this.findByDepartmentId(departmentId).toArray();
            if (agents.length === 0) {
                return;
            }
            const botUsers = yield models_1.Users.findBotAgents(agents.map((a) => a.username)).toArray();
            const botUsernames = botUsers.map((user) => user.username).filter(isStringValue);
            const query = {
                departmentId,
                username: {
                    $in: botUsernames,
                },
            };
            return this.find(query);
        });
    }
    countBotsForDepartment(departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const agents = yield this.findByDepartmentId(departmentId, { projection: { username: 1 } }).toArray();
            if (agents.length === 0) {
                return 0;
            }
            return models_1.Users.countBotAgents(agents.map((a) => a.username));
        });
    }
    getNextBotForDepartment(departmentId, ignoreAgentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const agents = yield this.findByDepartmentId(departmentId).toArray();
            if (!agents.length) {
                return;
            }
            const botUsernames = (yield models_1.Users.findBotAgents(agents.map((a) => a.username)).toArray())
                .map((user) => user.username)
                .filter(isStringValue);
            const query = Object.assign({ departmentId, username: {
                    $in: botUsernames,
                } }, (ignoreAgentId && { agentId: { $ne: ignoreAgentId } }));
            const update = {
                $inc: {
                    count: 1,
                },
            };
            const sort = {
                count: 1,
                order: 1,
                username: 1,
            };
            const projection = {
                _id: 1,
                agentId: 1,
                departmentId: 1,
                username: 1,
            };
            const bot = yield this.findOneAndUpdate(query, update, { sort, projection, returnDocument: 'after' });
            return bot.value;
        });
    }
    replaceUsernameOfAgentByUserId(userId, username) {
        const query = { agentId: userId };
        const update = {
            $set: {
                username,
            },
        };
        return this.updateMany(query, update);
    }
    countByDepartmentId(departmentId) {
        return this.col.countDocuments({ departmentId });
    }
    disableAgentsByDepartmentId(departmentId) {
        return this.updateMany({ departmentId }, { $set: { departmentEnabled: false } });
    }
    enableAgentsByDepartmentId(departmentId) {
        return this.updateMany({ departmentId }, { $set: { departmentEnabled: true } });
    }
    findAllAgentsConnectedToListOfDepartments(departmentIds) {
        return this.col.distinct('agentId', { departmentId: { $in: departmentIds }, departmentEnabled: true });
    }
    findByAgentsAndDepartmentId(agentsIds, departmentId, options) {
        return this.find({ agentId: { $in: agentsIds }, departmentId }, options);
    }
    findDepartmentsOfAgent(agentId, enabled = false) {
        return this.col.aggregate([
            {
                $match: Object.assign({ agentId }, (enabled && { departmentEnabled: true })),
            },
            {
                $lookup: {
                    from: 'rocketchat_livechat_department',
                    localField: 'departmentId',
                    foreignField: '_id',
                    as: 'department',
                },
            },
            { $unwind: '$department' },
            {
                $project: {
                    _id: '$_id',
                    agentId: '$agentId',
                    departmentId: '$departmentId',
                    departmentName: '$department.name',
                    username: '$username',
                    count: '$count',
                    order: '$order',
                    departmentEnabled: '$departmentEnabled',
                    _updatedAt: '$_updatedAt',
                },
            },
        ]);
    }
}
exports.LivechatDepartmentAgentsRaw = LivechatDepartmentAgentsRaw;
const isStringValue = (value) => typeof value === 'string';
