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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const check_1 = require("meteor/check");
const server_1 = require("../../../../api/server");
const getPaginationItems_1 = require("../../../../api/server/helpers/getPaginationItems");
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
const departments_1 = require("../../../server/api/lib/departments");
const departmentsLib_1 = require("../../../server/lib/departmentsLib");
const isDepartmentCreationAvailable_1 = require("../../../server/lib/isDepartmentCreationAvailable");
server_1.API.v1.addRoute('livechat/department', {
    authRequired: true,
    validateParams: { GET: rest_typings_1.isGETLivechatDepartmentProps, POST: rest_typings_1.isPOSTLivechatDepartmentProps },
    permissionsRequired: {
        GET: { permissions: ['view-livechat-departments', 'view-l-room'], operation: 'hasAny' },
        POST: { permissions: ['manage-livechat-departments'], operation: 'hasAll' },
    },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const { text, enabled, onlyMyDepartments, excludeDepartmentId, showArchived } = this.queryParams;
            const { departments, total } = yield (0, departments_1.findDepartments)({
                userId: this.userId,
                text,
                enabled: enabled === 'true',
                showArchived: showArchived === 'true',
                onlyMyDepartments: onlyMyDepartments === 'true',
                excludeDepartmentId,
                pagination: {
                    offset,
                    count,
                    // IMO, sort type shouldn't be record, but a generic of the model we're trying to sort
                    // or the form { [k: keyof T]: number | string }
                    sort: sort,
                },
            });
            return server_1.API.v1.success({ departments, count: departments.length, offset, total });
        });
    },
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, {
                department: Object,
                agents: check_1.Match.Maybe(Array),
                departmentUnit: check_1.Match.Maybe({ _id: check_1.Match.Optional(String) }),
            });
            const agents = this.bodyParams.agents ? { upsert: this.bodyParams.agents } : {};
            const { departmentUnit } = this.bodyParams;
            const department = yield (0, departmentsLib_1.saveDepartment)(this.userId, null, this.bodyParams.department, agents, departmentUnit || {});
            if (department) {
                return server_1.API.v1.success({
                    department,
                    agents: yield models_1.LivechatDepartmentAgents.find({ departmentId: department._id }).toArray(),
                });
            }
            return server_1.API.v1.failure();
        });
    },
});
server_1.API.v1.addRoute('livechat/department/:_id', {
    authRequired: true,
    permissionsRequired: {
        GET: { permissions: ['view-livechat-departments', 'view-l-room'], operation: 'hasAny' },
        PUT: { permissions: ['manage-livechat-departments', 'add-livechat-department-agents'], operation: 'hasAny' },
        DELETE: { permissions: ['manage-livechat-departments', 'remove-livechat-department'], operation: 'hasAny' },
    },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.urlParams, {
                _id: String,
            });
            const { onlyMyDepartments } = this.queryParams;
            const { department, agents } = yield (0, departments_1.findDepartmentById)({
                userId: this.userId,
                departmentId: this.urlParams._id,
                includeAgents: this.queryParams.includeAgents && this.queryParams.includeAgents === 'true',
                onlyMyDepartments: onlyMyDepartments === 'true',
            });
            // TODO: return 404 when department is not found
            // Currently, FE relies on the fact that this endpoint returns an empty payload
            // to show the "new" view. Returning 404 breaks it
            return server_1.API.v1.success({ department, agents });
        });
    },
    put() {
        return __awaiter(this, void 0, void 0, function* () {
            const permissionToSave = yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-livechat-departments');
            const permissionToAddAgents = yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'add-livechat-department-agents');
            (0, check_1.check)(this.bodyParams, {
                department: Object,
                agents: check_1.Match.Maybe(Array),
                departmentUnit: check_1.Match.Maybe({ _id: check_1.Match.Optional(String) }),
            });
            const { _id } = this.urlParams;
            const { department, agents, departmentUnit } = this.bodyParams;
            if (!permissionToSave) {
                throw new Error('error-not-allowed');
            }
            const agentParam = permissionToAddAgents && agents ? { upsert: agents } : {};
            yield (0, departmentsLib_1.saveDepartment)(this.userId, _id, department, agentParam, departmentUnit || {});
            return server_1.API.v1.success({
                department: yield models_1.LivechatDepartment.findOneById(_id),
                agents: yield models_1.LivechatDepartmentAgents.findByDepartmentId(_id).toArray(),
            });
        });
    },
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.urlParams, {
                _id: String,
            });
            yield (0, departmentsLib_1.removeDepartment)(this.urlParams._id);
            return server_1.API.v1.success();
        });
    },
});
server_1.API.v1.addRoute('livechat/departments/archived', {
    authRequired: true,
    validateParams: { GET: rest_typings_1.isGETLivechatDepartmentProps },
    permissionsRequired: {
        GET: { permissions: ['view-livechat-departments', 'view-l-room'], operation: 'hasAny' },
    },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const { text, onlyMyDepartments, excludeDepartmentId } = this.queryParams;
            const { departments, total } = yield (0, departments_1.findArchivedDepartments)({
                userId: this.userId,
                text,
                onlyMyDepartments: onlyMyDepartments === 'true',
                excludeDepartmentId,
                pagination: {
                    offset,
                    count,
                    sort: sort,
                },
            });
            return server_1.API.v1.success({ departments, count: departments.length, offset, total });
        });
    },
});
server_1.API.v1.addRoute('livechat/department/:_id/archive', {
    authRequired: true,
    permissionsRequired: ['manage-livechat-departments'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, departmentsLib_1.archiveDepartment)(this.urlParams._id);
            return server_1.API.v1.success();
        });
    },
});
server_1.API.v1.addRoute('livechat/department/:_id/unarchive', {
    authRequired: true,
    permissionsRequired: ['manage-livechat-departments'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, departmentsLib_1.unarchiveDepartment)(this.urlParams._id);
            return server_1.API.v1.success();
        });
    },
});
server_1.API.v1.addRoute('livechat/department.autocomplete', { authRequired: true, permissionsRequired: { GET: { permissions: ['view-livechat-departments', 'view-l-room'], operation: 'hasAny' } } }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { selector, onlyMyDepartments, showArchived } = this.queryParams;
            if (!selector) {
                return server_1.API.v1.failure("The 'selector' param is required");
            }
            return server_1.API.v1.success(yield (0, departments_1.findDepartmentsToAutocomplete)({
                uid: this.userId,
                selector: JSON.parse(selector),
                onlyMyDepartments: onlyMyDepartments === 'true',
                showArchived: showArchived === 'true',
            }));
        });
    },
});
server_1.API.v1.addRoute('livechat/department/:_id/agents', {
    authRequired: true,
    permissionsRequired: {
        GET: { permissions: ['view-livechat-departments', 'view-l-room'], operation: 'hasAny' },
        POST: { permissions: ['manage-livechat-departments', 'add-livechat-department-agents'], operation: 'hasAny' },
    },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.urlParams, {
                _id: String,
            });
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const agents = yield (0, departments_1.findDepartmentAgents)({
                userId: this.userId,
                departmentId: this.urlParams._id,
                pagination: {
                    offset,
                    count,
                    sort,
                },
            });
            return server_1.API.v1.success(agents);
        });
    },
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, check_1.Match.ObjectIncluding({
                upsert: Array,
                remove: Array,
            }));
            yield (0, departmentsLib_1.saveDepartmentAgents)(this.urlParams._id, this.bodyParams);
            return server_1.API.v1.success();
        });
    },
});
server_1.API.v1.addRoute('livechat/department.listByIds', { authRequired: true, permissionsRequired: { GET: { permissions: ['view-livechat-departments', 'view-l-room'], operation: 'hasAny' } } }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { ids } = this.queryParams;
            const { fields } = yield this.parseJsonQuery();
            if (!ids) {
                return server_1.API.v1.failure("The 'ids' param is required");
            }
            if (!Array.isArray(ids)) {
                return server_1.API.v1.failure("The 'ids' param must be an array");
            }
            return server_1.API.v1.success(yield (0, departments_1.findDepartmentsBetweenIds)({
                ids,
                fields,
            }));
        });
    },
});
server_1.API.v1.addRoute('livechat/department/isDepartmentCreationAvailable', {
    authRequired: true,
    permissionsRequired: {
        GET: { permissions: ['view-livechat-departments', 'manage-livechat-departments'], operation: 'hasAny' },
    },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const available = yield (0, isDepartmentCreationAvailable_1.isDepartmentCreationAvailable)();
            return server_1.API.v1.success({ isDepartmentCreationAvailable: available });
        });
    },
});
