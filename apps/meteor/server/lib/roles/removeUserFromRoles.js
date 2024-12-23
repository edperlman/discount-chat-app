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
exports.removeUserFromRolesAsync = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const validateRoleList_1 = require("./validateRoleList");
const removeUserFromRolesAsync = (userId, roleIds, scope) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || !roleIds) {
        return false;
    }
    const user = yield models_1.Users.findOneById(userId, { projection: { _id: 1 } });
    if (!user) {
        throw new core_services_1.MeteorError('error-invalid-user', 'Invalid user');
    }
    if (!(yield (0, validateRoleList_1.validateRoleList)(roleIds))) {
        throw new core_services_1.MeteorError('error-invalid-role', 'Invalid role');
    }
    yield models_1.Roles.removeUserRoles(userId, roleIds, scope);
    return true;
});
exports.removeUserFromRolesAsync = removeUserFromRolesAsync;
