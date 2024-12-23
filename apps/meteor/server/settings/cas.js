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
exports.createCasSettings = void 0;
const server_1 = require("../../app/settings/server");
const createCasSettings = () => server_1.settingsRegistry.addGroup('CAS', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.add('CAS_enabled', false, { type: 'boolean', group: 'CAS', public: true });
        yield this.add('CAS_base_url', '', { type: 'string', group: 'CAS', public: true });
        yield this.add('CAS_login_url', '', { type: 'string', group: 'CAS', public: true });
        yield this.add('CAS_version', '1.0', {
            type: 'select',
            values: [
                { key: '1.0', i18nLabel: '1.0' },
                { key: '2.0', i18nLabel: '2.0' },
            ],
            group: 'CAS',
        });
        yield this.add('CAS_trust_username', false, {
            type: 'boolean',
            group: 'CAS',
            public: true,
            i18nDescription: 'CAS_trust_username_description',
        });
        // Enable/disable user creation
        yield this.add('CAS_Creation_User_Enabled', true, { type: 'boolean', group: 'CAS' });
        yield this.section('Attribute_handling', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // Enable/disable sync
                yield this.add('CAS_Sync_User_Data_Enabled', true, { type: 'boolean' });
                // Attribute mapping table
                yield this.add('CAS_Sync_User_Data_FieldMap', '{}', { type: 'string' });
            });
        });
        yield this.section('CAS_Login_Layout', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.add('CAS_popup_width', 810, { type: 'int', group: 'CAS', public: true });
                yield this.add('CAS_popup_height', 610, { type: 'int', group: 'CAS', public: true });
                yield this.add('CAS_button_label_text', 'CAS', { type: 'string', group: 'CAS' });
                yield this.add('CAS_button_label_color', '#FFFFFF', { type: 'color', group: 'CAS', alert: 'OAuth_button_colors_alert' });
                yield this.add('CAS_button_color', '#1d74f5', { type: 'color', group: 'CAS', alert: 'OAuth_button_colors_alert' });
                yield this.add('CAS_autoclose', true, { type: 'boolean', group: 'CAS' });
            });
        });
    });
});
exports.createCasSettings = createCasSettings;
