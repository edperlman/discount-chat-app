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
const useAccountProfileSettings_1 = require("./useAccountProfileSettings");
const emailValidator_1 = require("../../../../lib/emailValidator");
const getUserEmailAddress_1 = require("../../../../lib/getUserEmailAddress");
const UserStatusMenu_1 = __importDefault(require("../../../components/UserStatusMenu"));
const UserAvatarEditor_1 = __importDefault(require("../../../components/avatar/UserAvatarEditor"));
const useUpdateAvatar_1 = require("../../../hooks/useUpdateAvatar");
const constants_1 = require("../../../lib/constants");
const AccountProfileForm = (props) => {
    var _a, _b, _c, _d;
    const t = (0, ui_contexts_1.useTranslation)();
    const user = (0, ui_contexts_1.useUser)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const checkUsernameAvailability = (0, ui_contexts_1.useEndpoint)('GET', '/v1/users.checkUsernameAvailability');
    const sendConfirmationEmail = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.sendConfirmationEmail');
    const customFieldsMetadata = (0, ui_contexts_1.useAccountsCustomFields)();
    const { allowRealNameChange, allowUserStatusMessageChange, allowEmailChange, allowUserAvatarChange, canChangeUsername, requireName, namesRegex, } = (0, useAccountProfileSettings_1.useAccountProfileSettings)();
    const { control, watch, handleSubmit, reset, formState: { errors }, } = (0, react_hook_form_1.useFormContext)();
    const { email, avatar, username } = watch();
    const previousEmail = user ? (0, getUserEmailAddress_1.getUserEmailAddress)(user) : '';
    const previousUsername = (user === null || user === void 0 ? void 0 : user.username) || '';
    const isUserVerified = (_c = (_b = (_a = user === null || user === void 0 ? void 0 : user.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.verified) !== null && _c !== void 0 ? _c : false;
    const mutateConfirmationEmail = (0, react_query_1.useMutation)({
        mutationFn: sendConfirmationEmail,
        onSuccess: () => dispatchToastMessage({ type: 'success', message: t('Verification_email_sent') }),
        onError: (error) => dispatchToastMessage({ type: 'error', message: error }),
    });
    const handleSendConfirmationEmail = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (email !== previousEmail) {
            return;
        }
        mutateConfirmationEmail.mutateAsync({ email });
    }), [email, previousEmail, mutateConfirmationEmail]);
    const validateUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
        if (!username) {
            return;
        }
        if (username === previousUsername) {
            return;
        }
        if (!namesRegex.test(username)) {
            return t('error-invalid-username');
        }
        const { result: isAvailable } = yield checkUsernameAvailability({ username });
        if (!isAvailable) {
            return t('Username_already_exist');
        }
    });
    // FIXME: replace to endpoint
    const updateOwnBasicInfo = (0, ui_contexts_1.useMethod)('saveUserProfile');
    const updateAvatar = (0, useUpdateAvatar_1.useUpdateAvatar)(avatar, (user === null || user === void 0 ? void 0 : user._id) || '');
    const handleSave = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, name, username, statusType, statusText, nickname, bio, customFields }) {
        try {
            yield updateOwnBasicInfo(Object.assign(Object.assign({ realname: name }, (user ? (0, getUserEmailAddress_1.getUserEmailAddress)(user) !== email && { email } : {})), { username,
                statusText,
                statusType,
                nickname,
                bio }), customFields);
            yield updateAvatar();
            dispatchToastMessage({ type: 'success', message: t('Profile_saved_successfully') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
        finally {
            reset({ email, name, username, statusType, statusText, nickname, bio, customFields });
        }
    });
    const nameId = (0, fuselage_hooks_1.useUniqueId)();
    const usernameId = (0, fuselage_hooks_1.useUniqueId)();
    const nicknameId = (0, fuselage_hooks_1.useUniqueId)();
    const statusTextId = (0, fuselage_hooks_1.useUniqueId)();
    const bioId = (0, fuselage_hooks_1.useUniqueId)();
    const emailId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({}, props, { is: 'form', autoComplete: 'off', onSubmit: handleSubmit(handleSave), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'avatar', render: ({ field: { onChange } }) => ((0, jsx_runtime_1.jsx)(UserAvatarEditor_1.default, { etag: user === null || user === void 0 ? void 0 : user.avatarETag, currentUsername: user === null || user === void 0 ? void 0 : user.username, username: username, setAvatarObj: onChange, disabled: !allowUserAvatarChange })) }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { mie: 8, flexShrink: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: nameId, children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'name', rules: {
                                            required: requireName && t('Required_field', { field: t('Name') }),
                                        }, render: ({ field }) => {
                                            var _a;
                                            return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { id: nameId, error: (_a = errors.name) === null || _a === void 0 ? void 0 : _a.message, disabled: !allowRealNameChange, "aria-required": 'true', "aria-invalid": errors.username ? 'true' : 'false', "aria-describedby": `${nameId}-error ${nameId}-hint` })));
                                        } }) }), errors.name && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${nameId}-error`, children: errors.name.message })), !allowRealNameChange && (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${nameId}-hint`, children: t('RealName_Change_Disabled') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { mis: 8, flexShrink: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: usernameId, children: t('Username') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'username', rules: {
                                            required: t('Required_field', { field: t('Username') }),
                                            validate: (username) => validateUsername(username),
                                        }, render: ({ field }) => {
                                            var _a;
                                            return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { id: usernameId, disabled: !canChangeUsername, error: (_a = errors.username) === null || _a === void 0 ? void 0 : _a.message, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'at', size: 'x20' }), "aria-required": 'true', "aria-invalid": errors.username ? 'true' : 'false', "aria-describedby": `${usernameId}-error ${usernameId}-hint` })));
                                        } }) }), (errors === null || errors === void 0 ? void 0 : errors.username) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${usernameId}-error`, children: errors.username.message })), !canChangeUsername && (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${usernameId}-hint`, children: t('Username_Change_Disabled') })] })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: statusTextId, children: t('StatusMessage') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'statusText', rules: { maxLength: { value: constants_1.USER_STATUS_TEXT_MAX_LENGTH, message: t('Max_length_is', constants_1.USER_STATUS_TEXT_MAX_LENGTH) } }, render: ({ field }) => {
                                    var _a;
                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { id: statusTextId, error: (_a = errors === null || errors === void 0 ? void 0 : errors.statusText) === null || _a === void 0 ? void 0 : _a.message, disabled: !allowUserStatusMessageChange, flexGrow: 1, placeholder: t('StatusMessage_Placeholder'), "aria-invalid": errors.statusText ? 'true' : 'false', "aria-describedby": `${statusTextId}-error ${statusTextId}-hint`, addon: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'statusType', render: ({ field: { value, onChange } }) => ((0, jsx_runtime_1.jsx)(UserStatusMenu_1.default, { margin: 'neg-x2', onChange: onChange, initialStatus: value })) }) })));
                                } }) }), (errors === null || errors === void 0 ? void 0 : errors.statusText) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${statusTextId}-error`, children: errors === null || errors === void 0 ? void 0 : errors.statusText.message })), !allowUserStatusMessageChange && (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${statusTextId}-hint`, children: t('StatusMessage_Change_Disabled') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: nicknameId, children: t('Nickname') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'nickname', render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { id: nicknameId, flexGrow: 1, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'edit', size: 'x20', alignSelf: 'center' }) }))) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: bioId, children: t('Bio') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'bio', rules: { maxLength: { value: constants_1.BIO_TEXT_MAX_LENGTH, message: t('Max_length_is', constants_1.BIO_TEXT_MAX_LENGTH) } }, render: ({ field }) => {
                                    var _a;
                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({}, field, { id: bioId, error: (_a = errors.bio) === null || _a === void 0 ? void 0 : _a.message, rows: 3, flexGrow: 1, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'edit', size: 'x20', alignSelf: 'center' }), "aria-invalid": errors.statusText ? 'true' : 'false', "aria-describedby": `${bioId}-error` })));
                                } }) }), (errors === null || errors === void 0 ? void 0 : errors.bio) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${bioId}-error`, children: errors.bio.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: emailId, children: t('Email') }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'email', rules: {
                                        required: t('Required_field', { field: t('Email') }),
                                        validate: { validateEmail: (email) => ((0, emailValidator_1.validateEmail)(email) ? undefined : t('error-invalid-email-address')) },
                                    }, render: ({ field }) => {
                                        var _a;
                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { id: emailId, flexGrow: 1, error: (_a = errors.email) === null || _a === void 0 ? void 0 : _a.message, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: isUserVerified ? 'circle-check' : 'mail', size: 'x20' }), disabled: !allowEmailChange, "aria-required": 'true', "aria-invalid": errors.email ? 'true' : 'false', "aria-describedby": `${emailId}-error ${emailId}-hint` })));
                                    } }), !isUserVerified && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { disabled: email !== previousEmail, onClick: handleSendConfirmationEmail, mis: 24, children: t('Resend_verification_email') }))] }), errors.email && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${emailId}-error`, children: (_d = errors === null || errors === void 0 ? void 0 : errors.email) === null || _d === void 0 ? void 0 : _d.message })), !allowEmailChange && (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${emailId}-hint`, children: t('Email_Change_Disabled') })] }), customFieldsMetadata && (0, jsx_runtime_1.jsx)(ui_client_1.CustomFieldsForm, { formName: 'customFields', formControl: control, metadata: customFieldsMetadata })] }) })));
};
exports.default = AccountProfileForm;
