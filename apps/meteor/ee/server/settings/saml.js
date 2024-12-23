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
exports.addSettings = void 0;
const constants_1 = require("../../../app/meteor-accounts-saml/server/lib/constants");
const server_1 = require("../../../app/settings/server");
const addSettings = function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        yield server_1.settingsRegistry.addGroup('SAML', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.with({
                    tab: 'SAML_Enterprise',
                    enterprise: true,
                    modules: ['saml-enterprise'],
                }, function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.section('SAML_Section_4_Roles', function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                // Roles Settings
                                yield this.add(`SAML_Custom_${name}_role_attribute_sync`, false, {
                                    type: 'boolean',
                                    i18nLabel: 'SAML_Role_Attribute_Sync',
                                    i18nDescription: 'SAML_Role_Attribute_Sync_Description',
                                    invalidValue: false,
                                });
                                yield this.add(`SAML_Custom_${name}_role_attribute_name`, '', {
                                    type: 'string',
                                    i18nLabel: 'SAML_Role_Attribute_Name',
                                    i18nDescription: 'SAML_Role_Attribute_Name_Description',
                                    invalidValue: '',
                                });
                            });
                        });
                        yield this.section('SAML_Section_6_Advanced', function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield this.add(`SAML_Custom_${name}_identifier_format`, constants_1.defaultIdentifierFormat, {
                                    type: 'string',
                                    invalidValue: constants_1.defaultIdentifierFormat,
                                    i18nLabel: 'SAML_Identifier_Format',
                                    i18nDescription: 'SAML_Identifier_Format_Description',
                                });
                                yield this.add(`SAML_Custom_${name}_NameId_template`, constants_1.defaultNameIDTemplate, {
                                    type: 'string',
                                    invalidValue: constants_1.defaultNameIDTemplate,
                                    i18nLabel: 'SAML_NameIdPolicy_Template',
                                    i18nDescription: 'SAML_NameIdPolicy_Template_Description',
                                    multiline: true,
                                });
                                yield this.add(`SAML_Custom_${name}_custom_authn_context`, constants_1.defaultAuthnContext, {
                                    type: 'string',
                                    invalidValue: constants_1.defaultAuthnContext,
                                    i18nLabel: 'SAML_Custom_Authn_Context',
                                    i18nDescription: 'SAML_Custom_Authn_Context_description',
                                });
                                yield this.add(`SAML_Custom_${name}_authn_context_comparison`, 'exact', {
                                    type: 'select',
                                    values: [
                                        { key: 'better', i18nLabel: 'Better' },
                                        { key: 'exact', i18nLabel: 'Exact' },
                                        { key: 'maximum', i18nLabel: 'Maximum' },
                                        { key: 'minimum', i18nLabel: 'Minimum' },
                                    ],
                                    invalidValue: 'exact',
                                    i18nLabel: 'SAML_Custom_Authn_Context_Comparison',
                                });
                                yield this.add(`SAML_Custom_${name}_AuthnContext_template`, constants_1.defaultAuthnContextTemplate, {
                                    type: 'string',
                                    invalidValue: constants_1.defaultAuthnContextTemplate,
                                    i18nLabel: 'SAML_AuthnContext_Template',
                                    i18nDescription: 'SAML_AuthnContext_Template_Description',
                                    multiline: true,
                                });
                                yield this.add(`SAML_Custom_${name}_AuthRequest_template`, constants_1.defaultAuthRequestTemplate, {
                                    type: 'string',
                                    invalidValue: constants_1.defaultAuthRequestTemplate,
                                    i18nLabel: 'SAML_AuthnRequest_Template',
                                    i18nDescription: 'SAML_AuthnRequest_Template_Description',
                                    multiline: true,
                                });
                                yield this.add(`SAML_Custom_${name}_LogoutResponse_template`, constants_1.defaultLogoutResponseTemplate, {
                                    type: 'string',
                                    invalidValue: constants_1.defaultLogoutResponseTemplate,
                                    i18nLabel: 'SAML_LogoutResponse_Template',
                                    i18nDescription: 'SAML_LogoutResponse_Template_Description',
                                    multiline: true,
                                });
                                yield this.add(`SAML_Custom_${name}_LogoutRequest_template`, constants_1.defaultLogoutRequestTemplate, {
                                    type: 'string',
                                    invalidValue: constants_1.defaultLogoutRequestTemplate,
                                    i18nLabel: 'SAML_LogoutRequest_Template',
                                    i18nDescription: 'SAML_LogoutRequest_Template_Description',
                                    multiline: true,
                                });
                                yield this.add(`SAML_Custom_${name}_MetadataCertificate_template`, constants_1.defaultMetadataCertificateTemplate, {
                                    type: 'string',
                                    invalidValue: constants_1.defaultMetadataCertificateTemplate,
                                    i18nLabel: 'SAML_MetadataCertificate_Template',
                                    i18nDescription: 'SAML_Metadata_Certificate_Template_Description',
                                    multiline: true,
                                });
                                yield this.add(`SAML_Custom_${name}_Metadata_template`, constants_1.defaultMetadataTemplate, {
                                    type: 'string',
                                    invalidValue: constants_1.defaultMetadataTemplate,
                                    i18nLabel: 'SAML_Metadata_Template',
                                    i18nDescription: 'SAML_Metadata_Template_Description',
                                    multiline: true,
                                });
                            });
                        });
                        yield this.section('SAML_Section_5_Mapping', function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                // Data Mapping Settings
                                yield this.add(`SAML_Custom_${name}_user_data_custom_fieldmap`, '{"custom1":"custom1", "custom2":"custom2", "custom3":"custom3"}', {
                                    type: 'string',
                                    invalidValue: '',
                                    i18nLabel: 'SAML_Custom_user_data_custom_fieldmap',
                                    i18nDescription: 'SAML_Custom_user_data_custom_fieldmap_description',
                                    multiline: true,
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};
exports.addSettings = addSettings;
