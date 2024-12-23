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
const cron_1 = require("@rocket.chat/cron");
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const cron_validator_1 = require("cron-validator");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../../app/settings/server");
const callbacks_1 = require("../../../lib/callbacks");
const Logger_1 = require("../../../server/lib/ldap/Logger");
const Manager_1 = require("../lib/ldap/Manager");
const sdk_1 = require("../sdk");
const ldap_1 = require("../settings/ldap");
meteor_1.Meteor.startup(() => __awaiter(void 0, void 0, void 0, function* () {
    yield license_1.License.onLicense('ldap-enterprise', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, ldap_1.addSettings)();
        // Configure background sync cronjob
        function configureBackgroundSync(jobName, enableSetting, intervalSetting, cb) {
            let lastSchedule;
            return function addCronJobDebounced() {
                return __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    if (server_1.settings.get('LDAP_Enable') !== true || server_1.settings.get(enableSetting) !== true) {
                        if (yield cron_1.cronJobs.has(jobName)) {
                            Logger_1.logger.info({ msg: 'Disabling LDAP Background Sync', jobName });
                            yield cron_1.cronJobs.remove(jobName);
                        }
                        return;
                    }
                    const settingValue = server_1.settings.get(intervalSetting);
                    const schedule = (_a = ldap_1.ldapIntervalValuesToCronMap[settingValue]) !== null && _a !== void 0 ? _a : ((0, cron_validator_1.isValidCron)(settingValue) ? settingValue : (_b = (yield models_1.Settings.findOneById(intervalSetting))) === null || _b === void 0 ? void 0 : _b.packageValue);
                    if (schedule) {
                        if (schedule !== lastSchedule && (yield cron_1.cronJobs.has(jobName))) {
                            yield cron_1.cronJobs.remove(jobName);
                        }
                        lastSchedule = schedule;
                        Logger_1.logger.info({ msg: 'Enabling LDAP Background Sync', jobName });
                        yield cron_1.cronJobs.add(jobName, schedule, cb);
                    }
                });
            };
        }
        const addCronJob = configureBackgroundSync('LDAP_Sync', 'LDAP_Background_Sync', 'LDAP_Background_Sync_Interval', () => sdk_1.LDAPEE.sync());
        const addAvatarCronJob = configureBackgroundSync('LDAP_AvatarSync', 'LDAP_Background_Sync_Avatars', 'LDAP_Background_Sync_Avatars_Interval', () => sdk_1.LDAPEE.syncAvatars());
        const addLogoutCronJob = configureBackgroundSync('LDAP_AutoLogout', 'LDAP_Sync_AutoLogout_Enabled', 'LDAP_Sync_AutoLogout_Interval', () => sdk_1.LDAPEE.syncLogout());
        server_1.settings.watchMultiple(['LDAP_Background_Sync', 'LDAP_Background_Sync_Interval'], addCronJob);
        server_1.settings.watchMultiple(['LDAP_Background_Sync_Avatars', 'LDAP_Background_Sync_Avatars_Interval'], addAvatarCronJob);
        server_1.settings.watchMultiple(['LDAP_Sync_AutoLogout_Enabled', 'LDAP_Sync_AutoLogout_Interval'], addLogoutCronJob);
        server_1.settings.watch('LDAP_Enable', () => __awaiter(void 0, void 0, void 0, function* () {
            yield addCronJob();
            yield addAvatarCronJob();
            yield addLogoutCronJob();
        }));
        server_1.settings.watch('LDAP_Groups_To_Rocket_Chat_Teams', (value) => {
            try {
                Manager_1.LDAPEEManager.validateLDAPTeamsMappingChanges(value);
            }
            catch (error) {
                Logger_1.logger.error(error);
            }
        });
        callbacks_1.callbacks.add('mapLDAPUserData', (userData, ldapUser) => {
            if (!ldapUser) {
                return;
            }
            Manager_1.LDAPEEManager.copyCustomFields(ldapUser, userData);
            Manager_1.LDAPEEManager.copyActiveState(ldapUser, userData);
        }, callbacks_1.callbacks.priority.MEDIUM, 'mapLDAPCustomFields');
        callbacks_1.callbacks.add('onLDAPLogin', (_a, ldap_2) => __awaiter(void 0, [_a, ldap_2], void 0, function* ({ user, ldapUser, isNewUser }, ldap) {
            if (!ldap) {
                return;
            }
            yield Manager_1.LDAPEEManager.advancedSyncForUser(ldap, user, isNewUser, ldapUser.dn);
        }), callbacks_1.callbacks.priority.MEDIUM, 'advancedLDAPSync');
    }));
}));
