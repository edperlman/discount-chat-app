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
    'authorization:addUserToRole'(roleId, username, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId || !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'access-permissions'))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Accessing permissions is not allowed', {
                    method: 'authorization:addUserToRole',
                    action: 'Accessing_permissions',
                });
            }
            if (!roleId || typeof roleId.valueOf() !== 'string' || !username || typeof username.valueOf() !== 'string') {
                throw new meteor_1.Meteor.Error('error-invalid-arguments', 'Invalid arguments', {
                    method: 'authorization:addUserToRole',
                });
            }
            let role = yield models_1.Roles.findOneById(roleId, { projection: { _id: 1 } });
            if (!role) {
                role = yield models_1.Roles.findOneByName(roleId, { projection: { _id: 1 } });
                if (!role) {
                    throw new meteor_1.Meteor.Error('error-invalid-role', 'Invalid Role', {
                        method: 'authorization:addUserToRole',
                    });
                }
                deprecationWarningLogger_1.methodDeprecationLogger.deprecatedParameterUsage('authorization:addUserToRole', 'role', '7.0.0', ({ parameter, method, version }) => `Calling ${method} with \`${parameter}\` names is deprecated and will be removed ${version}`);
            }
            if (role._id === 'admin' && !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'assign-admin-role'))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Assigning admin is not allowed', {
                    method: 'authorization:addUserToRole',
                    action: 'Assign_admin',
                });
            }
            const user = yield models_1.Users.findOneByUsernameIgnoringCase(username, {
                projection: {
                    _id: 1,
                },
            });
            if (!(user === null || user === void 0 ? void 0 : user._id)) {
                throw new meteor_1.Meteor.Error('error-user-not-found', 'User not found', {
                    method: 'authorization:addUserToRole',
                });
            }
            // verify if user can be added to given scope
            if (scope && !(yield models_1.Roles.canAddUserToRole(user._id, role._id, scope))) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'User is not part of given room', {
                    method: 'authorization:addUserToRole',
                });
            }
            const add = yield models_1.Roles.addUserRoles(user._id, [role._id], scope);
            if (server_1.settings.get('UI_DisplayRoles')) {
                void core_services_1.api.broadcast('user.roleUpdate', {
                    type: 'added',
                    _id: role._id,
                    u: {
                        _id: user._id,
                        username,
                    },
                    scope,
                });
            }
            return add;
        });
    },
});
