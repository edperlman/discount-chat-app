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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const isTruthy_1 = require("../../../lib/isTruthy");
const system_1 = require("../../lib/logger/system");
const migrations_1 = require("../../lib/migrations");
const newDefaultButtonColor = '#e4e7ea';
const newDefaultButtonLabelColor = '#1f2329';
const settingsToUpdate = [
    // button background colors
    { key: 'SAML_Custom_Default_button_color', defaultValue: '#1d74f5', newValue: newDefaultButtonColor },
    { key: 'CAS_button_color', defaultValue: '#1d74f5', newValue: newDefaultButtonColor },
    { key: 'Accounts_OAuth_Nextcloud_button_color', defaultValue: '#0082c9', newValue: newDefaultButtonColor },
    { key: 'Accounts_OAuth_Dolphin_button_color', defaultValue: '#1d74f5', newValue: newDefaultButtonColor },
    // button label colors
    { key: 'SAML_Custom_Default_button_label_color', defaultValue: '#1d74f5', newValue: newDefaultButtonLabelColor },
    { key: 'CAS_button_label_color', defaultValue: '#1d74f5', newValue: newDefaultButtonLabelColor },
    { key: 'Accounts_OAuth_Nextcloud_button_label_color', defaultValue: '#1d74f5', newValue: newDefaultButtonLabelColor },
    { key: 'Accounts_OAuth_Dolphin_button_label_color', defaultValue: '#1d74f5', newValue: newDefaultButtonLabelColor },
];
const getSettingValue = (key) => __awaiter(void 0, void 0, void 0, function* () { return models_1.Settings.getValueById(key); });
function updateOAuthServices() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const services = yield models_1.Settings.find({ _id: { $regex: /^(Accounts_OAuth_|Accounts_OAuth_Custom-)[a-z0-9_]+$/i } }).toArray();
        const filteredServices = services.filter(({ value }) => typeof value === 'boolean');
        try {
            for (var _d = true, filteredServices_1 = __asyncValues(filteredServices), filteredServices_1_1; filteredServices_1_1 = yield filteredServices_1.next(), _a = filteredServices_1_1.done, !_a; _d = true) {
                _c = filteredServices_1_1.value;
                _d = false;
                const { _id: key, value } = _c;
                if (value !== true) {
                    continue;
                }
                let serviceName = key.replace('Accounts_OAuth_', '');
                if (serviceName === 'Meteor') {
                    serviceName = 'meteor-developer';
                }
                if (/Accounts_OAuth_Custom-/.test(key)) {
                    serviceName = key.replace('Accounts_OAuth_Custom-', '');
                }
                const serviceKey = serviceName.toLowerCase();
                const data = {};
                if (/Accounts_OAuth_Custom-/.test(key)) {
                    data.buttonLabelColor = (yield getSettingValue(`${key}-button_label_color`));
                    data.buttonColor = (yield getSettingValue(`${key}-button_color`));
                }
                if (serviceName === 'Nextcloud') {
                    data.buttonLabelColor = (yield getSettingValue('Accounts_OAuth_Nextcloud_button_label_color'));
                    data.buttonColor = (yield getSettingValue('Accounts_OAuth_Nextcloud_button_color'));
                }
                yield models_1.LoginServiceConfiguration.createOrUpdateService(serviceKey, data);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = filteredServices_1.return)) yield _b.call(filteredServices_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
(0, migrations_1.addMigration)({
    version: 317,
    name: 'Change default color of OAuth login services buttons',
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: audit
            const promises = settingsToUpdate
                .map((_a) => __awaiter(this, [_a], void 0, function* ({ key, defaultValue, newValue }) {
                const oldSettingValue = yield getSettingValue(key);
                if (!oldSettingValue || oldSettingValue !== defaultValue) {
                    return;
                }
                system_1.SystemLogger.warn(`The default value of the setting ${key} has changed to ${newValue}. Please review your settings.`);
                return models_1.Settings.updateOne({ _id: key }, { $set: { value: newValue } });
            }))
                .filter(isTruthy_1.isTruthy);
            yield Promise.all(promises);
            const customOAuthButtonColors = yield models_1.Settings.find({
                _id: { $regex: /^Accounts_OAuth_Custom-[a-zA-Z0-9_-]+-button_color$/ },
            }).toArray();
            const customOAuthButtonLabelColors = yield models_1.Settings.find({
                _id: { $regex: /^Accounts_OAuth_Custom-[a-zA-Z0-9_-]+-button_label_color$/ },
            }).toArray();
            const buttonColorPromises = customOAuthButtonColors
                .map(({ _id, value, packageValue }) => {
                if (packageValue !== value) {
                    return;
                }
                system_1.SystemLogger.warn(`The default value of the custom setting ${_id} has changed to ${newDefaultButtonColor}. Please review your settings.`);
                return models_1.Settings.updateOne({ _id }, { $set: { value: newDefaultButtonColor } });
            })
                .filter(isTruthy_1.isTruthy);
            const buttonLabelColorPromises = customOAuthButtonLabelColors
                .map(({ _id, value, packageValue }) => {
                if (packageValue !== value) {
                    return;
                }
                system_1.SystemLogger.warn(`The default value of the custom setting ${_id} has changed to ${newDefaultButtonLabelColor}. Please review your settings.`);
                return models_1.Settings.updateOne({ _id }, { $set: { value: newDefaultButtonLabelColor } });
            })
                .filter(isTruthy_1.isTruthy);
            yield Promise.all([...buttonColorPromises, ...buttonLabelColorPromises]);
            // update login service configurations
            yield updateOAuthServices();
        });
    },
});
