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
const Contextualbar_1 = require("../../../components/Contextualbar");
const useExternalLink_1 = require("../../../hooks/useExternalLink");
const useCheckoutUrl_1 = require("../subscription/hooks/useCheckoutUrl");
const AdminUserUpgrade = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const manageSubscriptionUrl = (0, useCheckoutUrl_1.useCheckoutUrl)()({ target: 'user-page', action: 'buy_more' });
    const openExternalLink = (0, useExternalLink_1.useExternalLink)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { h: 'full', children: (0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarEmptyContent, { icon: 'warning', title: t('Seat_limit_reached'), subtitle: t('Seat_limit_reached_Description') }) }), (0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => router.navigate('/admin/users'), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, role: 'link', onClick: () => openExternalLink(manageSubscriptionUrl), children: t('Buy_more_seats') })] }) })] }));
};
exports.default = AdminUserUpgrade;
