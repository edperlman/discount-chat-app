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
exports.updateRole = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const notifyListener_1 = require("../../../../app/lib/server/lib/notifyListener");
const isValidRoleScope_1 = require("../../../../lib/roles/isValidRoleScope");
const updateRole = (roleId_1, roleData_1, ...args_1) => __awaiter(void 0, [roleId_1, roleData_1, ...args_1], void 0, function* (roleId, roleData, options = {}) {
    const role = yield models_1.Roles.findOneById(roleId);
    if (!role) {
        throw new core_services_1.MeteorError('error-invalid-roleId', 'This role does not exist');
    }
    if (role.protected && ((roleData.name && roleData.name !== role.name) || (roleData.scope && roleData.scope !== role.scope))) {
        throw new core_services_1.MeteorError('error-role-protected', 'Role is protected');
    }
    if (roleData.name) {
        const otherRole = yield models_1.Roles.findOneByName(roleData.name, { projection: { _id: 1 } });
        if (otherRole && otherRole._id !== role._id) {
            throw new core_services_1.MeteorError('error-duplicate-role-names-not-allowed', 'Role name already exists');
        }
    }
    else {
        roleData.name = role.name;
    }
    if (roleData.scope) {
        if (!(0, isValidRoleScope_1.isValidRoleScope)(roleData.scope)) {
            throw new core_services_1.MeteorError('error-invalid-scope', 'Invalid scope');
        }
    }
    else {
        roleData.scope = role.scope;
    }
    yield models_1.Roles.updateById(roleId, roleData.name, roleData.scope, roleData.description, roleData.mandatory2fa);
    void (0, notifyListener_1.notifyOnRoleChangedById)(roleId);
    if (options.broadcastUpdate) {
        void core_services_1.api.broadcast('user.roleUpdate', {
            type: 'changed',
            _id: roleId,
            scope: roleData.scope,
        });
    }
    const updatedRole = yield models_1.Roles.findOneById(roleId);
    if (!updatedRole) {
        throw new core_services_1.MeteorError('error-role-not-found', 'Role not found');
    }
    return updatedRole;
});
exports.updateRole = updateRole;
