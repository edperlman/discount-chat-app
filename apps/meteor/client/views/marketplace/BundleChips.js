"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const BundleChips = ({ bundledIn }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const handlePlanName = (label) => {
        if (label === 'Enterprise') {
            return 'Premium';
        }
        return label;
    };
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: bundledIn.map(({ bundleId, bundleName }) => {
            // this is a workaround to not change plan name for versions lower than 6.5.0
            const handledName = handlePlanName(bundleName);
            return ((0, jsx_runtime_1.jsx)(fuselage_1.Tag, { variant: 'featured', title: t('this_app_is_included_with_subscription', {
                    bundleName: handledName,
                }), children: handledName }, bundleId));
        }) }));
};
exports.default = BundleChips;
