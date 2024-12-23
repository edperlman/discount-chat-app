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
const preact_router_1 = require("preact-router");
const hooks_1 = require("preact/hooks");
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const api_1 = require("../../api");
const Button_1 = require("../../components/Button");
const ButtonGroup_1 = require("../../components/ButtonGroup");
const Form_1 = require("../../components/Form");
const Modal_1 = require("../../components/Modal");
const Screen_1 = __importDefault(require("../../components/Screen"));
const createClassName_1 = require("../../helpers/createClassName");
const main_1 = require("../../lib/main");
const random_1 = require("../../lib/random");
const store_1 = require("../../store");
const styles_scss_1 = __importDefault(require("./styles.scss"));
const SwitchDepartment = () => {
    var _a, _b;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { config: { messages: { switchDepartmentMessage }, departments: deps = [], }, iframe: { guest }, iframe, room, loading = true, dispatch, alerts, token, } = (0, hooks_1.useContext)(store_1.StoreContext);
    const { handleSubmit, formState: { errors, isDirty, isValid, isSubmitting }, control, } = (0, react_hook_form_1.useForm)({ mode: 'onChange' });
    const departments = deps.filter((dept) => dept.showOnRegistration && dept._id !== (guest === null || guest === void 0 ? void 0 : guest.department));
    const confirmChangeDepartment = () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield Modal_1.ModalManager.confirm({
            text: t('are_you_sure_you_want_to_switch_the_department'),
        });
        return typeof result.success === 'boolean' && result.success;
    });
    const onSubmit = (_a) => __awaiter(void 0, [_a], void 0, function* ({ department }) {
        const confirm = yield confirmChangeDepartment();
        if (!confirm) {
            return;
        }
        if (!room) {
            const { visitor: user } = yield api_1.Livechat.grantVisitor({ visitor: { department, token } });
            yield dispatch({
                user: user,
                alerts: (alerts.push({ id: (0, random_1.createToken)(), children: t('department_switched'), success: true }), alerts),
            });
            return (0, preact_router_1.route)('/');
        }
        yield dispatch({ loading: true });
        try {
            const { _id: rid } = room;
            const result = yield api_1.Livechat.transferChat({ rid, department });
            // TODO: Investigate why the api results are not returning the correct type
            const { success } = result;
            if (!success) {
                throw t('no_available_agents_to_transfer');
            }
            yield dispatch({ iframe: Object.assign(Object.assign({}, iframe), { guest: Object.assign(Object.assign({}, guest), { department }) }), loading: false });
            yield (0, main_1.loadConfig)();
            yield Modal_1.ModalManager.alert({
                text: t('department_switched'),
            });
            (0, preact_router_1.route)('/');
        }
        catch (error) {
            console.error(error);
            yield dispatch({
                alerts: (alerts.push({ id: (0, random_1.createToken)(), children: t('no_available_agents_to_transfer'), warning: true }), alerts),
            });
        }
        finally {
            yield dispatch({ loading: false });
        }
    });
    const handleCancel = () => {
        (0, preact_router_1.route)('/');
    };
    const defaultTitle = t('change_department_1');
    const defaultMessage = t('choose_a_department_1');
    return ((0, jsx_runtime_1.jsxs)(Screen_1.default, { title: defaultTitle, className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'switch-department'), children: [(0, jsx_runtime_1.jsxs)(Screen_1.default.Content, { children: [(0, jsx_runtime_1.jsx)("p", { className: (0, createClassName_1.createClassName)(styles_scss_1.default, 'switch-department__message'), children: switchDepartmentMessage || defaultMessage }), (0, jsx_runtime_1.jsx)(Form_1.Form, { id: 'switchDepartment', 
                        // The price of using react-hook-form on a preact project ¯\_(ツ)_/¯
                        onSubmit: handleSubmit(onSubmit), children: (0, jsx_runtime_1.jsx)(Form_1.FormField, { label: t('i_need_help_with'), error: (_b = (_a = errors.department) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.toString(), children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'department', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(Form_1.SelectInput, Object.assign({ options: departments.map(({ _id, name }) => ({ value: _id, label: name })), placeholder: t('choose_a_department'), disabled: loading }, field))) }) }) })] }), (0, jsx_runtime_1.jsx)(Screen_1.default.Footer, { children: (0, jsx_runtime_1.jsxs)(ButtonGroup_1.ButtonGroup, { full: true, children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { loading: loading, form: 'switchDepartment', submit: true, stack: true, full: true, disabled: !isDirty || !isValid || loading || isSubmitting, children: t('start_chat') }), (0, jsx_runtime_1.jsx)(Button_1.Button, { loading: loading, stack: true, secondary: true, onClick: handleCancel, children: t('cancel') })] }) })] }));
};
exports.default = SwitchDepartment;
