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
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const MessageHighlightContext_1 = require("../../../views/room/MessageList/contexts/MessageHighlightContext");
const SelectedMessagesContext_1 = require("../../../views/room/MessageList/contexts/SelectedMessagesContext");
const useJumpToMessage_1 = require("../../../views/room/MessageList/hooks/useJumpToMessage");
const UserCardContext_1 = require("../../../views/room/contexts/UserCardContext");
const Emoji_1 = __importDefault(require("../../Emoji"));
const IgnoredContent_1 = __importDefault(require("../IgnoredContent"));
const MessageHeader_1 = __importDefault(require("../MessageHeader"));
const MessageToolbarHolder_1 = __importDefault(require("../MessageToolbarHolder"));
const StatusIndicators_1 = __importDefault(require("../StatusIndicators"));
const RoomMessageContent_1 = __importDefault(require("./room/RoomMessageContent"));
const RoomMessage = (_a) => {
    var { message, showUserAvatar, sequential, all, mention, unread, context, ignoredUser, searchText } = _a, props = __rest(_a, ["message", "showUserAvatar", "sequential", "all", "mention", "unread", "context", "ignoredUser", "searchText"]);
    const t = (0, ui_contexts_1.useTranslation)();
    const uid = (0, ui_contexts_1.useUserId)();
    const editing = (0, MessageHighlightContext_1.useIsMessageHighlight)(message._id);
    const [displayIgnoredMessage, toggleDisplayIgnoredMessage] = (0, fuselage_hooks_1.useToggle)(false);
    const ignored = (ignoredUser || message.ignored) && !displayIgnoredMessage;
    const { openUserCard, triggerProps } = (0, UserCardContext_1.useUserCard)();
    const selecting = (0, SelectedMessagesContext_1.useIsSelecting)();
    const toggleSelected = (0, SelectedMessagesContext_1.useToggleSelect)(message._id);
    const selected = (0, SelectedMessagesContext_1.useIsSelectedMessage)(message._id);
    (0, SelectedMessagesContext_1.useCountSelected)();
    const messageRef = (0, useJumpToMessage_1.useJumpToMessage)(message._id);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Message, Object.assign({ ref: messageRef, id: message._id, role: 'listitem', "aria-roledescription": sequential ? t('sequential_message') : t('message'), tabIndex: 0, "aria-labelledby": `${message._id}-displayName ${message._id}-time ${message._id}-content ${message._id}-read-status`, onClick: selecting ? toggleSelected : undefined, isSelected: selected, isEditing: editing, isPending: message.temp, sequential: sequential, "data-qa-editing": editing, "data-qa-selected": selected, "data-id": message._id, "data-mid": message._id, "data-unread": unread, "data-sequential": sequential, "data-own": message.u._id === uid, "data-qa-type": 'message', "aria-busy": message.temp }, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.MessageLeftContainer, { children: [!sequential && message.u.username && !selecting && showUserAvatar && ((0, jsx_runtime_1.jsx)(ui_avatar_1.MessageAvatar, Object.assign({ emoji: message.emoji ? (0, jsx_runtime_1.jsx)(Emoji_1.default, { emojiHandle: message.emoji, fillContainer: true }) : undefined, avatarUrl: message.avatar, username: message.u.username, size: 'x36', onClick: (e) => openUserCard(e, message.u.username), style: { cursor: 'pointer' }, role: 'button' }, triggerProps))), selecting && (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { checked: selected, onChange: toggleSelected }), sequential && (0, jsx_runtime_1.jsx)(StatusIndicators_1.default, { message: message })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.MessageContainer, { children: [!sequential && (0, jsx_runtime_1.jsx)(MessageHeader_1.default, { message: message }), ignored ? ((0, jsx_runtime_1.jsx)(IgnoredContent_1.default, { onShowMessageIgnored: toggleDisplayIgnoredMessage })) : ((0, jsx_runtime_1.jsx)(RoomMessageContent_1.default, { message: message, unread: unread, mention: mention, all: all, searchText: searchText }))] }), !message.private && (message === null || message === void 0 ? void 0 : message.e2e) !== 'pending' && !selecting && (0, jsx_runtime_1.jsx)(MessageToolbarHolder_1.default, { message: message, context: context })] })));
};
exports.default = (0, react_1.memo)(RoomMessage);
