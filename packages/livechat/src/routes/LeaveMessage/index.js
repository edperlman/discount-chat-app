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
const hooks_1 = require("preact/hooks");
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const styles_scss_1 = __importDefault(require("./styles.scss"));
const api_1 = require("../../api");
const Button_1 = require("../../components/Button");
const Form_1 = require("../../components/Form");
const FormScrollShadow_1 = require("../../components/Form/FormScrollShadow");
const MultilineTextInput_1 = require("../../components/Form/MultilineTextInput");
const MarkdownBlock_1 = __importDefault(require("../../components/MarkdownBlock"));
const Modal_1 = require("../../components/Modal");
const Screen_1 = __importDefault(require("../../components/Screen"));
const createClassName_1 = require("../../helpers/createClassName");
const parseOfflineMessage_1 = require("../../helpers/parseOfflineMessage");
const sortArrayByColumn_1 = require("../../helpers/sortArrayByColumn");
const email_1 = require("../../lib/email");
const parentCall_1 = require("../../lib/parentCall");
const random_1 = require("../../lib/random");
const store_1 = require("../../store");
const LeaveMessage = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const { config: { departments = [], messages: { offlineMessage, offlineSuccessMessage, offlineUnavailableMessage }, theme: { offlineTitle: title, offlineColor }, settings: { displayOfflineForm }, }, iframe, loading, dispatch, alerts, } = (0, hooks_1.useContext)(store_1.StoreContext);
    const { t } = (0, react_i18next_1.useTranslation)();
    const topRef = (0, hooks_1.useRef)(null);
    const bottomRef = (0, hooks_1.useRef)(null);
    const { handleSubmit, formState: { errors, isDirty, isValid, isSubmitting }, control, } = (0, react_hook_form_1.useForm)({ mode: 'onChange' });
    const customOfflineTitle = (_a = iframe === null || iframe === void 0 ? void 0 : iframe.theme) === null || _a === void 0 ? void 0 : _a.offlineTitle;
    const onSubmit = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, email, department, message }) {
        const fields = Object.assign(Object.assign({ name,
            email }, (department && { department })), { message });
        yield dispatch({ loading: true });
        try {
            // TODO: Remove intersection after ts refactor of parseOfflineMessage
            const payload = (0, parseOfflineMessage_1.parseOfflineMessage)(fields);
            const text = yield api_1.Livechat.sendOfflineMessage(payload);
            yield Modal_1.ModalManager.alert({
                text: offlineSuccessMessage || text,
            });
            (0, parentCall_1.parentCall)('callback', 'offline-form-submit', fields);
            return true;
        }
        catch (error) {
            const errorMessage = error === null || error === void 0 ? void 0 : error.error;
            console.error(errorMessage);
            const alert = { id: (0, random_1.createToken)(), children: errorMessage, error: true, timeout: 5000 };
            yield dispatch({ alerts: (alerts.push(alert), alerts) });
            return false;
        }
        finally {
            yield dispatch({ loading: false });
        }
    });
    const defaultTitle = t('leave_a_message');
    const defaultMessage = t('we_are_not_online_right_now_please_leave_a_message');
    const defaultUnavailableMessage = t('offline_form_not_available');
    return ((0, jsx_runtime_1.jsxs)(Screen_1.default, { title: customOfflineTitle || title || defaultTitle, color: offlineColor, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'leave-message'), children: [displayOfflineForm ? ((0, jsx_runtime_1.jsx)(FormScrollShadow_1.FormScrollShadow, { topRef: topRef, bottomRef: bottomRef, children: (0, jsx_runtime_1.jsxs)(Screen_1.default.Content, { full: true, children: [(0, jsx_runtime_1.jsx)("div", { id: 'top', ref: topRef, style: { height: '1px', width: '100%' } }), (0, jsx_runtime_1.jsx)("div", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'leave-message__main-message'), children: (0, jsx_runtime_1.jsx)(MarkdownBlock_1.default, { text: offlineMessage || defaultMessage }) }), (0, jsx_runtime_1.jsxs)(Form_1.Form
                        // The price of using react-hook-form on a preact project ¯\_(ツ)_/¯
                        , { 
                            // The price of using react-hook-form on a preact project ¯\_(ツ)_/¯
                            onSubmit: handleSubmit(onSubmit), id: 'leaveMessage', children: [(0, jsx_runtime_1.jsx)(Form_1.FormField, { required: true, label: t('name'), error: (_c = (_b = errors.name) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.toString(), children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'name', control: control, 
                                        // defaultValue={guestName}
                                        rules: { required: true }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(Form_1.TextInput, Object.assign({ placeholder: t('insert_your_field_here', { field: t('name') }), disabled: loading }, field))) }) }), (0, jsx_runtime_1.jsx)(Form_1.FormField, { required: true, label: t('email'), error: (_e = (_d = errors.email) === null || _d === void 0 ? void 0 : _d.message) === null || _e === void 0 ? void 0 : _e.toString(), children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'email', control: control, 
                                        // defaultValue={guestEmail}
                                        rules: {
                                            required: true,
                                            validate: { checkEmail: (value) => (0, email_1.validateEmail)(value, { style: 'rfc' }) || t('invalid_email') },
                                        }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(Form_1.TextInput, Object.assign({ placeholder: t('insert_your_field_here', { field: t('email') }), disabled: loading }, field))) }) }), (departments === null || departments === void 0 ? void 0 : departments.some((dept) => dept.showOnOfflineForm)) ? ((0, jsx_runtime_1.jsx)(Form_1.FormField, { label: t('i_need_help_with'), error: (_g = (_f = errors.department) === null || _f === void 0 ? void 0 : _f.message) === null || _g === void 0 ? void 0 : _g.toString(), children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'department', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(Form_1.SelectInput, Object.assign({ options: (0, sortArrayByColumn_1.sortArrayByColumn)(departments, 'name').map(({ _id, name }) => ({
                                                value: _id,
                                                label: name,
                                            })), placeholder: t('choose_an_option'), disabled: loading }, field))) }) })) : null, (0, jsx_runtime_1.jsx)(Form_1.FormField, { required: true, label: t('message'), error: (_j = (_h = errors.message) === null || _h === void 0 ? void 0 : _h.message) === null || _j === void 0 ? void 0 : _j.toString(), children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'message', control: control, rules: { required: true }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(MultilineTextInput_1.MultilineTextInput, Object.assign({ rows: 4, placeholder: t('write_your_message'), disabled: loading }, field))) }) })] }), (0, jsx_runtime_1.jsx)("div", { ref: bottomRef, id: 'bottom', style: { height: '1px', width: '100%' } })] }) })) : ((0, jsx_runtime_1.jsx)(Screen_1.default.Content, { full: true, children: (0, jsx_runtime_1.jsx)("div", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'leave-message__main-message'), children: (0, jsx_runtime_1.jsx)(MarkdownBlock_1.default, { text: offlineUnavailableMessage || defaultUnavailableMessage }) }) })), (0, jsx_runtime_1.jsx)(Screen_1.default.Footer, { children: displayOfflineForm ? ((0, jsx_runtime_1.jsx)(Button_1.Button, { loading: loading, form: 'leaveMessage', submit: true, full: true, disabled: !isDirty || !isValid || loading || isSubmitting, children: t('send') })) : null })] }));
};
exports.default = LeaveMessage;
