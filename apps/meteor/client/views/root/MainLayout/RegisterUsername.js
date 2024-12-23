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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const layout_1 = require("@rocket.chat/layout");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const MarkdownText_1 = __importDefault(require("../../../components/MarkdownText"));
const queryClient_1 = require("../../../lib/queryClient");
const RegisterUsername = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const uid = (0, ui_contexts_1.useUserId)();
    const logout = (0, ui_contexts_1.useLogout)();
    const formLabelId = (0, fuselage_hooks_1.useUniqueId)();
    const hideLogo = (0, ui_contexts_1.useSetting)('Layout_Login_Hide_Logo', false);
    const customLogo = (0, ui_contexts_1.useAssetWithDarkModePath)('logo');
    const customBackground = (0, ui_contexts_1.useAssetWithDarkModePath)('background');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const customFields = (0, ui_contexts_1.useAccountsCustomFields)();
    if (!uid) {
        throw new Error('Invalid user');
    }
    const setUsername = (0, ui_contexts_1.useMethod)('setUsername');
    const saveCustomFields = (0, ui_contexts_1.useMethod)('saveCustomFields');
    const usernameSuggestion = (0, ui_contexts_1.useEndpoint)('GET', '/v1/users.getUsernameSuggestion');
    const { data, isLoading } = (0, react_query_1.useQuery)(['suggestion'], () => __awaiter(void 0, void 0, void 0, function* () { return usernameSuggestion(); }));
    const { register, handleSubmit, setValue, getValues, setError, control, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        mode: 'onBlur',
    });
    (0, react_1.useEffect)(() => {
        if ((data === null || data === void 0 ? void 0 : data.result) && getValues('username') === '') {
            setValue('username', data.result);
        }
    });
    const registerUsernameMutation = (0, react_query_1.useMutation)({
        mutationFn: (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { username } = data, customFields = __rest(data, ["username"]);
            return Promise.all([setUsername(username), saveCustomFields(Object.assign({}, customFields))]);
        }),
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Username_has_been_updated') });
            queryClient_1.queryClient.invalidateQueries(['users.info']);
        },
        onError: (error, { username }) => {
            if ([error.error, error.errorType].includes('error-blocked-username')) {
                return setError('username', { type: 'error-blocked-username', message: t('error-blocked-username', { field: username }) });
            }
            if ([error.errorType].includes('error-field-unavailable')) {
                return setError('username', { type: 'error-field-unavailable', message: t('error-field-unavailable', { field: username }) });
            }
            if ([error.errorType].includes('')) {
                return setError('username', { type: 'username-invalid', message: t('Username_invalid') });
            }
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    return ((0, jsx_runtime_1.jsx)(layout_1.VerticalWizardLayout, { background: customBackground, logo: !hideLogo && customLogo ? (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'img', maxHeight: 'x40', mi: 'neg-x8', src: customLogo, alt: 'Logo' }) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}), children: (0, jsx_runtime_1.jsxs)(layout_1.Form, { "aria-labelledby": formLabelId, onSubmit: handleSubmit((data) => registerUsernameMutation.mutate(data)), children: [(0, jsx_runtime_1.jsxs)(layout_1.Form.Header, { children: [(0, jsx_runtime_1.jsx)(layout_1.Form.Title, { id: formLabelId, children: t('Username_title') }), (0, jsx_runtime_1.jsx)(layout_1.Form.Subtitle, { children: t('Username_description') })] }), (0, jsx_runtime_1.jsxs)(layout_1.Form.Container, { children: [!isLoading && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { id: 'username-label', children: t('Username') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ "aria-labelledby": 'username-label' }, register('username', { required: t('Required_field', { field: t('Username') }) }))) }), errors.username && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { content: errors.username.message }) }))] }) })), isLoading && t('Loading_suggestion'), (0, jsx_runtime_1.jsx)(ui_client_1.CustomFieldsForm, { formName: 'customFields', formControl: control, metadata: customFields })] }), (0, jsx_runtime_1.jsx)(layout_1.Form.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, vertical: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { disabled: isLoading, type: 'submit', primary: true, children: t('Use_this_username') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: logout, children: t('Logout') })] }) })] }) }));
};
exports.default = RegisterUsername;
