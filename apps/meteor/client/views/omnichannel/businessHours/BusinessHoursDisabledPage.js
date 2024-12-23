"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Page_1 = require("../../../components/Page");
const BusinessHoursDisabledPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const isAdmin = (0, ui_contexts_1.useRole)('admin');
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Business_Hours') }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', justifyContent: 'center', height: '100%', children: (0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'clock' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Business_hours_is_disabled') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: t('Business_hours_is_disabled_description') }), isAdmin && ((0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: () => router.navigate('/admin/settings/Omnichannel'), children: t('Enable_business_hours') }) })), (0, jsx_runtime_1.jsx)(fuselage_1.StatesLink, { target: '_blank', href: 'https://go.rocket.chat/i/omnichannel-docs', children: t('Learn_more_about_business_hours') })] }) }) })] }));
};
exports.default = BusinessHoursDisabledPage;
