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
const meteor_1 = require("meteor/meteor");
const deprecationWarningLogger_1 = require("../../../lib/server/lib/deprecationWarningLogger");
const server_1 = require("../../../settings/server");
const hasPermission_1 = require("../functions/hasPermission");
meteor_1.Meteor.methods({
    'authorization:removeUserFromRole'(roleId, username, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = meteor_1.Meteor.userId();
            if (!userId || !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'access-permissions'))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Access permissions is not allowed', {
                    method: 'authorization:removeUserFromRole',
                    action: 'Accessing_permissions',
                });
            }
            if (!roleId || typeof roleId.valueOf() !== 'string' || !username || typeof username.valueOf() !== 'string') {
                throw new meteor_1.Meteor.Error('error-invalid-arguments', 'Invalid arguments', {
                    method: 'authorization:removeUserFromRole',
                });
            }
            let role = yield models_1.Roles.findOneById(roleId, { projection: { _id: 1 } });
            if (!role) {
                role = yield models_1.Roles.findOneByName(roleId, { projection: { _id: 1 } });
                if (!role) {
                    throw new meteor_1.Meteor.Error('error-invalid-role', 'Invalid Role', {
                        method: 'authorization:removeUserFromRole',
                    });
                }
                deprecationWarningLogger_1.methodDeprecationLogger.deprecatedParameterUsage('authorization:removeUserFromRole', 'role', '7.0.0', ({ parameter, method, version }) => `Calling ${method} with ${parameter} names is deprecated and will be removed ${version}`);
            }
            const user = yield models_1.Users.findOneByUsernameIgnoringCase(username, {
                projection: {
                    _id: 1,
                    roles: 1,
                },
            });
            if (!(user === null || user === void 0 ? void 0 : user._id)) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'authorization:removeUserFromRole',
                });
            }
            // prevent removing last user from admin role
            if (role._id === 'admin') {
                const adminCount = yield models_1.Users.col.countDocuments({
                    roles: {
                        $in: ['admin'],
                    },
                });
                const userIsAdmin = ((_a = user.roles) === null || _a === void 0 ? void 0 : _a.indexOf('admin')) > -1;
                if (adminCount === 1 && userIsAdmin) {
                    throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Leaving the app without admins is not allowed', {
                        method: 'removeUserFromRole',
                        action: 'Remove_last_admin',
                    });
                }
            }
            const remove = yield models_1.Roles.removeUserRoles(user._id, [role._id], scope);
            const event = {
                type: 'removed',
                _id: role._id,
                u: {
                    _id: user._id,
                    username,
                },
                scope,
            };
            if (server_1.settings.get('UI_DisplayRoles')) {
                void core_services_1.api.broadcast('user.roleUpdate', event);
            }
            void core_services_1.api.broadcast('federation.userRoleChanged', Object.assign(Object.assign({}, event), { givenByUserId: userId }));
            return remove;
        });
    },
});
