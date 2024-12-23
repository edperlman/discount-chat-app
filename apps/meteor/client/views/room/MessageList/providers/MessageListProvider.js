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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const helper_1 = require("../../../../../app/highlight-words/client/helper");
const MessageListContext_1 = require("../../../../components/message/list/MessageListContext");
const AttachmentProvider_1 = __importDefault(require("../../../../providers/AttachmentProvider"));
const ChatContext_1 = require("../../contexts/ChatContext");
const RoomContext_1 = require("../../contexts/RoomContext");
const useAutoTranslate_1 = require("../hooks/useAutoTranslate");
const useKatex_1 = require("../hooks/useKatex");
const useLoadSurroundingMessages_1 = require("../hooks/useLoadSurroundingMessages");
const MessageListProvider = ({ children, messageListRef, attachmentDimension }) => {
    const room = (0, RoomContext_1.useRoom)();
    if (!room) {
        throw new Error('Room not found');
    }
    const reactToMessage = (0, ui_contexts_1.useEndpoint)('POST', '/v1/chat.react');
    const user = (0, ui_contexts_1.useUser)();
    const uid = user === null || user === void 0 ? void 0 : user._id;
    const username = user === null || user === void 0 ? void 0 : user.username;
    const subscription = (0, RoomContext_1.useRoomSubscription)();
    const { isMobile } = (0, ui_contexts_1.useLayout)();
    const showRealName = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name', false);
    const showColors = (0, ui_contexts_1.useSetting)('HexColorPreview_Enabled', false);
    const displayRolesGlobal = (0, ui_contexts_1.useSetting)('UI_DisplayRoles', true);
    const hideRolesPreference = Boolean(!(0, ui_contexts_1.useUserPreference)('hideRoles') && !isMobile);
    const showRoles = displayRolesGlobal && hideRolesPreference;
    const showUsername = Boolean(!(0, ui_contexts_1.useUserPreference)('hideUsernames') && !isMobile);
    const highlights = (0, ui_contexts_1.useUserPreference)('highlights');
    const { showAutoTranslate, autoTranslateLanguage } = (0, useAutoTranslate_1.useAutoTranslate)(subscription);
    const { katexEnabled, katexDollarSyntaxEnabled, katexParenthesisSyntaxEnabled } = (0, useKatex_1.useKatex)();
    const hasSubscription = Boolean(subscription);
    const msgParameter = (0, ui_contexts_1.useSearchParameter)('msg');
    (0, useLoadSurroundingMessages_1.useLoadSurroundingMessages)(msgParameter);
    const chat = (0, ChatContext_1.useChat)();
    const context = (0, react_1.useMemo)(() => (Object.assign(Object.assign({ showColors, useUserHasReacted: username
            ? (message) => (reaction) => { var _a; return Boolean((_a = message.reactions) === null || _a === void 0 ? void 0 : _a[reaction].usernames.includes(username)); }
            : () => () => false, useShowFollowing: uid
            ? ({ message }) => Boolean(message.replies && message.replies.indexOf(uid) > -1 && !(0, core_typings_1.isThreadMainMessage)(message))
            : () => false, autoTranslateLanguage, useShowTranslated: showAutoTranslate, useShowStarred: hasSubscription
            ? ({ message }) => Boolean(Array.isArray(message.starred) && message.starred.find((star) => star._id === uid))
            : () => false, useMessageDateFormatter: () => (date) => date.toLocaleString(), showRoles,
        showRealName,
        showUsername,
        messageListRef, jumpToMessageParam: msgParameter }, (katexEnabled && {
        katex: {
            dollarSyntaxEnabled: katexDollarSyntaxEnabled,
            parenthesisSyntaxEnabled: katexParenthesisSyntaxEnabled,
        },
    })), { highlights: highlights === null || highlights === void 0 ? void 0 : highlights.map((str) => str.trim()).map((highlight) => ({
            highlight,
            regex: (0, helper_1.getRegexHighlight)(highlight),
            urlRegex: (0, helper_1.getRegexHighlightUrl)(highlight),
        })), useOpenEmojiPicker: uid
            ? (message) => (e) => {
                e.nativeEvent.stopImmediatePropagation();
                chat === null || chat === void 0 ? void 0 : chat.emojiPicker.open(e.currentTarget, (emoji) => reactToMessage({ messageId: message._id, reaction: emoji }));
            }
            : () => () => undefined, username })), [
        username,
        uid,
        showAutoTranslate,
        hasSubscription,
        autoTranslateLanguage,
        showRoles,
        showRealName,
        showUsername,
        katexEnabled,
        katexDollarSyntaxEnabled,
        katexParenthesisSyntaxEnabled,
        highlights,
        reactToMessage,
        showColors,
        msgParameter,
        messageListRef,
        chat === null || chat === void 0 ? void 0 : chat.emojiPicker,
    ]);
    return ((0, jsx_runtime_1.jsx)(AttachmentProvider_1.default, { width: attachmentDimension === null || attachmentDimension === void 0 ? void 0 : attachmentDimension.width, height: attachmentDimension === null || attachmentDimension === void 0 ? void 0 : attachmentDimension.height, children: (0, jsx_runtime_1.jsx)(MessageListContext_1.MessageListContext.Provider, { value: context, children: children }) }));
};
exports.default = (0, react_1.memo)(MessageListProvider);
