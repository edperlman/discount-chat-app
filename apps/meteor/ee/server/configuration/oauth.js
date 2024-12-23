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
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const server_1 = require("../../../app/settings/server");
const callbacks_1 = require("../../../lib/callbacks");
const Manager_1 = require("../lib/oauth/Manager");
const syncUserRoles_1 = require("../lib/syncUserRoles");
const logger = new logger_1.Logger('EECustomOAuth');
function getOAuthSettings(serviceName) {
    return {
        mapChannels: server_1.settings.get(`Accounts_OAuth_Custom-${serviceName}-map_channels`),
        mergeRoles: server_1.settings.get(`Accounts_OAuth_Custom-${serviceName}-merge_roles`),
        rolesToSync: server_1.settings.get(`Accounts_OAuth_Custom-${serviceName}-roles_to_sync`),
        rolesClaim: server_1.settings.get(`Accounts_OAuth_Custom-${serviceName}-roles_claim`),
        groupsClaim: server_1.settings.get(`Accounts_OAuth_Custom-${serviceName}-groups_claim`),
        channelsAdmin: server_1.settings.get(`Accounts_OAuth_Custom-${serviceName}-channels_admin`),
        channelsMap: server_1.settings.get(`Accounts_OAuth_Custom-${serviceName}-groups_channel_map`),
    };
}
function getChannelsMap(channelsMap) {
    channelsMap = (channelsMap || '{}').trim();
    try {
        return JSON.parse(channelsMap);
    }
    catch (err) {
        logger.error({ msg: 'Unexpected error', err });
    }
}
await license_1.License.onLicense('oauth-enterprise', () => {
    callbacks_1.callbacks.add('afterProcessOAuthUser', (auth) => __awaiter(void 0, void 0, void 0, function* () {
        auth.serviceName = (0, string_helpers_1.capitalize)(auth.serviceName);
        const settings = getOAuthSettings(auth.serviceName);
        if (settings.mapChannels) {
            const channelsMap = getChannelsMap(settings.channelsMap);
            yield Manager_1.OAuthEEManager.mapSSOGroupsToChannels(auth.user, auth.serviceData, settings.groupsClaim, channelsMap, settings.channelsAdmin);
        }
        if (settings.mergeRoles) {
            yield Manager_1.OAuthEEManager.updateRolesFromSSO(auth.user, auth.serviceData, settings.rolesClaim, settings.rolesToSync.split(',').map((role) => role.trim()));
        }
    }));
    callbacks_1.callbacks.add('afterValidateNewOAuthUser', (auth) => __awaiter(void 0, void 0, void 0, function* () {
        auth.serviceName = (0, string_helpers_1.capitalize)(auth.serviceName);
        const settings = getOAuthSettings(auth.serviceName);
        if (settings.mapChannels) {
            const channelsMap = getChannelsMap(settings.channelsMap);
            yield Manager_1.OAuthEEManager.mapSSOGroupsToChannels(auth.user, auth.identity, settings.groupsClaim, channelsMap, settings.channelsAdmin);
        }
        if (settings.mergeRoles) {
            const rolesFromSSO = yield Manager_1.OAuthEEManager.mapRolesFromSSO(auth.identity, settings.rolesClaim);
            const mappedRoles = (yield models_1.Roles.findInIdsOrNames(rolesFromSSO).toArray()).map((role) => role._id);
            const rolesToSync = settings.rolesToSync.split(',').map((role) => role.trim());
            const allowedRoles = (yield models_1.Roles.findInIdsOrNames(rolesToSync).toArray()).map((role) => role._id);
            yield (0, syncUserRoles_1.syncUserRoles)(auth.user._id, mappedRoles, {
                allowedRoles,
            });
        }
    }));
});
