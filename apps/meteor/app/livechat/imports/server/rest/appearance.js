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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const isTruthy_1 = require("../../../../../lib/isTruthy");
const auditedSettingUpdates_1 = require("../../../../../server/settings/lib/auditedSettingUpdates");
const server_1 = require("../../../../api/server");
const notifyListener_1 = require("../../../../lib/server/lib/notifyListener");
const appearance_1 = require("../../../server/api/lib/appearance");
server_1.API.v1.addRoute('livechat/appearance', {
    authRequired: true,
    permissionsRequired: ['view-livechat-manager'],
    validateParams: {
        POST: rest_typings_1.isPOSTLivechatAppearanceParams,
    },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { appearance } = yield (0, appearance_1.findAppearance)();
            return server_1.API.v1.success({
                appearance,
            });
        });
    },
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = this.bodyParams;
            const validSettingList = [
                'Livechat_title',
                'Livechat_title_color',
                'Livechat_enable_message_character_limit',
                'Livechat_message_character_limit',
                'Livechat_show_agent_info',
                'Livechat_show_agent_email',
                'Livechat_display_offline_form',
                'Livechat_offline_form_unavailable',
                'Livechat_offline_message',
                'Livechat_offline_success_message',
                'Livechat_offline_title',
                'Livechat_offline_title_color',
                'Livechat_offline_email',
                'Livechat_conversation_finished_message',
                'Livechat_conversation_finished_text',
                'Livechat_registration_form',
                'Livechat_name_field_registration_form',
                'Livechat_email_field_registration_form',
                'Livechat_registration_form_message',
                'Livechat_hide_watermark',
                'Livechat_background',
                'Livechat_widget_position',
                'Livechat_hide_system_messages',
                'Omnichannel_allow_visitors_to_close_conversation',
            ];
            const valid = settings.every((setting) => validSettingList.includes(setting._id));
            if (!valid) {
                throw new Error('invalid-setting');
            }
            const dbSettings = yield models_1.Settings.findByIds(validSettingList, { projection: { _id: 1, value: 1, type: 1, values: 1 } })
                .map((dbSetting) => {
                const setting = settings.find(({ _id }) => _id === dbSetting._id);
                if (!setting || dbSetting.value === setting.value) {
                    return;
                }
                if (dbSetting.type === 'multiSelect' && (!Array.isArray(setting.value) || !validateValues(setting.value, dbSetting.values))) {
                    return;
                }
                switch (dbSetting === null || dbSetting === void 0 ? void 0 : dbSetting.type) {
                    case 'boolean':
                        return {
                            _id: dbSetting._id,
                            value: setting.value === 'true' || setting.value === true,
                        };
                    case 'int':
                        return {
                            _id: dbSetting._id,
                            value: coerceInt(setting.value),
                        };
                    default:
                        return {
                            _id: dbSetting._id,
                            value: setting === null || setting === void 0 ? void 0 : setting.value,
                        };
                }
            })
                .toArray();
            const eligibleSettings = dbSettings.filter(isTruthy_1.isTruthy);
            const auditSettingOperation = (0, auditedSettingUpdates_1.updateAuditedByUser)({
                _id: this.userId,
                username: this.user.username,
                ip: this.requestIp,
                useragent: this.request.headers['user-agent'] || '',
            });
            const promises = eligibleSettings.map(({ _id, value }) => auditSettingOperation(models_1.Settings.updateValueById, _id, value));
            (yield Promise.all(promises)).forEach((value, index) => {
                if (value === null || value === void 0 ? void 0 : value.modifiedCount) {
                    void (0, notifyListener_1.notifyOnSettingChangedById)(eligibleSettings[index]._id);
                }
            });
            return server_1.API.v1.success();
        });
    },
});
function validateValues(values, allowedValues = []) {
    return values.every((value) => allowedValues.some((allowedValue) => allowedValue.key === value));
}
function coerceInt(value) {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'boolean') {
        return 0;
    }
    if (Array.isArray(value)) {
        return 0;
    }
    const parsedValue = parseInt(value, 10);
    if (Number.isNaN(parsedValue)) {
        return 0;
    }
    return parsedValue;
}
