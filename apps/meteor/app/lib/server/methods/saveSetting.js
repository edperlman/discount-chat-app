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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const auditedSettingUpdates_1 = require("../../../../server/settings/lib/auditedSettingUpdates");
const twoFactorRequired_1 = require("../../../2fa/server/twoFactorRequired");
const lib_1 = require("../../../authorization/lib");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const disableCustomScripts_1 = require("../functions/disableCustomScripts");
const notifyListener_1 = require("../lib/notifyListener");
meteor_1.Meteor.methods({
    saveSetting: (0, twoFactorRequired_1.twoFactorRequired)(function (_id, value, editor) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Editing settings is not allowed', {
                    method: 'saveSetting',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'edit-privileged-setting')) &&
                !(yield (0, hasPermission_1.hasAllPermissionAsync)(uid, ['manage-selected-settings', (0, lib_1.getSettingPermissionId)(_id)]))) {
                // TODO use the same function
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Editing settings is not allowed', {
                    method: 'saveSetting',
                    settingId: _id,
                });
            }
            // Verify the _id passed in is a string.
            (0, check_1.check)(_id, String);
            // Disable custom scripts in cloud trials to prevent phishing campaigns
            if ((0, disableCustomScripts_1.disableCustomScripts)() && /^Custom_Script_/.test(_id)) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Editing settings is not allowed', {
                    method: 'saveSetting',
                    settingId: _id,
                });
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
                case 'int':
                    (0, check_1.check)(value, Number);
                    break;
                default:
                    (0, check_1.check)(value, String);
                    break;
            }
            const auditSettingOperation = (0, auditedSettingUpdates_1.updateAuditedByUser)({
                _id: uid,
                username: (yield meteor_1.Meteor.userAsync()).username,
                ip: ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.clientAddress) || '',
                useragent: ((_b = this.connection) === null || _b === void 0 ? void 0 : _b.httpHeaders['user-agent']) || '',
            });
            (yield auditSettingOperation(models_1.Settings.updateValueAndEditorById, _id, value, editor)).modifiedCount &&
                setting &&
                void (0, notifyListener_1.notifyOnSettingChanged)(Object.assign(Object.assign({}, setting), { editor, value: value }));
            return true;
        });
    }),
});
