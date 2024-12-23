"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAnyRole = exports.hasRole = void 0;
const client_1 = require("../../models/client");
const hasRole = (userId, roleId, scope, ignoreSubscriptions = false) => {
    if (Array.isArray(roleId)) {
        throw new Error('error-invalid-arguments');
    }
    return client_1.Roles.isUserInRoles(userId, [roleId], scope, ignoreSubscriptions);
};
exports.hasRole = hasRole;
const hasAnyRole = (userId, roleIds, scope, ignoreSubscriptions = false) => {
    if (!Array.isArray(roleIds)) {
        throw new Error('error-invalid-arguments');
    }
    return client_1.Roles.isUserInRoles(userId, roleIds, scope, ignoreSubscriptions);
};
exports.hasAnyRole = hasAnyRole;
