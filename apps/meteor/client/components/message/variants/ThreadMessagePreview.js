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
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const client_1 = require("../../../../app/ui-utils/client");
const SelectedMessagesContext_1 = require("../../../views/room/MessageList/contexts/SelectedMessagesContext");
const useMessageBody_1 = require("../../../views/room/MessageList/hooks/useMessageBody");
const useParentMessage_1 = require("../../../views/room/MessageList/hooks/useParentMessage");
const isParsedMessage_1 = require("../../../views/room/MessageList/lib/isParsedMessage");
const useGoToThread_1 = require("../../../views/room/hooks/useGoToThread");
const Emoji_1 = __importDefault(require("../../Emoji"));
const MessageListContext_1 = require("../list/MessageListContext");
const ThreadMessagePreviewBody_1 = __importDefault(require("./threadPreview/ThreadMessagePreviewBody"));
const ThreadMessagePreview = (_a) => {
    var _b;
    var { message, showUserAvatar, sequential } = _a, props = __rest(_a, ["message", "showUserAvatar", "sequential"]);
    const parentMessage = (0, useParentMessage_1.useParentMessage)(message.tmid);
    const translated = (0, MessageListContext_1.useShowTranslated)(message);
    const { t } = (0, react_i18next_1.useTranslation)();
    const isSelecting = (0, SelectedMessagesContext_1.useIsSelecting)();
    const toggleSelected = (0, SelectedMessagesContext_1.useToggleSelect)(message._id);
    const isSelected = (0, SelectedMessagesContext_1.useIsSelectedMessage)(message._id);
    (0, SelectedMessagesContext_1.useCountSelected)();
    const messageType = parentMessage.isSuccess ? client_1.MessageTypes.getType(parentMessage.data) : null;
    const messageBody = (0, useMessageBody_1.useMessageBody)(parentMessage.data, message.rid);
    const previewMessage = (0, isParsedMessage_1.isParsedMessage)(messageBody) ? { md: messageBody } : { msg: messageBody };
    const goToThread = (0, useGoToThread_1.useGoToThread)();
    const handleThreadClick = () => {
        var _a;
        if (!isSelecting) {
            if (!sequential) {
                return parentMessage.isSuccess && goToThread({ rid: message.rid, tmid: message.tmid, msg: (_a = parentMessage.data) === null || _a === void 0 ? void 0 : _a._id });
            }
            return goToThread({ rid: message.rid, tmid: message.tmid, msg: message._id });
        }
        return toggleSelected();
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.ThreadMessage, Object.assign({ role: 'link', "aria-roledescription": 'thread message preview', tabIndex: 0, onClick: handleThreadClick, onKeyDown: (e) => e.code === 'Enter' && handleThreadClick(), isSelected: isSelected, "data-qa-selected": isSelected }, props, { children: [!sequential && ((0, jsx_runtime_1.jsxs)(fuselage_1.ThreadMessageRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.ThreadMessageLeftContainer, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ThreadMessageIconThread, {}) }), (0, jsx_runtime_1.jsxs)(fuselage_1.ThreadMessageContainer, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.ThreadMessageOrigin, { system: !!messageType, children: [parentMessage.isSuccess && !messageType && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [((_b = parentMessage.data) === null || _b === void 0 ? void 0 : _b.ignored) ? (t('Message_Ignored')) : ((0, jsx_runtime_1.jsx)(ThreadMessagePreviewBody_1.default, { message: Object.assign(Object.assign({}, parentMessage.data), previewMessage) })), translated && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [' ', (0, jsx_runtime_1.jsx)(fuselage_1.MessageStatusIndicatorItem, { name: 'language', color: 'info', title: t('Translated') })] }))] })), messageType && t(messageType.message, messageType.data ? messageType.data(message) : {}), parentMessage.isLoading && (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {})] }), (0, jsx_runtime_1.jsx)(fuselage_1.ThreadMessageUnfollow, {})] })] })), (0, jsx_runtime_1.jsxs)(fuselage_1.ThreadMessageRow, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.ThreadMessageLeftContainer, { children: [!isSelecting && showUserAvatar && ((0, jsx_runtime_1.jsx)(ui_avatar_1.MessageAvatar, { emoji: message.emoji ? (0, jsx_runtime_1.jsx)(Emoji_1.default, { emojiHandle: message.emoji, fillContainer: true }) : undefined, username: message.u.username, size: 'x18' })), isSelecting && (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { checked: isSelected, onChange: toggleSelected })] }), (0, jsx_runtime_1.jsx)(fuselage_1.ThreadMessageContainer, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ThreadMessageBody, { children: message.ignored ? (t('Message_Ignored')) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(ThreadMessagePreviewBody_1.default, { message: message }), translated && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [' ', (0, jsx_runtime_1.jsx)(fuselage_1.MessageStatusIndicatorItem, { name: 'language', title: t('Translated') })] }))] })) }) })] })] })));
};
exports.default = (0, react_1.memo)(ThreadMessagePreview);
