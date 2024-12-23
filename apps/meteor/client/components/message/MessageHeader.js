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
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const StatusIndicators_1 = __importDefault(require("./StatusIndicators"));
const MessageRoles_1 = __importDefault(require("./header/MessageRoles"));
const MessageListContext_1 = require("./list/MessageListContext");
const getUserDisplayName_1 = require("../../../lib/getUserDisplayName");
const useFormatDateAndTime_1 = require("../../hooks/useFormatDateAndTime");
const useFormatTime_1 = require("../../hooks/useFormatTime");
const useUserData_1 = require("../../hooks/useUserData");
const useMessageRoles_1 = require("./header/hooks/useMessageRoles");
const UserCardContext_1 = require("../../views/room/contexts/UserCardContext");
const MessageHeader = ({ message }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatTime = (0, useFormatTime_1.useFormatTime)();
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const { triggerProps, openUserCard } = (0, UserCardContext_1.useUserCard)();
    const showRealName = (0, MessageListContext_1.useMessageListShowRealName)();
    const user = Object.assign(Object.assign(Object.assign({}, message.u), { roles: [] }), (0, useUserData_1.useUserData)(message.u._id));
    const usernameAndRealNameAreSame = !user.name || user.username === user.name;
    const showUsername = (0, MessageListContext_1.useMessageListShowUsername)() && showRealName && !usernameAndRealNameAreSame;
    const showRoles = (0, MessageListContext_1.useMessageListShowRoles)();
    const roles = (0, useMessageRoles_1.useMessageRoles)(message.u._id, message.rid, showRoles);
    const shouldShowRolesList = roles.length > 0;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.MessageHeader, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.MessageNameContainer, Object.assign({ tabIndex: 0, role: 'button', id: `${message._id}-displayName`, "aria-label": (0, getUserDisplayName_1.getUserDisplayName)(user.name, user.username, showRealName), onClick: (e) => openUserCard(e, message.u.username), onKeyDown: (e) => {
                    (e.code === 'Enter' || e.code === 'Space') && openUserCard(e, message.u.username);
                }, style: { cursor: 'pointer' } }, triggerProps, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.MessageName, Object.assign({}, (!showUsername && { 'data-qa-type': 'username' }), { title: !showUsername && !usernameAndRealNameAreSame ? `@${user.username}` : undefined, "data-username": user.username, children: message.alias || (0, getUserDisplayName_1.getUserDisplayName)(user.name, user.username, showRealName) })), showUsername && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [' ', (0, jsx_runtime_1.jsxs)(fuselage_1.MessageUsername, { "data-username": user.username, "data-qa-type": 'username', children: ["@", user.username] })] }))] })), shouldShowRolesList && (0, jsx_runtime_1.jsx)(MessageRoles_1.default, { roles: roles, isBot: message.bot }), (0, jsx_runtime_1.jsx)(fuselage_1.MessageTimestamp, { id: `${message._id}-time`, title: formatDateAndTime(message.ts), children: formatTime(message.ts) }), message.private && (0, jsx_runtime_1.jsx)(fuselage_1.MessageStatusPrivateIndicator, { children: t('Only_you_can_see_this_message') }), (0, jsx_runtime_1.jsx)(StatusIndicators_1.default, { message: message })] }));
};
exports.default = (0, react_1.memo)(MessageHeader);
