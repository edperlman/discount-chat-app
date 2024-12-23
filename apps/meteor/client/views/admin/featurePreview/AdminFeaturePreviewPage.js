"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const Page_1 = require("../../../components/Page");
const useFeaturePreviewEnableQuery_1 = require("../../../hooks/useFeaturePreviewEnableQuery");
const EditableSettingsContext_1 = require("../EditableSettingsContext");
const Setting_1 = __importDefault(require("../settings/Setting"));
const SettingsGroupPageSkeleton_1 = __importDefault(require("../settings/SettingsGroupPage/SettingsGroupPageSkeleton"));
const AdminFeaturePreviewPage = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const allowFeaturePreviewSetting = (0, EditableSettingsContext_1.useEditableSetting)('Accounts_AllowFeaturePreview');
    const { features } = (0, ui_client_1.useDefaultSettingFeaturePreviewList)();
    const { watch, formState: { isDirty }, setValue, handleSubmit, reset, } = (0, react_hook_form_1.useForm)({
        defaultValues: { featuresPreview: features },
    });
    const { featuresPreview } = watch();
    const dispatch = (0, ui_contexts_1.useSettingsDispatch)();
    const handleSave = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const featuresToBeSaved = featuresPreview.map((feature) => ({ name: feature.name, value: feature.value }));
            yield dispatch([
                { _id: allowFeaturePreviewSetting._id, value: allowFeaturePreviewSetting.value },
                { _id: 'Accounts_Default_User_Preferences_featuresPreview', value: JSON.stringify(featuresToBeSaved) },
            ]);
            dispatchToastMessage({ type: 'success', message: t('Preferences_saved') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
        finally {
            reset({ featuresPreview });
        }
    });
    const handleFeatures = (e) => {
        const updated = featuresPreview.map((item) => (item.name === e.target.name ? Object.assign(Object.assign({}, item), { value: e.target.checked }) : item));
        setValue('featuresPreview', updated, { shouldDirty: true });
    };
    const grouppedFeaturesPreview = (0, useFeaturePreviewEnableQuery_1.useFeaturePreviewEnableQuery)(featuresPreview);
    if (!allowFeaturePreviewSetting) {
        // TODO: Implement FeaturePreviewSkeleton component
        return (0, jsx_runtime_1.jsx)(SettingsGroupPageSkeleton_1.default, {});
    }
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Feature_preview') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { maxWidth: 'x600', w: 'full', alignSelf: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { block: 24, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p1', children: t('Feature_preview_admin_page_description') }), (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { children: t('Feature_preview_page_callout') }), (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { children: t('Feature_preview_admin_page_callout') }), (0, jsx_runtime_1.jsx)(Setting_1.default, { settingId: 'Accounts_AllowFeaturePreview', sectionChanged: allowFeaturePreviewSetting.changed })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Accordion, { children: grouppedFeaturesPreview === null || grouppedFeaturesPreview === void 0 ? void 0 : grouppedFeaturesPreview.map(([group, features], index) => ((0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { defaultExpanded: index === 0, title: t(group), children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: features.map((feature) => ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: feature.name, children: t(feature.i18n) }), (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: feature.name, checked: feature.value, name: feature.name, onChange: handleFeatures, disabled: feature.disabled || !allowFeaturePreviewSetting.value })] }), feature.description && (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { mbs: 12, children: t(feature.description) })] }), feature.imageUrl && (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'img', width: '100%', height: 'auto', mbs: 16, src: feature.imageUrl, alt: '' })] }, feature.name))) }) }, group))) })] }) }), (0, jsx_runtime_1.jsx)(Page_1.PageFooter, { isDirty: isDirty || allowFeaturePreviewSetting.changed, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => reset({ featuresPreview: features }), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, disabled: !(isDirty || allowFeaturePreviewSetting.changed), onClick: handleSubmit(handleSave), children: t('Save_changes') })] }) })] }));
};
exports.default = AdminFeaturePreviewPage;
