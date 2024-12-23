"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useStatistics_1 = require("../../hooks/useStatistics");
const AnalyticsReports = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data, isLoading, isSuccess, isError } = (0, useStatistics_1.useStatistics)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { backgroundColor: 'light', p: 20, pbe: 28, mbe: 16, borderRadius: 4, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'center', mbe: 20, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 2, p: 4, mie: 8, bg: 'status-background-info', children: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'info', size: 20, color: 'info' }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h4', children: t('How_and_why_we_collect_usage_data') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p1', mbe: 16, children: t('Analytics_page_briefing_first_paragraph') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p1', children: t('Analytics_page_briefing_second_paragraph') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Scrollable, { vertical: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbe: 8, padding: 8, bg: 'neutral', borderRadius: 4, height: '100%', children: [isSuccess && (0, jsx_runtime_1.jsx)("pre", { children: JSON.stringify(data, null, '\t') }), isError && t('Something_went_wrong_try_again_later'), isLoading && Array.from({ length: 10 }).map((_, index) => (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}, index)), (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})] }) })] }));
};
exports.default = AnalyticsReports;
