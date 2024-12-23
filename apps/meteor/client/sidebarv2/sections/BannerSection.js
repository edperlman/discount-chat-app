"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const AirGappedRestrictionBanner_1 = __importDefault(require("./AirGappedRestrictionBanner/AirGappedRestrictionBanner"));
const StatusDisabledBanner_1 = __importDefault(require("./StatusDisabledBanner"));
const useAirGappedRestriction_1 = require("../../hooks/useAirGappedRestriction");
const BannerSection = () => {
    const [isRestricted, isWarning, remainingDays] = (0, useAirGappedRestriction_1.useAirGappedRestriction)();
    const isAdmin = (0, ui_contexts_1.useRole)('admin');
    const [bannerDismissed, setBannerDismissed] = (0, fuselage_hooks_1.useSessionStorage)('presence_cap_notifier', false);
    const presenceDisabled = (0, ui_contexts_1.useSetting)('Presence_broadcast_disabled', false);
    if ((isWarning || isRestricted) && isAdmin) {
        return (0, jsx_runtime_1.jsx)(AirGappedRestrictionBanner_1.default, { isRestricted: isRestricted, remainingDays: remainingDays });
    }
    if (presenceDisabled && !bannerDismissed) {
        return (0, jsx_runtime_1.jsx)(StatusDisabledBanner_1.default, { onDismiss: () => setBannerDismissed(true) });
    }
    return null;
};
exports.default = BannerSection;
