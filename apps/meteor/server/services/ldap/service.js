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
exports.LDAPService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const Manager_1 = require("../../lib/ldap/Manager");
class LDAPService extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'ldap';
    }
    loginRequest(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return Manager_1.LDAPManager.login(username, password);
        });
    }
    loginAuthenticatedUserRequest(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return Manager_1.LDAPManager.loginAuthenticatedUser(username);
        });
    }
    testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return Manager_1.LDAPManager.testConnection();
        });
    }
    testSearch(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return Manager_1.LDAPManager.testSearch(username);
        });
    }
}
exports.LDAPService = LDAPService;
