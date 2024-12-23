"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadMessageItem = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const SystemMessage_1 = __importDefault(require("../../../../../components/message/variants/SystemMessage"));
const ThreadMessage_1 = __importDefault(require("../../../../../components/message/variants/ThreadMessage"));
const useFormatDate_1 = require("../../../../../hooks/useFormatDate");
const isMessageNewDay_1 = require("../../../MessageList/lib/isMessageNewDay");
const DateListProvider_1 = require("../../../providers/DateListProvider");
const ThreadMessageItem = ({ message, previous, shouldShowAsSequential, showUserAvatar, firstUnread, system, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatDate = (0, useFormatDate_1.useFormatDate)();
    const ref = (0, DateListProvider_1.useDateRef)();
    const newDay = (0, isMessageNewDay_1.isMessageNewDay)(message, previous);
    const showDivider = newDay || firstUnread;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [showDivider && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ role: 'listitem', ref: ref, "data-id": message.ts }, (newDay && {
                'data-time': new Date(message.ts)
                    .toISOString()
                    .replaceAll(/[-T:.]/g, '')
                    .substring(0, 8),
            }), { children: (0, jsx_runtime_1.jsx)(fuselage_1.MessageDivider, { unreadLabel: firstUnread ? t('Unread_Messages').toLowerCase() : undefined, children: newDay && ((0, jsx_runtime_1.jsx)(fuselage_1.Bubble, { small: true, secondary: true, children: formatDate(message.ts) })) }) }))), system ? ((0, jsx_runtime_1.jsx)(SystemMessage_1.default, { message: message, showUserAvatar: showUserAvatar })) : ((0, jsx_runtime_1.jsx)(ThreadMessage_1.default, { message: message, sequential: shouldShowAsSequential, unread: firstUnread, showUserAvatar: showUserAvatar }))] }));
};
exports.ThreadMessageItem = ThreadMessageItem;
