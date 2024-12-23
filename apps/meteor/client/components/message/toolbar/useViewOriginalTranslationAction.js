"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useViewOriginalTranslationAction = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const client_1 = require("../../../../app/autotranslate/client");
const client_2 = require("../../../../app/models/client");
const roomCoordinator_1 = require("../../../lib/rooms/roomCoordinator");
const autoTranslate_1 = require("../../../views/room/MessageList/lib/autoTranslate");
const useViewOriginalTranslationAction = (message, { room, subscription }) => {
    const user = (0, ui_contexts_1.useUser)();
    const autoTranslateEnabled = (0, ui_contexts_1.useSetting)('AutoTranslate_Enabled', false);
    const canAutoTranslate = (0, ui_contexts_1.usePermission)('auto-translate');
    const translateMessage = (0, ui_contexts_1.useMethod)('autoTranslate.translateMessage');
    const language = (0, react_1.useMemo)(() => (subscription === null || subscription === void 0 ? void 0 : subscription.autoTranslateLanguage) || client_1.AutoTranslate.getLanguage(message.rid), [message.rid, subscription === null || subscription === void 0 ? void 0 : subscription.autoTranslateLanguage]);
    const hasTranslations = (0, react_1.useMemo)(() => (0, autoTranslate_1.hasTranslationLanguageInMessage)(message, language) || (0, autoTranslate_1.hasTranslationLanguageInAttachments)(message.attachments, language), [message, language]);
    if (!autoTranslateEnabled || !canAutoTranslate || !user) {
        return null;
    }
    const isLivechatRoom = roomCoordinator_1.roomCoordinator.isLivechatRoom(room === null || room === void 0 ? void 0 : room.t);
    const isDifferentUser = (message === null || message === void 0 ? void 0 : message.u) && message.u._id !== user._id;
    const autoTranslationActive = (subscription === null || subscription === void 0 ? void 0 : subscription.autoTranslate) || isLivechatRoom;
    if (message.autoTranslateShowInverse || !isDifferentUser || !autoTranslationActive || !hasTranslations) {
        return null;
    }
    return {
        id: 'view-original',
        icon: 'language',
        label: 'View_original',
        context: ['message', 'message-mobile', 'threads'],
        type: 'interaction',
        group: 'menu',
        action() {
            if (!hasTranslations) {
                client_1.AutoTranslate.messageIdsToWait[message._id] = true;
                client_2.Messages.update({ _id: message._id }, { $set: { autoTranslateFetching: true } });
                void translateMessage(message, language);
            }
            const action = 'autoTranslateShowInverse' in message ? '$unset' : '$set';
            client_2.Messages.update({ _id: message._id }, { [action]: { autoTranslateShowInverse: true } });
        },
        order: 90,
    };
};
exports.useViewOriginalTranslationAction = useViewOriginalTranslationAction;
