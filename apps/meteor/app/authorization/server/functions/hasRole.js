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
exports.subscriptionHasRole = exports.hasRoleAsync = exports.hasAnyRoleAsync = void 0;
const models_1 = require("@rocket.chat/models");
const hasAnyRoleAsync = (userId, roleIds, scope) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Array.isArray(roleIds)) {
        throw new Error('error-invalid-arguments');
    }
    if (!userId || userId === '') {
        return false;
    }
    return models_1.Roles.isUserInRoles(userId, roleIds, scope);
});
exports.hasAnyRoleAsync = hasAnyRoleAsync;
const hasRoleAsync = (userId, roleId, scope) => __awaiter(void 0, void 0, void 0, function* () {
    if (Array.isArray(roleId)) {
        throw new Error('error-invalid-arguments');
    }
    return (0, exports.hasAnyRoleAsync)(userId, [roleId], scope);
});
exports.hasRoleAsync = hasRoleAsync;
const subscriptionHasRole = (sub, role) => { var _a; return (_a = sub.roles) === null || _a === void 0 ? void 0 : _a.includes(role); };
exports.subscriptionHasRole = subscriptionHasRole;
