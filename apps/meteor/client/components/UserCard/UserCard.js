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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useEmbeddedLayout_1 = require("../../hooks/useEmbeddedLayout");
const MarkdownText_1 = __importDefault(require("../MarkdownText"));
const Status = __importStar(require("../UserStatus"));
const UserCardActions_1 = __importDefault(require("./UserCardActions"));
const UserCardDialog_1 = __importDefault(require("./UserCardDialog"));
const UserCardInfo_1 = __importDefault(require("./UserCardInfo"));
const UserCardRoles_1 = __importDefault(require("./UserCardRoles"));
const UserCardUsername_1 = __importDefault(require("./UserCardUsername"));
const clampStyle = (0, css_in_js_1.css) `
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	word-break: break-all;
`;
const UserCard = (_a) => {
    var { user: { name, username, etag, customStatus, roles, bio, status = (0, jsx_runtime_1.jsx)(Status.Offline, {}), localTime, nickname } = {}, actions, onOpenUserInfo, onClose } = _a, props = __rest(_a, ["user", "actions", "onOpenUserInfo", "onClose"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const isLayoutEmbedded = (0, useEmbeddedLayout_1.useEmbeddedLayout)();
    return ((0, jsx_runtime_1.jsxs)(UserCardDialog_1.default, Object.assign({ "data-qa": 'UserCard' }, props, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [username && (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: username, etag: etag, size: 'x124' }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexGrow: 0, display: 'flex', mbs: 12, alignItems: 'center', justifyContent: 'center', children: (0, jsx_runtime_1.jsx)(UserCardActions_1.default, { "aria-label": t('User_card_actions'), children: actions }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', flexGrow: 1, flexShrink: 1, mis: 16, width: '1px', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbe: 4, withTruncatedText: true, display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(UserCardUsername_1.default, { status: status, name: name }), nickname && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { flexGrow: 1, flexShrink: 1, flexBasis: 0, title: nickname, color: 'hint', mis: 4, fontScale: 'p2', withTruncatedText: true, children: ["(", nickname, ")"] }))] }), customStatus && ((0, jsx_runtime_1.jsx)(UserCardInfo_1.default, { mbe: 16, children: typeof customStatus === 'string' ? ((0, jsx_runtime_1.jsx)(MarkdownText_1.default, { withTruncatedText: true, variant: 'inlineWithoutBreaks', content: customStatus, parseEmoji: true })) : (customStatus) })), (0, jsx_runtime_1.jsx)(UserCardRoles_1.default, { children: roles }), (0, jsx_runtime_1.jsx)(UserCardInfo_1.default, { children: localTime }), bio && ((0, jsx_runtime_1.jsx)(UserCardInfo_1.default, { withTruncatedText: false, className: clampStyle, height: 'x60', children: typeof bio === 'string' ? (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inline', content: bio }) : bio })), onOpenUserInfo && !isLayoutEmbedded && ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { small: true, onClick: onOpenUserInfo, children: t('See_full_profile') }) }))] }), onClose && (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { mis: 16, small: true, "aria-label": t('Close'), icon: 'cross', onClick: onClose })] })));
};
exports.default = UserCard;
