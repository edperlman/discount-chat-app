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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocketChatSettingsAdapter = void 0;
const crypto_1 = __importDefault(require("crypto"));
const models_1 = require("@rocket.chat/models");
const js_yaml_1 = __importDefault(require("js-yaml"));
const uuid_1 = require("uuid");
const notifyListener_1 = require("../../../../../../app/lib/server/lib/notifyListener");
const server_1 = require("../../../../../../app/settings/server");
const EVERYTHING_REGEX = '.*';
const LISTEN_RULES = EVERYTHING_REGEX;
class RocketChatSettingsAdapter {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.addFederationSettings();
            this.watchChangesAndUpdateRegistrationFile();
        });
    }
    getApplicationServiceId() {
        return server_1.settings.get('Federation_Matrix_id');
    }
    getApplicationHomeServerToken() {
        return server_1.settings.get('Federation_Matrix_hs_token');
    }
    getApplicationApplicationServiceToken() {
        return server_1.settings.get('Federation_Matrix_as_token');
    }
    getBridgeUrl() {
        return server_1.settings.get('Federation_Matrix_bridge_url');
    }
    getBridgePort() {
        const [, , port = '3300'] = this.getBridgeUrl().split(':');
        return parseInt(port);
    }
    getHomeServerUrl() {
        return server_1.settings.get('Federation_Matrix_homeserver_url');
    }
    getHomeServerDomain() {
        return server_1.settings.get('Federation_Matrix_homeserver_domain');
    }
    getBridgeBotUsername() {
        return server_1.settings.get('Federation_Matrix_bridge_localpart');
    }
    getMaximumSizeOfUsersWhenJoiningPublicRooms() {
        return server_1.settings.get('Federation_Matrix_max_size_of_public_rooms_users');
    }
    disableFederation() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: audit
            (yield models_1.Settings.updateValueById('Federation_Matrix_enabled', false)).modifiedCount &&
                void (0, notifyListener_1.notifyOnSettingChangedById)('Federation_Matrix_enabled');
        });
    }
    isFederationEnabled() {
        return server_1.settings.get('Federation_Matrix_enabled') === true;
    }
    isTypingStatusEnabled() {
        return server_1.settings.get('Federation_Matrix_enable_ephemeral_events') === true;
    }
    isConfigurationValid() {
        return server_1.settings.get('Federation_Matrix_configuration_status') === 'Valid';
    }
    setConfigurationStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: audit
            const { modifiedCount } = yield models_1.Settings.updateValueById('Federation_Matrix_configuration_status', status);
            if (modifiedCount) {
                void (0, notifyListener_1.notifyOnSettingChangedById)('Federation_Matrix_configuration_status');
            }
        });
    }
    onFederationEnabledStatusChanged(callback) {
        return server_1.settings.watchMultiple([
            'Federation_Matrix_enabled',
            'Federation_Matrix_id',
            'Federation_Matrix_hs_token',
            'Federation_Matrix_as_token',
            'Federation_Matrix_homeserver_url',
            'Federation_Matrix_homeserver_domain',
            'Federation_Matrix_bridge_url',
            'Federation_Matrix_bridge_localpart',
        ], ([enabled]) => callback(enabled === true, this.getApplicationServiceId(), this.getHomeServerUrl(), this.getHomeServerDomain(), this.getBridgeUrl(), this.getBridgePort(), this.getAppServiceRegistrationObject()));
    }
    getAppServiceRegistrationObject() {
        return {
            id: this.getApplicationServiceId(),
            homeserverToken: this.getApplicationHomeServerToken(),
            applicationServiceToken: this.getApplicationApplicationServiceToken(),
            bridgeUrl: this.getBridgeUrl(),
            botName: this.getBridgeBotUsername(),
            enableEphemeralEvents: this.isTypingStatusEnabled(),
            listenTo: {
                users: [
                    {
                        exclusive: false,
                        regex: LISTEN_RULES,
                    },
                ],
                rooms: [
                    {
                        exclusive: false,
                        regex: LISTEN_RULES,
                    },
                ],
                aliases: [
                    {
                        exclusive: false,
                        regex: LISTEN_RULES,
                    },
                ],
            },
        };
    }
    updateRegistrationFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const registrationFile = this.getAppServiceRegistrationObject();
            yield models_1.Settings.updateValueById('Federation_Matrix_registration_file', js_yaml_1.default.dump({
                'id': registrationFile.id,
                'hs_token': registrationFile.homeserverToken,
                'as_token': registrationFile.applicationServiceToken,
                'url': registrationFile.bridgeUrl,
                'sender_localpart': registrationFile.botName,
                'namespaces': registrationFile.listenTo,
                'de.sorunome.msc2409.push_ephemeral': registrationFile.enableEphemeralEvents,
                'use_appservice_legacy_authorization': true,
            }));
        });
    }
    watchChangesAndUpdateRegistrationFile() {
        server_1.settings.watchMultiple([
            'Federation_Matrix_id',
            'Federation_Matrix_hs_token',
            'Federation_Matrix_as_token',
            'Federation_Matrix_homeserver_url',
            'Federation_Matrix_homeserver_domain',
            'Federation_Matrix_bridge_url',
            'Federation_Matrix_bridge_localpart',
        ], this.updateRegistrationFile.bind(this));
    }
    addFederationSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield server_1.settingsRegistry.add('Federation_Matrix_enabled', false, {
                readonly: false,
                type: 'boolean',
                i18nLabel: 'Federation_Matrix_enabled',
                i18nDescription: 'Federation_Matrix_enabled_desc',
                alert: 'Federation_Matrix_Enabled_Alert',
                public: true,
                group: 'Federation',
                section: 'Matrix Bridge',
            });
            yield server_1.settingsRegistry.add('Federation_Matrix_serve_well_known', true, {
                readonly: false,
                type: 'boolean',
                i18nLabel: 'Federation_Matrix_serve_well_known',
                alert: 'Federation_Matrix_serve_well_known_Alert',
                group: 'Federation',
                section: 'Matrix Bridge',
            });
            yield server_1.settingsRegistry.add('Federation_Matrix_enable_ephemeral_events', false, {
                readonly: false,
                type: 'boolean',
                i18nLabel: 'Federation_Matrix_enable_ephemeral_events',
                i18nDescription: 'Federation_Matrix_enable_ephemeral_events_desc',
                alert: 'Federation_Matrix_enable_ephemeral_events_Alert',
                public: true,
                group: 'Federation',
                section: 'Matrix Bridge',
            });
            const uniqueId = server_1.settings.get('uniqueID') || (0, uuid_1.v4)().slice(0, 15).replace(new RegExp('-', 'g'), '_');
            const homeserverToken = crypto_1.default.createHash('sha256').update(`hs_${uniqueId}`).digest('hex');
            const applicationServiceToken = crypto_1.default.createHash('sha256').update(`as_${uniqueId}`).digest('hex');
            const siteUrl = server_1.settings.get('Site_Url');
            yield server_1.settingsRegistry.add('Federation_Matrix_id', `rocketchat_${uniqueId}`, {
                readonly: process.env.NODE_ENV === 'production',
                type: 'string',
                i18nLabel: 'Federation_Matrix_id',
                i18nDescription: 'Federation_Matrix_id_desc',
                group: 'Federation',
                section: 'Matrix Bridge',
            });
            yield server_1.settingsRegistry.add('Federation_Matrix_hs_token', homeserverToken, {
                readonly: process.env.NODE_ENV === 'production',
                type: 'string',
                i18nLabel: 'Federation_Matrix_hs_token',
                i18nDescription: 'Federation_Matrix_hs_token_desc',
                group: 'Federation',
                section: 'Matrix Bridge',
            });
            yield server_1.settingsRegistry.add('Federation_Matrix_as_token', applicationServiceToken, {
                readonly: process.env.NODE_ENV === 'production',
                type: 'string',
                i18nLabel: 'Federation_Matrix_as_token',
                i18nDescription: 'Federation_Matrix_as_token_desc',
                group: 'Federation',
                section: 'Matrix Bridge',
            });
            yield server_1.settingsRegistry.add('Federation_Matrix_homeserver_url', 'http://localhost:8008', {
                type: 'string',
                i18nLabel: 'Federation_Matrix_homeserver_url',
                i18nDescription: 'Federation_Matrix_homeserver_url_desc',
                alert: 'Federation_Matrix_homeserver_url_alert',
                group: 'Federation',
                section: 'Matrix Bridge',
            });
            yield server_1.settingsRegistry.add('Federation_Matrix_homeserver_domain', siteUrl, {
                type: 'string',
                i18nLabel: 'Federation_Matrix_homeserver_domain',
                i18nDescription: 'Federation_Matrix_homeserver_domain_desc',
                alert: 'Federation_Matrix_homeserver_domain_alert',
                group: 'Federation',
                section: 'Matrix Bridge',
            });
            yield server_1.settingsRegistry.add('Federation_Matrix_bridge_url', 'http://localhost:3300', {
                type: 'string',
                i18nLabel: 'Federation_Matrix_bridge_url',
                i18nDescription: 'Federation_Matrix_bridge_url_desc',
                group: 'Federation',
                section: 'Matrix Bridge',
            });
            yield server_1.settingsRegistry.add('Federation_Matrix_bridge_localpart', 'rocket.cat', {
                type: 'string',
                i18nLabel: 'Federation_Matrix_bridge_localpart',
                i18nDescription: 'Federation_Matrix_bridge_localpart_desc',
                group: 'Federation',
                section: 'Matrix Bridge',
            });
            yield server_1.settingsRegistry.add('Federation_Matrix_registration_file', '', {
                readonly: true,
                type: 'code',
                i18nLabel: 'Federation_Matrix_registration_file',
                i18nDescription: 'Federation_Matrix_registration_file_desc',
                alert: 'Federation_Matrix_registration_file_Alert',
                group: 'Federation',
                section: 'Matrix Bridge',
            });
            yield server_1.settingsRegistry.add('Federation_Matrix_max_size_of_public_rooms_users', 100, {
                readonly: false,
                type: 'int',
                i18nLabel: 'Federation_Matrix_max_size_of_public_rooms_users',
                i18nDescription: 'Federation_Matrix_max_size_of_public_rooms_users_desc',
                alert: 'Federation_Matrix_max_size_of_public_rooms_users_Alert',
                public: true,
                enterprise: true,
                invalidValue: false,
                group: 'Federation',
                section: 'Matrix Bridge',
            });
            yield server_1.settingsRegistry.add('Federation_Matrix_configuration_status', 'Invalid', {
                readonly: true,
                type: 'string',
                i18nLabel: 'Federation_Matrix_configuration_status',
                i18nDescription: 'Federation_Matrix_configuration_status_desc',
                public: false,
                enterprise: false,
                invalidValue: '',
                group: 'Federation',
                section: 'Matrix Bridge',
            });
            yield server_1.settingsRegistry.add('Federation_Matrix_check_configuration_button', 'checkFederationConfiguration', {
                type: 'action',
                actionText: 'Federation_Matrix_check_configuration',
                public: false,
                enterprise: false,
                invalidValue: '',
                group: 'Federation',
                section: 'Matrix Bridge',
            });
        });
    }
}
exports.RocketChatSettingsAdapter = RocketChatSettingsAdapter;
