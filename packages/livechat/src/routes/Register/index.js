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
exports.Register = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const preact_router_1 = require("preact-router");
const hooks_1 = require("preact/hooks");
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const api_1 = require("../../api");
const Button_1 = require("../../components/Button");
const Form_1 = require("../../components/Form");
const FormScrollShadow_1 = require("../../components/Form/FormScrollShadow");
const Screen_1 = __importDefault(require("../../components/Screen"));
const createClassName_1 = require("../../helpers/createClassName");
const sortArrayByColumn_1 = require("../../helpers/sortArrayByColumn");
const customFields_1 = __importDefault(require("../../lib/customFields"));
const email_1 = require("../../lib/email");
const parentCall_1 = require("../../lib/parentCall");
const triggers_1 = __importDefault(require("../../lib/triggers"));
const store_1 = require("../../store");
const styles_scss_1 = __importDefault(require("./styles.scss"));
const Register = () => {
    var _a, _b, _c, _d, _e, _f;
    const { t } = (0, react_i18next_1.useTranslation)();
    const topRef = (0, hooks_1.useRef)(null);
    const bottomRef = (0, hooks_1.useRef)(null);
    const { config: { departments = [], messages: { registrationFormMessage: message }, settings: { nameFieldRegistrationForm: hasNameField, emailFieldRegistrationForm: hasEmailField }, theme: { title }, customFields = [], }, iframe: { defaultDepartment, guest: { name: guestName = undefined, email: guestEmail = undefined } = {} }, loading = false, token, dispatch, user, } = (0, hooks_1.useContext)(store_1.StoreContext);
    const { handleSubmit, formState: { errors, isDirty, isValid, isSubmitting }, control, resetField, } = (0, react_hook_form_1.useForm)({
        mode: 'onChange',
    });
    const defaultTitle = t('need_help');
    const defaultMessage = t('please_tell_us_some_information_to_start_the_chat');
    const registerCustomFields = (customFields = {}) => {
        Object.entries(customFields).forEach(([key, value]) => {
            if (!value || value === '') {
                return;
            }
            customFields_1.default.setCustomField(key, value, true);
        });
    };
    const onSubmit = (_a) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        var { name, email, department } = _a, customFields = __rest(_a, ["name", "email", "department"]);
        const guestDepartment = department || defaultDepartment;
        const fields = Object.assign({ name,
            email }, (guestDepartment && { department: guestDepartment }));
        dispatch({ loading: true });
        try {
            const { visitor: user } = yield api_1.Livechat.grantVisitor({ visitor: Object.assign(Object.assign({}, fields), { token }) });
            yield dispatch({ user });
            (0, parentCall_1.parentCall)('callback', 'pre-chat-form-submit', fields);
            (_b = triggers_1.default.callbacks) === null || _b === void 0 ? void 0 : _b.emit('chat-visitor-registered');
            registerCustomFields(customFields);
        }
        finally {
            dispatch({ loading: false });
        }
    });
    const defaultDepartmentId = (0, hooks_1.useMemo)(() => { var _a; return (_a = departments.find((dept) => dept.name === defaultDepartment || dept._id === defaultDepartment)) === null || _a === void 0 ? void 0 : _a._id; }, [defaultDepartment, departments]);
    (0, hooks_1.useEffect)(() => {
        resetField('department', { defaultValue: defaultDepartmentId });
    }, [departments, defaultDepartment, resetField, defaultDepartmentId]);
    const availableDepartments = departments.filter((dept) => dept.showOnRegistration);
    (0, hooks_1.useEffect)(() => {
        if (user === null || user === void 0 ? void 0 : user._id) {
            (0, preact_router_1.route)('/');
        }
    }, [user === null || user === void 0 ? void 0 : user._id]);
    return ((0, jsx_runtime_1.jsxs)(Screen_1.default, { title: title || defaultTitle, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'register'), children: [(0, jsx_runtime_1.jsx)(FormScrollShadow_1.FormScrollShadow, { topRef: topRef, bottomRef: bottomRef, children: (0, jsx_runtime_1.jsx)(Screen_1.default.Content, { full: true, children: (0, jsx_runtime_1.jsxs)(Form_1.Form, { id: 'register', 
                        // The price of using react-hook-form on a preact project ¯\_(ツ)_/¯
                        onSubmit: handleSubmit(onSubmit), children: [(0, jsx_runtime_1.jsx)("div", { id: 'top', ref: topRef, style: { height: '1px', width: '100%' } }), (0, jsx_runtime_1.jsx)("p", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'register__message'), children: message || defaultMessage }), hasNameField ? ((0, jsx_runtime_1.jsx)(Form_1.FormField, { required: true, label: t('name'), error: (_b = (_a = errors.name) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.toString(), children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'name', control: control, defaultValue: guestName, rules: { required: true }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(Form_1.TextInput, Object.assign({ placeholder: t('insert_your_field_here', { field: t('name') }), disabled: loading }, field))) }) })) : null, hasEmailField ? ((0, jsx_runtime_1.jsx)(Form_1.FormField, { required: true, label: t('email'), error: (_d = (_c = errors.email) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.toString(), children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'email', control: control, defaultValue: guestEmail, rules: {
                                        required: true,
                                        validate: { checkEmail: (value) => (0, email_1.validateEmail)(value, { style: 'rfc' }) || t('invalid_email') },
                                    }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(Form_1.TextInput, Object.assign({ placeholder: t('insert_your_field_here', { field: t('email') }), disabled: loading }, field))) }) })) : null, availableDepartments.length ? ((0, jsx_runtime_1.jsx)(Form_1.FormField, { label: t('i_need_help_with'), error: (_f = (_e = errors.department) === null || _e === void 0 ? void 0 : _e.message) === null || _f === void 0 ? void 0 : _f.toString(), children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'department', control: control, defaultValue: defaultDepartmentId, render: ({ field }) => ((0, jsx_runtime_1.jsx)(Form_1.SelectInput, Object.assign({ options: (0, sortArrayByColumn_1.sortArrayByColumn)(availableDepartments, 'name').map(({ _id, name }) => ({
                                            value: _id,
                                            label: name,
                                        })), placeholder: t('choose_an_option'), disabled: loading }, field))) }) })) : null, customFields && (0, jsx_runtime_1.jsx)(Form_1.CustomFields, { customFields: customFields, loading: loading, control: control, errors: errors }), (0, jsx_runtime_1.jsx)("div", { ref: bottomRef, id: 'bottom', style: { height: '1px', width: '100%' } })] }) }) }), (0, jsx_runtime_1.jsx)(Screen_1.default.Footer, { children: (0, jsx_runtime_1.jsx)(Button_1.Button, { loading: loading, form: 'register', submit: true, full: true, disabled: !isDirty || !isValid || loading || isSubmitting, children: t('start_chat') }) })] }));
};
exports.Register = Register;
exports.default = exports.Register;
