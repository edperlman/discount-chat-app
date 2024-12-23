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
exports.federationCron = federationCron;
const core_typings_1 = require("@rocket.chat/core-typings");
const cron_1 = require("@rocket.chat/cron");
const models_1 = require("@rocket.chat/models");
const resolveDNS_1 = require("../../app/federation/server/functions/resolveDNS");
const handler_1 = require("../../app/federation/server/handler");
const getFederationDomain_1 = require("../../app/federation/server/lib/getFederationDomain");
const notifyListener_1 = require("../../app/lib/server/lib/notifyListener");
const server_1 = require("../../app/settings/server");
function updateSetting(id, value) {
    return __awaiter(this, void 0, void 0, function* () {
        if (value !== null) {
            const setting = server_1.settings.get(id);
            if (setting === undefined) {
                yield server_1.settingsRegistry.add(id, value);
            }
            else {
                // TODO: audit
                (yield models_1.Settings.updateValueById(id, value)).modifiedCount && void (0, notifyListener_1.notifyOnSettingChangedById)(id);
            }
        }
        else {
            yield models_1.Settings.updateValueById(id, null);
        }
    });
}
function runFederation() {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the settings
        const siteUrl = server_1.settings.get('Site_Url');
        const { protocol } = new URL(siteUrl);
        const rocketChatProtocol = protocol.slice(0, -1);
        const federationDomain = server_1.settings.get('FEDERATION_Domain');
        // Load public key info
        try {
            const resolvedTXT = yield (0, resolveDNS_1.resolveTXT)(`rocketchat-public-key.${federationDomain}`);
            yield updateSetting('FEDERATION_ResolvedPublicKeyTXT', resolvedTXT);
        }
        catch (err) {
            yield updateSetting('FEDERATION_ResolvedPublicKeyTXT', null);
        }
        // Load legacy tcp protocol info
        try {
            const resolvedTXT = yield (0, resolveDNS_1.resolveTXT)(`rocketchat-tcp-protocol.${federationDomain}`);
            yield updateSetting('FEDERATION_ResolvedProtocolTXT', resolvedTXT);
        }
        catch (err) {
            yield updateSetting('FEDERATION_ResolvedProtocolTXT', null);
        }
        // Load SRV info
        try {
            // If there is a protocol entry on DNS, we use it
            const protocol = server_1.settings.get('FEDERATION_ResolvedProtocolTXT') ? 'tcp' : rocketChatProtocol;
            const resolvedSRV = yield (0, resolveDNS_1.resolveSRV)(`_rocketchat._${protocol}.${federationDomain}`);
            yield updateSetting('FEDERATION_ResolvedSRV', JSON.stringify(resolvedSRV));
        }
        catch (err) {
            yield updateSetting('FEDERATION_ResolvedSRV', '{}');
        }
        // Test if federation is healthy
        try {
            void (0, handler_1.dispatchEvent)([(0, getFederationDomain_1.getFederationDomain)()], {
                type: core_typings_1.eventTypes.PING,
            });
            yield updateSetting('FEDERATION_Healthy', true);
        }
        catch (err) {
            yield updateSetting('FEDERATION_Healthy', false);
        }
        // If federation is healthy, check if there are remote users
        if (server_1.settings.get('FEDERATION_Healthy')) {
            const user = yield models_1.Users.findOne({ isRemote: true });
            yield updateSetting('FEDERATION_Populated', !!user);
        }
    });
}
// eslint-disable-next-line @typescript-eslint/naming-convention
function federationCron() {
    return __awaiter(this, void 0, void 0, function* () {
        const name = 'Federation';
        server_1.settings.watch('FEDERATION_Enabled', (value) => __awaiter(this, void 0, void 0, function* () {
            if (!value) {
                return cron_1.cronJobs.remove(name);
            }
            yield cron_1.cronJobs.add(name, '* * * * *', () => __awaiter(this, void 0, void 0, function* () { return runFederation(); }));
        }));
    });
}
