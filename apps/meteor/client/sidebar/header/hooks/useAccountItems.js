"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAccountItems = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useAccountItems = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const { unseenFeatures, featurePreviewEnabled } = (0, ui_client_1.usePreferenceFeaturePreviewList)();
    const handleMyAccount = (0, fuselage_hooks_1.useMutableCallback)(() => {
        router.navigate('/account');
    });
    const handlePreferences = (0, fuselage_hooks_1.useMutableCallback)(() => {
        router.navigate('/account/preferences');
    });
    const handleFeaturePreview = (0, fuselage_hooks_1.useMutableCallback)(() => {
        router.navigate('/account/feature-preview');
    });
    const handleAccessibility = (0, fuselage_hooks_1.useMutableCallback)(() => {
        router.navigate('/account/accessibility-and-appearance');
    });
    const featurePreviewItem = Object.assign({ id: 'feature-preview', icon: 'flask', content: t('Feature_preview'), onClick: handleFeaturePreview }, (unseenFeatures > 0 && {
        addon: ((0, jsx_runtime_1.jsx)(fuselage_1.Badge, { variant: 'primary', "aria-label": t('Unseen_features'), children: unseenFeatures })),
    }));
    return [
        {
            id: 'profile',
            icon: 'user',
            content: t('Profile'),
            onClick: handleMyAccount,
        },
        {
            id: 'preferences',
            icon: 'customize',
            content: t('Preferences'),
            onClick: handlePreferences,
        },
        {
            id: 'accessibility',
            icon: 'person-arms-spread',
            content: t('Accessibility_and_Appearance'),
            onClick: handleAccessibility,
        },
        ...(featurePreviewEnabled && ui_client_1.defaultFeaturesPreview.length > 0 ? [featurePreviewItem] : []),
    ];
};
exports.useAccountItems = useAccountItems;
