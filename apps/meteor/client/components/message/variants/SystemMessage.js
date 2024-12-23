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
const getUserDisplayName_1 = require("../../../../lib/getUserDisplayName");
const useFormatDateAndTime_1 = require("../../../hooks/useFormatDateAndTime");
const useFormatTime_1 = require("../../../hooks/useFormatTime");
const useUserData_1 = require("../../../hooks/useUserData");
const SelectedMessagesContext_1 = require("../../../views/room/MessageList/contexts/SelectedMessagesContext");
const UserCardContext_1 = require("../../../views/room/contexts/UserCardContext");
const Attachments_1 = __importDefault(require("../content/Attachments"));
const MessageActions_1 = __importDefault(require("../content/MessageActions"));
const MessageListContext_1 = require("../list/MessageListContext");
const SystemMessage = (_a) => {
    var _b;
    var { message, showUserAvatar } = _a, props = __rest(_a, ["message", "showUserAvatar"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatTime = (0, useFormatTime_1.useFormatTime)();
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const { triggerProps, openUserCard } = (0, UserCardContext_1.useUserCard)();
    const showRealName = (0, MessageListContext_1.useMessageListShowRealName)();
    const user = Object.assign(Object.assign(Object.assign({}, message.u), { roles: [] }), (0, useUserData_1.useUserData)(message.u._id));
    const usernameAndRealNameAreSame = !user.name || user.username === user.name;
    const showUsername = (0, MessageListContext_1.useMessageListShowUsername)() && showRealName && !usernameAndRealNameAreSame;
    const messageType = client_1.MessageTypes.getType(message);
    const isSelecting = (0, SelectedMessagesContext_1.useIsSelecting)();
    const toggleSelected = (0, SelectedMessagesContext_1.useToggleSelect)(message._id);
    const isSelected = (0, SelectedMessagesContext_1.useIsSelectedMessage)(message._id);
    (0, SelectedMessagesContext_1.useCountSelected)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.MessageSystem, Object.assign({ role: 'listitem', "aria-roledescription": t('system_message'), tabIndex: 0, onClick: isSelecting ? toggleSelected : undefined, isSelected: isSelected, "data-qa-selected": isSelected, "data-qa": 'system-message', "data-system-message-type": message.t }, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.MessageSystemLeftContainer, { children: [!isSelecting && showUserAvatar && (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: message.u.username, size: 'x18' }), isSelecting && (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { checked: isSelected, onChange: toggleSelected })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.MessageSystemContainer, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.MessageSystemBlock, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.MessageNameContainer, Object.assign({ tabIndex: 0, role: 'button', onClick: (e) => user.username && openUserCard(e, user.username), onKeyDown: (e) => {
                                    (e.code === 'Enter' || e.code === 'Space') && openUserCard(e, message.u.username);
                                }, style: { cursor: 'pointer' } }, triggerProps, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.MessageSystemName, { children: (0, getUserDisplayName_1.getUserDisplayName)(user.name, user.username, showRealName) }), showUsername && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [' ', (0, jsx_runtime_1.jsxs)(fuselage_1.MessageUsername, { "data-username": user.username, children: ["@", user.username] })] }))] })), messageType && ((0, jsx_runtime_1.jsx)(fuselage_1.MessageSystemBody, { "data-qa-type": 'system-message-body', children: t(messageType.message, messageType.data ? messageType.data(message) : {}) })), (0, jsx_runtime_1.jsx)(fuselage_1.MessageSystemTimestamp, { title: formatDateAndTime(message.ts), children: formatTime(message.ts) })] }), message.attachments && ((0, jsx_runtime_1.jsx)(fuselage_1.MessageSystemBlock, { children: (0, jsx_runtime_1.jsx)(Attachments_1.default, { attachments: message.attachments }) })), ((_b = message.actionLinks) === null || _b === void 0 ? void 0 : _b.length) && ((0, jsx_runtime_1.jsx)(MessageActions_1.default, { message: message, actions: message.actionLinks.map((_a) => {
                            var { method_id: methodId, i18nLabel } = _a, action = __rest(_a, ["method_id", "i18nLabel"]);
                            return (Object.assign({ methodId, i18nLabel: i18nLabel }, action));
                        }) }))] })] })));
};
exports.default = (0, react_1.memo)(SystemMessage);
