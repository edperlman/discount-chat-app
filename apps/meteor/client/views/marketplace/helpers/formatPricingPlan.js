"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPricingPlan = void 0;
const formatPrice_1 = require("./formatPrice");
const i18n_1 = require("../../../../app/utils/lib/i18n");
const formatPricingPlan = ({ strategy, price, tiers = [], trialDays }) => {
    const { perUnit = false } = (Array.isArray(tiers) && tiers.find((tier) => tier.price === price)) || {};
    const pricingPlanTranslationString = [
        'Apps_Marketplace_pricingPlan',
        Array.isArray(tiers) && tiers.length > 0 && '+*',
        strategy,
        trialDays && 'trialDays',
        perUnit && 'perUser',
    ]
        .filter(Boolean)
        .join('_');
    return (0, i18n_1.t)(pricingPlanTranslationString, {
        price: (0, formatPrice_1.formatPrice)(price),
        trialDays,
    });
};
exports.formatPricingPlan = formatPricingPlan;
