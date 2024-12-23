"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const ReportReasonCollapsible = ({ children }) => {
    const [isOpen, setIsOpen] = (0, fuselage_hooks_1.useToggle)(false);
    const { t } = (0, react_i18next_1.useTranslation)();
    const toggle = () => setIsOpen((prev) => !prev);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { small: true, onClick: toggle, "aria-expanded": isOpen, "aria-controls": 'report-reasons', children: isOpen ? t('Moderation_Hide_reports') : t('Moderation_Show_reports') }) }), isOpen && children] }));
};
exports.default = ReportReasonCollapsible;
