"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverMacLimitSection = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const OverMacLimitSection = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleClick = () => {
        window.open('https://rocket.chat/pricing', '_blank');
    };
    return ((0, jsx_runtime_1.jsx)(fuselage_1.SidebarBanner, { text: t('You_have_reached_the_limit_active_costumers_this_month'), description: t('Learn_more'), addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'warning', color: 'danger', size: 'x24' }), onClick: handleClick }));
};
exports.OverMacLimitSection = OverMacLimitSection;
