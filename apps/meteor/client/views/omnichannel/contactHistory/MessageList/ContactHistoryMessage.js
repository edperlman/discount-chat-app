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
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const getUserDisplayName_1 = require("../../../../../lib/getUserDisplayName");
const MessageContentBody_1 = __importDefault(require("../../../../components/message/MessageContentBody"));
const StatusIndicators_1 = __importDefault(require("../../../../components/message/StatusIndicators"));
const Attachments_1 = __importDefault(require("../../../../components/message/content/Attachments"));
const UiKitMessageBlock_1 = __importDefault(require("../../../../components/message/uikit/UiKitMessageBlock"));
const useFormatDate_1 = require("../../../../hooks/useFormatDate");
const useFormatTime_1 = require("../../../../hooks/useFormatTime");
const UserCardContext_1 = require("../../../room/contexts/UserCardContext");
const ContactHistoryMessage = ({ message, sequential, isNewDay, showUserAvatar }) => {
    var _a, _b;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { triggerProps, openUserCard } = (0, UserCardContext_1.useUserCard)();
    const format = (0, useFormatDate_1.useFormatDate)();
    const formatTime = (0, useFormatTime_1.useFormatTime)();
    const quotes = ((_a = message === null || message === void 0 ? void 0 : message.attachments) === null || _a === void 0 ? void 0 : _a.filter(core_typings_1.isQuoteAttachment)) || [];
    const attachments = ((_b = message === null || message === void 0 ? void 0 : message.attachments) === null || _b === void 0 ? void 0 : _b.filter((attachment) => !(0, core_typings_1.isQuoteAttachment)(attachment))) || [];
    if (message.t === 'livechat-close') {
        return ((0, jsx_runtime_1.jsxs)(fuselage_1.MessageSystem, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.MessageSystemLeftContainer, { children: showUserAvatar && ((0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, Object.assign({ url: message.avatar, username: message.u.username, size: 'x18', onClick: (e) => openUserCard(e, message.u.username), style: { cursor: 'pointer' }, role: 'button' }, triggerProps))) }), (0, jsx_runtime_1.jsx)(fuselage_1.MessageSystemContainer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.MessageSystemBlock, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.MessageSystemName, { "data-username": message.u.username, "data-qa-type": 'username', children: ["@", message.u.username] }), (0, jsx_runtime_1.jsx)(fuselage_1.MessageSystemBody, { title: message.msg, children: t('Conversation_closed', { comment: message.msg }) }), (0, jsx_runtime_1.jsx)(fuselage_1.MessageSystemTimestamp, { title: formatTime(message.ts), children: formatTime(message.ts) })] }) })] }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [isNewDay && ((0, jsx_runtime_1.jsx)(fuselage_1.MessageDivider, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Bubble, { small: true, secondary: true, children: format(message.ts) }) })), (0, jsx_runtime_1.jsxs)(fuselage_1.Message, { isPending: message.temp, sequential: sequential, role: 'listitem', "data-qa": 'chat-history-message', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.MessageLeftContainer, { children: [!sequential && message.u.username && showUserAvatar && ((0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, Object.assign({ url: message.avatar, username: message.u.username, size: 'x36', onClick: (e) => openUserCard(e, message.u.username), style: { cursor: 'pointer' }, role: 'button' }, triggerProps))), sequential && (0, jsx_runtime_1.jsx)(StatusIndicators_1.default, { message: message })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.MessageContainer, { children: [!sequential && ((0, jsx_runtime_1.jsxs)(fuselage_1.MessageHeader, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.MessageName, { title: `@${message.u.username}`, "data-username": message.u.username, children: message.alias || (0, getUserDisplayName_1.getUserDisplayName)(message.u.name, message.u.username, false) }), (0, jsx_runtime_1.jsxs)(fuselage_1.MessageUsername, { "data-username": message.u.username, "data-qa-type": 'username', children: ["@", message.u.username] }), (0, jsx_runtime_1.jsx)(fuselage_1.MessageTimestamp, { title: formatTime(message.ts), children: formatTime(message.ts) }), (0, jsx_runtime_1.jsx)(StatusIndicators_1.default, { message: message })] })), !!(quotes === null || quotes === void 0 ? void 0 : quotes.length) && (0, jsx_runtime_1.jsx)(Attachments_1.default, { attachments: quotes }), !message.blocks && message.md && ((0, jsx_runtime_1.jsx)(fuselage_1.MessageBody, { "data-qa-type": 'message-body', dir: 'auto', children: (0, jsx_runtime_1.jsx)(MessageContentBody_1.default, { md: message.md, mentions: message.mentions, channels: message.channels }) })), message.blocks && (0, jsx_runtime_1.jsx)(UiKitMessageBlock_1.default, { rid: message.rid, mid: message._id, blocks: message.blocks }), !!attachments && (0, jsx_runtime_1.jsx)(Attachments_1.default, { attachments: attachments })] })] })] }));
};
exports.default = (0, react_1.memo)(ContactHistoryMessage);
