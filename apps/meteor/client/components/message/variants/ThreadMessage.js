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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const MessageHighlightContext_1 = require("../../../views/room/MessageList/contexts/MessageHighlightContext");
const useJumpToMessage_1 = require("../../../views/room/MessageList/hooks/useJumpToMessage");
const UserCardContext_1 = require("../../../views/room/contexts/UserCardContext");
const Emoji_1 = __importDefault(require("../../Emoji"));
const IgnoredContent_1 = __importDefault(require("../IgnoredContent"));
const MessageHeader_1 = __importDefault(require("../MessageHeader"));
const MessageToolbarHolder_1 = __importDefault(require("../MessageToolbarHolder"));
const StatusIndicators_1 = __importDefault(require("../StatusIndicators"));
const ThreadMessageContent_1 = __importDefault(require("./thread/ThreadMessageContent"));
const ThreadMessage = ({ message, sequential, unread, showUserAvatar }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const uid = (0, ui_contexts_1.useUserId)();
    const editing = (0, MessageHighlightContext_1.useIsMessageHighlight)(message._id);
    const [ignored, toggleIgnoring] = (0, fuselage_hooks_1.useToggle)(message.ignored);
    const { openUserCard, triggerProps } = (0, UserCardContext_1.useUserCard)();
    // Checks if is videoconf message to limit toolbox actions
    const messageContext = (0, core_typings_1.isVideoConfMessage)(message) ? 'videoconf-threads' : 'threads';
    const messageRef = (0, useJumpToMessage_1.useJumpToMessage)(message._id);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Message, { role: 'listitem', "aria-roledescription": t('thread_message'), tabIndex: 0, id: message._id, ref: messageRef, isEditing: editing, isPending: message.temp, sequential: sequential, "data-qa-editing": editing, "data-id": message._id, "data-mid": message._id, "data-unread": unread, "data-sequential": sequential, "data-own": message.u._id === uid, "data-qa-type": 'message', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.MessageLeftContainer, { children: [!sequential && message.u.username && showUserAvatar && ((0, jsx_runtime_1.jsx)(ui_avatar_1.MessageAvatar, Object.assign({ emoji: message.emoji ? (0, jsx_runtime_1.jsx)(Emoji_1.default, { emojiHandle: message.emoji, fillContainer: true }) : undefined, avatarUrl: message.avatar, username: message.u.username, size: 'x36', onClick: (e) => openUserCard(e, message.u.username), style: { cursor: 'pointer' }, role: 'button' }, triggerProps))), sequential && (0, jsx_runtime_1.jsx)(StatusIndicators_1.default, { message: message })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.MessageContainer, { children: [!sequential && (0, jsx_runtime_1.jsx)(MessageHeader_1.default, { message: message }), ignored ? (0, jsx_runtime_1.jsx)(IgnoredContent_1.default, { onShowMessageIgnored: toggleIgnoring }) : (0, jsx_runtime_1.jsx)(ThreadMessageContent_1.default, { message: message })] }), !message.private && (0, jsx_runtime_1.jsx)(MessageToolbarHolder_1.default, { message: message, context: messageContext })] }));
};
exports.default = (0, react_1.memo)(ThreadMessage);
