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
exports.addUserRolesAsync = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const validateRoleList_1 = require("./validateRoleList");
const addUserRolesAsync = (userId, roleIds, scope) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId || !(roleIds === null || roleIds === void 0 ? void 0 : roleIds.length)) {
        return false;
    }
    if (!(yield (0, validateRoleList_1.validateRoleList)(roleIds))) {
        throw new core_services_1.MeteorError('error-invalid-role', 'Invalid role');
    }
    yield models_1.Roles.addUserRoles(userId, roleIds, scope);
    return true;
});
exports.addUserRolesAsync = addUserRolesAsync;
