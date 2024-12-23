"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_i18next_1 = require("react-i18next");
const usePreferenceFeaturePreviewList_1 = require("../../hooks/usePreferenceFeaturePreviewList");
const FeaturePreviewBadge = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { unseenFeatures } = (0, usePreferenceFeaturePreviewList_1.usePreferenceFeaturePreviewList)();
    if (!unseenFeatures) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Badge, { variant: 'primary', "aria-label": t('Unseen_features'), children: unseenFeatures }));
};
exports.default = FeaturePreviewBadge;
