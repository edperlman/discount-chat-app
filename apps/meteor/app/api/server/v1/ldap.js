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
const core_services_1 = require("@rocket.chat/core-services");
const check_1 = require("meteor/check");
const system_1 = require("../../../../server/lib/logger/system");
const server_1 = require("../../../settings/server");
const api_1 = require("../api");
api_1.API.v1.addRoute('ldap.testConnection', { authRequired: true, permissionsRequired: ['test-admin-options'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.userId) {
                throw new Error('error-invalid-user');
            }
            if (server_1.settings.get('LDAP_Enable') !== true) {
                throw new Error('LDAP_disabled');
            }
            try {
                yield core_services_1.LDAP.testConnection();
            }
            catch (error) {
                system_1.SystemLogger.error(error);
                throw new Error('Connection_failed');
            }
            return api_1.API.v1.success({
                message: 'LDAP_Connection_successful',
            });
        });
    },
});
api_1.API.v1.addRoute('ldap.testSearch', { authRequired: true, permissionsRequired: ['test-admin-options'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, check_1.Match.ObjectIncluding({
                username: String,
            }));
            if (!this.userId) {
                throw new Error('error-invalid-user');
            }
            if (server_1.settings.get('LDAP_Enable') !== true) {
                throw new Error('LDAP_disabled');
            }
            yield core_services_1.LDAP.testSearch(this.bodyParams.username);
            return api_1.API.v1.success({
                message: 'LDAP_User_Found',
            });
        });
    },
});
