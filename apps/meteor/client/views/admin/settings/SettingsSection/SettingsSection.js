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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const EditableSettingsContext_1 = require("../../EditableSettingsContext");
const Setting_1 = __importDefault(require("../Setting"));
function SettingsSection({ groupId, hasReset = true, sectionName, currentTab, solo, help, children }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const editableSettings = (0, EditableSettingsContext_1.useEditableSettings)((0, react_1.useMemo)(() => ({
        group: groupId,
        section: sectionName,
        tab: currentTab,
    }), [groupId, sectionName, currentTab]));
    const changed = (0, react_1.useMemo)(() => editableSettings.some(({ changed }) => changed), [editableSettings]);
    const canReset = (0, react_1.useMemo)(() => editableSettings.some(({ value, packageValue }) => JSON.stringify(value) !== JSON.stringify(packageValue)), [editableSettings]);
    const dispatch = (0, EditableSettingsContext_1.useEditableSettingsDispatch)();
    const reset = (0, fuselage_hooks_1.useMutableCallback)(() => {
        dispatch(editableSettings
            .filter(({ disabled }) => !disabled)
            .map((setting) => {
            if ((0, core_typings_1.isSettingColor)(setting)) {
                return {
                    _id: setting._id,
                    value: setting.packageValue,
                    editor: setting.packageEditor,
                    changed: JSON.stringify(setting.value) !== JSON.stringify(setting.packageValue) ||
                        JSON.stringify(setting.editor) !== JSON.stringify(setting.packageEditor),
                };
            }
            return {
                _id: setting._id,
                value: setting.packageValue,
                changed: JSON.stringify(setting.value) !== JSON.stringify(setting.packageValue),
            };
        }));
    });
    const handleResetSectionClick = () => {
        reset();
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Accordion.Item, { "data-qa-section": sectionName, noncollapsible: solo || !sectionName, title: sectionName && t(sectionName), children: [help && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', color: 'hint', fontScale: 'p2', children: help })), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [editableSettings.map((setting) => (0, core_typings_1.isSetting)(setting) && (0, jsx_runtime_1.jsx)(Setting_1.default, { settingId: setting._id, sectionChanged: changed }, setting._id)), children] }), hasReset && canReset && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { children: t('Reset_section_settings'), secondary: true, danger: true, marginBlockStart: 16, "data-section": sectionName, onClick: handleResetSectionClick }))] }));
}
exports.default = SettingsSection;
