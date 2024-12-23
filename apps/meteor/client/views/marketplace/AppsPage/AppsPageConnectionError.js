"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AppsPageContentError = ({ onButtonClick }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 20, children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { variation: 'danger', name: 'circle-exclamation' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Connection_error') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: t('Marketplace_error') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { icon: 'reload', onClick: onButtonClick, children: t('Reload_page') }) })] }) }));
};
exports.default = AppsPageContentError;
