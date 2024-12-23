"use strict";
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
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useRemoveTag_1 = require("./useRemoveTag");
const AutoCompleteDepartmentMultiple_1 = __importDefault(require("../../components/AutoCompleteDepartmentMultiple"));
const Contextualbar_1 = require("../../components/Contextualbar");
const TagEdit = ({ tagData, currentDepartments }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const handleDeleteTag = (0, useRemoveTag_1.useRemoveTag)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const saveTag = (0, ui_contexts_1.useMethod)('livechat:saveTag');
    const { _id, name, description } = tagData || {};
    const { control, formState: { isDirty, errors }, handleSubmit, } = (0, react_hook_form_1.useForm)({
        mode: 'onBlur',
        values: {
            name: name || '',
            description: description || '',
            departments: (currentDepartments === null || currentDepartments === void 0 ? void 0 : currentDepartments.map((dep) => ({ label: dep.name, value: dep._id }))) || [],
        },
    });
    const handleSave = (0, fuselage_hooks_1.useMutableCallback)((_a) => __awaiter(void 0, [_a], void 0, function* ({ name, description, departments }) {
        const departmentsId = (departments === null || departments === void 0 ? void 0 : departments.map((dep) => dep.value)) || [''];
        try {
            yield saveTag(_id, { name, description }, departmentsId);
            dispatchToastMessage({ type: 'success', message: t('Saved') });
            queryClient.invalidateQueries(['livechat-tags']);
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
        finally {
            router.navigate('/omnichannel/tags');
        }
    }));
    const formId = (0, fuselage_hooks_1.useUniqueId)();
    const nameField = (0, fuselage_hooks_1.useUniqueId)();
    const descriptionField = (0, fuselage_hooks_1.useUniqueId)();
    const departmentsField = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: _id ? t('Edit_Tag') : t('New_Tag') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: () => router.navigate('/omnichannel/tags') })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { id: formId, is: 'form', autoComplete: 'off', onSubmit: handleSubmit(handleSave), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: nameField, required: true, children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'name', control: control, rules: { required: t('Required_field', { field: t('Name') }) }, render: ({ field }) => { var _a; return (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { error: (_a = errors === null || errors === void 0 ? void 0 : errors.name) === null || _a === void 0 ? void 0 : _a.message, "aria-describedby": `${nameField}-error` })); } }) }), (errors === null || errors === void 0 ? void 0 : errors.name) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${nameField}-error`, children: (_a = errors === null || errors === void 0 ? void 0 : errors.name) === null || _a === void 0 ? void 0 : _a.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: descriptionField, children: t('Description') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'description', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: descriptionField }, field)) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: departmentsField, children: t('Departments') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'departments', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(AutoCompleteDepartmentMultiple_1.default, Object.assign({ id: departmentsField, showArchived: true }, field)) }) })] })] }) }) }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarFooter, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => router.navigate('/omnichannel/tags'), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: formId, disabled: !isDirty, type: 'submit', primary: true, children: t('Save') })] }), _id && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'trash', danger: true, onClick: () => handleDeleteTag(_id), children: t('Delete') }) }) }))] })] }));
};
exports.default = TagEdit;
