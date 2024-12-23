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
const cron_validator_1 = require("cron-validator");
const migrations_1 = require("../../lib/migrations");
(0, migrations_1.addMigration)({
    version: 308,
    name: 'Update packageValue from LDAP interval settings',
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            const newAvatarSyncPackageValue = '0 0 * * *';
            const newAutoLogoutPackageValue = '*/5 * * * *';
            const ldapAvatarSyncInterval = yield models_1.Settings.findOneById('LDAP_Background_Sync_Avatars_Interval', {
                projection: { value: 1 },
            });
            const ldapAutoLogoutInterval = yield models_1.Settings.findOneById('LDAP_Sync_AutoLogout_Interval', {
                projection: { value: 1 },
            });
            const isValidAvatarSyncInterval = ldapAvatarSyncInterval && (0, cron_validator_1.isValidCron)(ldapAvatarSyncInterval.value);
            const isValidAutoLogoutInterval = ldapAutoLogoutInterval && (0, cron_validator_1.isValidCron)(ldapAutoLogoutInterval.value);
            // TODO audit
            yield models_1.Settings.updateOne({ _id: 'LDAP_Background_Sync_Avatars_Interval' }, { $set: Object.assign({ packageValue: newAvatarSyncPackageValue }, (!isValidAvatarSyncInterval && { value: newAvatarSyncPackageValue })) });
            yield models_1.Settings.updateOne({ _id: 'LDAP_Sync_AutoLogout_Interval' }, { $set: Object.assign({ packageValue: newAutoLogoutPackageValue }, (!isValidAutoLogoutInterval && { value: newAutoLogoutPackageValue })) });
        });
    },
});
