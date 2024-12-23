"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const FilePickerBreadcrumbs = ({ parentFolders, handleBreadcrumb, handleBack }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', overflowX: 'auto', mie: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { disabled: parentFolders.length === 0, title: t('Back'), "aria-label": 'back', icon: 'arrow-back', small: true, onClick: handleBack }), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { title: t('Root'), "aria-label": 'home', icon: 'home', small: true, "data-index": -1, onClick: handleBreadcrumb }), parentFolders === null || parentFolders === void 0 ? void 0 : parentFolders.map((parentFolder, index) => ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'chevron-left' }), (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { "aria-label": parentFolder, "data-index": index, onClick: handleBreadcrumb, children: parentFolder })] }, index)))] }));
};
exports.default = FilePickerBreadcrumbs;
