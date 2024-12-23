"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const NoInstalledAppsEmptyState = ({ onButtonClick }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 20, children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'magnifier' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('No_apps_installed') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: t('Explore_the_marketplace_to_find_awesome_apps') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: onButtonClick, children: t('Explore_marketplace') }) })] }) }));
};
exports.default = NoInstalledAppsEmptyState;
