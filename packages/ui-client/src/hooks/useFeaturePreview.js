"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFeaturePreview = void 0;
const usePreferenceFeaturePreviewList_1 = require("./usePreferenceFeaturePreviewList");
const useFeaturePreview = (featureName) => {
    const { features } = (0, usePreferenceFeaturePreviewList_1.usePreferenceFeaturePreviewList)();
    const currentFeature = features === null || features === void 0 ? void 0 : features.find((feature) => feature.name === featureName);
    return Boolean(currentFeature === null || currentFeature === void 0 ? void 0 : currentFeature.value);
};
exports.useFeaturePreview = useFeaturePreview;
