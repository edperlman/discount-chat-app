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
const AutoCompleteAgent_1 = __importDefault(require("../../../../components/AutoCompleteAgent"));
const VisitorAutoComplete_1 = __importDefault(require("../forms/VisitorAutoComplete"));
const OmnichannelTab = ({ form: { control } }) => {
    var _a, _b, _c, _d;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { field: visitorField, fieldState: visitorFieldState } = (0, react_hook_form_1.useController)({
        name: 'visitor',
        control,
        rules: { required: true },
    });
    const { field: agentField, fieldState: agentFieldState } = (0, react_hook_form_1.useController)({
        name: 'agent',
        control,
        rules: { required: true },
    });
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { flexShrink: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { flexGrow: 0, children: t('Visitor') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(VisitorAutoComplete_1.default, { value: visitorField.value, error: !!visitorFieldState.error, onChange: visitorField.onChange, placeholder: t('Username_Placeholder') }) }), ((_a = visitorFieldState.error) === null || _a === void 0 ? void 0 : _a.type) === 'required' && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('Required_field', { field: t('Visitor') }) }), ((_b = visitorFieldState.error) === null || _b === void 0 ? void 0 : _b.type) === 'validate' && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: visitorFieldState.error.message })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { flexShrink: 1, marginInlineStart: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { flexGrow: 0, children: t('Agent') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(AutoCompleteAgent_1.default, { error: (() => {
                                var _a, _b;
                                if (((_a = agentFieldState.error) === null || _a === void 0 ? void 0 : _a.type) === 'required') {
                                    return t('Required_field', { field: t('Agent') });
                                }
                                return (_b = agentFieldState.error) === null || _b === void 0 ? void 0 : _b.message;
                            })(), value: agentField.value, onChange: agentField.onChange, placeholder: t('Username_Placeholder') }) }), ((_c = agentFieldState.error) === null || _c === void 0 ? void 0 : _c.type) === 'required' && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('Required_field', { field: t('Agent') }) }), ((_d = agentFieldState.error) === null || _d === void 0 ? void 0 : _d.type) === 'validate' && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: agentFieldState.error.message })] })] }));
};
exports.default = OmnichannelTab;
