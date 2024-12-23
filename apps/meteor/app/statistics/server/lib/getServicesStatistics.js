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
exports.getServicesStatistics = getServicesStatistics;
const models_1 = require("@rocket.chat/models");
const mongo_1 = require("meteor/mongo");
const readSecondaryPreferred_1 = require("../../../../server/database/readSecondaryPreferred");
const server_1 = require("../../../settings/server");
const { db } = mongo_1.MongoInternals.defaultRemoteCollectionDriver().mongo;
function getCustomOAuthServices() {
    return __awaiter(this, void 0, void 0, function* () {
        const readPreference = (0, readSecondaryPreferred_1.readSecondaryPreferred)(db);
        const customOauth = server_1.settings.getByRegexp(/Accounts_OAuth_Custom-[^-]+$/im);
        return Object.fromEntries(yield Promise.all(Object.entries(customOauth).map((_a) => __awaiter(this, [_a], void 0, function* ([key, value]) {
            const name = key.replace('Accounts_OAuth_Custom-', '');
            return [
                name,
                {
                    enabled: Boolean(value),
                    mergeRoles: server_1.settings.get(`Accounts_OAuth_Custom-${name}-merge_roles`),
                    users: yield models_1.Users.countActiveUsersByService(name, { readPreference }),
                    mapChannels: server_1.settings.get(`Accounts_OAuth_Custom-${name}-map_channels`),
                    rolesToSync: !!server_1.settings.get(`Accounts_OAuth_Custom-${name}-roles_to_sync`),
                },
            ];
        }))));
    });
}
function getServicesStatistics() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const readPreference = (0, readSecondaryPreferred_1.readSecondaryPreferred)(db);
        return {
            ldap: {
                users: yield models_1.Users.countActiveUsersByService('ldap', { readPreference }),
                enabled: server_1.settings.get('LDAP_Enable'),
                loginFallback: server_1.settings.get('LDAP_Login_Fallback'),
                encryption: server_1.settings.get('LDAP_Encryption'),
                mergeUsers: server_1.settings.get('LDAP_Merge_Existing_Users'),
                syncRoles: server_1.settings.get('LDAP_Sync_User_Data_Roles'),
                syncRolesAutoRemove: server_1.settings.get('LDAP_Sync_User_Data_Roles_AutoRemove'),
                syncData: server_1.settings.get('LDAP_Sync_Custom_Fields'),
                syncChannels: server_1.settings.get('LDAP_Sync_User_Data_Channels'),
                syncAvatar: server_1.settings.get('LDAP_Sync_User_Avatar'),
                groupFilter: server_1.settings.get('LDAP_Group_Filter_Enable'),
                backgroundSync: {
                    enabled: server_1.settings.get('LDAP_Background_Sync'),
                    interval: server_1.settings.get('LDAP_Background_Sync_Interval'),
                    newUsers: server_1.settings.get('LDAP_Background_Sync_Import_New_Users'),
                    existingUsers: server_1.settings.get('LDAP_Background_Sync_Keep_Existant_Users_Updated'),
                },
                ee: {
                    syncActiveState: server_1.settings.get('LDAP_Sync_User_Active_State'),
                    syncTeams: server_1.settings.get('LDAP_Enable_LDAP_Groups_To_RC_Teams'),
                    syncRoles: server_1.settings.get('LDAP_Sync_User_Data_Roles'),
                },
            },
            saml: {
                enabled: server_1.settings.get('SAML_Custom_Default'),
                users: yield models_1.Users.countActiveUsersByService('saml', { readPreference }),
                signatureValidationType: server_1.settings.get('SAML_Custom_Default_signature_validation_type'),
                generateUsername: server_1.settings.get('SAML_Custom_Default_generate_username'),
                updateSubscriptionsOnLogin: server_1.settings.get('SAML_Custom_Default_channels_update'),
                syncRoles: server_1.settings.get('SAML_Custom_Default_role_attribute_sync'),
                userDataCustomFieldMap: !(((_a = server_1.settings.getSetting('SAML_Custom_Default_user_data_custom_fieldmap')) === null || _a === void 0 ? void 0 : _a.packageValue) ===
                    ((_b = server_1.settings.getSetting('SAML_Custom_Default_user_data_custom_fieldmap')) === null || _b === void 0 ? void 0 : _b.value)),
            },
            cas: {
                enabled: server_1.settings.get('CAS_enabled'),
                users: yield models_1.Users.countActiveUsersByService('cas', { readPreference }),
                allowUserCreation: server_1.settings.get('CAS_Creation_User_Enabled'),
                alwaysSyncUserData: server_1.settings.get('CAS_Sync_User_Data_Enabled'),
            },
            oauth: {
                apple: {
                    enabled: server_1.settings.get('Accounts_OAuth_Apple'),
                    users: yield models_1.Users.countActiveUsersByService('apple', { readPreference }),
                },
                dolphin: {
                    enabled: server_1.settings.get('Accounts_OAuth_Dolphin'),
                    users: yield models_1.Users.countActiveUsersByService('dolphin', { readPreference }),
                },
                drupal: {
                    enabled: server_1.settings.get('Accounts_OAuth_Drupal'),
                    users: yield models_1.Users.countActiveUsersByService('drupal', { readPreference }),
                },
                facebook: {
                    enabled: server_1.settings.get('Accounts_OAuth_Facebook'),
                    users: yield models_1.Users.countActiveUsersByService('facebook', { readPreference }),
                },
                github: {
                    enabled: server_1.settings.get('Accounts_OAuth_Github'),
                    users: yield models_1.Users.countActiveUsersByService('github', { readPreference }),
                },
                githubEnterprise: {
                    enabled: server_1.settings.get('Accounts_OAuth_GitHub_Enterprise'),
                    users: yield models_1.Users.countActiveUsersByService('github_enterprise', { readPreference }),
                },
                gitlab: {
                    enabled: server_1.settings.get('Accounts_OAuth_Gitlab'),
                    users: yield models_1.Users.countActiveUsersByService('gitlab', { readPreference }),
                },
                google: {
                    enabled: server_1.settings.get('Accounts_OAuth_Google'),
                    users: yield models_1.Users.countActiveUsersByService('google', { readPreference }),
                },
                linkedin: {
                    enabled: server_1.settings.get('Accounts_OAuth_Linkedin'),
                    users: yield models_1.Users.countActiveUsersByService('linkedin', { readPreference }),
                },
                meteor: {
                    enabled: server_1.settings.get('Accounts_OAuth_Meteor'),
                    users: yield models_1.Users.countActiveUsersByService('meteor', { readPreference }),
                },
                nextcloud: {
                    enabled: server_1.settings.get('Accounts_OAuth_Nextcloud'),
                    users: yield models_1.Users.countActiveUsersByService('nextcloud', { readPreference }),
                },
                tokenpass: {
                    enabled: server_1.settings.get('Accounts_OAuth_Tokenpass'),
                    users: yield models_1.Users.countActiveUsersByService('tokenpass', { readPreference }),
                },
                twitter: {
                    enabled: server_1.settings.get('Accounts_OAuth_Twitter'),
                    users: yield models_1.Users.countActiveUsersByService('twitter', { readPreference }),
                },
                wordpress: {
                    enabled: server_1.settings.get('Accounts_OAuth_Wordpress'),
                    users: yield models_1.Users.countActiveUsersByService('wordpress', { readPreference }),
                },
                custom: yield getCustomOAuthServices(),
            },
        };
    });
}
