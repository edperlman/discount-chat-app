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
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const auditedSettingUpdates_1 = require("../../../../server/settings/lib/auditedSettingUpdates");
const twoFactorRequired_1 = require("../../../2fa/server/twoFactorRequired");
const lib_1 = require("../../../authorization/lib");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../settings/server");
const disableCustomScripts_1 = require("../functions/disableCustomScripts");
const notifyListener_1 = require("../lib/notifyListener");
const validJSON = check_1.Match.Where((value) => {
    try {
        value === '' || JSON.parse(value);
        return true;
    }
    catch (_) {
        throw new meteor_1.Meteor.Error('Invalid JSON provided');
    }
});
meteor_1.Meteor.methods({
    saveSettings: (0, twoFactorRequired_1.twoFactorRequired)(function () {
        return __awaiter(this, arguments, void 0, function* (params = []) {
            const uid = meteor_1.Meteor.userId();
            const settingsNotAllowed = [];
            if (uid === null) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Editing settings is not allowed', {
                    method: 'saveSetting',
                });
            }
            const editPrivilegedSetting = yield (0, hasPermission_1.hasPermissionAsync)(uid, 'edit-privileged-setting');
            const manageSelectedSettings = yield (0, hasPermission_1.hasPermissionAsync)(uid, 'manage-selected-settings');
            // if the id contains Organization_Name then change the Site_Name
            const orgName = params.find(({ _id }) => _id === 'Organization_Name');
            if (orgName) {
                // check if the site name is still the default value or ifs the same as organization name
                const siteName = yield models_1.Settings.findOneById('Site_Name');
                if ((siteName === null || siteName === void 0 ? void 0 : siteName.value) === (siteName === null || siteName === void 0 ? void 0 : siteName.packageValue) || (siteName === null || siteName === void 0 ? void 0 : siteName.value) === server_1.settings.get('Organization_Name')) {
                    params.push({
                        _id: 'Site_Name',
                        value: orgName.value,
                    });
                }
            }
            yield Promise.all(params.map((_a) => __awaiter(this, [_a], void 0, function* ({ _id, value }) {
                // Verify the _id passed in is a string.
                (0, check_1.check)(_id, String);
                if (!editPrivilegedSetting && !(manageSelectedSettings && (yield (0, hasPermission_1.hasPermissionAsync)(uid, (0, lib_1.getSettingPermissionId)(_id))))) {
                    return settingsNotAllowed.push(_id);
                }
                // Disable custom scripts in cloud trials to prevent phishing campaigns
                if ((0, disableCustomScripts_1.disableCustomScripts)() && /^Custom_Script_/.test(_id)) {
                    return settingsNotAllowed.push(_id);
                }
                const setting = yield models_1.Settings.findOneById(_id);
                // Verify the value is what it should be
                switch (setting === null || setting === void 0 ? void 0 : setting.type) {
                    case 'roomPick':
                        (0, check_1.check)(value, check_1.Match.OneOf([Object], ''));
                        break;
                    case 'boolean':
                        (0, check_1.check)(value, Boolean);
                        break;
                    case 'timespan':
                    case 'int':
                        (0, check_1.check)(value, Number);
                        if (!Number.isInteger(value)) {
                            throw new meteor_1.Meteor.Error(`Invalid setting value ${value}`, 'Invalid setting value', {
                                method: 'saveSettings',
                            });
                        }
                        break;
                    case 'multiSelect':
                        (0, check_1.check)(value, Array);
                        break;
                    case 'code':
                        (0, check_1.check)(value, String);
                        if ((0, core_typings_1.isSettingCode)(setting) && setting.code === 'application/json') {
                            (0, check_1.check)(value, validJSON);
                        }
                        break;
                    default:
                        (0, check_1.check)(value, String);
                        break;
                }
            })));
            if (settingsNotAllowed.length) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Editing settings is not allowed', {
                    method: 'saveSettings',
                    settingIds: settingsNotAllowed,
                });
            }
            const auditSettingOperation = (0, auditedSettingUpdates_1.updateAuditedByUser)({
                _id: uid,
                username: (yield meteor_1.Meteor.userAsync()).username,
                ip: this.connection.clientAddress || '',
                useragent: this.connection.httpHeaders['user-agent'] || '',
            });
            const promises = params.map(({ _id, value }) => auditSettingOperation(models_1.Settings.updateValueById, _id, value));
            (yield Promise.all(promises)).forEach((value, index) => {
                if (value === null || value === void 0 ? void 0 : value.modifiedCount) {
                    void (0, notifyListener_1.notifyOnSettingChangedById)(params[index]._id);
                }
            });
            return true;
        });
    }, {}),
});
