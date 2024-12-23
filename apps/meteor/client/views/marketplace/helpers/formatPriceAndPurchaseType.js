"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatPriceAndPurchaseType = void 0;
const formatPrice_1 = require("./formatPrice");
const formatPricingPlan_1 = require("./formatPricingPlan");
const formatPriceAndPurchaseType = (purchaseType, pricingPlans, price) => {
    if (purchaseType === 'subscription') {
        const type = 'Subscription';
        if (!pricingPlans || !Array.isArray(pricingPlans) || pricingPlans.length === 0) {
            return { type, price: '-' };
        }
        return { type, price: (0, formatPricingPlan_1.formatPricingPlan)(pricingPlans[0]) };
    }
    if (price > 0) {
        return { type: 'Paid', price: (0, formatPrice_1.formatPrice)(price) };
    }
    return { type: 'Free', price: '-' };
};
exports.formatPriceAndPurchaseType = formatPriceAndPurchaseType;
