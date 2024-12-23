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
exports.createLdapSettings = void 0;
const server_1 = require("../../app/settings/server");
const createLdapSettings = () => server_1.settingsRegistry.addGroup('LDAP', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const enableQuery = { _id: 'LDAP_Enable', value: true };
        const adOnly = { _id: 'LDAP_Server_Type', value: 'ad' };
        const ldapOnly = { _id: 'LDAP_Server_Type', value: '' };
        yield this.with({ tab: 'LDAP_Connection' }, function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('LDAP_Enable', false, { type: 'boolean', public: true });
                yield this.add('LDAP_Server_Type', 'ad', {
                    type: 'select',
                    public: true,
                    enableQuery,
                    values: [
                        { key: 'ad', i18nLabel: 'LDAP_Server_Type_AD' },
                        { key: '', i18nLabel: 'LDAP_Server_Type_Other' },
                    ],
                });
                yield this.add('LDAP_Host', '', { type: 'string', enableQuery });
                yield this.add('LDAP_Port', 389, { type: 'int', enableQuery });
                yield this.add('LDAP_Reconnect', false, { type: 'boolean', enableQuery });
                yield this.add('LDAP_Login_Fallback', false, { type: 'boolean', enableQuery });
                yield this.section('LDAP_Connection_Authentication', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const enableAuthentication = [enableQuery, { _id: 'LDAP_Authentication', value: true }];
                        yield this.add('LDAP_Authentication', false, { type: 'boolean', enableQuery, invalidValue: false });
                        yield this.add('LDAP_Authentication_UserDN', '', {
                            type: 'string',
                            enableQuery: enableAuthentication,
                            secret: true,
                            invalidValue: '',
                        });
                        yield this.add('LDAP_Authentication_Password', '', {
                            type: 'password',
                            enableQuery: enableAuthentication,
                            secret: true,
                            invalidValue: '',
                        });
                    });
                });
                yield this.section('LDAP_Connection_Encryption', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('LDAP_Encryption', 'plain', {
                            type: 'select',
                            values: [
                                { key: 'plain', i18nLabel: 'No_Encryption' },
                                { key: 'tls', i18nLabel: 'StartTLS' },
                                { key: 'ssl', i18nLabel: 'SSL/LDAPS' },
                            ],
                            enableQuery,
                        });
                        const enableTLSQuery = [enableQuery, { _id: 'LDAP_Encryption', value: { $in: ['tls', 'ssl'] } }];
                        yield this.add('LDAP_CA_Cert', '', {
                            type: 'string',
                            multiline: true,
                            enableQuery: enableTLSQuery,
                            secret: true,
                        });
                        yield this.add('LDAP_Reject_Unauthorized', true, { type: 'boolean', enableQuery: enableTLSQuery });
                    });
                });
                yield this.section('LDAP_Connection_Timeouts', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('LDAP_Timeout', 60000, { type: 'int', enableQuery });
                        yield this.add('LDAP_Connect_Timeout', 1000, { type: 'int', enableQuery });
                        yield this.add('LDAP_Idle_Timeout', 1000, { type: 'int', enableQuery });
                    });
                });
            });
        });
        yield this.with({ tab: 'LDAP_UserSearch' }, function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('LDAP_Find_User_After_Login', true, { type: 'boolean', enableQuery });
                yield this.section('LDAP_UserSearch_Filter', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('LDAP_BaseDN', '', {
                            type: 'string',
                            enableQuery,
                        });
                        yield this.add('LDAP_User_Search_Filter', '(objectclass=*)', {
                            type: 'string',
                            enableQuery,
                        });
                        yield this.add('LDAP_User_Search_Scope', 'sub', {
                            type: 'string',
                            enableQuery,
                        });
                        yield this.add('LDAP_AD_User_Search_Field', 'sAMAccountName', {
                            i18nLabel: 'LDAP_User_Search_Field',
                            i18nDescription: 'LDAP_User_Search_Field_Description',
                            type: 'string',
                            enableQuery,
                            displayQuery: adOnly,
                        });
                        yield this.add('LDAP_User_Search_Field', 'uid', {
                            type: 'string',
                            enableQuery,
                            displayQuery: ldapOnly,
                        });
                        yield this.add('LDAP_Search_Page_Size', 250, {
                            type: 'int',
                            enableQuery,
                        });
                        yield this.add('LDAP_Search_Size_Limit', 1000, {
                            type: 'int',
                            enableQuery,
                        });
                    });
                });
                yield this.section('LDAP_UserSearch_GroupFilter', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const groupFilterQuery = [enableQuery, { _id: 'LDAP_Group_Filter_Enable', value: true }];
                        yield this.add('LDAP_Group_Filter_Enable', false, { type: 'boolean', enableQuery });
                        yield this.add('LDAP_Group_Filter_ObjectClass', 'groupOfUniqueNames', {
                            type: 'string',
                            enableQuery: groupFilterQuery,
                        });
                        yield this.add('LDAP_Group_Filter_Group_Id_Attribute', 'cn', {
                            type: 'string',
                            enableQuery: groupFilterQuery,
                        });
                        yield this.add('LDAP_Group_Filter_Group_Member_Attribute', 'uniqueMember', {
                            type: 'string',
                            enableQuery: groupFilterQuery,
                        });
                        yield this.add('LDAP_Group_Filter_Group_Member_Format', '', {
                            type: 'string',
                            enableQuery: groupFilterQuery,
                        });
                        yield this.add('LDAP_Group_Filter_Group_Name', 'ROCKET_CHAT', {
                            type: 'string',
                            enableQuery: groupFilterQuery,
                        });
                    });
                });
            });
        });
        yield this.with({ tab: 'LDAP_DataSync' }, function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('LDAP_Unique_Identifier_Field', 'objectGUID,ibm-entryUUID,GUID,dominoUNID,nsuniqueId,uidNumber,uid', {
                    type: 'string',
                    enableQuery,
                });
                yield this.add('LDAP_Merge_Existing_Users', false, {
                    type: 'boolean',
                    enableQuery,
                });
                yield this.add('LDAP_Update_Data_On_Login', true, {
                    type: 'boolean',
                    enableQuery,
                });
                yield this.add('LDAP_Update_Data_On_OAuth_Login', false, {
                    type: 'boolean',
                    enableQuery: [enableQuery, { _id: 'LDAP_Update_Data_On_Login', value: true }],
                });
                yield this.add('LDAP_Default_Domain', '', {
                    type: 'string',
                    enableQuery,
                });
                yield this.section('LDAP_DataSync_DataMap', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('LDAP_AD_Username_Field', 'sAMAccountName', {
                            type: 'string',
                            enableQuery,
                            i18nLabel: 'LDAP_Username_Field',
                            i18nDescription: 'LDAP_Username_Field_Description',
                            displayQuery: adOnly,
                        });
                        yield this.add('LDAP_Username_Field', 'uid', {
                            type: 'string',
                            enableQuery,
                            displayQuery: ldapOnly,
                        });
                        yield this.add('LDAP_AD_Email_Field', 'mail', {
                            i18nLabel: 'LDAP_Email_Field',
                            i18nDescription: 'LDAP_Email_Field_Description',
                            type: 'string',
                            enableQuery,
                            displayQuery: adOnly,
                        });
                        yield this.add('LDAP_Email_Field', 'mail', {
                            type: 'string',
                            enableQuery,
                            displayQuery: ldapOnly,
                        });
                        yield this.add('LDAP_AD_Name_Field', 'cn', {
                            i18nLabel: 'LDAP_Name_Field',
                            i18nDescription: 'LDAP_Name_Field_Description',
                            type: 'string',
                            enableQuery,
                            displayQuery: adOnly,
                        });
                        yield this.add('LDAP_Name_Field', 'cn', {
                            type: 'string',
                            enableQuery,
                            displayQuery: ldapOnly,
                        });
                        yield this.add('LDAP_Extension_Field', '', {
                            type: 'string',
                            enableQuery,
                        });
                    });
                });
                yield this.section('LDAP_DataSync_Avatar', function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add('LDAP_Sync_User_Avatar', true, {
                            type: 'boolean',
                            enableQuery,
                        });
                        yield this.add('LDAP_Avatar_Field', '', {
                            type: 'string',
                            enableQuery,
                        });
                    });
                });
            });
        });
    });
});
exports.createLdapSettings = createLdapSettings;
