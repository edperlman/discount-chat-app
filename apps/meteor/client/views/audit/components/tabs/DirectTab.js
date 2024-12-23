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
const UserAutoCompleteMultiple_1 = __importDefault(require("../../../../components/UserAutoCompleteMultiple"));
const DirectTab = ({ form: { control } }) => {
    var _a, _b;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { field: usersField, fieldState: usersFieldState } = (0, react_hook_form_1.useController)({
        name: 'users',
        control,
        rules: {
            required: true,
            validate: (value) => {
                if (value.length < 2) {
                    return t('Select_at_least_two_users');
                }
            },
        },
    });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { flexShrink: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Users') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(UserAutoCompleteMultiple_1.default, { value: usersField.value, error: !!usersFieldState.error, onChange: usersField.onChange, placeholder: t('Username_Placeholder') }) }), ((_a = usersFieldState.error) === null || _a === void 0 ? void 0 : _a.type) === 'required' && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('Required_field', { field: t('Users') }) }), ((_b = usersFieldState.error) === null || _b === void 0 ? void 0 : _b.type) === 'validate' && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: usersFieldState.error.message })] }));
};
exports.default = DirectTab;
