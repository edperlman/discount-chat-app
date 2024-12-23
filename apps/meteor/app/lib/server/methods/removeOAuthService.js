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
const string_helpers_1 = require("@rocket.chat/string-helpers");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const notifyListener_1 = require("../lib/notifyListener");
meteor_1.Meteor.methods({
    removeOAuthService(name) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(name, String);
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'removeOAuthService',
                });
            }
            if ((yield (0, hasPermission_1.hasPermissionAsync)(userId, 'add-oauth-service')) !== true) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', { method: 'removeOAuthService' });
            }
            name = name.toLowerCase().replace(/[^a-z0-9_]/g, '');
            name = (0, string_helpers_1.capitalize)(name);
            const settingsIds = [
                `Accounts_OAuth_Custom-${name}`,
                `Accounts_OAuth_Custom-${name}-url`,
                `Accounts_OAuth_Custom-${name}-token_path`,
                `Accounts_OAuth_Custom-${name}-identity_path`,
                `Accounts_OAuth_Custom-${name}-authorize_path`,
                `Accounts_OAuth_Custom-${name}-scope`,
                `Accounts_OAuth_Custom-${name}-access_token_param`,
                `Accounts_OAuth_Custom-${name}-token_sent_via`,
                `Accounts_OAuth_Custom-${name}-identity_token_sent_via`,
                `Accounts_OAuth_Custom-${name}-id`,
                `Accounts_OAuth_Custom-${name}-secret`,
                `Accounts_OAuth_Custom-${name}-button_label_text`,
                `Accounts_OAuth_Custom-${name}-button_label_color`,
                `Accounts_OAuth_Custom-${name}-button_color`,
                `Accounts_OAuth_Custom-${name}-login_style`,
                `Accounts_OAuth_Custom-${name}-key_field`,
                `Accounts_OAuth_Custom-${name}-username_field`,
                `Accounts_OAuth_Custom-${name}-email_field`,
                `Accounts_OAuth_Custom-${name}-name_field`,
                `Accounts_OAuth_Custom-${name}-avatar_field`,
                `Accounts_OAuth_Custom-${name}-roles_claim`,
                `Accounts_OAuth_Custom-${name}-merge_roles`,
                `Accounts_OAuth_Custom-${name}-roles_to_sync`,
                `Accounts_OAuth_Custom-${name}-merge_users`,
                `Accounts_OAuth_Custom-${name}-show_button`,
                `Accounts_OAuth_Custom-${name}-groups_claim`,
                `Accounts_OAuth_Custom-${name}-channels_admin`,
                `Accounts_OAuth_Custom-${name}-map_channels`,
                `Accounts_OAuth_Custom-${name}-groups_channel_map`,
                `Accounts_OAuth_Custom-${name}-merge_users_distinct_services`,
            ];
            const promises = settingsIds.map((id) => models_1.Settings.removeById(id));
            (yield Promise.all(promises)).forEach((value, index) => {
                if (value === null || value === void 0 ? void 0 : value.deletedCount) {
                    void (0, notifyListener_1.notifyOnSettingChangedById)(settingsIds[index], 'removed');
                }
            });
        });
    },
});
