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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useTimeAgo_1 = require("../../hooks/useTimeAgo");
const useUserCustomFields_1 = require("../../hooks/useUserCustomFields");
const useUserDisplayName_1 = require("../../hooks/useUserDisplayName");
const Contextualbar_1 = require("../Contextualbar");
const InfoPanel_1 = require("../InfoPanel");
const MarkdownText_1 = __importDefault(require("../MarkdownText"));
const UTCClock_1 = __importDefault(require("../UTCClock"));
const UserCard_1 = require("../UserCard");
const UserInfoAvatar_1 = __importDefault(require("./UserInfoAvatar"));
const UserInfo = (_a) => {
    var { username, name, lastLogin, nickname, bio, avatarETag, roles, utcOffset, phone, email, verified, createdAt, status, statusText, customFields, canViewAllInfo, actions, reason } = _a, props = __rest(_a, ["username", "name", "lastLogin", "nickname", "bio", "avatarETag", "roles", "utcOffset", "phone", "email", "verified", "createdAt", "status", "statusText", "customFields", "canViewAllInfo", "actions", "reason"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const timeAgo = (0, useTimeAgo_1.useTimeAgo)();
    const userDisplayName = (0, useUserDisplayName_1.useUserDisplayName)({ name, username });
    const userCustomFields = (0, useUserCustomFields_1.useUserCustomFields)(customFields);
    return ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, Object.assign({ p: 24 }, props, { children: (0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanel, { children: [username && ((0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelAvatar, { children: (0, jsx_runtime_1.jsx)(UserInfoAvatar_1.default, { username: username, etag: avatarETag }) })), actions && (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelActionGroup, { children: actions }), (0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelSection, { children: [userDisplayName && (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelTitle, { icon: status, title: userDisplayName }), statusText && ((0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { content: statusText, parseEmoji: true, variant: 'inline' }) }))] }), (0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelSection, { children: [reason && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Reason_for_joining') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: reason })] })), nickname && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Nickname') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: nickname })] })), roles.length !== 0 && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Roles') }), (0, jsx_runtime_1.jsx)(UserCard_1.UserCardRoles, { children: roles })] })), username && username !== name && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Username') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { "data-qa": 'UserInfoUserName', children: username })] })), Number.isInteger(utcOffset) && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Local_Time') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: utcOffset && (0, jsx_runtime_1.jsx)(UTCClock_1.default, { utcOffset: utcOffset }) })] })), bio && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Bio') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { withTruncatedText: false, children: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inline', content: bio }) })] })), Number.isInteger(utcOffset) && canViewAllInfo && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Last_login') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: lastLogin ? timeAgo(lastLogin) : t('Never') })] })), phone && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Phone') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { display: 'flex', flexDirection: 'row', alignItems: 'center', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'a', withTruncatedText: true, href: `tel:${phone}`, children: phone }) })] })), email && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Email') }), (0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelText, { display: 'flex', flexDirection: 'row', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'a', withTruncatedText: true, href: `mailto:${email}`, children: email }), (0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inline: 4, children: (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { children: verified ? t('Verified') : t('Not_verified') }) })] })] })), userCustomFields === null || userCustomFields === void 0 ? void 0 : userCustomFields.map((customField) => (customField === null || customField === void 0 ? void 0 : customField.value) && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t(customField.label) }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { content: customField.value, variant: 'inline' }) })] }, customField.value))), createdAt && ((0, jsx_runtime_1.jsxs)(InfoPanel_1.InfoPanelField, { children: [(0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelLabel, { children: t('Created_at') }), (0, jsx_runtime_1.jsx)(InfoPanel_1.InfoPanelText, { children: timeAgo(createdAt) })] }))] })] }) })));
};
exports.default = (0, react_1.memo)(UserInfo);
