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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const Page_1 = require("../../../../components/Page");
const EditableSettingsContext_1 = require("../../EditableSettingsContext");
const SettingsGroupPage = ({ children = undefined, headerButtons = undefined, onClickBack, _id, i18nLabel, i18nDescription = undefined, tabs = undefined, isCustom = false, }) => {
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, ui_contexts_1.useSettingsDispatch)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const changedEditableSettings = (0, EditableSettingsContext_1.useEditableSettings)((0, react_1.useMemo)(() => ({
        group: _id,
        changed: true,
    }), [_id]));
    const originalSettings = (0, ui_contexts_1.useSettings)((0, react_1.useMemo)(() => ({
        _id: changedEditableSettings.map(({ _id }) => _id),
    }), [changedEditableSettings]));
    const isColorSetting = (setting) => setting.type === 'color';
    const save = (0, fuselage_hooks_1.useEffectEvent)(() => __awaiter(void 0, void 0, void 0, function* () {
        const changes = changedEditableSettings.map((setting) => {
            if (isColorSetting(setting)) {
                return {
                    _id: setting._id,
                    value: setting.value,
                    editor: setting.editor,
                };
            }
            return {
                _id: setting._id,
                value: setting.value,
            };
        });
        if (changes.length === 0) {
            return;
        }
        try {
            yield dispatch(changes);
            dispatchToastMessage({ type: 'success', message: t('Settings_updated') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const dispatchToEditing = (0, EditableSettingsContext_1.useEditableSettingsDispatch)();
    const cancel = (0, fuselage_hooks_1.useEffectEvent)(() => {
        const settingsToDispatch = changedEditableSettings
            .map(({ _id }) => originalSettings.find((setting) => setting._id === _id))
            .map((setting) => {
            if (!setting) {
                return;
            }
            if (isColorSetting(setting)) {
                return {
                    _id: setting._id,
                    value: setting.value,
                    editor: setting.editor,
                    changed: false,
                };
            }
            return {
                _id: setting._id,
                value: setting.value,
                changed: false,
            };
        })
            .filter(Boolean);
        dispatchToEditing(settingsToDispatch);
    });
    const handleSubmit = (event) => {
        event.preventDefault();
        save();
    };
    const handleCancelClick = (event) => {
        event.preventDefault();
        cancel();
    };
    const handleSaveClick = (event) => {
        event.preventDefault();
        save();
    };
    if (!_id) {
        return (0, jsx_runtime_1.jsx)(Page_1.Page, { children: children });
    }
    const isTranslationKey = (key) => key !== undefined;
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { is: 'form', action: '#', method: 'post', onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { onClickBack: onClickBack, title: i18nLabel && isTranslationKey(i18nLabel) && t(i18nLabel), children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: headerButtons }) }), tabs, isCustom ? (children) : ((0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { marginBlock: 'none', marginInline: 'auto', width: 'full', maxWidth: 'x580', children: [i18nDescription && isTranslationKey(i18nDescription) && i18n.exists(i18nDescription) && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', color: 'hint', fontScale: 'p2', children: t(i18nDescription) })), (0, jsx_runtime_1.jsx)(fuselage_1.Accordion, { className: 'page-settings', children: children })] }) })), (0, jsx_runtime_1.jsx)(Page_1.PageFooter, { isDirty: !(changedEditableSettings.length === 0), children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [changedEditableSettings.length > 0 && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { type: 'reset', onClick: handleCancelClick, children: t('Cancel') })), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { children: t('Save_changes'), className: 'save', disabled: changedEditableSettings.length === 0, primary: true, type: 'submit', onClick: handleSaveClick })] }) })] }));
};
exports.default = (0, react_1.memo)(SettingsGroupPage);
