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
exports.findDepartments = findDepartments;
exports.findArchivedDepartments = findArchivedDepartments;
exports.findDepartmentById = findDepartmentById;
exports.findDepartmentsToAutocomplete = findDepartmentsToAutocomplete;
exports.findDepartmentAgents = findDepartmentAgents;
exports.findDepartmentsBetweenIds = findDepartmentsBetweenIds;
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const callbacks_1 = require("../../../../../lib/callbacks");
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
function findDepartments(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, onlyMyDepartments = false, text, enabled, excludeDepartmentId, showArchived = false, pagination: { offset, count, sort }, }) {
        let query = Object.assign(Object.assign(Object.assign(Object.assign({ $or: [{ type: { $eq: 'd' } }, { type: { $exists: false } }] }, (!showArchived && { archived: { $ne: !showArchived } })), (enabled && { enabled: Boolean(enabled) })), (text && { name: new RegExp((0, string_helpers_1.escapeRegExp)(text), 'i') })), (excludeDepartmentId && { _id: { $ne: excludeDepartmentId } }));
        if (onlyMyDepartments) {
            query = yield callbacks_1.callbacks.run('livechat.applyDepartmentRestrictions', query, { userId });
        }
        const { cursor, totalCount } = models_1.LivechatDepartment.findPaginated(query, {
            sort: sort || { name: 1 },
            skip: offset,
            limit: count,
        });
        const [departments, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            departments,
            count: departments.length,
            offset,
            total,
        };
    });
}
function findArchivedDepartments(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, onlyMyDepartments = false, text, excludeDepartmentId, pagination: { offset, count, sort }, }) {
        let query = Object.assign(Object.assign({ $or: [{ type: { $eq: 'd' } }, { type: { $exists: false } }], archived: { $eq: true } }, (text && { name: new RegExp((0, string_helpers_1.escapeRegExp)(text), 'i') })), (excludeDepartmentId && { _id: { $ne: excludeDepartmentId } }));
        if (onlyMyDepartments) {
            query = yield callbacks_1.callbacks.run('livechat.applyDepartmentRestrictions', query, { userId });
        }
        const { cursor, totalCount } = models_1.LivechatDepartment.findPaginated(query, {
            sort: sort || { name: 1 },
            skip: offset,
            limit: count,
        });
        const [departments, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            departments,
            count: departments.length,
            offset,
            total,
        };
    });
}
function findDepartmentById(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, departmentId, includeAgents = true, onlyMyDepartments = false, }) {
        const canViewLivechatDepartments = includeAgents && (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-livechat-departments'));
        let query = { _id: departmentId };
        if (onlyMyDepartments) {
            query = yield callbacks_1.callbacks.run('livechat.applyDepartmentRestrictions', query, { userId });
        }
        const result = Object.assign({ department: yield models_1.LivechatDepartment.findOne(query) }, (includeAgents &&
            canViewLivechatDepartments && {
            agents: yield models_1.LivechatDepartmentAgents.findByDepartmentId(departmentId).toArray(),
        }));
        return result;
    });
}
function findDepartmentsToAutocomplete(_a) {
    return __awaiter(this, arguments, void 0, function* ({ uid, selector, onlyMyDepartments = false, showArchived = false, }) {
        const { exceptions = [] } = selector;
        let { conditions = {} } = selector;
        if (onlyMyDepartments) {
            conditions = yield callbacks_1.callbacks.run('livechat.applyDepartmentRestrictions', conditions, { userId: uid });
        }
        const conditionsWithArchived = Object.assign({ archived: { $ne: !showArchived } }, conditions);
        const items = yield models_1.LivechatDepartment.findByNameRegexWithExceptionsAndConditions(selector.term, exceptions, conditionsWithArchived, {
            projection: {
                _id: 1,
                name: 1,
            },
            sort: {
                name: 1,
            },
        }).toArray();
        return {
            items,
        };
    });
}
function findDepartmentAgents(_a) {
    return __awaiter(this, arguments, void 0, function* ({ departmentId, pagination: { offset, count, sort }, }) {
        const { cursor, totalCount } = models_1.LivechatDepartmentAgents.findAgentsByDepartmentId(departmentId, {
            sort: sort || { username: 1 },
            skip: offset,
            limit: count,
        });
        const [agents, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            agents,
            count: agents.length,
            offset,
            total,
        };
    });
}
function findDepartmentsBetweenIds(_a) {
    return __awaiter(this, arguments, void 0, function* ({ ids, fields, }) {
        const departments = yield models_1.LivechatDepartment.findInIds(ids, { projection: fields }).toArray();
        return { departments };
    });
}
