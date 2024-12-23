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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const MemoizedSetting_1 = __importDefault(require("./MemoizedSetting"));
const MarkdownText_1 = __importDefault(require("../../../../components/MarkdownText"));
const EditableSettingsContext_1 = require("../../EditableSettingsContext");
const useHasSettingModule_1 = require("../hooks/useHasSettingModule");
function Setting({ className = undefined, settingId, sectionChanged }) {
    const setting = (0, EditableSettingsContext_1.useEditableSetting)(settingId);
    const persistedSetting = (0, ui_contexts_1.useSettingStructure)(settingId);
    const hasSettingModule = (0, useHasSettingModule_1.useHasSettingModule)(setting);
    if (!setting || !persistedSetting) {
        throw new Error(`Setting ${settingId} not found`);
    }
    // Checks if setting has at least required fields before doing anything
    if (!(0, core_typings_1.isSetting)(setting)) {
        throw new Error(`Setting ${settingId} is not valid`);
    }
    const dispatch = (0, EditableSettingsContext_1.useEditableSettingsDispatch)();
    const update = (0, fuselage_hooks_1.useDebouncedCallback)(({ value, editor }) => {
        if (!persistedSetting) {
            return;
        }
        dispatch([
            Object.assign(Object.assign(Object.assign({ _id: persistedSetting._id }, (value !== undefined && { value })), (editor !== undefined && { editor })), { changed: JSON.stringify(persistedSetting.value) !== JSON.stringify(value) ||
                    ((0, core_typings_1.isSettingColor)(persistedSetting) && JSON.stringify(persistedSetting.editor) !== JSON.stringify(editor)) }),
        ]);
    }, 230, [persistedSetting, dispatch]);
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const [value, setValue] = (0, react_1.useState)(setting.value);
    const [editor, setEditor] = (0, react_1.useState)((0, core_typings_1.isSettingColor)(setting) ? setting.editor : undefined);
    (0, react_1.useEffect)(() => {
        setValue(setting.value);
    }, [setting.value]);
    (0, react_1.useEffect)(() => {
        setEditor((0, core_typings_1.isSettingColor)(setting) ? setting.editor : undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setting.editor]);
    const onChangeValue = (0, react_1.useCallback)((value) => {
        setValue(value);
        update({ value });
    }, [update]);
    const onChangeEditor = (0, react_1.useCallback)((editor) => {
        setEditor(editor);
        update({ editor });
    }, [update]);
    const onResetButtonClick = (0, react_1.useCallback)(() => {
        setValue(setting.value);
        setEditor((0, core_typings_1.isSettingColor)(setting) ? setting.editor : undefined);
        update(Object.assign({ value: persistedSetting.packageValue }, ((0, core_typings_1.isSettingColor)(persistedSetting) && { editor: persistedSetting.packageEditor })));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setting.value, setting.editor, update, persistedSetting]);
    const { _id, disabled, readonly, type, packageValue, i18nLabel, i18nDescription, alert, invisible } = setting;
    const labelText = (i18n.exists(i18nLabel) && t(i18nLabel)) || (i18n.exists(_id) && t(_id)) || i18nLabel || _id;
    const hint = (0, react_1.useMemo)(() => i18nDescription && i18n.exists(i18nDescription) ? ((0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inline', preserveHtml: true, content: t(i18nDescription) })) : undefined, [i18n, i18nDescription, t]);
    const callout = (0, react_1.useMemo)(() => alert && (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: { __html: i18n.exists(alert) ? t(alert) : alert } }), [alert, i18n, t]);
    const shouldDisableEnterprise = setting.enterprise && !hasSettingModule;
    const PRICING_URL = 'https://go.rocket.chat/i/see-paid-plan-customize-homepage';
    const showUpgradeButton = (0, react_1.useMemo)(() => shouldDisableEnterprise ? ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { mbs: 4, is: 'a', href: PRICING_URL, target: '_blank', children: t('See_Paid_Plan') })) : undefined, [shouldDisableEnterprise, t]);
    const label = (0, react_1.useMemo)(() => {
        if (!shouldDisableEnterprise) {
            return labelText;
        }
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', mie: 4, children: labelText }), (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { variant: 'featured', children: t('Premium') })] }));
    }, [labelText, shouldDisableEnterprise, t]);
    const hasResetButton = !shouldDisableEnterprise &&
        !readonly &&
        type !== 'asset' &&
        (((0, core_typings_1.isSettingColor)(setting) && JSON.stringify(setting.packageEditor) !== JSON.stringify(editor)) ||
            JSON.stringify(value) !== JSON.stringify(packageValue)) &&
        !disabled;
    // @todo: type check props based on setting type
    return ((0, jsx_runtime_1.jsx)(MemoizedSetting_1.default, Object.assign({ className: className, label: label, hint: hint, callout: callout, showUpgradeButton: showUpgradeButton, sectionChanged: sectionChanged }, setting, { disabled: setting.disabled || shouldDisableEnterprise, value: value, editor: editor, hasResetButton: hasResetButton, onChangeValue: onChangeValue, onChangeEditor: onChangeEditor, onResetButtonClick: onResetButtonClick, invisible: invisible })));
}
exports.default = Setting;
