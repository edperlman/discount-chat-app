"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useAuditForm_1 = require("../hooks/useAuditForm");
const useSendTelemetryMutation_1 = require("../hooks/useSendTelemetryMutation");
const DateRangePicker_1 = __importDefault(require("./forms/DateRangePicker"));
const DirectTab_1 = __importDefault(require("./tabs/DirectTab"));
const OmnichannelTab_1 = __importDefault(require("./tabs/OmnichannelTab"));
const RoomsTab_1 = __importDefault(require("./tabs/RoomsTab"));
const UsersTab_1 = __importDefault(require("./tabs/UsersTab"));
const AuditForm = ({ type, onSubmit, setSelectedRoom }) => {
    var _a, _b;
    const { t } = (0, react_i18next_1.useTranslation)();
    const form = (0, useAuditForm_1.useAuditForm)();
    const { control, handleSubmit, register } = form;
    const { field: dateRangeField, fieldState: dateRangeFieldState } = (0, react_hook_form_1.useController)({ name: 'dateRange', control });
    const sendTelemetryMutation = (0, useSendTelemetryMutation_1.useSendTelemetryMutation)();
    const submit = () => {
        sendTelemetryMutation.mutate({
            params: [{ eventName: 'updateCounter', settingsId: 'Message_Auditing_Apply_Count', timestamp: Date.now() }],
        });
        onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit(Object.assign({ type }, form.getValues()));
    };
    return ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(submit), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', justifyContent: 'stretch', marginInline: -4, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { flexShrink: 1, marginInline: 4, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Message') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ placeholder: t('Search') }, register('msg'))) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { flexShrink: 1, marginInline: 4, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Date') }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(DateRangePicker_1.default, { value: dateRangeField.value, onChange: dateRangeField.onChange, display: 'flex', flexGrow: 1 }), ((_a = dateRangeFieldState.error) === null || _a === void 0 ? void 0 : _a.type) === 'required' && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('Required_field', { field: t('Date') }) }), ((_b = dateRangeFieldState.error) === null || _b === void 0 ? void 0 : _b.type) === 'validate' && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: dateRangeFieldState.error.message })] })] })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'flex-start', children: [type === '' && (0, jsx_runtime_1.jsx)(RoomsTab_1.default, { form: form, setSelectedRoom: setSelectedRoom }), type === 'u' && (0, jsx_runtime_1.jsx)(UsersTab_1.default, { form: form }), type === 'd' && (0, jsx_runtime_1.jsx)(DirectTab_1.default, { form: form }), type === 'l' && (0, jsx_runtime_1.jsx)(OmnichannelTab_1.default, { form: form }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexShrink: 0, mbs: 28, mis: 8, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { align: 'end', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Button, { secondary: true, onClick: () => window.print(), children: [t('Export'), " ", t('PDF')] }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, type: 'submit', children: t('Apply') })] }) })] })] }));
};
exports.default = AuditForm;
