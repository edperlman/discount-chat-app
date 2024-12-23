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
exports.syncUserRoles = syncUserRoles;
const core_services_1 = require("@rocket.chat/core-services");
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../app/settings/server");
const addUserRoles_1 = require("../../../server/lib/roles/addUserRoles");
const removeUserFromRoles_1 = require("../../../server/lib/roles/removeUserFromRoles");
function filterRoleList(roleList, rolesToFilterOut, rolesToFilterIn) {
    const filteredRoles = roleList.filter((roleId) => !rolesToFilterOut.includes(roleId));
    if (!rolesToFilterIn) {
        return filteredRoles;
    }
    return filteredRoles.filter((roleId) => rolesToFilterIn.includes(roleId));
}
function broadcastRoleChange(type, roleList, user) {
    if (!server_1.settings.get('UI_DisplayRoles')) {
        return;
    }
    const { _id, username } = user;
    for (const roleId of roleList) {
        void core_services_1.api.broadcast('user.roleUpdate', {
            type,
            _id: roleId,
            u: {
                _id,
                username,
            },
        });
    }
}
function syncUserRoles(uid_1, newRoleList_1, _a) {
    return __awaiter(this, arguments, void 0, function* (uid, newRoleList, { allowedRoles, skipRemovingRoles, scope }) {
        const user = yield models_1.Users.findOneById(uid, { projection: { username: 1, roles: 1 } });
        if (!user) {
            throw new Error('error-user-not-found');
        }
        const existingRoles = user.roles;
        const rolesToAdd = filterRoleList(newRoleList, existingRoles, allowedRoles);
        const rolesToRemove = filterRoleList(existingRoles, newRoleList, allowedRoles);
        if (!rolesToAdd.length && !rolesToRemove.length) {
            return;
        }
        const wasGuest = existingRoles.length === 1 && existingRoles[0] === 'guest';
        if (wasGuest && (yield license_1.License.shouldPreventAction('activeUsers'))) {
            throw new Error('error-license-user-limit-reached');
        }
        if (rolesToAdd.length && (yield (0, addUserRoles_1.addUserRolesAsync)(uid, rolesToAdd, scope))) {
            broadcastRoleChange('added', rolesToAdd, user);
        }
        if (skipRemovingRoles || !rolesToRemove.length) {
            return;
        }
        if (yield (0, removeUserFromRoles_1.removeUserFromRolesAsync)(uid, rolesToRemove, scope)) {
            broadcastRoleChange('removed', rolesToRemove, user);
        }
    });
}
