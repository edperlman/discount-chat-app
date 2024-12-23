"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useFormatDate_1 = require("../../../../../hooks/useFormatDate");
const useStatistics_1 = require("../../../../hooks/useStatistics");
const FeatureUsageCard_1 = __importDefault(require("../FeatureUsageCard"));
const UpgradeButton_1 = __importDefault(require("../UpgradeButton"));
const ActiveSessionsPeakCard = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data, isLoading } = (0, useStatistics_1.useStatistics)();
    const formatDate = (0, useFormatDate_1.useFormatDate)();
    const { maxMonthlyPeakConnections } = data || {};
    const total = 200;
    const used = maxMonthlyPeakConnections || 0;
    const exceedLimit = used >= total;
    const card = Object.assign({ title: t('ActiveSessionsPeak'), infoText: t('ActiveSessionsPeak_InfoText') }, (exceedLimit && {
        upgradeButton: ((0, jsx_runtime_1.jsx)(UpgradeButton_1.default, { target: 'active-session-peak-card', action: 'upgrade', small: true, children: t('Upgrade') })),
    }));
    if (isLoading || maxMonthlyPeakConnections === undefined) {
        return ((0, jsx_runtime_1.jsx)(FeatureUsageCard_1.default, { card: card, children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', width: 'x112', height: 'x112' }) }));
    }
    return ((0, jsx_runtime_1.jsx)(FeatureUsageCard_1.default, { card: card, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: 'font-secondary-info', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'h1', color: exceedLimit ? 'font-danger' : 'font-default', mbe: 12, children: [used, " / ", total] }), formatDate(new Date())] }) }));
};
exports.default = ActiveSessionsPeakCard;
