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
exports.insertRoleAsync = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const notifyListener_1 = require("../../../../app/lib/server/lib/notifyListener");
const isValidRoleScope_1 = require("../../../../lib/roles/isValidRoleScope");
const insertRoleAsync = (roleData_1, ...args_1) => __awaiter(void 0, [roleData_1, ...args_1], void 0, function* (roleData, options = {}) {
    const { name, scope, description, mandatory2fa } = roleData;
    if (yield models_1.Roles.findOneByName(name)) {
        throw new core_services_1.MeteorError('error-duplicate-role-names-not-allowed', 'Role name already exists');
    }
    if (!(0, isValidRoleScope_1.isValidRoleScope)(scope)) {
        throw new core_services_1.MeteorError('error-invalid-scope', 'Invalid scope');
    }
    const role = yield models_1.Roles.createWithRandomId(name, scope, description, false, mandatory2fa);
    void (0, notifyListener_1.notifyOnRoleChanged)(role);
    if (options.broadcastUpdate) {
        void core_services_1.api.broadcast('user.roleUpdate', {
            type: 'changed',
            _id: role._id,
        });
    }
    return role;
});
exports.insertRoleAsync = insertRoleAsync;
