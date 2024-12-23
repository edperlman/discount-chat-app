"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManagementServerConfig = getManagementServerConfig;
exports.getServerConfigDataFromSettings = getServerConfigDataFromSettings;
exports.voipEnabled = voipEnabled;
const core_typings_1 = require("@rocket.chat/core-typings");
const cached_1 = require("../../../../app/settings/server/cached");
function getManagementServerConfig() {
    return {
        type: core_typings_1.ServerType.MANAGEMENT,
        host: cached_1.settings.get('VoIP_Management_Server_Host'),
        name: cached_1.settings.get('VoIP_Management_Server_Name'),
        configData: {
            port: Number(cached_1.settings.get('VoIP_Management_Server_Port')),
            username: cached_1.settings.get('VoIP_Management_Server_Username'),
            password: cached_1.settings.get('VoIP_Management_Server_Password'),
        },
    };
}
function getServerConfigDataFromSettings(type) {
    switch (type) {
        case core_typings_1.ServerType.CALL_SERVER: {
            return {
                type: core_typings_1.ServerType.CALL_SERVER,
                name: cached_1.settings.get('VoIP_Server_Name'),
                configData: {
                    websocketPath: cached_1.settings.get('VoIP_Server_Websocket_Path'),
                },
            };
        }
        case core_typings_1.ServerType.MANAGEMENT: {
            return getManagementServerConfig();
        }
    }
}
function voipEnabled() {
    return cached_1.settings.get('VoIP_Enabled');
}
