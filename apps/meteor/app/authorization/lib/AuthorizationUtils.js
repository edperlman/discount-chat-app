"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationUtils = void 0;
const restrictedRolePermissions = new Map();
const AuthorizationUtils = class {
    static addRolePermissionWhiteList(roleId, list) {
        if (!roleId) {
            throw new Error('invalid-param');
        }
        if (!list) {
            throw new Error('invalid-param');
        }
        if (!restrictedRolePermissions.has(roleId)) {
            restrictedRolePermissions.set(roleId, new Set());
        }
        const rules = restrictedRolePermissions.get(roleId);
        for (const permissionId of list) {
            rules.add(permissionId);
        }
    }
    static isPermissionRestrictedForRole(permissionId, roleId) {
        if (!roleId || !permissionId) {
            throw new Error('invalid-param');
        }
        if (!restrictedRolePermissions.has(roleId)) {
            return false;
        }
        const rules = restrictedRolePermissions.get(roleId);
        if (!(rules === null || rules === void 0 ? void 0 : rules.size)) {
            return false;
        }
        return !rules.has(permissionId);
    }
    static isPermissionRestrictedForRoleList(permissionId, roleList) {
        if (!roleList || !permissionId) {
            throw new Error('invalid-param');
        }
        for (const roleId of roleList) {
            if (this.isPermissionRestrictedForRole(permissionId, roleId)) {
                return true;
            }
        }
        return false;
    }
};
exports.AuthorizationUtils = AuthorizationUtils;
