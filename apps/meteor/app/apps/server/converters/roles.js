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
exports.AppRolesConverter = void 0;
const models_1 = require("@rocket.chat/models");
const transformMappedData_1 = require("./transformMappedData");
class AppRolesConverter {
    convertById(roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = yield models_1.Roles.findOneById(roleId);
            if (!role) {
                return;
            }
            return this.convertRole(role);
        });
    }
    convertRole(role) {
        return __awaiter(this, void 0, void 0, function* () {
            const map = {
                id: '_id',
                name: 'name',
                description: 'description',
                mandatory2fa: 'mandatory2fa',
                protected: 'protected',
                scope: 'scope',
            };
            return (0, transformMappedData_1.transformMappedData)(role, map);
        });
    }
}
exports.AppRolesConverter = AppRolesConverter;
