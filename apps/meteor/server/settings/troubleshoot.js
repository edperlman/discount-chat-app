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
exports.createTroubleshootSettings = void 0;
const server_1 = require("../../app/settings/server");
const createTroubleshootSettings = () => server_1.settingsRegistry.addGroup('Troubleshoot', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.add('Troubleshoot_Disable_Notifications', false, {
            type: 'boolean',
            i18nDescription: 'Troubleshoot_Disable_Notifications_Alert',
        });
        // this settings will let clients know in case presence has been disabled
        yield this.add('Presence_broadcast_disabled', false, {
            type: 'boolean',
            public: true,
            readonly: true,
        });
        yield this.add('Troubleshoot_Disable_Presence_Broadcast', false, {
            type: 'boolean',
            i18nDescription: 'Troubleshoot_Disable_Presence_Broadcast_Alert',
            enableQuery: { _id: 'Presence_broadcast_disabled', value: false },
        });
        yield this.add('Troubleshoot_Disable_Instance_Broadcast', false, {
            type: 'boolean',
            i18nDescription: 'Troubleshoot_Disable_Instance_Broadcast_Alert',
        });
        yield this.add('Troubleshoot_Disable_Sessions_Monitor', false, {
            type: 'boolean',
            i18nDescription: 'Troubleshoot_Disable_Sessions_Monitor_Alert',
        });
        yield this.add('Troubleshoot_Disable_Livechat_Activity_Monitor', false, {
            type: 'boolean',
            i18nDescription: 'Troubleshoot_Disable_Livechat_Activity_Monitor_Alert',
        });
        yield this.add('Troubleshoot_Disable_Data_Exporter_Processor', false, {
            type: 'boolean',
            i18nDescription: 'Troubleshoot_Disable_Data_Exporter_Processor_Alert',
        });
        yield this.add('Troubleshoot_Disable_Teams_Mention', false, {
            type: 'boolean',
            i18nDescription: 'Troubleshoot_Disable_Teams_Mention_Alert',
        });
        // TODO: remove this setting at next major (7.0.0)
        yield this.add('Troubleshoot_Disable_Statistics_Generator', false, {
            type: 'boolean',
            i18nDescription: 'Troubleshoot_Disable_Statistics_Generator_Alert',
            private: true,
            hidden: true,
            readonly: true,
        });
        // TODO: remove this setting at next major (7.0.0)
        yield this.add('Troubleshoot_Disable_Workspace_Sync', false, {
            type: 'boolean',
            i18nDescription: 'Troubleshoot_Disable_Workspace_Sync_Alert',
            private: true,
            hidden: true,
            readonly: true,
        });
        yield this.add('Troubleshoot_Force_Caching_Version', '', {
            type: 'string',
            i18nDescription: 'Troubleshoot_Force_Caching_Version_Alert',
        });
    });
});
exports.createTroubleshootSettings = createTroubleshootSettings;
