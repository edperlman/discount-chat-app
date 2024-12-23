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
const api_1 = require("../../../app/api/server/api");
const hasPermission_1 = require("../../../app/authorization/server/functions/hasPermission");
const server_1 = require("../../../app/settings/server");
const sdk_1 = require("../sdk");
api_1.API.v1.addRoute('ldap.syncNow', {
    authRequired: true,
    forceTwoFactorAuthenticationForNonEnterprise: true,
    twoFactorRequired: true,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.userId) {
                throw new Error('error-invalid-user');
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'sync-auth-services-users'))) {
                throw new Error('error-not-authorized');
            }
            if (server_1.settings.get('LDAP_Enable') !== true) {
                throw new Error('LDAP_disabled');
            }
            yield sdk_1.LDAPEE.sync();
            yield sdk_1.LDAPEE.syncAvatars();
            return api_1.API.v1.success({
                message: 'Sync_in_progress',
            });
        });
    },
});
