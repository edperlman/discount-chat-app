"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageListItem = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const RoomMessage_1 = __importDefault(require("../../../components/message/variants/RoomMessage"));
const SystemMessage_1 = __importDefault(require("../../../components/message/variants/SystemMessage"));
const ThreadMessagePreview_1 = __importDefault(require("../../../components/message/variants/ThreadMessagePreview"));
const useFormatDate_1 = require("../../../hooks/useFormatDate");
const DateListProvider_1 = require("../providers/DateListProvider");
const isMessageNewDay_1 = require("./lib/isMessageNewDay");
const MessageListItem = ({ message, previous, showUnreadDivider, sequential, showUserAvatar, visible, subscription, system, }) => {
    var _a, _b, _c, _d;
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatDate = (0, useFormatDate_1.useFormatDate)();
    const ref = (0, DateListProvider_1.useDateRef)();
    const newDay = (0, isMessageNewDay_1.isMessageNewDay)(message, previous);
    const showDivider = newDay || showUnreadDivider;
    const unread = Boolean((_a = subscription === null || subscription === void 0 ? void 0 : subscription.tunread) === null || _a === void 0 ? void 0 : _a.includes(message._id));
    const mention = Boolean((_b = subscription === null || subscription === void 0 ? void 0 : subscription.tunreadUser) === null || _b === void 0 ? void 0 : _b.includes(message._id));
    const all = Boolean((_c = subscription === null || subscription === void 0 ? void 0 : subscription.tunreadGroup) === null || _c === void 0 ? void 0 : _c.includes(message._id));
    const ignoredUser = Boolean((_d = subscription === null || subscription === void 0 ? void 0 : subscription.ignored) === null || _d === void 0 ? void 0 : _d.includes(message.u._id));
    const shouldShowAsSequential = sequential && !newDay;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [showDivider && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ ref: ref, "data-id": message.ts, role: 'listitem' }, (newDay && {
                'data-time': new Date(message.ts)
                    .toISOString()
                    .replaceAll(/[-T:.]/g, '')
                    .substring(0, 8),
            }), { children: (0, jsx_runtime_1.jsx)(fuselage_1.MessageDivider, { unreadLabel: showUnreadDivider ? t('Unread_Messages').toLowerCase() : undefined, children: newDay && ((0, jsx_runtime_1.jsx)(fuselage_1.Bubble, { small: true, secondary: true, children: formatDate(message.ts) })) }) }))), visible && ((0, jsx_runtime_1.jsx)(RoomMessage_1.default, { message: message, showUserAvatar: showUserAvatar, sequential: shouldShowAsSequential, unread: unread, mention: mention, all: all, ignoredUser: ignoredUser })), (0, core_typings_1.isThreadMessage)(message) && ((0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(ThreadMessagePreview_1.default, { "data-mid": message._id, "data-tmid": message.tmid, "data-unread": showUnreadDivider, "data-sequential": sequential, sequential: shouldShowAsSequential, message: message, showUserAvatar: showUserAvatar }) })), system && (0, jsx_runtime_1.jsx)(SystemMessage_1.default, { showUserAvatar: showUserAvatar, message: message })] }));
};
exports.MessageListItem = MessageListItem;
