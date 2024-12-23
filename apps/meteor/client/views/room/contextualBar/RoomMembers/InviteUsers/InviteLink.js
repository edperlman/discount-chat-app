"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useClipboardWithToast_1 = __importDefault(require("../../../../../hooks/useClipboardWithToast"));
const InviteLink = ({ linkText, captionText, onClickEdit }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { copy } = (0, useClipboardWithToast_1.default)(linkText);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { flexGrow: 0, children: t('Invite_Link') }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [!linkText && (0, jsx_runtime_1.jsx)(fuselage_1.InputBox.Skeleton, {}), linkText && (0, jsx_runtime_1.jsx)(fuselage_1.UrlInput, { value: linkText, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { onClick: () => copy(), name: 'copy', size: 'x16' }) })] }), captionText && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pb: 8, color: 'annotation', fontScale: 'c2', children: captionText }))] }), onClickEdit && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClickEdit, children: t('Edit_Invite') }) }))] }));
};
exports.default = InviteLink;
