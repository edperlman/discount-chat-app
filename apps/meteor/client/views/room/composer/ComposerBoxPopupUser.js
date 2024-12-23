"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const ReactiveUserStatus_1 = __importDefault(require("../../../components/UserStatus/ReactiveUserStatus"));
function ComposerBoxPopupUser({ _id, system, username, name, nickname, outside, suggestion, variant }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [!system && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.OptionAvatar, { children: (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: 'x28', username: username }) }), (0, jsx_runtime_1.jsx)(fuselage_1.OptionColumn, { children: (0, jsx_runtime_1.jsx)(ReactiveUserStatus_1.default, { uid: _id }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.OptionContent, { children: [(0, jsx_runtime_1.jsx)("strong", { children: name !== null && name !== void 0 ? name : username }), " ", name && name !== username && username, nickname && (0, jsx_runtime_1.jsxs)("span", { className: 'popup-user-nickname', children: ["(", nickname, ")"] })] })] })), system && ((0, jsx_runtime_1.jsxs)(fuselage_1.OptionContent, { children: [(0, jsx_runtime_1.jsx)("strong", { children: username }), " ", name] })), outside && variant === 'large' && ((0, jsx_runtime_1.jsx)(fuselage_1.OptionColumn, { children: (0, jsx_runtime_1.jsx)(fuselage_1.OptionInput, { children: t('Not_in_channel') }) })), suggestion && variant === 'large' && ((0, jsx_runtime_1.jsx)(fuselage_1.OptionColumn, { children: (0, jsx_runtime_1.jsx)(fuselage_1.OptionInput, { children: t('Suggestion_from_recent_messages') }) }))] }));
}
exports.default = ComposerBoxPopupUser;
