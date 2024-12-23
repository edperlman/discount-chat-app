"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = exports.userHasAllPermission = exports.hasAtLeastOnePermission = exports.hasAllPermission = void 0;
const meteor_1 = require("meteor/meteor");
const Models = __importStar(require("../../models/client"));
const AuthorizationUtils_1 = require("../lib/AuthorizationUtils");
const isValidScope = (scope) => typeof scope === 'string' && scope in Models;
const hasIsUserInRole = (model) => typeof model === 'object' && model !== null && typeof model.isUserInRole === 'function';
const createPermissionValidator = (quantifier) => (permissionIds, scope, userId, scopedRoles) => {
    const user = Models.Users.findOneById(userId, { fields: { roles: 1 } });
    const checkEachPermission = quantifier.bind(permissionIds);
    return checkEachPermission((permissionId) => {
        var _a;
        if (user === null || user === void 0 ? void 0 : user.roles) {
            if (AuthorizationUtils_1.AuthorizationUtils.isPermissionRestrictedForRoleList(permissionId, user.roles)) {
                return false;
            }
        }
        const permission = Models.Permissions.findOne(permissionId, {
            fields: { roles: 1 },
        });
        const roles = (_a = permission === null || permission === void 0 ? void 0 : permission.roles) !== null && _a !== void 0 ? _a : [];
        return roles.some((roleId) => {
            const role = Models.Roles.findOne(roleId, { fields: { scope: 1 } });
            const roleScope = role === null || role === void 0 ? void 0 : role.scope;
            if (!isValidScope(roleScope)) {
                return false;
            }
            const model = Models[roleScope];
            if (scopedRoles === null || scopedRoles === void 0 ? void 0 : scopedRoles.includes(roleId)) {
                return true;
            }
            if (hasIsUserInRole(model)) {
                return model.isUserInRole(userId, roleId, scope);
            }
            return undefined;
        });
    });
};
const atLeastOne = createPermissionValidator(Array.prototype.some);
const all = createPermissionValidator(Array.prototype.every);
const validatePermissions = (permissions, scope, predicate, userId, scopedRoles) => {
    userId = userId !== null && userId !== void 0 ? userId : meteor_1.Meteor.userId();
    if (!userId) {
        return false;
    }
    if (!Models.AuthzCachedCollection.ready.get()) {
        return false;
    }
    return predicate([].concat(permissions), scope, userId, scopedRoles);
};
const hasAllPermission = (permissions, scope, scopedRoles) => validatePermissions(permissions, scope, all, undefined, scopedRoles);
exports.hasAllPermission = hasAllPermission;
const hasAtLeastOnePermission = (permissions, scope) => validatePermissions(permissions, scope, atLeastOne);
exports.hasAtLeastOnePermission = hasAtLeastOnePermission;
const userHasAllPermission = (permissions, scope, userId) => validatePermissions(permissions, scope, all, userId);
exports.userHasAllPermission = userHasAllPermission;
exports.hasPermission = exports.hasAllPermission;
