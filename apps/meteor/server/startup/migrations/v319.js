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
const server_1 = require("../../../app/settings/server");
const migrations_1 = require("../../lib/migrations");
const maxAgeSettingMap = new Map([
    ['RetentionPolicy_MaxAge_Channels', 'RetentionPolicy_TTL_Channels'],
    ['RetentionPolicy_MaxAge_Groups', 'RetentionPolicy_TTL_Groups'],
    ['RetentionPolicy_MaxAge_DMs', 'RetentionPolicy_TTL_DMs'],
]);
(0, migrations_1.addMigration)({
    version: 318,
    name: 'Move retention policy settings',
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            const convertDaysToMs = (days) => days * 24 * 60 * 60 * 1000;
            const promises = [];
            yield models_1.Settings.find(
            // we have to test value to avoid updating records that were changed before this version
            { _id: { $in: Array.from(maxAgeSettingMap.keys()) }, value: { $ne: -1 } }, { projection: { _id: 1, value: 1 } }).forEach(({ _id, value }) => {
                const newSettingId = maxAgeSettingMap.get(_id);
                if (!newSettingId) {
                    throw new Error(`moveRetentionSetting - Setting ${_id} equivalent does not exist`);
                }
                const newValue = convertDaysToMs(Number(value));
                // TODO: audit
                promises.push(models_1.Settings.updateOne({
                    _id: maxAgeSettingMap.get(_id),
                }, {
                    $set: {
                        value: newValue,
                    },
                }));
                // This is necessary because the cachedCollection is started before watchDb is initialized
                const currentCache = server_1.settings.getSetting(newSettingId);
                if (!currentCache) {
                    return;
                }
                server_1.settings.set(Object.assign(Object.assign({}, currentCache), { value: newValue }));
            });
            yield Promise.all(promises);
            yield models_1.Settings.deleteMany({ _id: { $in: Array.from(maxAgeSettingMap.keys()) } });
        });
    },
});
