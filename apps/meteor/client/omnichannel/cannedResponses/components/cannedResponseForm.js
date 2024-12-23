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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const CannedResponsesComposer_1 = __importDefault(require("./CannedResponsesComposer/CannedResponsesComposer"));
const CannedResponsesComposerPreview_1 = __importDefault(require("./CannedResponsesComposer/CannedResponsesComposerPreview"));
const AutoCompleteDepartment_1 = __importDefault(require("../../../components/AutoCompleteDepartment"));
const Tags_1 = __importDefault(require("../../../components/Omnichannel/Tags"));
// TODO: refactor Tags field to get proper validation
const CannedResponseForm = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const hasManagerPermission = (0, ui_contexts_1.usePermission)('view-all-canned-responses');
    const hasMonitorPermission = (0, ui_contexts_1.usePermission)('save-department-canned-responses');
    const { control, formState: { errors }, watch, } = (0, react_hook_form_1.useFormContext)();
    const clickable = (0, css_in_js_1.css) `
		cursor: pointer;
	`;
    const { text, scope } = watch();
    const [preview, setPreview] = (0, react_1.useState)(false);
    const shortcutField = (0, fuselage_hooks_1.useUniqueId)();
    const messageField = (0, fuselage_hooks_1.useUniqueId)();
    const publicRadioField = (0, fuselage_hooks_1.useUniqueId)();
    const departmentRadioField = (0, fuselage_hooks_1.useUniqueId)();
    const privateRadioField = (0, fuselage_hooks_1.useUniqueId)();
    const departmentField = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: shortcutField, children: t('Shortcut') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'shortcut', control: control, rules: { required: t('Required_field', { field: t('Shortcut') }) }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { id: shortcutField, placeholder: `!${t('shortcut_name')}`, "aria-required": true, "aria-invalid": Boolean(errors === null || errors === void 0 ? void 0 : errors.shortcut), "aria-describedby": `${shortcutField}-error` }))) }), (errors === null || errors === void 0 ? void 0 : errors.shortcut) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${shortcutField}-error`, children: errors.shortcut.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldLabel, { htmlFor: messageField, w: 'full', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', children: [t('Message'), text !== '' && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: clickable, color: 'info', onClick: () => setPreview(!preview), children: preview ? t('Editor') : t('Preview') }))] }), preview ? ((0, jsx_runtime_1.jsx)(CannedResponsesComposerPreview_1.default, { text: text })) : ((0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'text', control: control, rules: { required: t('Required_field', { field: t('Message') }) }, render: ({ field: { value, onChange, name, onBlur } }) => ((0, jsx_runtime_1.jsx)(CannedResponsesComposer_1.default, { id: messageField, value: value, onChange: onChange, name: name, onBlur: onBlur, "aria-describedby": `${messageField}-error`, "aria-required": true, "aria-invalid": Boolean(errors.text) })) })), (errors === null || errors === void 0 ? void 0 : errors.text) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${messageField}-error`, children: errors.text.message }))] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'tags', control: control, render: ({ field: { value, onChange } }) => (0, jsx_runtime_1.jsx)(Tags_1.default, { handler: onChange, tags: value }) }) }), (hasManagerPermission || hasMonitorPermission) && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: publicRadioField, children: t('Public') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'scope', control: control, render: (_a) => {
                                            var _b = _a.field, { onChange, value } = _b, field = __rest(_b, ["onChange", "value"]);
                                            return ((0, jsx_runtime_1.jsx)(fuselage_1.RadioButton, Object.assign({}, field, { id: publicRadioField, onChange: () => onChange('global'), disabled: hasMonitorPermission && !hasManagerPermission, checked: value === 'global', "aria-describedby": `${publicRadioField}-hint`, "data-qa-id": 'canned-response-public-radio' })));
                                        } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${publicRadioField}-hint`, children: t('Canned_Response_Sharing_Public_Description') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: departmentRadioField, children: t('Department') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'scope', control: control, render: (_a) => {
                                            var _b = _a.field, { onChange, value } = _b, field = __rest(_b, ["onChange", "value"]);
                                            return ((0, jsx_runtime_1.jsx)(fuselage_1.RadioButton, Object.assign({}, field, { id: departmentRadioField, onChange: () => onChange('department'), checked: value === 'department', "aria-describedby": `${departmentRadioField}-hint` })));
                                        } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${departmentRadioField}-hint`, children: t('Canned_Response_Sharing_Department_Description') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: privateRadioField, children: t('Private') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'scope', control: control, render: (_a) => {
                                            var _b = _a.field, { onChange, value } = _b, field = __rest(_b, ["onChange", "value"]);
                                            return ((0, jsx_runtime_1.jsx)(fuselage_1.RadioButton, Object.assign({}, field, { id: privateRadioField, onChange: () => onChange('user'), checked: value === 'user', "aria-describedby": `${privateRadioField}-hint` })));
                                        } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${privateRadioField}-hint`, children: t('Canned_Response_Sharing_Private_Description') })] }), scope === 'department' && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: departmentField, children: t('Department') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'departmentId', control: control, rules: { required: t('Required_field', { field: t('Department') }) }, render: ({ field: { value, onChange } }) => ((0, jsx_runtime_1.jsx)(AutoCompleteDepartment_1.default, Object.assign({}, (hasMonitorPermission && { onlyMyDepartments: hasMonitorPermission }), { id: departmentField, value: value, onChange: onChange, "aria-describedby": `${departmentField}-error`, "aria-required": true, "aria-invalid": Boolean(errors === null || errors === void 0 ? void 0 : errors.departmentId), withTitle: false, renderItem: (_a) => {
                                            var { label } = _a, props = __rest(_a, ["label"]);
                                            return ((0, jsx_runtime_1.jsx)(fuselage_1.Option, Object.assign({}, props, { label: (0, jsx_runtime_1.jsx)("span", { style: { whiteSpace: 'normal' }, children: label }) })));
                                        } }))) }) }), (errors === null || errors === void 0 ? void 0 : errors.departmentId) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: departmentField, children: errors.departmentId.message }))] }))] }))] }));
};
exports.default = CannedResponseForm;
