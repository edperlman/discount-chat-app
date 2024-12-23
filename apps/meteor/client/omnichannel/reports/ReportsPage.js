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
const sections_1 = require("./sections");
const Page_1 = require("../../components/Page");
const useHasLicenseModule_1 = require("../../hooks/useHasLicenseModule");
const NotAuthorizedPage_1 = __importDefault(require("../../views/notAuthorized/NotAuthorizedPage"));
const BREAKPOINTS = { xs: 4, sm: 8, md: 8, lg: 12, xl: 6 };
const ReportsPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const hasPermission = (0, ui_contexts_1.usePermission)('view-livechat-reports');
    const isEnterprise = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    if (!hasPermission || !isEnterprise) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { background: 'tint', children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Reports') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', color: 'hint', fontScale: 'p2', mi: 24, children: t('Omnichannel_Reports_Summary') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { alignItems: 'center', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { width: '100rem', maxWidth: '100%', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Grid, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.GridItem, Object.assign({}, BREAKPOINTS, { children: (0, jsx_runtime_1.jsx)(sections_1.StatusSection, {}) })), (0, jsx_runtime_1.jsx)(fuselage_1.GridItem, Object.assign({}, BREAKPOINTS, { children: (0, jsx_runtime_1.jsx)(sections_1.ChannelsSection, {}) })), (0, jsx_runtime_1.jsx)(fuselage_1.GridItem, Object.assign({}, BREAKPOINTS, { children: (0, jsx_runtime_1.jsx)(sections_1.DepartmentsSection, {}) })), (0, jsx_runtime_1.jsx)(fuselage_1.GridItem, Object.assign({}, BREAKPOINTS, { children: (0, jsx_runtime_1.jsx)(sections_1.TagsSection, {}) })), (0, jsx_runtime_1.jsx)(fuselage_1.GridItem, Object.assign({}, BREAKPOINTS, { xl: 12, children: (0, jsx_runtime_1.jsx)(sections_1.AgentsSection, {}) }))] }) }) })] }));
};
exports.default = ReportsPage;
