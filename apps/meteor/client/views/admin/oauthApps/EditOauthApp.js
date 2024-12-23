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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const Contextualbar_1 = require("../../../components/Contextualbar");
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const EditOauthApp = (_a) => {
    var { onChange, data } = _a, props = __rest(_a, ["onChange", "data"]);
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { register, handleSubmit, formState: { errors }, control, } = (0, react_hook_form_1.useForm)({
        defaultValues: {
            name: data.name,
            active: data.active,
            redirectUri: Array.isArray(data.redirectUri) ? data.redirectUri.join('\n') : data.redirectUri,
        },
        mode: 'all',
    });
    const setModal = (0, ui_contexts_1.useSetModal)();
    const router = (0, ui_contexts_1.useRoute)('admin-oauth-apps');
    const close = (0, react_1.useCallback)(() => router.push({}), [router]);
    const absoluteUrl = (0, ui_contexts_1.useAbsoluteUrl)();
    const authUrl = (0, react_1.useMemo)(() => absoluteUrl('oauth/authorize'), [absoluteUrl]);
    const tokenUrl = (0, react_1.useMemo)(() => absoluteUrl('oauth/token'), [absoluteUrl]);
    const saveApp = (0, ui_contexts_1.useEndpoint)('POST', '/v1/oauth-apps.update');
    const deleteApp = (0, ui_contexts_1.useEndpoint)('POST', '/v1/oauth-apps.delete');
    const onSubmit = (newData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield saveApp(Object.assign(Object.assign({}, newData), { appId: data._id }));
            dispatchToastMessage({ type: 'success', message: t('Application_updated') });
            onChange();
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    });
    const onDeleteConfirm = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield deleteApp({ appId: data._id });
            dispatchToastMessage({ type: 'success', message: t('Your_entry_has_been_deleted') });
            close();
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
        finally {
            setModal(null);
        }
    }), [data._id, close, deleteApp, dispatchToastMessage, setModal, t]);
    const openConfirmDelete = () => setModal(() => ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', onConfirm: onDeleteConfirm, onCancel: () => setModal(null), onClose: () => setModal(null), confirmText: t('Delete'), children: t('Application_delete_warning') })));
    return ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, Object.assign({ w: 'full' }, props, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { maxWidth: 'x600', alignSelf: 'center', w: 'full', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Active') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'active', control: control, defaultValue: data.active, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { onChange: field.onChange, checked: field.value }) })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Application_Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, register('name', { required: true }))) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: t('Give_the_application_a_name_This_will_be_seen_by_your_users') }), (errors === null || errors === void 0 ? void 0 : errors.name) && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('Required_field', { field: t('Name') }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Redirect_URI') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ rows: 5 }, register('redirectUri', { required: true }))) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: t('After_OAuth2_authentication_users_will_be_redirected_to_this_URL') }), (errors === null || errors === void 0 ? void 0 : errors.redirectUri) && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('Required_field', { field: t('Redirect_URI') }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Client_ID') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { value: data.clientId }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Client_Secret') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, { value: data.clientSecret }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Authorization_URL') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { value: authUrl }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Access_Token_URL') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { value: tokenUrl }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: close, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: handleSubmit(onSubmit), children: t('Save') })] }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'trash', danger: true, onClick: openConfirmDelete, children: t('Delete') }) }) }) })] }) })));
};
exports.default = EditOauthApp;
