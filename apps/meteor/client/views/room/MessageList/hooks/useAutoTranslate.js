"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAutoTranslate = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const client_1 = require("../../../../../app/autotranslate/client");
const roomCoordinator_1 = require("../../../../lib/rooms/roomCoordinator");
const autoTranslate_1 = require("../lib/autoTranslate");
const isOwnUserMessage_1 = require("../lib/isOwnUserMessage");
const useAutoTranslate = (subscription) => {
    const autoTranslateSettingEnabled = (0, ui_contexts_1.useSetting)('AutoTranslate_Enabled', false);
    const isSubscriptionEnabled = autoTranslateSettingEnabled && (subscription === null || subscription === void 0 ? void 0 : subscription.autoTranslateLanguage) && (subscription === null || subscription === void 0 ? void 0 : subscription.autoTranslate);
    const isLivechatRoom = (0, react_1.useMemo)(() => subscription && roomCoordinator_1.roomCoordinator.isLivechatRoom(subscription === null || subscription === void 0 ? void 0 : subscription.t), [subscription]);
    const autoTranslateEnabled = Boolean(isSubscriptionEnabled || isLivechatRoom);
    const autoTranslateLanguage = autoTranslateEnabled && subscription ? client_1.AutoTranslate.getLanguage(subscription.rid) : undefined;
    const showAutoTranslate = (0, react_1.useCallback)((message) => {
        if (!autoTranslateEnabled || !autoTranslateLanguage) {
            return false;
        }
        return (!(0, isOwnUserMessage_1.isOwnUserMessage)(message, subscription) &&
            !message.autoTranslateShowInverse &&
            ((0, autoTranslate_1.hasTranslationLanguageInMessage)(message, autoTranslateLanguage) ||
                (0, autoTranslate_1.hasTranslationLanguageInAttachments)(message.attachments, autoTranslateLanguage)));
    }, [subscription, autoTranslateEnabled, autoTranslateLanguage]);
    return (0, react_1.useMemo)(() => {
        return { autoTranslateEnabled, autoTranslateLanguage, showAutoTranslate };
    }, [autoTranslateEnabled, autoTranslateLanguage, showAutoTranslate]);
};
exports.useAutoTranslate = useAutoTranslate;
