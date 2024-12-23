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
exports.createFederationSettings = void 0;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../app/settings/server");
const createFederationSettings = () => server_1.settingsRegistry.addGroup('Federation', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.section('Rocket.Chat Federation', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('FEDERATION_Enabled', false, {
                    type: 'boolean',
                    i18nLabel: 'Enabled',
                    i18nDescription: 'FEDERATION_Enabled',
                    alert: 'This_is_a_deprecated_feature_alert',
                    public: true,
                });
                yield this.add('FEDERATION_Status', 'Disabled', {
                    readonly: true,
                    type: 'string',
                    i18nLabel: 'FEDERATION_Status',
                });
                yield this.add('FEDERATION_Domain', '', {
                    type: 'string',
                    i18nLabel: 'FEDERATION_Domain',
                    i18nDescription: 'FEDERATION_Domain_Description',
                    alert: 'FEDERATION_Domain_Alert',
                    // disableReset: true,
                });
                const federationPublicKey = yield models_1.FederationKeys.getPublicKeyString();
                yield this.add('FEDERATION_Public_Key', federationPublicKey || '', {
                    readonly: true,
                    type: 'string',
                    multiline: true,
                    i18nLabel: 'FEDERATION_Public_Key',
                    i18nDescription: 'FEDERATION_Public_Key_Description',
                });
                yield this.add('FEDERATION_Discovery_Method', 'dns', {
                    type: 'select',
                    values: [
                        {
                            key: 'dns',
                            i18nLabel: 'DNS',
                        },
                        {
                            key: 'hub',
                            i18nLabel: 'Hub',
                        },
                    ],
                    i18nLabel: 'FEDERATION_Discovery_Method',
                    i18nDescription: 'FEDERATION_Discovery_Method_Description',
                    public: true,
                });
                yield this.add('FEDERATION_Test_Setup', 'FEDERATION_Test_Setup', {
                    type: 'action',
                    actionText: 'FEDERATION_Test_Setup',
                });
            });
        });
    });
});
exports.createFederationSettings = createFederationSettings;
