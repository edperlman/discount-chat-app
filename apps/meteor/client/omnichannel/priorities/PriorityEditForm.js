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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const StringSettingInput_1 = __importDefault(require("../../views/admin/settings/Setting/inputs/StringSettingInput"));
const PriorityEditForm = ({ data, onSave, onCancel }) => {
    var _a;
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const [isSaving, setSaving] = (0, react_1.useState)(false);
    const { name, i18n, dirty } = data;
    const defaultName = t(i18n);
    const { control, getValues, setValue, formState: { errors, isValid, isDirty }, setError, handleSubmit, } = (0, react_hook_form_1.useForm)({
        mode: 'onChange',
        defaultValues: data ? { name: dirty ? name : defaultName } : {},
    });
    const handleSave = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        const { name } = getValues();
        if (!isValid) {
            return dispatchToastMessage({ type: 'error', message: t('Required_field', { field: t('Name') }) });
        }
        try {
            setSaving(true);
            yield onSave({ name, reset: name === defaultName });
        }
        catch (e) {
            const { error } = e;
            if (error) {
                setError('name', { message: t(error) });
            }
        }
        finally {
            setSaving(false);
        }
    }));
    const onReset = () => {
        setValue('name', defaultName, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'form', onSubmit: handleSubmit(handleSave), display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'name', control: control, rules: { required: t('Required_field', { field: t('Name') }), validate: (v) => (v === null || v === void 0 ? void 0 : v.trim()) !== '' }, render: ({ field: { value, onChange } }) => {
                            var _a;
                            return ((0, jsx_runtime_1.jsx)(StringSettingInput_1.default, { _id: '', packageValue: defaultName, disabled: isSaving, error: (_a = errors.name) === null || _a === void 0 ? void 0 : _a.message, label: `${t('Name')}*`, placeholder: t('Name'), value: value, name: 'name', hasResetButton: value !== t(i18n), onResetButtonClick: onReset, onChangeValue: onChange }));
                        } }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: (_a = errors.name) === null || _a === void 0 ? void 0 : _a.message })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => onCancel(), disabled: isSaving, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, disabled: !isDirty || !isValid, loading: isSaving, onClick: handleSave, children: t('Save') })] })] }));
};
exports.default = PriorityEditForm;
