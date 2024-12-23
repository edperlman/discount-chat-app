"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRoleRestrictions = void 0;
const guestPermissions_1 = require("./guestPermissions");
const AuthorizationUtils_1 = require("../../../../app/authorization/lib/AuthorizationUtils");
const addRoleRestrictions = function () {
    AuthorizationUtils_1.AuthorizationUtils.addRolePermissionWhiteList('guest', guestPermissions_1.guestPermissions);
};
exports.addRoleRestrictions = addRoleRestrictions;
