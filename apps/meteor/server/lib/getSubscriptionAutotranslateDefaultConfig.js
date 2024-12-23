"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubscriptionAutotranslateDefaultConfig = getSubscriptionAutotranslateDefaultConfig;
const server_1 = require("../../app/settings/server");
function getSubscriptionAutotranslateDefaultConfig(user) {
    var _a;
    if (!server_1.settings.get('AutoTranslate_AutoEnableOnJoinRoom')) {
        return;
    }
    const languageSetting = server_1.settings.get('Language');
    const { language: userLanguage } = ((_a = user.settings) === null || _a === void 0 ? void 0 : _a.preferences) || {};
    if (!userLanguage || userLanguage === 'default' || languageSetting === userLanguage) {
        return;
    }
    return { autoTranslate: true, autoTranslateLanguage: userLanguage };
}
