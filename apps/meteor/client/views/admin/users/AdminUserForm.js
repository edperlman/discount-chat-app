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
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const AdminUserSetRandomPasswordContent_1 = __importDefault(require("./AdminUserSetRandomPasswordContent"));
const AdminUserSetRandomPasswordRadios_1 = __importDefault(require("./AdminUserSetRandomPasswordRadios"));
const PasswordFieldSkeleton_1 = __importDefault(require("./PasswordFieldSkeleton"));
const useSmtpQuery_1 = require("./hooks/useSmtpQuery");
const emailValidator_1 = require("../../../../lib/emailValidator");
const parseCSV_1 = require("../../../../lib/utils/parseCSV");
const Contextualbar_1 = require("../../../components/Contextualbar");
const UserAvatarEditor_1 = __importDefault(require("../../../components/avatar/UserAvatarEditor"));
const useEndpointAction_1 = require("../../../hooks/useEndpointAction");
const useUpdateAvatar_1 = require("../../../hooks/useUpdateAvatar");
const constants_1 = require("../../../lib/constants");
const getInitialValue = ({ data, defaultUserRoles, isSmtpEnabled, isVerificationNeeded, isNewUserPage, }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return (Object.assign(Object.assign({ roles: (_a = data === null || data === void 0 ? void 0 : data.roles) !== null && _a !== void 0 ? _a : defaultUserRoles, name: (_b = data === null || data === void 0 ? void 0 : data.name) !== null && _b !== void 0 ? _b : '', password: '', username: (_c = data === null || data === void 0 ? void 0 : data.username) !== null && _c !== void 0 ? _c : '', bio: (_d = data === null || data === void 0 ? void 0 : data.bio) !== null && _d !== void 0 ? _d : '', nickname: (_e = data === null || data === void 0 ? void 0 : data.nickname) !== null && _e !== void 0 ? _e : '', email: (((_f = data === null || data === void 0 ? void 0 : data.emails) === null || _f === void 0 ? void 0 : _f.length) && data.emails[0].address) || '', verified: isSmtpEnabled && isVerificationNeeded && ((((_g = data === null || data === void 0 ? void 0 : data.emails) === null || _g === void 0 ? void 0 : _g.length) && data.emails[0].verified) || false), setRandomPassword: isNewUserPage && isSmtpEnabled, requirePasswordChange: isNewUserPage && isSmtpEnabled && ((_h = data === null || data === void 0 ? void 0 : data.requirePasswordChange) !== null && _h !== void 0 ? _h : true), customFields: (_j = data === null || data === void 0 ? void 0 : data.customFields) !== null && _j !== void 0 ? _j : {}, statusText: (_k = data === null || data === void 0 ? void 0 : data.statusText) !== null && _k !== void 0 ? _k : '' }, (isNewUserPage && { joinDefaultChannels: true })), { sendWelcomeEmail: isSmtpEnabled, avatar: '', passwordConfirmation: '' }));
};
const AdminUserForm = (_a) => {
    var { userData, onReload, context, refetchUserFormData, roleData, roleError } = _a, props = __rest(_a, ["userData", "onReload", "context", "refetchUserFormData", "roleData", "roleError"]);
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const customFieldsMetadata = (0, ui_contexts_1.useAccountsCustomFields)();
    const defaultRoles = (0, ui_contexts_1.useSetting)('Accounts_Registration_Users_Default_Roles', '');
    const isVerificationNeeded = (0, ui_contexts_1.useSetting)('Accounts_EmailVerification');
    const defaultUserRoles = (0, parseCSV_1.parseCSV)(defaultRoles);
    const { data, isLoading: isLoadingSmtpStatus } = (0, useSmtpQuery_1.useSmtpQuery)();
    const isSmtpEnabled = !!(data === null || data === void 0 ? void 0 : data.isSMTPConfigured);
    const isNewUserPage = context === 'new';
    const { control, watch, handleSubmit, formState: { errors, isDirty }, setValue, } = (0, react_hook_form_1.useForm)({
        values: getInitialValue({
            data: userData,
            defaultUserRoles,
            isSmtpEnabled,
            isNewUserPage,
            isVerificationNeeded: !!isVerificationNeeded,
        }),
        mode: 'onBlur',
    });
    const { avatar, username, setRandomPassword, password } = watch();
    const eventStats = (0, useEndpointAction_1.useEndpointAction)('POST', '/v1/statistics.telemetry');
    const updateUserAction = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.update');
    const createUserAction = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.create');
    const availableRoles = (0, react_1.useMemo)(() => (roleData === null || roleData === void 0 ? void 0 : roleData.roles.map(({ _id, name, description }) => [_id, description || name])) || [], [roleData]);
    const updateAvatar = (0, useUpdateAvatar_1.useUpdateAvatar)(avatar, (userData === null || userData === void 0 ? void 0 : userData._id) || '');
    const handleUpdateUser = (0, react_query_1.useMutation)({
        mutationFn: updateUserAction,
        onSuccess: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user: { _id } }) {
            dispatchToastMessage({ type: 'success', message: t('User_updated_successfully') });
            yield updateAvatar();
            router.navigate(`/admin/users/info/${_id}`);
            onReload();
            refetchUserFormData === null || refetchUserFormData === void 0 ? void 0 : refetchUserFormData();
        }),
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    const handleCreateUser = (0, react_query_1.useMutation)({
        mutationFn: createUserAction,
        onSuccess: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user: { _id } }) {
            dispatchToastMessage({ type: 'success', message: t('New_user_manually_created') });
            yield eventStats({
                params: [{ eventName: 'updateCounter', settingsId: 'Manual_Entry_User_Count' }],
            });
            queryClient.invalidateQueries(['pendingUsersCount'], {
                refetchType: 'all',
            });
            router.navigate(`/admin/users/created/${_id}`);
            onReload();
        }),
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    const handleSaveUser = (0, fuselage_hooks_1.useMutableCallback)((userFormPayload) => __awaiter(void 0, void 0, void 0, function* () {
        const { avatar, passwordConfirmation } = userFormPayload, userFormData = __rest(userFormPayload, ["avatar", "passwordConfirmation"]);
        if (!isNewUserPage && (userData === null || userData === void 0 ? void 0 : userData._id)) {
            return handleUpdateUser.mutateAsync({ userId: userData === null || userData === void 0 ? void 0 : userData._id, data: userFormData });
        }
        return handleCreateUser.mutateAsync(Object.assign(Object.assign({}, userFormData), { fields: '' }));
    }));
    const nameId = (0, fuselage_hooks_1.useUniqueId)();
    const usernameId = (0, fuselage_hooks_1.useUniqueId)();
    const emailId = (0, fuselage_hooks_1.useUniqueId)();
    const verifiedId = (0, fuselage_hooks_1.useUniqueId)();
    const statusTextId = (0, fuselage_hooks_1.useUniqueId)();
    const bioId = (0, fuselage_hooks_1.useUniqueId)();
    const nicknameId = (0, fuselage_hooks_1.useUniqueId)();
    const passwordId = (0, fuselage_hooks_1.useUniqueId)();
    const rolesId = (0, fuselage_hooks_1.useUniqueId)();
    const joinDefaultChannelsId = (0, fuselage_hooks_1.useUniqueId)();
    const sendWelcomeEmailId = (0, fuselage_hooks_1.useUniqueId)();
    const setRandomPasswordId = (0, fuselage_hooks_1.useUniqueId)();
    const [showCustomFields, setShowCustomFields] = (0, react_1.useState)(true);
    if (!context) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, Object.assign({}, props, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [!isNewUserPage && ((0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'avatar', control: control, render: ({ field: { onChange } }) => ((0, jsx_runtime_1.jsx)(UserAvatarEditor_1.default, { currentUsername: userData === null || userData === void 0 ? void 0 : userData.username, username: username, etag: userData === null || userData === void 0 ? void 0 : userData.avatarETag, setAvatarObj: onChange })) }) })), isNewUserPage && (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'hint', children: t('Manually_created_users_briefing') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: emailId, children: t('Email') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'email', rules: {
                                            required: t('Required_field', { field: t('Email') }),
                                            validate: (email) => ((0, emailValidator_1.validateEmail)(email) ? undefined : t('error-invalid-email-address')),
                                        }, render: ({ field }) => {
                                            var _a;
                                            return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { id: emailId, "aria-invalid": errors.email ? 'true' : 'false', "aria-describedby": `${emailId}-error`, error: (_a = errors.email) === null || _a === void 0 ? void 0 : _a.message, flexGrow: 1 })));
                                        } }) }), (errors === null || errors === void 0 ? void 0 : errors.email) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${emailId}-error`, children: errors.email.message })), isLoadingSmtpStatus ? ((0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { w: 'full', h: 26 })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { mbs: 12, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: verifiedId, p: 0, disabled: !isSmtpEnabled || !isVerificationNeeded, m: 0, children: t('Mark_email_as_verified') }), (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'info-circled', size: 'x20', mis: 4, title: t('Enable_to_bypass_email_verification'), color: 'default' })] }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'verified', render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: verifiedId, checked: value, onChange: onChange, disabled: !isSmtpEnabled || !isVerificationNeeded })) })] }), isVerificationNeeded && !isSmtpEnabled && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${verifiedId}-hint`, dangerouslySetInnerHTML: { __html: t('Send_Email_SMTP_Warning', { url: 'admin/settings/Email' }) } })), !isVerificationNeeded && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${verifiedId}-hint`, dangerouslySetInnerHTML: { __html: t('Email_verification_isnt_required', { url: 'admin/settings/Accounts' }) } }))] }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: nameId, children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'name', rules: { required: t('Required_field', { field: t('Name') }) }, render: ({ field }) => {
                                            var _a;
                                            return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { id: nameId, "aria-invalid": errors.name ? 'true' : 'false', "aria-describedby": `${nameId}-error`, error: (_a = errors.name) === null || _a === void 0 ? void 0 : _a.message, flexGrow: 1 })));
                                        } }) }), (errors === null || errors === void 0 ? void 0 : errors.name) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${nameId}-error`, children: errors.name.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: usernameId, children: t('Username') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'username', rules: { required: t('Required_field', { field: t('Username') }) }, render: ({ field }) => {
                                            var _a;
                                            return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { id: usernameId, "aria-invalid": errors.username ? 'true' : 'false', "aria-describedby": `${usernameId}-error`, error: (_a = errors.username) === null || _a === void 0 ? void 0 : _a.message, flexGrow: 1 })));
                                        } }) }), (errors === null || errors === void 0 ? void 0 : errors.username) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${usernameId}-error`, children: errors.username.message }))] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: isLoadingSmtpStatus ? ((0, jsx_runtime_1.jsx)(PasswordFieldSkeleton_1.default, {})) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: passwordId, mbe: 8, children: t('Password') }), (0, jsx_runtime_1.jsx)(AdminUserSetRandomPasswordRadios_1.default, { isNewUserPage: isNewUserPage, setRandomPasswordId: setRandomPasswordId, control: control, isSmtpEnabled: isSmtpEnabled, setValue: setValue }), !setRandomPassword && ((0, jsx_runtime_1.jsx)(AdminUserSetRandomPasswordContent_1.default, { control: control, setRandomPassword: setRandomPassword, isNewUserPage: isNewUserPage, passwordId: passwordId, errors: errors, password: password }))] })) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: rolesId, children: t('Roles') }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [roleError && (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { children: roleError }), !roleError && ((0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'roles', rules: { required: t('Required_field', { field: t('Roles') }) }, render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.MultiSelectFiltered, { id: rolesId, value: value, onChange: onChange, flexGrow: 1, placeholder: t('Select_role'), options: availableRoles })) }))] }), (errors === null || errors === void 0 ? void 0 : errors.roles) && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: errors.roles.message })] }), isNewUserPage && ((0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: joinDefaultChannelsId, children: t('Join_default_channels') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'joinDefaultChannels', render: ({ field: { ref, onChange, value } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: joinDefaultChannelsId, ref: ref, onChange: onChange, checked: value })) }) })] }) })), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: isLoadingSmtpStatus ? ((0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { w: 'full', h: 26 })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexGrow: 1, mbe: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: sendWelcomeEmailId, disabled: !isSmtpEnabled, children: t('Send_welcome_email') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'sendWelcomeEmail', defaultValue: isSmtpEnabled, render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: sendWelcomeEmailId, "aria-describedby": `${sendWelcomeEmailId}-hint`, onChange: onChange, checked: value, disabled: !isSmtpEnabled })) }) })] }), !isSmtpEnabled && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${sendWelcomeEmailId}-hint`, dangerouslySetInnerHTML: { __html: t('Send_Email_SMTP_Warning', { url: 'admin/settings/Email' }) }, mbs: 0 }))] })) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: statusTextId, children: t('StatusMessage') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'statusText', rules: { maxLength: { value: constants_1.USER_STATUS_TEXT_MAX_LENGTH, message: t('Max_length_is', constants_1.USER_STATUS_TEXT_MAX_LENGTH) } }, render: ({ field }) => {
                                            var _a;
                                            return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { id: statusTextId, error: (_a = errors === null || errors === void 0 ? void 0 : errors.statusText) === null || _a === void 0 ? void 0 : _a.message, "aria-invalid": errors.statusText ? 'true' : 'false', "aria-describedby": `${statusTextId}-error`, flexGrow: 1 })));
                                        } }) }), (errors === null || errors === void 0 ? void 0 : errors.statusText) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${statusTextId}-error`, children: errors.statusText.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: bioId, children: t('Bio') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'bio', rules: { maxLength: { value: constants_1.BIO_TEXT_MAX_LENGTH, message: t('Max_length_is', constants_1.BIO_TEXT_MAX_LENGTH) } }, render: ({ field }) => {
                                            var _a;
                                            return ((0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({}, field, { id: bioId, rows: 3, error: (_a = errors === null || errors === void 0 ? void 0 : errors.bio) === null || _a === void 0 ? void 0 : _a.message, "aria-invalid": errors.bio ? 'true' : 'false', "aria-describedby": `${bioId}-error`, flexGrow: 1, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'edit', size: 'x20', alignSelf: 'center' }) })));
                                        } }) }), (errors === null || errors === void 0 ? void 0 : errors.bio) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${bioId}-error`, children: errors.bio.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: nicknameId, children: t('Nickname') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'nickname', render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { id: nicknameId, flexGrow: 1 })) }) })] }), !!customFieldsMetadata.length && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { fontScale: 'c2', w: 'x140', h: 'x28', display: 'flex', alignItems: 'center', justifyContent: 'center', onClick: () => setShowCustomFields((prevState) => !prevState), children: showCustomFields ? t('Hide_additional_fields') : t('Show_additional_fields') }), showCustomFields && (0, jsx_runtime_1.jsx)(ui_client_1.CustomFieldsForm, { formName: 'customFields', formControl: control, metadata: customFieldsMetadata })] }))] }) })), (0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, disabled: !isDirty, onClick: handleSubmit(handleSaveUser), w: '100%', children: isNewUserPage ? t('Add_user') : t('Save_user') }) })] }));
};
exports.default = AdminUserForm;
