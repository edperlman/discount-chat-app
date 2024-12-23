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
const models_1 = require("@rocket.chat/models");
const system_1 = require("../../lib/logger/system");
const migrations_1 = require("../../lib/migrations");
const auditedSettingUpdates_1 = require("../../settings/lib/auditedSettingUpdates");
(0, migrations_1.addMigration)({
    version: 295,
    name: 'Change old "LDAP_Background_Sync_Interval" and "CROWD_Sync_Interval" to a pre-defined values instead of accept any input from the user',
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            const oldLdapDefault = 'Every 24 hours';
            const oldCrowdDefault = 'Every 60 mins';
            const newLdapDefault = 'every_24_hours';
            const newCrowdDefault = 'every_1_hours';
            const ldapSyncInterval = yield models_1.Settings.findOneById('LDAP_Background_Sync_Interval', {
                projection: { value: 1 },
            });
            const crowdSyncInterval = yield models_1.Settings.findOneById('CROWD_Sync_Interval', { projection: { value: 1 } });
            // update setting values
            yield (0, auditedSettingUpdates_1.updateAuditedBySystem)({
                reason: 'Migration 295',
            })(models_1.Settings.updateValueById, 'LDAP_Background_Sync_Interval', newLdapDefault);
            yield (0, auditedSettingUpdates_1.updateAuditedBySystem)({
                reason: 'Migration 295',
            })(models_1.Settings.updateValueById, 'CROWD_Sync_Interval', newCrowdDefault);
            // notify user about the changes if the value was different from the default
            if (ldapSyncInterval && ldapSyncInterval.value !== oldLdapDefault) {
                system_1.SystemLogger.warn(`The value of the setting 'LDAP background synchronization interval' has changed from "${ldapSyncInterval.value}" to "${newLdapDefault}". Please review your settings.`);
            }
            if (crowdSyncInterval && crowdSyncInterval.value !== oldCrowdDefault) {
                system_1.SystemLogger.warn(`The value of the setting 'CROWD background synchronization interval' has changed from "${crowdSyncInterval.value}" to "${newCrowdDefault}". Please review your settings.`);
            }
        });
    },
});
