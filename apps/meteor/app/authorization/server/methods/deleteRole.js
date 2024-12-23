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
const meteor_1 = require("meteor/meteor");
const deprecationWarningLogger_1 = require("../../../lib/server/lib/deprecationWarningLogger");
const hasPermission_1 = require("../functions/hasPermission");
meteor_1.Meteor.methods({
    'authorization:deleteRole'(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            if (!userId || !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'access-permissions'))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Accessing permissions is not allowed', {
                    method: 'authorization:deleteRole',
                    action: 'Accessing_permissions',
                });
            }
            const options = {
                projection: {
                    _id: 1,
                    protected: 1,
                },
            };
            let role = yield models_1.Roles.findOneById(roleId, options);
            if (!role) {
                role = yield models_1.Roles.findOneByName(roleId, options);
                if (!role) {
                    throw new meteor_1.Meteor.Error('error-invalid-role', 'Invalid role', {
                        method: 'authorization:deleteRole',
                    });
                }
                deprecationWarningLogger_1.methodDeprecationLogger.deprecatedParameterUsage('authorization:deleteRole', 'role', '7.0.0', ({ parameter, method, version }) => `Calling ${method} with ${parameter} names is deprecated and will be removed ${version}`);
            }
            if (role.protected) {
                throw new meteor_1.Meteor.Error('error-delete-protected-role', 'Cannot delete a protected role', {
                    method: 'authorization:deleteRole',
                });
            }
            const users = yield models_1.Roles.countUsersInRole(role._id);
            if (users > 0) {
                throw new meteor_1.Meteor.Error('error-role-in-use', "Cannot delete role because it's in use", {
                    method: 'authorization:deleteRole',
                });
            }
            return models_1.Roles.removeById(role._id);
        });
    },
});
