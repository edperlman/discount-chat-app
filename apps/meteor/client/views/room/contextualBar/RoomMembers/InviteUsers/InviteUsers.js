"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const EditInviteLink_1 = __importDefault(require("./EditInviteLink"));
const InviteLink_1 = __importDefault(require("./InviteLink"));
const Contextualbar_1 = require("../../../../../components/Contextualbar");
const InviteUsers = ({ onClickBackMembers, onClickBackLink, onClickNewLink, onClose, isEditing, onClickEdit, daysAndMaxUses, captionText, linkText, error, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(onClickBackMembers || onClickBackLink) && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarBack, { onClick: isEditing ? onClickBackLink : onClickBackMembers }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Invite_Users') }), onClose && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClose })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarScrollableContent, { children: [error && (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', children: error.toString() }), isEditing && !error && (0, jsx_runtime_1.jsx)(EditInviteLink_1.default, { onClickNewLink: onClickNewLink, daysAndMaxUses: daysAndMaxUses }), !isEditing && !error && (0, jsx_runtime_1.jsx)(InviteLink_1.default, { captionText: captionText, onClickEdit: onClickEdit, linkText: linkText })] })] }));
};
exports.default = InviteUsers;
