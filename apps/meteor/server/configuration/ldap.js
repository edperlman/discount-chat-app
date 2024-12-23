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
exports.configureLDAP = configureLDAP;
const core_services_1 = require("@rocket.chat/core-services");
const accounts_base_1 = require("meteor/accounts-base");
const server_1 = require("../../app/settings/server");
const callbacks_1 = require("../../lib/callbacks");
function configureLDAP() {
    return __awaiter(this, void 0, void 0, function* () {
        // Register ldap login handler
        accounts_base_1.Accounts.registerLoginHandler('ldap', (loginRequest) => __awaiter(this, void 0, void 0, function* () {
            if (!loginRequest.ldap || !loginRequest.ldapOptions) {
                return undefined;
            }
            return core_services_1.LDAP.loginRequest(loginRequest.username, loginRequest.ldapPass);
        }));
        // Prevent password logins by LDAP users when LDAP is enabled
        let ldapEnabled;
        server_1.settings.watch('LDAP_Enable', (value) => {
            if (ldapEnabled === value) {
                return;
            }
            ldapEnabled = value;
            if (!value) {
                return callbacks_1.callbacks.remove('beforeValidateLogin', 'validateLdapLoginFallback');
            }
            callbacks_1.callbacks.add('beforeValidateLogin', (login) => {
                var _a, _b, _c;
                if (!login.allowed) {
                    return login;
                }
                // The fallback setting should only block password logins, so users that have other login services can continue using them
                if (login.type !== 'password') {
                    return login;
                }
                // LDAP users can still login locally when login fallback is enabled
                if ((_b = (_a = login.user.services) === null || _a === void 0 ? void 0 : _a.ldap) === null || _b === void 0 ? void 0 : _b.id) {
                    login.allowed = (_c = server_1.settings.get('LDAP_Login_Fallback')) !== null && _c !== void 0 ? _c : false;
                }
                return login;
            }, callbacks_1.callbacks.priority.MEDIUM, 'validateLdapLoginFallback');
        });
    });
}
