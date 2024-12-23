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
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const Utils_1 = require("../../../app/meteor-accounts-saml/server/lib/Utils");
const server_1 = require("../../../app/settings/server");
const arrayUtils_1 = require("../../../lib/utils/arrayUtils");
const saml_1 = require("../settings/saml");
await license_1.License.onLicense('saml-enterprise', () => {
    Utils_1.SAMLUtils.events.on('mapUser', (_a) => __awaiter(void 0, [_a], void 0, function* ({ profile, userObject }) {
        const roleAttributeName = server_1.settings.get('SAML_Custom_Default_role_attribute_name');
        const roleAttributeSync = server_1.settings.get('SAML_Custom_Default_role_attribute_sync');
        if (!roleAttributeSync) {
            return;
        }
        if (roleAttributeName && profile[roleAttributeName]) {
            let value = profile[roleAttributeName] || '';
            if (typeof value === 'string') {
                value = value.split(',');
            }
            const savedRoles = yield models_1.Roles.findInIdsOrNames((0, arrayUtils_1.ensureArray)(value)).toArray();
            userObject.roles = savedRoles.map((role) => role._id);
        }
    }));
    Utils_1.SAMLUtils.events.on('loadConfigs', (service, configs) => {
        // Include ee settings on the configs object so that they can be copied to the login service too
        Object.assign(configs, {
            customAuthnContext: server_1.settings.get(`${service}_custom_authn_context`),
            authnContextComparison: server_1.settings.get(`${service}_authn_context_comparison`),
            identifierFormat: server_1.settings.get(`${service}_identifier_format`),
            nameIDPolicyTemplate: server_1.settings.get(`${service}_NameId_template`),
            authnContextTemplate: server_1.settings.get(`${service}_AuthnContext_template`),
            authRequestTemplate: server_1.settings.get(`${service}_AuthRequest_template`),
            logoutResponseTemplate: server_1.settings.get(`${service}_LogoutResponse_template`),
            logoutRequestTemplate: server_1.settings.get(`${service}_LogoutRequest_template`),
            metadataCertificateTemplate: server_1.settings.get(`${service}_MetadataCertificate_template`),
            metadataTemplate: server_1.settings.get(`${service}_Metadata_template`),
        });
    });
    Utils_1.SAMLUtils.events.on('updateCustomFields', (loginResult, updatedUser) => __awaiter(void 0, void 0, void 0, function* () {
        const userDataCustomFieldMap = server_1.settings.get('SAML_Custom_Default_user_data_custom_fieldmap');
        const customMap = JSON.parse(userDataCustomFieldMap);
        const customFieldsList = {};
        for (const spCustomFieldName in customMap) {
            if (!customMap.hasOwnProperty(spCustomFieldName)) {
                continue;
            }
            const customAttribute = customMap[spCustomFieldName];
            const value = Utils_1.SAMLUtils.getProfileValue(loginResult.profile, {
                fieldName: spCustomFieldName,
            });
            customFieldsList[customAttribute] = value;
        }
        yield models_1.Users.updateCustomFieldsById(updatedUser.userId, customFieldsList);
    }));
});
// For setting creation we add the listener first because the event is emmited during startup
Utils_1.SAMLUtils.events.on('addSettings', (name) => license_1.License.onLicense('saml-enterprise', () => (0, saml_1.addSettings)(name)));
