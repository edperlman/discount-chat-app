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
exports.getDefaultAction = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const ConditionForm_1 = require("./ConditionForm");
const ActionForm_1 = require("./actions/ActionForm");
const Contextualbar_1 = require("../../../components/Contextualbar");
const DEFAULT_SEND_MESSAGE_ACTION = {
    name: 'send-message',
    params: {
        sender: 'queue',
        name: '',
        msg: '',
    },
};
const DEFAULT_PAGE_URL_CONDITION = { name: 'page-url', value: '' };
const getDefaultAction = (action) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    switch (action.name) {
        case 'send-message':
            return {
                name: 'send-message',
                params: {
                    name: ((_a = action.params) === null || _a === void 0 ? void 0 : _a.name) || '',
                    msg: ((_b = action.params) === null || _b === void 0 ? void 0 : _b.msg) || '',
                    sender: ((_c = action.params) === null || _c === void 0 ? void 0 : _c.sender) || 'queue',
                },
            };
        case 'use-external-service':
            return {
                name: 'use-external-service',
                params: {
                    name: ((_d = action.params) === null || _d === void 0 ? void 0 : _d.name) || '',
                    sender: ((_e = action.params) === null || _e === void 0 ? void 0 : _e.sender) || 'queue',
                    serviceUrl: ((_f = action.params) === null || _f === void 0 ? void 0 : _f.serviceUrl) || '',
                    serviceTimeout: ((_g = action.params) === null || _g === void 0 ? void 0 : _g.serviceTimeout) || 0,
                    serviceFallbackMessage: ((_h = action.params) === null || _h === void 0 ? void 0 : _h.serviceFallbackMessage) || '',
                },
            };
    }
};
exports.getDefaultAction = getDefaultAction;
const getInitialValues = (triggerData) => {
    var _a, _b, _c, _d;
    return ({
        name: (_a = triggerData === null || triggerData === void 0 ? void 0 : triggerData.name) !== null && _a !== void 0 ? _a : '',
        description: (triggerData === null || triggerData === void 0 ? void 0 : triggerData.description) || '',
        enabled: (_b = triggerData === null || triggerData === void 0 ? void 0 : triggerData.enabled) !== null && _b !== void 0 ? _b : true,
        runOnce: !!(triggerData === null || triggerData === void 0 ? void 0 : triggerData.runOnce) || false,
        conditions: (_c = triggerData === null || triggerData === void 0 ? void 0 : triggerData.conditions.map(({ name, value }) => ({ name: name || 'page-url', value: value || '' }))) !== null && _c !== void 0 ? _c : [
            DEFAULT_PAGE_URL_CONDITION,
        ],
        actions: (_d = triggerData === null || triggerData === void 0 ? void 0 : triggerData.actions.map((action) => (0, exports.getDefaultAction)(action))) !== null && _d !== void 0 ? _d : [DEFAULT_SEND_MESSAGE_ACTION],
    });
};
const EditTrigger = ({ triggerData }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const saveTrigger = (0, ui_contexts_1.useEndpoint)('POST', '/v1/livechat/triggers');
    const initValues = getInitialValues(triggerData);
    const formId = (0, fuselage_hooks_1.useUniqueId)();
    const enabledField = (0, fuselage_hooks_1.useUniqueId)();
    const runOnceField = (0, fuselage_hooks_1.useUniqueId)();
    const nameField = (0, fuselage_hooks_1.useUniqueId)();
    const descriptionField = (0, fuselage_hooks_1.useUniqueId)();
    const { control, handleSubmit, trigger, formState: { isDirty, isSubmitting, errors }, } = (0, react_hook_form_1.useForm)({ mode: 'onBlur', reValidateMode: 'onBlur', values: initValues });
    // Alternative way of checking isValid in order to not trigger validation on every render
    // https://github.com/react-hook-form/documentation/issues/944
    const isValid = (0, react_1.useMemo)(() => Object.keys(errors).length === 0, [errors]);
    const { fields: conditionsFields } = (0, react_hook_form_1.useFieldArray)({
        control,
        name: 'conditions',
    });
    const { fields: actionsFields } = (0, react_hook_form_1.useFieldArray)({
        control,
        name: 'actions',
    });
    const saveTriggerMutation = (0, react_query_1.useMutation)({
        mutationFn: saveTrigger,
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Saved') });
            queryClient.invalidateQueries(['livechat-getTriggersById']);
            queryClient.invalidateQueries(['livechat-triggers']);
            router.navigate('/omnichannel/triggers');
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    const handleSave = (data) => __awaiter(void 0, void 0, void 0, function* () {
        return saveTriggerMutation.mutateAsync(Object.assign(Object.assign({}, data), { _id: triggerData === null || triggerData === void 0 ? void 0 : triggerData._id, actions: data.actions.map(exports.getDefaultAction) }));
    });
    return ((0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: (triggerData === null || triggerData === void 0 ? void 0 : triggerData._id) ? t('Edit_Trigger') : t('New_Trigger') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: () => router.navigate('/omnichannel/triggers') })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { children: (0, jsx_runtime_1.jsx)("form", { id: formId, onSubmit: handleSubmit(handleSave), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: enabledField, children: t('Enabled') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'enabled', control: control, render: (_a) => {
                                                var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                return (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: enabledField }, field, { checked: value }));
                                            } })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: runOnceField, children: t('Run_only_once_for_each_visitor') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'runOnce', control: control, render: (_a) => {
                                                var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                return (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: runOnceField }, field, { checked: value }));
                                            } })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: nameField, required: true, children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'name', control: control, rules: { required: t('Required_field', { field: t('Name') }) }, render: ({ field }) => {
                                                var _a;
                                                return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { id: nameField, error: (_a = errors === null || errors === void 0 ? void 0 : errors.name) === null || _a === void 0 ? void 0 : _a.message, "aria-required": true, "aria-invalid": Boolean(errors === null || errors === void 0 ? void 0 : errors.name), "aria-describedby": `${nameField}-error` })));
                                            } }) }), (errors === null || errors === void 0 ? void 0 : errors.name) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${nameField}-error`, children: errors === null || errors === void 0 ? void 0 : errors.name.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: descriptionField, children: t('Description') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'description', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: descriptionField }, field)) }) })] }), conditionsFields.map((field, index) => ((0, jsx_runtime_1.jsx)(ConditionForm_1.ConditionForm, { control: control, index: index }, field.id))), actionsFields.map((field, index) => ((0, jsx_runtime_1.jsx)(ActionForm_1.ActionForm, { control: control, trigger: trigger, index: index }, field.id)))] }) }) }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => router.navigate('/omnichannel/triggers'), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: formId, type: 'submit', primary: true, disabled: !isDirty || !isValid, loading: isSubmitting, children: t('Save') })] }) })] }));
};
exports.default = EditTrigger;
