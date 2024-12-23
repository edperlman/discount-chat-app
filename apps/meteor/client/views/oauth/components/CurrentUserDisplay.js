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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const LocalTime_1 = __importDefault(require("../../../components/LocalTime"));
const MarkdownText_1 = __importDefault(require("../../../components/MarkdownText"));
const UserCard_1 = require("../../../components/UserCard");
const clampStyle = (0, css_in_js_1.css) `
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	word-break: break-all;
`;
const CurrentUserDisplay = ({ user }) => {
    const showRealNames = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name', false);
    const getRoles = (0, ui_contexts_1.useRolesDescription)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const { username, avatarETag, name, statusText, nickname, roles, utcOffset, bio } = user;
    const data = (0, react_1.useMemo)(() => ({
        username,
        etag: avatarETag,
        name: showRealNames ? name : username,
        nickname,
        status: (0, jsx_runtime_1.jsx)(ui_client_1.UserStatus.Online, {}),
        customStatus: statusText !== null && statusText !== void 0 ? statusText : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}),
        roles: roles && getRoles(roles).map((role, index) => (0, jsx_runtime_1.jsx)(UserCard_1.UserCardRole, { children: role }, index)),
        localTime: utcOffset && Number.isInteger(utcOffset) && (0, jsx_runtime_1.jsx)(LocalTime_1.default, { utcOffset: utcOffset }),
        bio: bio ? ((0, jsx_runtime_1.jsx)(UserCard_1.UserCardInfo, { withTruncatedText: false, className: clampStyle, height: 'x60', children: typeof bio === 'string' ? (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inline', content: bio }) : bio })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})),
    }), [avatarETag, bio, getRoles, name, nickname, roles, showRealNames, statusText, username, utcOffset]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { children: t('core.You_are_logged_in_as') }), (0, jsx_runtime_1.jsx)(UserCard_1.UserCard, { user: data })] }));
};
exports.default = CurrentUserDisplay;
