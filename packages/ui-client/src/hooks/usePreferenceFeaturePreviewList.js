"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePreferenceFeaturePreviewList = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useFeaturePreviewList_1 = require("./useFeaturePreviewList");
const usePreferenceFeaturePreviewList = () => {
    const featurePreviewEnabled = (0, ui_contexts_1.useSetting)('Accounts_AllowFeaturePreview', false);
    const userFeaturesPreviewPreference = (0, ui_contexts_1.useUserPreference)('featuresPreview');
    const userFeaturesPreview = (0, react_1.useMemo)(() => (0, useFeaturePreviewList_1.parseSetting)(userFeaturesPreviewPreference), [userFeaturesPreviewPreference]);
    const { unseenFeatures, features } = (0, useFeaturePreviewList_1.useFeaturePreviewList)(userFeaturesPreview !== null && userFeaturesPreview !== void 0 ? userFeaturesPreview : []);
    if (!featurePreviewEnabled) {
        return { unseenFeatures: 0, features: [], featurePreviewEnabled };
    }
    return { unseenFeatures, features, featurePreviewEnabled };
};
exports.usePreferenceFeaturePreviewList = usePreferenceFeaturePreviewList;
