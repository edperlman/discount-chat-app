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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const emailValidator_1 = require("../../../../lib/emailValidator");
const AutoCompleteDepartment_1 = __importDefault(require("../../../components/AutoCompleteDepartment"));
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const Page_1 = require("../../../components/Page");
const EmailInboxForm = ({ inboxData }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const router = (0, ui_contexts_1.useRoute)('admin-email-inboxes');
    const handleBack = (0, react_1.useCallback)(() => router.push({}), [router]);
    const saveEmailInbox = (0, ui_contexts_1.useEndpoint)('POST', '/v1/email-inbox');
    const deleteInboxAction = (0, ui_contexts_1.useEndpoint)('DELETE', '/v1/email-inbox/:_id', { _id: (_a = inboxData === null || inboxData === void 0 ? void 0 : inboxData._id) !== null && _a !== void 0 ? _a : '' });
    const emailAlreadyExistsAction = (0, ui_contexts_1.useEndpoint)('GET', '/v1/email-inbox.search');
    const { control, handleSubmit, formState: { errors, isDirty }, } = (0, react_hook_form_1.useForm)({
        values: {
            active: (_b = inboxData === null || inboxData === void 0 ? void 0 : inboxData.active) !== null && _b !== void 0 ? _b : true,
            name: inboxData === null || inboxData === void 0 ? void 0 : inboxData.name,
            email: inboxData === null || inboxData === void 0 ? void 0 : inboxData.email,
            description: inboxData === null || inboxData === void 0 ? void 0 : inboxData.description,
            senderInfo: inboxData === null || inboxData === void 0 ? void 0 : inboxData.senderInfo,
            department: (inboxData === null || inboxData === void 0 ? void 0 : inboxData.department) || '',
            // SMTP
            smtpServer: inboxData === null || inboxData === void 0 ? void 0 : inboxData.smtp.server,
            smtpPort: (_c = inboxData === null || inboxData === void 0 ? void 0 : inboxData.smtp.port) !== null && _c !== void 0 ? _c : 587,
            smtpUsername: inboxData === null || inboxData === void 0 ? void 0 : inboxData.smtp.username,
            smtpPassword: inboxData === null || inboxData === void 0 ? void 0 : inboxData.smtp.password,
            smtpSecure: (_d = inboxData === null || inboxData === void 0 ? void 0 : inboxData.smtp.secure) !== null && _d !== void 0 ? _d : false,
            // IMAP
            imapServer: inboxData === null || inboxData === void 0 ? void 0 : inboxData.imap.server,
            imapPort: (_e = inboxData === null || inboxData === void 0 ? void 0 : inboxData.imap.port) !== null && _e !== void 0 ? _e : 993,
            imapUsername: inboxData === null || inboxData === void 0 ? void 0 : inboxData.imap.username,
            imapPassword: inboxData === null || inboxData === void 0 ? void 0 : inboxData.imap.password,
            imapSecure: (_f = inboxData === null || inboxData === void 0 ? void 0 : inboxData.imap.secure) !== null && _f !== void 0 ? _f : false,
            imapRetries: (_g = inboxData === null || inboxData === void 0 ? void 0 : inboxData.imap.maxRetries) !== null && _g !== void 0 ? _g : 10,
        },
        mode: 'all',
    });
    const handleDelete = (0, fuselage_hooks_1.useMutableCallback)(() => {
        const deleteInbox = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield deleteInboxAction();
                dispatchToastMessage({ type: 'success', message: t('Email_Inbox_has_been_removed') });
                handleBack();
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                setModal(null);
            }
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', onConfirm: deleteInbox, onCancel: () => setModal(null), confirmText: t('Delete'), children: t('You_will_not_be_able_to_recover_email_inbox') }));
    });
    const handleSave = (0, fuselage_hooks_1.useMutableCallback)((_a) => __awaiter(void 0, [_a], void 0, function* ({ active, name, email, description, senderInfo, department, smtpServer, smtpPort, smtpUsername, smtpPassword, smtpSecure, imapServer, imapPort, imapUsername, imapPassword, imapSecure, imapRetries, }) {
        const smtp = {
            server: smtpServer,
            port: parseInt(smtpPort),
            username: smtpUsername,
            password: smtpPassword,
            secure: smtpSecure,
        };
        const imap = {
            server: imapServer,
            port: parseInt(imapPort),
            username: imapUsername,
            password: imapPassword,
            secure: imapSecure,
            maxRetries: parseInt(imapRetries),
        };
        const payload = Object.assign(Object.assign(Object.assign(Object.assign({}, ((inboxData === null || inboxData === void 0 ? void 0 : inboxData._id) && { _id: inboxData === null || inboxData === void 0 ? void 0 : inboxData._id })), { active,
            name,
            email,
            description,
            senderInfo }), (department && { department: typeof department === 'string' ? department : department.value })), { smtp,
            imap });
        try {
            yield saveEmailInbox(payload);
            dispatchToastMessage({ type: 'success', message: t('Email_Inbox_has_been_added') });
            handleBack();
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const checkEmailExists = (0, fuselage_hooks_1.useMutableCallback)((email) => __awaiter(void 0, void 0, void 0, function* () {
        if (!email) {
            return;
        }
        if (!(0, emailValidator_1.validateEmail)(email)) {
            return t('error-invalid-email-address');
        }
        const { emailInbox } = yield emailAlreadyExistsAction({ email });
        if (!emailInbox || ((inboxData === null || inboxData === void 0 ? void 0 : inboxData._id) && emailInbox._id === (inboxData === null || inboxData === void 0 ? void 0 : inboxData._id))) {
            return;
        }
        return t('Email_already_exists');
    }));
    const activeField = (0, fuselage_hooks_1.useUniqueId)();
    const nameField = (0, fuselage_hooks_1.useUniqueId)();
    const emailField = (0, fuselage_hooks_1.useUniqueId)();
    const descriptionField = (0, fuselage_hooks_1.useUniqueId)();
    const senderInfoField = (0, fuselage_hooks_1.useUniqueId)();
    const departmentField = (0, fuselage_hooks_1.useUniqueId)();
    const smtpServerField = (0, fuselage_hooks_1.useUniqueId)();
    const smtpPortField = (0, fuselage_hooks_1.useUniqueId)();
    const smtpUsernameField = (0, fuselage_hooks_1.useUniqueId)();
    const smtpPasswordField = (0, fuselage_hooks_1.useUniqueId)();
    const smtpSecureField = (0, fuselage_hooks_1.useUniqueId)();
    const imapServerField = (0, fuselage_hooks_1.useUniqueId)();
    const imapPortField = (0, fuselage_hooks_1.useUniqueId)();
    const imapUsernameField = (0, fuselage_hooks_1.useUniqueId)();
    const imapPasswordField = (0, fuselage_hooks_1.useUniqueId)();
    const imapRetriesField = (0, fuselage_hooks_1.useUniqueId)();
    const imapSecureField = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { maxWidth: 'x600', w: 'full', alignSelf: 'center', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Accordion, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { defaultExpanded: true, title: t('Inbox_Info'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: activeField, children: t('Active') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'active', render: ({ field: { onChange, value, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: activeField, ref: ref, checked: value, onChange: onChange })) })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: nameField, required: true, children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'name', control: control, rules: { required: t('Required_field', { field: t('Name') }) }, render: ({ field }) => {
                                                    var _a;
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: nameField }, field, { error: (_a = errors.name) === null || _a === void 0 ? void 0 : _a.message, "aria-required": true, "aria-invalid": Boolean(errors.name), "aria-describedby": `${nameField}-error` })));
                                                } }) }), errors.name && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${nameField}-error`, children: (_h = errors.name) === null || _h === void 0 ? void 0 : _h.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: emailField, required: true, children: t('Email') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'email', control: control, rules: {
                                                    required: t('Required_field', { field: t('Email') }),
                                                    validate: (value) => checkEmailExists(value),
                                                }, render: ({ field }) => {
                                                    var _a;
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { id: emailField, error: (_a = errors.email) === null || _a === void 0 ? void 0 : _a.message, "aria-required": true, "aria-invalid": Boolean(errors.email), "aria-describedby": `${emailField}-error` })));
                                                } }) }), errors.email && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${emailField}-error`, children: (_j = errors.email) === null || _j === void 0 ? void 0 : _j.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: descriptionField, children: t('Description') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'description', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ id: descriptionField }, field, { rows: 4 })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: senderInfoField, children: t('Sender_Info') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'senderInfo', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: senderInfoField }, field, { "aria-describedby": `${senderInfoField}-hint` })) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${senderInfoField}-hint`, children: t('Will_Appear_In_From') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: departmentField, children: t('Department') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'department', render: ({ field: { onChange, onBlur, name, value } }) => ((0, jsx_runtime_1.jsx)(AutoCompleteDepartment_1.default, { id: departmentField, name: name, onBlur: onBlur, value: value, onChange: onChange, "aria-describedby": `${departmentField}-hint` })) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${departmentField}-hint`, children: t('Only_Members_Selected_Department_Can_View_Channel') })] })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { defaultExpanded: !(inboxData === null || inboxData === void 0 ? void 0 : inboxData._id), title: t('Configure_Outgoing_Mail_SMTP'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: smtpServerField, required: true, children: t('Server') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'smtpServer', control: control, rules: { required: t('Required_field', { field: t('Server') }) }, render: ({ field }) => {
                                                    var _a;
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: smtpServerField }, field, { error: (_a = errors.smtpServer) === null || _a === void 0 ? void 0 : _a.message, "aria-required": true, "aria-invalid": Boolean(errors.email), "aria-describedby": `${smtpServerField}-error` })));
                                                } }) }), errors.smtpServer && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${smtpServerField}-error`, children: (_k = errors.smtpServer) === null || _k === void 0 ? void 0 : _k.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: smtpPortField, required: true, children: t('Port') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'smtpPort', control: control, rules: { required: t('Required_field', { field: t('Port') }) }, render: ({ field }) => {
                                                    var _a;
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.NumberInput, Object.assign({ id: smtpPortField }, field, { error: (_a = errors.smtpPort) === null || _a === void 0 ? void 0 : _a.message, "aria-required": true, "aria-invalid": Boolean(errors.email), "aria-describedby": `${smtpPortField}-error` })));
                                                } }) }), errors.smtpPort && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${smtpPortField}-error`, children: (_l = errors.smtpPort) === null || _l === void 0 ? void 0 : _l.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: smtpUsernameField, required: true, children: t('Username') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'smtpUsername', control: control, rules: { required: t('Required_field', { field: t('Username') }) }, render: ({ field }) => {
                                                    var _a;
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: smtpUsernameField }, field, { error: (_a = errors.smtpUsername) === null || _a === void 0 ? void 0 : _a.message, "aria-describedby": `${smtpUsernameField}-error`, "aria-required": true, "aria-invalid": Boolean(errors.email) })));
                                                } }) }), errors.smtpUsername && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${smtpUsernameField}-error`, children: (_m = errors.smtpUsername) === null || _m === void 0 ? void 0 : _m.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: smtpPasswordField, required: true, children: t('Password') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'smtpPassword', control: control, rules: { required: t('Required_field', { field: t('Password') }) }, render: ({ field }) => {
                                                    var _a;
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, Object.assign({ id: smtpPasswordField }, field, { error: (_a = errors.smtpPassword) === null || _a === void 0 ? void 0 : _a.message, "aria-describedby": `${smtpPasswordField}-error`, "aria-required": true, "aria-invalid": Boolean(errors.email) })));
                                                } }) }), errors.smtpPassword && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${smtpPasswordField}-error`, children: (_o = errors.smtpPassword) === null || _o === void 0 ? void 0 : _o.message }))] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: smtpSecureField, children: t('Connect_SSL_TLS') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'smtpSecure', render: (_a) => {
                                                    var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                    return (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: smtpSecureField }, field, { checked: value }));
                                                } })] }) })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { defaultExpanded: !(inboxData === null || inboxData === void 0 ? void 0 : inboxData._id), title: t('Configure_Incoming_Mail_IMAP'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: imapServerField, required: true, children: t('Server') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'imapServer', control: control, rules: { required: t('Required_field', { field: t('Server') }) }, render: ({ field }) => {
                                                    var _a;
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: imapServerField }, field, { error: (_a = errors.imapServer) === null || _a === void 0 ? void 0 : _a.message, "aria-describedby": `${imapServerField}-error`, "aria-required": true, "aria-invalid": Boolean(errors.email) })));
                                                } }) }), errors.imapServer && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${imapServerField}-error`, children: (_p = errors.imapServer) === null || _p === void 0 ? void 0 : _p.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: imapPortField, required: true, children: t('Port') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'imapPort', control: control, rules: { required: t('Required_field', { field: t('Port') }) }, render: ({ field }) => {
                                                    var _a;
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.NumberInput, Object.assign({ id: imapPortField }, field, { error: (_a = errors.imapPort) === null || _a === void 0 ? void 0 : _a.message, "aria-describedby": `${imapPortField}-error`, "aria-required": true, "aria-invalid": Boolean(errors.email) })));
                                                } }) }), errors.imapPort && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${imapPortField}-error`, children: (_q = errors.imapPort) === null || _q === void 0 ? void 0 : _q.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: imapUsernameField, required: true, children: t('Username') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'imapUsername', control: control, rules: { required: t('Required_field', { field: t('Username') }) }, render: ({ field }) => {
                                                    var _a;
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: imapUsernameField }, field, { error: (_a = errors.imapUsername) === null || _a === void 0 ? void 0 : _a.message, "aria-describedby": `${imapUsernameField}-error`, "aria-required": true, "aria-invalid": Boolean(errors.email) })));
                                                } }) }), errors.imapUsername && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${imapUsernameField}-error`, children: (_r = errors.imapUsername) === null || _r === void 0 ? void 0 : _r.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: imapPasswordField, required: true, children: t('Password') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'imapPassword', control: control, rules: { required: t('Required_field', { field: t('Password') }) }, render: ({ field }) => {
                                                    var _a;
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, Object.assign({ id: imapPasswordField }, field, { error: (_a = errors.imapPassword) === null || _a === void 0 ? void 0 : _a.message, "aria-describedby": `${imapPasswordField}-error`, "aria-required": true, "aria-invalid": Boolean(errors.email) })));
                                                } }) }), errors.imapPassword && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${imapPasswordField}-error`, children: (_s = errors.imapPassword) === null || _s === void 0 ? void 0 : _s.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: imapRetriesField, required: true, children: t('Max_Retry') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'imapRetries', control: control, rules: { required: t('Required_field', { field: t('Max_Retry') }) }, render: ({ field }) => {
                                                    var _a;
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.NumberInput, Object.assign({ id: imapRetriesField }, field, { error: (_a = errors.imapRetries) === null || _a === void 0 ? void 0 : _a.message, "aria-describedby": `${imapRetriesField}-error`, "aria-required": true, "aria-invalid": Boolean(errors.email) })));
                                                } }) }), errors.imapRetries && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${imapRetriesField}-error`, children: (_t = errors.imapRetries) === null || _t === void 0 ? void 0 : _t.message }))] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: imapSecureField, children: t('Connect_SSL_TLS') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'imapSecure', render: (_a) => {
                                                    var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                    return (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: imapSecureField }, field, { checked: value }));
                                                } })] }) })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleBack, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { disabled: !isDirty, primary: true, onClick: handleSubmit(handleSave), children: t('Save') })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Margins, { blockStart: 16, children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (inboxData === null || inboxData === void 0 ? void 0 : inboxData._id) && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { danger: true, onClick: handleDelete, children: t('Delete') })) }) }) })] })] }) }) }));
};
exports.default = EmailInboxForm;
