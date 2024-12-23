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
exports.changeSettingValue = changeSettingValue;
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../../../app/settings/server");
const Middleware_1 = require("../../../../app/settings/server/Middleware");
function changeSettingValue(record) {
    var _a;
    if (!record.enterprise) {
        return record.value;
    }
    if (!license_1.License.hasValidLicense()) {
        return record.invalidValue;
    }
    if (!((_a = record.modules) === null || _a === void 0 ? void 0 : _a.length)) {
        return record.value;
    }
    for (const moduleName of record.modules) {
        if (!license_1.License.hasModule(moduleName)) {
            return record.invalidValue;
        }
    }
    return record.value;
}
server_1.settings.set = (0, Middleware_1.use)(server_1.settings.set, (context, next) => {
    const [record] = context;
    if (!record.enterprise) {
        return next(...context);
    }
    const value = changeSettingValue(record);
    return next(Object.assign(Object.assign({}, record), { value }));
});
server_1.SettingsEvents.on('fetch-settings', (settings) => {
    for (const setting of settings) {
        const changedValue = changeSettingValue(setting);
        if (changedValue === undefined) {
            continue;
        }
        setting.value = changedValue;
    }
});
function updateSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        const enterpriseSettings = yield models_1.Settings.findEnterpriseSettings();
        void enterpriseSettings.forEach((record) => server_1.settings.set(record));
    });
}
meteor_1.Meteor.startup(() => __awaiter(void 0, void 0, void 0, function* () {
    yield updateSettings();
    license_1.License.onValidateLicense(updateSettings);
    license_1.License.onInvalidateLicense(updateSettings);
    license_1.License.onRemoveLicense(updateSettings);
}));
