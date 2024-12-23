"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionCalloutLimits = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useCheckoutUrl_1 = require("./hooks/useCheckoutUrl");
const useLicenseLimitsByBehavior_1 = require("../../../hooks/useLicenseLimitsByBehavior");
const SubscriptionCalloutLimits = () => {
    const manageSubscriptionUrl = (0, useCheckoutUrl_1.useCheckoutUrl)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const licenseLimits = (0, useLicenseLimitsByBehavior_1.useLicenseLimitsByBehavior)();
    if (!licenseLimits) {
        return null;
    }
    const { prevent_action, disable_modules, invalidate_license, start_fair_policy } = licenseLimits;
    const toTranslationKey = (key) => t(`subscription.callout.${key}`);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [start_fair_policy && ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'warning', title: t('subscription.callout.servicesDisruptionsMayOccur'), m: 8, children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'subscription.callout.description.limitsReached', count: start_fair_policy.length, children: ["Your workspace reached the ", (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: { val: start_fair_policy.map(toTranslationKey) } }), " limit.", (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: manageSubscriptionUrl({
                                target: 'callout',
                                action: 'start_fair_policy',
                                limits: start_fair_policy.join(','),
                            }), children: "Manage your subscription" }), "to increase limits."] }) })), prevent_action && ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', title: t('subscription.callout.servicesDisruptionsOccurring'), m: 8, children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'subscription.callout.description.limitsExceeded', count: prevent_action.length, children: ["Your workspace exceeded the ", (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: { val: prevent_action.map(toTranslationKey) } }), " license limit.", (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: manageSubscriptionUrl({
                                target: 'callout',
                                action: 'prevent_action',
                                limits: prevent_action.join(','),
                            }), children: "Manage your subscription" }), "to increase limits."] }) })), disable_modules && ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', title: t('subscription.callout.capabilitiesDisabled'), m: 8, children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'subscription.callout.description.limitsExceeded', count: disable_modules.length, children: ["Your workspace exceeded the ", (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: { val: disable_modules.map(toTranslationKey) } }), " license limit.", (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: manageSubscriptionUrl({
                                target: 'callout',
                                action: 'disable_modules',
                                limits: disable_modules.join(','),
                            }), children: "Manage your subscription" }), "to increase limits."] }) })), invalidate_license && ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', title: t('subscription.callout.allPremiumCapabilitiesDisabled'), m: 8, children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'subscription.callout.description.limitsExceeded', count: disable_modules.length, children: ["Your workspace exceeded the ", (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: { val: invalidate_license.map(toTranslationKey) } }), " license limit.", (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: manageSubscriptionUrl({
                                target: 'callout',
                                action: 'invalidate_license',
                                limits: invalidate_license.join(','),
                            }), children: "Manage your subscription" }), "to increase limits."] }) }))] }));
};
exports.SubscriptionCalloutLimits = SubscriptionCalloutLimits;
