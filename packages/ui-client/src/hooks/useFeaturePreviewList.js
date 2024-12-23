"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFeaturePreviewList = exports.parseSetting = exports.enabledDefaultFeatures = exports.defaultFeaturesPreview = void 0;
// TODO: Move the features preview array to another directory to be accessed from both BE and FE.
exports.defaultFeaturesPreview = [
    {
        name: 'quickReactions',
        i18n: 'Quick_reactions',
        description: 'Quick_reactions_description',
        group: 'Message',
        imageUrl: 'images/featurePreview/quick-reactions.png',
        value: false,
        enabled: true,
    },
    {
        name: 'navigationBar',
        i18n: 'Navigation_bar',
        description: 'Navigation_bar_description',
        group: 'Navigation',
        value: false,
        enabled: false,
    },
    {
        name: 'enable-timestamp-message-parser',
        i18n: 'Enable_timestamp',
        description: 'Enable_timestamp_description',
        group: 'Message',
        imageUrl: 'images/featurePreview/timestamp.png',
        value: false,
        enabled: true,
    },
    {
        name: 'contextualbarResizable',
        i18n: 'Contextualbar_resizable',
        description: 'Contextualbar_resizable_description',
        group: 'Navigation',
        imageUrl: 'images/featurePreview/resizable-contextual-bar.png',
        value: false,
        enabled: true,
    },
    {
        name: 'newNavigation',
        i18n: 'New_navigation',
        description: 'New_navigation_description',
        group: 'Navigation',
        imageUrl: 'images/featurePreview/enhanced-navigation.png',
        value: false,
        enabled: true,
    },
    {
        name: 'sidepanelNavigation',
        i18n: 'Sidepanel_navigation',
        description: 'Sidepanel_navigation_description',
        group: 'Navigation',
        value: false,
        enabled: true,
        enableQuery: {
            name: 'newNavigation',
            value: true,
        },
    },
];
exports.enabledDefaultFeatures = exports.defaultFeaturesPreview.filter((feature) => feature.enabled);
// TODO: Remove this logic after we have a way to store object settings.
const parseSetting = (setting) => {
    if (typeof setting === 'string') {
        try {
            return JSON.parse(setting);
        }
        catch (_) {
            return;
        }
    }
    return setting;
};
exports.parseSetting = parseSetting;
const useFeaturePreviewList = (featuresList) => {
    const unseenFeatures = exports.enabledDefaultFeatures.filter((defaultFeature) => !(featuresList === null || featuresList === void 0 ? void 0 : featuresList.find((feature) => feature.name === defaultFeature.name))).length;
    const mergedFeatures = exports.enabledDefaultFeatures.map((defaultFeature) => {
        const features = featuresList === null || featuresList === void 0 ? void 0 : featuresList.find((feature) => feature.name === defaultFeature.name);
        return Object.assign(Object.assign({}, defaultFeature), features);
    });
    return { unseenFeatures, features: mergedFeatures };
};
exports.useFeaturePreviewList = useFeaturePreviewList;
