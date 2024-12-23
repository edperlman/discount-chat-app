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
exports.hasAtLeastOnePermissionAsync = exports.hasPermissionAsync = exports.hasAllPermissionAsync = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const hasAllPermissionAsync = (userId, permissions, scope) => __awaiter(void 0, void 0, void 0, function* () { return core_services_1.Authorization.hasAllPermission(userId, permissions, scope); });
exports.hasAllPermissionAsync = hasAllPermissionAsync;
const hasPermissionAsync = (userId, permissionId, scope) => __awaiter(void 0, void 0, void 0, function* () { return core_services_1.Authorization.hasPermission(userId, permissionId, scope); });
exports.hasPermissionAsync = hasPermissionAsync;
const hasAtLeastOnePermissionAsync = (userId, permissions, scope) => __awaiter(void 0, void 0, void 0, function* () { return core_services_1.Authorization.hasAtLeastOnePermission(userId, permissions, scope); });
exports.hasAtLeastOnePermissionAsync = hasAtLeastOnePermissionAsync;
