"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAccountPreferencesValues = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const useAccountPreferencesValues = () => {
    var _a, _b;
    const language = (0, ui_contexts_1.useUserPreference)('language') || '';
    const userDontAskAgainList = (0, ui_contexts_1.useUserPreference)('dontAskAgainList') || [];
    const dontAskAgainList = userDontAskAgainList.map(({ action }) => action);
    const enableAutoAway = (0, ui_contexts_1.useUserPreference)('enableAutoAway');
    const idleTimeLimit = (0, ui_contexts_1.useUserPreference)('idleTimeLimit');
    const desktopNotificationRequireInteraction = (0, ui_contexts_1.useUserPreference)('desktopNotificationRequireInteraction');
    const desktopNotifications = (0, ui_contexts_1.useUserPreference)('desktopNotifications');
    const pushNotifications = (0, ui_contexts_1.useUserPreference)('pushNotifications');
    const emailNotificationMode = (0, ui_contexts_1.useUserPreference)('emailNotificationMode');
    const receiveLoginDetectionEmail = (0, ui_contexts_1.useUserPreference)('receiveLoginDetectionEmail');
    const notifyCalendarEvents = (0, ui_contexts_1.useUserPreference)('notifyCalendarEvents');
    const enableMobileRinging = (0, ui_contexts_1.useUserPreference)('enableMobileRinging');
    const unreadAlert = (0, ui_contexts_1.useUserPreference)('unreadAlert');
    const showThreadsInMainChannel = (0, ui_contexts_1.useUserPreference)('showThreadsInMainChannel');
    const alsoSendThreadToChannel = (0, ui_contexts_1.useUserPreference)('alsoSendThreadToChannel');
    const useEmojis = (0, ui_contexts_1.useUserPreference)('useEmojis');
    const convertAsciiEmoji = (0, ui_contexts_1.useUserPreference)('convertAsciiEmoji');
    const autoImageLoad = (0, ui_contexts_1.useUserPreference)('autoImageLoad');
    const saveMobileBandwidth = (0, ui_contexts_1.useUserPreference)('saveMobileBandwidth');
    const collapseMediaByDefault = (0, ui_contexts_1.useUserPreference)('collapseMediaByDefault');
    const hideFlexTab = (0, ui_contexts_1.useUserPreference)('hideFlexTab');
    const sendOnEnter = (0, ui_contexts_1.useUserPreference)('sendOnEnter');
    const displayAvatars = (0, ui_contexts_1.useUserPreference)('displayAvatars');
    const highlights = (_b = (_a = (0, ui_contexts_1.useUserPreference)('highlights')) === null || _a === void 0 ? void 0 : _a.join(',\n')) !== null && _b !== void 0 ? _b : '';
    const newRoomNotification = (0, ui_contexts_1.useUserPreference)('newRoomNotification');
    const newMessageNotification = (0, ui_contexts_1.useUserPreference)('newMessageNotification');
    const muteFocusedConversations = (0, ui_contexts_1.useUserPreference)('muteFocusedConversations');
    const masterVolume = (0, ui_contexts_1.useUserPreference)('masterVolume', 100);
    const notificationsSoundVolume = (0, ui_contexts_1.useUserPreference)('notificationsSoundVolume', 100);
    const voipRingerVolume = (0, ui_contexts_1.useUserPreference)('voipRingerVolume', 100);
    return {
        language,
        dontAskAgainList,
        enableAutoAway,
        idleTimeLimit,
        desktopNotificationRequireInteraction,
        desktopNotifications,
        pushNotifications,
        emailNotificationMode,
        receiveLoginDetectionEmail,
        notifyCalendarEvents,
        enableMobileRinging,
        unreadAlert,
        showThreadsInMainChannel,
        alsoSendThreadToChannel,
        useEmojis,
        convertAsciiEmoji,
        autoImageLoad,
        saveMobileBandwidth,
        collapseMediaByDefault,
        hideFlexTab,
        sendOnEnter,
        displayAvatars,
        highlights,
        newRoomNotification,
        newMessageNotification,
        muteFocusedConversations,
        masterVolume,
        notificationsSoundVolume,
        voipRingerVolume,
    };
};
exports.useAccountPreferencesValues = useAccountPreferencesValues;
