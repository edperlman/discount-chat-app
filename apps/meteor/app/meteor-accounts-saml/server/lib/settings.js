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
exports.addSettings = exports.addSamlService = exports.loadSamlServiceProviders = void 0;
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const Utils_1 = require("./Utils");
const constants_1 = require("./constants");
const system_1 = require("../../../../server/lib/logger/system");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_1 = require("../../../settings/server");
const getSamlConfigs = function (service) {
    const configs = {
        buttonLabelText: server_1.settings.get(`${service}_button_label_text`),
        buttonLabelColor: server_1.settings.get(`${service}_button_label_color`),
        buttonColor: server_1.settings.get(`${service}_button_color`),
        clientConfig: {
            provider: server_1.settings.get(`${service}_provider`),
        },
        entryPoint: server_1.settings.get(`${service}_entry_point`),
        idpSLORedirectURL: server_1.settings.get(`${service}_idp_slo_redirect_url`),
        usernameNormalize: server_1.settings.get(`${service}_username_normalize`),
        immutableProperty: server_1.settings.get(`${service}_immutable_property`),
        generateUsername: server_1.settings.get(`${service}_generate_username`),
        debug: server_1.settings.get(`${service}_debug`),
        nameOverwrite: server_1.settings.get(`${service}_name_overwrite`),
        mailOverwrite: server_1.settings.get(`${service}_mail_overwrite`),
        issuer: server_1.settings.get(`${service}_issuer`),
        logoutBehaviour: server_1.settings.get(`${service}_logout_behaviour`),
        defaultUserRole: server_1.settings.get(`${service}_default_user_role`),
        secret: {
            privateKey: server_1.settings.get(`${service}_private_key`),
            publicCert: server_1.settings.get(`${service}_public_cert`),
            // People often overlook the instruction to remove the header and footer of the certificate on this specific setting, so let's do it for them.
            cert: Utils_1.SAMLUtils.normalizeCert(server_1.settings.get(`${service}_cert`) || ''),
        },
        signatureValidationType: server_1.settings.get(`${service}_signature_validation_type`),
        userDataFieldMap: server_1.settings.get(`${service}_user_data_fieldmap`),
        allowedClockDrift: server_1.settings.get(`${service}_allowed_clock_drift`),
        customAuthnContext: constants_1.defaultAuthnContext,
        authnContextComparison: 'exact',
        identifierFormat: constants_1.defaultIdentifierFormat,
        nameIDPolicyTemplate: constants_1.defaultNameIDTemplate,
        authnContextTemplate: constants_1.defaultAuthnContextTemplate,
        authRequestTemplate: constants_1.defaultAuthRequestTemplate,
        logoutResponseTemplate: constants_1.defaultLogoutResponseTemplate,
        logoutRequestTemplate: constants_1.defaultLogoutRequestTemplate,
        metadataCertificateTemplate: constants_1.defaultMetadataCertificateTemplate,
        metadataTemplate: constants_1.defaultMetadataTemplate,
        channelsAttributeUpdate: server_1.settings.get(`${service}_channels_update`),
        includePrivateChannelsInUpdate: server_1.settings.get(`${service}_include_private_channels_update`),
    };
    Utils_1.SAMLUtils.events.emit('loadConfigs', service, configs);
    return configs;
};
const configureSamlService = function (samlConfigs) {
    let privateCert = null;
    let privateKey = null;
    if (samlConfigs.secret.privateKey && samlConfigs.secret.publicCert) {
        privateKey = samlConfigs.secret.privateKey;
        privateCert = samlConfigs.secret.publicCert;
    }
    else if (samlConfigs.secret.privateKey || samlConfigs.secret.publicCert) {
        Utils_1.SAMLUtils.error('SAML Service: You must specify both cert and key files.');
    }
    Utils_1.SAMLUtils.updateGlobalSettings(samlConfigs);
    return {
        provider: samlConfigs.clientConfig.provider,
        entryPoint: samlConfigs.entryPoint,
        idpSLORedirectURL: samlConfigs.idpSLORedirectURL,
        issuer: samlConfigs.issuer,
        cert: samlConfigs.secret.cert,
        privateCert,
        privateKey,
        customAuthnContext: samlConfigs.customAuthnContext,
        authnContextComparison: samlConfigs.authnContextComparison,
        defaultUserRole: samlConfigs.defaultUserRole,
        allowedClockDrift: parseInt(samlConfigs.allowedClockDrift) || 0,
        signatureValidationType: samlConfigs.signatureValidationType,
        identifierFormat: samlConfigs.identifierFormat,
        nameIDPolicyTemplate: samlConfigs.nameIDPolicyTemplate,
        authnContextTemplate: samlConfigs.authnContextTemplate,
        authRequestTemplate: samlConfigs.authRequestTemplate,
        logoutResponseTemplate: samlConfigs.logoutResponseTemplate,
        logoutRequestTemplate: samlConfigs.logoutRequestTemplate,
        metadataCertificateTemplate: samlConfigs.metadataCertificateTemplate,
        metadataTemplate: samlConfigs.metadataTemplate,
        callbackUrl: meteor_1.Meteor.absoluteUrl(`_saml/validate/${samlConfigs.clientConfig.provider}`),
    };
};
const loadSamlServiceProviders = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const serviceName = 'saml';
        const services = server_1.settings.getByRegexp(/^(SAML_Custom_)[a-z]+$/i);
        if (!services) {
            return Utils_1.SAMLUtils.setServiceProvidersList([]);
        }
        const providers = (yield Promise.all(services.map((_a) => __awaiter(this, [_a], void 0, function* ([key, value]) {
            if (value === true) {
                const samlConfigs = getSamlConfigs(key);
                Utils_1.SAMLUtils.log(key);
                yield models_1.LoginServiceConfiguration.createOrUpdateService(serviceName, samlConfigs);
                void (0, notifyListener_1.notifyOnLoginServiceConfigurationChangedByService)(serviceName);
                return configureSamlService(samlConfigs);
            }
            const service = yield models_1.LoginServiceConfiguration.findOneByService(serviceName, { projection: { _id: 1 } });
            if (!(service === null || service === void 0 ? void 0 : service._id)) {
                return false;
            }
            const { deletedCount } = yield models_1.LoginServiceConfiguration.removeService(service._id);
            if (!deletedCount) {
                return false;
            }
            void (0, notifyListener_1.notifyOnLoginServiceConfigurationChanged)({ _id: service._id }, 'removed');
            return false;
        })))).filter((e) => e);
        Utils_1.SAMLUtils.setServiceProvidersList(providers);
    });
};
exports.loadSamlServiceProviders = loadSamlServiceProviders;
const addSamlService = function (name) {
    system_1.SystemLogger.warn(`Adding ${name} is deprecated`);
};
exports.addSamlService = addSamlService;
const addSettings = function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        yield server_1.settingsRegistry.addGroup('SAML', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.with({
                    tab: 'SAML_Connection',
                }, function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.add(`SAML_Custom_${name}`, false, {
                            type: 'boolean',
                            i18nLabel: 'Accounts_OAuth_Custom_Enable',
                            public: true,
                        });
                        yield this.add(`SAML_Custom_${name}_provider`, 'provider-name', {
                            type: 'string',
                            i18nLabel: 'SAML_Custom_Provider',
                            public: true,
                        });
                        yield this.add(`SAML_Custom_${name}_entry_point`, 'https://example.com/simplesaml/saml2/idp/SSOService.php', {
                            type: 'string',
                            i18nLabel: 'SAML_Custom_Entry_point',
                        });
                        yield this.add(`SAML_Custom_${name}_idp_slo_redirect_url`, 'https://example.com/simplesaml/saml2/idp/SingleLogoutService.php', {
                            type: 'string',
                            i18nLabel: 'SAML_Custom_IDP_SLO_Redirect_URL',
                            public: true,
                        });
                        yield this.add(`SAML_Custom_${name}_issuer`, 'https://your-rocket-chat/_saml/metadata/provider-name', {
                            type: 'string',
                            i18nLabel: 'SAML_Custom_Issuer',
                        });
                        yield this.add(`SAML_Custom_${name}_debug`, false, {
                            type: 'boolean',
                            i18nLabel: 'SAML_Custom_Debug',
                        });
                        yield this.section('SAML_Section_2_Certificate', function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield this.add(`SAML_Custom_${name}_cert`, '', {
                                    type: 'string',
                                    i18nLabel: 'SAML_Custom_Cert',
                                    multiline: true,
                                    secret: true,
                                });
                                yield this.add(`SAML_Custom_${name}_public_cert`, '', {
                                    type: 'string',
                                    multiline: true,
                                    i18nLabel: 'SAML_Custom_Public_Cert',
                                });
                                yield this.add(`SAML_Custom_${name}_signature_validation_type`, 'All', {
                                    type: 'select',
                                    values: [
                                        { key: 'Response', i18nLabel: 'SAML_Custom_signature_validation_response' },
                                        { key: 'Assertion', i18nLabel: 'SAML_Custom_signature_validation_assertion' },
                                        { key: 'Either', i18nLabel: 'SAML_Custom_signature_validation_either' },
                                        { key: 'All', i18nLabel: 'SAML_Custom_signature_validation_all' },
                                    ],
                                    i18nLabel: 'SAML_Custom_signature_validation_type',
                                    i18nDescription: 'SAML_Custom_signature_validation_type_description',
                                });
                                yield this.add(`SAML_Custom_${name}_private_key`, '', {
                                    type: 'string',
                                    multiline: true,
                                    i18nLabel: 'SAML_Custom_Private_Key',
                                    secret: true,
                                });
                            });
                        });
                    });
                });
                yield this.with({
                    tab: 'SAML_General',
                }, function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.section('SAML_Section_1_User_Interface', function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield this.add(`SAML_Custom_${name}_button_label_text`, 'SAML', {
                                    type: 'string',
                                    i18nLabel: 'Accounts_OAuth_Custom_Button_Label_Text',
                                });
                                yield this.add(`SAML_Custom_${name}_button_label_color`, '#FFFFFF', {
                                    type: 'string',
                                    i18nLabel: 'Accounts_OAuth_Custom_Button_Label_Color',
                                    alert: 'OAuth_button_colors_alert',
                                });
                                yield this.add(`SAML_Custom_${name}_button_color`, '#1d74f5', {
                                    type: 'string',
                                    i18nLabel: 'Accounts_OAuth_Custom_Button_Color',
                                    alert: 'OAuth_button_colors_alert',
                                });
                            });
                        });
                        yield this.section('SAML_Section_3_Behavior', function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                // Settings to customize behavior
                                yield this.add(`SAML_Custom_${name}_generate_username`, false, {
                                    type: 'boolean',
                                    i18nLabel: 'SAML_Custom_Generate_Username',
                                });
                                yield this.add(`SAML_Custom_${name}_username_normalize`, 'None', {
                                    type: 'select',
                                    values: [
                                        { key: 'None', i18nLabel: 'SAML_Custom_Username_Normalize_None' },
                                        { key: 'Lowercase', i18nLabel: 'SAML_Custom_Username_Normalize_Lowercase' },
                                    ],
                                    i18nLabel: 'SAML_Custom_Username_Normalize',
                                });
                                yield this.add(`SAML_Custom_${name}_immutable_property`, 'EMail', {
                                    type: 'select',
                                    values: [
                                        { key: 'Username', i18nLabel: 'SAML_Custom_Immutable_Property_Username' },
                                        { key: 'EMail', i18nLabel: 'SAML_Custom_Immutable_Property_EMail' },
                                    ],
                                    i18nLabel: 'SAML_Custom_Immutable_Property',
                                });
                                yield this.add(`SAML_Custom_${name}_name_overwrite`, false, {
                                    type: 'boolean',
                                    i18nLabel: 'SAML_Custom_name_overwrite',
                                });
                                yield this.add(`SAML_Custom_${name}_mail_overwrite`, false, {
                                    type: 'boolean',
                                    i18nLabel: 'SAML_Custom_mail_overwrite',
                                });
                                yield this.add(`SAML_Custom_${name}_logout_behaviour`, 'SAML', {
                                    type: 'select',
                                    values: [
                                        { key: 'SAML', i18nLabel: 'SAML_Custom_Logout_Behaviour_Terminate_SAML_Session' },
                                        { key: 'Local', i18nLabel: 'SAML_Custom_Logout_Behaviour_End_Only_RocketChat' },
                                    ],
                                    i18nLabel: 'SAML_Custom_Logout_Behaviour',
                                    public: true,
                                });
                                yield this.add(`SAML_Custom_${name}_channels_update`, false, {
                                    type: 'boolean',
                                    i18nLabel: 'SAML_Custom_channels_update',
                                    i18nDescription: 'SAML_Custom_channels_update_description',
                                });
                                yield this.add(`SAML_Custom_${name}_include_private_channels_update`, false, {
                                    type: 'boolean',
                                    i18nLabel: 'SAML_Custom_include_private_channels_update',
                                    i18nDescription: 'SAML_Custom_include_private_channels_update_description',
                                });
                                yield this.add(`SAML_Custom_${name}_default_user_role`, 'user', {
                                    type: 'string',
                                    i18nLabel: 'SAML_Default_User_Role',
                                    i18nDescription: 'SAML_Default_User_Role_Description',
                                });
                                yield this.add(`SAML_Custom_${name}_allowed_clock_drift`, 0, {
                                    type: 'int',
                                    invalidValue: 0,
                                    i18nLabel: 'SAML_Allowed_Clock_Drift',
                                    i18nDescription: 'SAML_Allowed_Clock_Drift_Description',
                                });
                            });
                        });
                        yield this.section('SAML_Section_5_Mapping', function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                // Data Mapping Settings
                                yield this.add(`SAML_Custom_${name}_user_data_fieldmap`, '{"username":"username", "email":"email", "name": "cn"}', {
                                    type: 'string',
                                    i18nLabel: 'SAML_Custom_user_data_fieldmap',
                                    i18nDescription: 'SAML_Custom_user_data_fieldmap_description',
                                    multiline: true,
                                });
                            });
                        });
                    });
                });
                Utils_1.SAMLUtils.events.emit('addSettings', name);
            });
        });
    });
};
exports.addSettings = addSettings;
