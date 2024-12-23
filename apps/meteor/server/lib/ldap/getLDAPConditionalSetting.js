"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLDAPConditionalSetting = getLDAPConditionalSetting;
const server_1 = require("../../../app/settings/server");
function getLDAPConditionalSetting(settingName) {
    const isActiveDirectory = server_1.settings.get('LDAP_Server_Type') === 'ad';
    const key = isActiveDirectory ? settingName.replace('LDAP_', 'LDAP_AD_') : settingName;
    return server_1.settings.get(key);
}
