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
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const getUsersInRole_1 = require("../../../authorization/server/functions/getUsersInRole");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const hasRole_1 = require("../../../authorization/server/functions/hasRole");
const deprecationWarningLogger_1 = require("../../../lib/server/lib/deprecationWarningLogger");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const index_1 = require("../../../settings/server/index");
const api_1 = require("../api");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
const getUserFromParams_1 = require("../helpers/getUserFromParams");
api_1.API.v1.addRoute('roles.list', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield models_1.Roles.find({}, { projection: { _updatedAt: 0 } }).toArray();
            return api_1.API.v1.success({ roles });
        });
    },
});
api_1.API.v1.addRoute('roles.sync', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                updatedSince: check_1.Match.Where((value) => typeof value === 'string' && !Number.isNaN(Date.parse(value))),
            }));
            const { updatedSince } = this.queryParams;
            return api_1.API.v1.success({
                roles: {
                    update: yield models_1.Roles.findByUpdatedDate(new Date(updatedSince)).toArray(),
                    remove: yield models_1.Roles.trashFindDeletedAfter(new Date(updatedSince)).toArray(),
                },
            });
        });
    },
});
api_1.API.v1.addRoute('roles.addUserToRole', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!(0, rest_typings_1.isRoleAddUserToRoleProps)(this.bodyParams)) {
                throw new meteor_1.Meteor.Error('error-invalid-role-properties', (_a = rest_typings_1.isRoleAddUserToRoleProps.errors) === null || _a === void 0 ? void 0 : _a.map((error) => error.message).join('\n'));
            }
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            const { roleId, roleName, roomId } = this.bodyParams;
            if (!roleId) {
                if (!roleName) {
                    return api_1.API.v1.failure('error-invalid-role-properties');
                }
                deprecationWarningLogger_1.apiDeprecationLogger.parameter(this.request.route, 'roleName', '7.0.0', this.response);
            }
            const role = roleId ? yield models_1.Roles.findOneById(roleId) : yield models_1.Roles.findOneByIdOrName(roleName);
            if (!role) {
                return api_1.API.v1.failure('error-role-not-found', 'Role not found');
            }
            if (yield (0, hasRole_1.hasRoleAsync)(user._id, role._id, roomId)) {
                throw new meteor_1.Meteor.Error('error-user-already-in-role', 'User already in role');
            }
            yield meteor_1.Meteor.callAsync('authorization:addUserToRole', role._id, user.username, roomId);
            return api_1.API.v1.success({
                role,
            });
        });
    },
});
api_1.API.v1.addRoute('roles.getUsersInRole', { authRequired: true, permissionsRequired: ['access-permissions'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, role } = this.queryParams;
            const { offset, count = 50 } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const projection = {
                name: 1,
                username: 1,
                emails: 1,
                avatarETag: 1,
                createdAt: 1,
                _updatedAt: 1,
            };
            if (!role) {
                throw new meteor_1.Meteor.Error('error-param-not-provided', 'Query param "role" is required');
            }
            if (roomId && !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-other-user-channels'))) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed');
            }
            const options = { projection: { _id: 1 } };
            let roleData = yield models_1.Roles.findOneById(role, options);
            if (!roleData) {
                roleData = yield models_1.Roles.findOneByName(role, options);
                if (!roleData) {
                    throw new meteor_1.Meteor.Error('error-invalid-roleId');
                }
                deprecationWarningLogger_1.apiDeprecationLogger.deprecatedParameterUsage(this.request.route, 'role', '7.0.0', this.response, ({ parameter, endpoint, version }) => `Querying \`${parameter}\` by name is deprecated in ${endpoint} and will be removed on the removed on version ${version}`);
            }
            const { cursor, totalCount } = yield (0, getUsersInRole_1.getUsersInRolePaginated)(roleData._id, roomId, {
                limit: count,
                sort: { username: 1 },
                skip: offset,
                projection,
            });
            const [users, total] = yield Promise.all([cursor.toArray(), totalCount]);
            return api_1.API.v1.success({ users, total });
        });
    },
});
api_1.API.v1.addRoute('roles.delete', { authRequired: true, permissionsRequired: ['access-permissions'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { bodyParams } = this;
            if (!(0, rest_typings_1.isRoleDeleteProps)(bodyParams)) {
                throw new meteor_1.Meteor.Error('error-invalid-role-properties', 'The role properties are invalid.');
            }
            const role = yield models_1.Roles.findOneByIdOrName(bodyParams.roleId);
            if (!role) {
                throw new meteor_1.Meteor.Error('error-invalid-roleId', 'This role does not exist');
            }
            if (role.protected) {
                throw new meteor_1.Meteor.Error('error-role-protected', 'Cannot delete a protected role');
            }
            if ((yield models_1.Roles.countUsersInRole(role._id)) > 0) {
                throw new meteor_1.Meteor.Error('error-role-in-use', "Cannot delete role because it's in use");
            }
            yield models_1.Roles.removeById(role._id);
            void (0, notifyListener_1.notifyOnRoleChanged)(role, 'removed');
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('roles.removeUserFromRole', { authRequired: true, permissionsRequired: ['access-permissions'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { bodyParams } = this;
            if (!(0, rest_typings_1.isRoleRemoveUserFromRoleProps)(bodyParams)) {
                throw new meteor_1.Meteor.Error('error-invalid-role-properties', 'The role properties are invalid.');
            }
            const { roleId, roleName, username, scope } = bodyParams;
            if (!roleId) {
                if (!roleName) {
                    return api_1.API.v1.failure('error-invalid-role-properties');
                }
                deprecationWarningLogger_1.apiDeprecationLogger.parameter(this.request.route, 'roleName', '7.0.0', this.response);
            }
            const user = yield models_1.Users.findOneByUsername(username);
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'There is no user with this username');
            }
            const role = roleId ? yield models_1.Roles.findOneById(roleId) : yield models_1.Roles.findOneByIdOrName(roleName);
            if (!role) {
                throw new meteor_1.Meteor.Error('error-invalid-roleId', 'This role does not exist');
            }
            if (!(yield (0, hasRole_1.hasAnyRoleAsync)(user._id, [role._id], scope))) {
                throw new meteor_1.Meteor.Error('error-user-not-in-role', 'User is not in this role');
            }
            if (role._id === 'admin') {
                const adminCount = yield models_1.Roles.countUsersInRole('admin');
                if (adminCount === 1) {
                    throw new meteor_1.Meteor.Error('error-admin-required', 'You need to have at least one admin');
                }
            }
            yield models_1.Roles.removeUserRoles(user._id, [role._id], scope);
            if (index_1.settings.get('UI_DisplayRoles')) {
                void core_services_1.api.broadcast('user.roleUpdate', {
                    type: 'removed',
                    _id: role._id,
                    u: {
                        _id: user._id,
                        username: user.username,
                    },
                    scope,
                });
            }
            return api_1.API.v1.success({
                role,
            });
        });
    },
});
