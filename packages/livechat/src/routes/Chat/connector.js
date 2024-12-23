"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatConnector = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const hooks_1 = require("preact/hooks");
const react_i18next_1 = require("react-i18next");
const _1 = require(".");
const ScreenProvider_1 = require("../../components/Screen/ScreenProvider");
const canRenderMessage_1 = require("../../helpers/canRenderMessage");
const formatAgent_1 = require("../../helpers/formatAgent");
const store_1 = require("../../store");
const ChatConnector = ({ ref, t }) => {
    const { theme } = (0, hooks_1.useContext)(ScreenProvider_1.ScreenContext);
    const { config: { settings: { fileUpload: uploads, allowSwitchingDepartments, forceAcceptDataProcessingConsent: allowRemoveUserData, showConnecting, registrationForm, nameFieldRegistrationForm, emailFieldRegistrationForm, limitTextLength, visitorsCanCloseChat, }, messages: { conversationFinishedMessage }, theme: { title = '' } = {}, departments = {}, }, iframe: { theme: { title: customTitle = '' } = {}, guest = {} }, token, agent, sound, user, room, messages, noMoreMessages, typing, loading, dispatch, alerts, visible, unread, lastReadMessageId, triggerAgent, queueInfo, incomingCallAlert, ongoingCall, messageListPosition, } = (0, hooks_1.useContext)(store_1.StoreContext);
    return ((0, jsx_runtime_1.jsx)(_1.ChatContainer, { ref: ref, title: customTitle || title || t('need_help'), sound: sound, token: token, user: user, agent: (0, formatAgent_1.formatAgent)(agent), room: room, messages: messages === null || messages === void 0 ? void 0 : messages.filter(canRenderMessage_1.canRenderMessage), noMoreMessages: noMoreMessages, emoji: true, uploads: uploads, typingUsernames: Array.isArray(typing) ? typing : [], loading: loading, showConnecting: showConnecting, connecting: !!(room && !agent && (showConnecting || queueInfo)), dispatch: dispatch, departments: departments, allowSwitchingDepartments: allowSwitchingDepartments, conversationFinishedMessage: conversationFinishedMessage || t('conversation_finished'), allowRemoveUserData: allowRemoveUserData, alerts: alerts, visible: visible, unread: unread, lastReadMessageId: lastReadMessageId, guest: guest, triggerAgent: triggerAgent, queueInfo: queueInfo
            ? {
                spot: queueInfo.spot,
                estimatedWaitTimeSeconds: queueInfo.estimatedWaitTimeSeconds,
                message: queueInfo.message,
            }
            : undefined, registrationFormEnabled: registrationForm, nameFieldRegistrationForm: nameFieldRegistrationForm, emailFieldRegistrationForm: emailFieldRegistrationForm, limitTextLength: limitTextLength, incomingCallAlert: incomingCallAlert, ongoingCall: ongoingCall, messageListPosition: messageListPosition, theme: theme, visitorsCanCloseChat: visitorsCanCloseChat }));
};
exports.ChatConnector = ChatConnector;
exports.default = (0, react_i18next_1.withTranslation)()(exports.ChatConnector);
