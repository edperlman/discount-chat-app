"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AppsUsageCardSection_1 = __importDefault(require("./AppsUsageCardSection"));
const links_1 = require("../../../utils/links");
const FeatureUsageCard_1 = __importDefault(require("../../FeatureUsageCard"));
const UpgradeButton_1 = __importDefault(require("../../UpgradeButton"));
// Magic numbers
const marketplaceAppsMaxCountFallback = 5;
const privateAppsMaxCountFallback = 0;
const defaultWarningThreshold = 80;
const AppsUsageCard = ({ privateAppsLimit, marketplaceAppsLimit }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    if (!privateAppsLimit || !marketplaceAppsLimit) {
        // FIXME: not accessible enough
        return ((0, jsx_runtime_1.jsx)(FeatureUsageCard_1.default, { card: { title: t('Apps') }, children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', width: 'x112', height: 'x112', role: 'presentation' }) }));
    }
    const marketplaceAppsCount = (marketplaceAppsLimit === null || marketplaceAppsLimit === void 0 ? void 0 : marketplaceAppsLimit.value) || 0;
    const marketplaceAppsMaxCount = (marketplaceAppsLimit === null || marketplaceAppsLimit === void 0 ? void 0 : marketplaceAppsLimit.max) || marketplaceAppsMaxCountFallback;
    const marketplaceAppsPercentage = Math.round((marketplaceAppsCount / marketplaceAppsMaxCount) * 100) || 0;
    const marketplaceAppsAboveWarning = marketplaceAppsPercentage >= defaultWarningThreshold;
    const privateAppsCount = (privateAppsLimit === null || privateAppsLimit === void 0 ? void 0 : privateAppsLimit.value) || 0;
    const privateAppsMaxCount = (privateAppsLimit === null || privateAppsLimit === void 0 ? void 0 : privateAppsLimit.max) || privateAppsMaxCountFallback;
    const card = Object.assign({ title: t('Apps'), infoText: ((0, jsx_runtime_1.jsx)(react_i18next_1.Trans, { i18nKey: 'Apps_InfoText_limited', values: { marketplaceAppsMaxCount }, components: { 1: (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: links_1.PRICING_LINK, children: "premium plans" }) } })) }, (marketplaceAppsAboveWarning && {
        upgradeButton: ((0, jsx_runtime_1.jsx)(UpgradeButton_1.default, { target: 'app-usage-card', action: 'upgrade', small: true, children: t('Upgrade') })),
    }));
    return ((0, jsx_runtime_1.jsxs)(FeatureUsageCard_1.default, { card: card, children: [(0, jsx_runtime_1.jsx)(AppsUsageCardSection_1.default, { title: t('Marketplace_apps'), appsCount: marketplaceAppsCount, appsMaxCount: marketplaceAppsMaxCount, warningThreshold: defaultWarningThreshold }), (0, jsx_runtime_1.jsx)(AppsUsageCardSection_1.default, { title: t('Private_apps'), tip: privateAppsMaxCount === 0 ? t('Private_apps_premium_message') : undefined, appsCount: privateAppsCount, appsMaxCount: privateAppsMaxCount, warningThreshold: defaultWarningThreshold })] }));
};
exports.default = AppsUsageCard;
