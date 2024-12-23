"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const SidebarTogglerBadge_1 = __importDefault(require("./SidebarTogglerBadge"));
const SideBarTogglerButton = ({ badge, onClick }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { position: 'relative', children: [(0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'burger-menu', small: true, "aria-label": t('Open_sidebar'), marginInlineEnd: 8, onClick: onClick }), badge && (0, jsx_runtime_1.jsx)(SidebarTogglerBadge_1.default, { children: badge })] }));
};
exports.default = SideBarTogglerButton;
