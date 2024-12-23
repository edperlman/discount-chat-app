"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericNoResults = ({ icon = 'magnifier', title, description, buttonTitle, buttonAction, linkHref, linkText, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'center', children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: icon }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: title || t('No_results_found') }), description && (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: description }), buttonTitle && buttonAction && ((0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: buttonAction, children: buttonTitle }) })), linkText && linkHref && ((0, jsx_runtime_1.jsx)(fuselage_1.StatesLink, { href: linkHref, target: '_blank', children: linkText }))] }) }));
};
exports.default = GenericNoResults;
