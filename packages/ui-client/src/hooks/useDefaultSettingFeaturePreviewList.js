"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDefaultSettingFeaturePreviewList = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useFeaturePreviewList_1 = require("./useFeaturePreviewList");
const useDefaultSettingFeaturePreviewList = () => {
    const featurePreviewSettingJSON = (0, ui_contexts_1.useSetting)('Accounts_Default_User_Preferences_featuresPreview', '[]');
    const settingFeaturePreview = (0, react_1.useMemo)(() => (0, useFeaturePreviewList_1.parseSetting)(featurePreviewSettingJSON), [featurePreviewSettingJSON]);
    return (0, useFeaturePreviewList_1.useFeaturePreviewList)(settingFeaturePreview !== null && settingFeaturePreview !== void 0 ? settingFeaturePreview : []);
};
exports.useDefaultSettingFeaturePreviewList = useDefaultSettingFeaturePreviewList;
