"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const date_fns_1 = require("date-fns");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const ThreadMessageItem_1 = require("./ThreadMessageItem");
const client_1 = require("../../../../../../app/ui-utils/client");
const isTruthy_1 = require("../../../../../../lib/isTruthy");
const CustomScrollbars_1 = require("../../../../../components/CustomScrollbars");
const BubbleDate_1 = require("../../../BubbleDate");
const isMessageNewDay_1 = require("../../../MessageList/lib/isMessageNewDay");
const MessageListProvider_1 = __importDefault(require("../../../MessageList/providers/MessageListProvider"));
const LoadingMessagesIndicator_1 = __importDefault(require("../../../body/LoadingMessagesIndicator"));
const useDateScroll_1 = require("../../../hooks/useDateScroll");
const useFirstUnreadMessageId_1 = require("../../../hooks/useFirstUnreadMessageId");
const useMessageListNavigation_1 = require("../../../hooks/useMessageListNavigation");
const useLegacyThreadMessageJump_1 = require("../hooks/useLegacyThreadMessageJump");
const useLegacyThreadMessageListScrolling_1 = require("../hooks/useLegacyThreadMessageListScrolling");
const useLegacyThreadMessages_1 = require("../hooks/useLegacyThreadMessages");
require("./threads.css");
const isMessageSequential = (current, previous, groupingRange) => {
    if (!previous) {
        return false;
    }
    if (client_1.MessageTypes.isSystemMessage(current) || client_1.MessageTypes.isSystemMessage(previous)) {
        return false;
    }
    if (current.groupable === false) {
        return false;
    }
    if (current.u._id !== previous.u._id) {
        return false;
    }
    if (current.alias !== previous.alias) {
        return false;
    }
    return (0, date_fns_1.differenceInSeconds)(current.ts, previous.ts) < groupingRange && !(0, isMessageNewDay_1.isMessageNewDay)(current, previous);
};
const ThreadMessageList = ({ mainMessage }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const _a = (0, useDateScroll_1.useDateScroll)(), { innerRef, bubbleRef, listStyle } = _a, bubbleDate = __rest(_a, ["innerRef", "bubbleRef", "listStyle"]);
    const { messages, loading } = (0, useLegacyThreadMessages_1.useLegacyThreadMessages)(mainMessage._id);
    const { listWrapperRef: listWrapperScrollRef, listRef: listScrollRef, onScroll: handleScroll, } = (0, useLegacyThreadMessageListScrolling_1.useLegacyThreadMessageListScrolling)(mainMessage);
    const { parentRef: listJumpRef } = (0, useLegacyThreadMessageJump_1.useLegacyThreadMessageJump)({ enabled: !loading });
    const hideUsernames = (0, ui_contexts_1.useUserPreference)('hideUsernames');
    const showUserAvatar = !!(0, ui_contexts_1.useUserPreference)('displayAvatars');
    const firstUnreadMessageId = (0, useFirstUnreadMessageId_1.useFirstUnreadMessageId)();
    const messageGroupingPeriod = (0, ui_contexts_1.useSetting)('Message_GroupingPeriod', 300);
    const { messageListRef } = (0, useMessageListNavigation_1.useMessageListNavigation)();
    const listRef = (0, fuselage_hooks_1.useMergedRefs)(listScrollRef, messageListRef);
    const scrollRef = (0, fuselage_hooks_1.useMergedRefs)(innerRef, listWrapperScrollRef, listJumpRef);
    return ((0, jsx_runtime_1.jsxs)("div", { className: ['thread-list js-scroll-thread', hideUsernames && 'hide-usernames'].filter(isTruthy_1.isTruthy).join(' '), children: [(0, jsx_runtime_1.jsx)(BubbleDate_1.BubbleDate, Object.assign({ ref: bubbleRef }, bubbleDate)), (0, jsx_runtime_1.jsx)(CustomScrollbars_1.CustomScrollbars, { ref: scrollRef, onScroll: (args) => {
                    handleScroll(args);
                }, style: { scrollBehavior: 'smooth', overflowX: 'hidden' }, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'ul', className: [listStyle, 'thread'], ref: listRef, "aria-label": t('Thread_message_list'), style: { scrollBehavior: 'smooth', overflowX: 'hidden' }, children: loading ? ((0, jsx_runtime_1.jsx)("li", { className: 'load-more', children: (0, jsx_runtime_1.jsx)(LoadingMessagesIndicator_1.default, {}) })) : ((0, jsx_runtime_1.jsx)(MessageListProvider_1.default, { messageListRef: listJumpRef, children: [mainMessage, ...messages].map((message, index, { [index - 1]: previous }) => {
                            const sequential = isMessageSequential(message, previous, messageGroupingPeriod);
                            const newDay = (0, isMessageNewDay_1.isMessageNewDay)(message, previous);
                            const shouldShowAsSequential = sequential && !newDay;
                            const firstUnread = firstUnreadMessageId === message._id;
                            const system = client_1.MessageTypes.isSystemMessage(message);
                            return ((0, jsx_runtime_1.jsx)(react_1.Fragment, { children: (0, jsx_runtime_1.jsx)(ThreadMessageItem_1.ThreadMessageItem, { message: message, previous: previous, sequential: sequential, shouldShowAsSequential: shouldShowAsSequential, showUserAvatar: showUserAvatar, firstUnread: firstUnread, system: system }) }, message._id));
                        }) })) }) })] }));
};
exports.default = ThreadMessageList;
