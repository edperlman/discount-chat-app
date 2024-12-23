"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCardEmptyState = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const ReportCardEmptyState = ({ icon, subtitle }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { width: '100%', height: '100%', children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: icon || 'dashboard' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('No_data_available_for_the_selected_period') }), subtitle && (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: subtitle })] }));
};
exports.ReportCardEmptyState = ReportCardEmptyState;
