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
exports.addSettings = void 0;
const server_1 = require("../../../app/settings/server");
const addSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    const omnichannelEnabledQuery = { _id: 'Livechat_enabled', value: true };
    return server_1.settingsRegistry.addGroup('Omnichannel', function () {
        return __awaiter(this, void 0, void 0, function* () {
            return this.with({
                enterprise: true,
                modules: ['livechat-enterprise', 'contact-id-verification'],
                section: 'Contact_identification',
                enableQuery: omnichannelEnabledQuery,
                public: true,
            }, function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield this.add('Livechat_Block_Unknown_Contacts', false, {
                        type: 'boolean',
                        invalidValue: false,
                    });
                    yield this.add('Livechat_Block_Unverified_Contacts', false, {
                        type: 'boolean',
                        invalidValue: false,
                    });
                    yield this.add('Livechat_Require_Contact_Verification', 'never', {
                        type: 'select',
                        values: [
                            { key: 'never', i18nLabel: 'Never' },
                            { key: 'once', i18nLabel: 'Once' },
                            { key: 'always', i18nLabel: 'On_All_Contacts' },
                        ],
                        invalidValue: 'never',
                    });
                });
            });
        });
    });
});
exports.addSettings = addSettings;
