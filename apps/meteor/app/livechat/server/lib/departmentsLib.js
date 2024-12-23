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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDepartment = saveDepartment;
exports.archiveDepartment = archiveDepartment;
exports.unarchiveDepartment = unarchiveDepartment;
exports.saveDepartmentAgents = saveDepartmentAgents;
exports.setDepartmentForGuest = setDepartmentForGuest;
exports.removeDepartment = removeDepartment;
exports.getRequiredDepartment = getRequiredDepartment;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const Helper_1 = require("./Helper");
const isDepartmentCreationAvailable_1 = require("./isDepartmentCreationAvailable");
const logger_1 = require("./logger");
const callbacks_1 = require("../../../../lib/callbacks");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
/**
 * @param {string|null} _id - The department id
 * @param {Partial<import('@rocket.chat/core-typings').ILivechatDepartment>} departmentData
 * @param {{upsert?: { agentId: string; count?: number; order?: number; }[], remove?: { agentId: string; count?: number; order?: number; }}} [departmentAgents] - The department agents
 * @param {{_id?: string}} [departmentUnit] - The department's unit id
 */
function saveDepartment(userId, _id, departmentData, departmentAgents, departmentUnit) {
    return __awaiter(this, void 0, void 0, function* () {
        check(_id, Match.Maybe(String));
        if ((departmentUnit === null || departmentUnit === void 0 ? void 0 : departmentUnit._id) !== undefined && typeof departmentUnit._id !== 'string') {
            throw new meteor_1.Meteor.Error('error-invalid-department-unit', 'Invalid department unit id provided', {
                method: 'livechat:saveDepartment',
            });
        }
        const department = _id
            ? yield models_1.LivechatDepartment.findOneById(_id, { projection: { _id: 1, archived: 1, enabled: 1, parentId: 1 } })
            : null;
        if (departmentUnit && !departmentUnit._id && department && department.parentId) {
            const isLastDepartmentInUnit = (yield models_1.LivechatDepartment.countDepartmentsInUnit(department.parentId)) === 1;
            if (isLastDepartmentInUnit) {
                throw new meteor_1.Meteor.Error('error-unit-cant-be-empty', "The last department in a unit can't be removed", {
                    method: 'livechat:saveDepartment',
                });
            }
        }
        if (!department && !(yield (0, isDepartmentCreationAvailable_1.isDepartmentCreationAvailable)())) {
            throw new meteor_1.Meteor.Error('error-max-departments-number-reached', 'Maximum number of departments reached', {
                method: 'livechat:saveDepartment',
            });
        }
        if ((department === null || department === void 0 ? void 0 : department.archived) && departmentData.enabled) {
            throw new meteor_1.Meteor.Error('error-archived-department-cant-be-enabled', 'Archived departments cant be enabled', {
                method: 'livechat:saveDepartment',
            });
        }
        const defaultValidations = {
            enabled: Boolean,
            name: String,
            description: Match.Optional(String),
            showOnRegistration: Boolean,
            email: String,
            showOnOfflineForm: Boolean,
            requestTagBeforeClosingChat: Match.Optional(Boolean),
            chatClosingTags: Match.Optional([String]),
            fallbackForwardDepartment: Match.Optional(String),
            departmentsAllowedToForward: Match.Optional([String]),
            allowReceiveForwardOffline: Match.Optional(Boolean),
        };
        // The Livechat Form department support addition/custom fields, so those fields need to be added before validating
        Object.keys(departmentData).forEach((field) => {
            if (!defaultValidations.hasOwnProperty(field)) {
                defaultValidations[field] = Match.OneOf(String, Match.Integer, Boolean);
            }
        });
        check(departmentData, defaultValidations);
        check(departmentAgents, Match.Maybe({
            upsert: Match.Maybe(Array),
            remove: Match.Maybe(Array),
        }));
        const { requestTagBeforeClosingChat, chatClosingTags, fallbackForwardDepartment } = departmentData;
        if (requestTagBeforeClosingChat && (!chatClosingTags || chatClosingTags.length === 0)) {
            throw new meteor_1.Meteor.Error('error-validating-department-chat-closing-tags', 'At least one closing tag is required when the department requires tag(s) on closing conversations.', { method: 'livechat:saveDepartment' });
        }
        if (_id && !department) {
            throw new meteor_1.Meteor.Error('error-department-not-found', 'Department not found', {
                method: 'livechat:saveDepartment',
            });
        }
        if (fallbackForwardDepartment === _id) {
            throw new meteor_1.Meteor.Error('error-fallback-department-circular', 'Cannot save department. Circular reference between fallback department and department');
        }
        if (fallbackForwardDepartment) {
            const fallbackDep = yield models_1.LivechatDepartment.findOneById(fallbackForwardDepartment, {
                projection: { _id: 1, fallbackForwardDepartment: 1 },
            });
            if (!fallbackDep) {
                throw new meteor_1.Meteor.Error('error-fallback-department-not-found', 'Fallback department not found', {
                    method: 'livechat:saveDepartment',
                });
            }
        }
        const departmentDB = yield models_1.LivechatDepartment.createOrUpdateDepartment(_id, departmentData);
        if (departmentDB && departmentAgents) {
            yield (0, Helper_1.updateDepartmentAgents)(departmentDB._id, departmentAgents, departmentDB.enabled);
        }
        // Disable event
        if ((department === null || department === void 0 ? void 0 : department.enabled) && !(departmentDB === null || departmentDB === void 0 ? void 0 : departmentDB.enabled)) {
            yield callbacks_1.callbacks.run('livechat.afterDepartmentDisabled', departmentDB);
        }
        if (departmentUnit) {
            yield callbacks_1.callbacks.run('livechat.manageDepartmentUnit', { userId, departmentId: departmentDB._id, unitId: departmentUnit._id });
        }
        return departmentDB;
    });
}
function archiveDepartment(_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const department = yield models_1.LivechatDepartment.findOneById(_id, {
            projection: { _id: 1, businessHourId: 1 },
        });
        if (!department) {
            throw new Error('department-not-found');
        }
        yield Promise.all([models_1.LivechatDepartmentAgents.disableAgentsByDepartmentId(_id), models_1.LivechatDepartment.archiveDepartment(_id)]);
        void (0, notifyListener_1.notifyOnLivechatDepartmentAgentChangedByDepartmentId)(_id);
        yield callbacks_1.callbacks.run('livechat.afterDepartmentArchived', department);
    });
}
function unarchiveDepartment(_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const department = yield models_1.LivechatDepartment.findOneById(_id, { projection: { _id: 1 } });
        if (!department) {
            throw new meteor_1.Meteor.Error('department-not-found');
        }
        // TODO: these kind of actions should be on events instead of here
        yield Promise.all([models_1.LivechatDepartmentAgents.enableAgentsByDepartmentId(_id), models_1.LivechatDepartment.unarchiveDepartment(_id)]);
        void (0, notifyListener_1.notifyOnLivechatDepartmentAgentChangedByDepartmentId)(_id);
        return true;
    });
}
function saveDepartmentAgents(_id, departmentAgents) {
    return __awaiter(this, void 0, void 0, function* () {
        check(_id, String);
        check(departmentAgents, {
            upsert: Match.Maybe([
                Match.ObjectIncluding({
                    agentId: String,
                    username: String,
                    count: Match.Maybe(Match.Integer),
                    order: Match.Maybe(Match.Integer),
                }),
            ]),
            remove: Match.Maybe([
                Match.ObjectIncluding({
                    agentId: String,
                    username: Match.Maybe(String),
                    count: Match.Maybe(Match.Integer),
                    order: Match.Maybe(Match.Integer),
                }),
            ]),
        });
        const department = yield models_1.LivechatDepartment.findOneById(_id, { projection: { enabled: 1 } });
        if (!department) {
            throw new meteor_1.Meteor.Error('error-department-not-found', 'Department not found');
        }
        return (0, Helper_1.updateDepartmentAgents)(_id, departmentAgents, department.enabled);
    });
}
function setDepartmentForGuest(_a) {
    return __awaiter(this, arguments, void 0, function* ({ token, department }) {
        check(token, String);
        check(department, String);
        logger_1.livechatLogger.debug(`Switching departments for user with token ${token} (to ${department})`);
        const updateUser = {
            $set: {
                department,
            },
        };
        const dep = yield models_1.LivechatDepartment.findOneById(department, { projection: { _id: 1 } });
        if (!dep) {
            throw new meteor_1.Meteor.Error('invalid-department', 'Provided department does not exists');
        }
        const visitor = yield models_1.LivechatVisitors.getVisitorByToken(token, { projection: { _id: 1 } });
        if (!visitor) {
            throw new meteor_1.Meteor.Error('invalid-token', 'Provided token is invalid');
        }
        yield models_1.LivechatVisitors.updateById(visitor._id, updateUser);
    });
}
function removeDepartment(departmentId) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.livechatLogger.debug(`Removing department: ${departmentId}`);
        const department = yield models_1.LivechatDepartment.findOneById(departmentId, {
            projection: { _id: 1, businessHourId: 1, parentId: 1 },
        });
        if (!department) {
            throw new Error('error-department-not-found');
        }
        const { _id } = department;
        const ret = yield models_1.LivechatDepartment.removeById(_id);
        if (ret.acknowledged !== true) {
            throw new Error('error-failed-to-delete-department');
        }
        const removedAgents = yield models_1.LivechatDepartmentAgents.findByDepartmentId(department._id, { projection: { agentId: 1 } }).toArray();
        logger_1.livechatLogger.debug(`Performing post-department-removal actions: ${_id}. Removing department agents, unsetting fallback department and removing department from rooms`);
        const removeByDept = models_1.LivechatDepartmentAgents.removeByDepartmentId(_id);
        const promiseResponses = yield Promise.allSettled([
            removeByDept,
            models_1.LivechatDepartment.unsetFallbackDepartmentByDepartmentId(_id),
            models_1.LivechatRooms.bulkRemoveDepartmentAndUnitsFromRooms(_id),
        ]);
        promiseResponses.forEach((response, index) => {
            if (response.status === 'rejected') {
                logger_1.livechatLogger.error(`Error while performing post-department-removal actions: ${_id}. Action No: ${index}. Error:`, response.reason);
            }
        });
        const { deletedCount } = yield removeByDept;
        if (deletedCount > 0) {
            removedAgents.forEach(({ _id: docId, agentId }) => {
                void (0, notifyListener_1.notifyOnLivechatDepartmentAgentChanged)({
                    _id: docId,
                    agentId,
                    departmentId: _id,
                }, 'removed');
            });
        }
        yield callbacks_1.callbacks.run('livechat.afterRemoveDepartment', { department, agentsIds: removedAgents.map(({ agentId }) => agentId) });
        return ret;
    });
}
function getRequiredDepartment() {
    return __awaiter(this, arguments, void 0, function* (onlineRequired = true) {
        var _a, e_1, _b, _c;
        const departments = models_1.LivechatDepartment.findEnabledWithAgents();
        try {
            for (var _d = true, departments_1 = __asyncValues(departments), departments_1_1; departments_1_1 = yield departments_1.next(), _a = departments_1_1.done, !_a; _d = true) {
                _c = departments_1_1.value;
                _d = false;
                const dept = _c;
                if (!dept.showOnRegistration) {
                    continue;
                }
                if (!onlineRequired) {
                    return dept;
                }
                const onlineAgents = yield models_1.LivechatDepartmentAgents.countOnlineForDepartment(dept._id);
                if (onlineAgents) {
                    return dept;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = departments_1.return)) yield _b.call(departments_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
