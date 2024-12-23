"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const MessageListContext_1 = require("./list/MessageListContext");
const StatusIndicators = ({ message }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const translated = (0, MessageListContext_1.useShowTranslated)(message);
    const starred = (0, MessageListContext_1.useShowStarred)({ message });
    const following = (0, MessageListContext_1.useShowFollowing)({ message });
    const isEncryptedMessage = (0, core_typings_1.isE2EEMessage)(message) || (0, core_typings_1.isE2EEPinnedMessage)(message);
    const isOtrMessage = (0, core_typings_1.isOTRMessage)(message) || (0, core_typings_1.isOTRAckMessage)(message);
    const uid = (0, ui_contexts_1.useUserId)();
    const formatter = (0, MessageListContext_1.useMessageDateFormatter)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.MessageStatusIndicator, { children: [translated && (0, jsx_runtime_1.jsx)(fuselage_1.MessageStatusIndicatorItem, { name: 'language', title: t('Translated') }), following && (0, jsx_runtime_1.jsx)(fuselage_1.MessageStatusIndicatorItem, { name: 'bell', title: t('Following') }), message.sentByEmail && (0, jsx_runtime_1.jsx)(fuselage_1.MessageStatusIndicatorItem, { name: 'mail', title: t('Message_sent_by_email') }), (0, core_typings_1.isEditedMessage)(message) && ((0, jsx_runtime_1.jsx)(fuselage_1.MessageStatusIndicatorItem, { name: 'edit', color: message.u._id !== message.editedBy._id ? 'danger' : undefined, title: message.editedBy._id === uid
                    ? t('Message_has_been_edited_at', { date: formatter(message.editedAt) })
                    : t('Message_has_been_edited_by_at', {
                        username: message.editedBy.username || '?',
                        date: formatter(message.editedAt),
                    }) })), message.pinned && (0, jsx_runtime_1.jsx)(fuselage_1.MessageStatusIndicatorItem, { name: 'pin', title: t('Message_has_been_pinned') }), isEncryptedMessage && (0, jsx_runtime_1.jsx)(fuselage_1.MessageStatusIndicatorItem, { name: 'key' }), isOtrMessage && (0, jsx_runtime_1.jsx)(fuselage_1.MessageStatusIndicatorItem, { name: 'stopwatch' }), starred && (0, jsx_runtime_1.jsx)(fuselage_1.MessageStatusIndicatorItem, { name: 'star-filled', title: t('Message_has_been_starred') })] }));
};
exports.default = StatusIndicators;
