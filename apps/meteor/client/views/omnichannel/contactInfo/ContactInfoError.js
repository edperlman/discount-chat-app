"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Contextualbar_1 = require("../../../components/Contextualbar");
const ContactInfoError = ({ onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'user' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Contact') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClose })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarEmptyContent, { icon: 'user', title: t('Contact_not_found') })] }));
};
exports.default = ContactInfoError;
