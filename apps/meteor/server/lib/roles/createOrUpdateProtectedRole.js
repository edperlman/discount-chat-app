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
exports.createOrUpdateProtectedRoleAsync = void 0;
const models_1 = require("@rocket.chat/models");
const createOrUpdateProtectedRoleAsync = (roleId, roleData) => __awaiter(void 0, void 0, void 0, function* () {
    const role = yield models_1.Roles.findOneById(roleId, {
        projection: { name: 1, scope: 1, description: 1, mandatory2fa: 1 },
    });
    if (role) {
        yield models_1.Roles.updateById(roleId, roleData.name || role.name, roleData.scope || role.scope, roleData.description || role.description, roleData.mandatory2fa || role.mandatory2fa);
        return;
    }
    yield models_1.Roles.insertOne(Object.assign(Object.assign({ _id: roleId, scope: 'Users', description: '', mandatory2fa: false }, roleData), { protected: true }));
});
exports.createOrUpdateProtectedRoleAsync = createOrUpdateProtectedRoleAsync;
