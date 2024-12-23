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
const PlanCardHeader_1 = __importDefault(require("./PlanCardHeader"));
const useFormatDate_1 = require("../../../../../../hooks/useFormatDate");
const useIsSelfHosted_1 = require("../../../../../../hooks/useIsSelfHosted");
const useLicense_1 = require("../../../../../../hooks/useLicense");
const links_1 = require("../../../utils/links");
const PlanCardPremium = ({ licenseInformation, licenseLimits }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { isSelfHosted, isLoading } = (0, useIsSelfHosted_1.useIsSelfHosted)();
    const formatDate = (0, useFormatDate_1.useFormatDate)();
    const planName = (0, useLicense_1.useLicenseName)();
    const isAutoRenew = licenseInformation.autoRenew;
    const { visualExpiration } = licenseInformation;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Card, { height: 'full', children: [(0, jsx_runtime_1.jsx)(PlanCardHeader_1.default, { name: (_a = planName.data) !== null && _a !== void 0 ? _a : '' }), (0, jsx_runtime_1.jsxs)(fuselage_1.CardBody, { flexDirection: 'column', children: [(licenseLimits === null || licenseLimits === void 0 ? void 0 : licenseLimits.activeUsers.max) === Infinity && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'lightning', size: 'x24', mie: 12 }), t('Unlimited_seats')] })), visualExpiration && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'calendar', size: 'x24', mie: 12 }), (0, jsx_runtime_1.jsx)("span", { children: isAutoRenew ? (t('Renews_DATE', { date: formatDate(visualExpiration || '') })) : ((0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'Contact_sales_renew_date', children: [(0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: links_1.CONTACT_SALES_LINK, children: "Contact sales" }), " to check plan renew date."] })) })] })), !isLoading ? ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'cloud-plus', size: 'x24', mie: 12 }), " ", isSelfHosted ? t('Self_managed_hosting') : t('Cloud_hosting')] })) : ((0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}))] })] }));
};
exports.default = PlanCardPremium;
