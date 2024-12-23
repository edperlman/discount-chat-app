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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const Contextualbar_1 = require("../../../components/Contextualbar");
const additionalForms_1 = require("../additionalForms");
const useRemoveCustomField_1 = require("./useRemoveCustomField");
const getInitialValues = (customFieldData) => ({
    field: (customFieldData === null || customFieldData === void 0 ? void 0 : customFieldData._id) || '',
    label: (customFieldData === null || customFieldData === void 0 ? void 0 : customFieldData.label) || '',
    scope: (customFieldData === null || customFieldData === void 0 ? void 0 : customFieldData.scope) || 'visitor',
    visibility: (customFieldData === null || customFieldData === void 0 ? void 0 : customFieldData.visibility) === 'visible',
    searchable: !!(customFieldData === null || customFieldData === void 0 ? void 0 : customFieldData.searchable),
    regexp: (customFieldData === null || customFieldData === void 0 ? void 0 : customFieldData.regexp) || '',
    // additional props
    type: (customFieldData === null || customFieldData === void 0 ? void 0 : customFieldData.type) || 'input',
    required: !!(customFieldData === null || customFieldData === void 0 ? void 0 : customFieldData.required),
    defaultValue: (customFieldData === null || customFieldData === void 0 ? void 0 : customFieldData.defaultValue) || '',
    options: (customFieldData === null || customFieldData === void 0 ? void 0 : customFieldData.options) || '',
    public: !!(customFieldData === null || customFieldData === void 0 ? void 0 : customFieldData.public),
});
const EditCustomFields = ({ customFieldData }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const handleDelete = (0, useRemoveCustomField_1.useRemoveCustomField)();
    const methods = (0, react_hook_form_1.useForm)({ mode: 'onBlur', values: getInitialValues(customFieldData) });
    const { control, handleSubmit, formState: { isDirty, errors }, } = methods;
    const saveCustomField = (0, ui_contexts_1.useMethod)('livechat:saveCustomField');
    const handleSave = (0, fuselage_hooks_1.useMutableCallback)((_a) => __awaiter(void 0, void 0, void 0, function* () {
        var { visibility } = _a, data = __rest(_a, ["visibility"]);
        try {
            yield saveCustomField(customFieldData === null || customFieldData === void 0 ? void 0 : customFieldData._id, Object.assign({ visibility: visibility ? 'visible' : 'hidden' }, data));
            dispatchToastMessage({ type: 'success', message: t('Saved') });
            queryClient.invalidateQueries(['livechat-customFields']);
            router.navigate('/omnichannel/customfields');
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const scopeOptions = (0, react_1.useMemo)(() => [
        ['visitor', t('Visitor')],
        ['room', t('Room')],
    ], [t]);
    const formId = (0, fuselage_hooks_1.useUniqueId)();
    const fieldField = (0, fuselage_hooks_1.useUniqueId)();
    const labelField = (0, fuselage_hooks_1.useUniqueId)();
    const scopeField = (0, fuselage_hooks_1.useUniqueId)();
    const visibilityField = (0, fuselage_hooks_1.useUniqueId)();
    const searchableField = (0, fuselage_hooks_1.useUniqueId)();
    const regexpField = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: (customFieldData === null || customFieldData === void 0 ? void 0 : customFieldData._id) ? t('Edit_Custom_Field') : t('New_Custom_Field') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: () => router.navigate('/omnichannel/customfields') })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.FormProvider, Object.assign({}, methods, { children: (0, jsx_runtime_1.jsx)("form", { id: formId, onSubmit: handleSubmit(handleSave), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: fieldField, required: true, children: t('Field') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'field', control: control, rules: {
                                                    required: t('Required_field', { field: t('Field') }),
                                                    validate: (value) => (!/^[0-9a-zA-Z-_]+$/.test(value) ? t('error-invalid-custom-field-name') : undefined),
                                                }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: fieldField }, field, { readOnly: Boolean(customFieldData === null || customFieldData === void 0 ? void 0 : customFieldData._id), "aria-required": true, "aria-invalid": Boolean(errors.field), "aria-describedby": `${fieldField}-error` }))) }) }), (errors === null || errors === void 0 ? void 0 : errors.field) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${fieldField}-error`, children: errors.field.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: labelField, required: true, children: t('Label') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'label', control: control, rules: { required: t('Required_field', { field: t('Label') }) }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: labelField }, field, { "aria-required": true, "aria-invalid": Boolean(errors.label), "aria-describedby": `${labelField}-error` }))) }) }), (errors === null || errors === void 0 ? void 0 : errors.label) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${labelField}-error`, children: errors.label.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: scopeField, children: t('Scope') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'scope', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({ id: scopeField }, field, { options: scopeOptions })) }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: visibilityField, children: t('Visible') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'visibility', control: control, render: (_a) => {
                                                    var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                    return (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: visibilityField }, field, { checked: value }));
                                                } })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: searchableField, children: t('Searchable') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'searchable', control: control, render: (_a) => {
                                                    var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                    return (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: searchableField }, field, { checked: value }));
                                                } })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: regexpField, children: t('Validation') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'regexp', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: regexpField }, field)) }) })] }), additionalForms_1.CustomFieldsAdditionalForm && (0, jsx_runtime_1.jsx)(additionalForms_1.CustomFieldsAdditionalForm, {})] }) }) })) }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarFooter, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => router.navigate('/omnichannel/customfields'), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: formId, "data-qa-id": 'BtnSaveEditCustomFieldsPage', primary: true, type: 'submit', disabled: !isDirty, children: t('Save') })] }), (customFieldData === null || customFieldData === void 0 ? void 0 : customFieldData._id) && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'trash', danger: true, onClick: () => handleDelete(customFieldData._id), children: t('Delete') }) }) }))] })] }));
};
exports.default = EditCustomFields;
