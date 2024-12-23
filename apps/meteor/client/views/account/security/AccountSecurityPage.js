"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const ChangePassword_1 = __importDefault(require("./ChangePassword"));
const EndToEnd_1 = __importDefault(require("./EndToEnd"));
const TwoFactorEmail_1 = __importDefault(require("./TwoFactorEmail"));
const TwoFactorTOTP_1 = __importDefault(require("./TwoFactorTOTP"));
const Page_1 = require("../../../components/Page");
const passwordDefaultValues = { password: '', confirmationPassword: '' };
const AccountSecurityPage = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const user = (0, ui_contexts_1.useUser)();
    const isEmail2FAAvailableForOAuth = (0, ui_contexts_1.useSetting)('Accounts_twoFactorAuthentication_email_available_for_OAuth_users');
    const isOAuthUser = user === null || user === void 0 ? void 0 : user.isOAuthUser;
    const isEmail2FAAllowed = !isOAuthUser || isEmail2FAAvailableForOAuth;
    const methods = (0, react_hook_form_1.useForm)({
        defaultValues: passwordDefaultValues,
        mode: 'all',
    });
    const { reset, formState: { isDirty }, } = methods;
    const twoFactorEnabled = (0, ui_contexts_1.useSetting)('Accounts_TwoFactorAuthentication_Enabled');
    const twoFactorTOTP = (0, ui_contexts_1.useSetting)('Accounts_TwoFactorAuthentication_By_TOTP_Enabled');
    const twoFactorByEmailEnabled = (0, ui_contexts_1.useSetting)('Accounts_TwoFactorAuthentication_By_Email_Enabled');
    const e2eEnabled = (0, ui_contexts_1.useSetting)('E2E_Enable');
    const allowPasswordChange = (0, ui_contexts_1.useSetting)('Accounts_AllowPasswordChange');
    const showEmailTwoFactor = twoFactorByEmailEnabled && isEmail2FAAllowed;
    const passwordFormId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Security') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { maxWidth: 'x600', w: 'full', alignSelf: 'center', color: 'default', children: [allowPasswordChange && ((0, jsx_runtime_1.jsx)(react_hook_form_1.FormProvider, Object.assign({}, methods, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Accordion, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { title: t('Password'), defaultExpanded: true, children: (0, jsx_runtime_1.jsx)(ChangePassword_1.default, { id: passwordFormId }) }) }) }))), (0, jsx_runtime_1.jsxs)(fuselage_1.Accordion, { children: [(twoFactorTOTP || showEmailTwoFactor) && twoFactorEnabled && ((0, jsx_runtime_1.jsxs)(fuselage_1.Accordion.Item, { title: t('Two Factor Authentication'), children: [twoFactorTOTP && (0, jsx_runtime_1.jsx)(TwoFactorTOTP_1.default, {}), showEmailTwoFactor && (0, jsx_runtime_1.jsx)(TwoFactorEmail_1.default, {})] })), e2eEnabled && ((0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { title: t('End-to-end_encryption'), "aria-label": t('End-to-end_encryption'), defaultExpanded: !twoFactorEnabled, "data-qa-type": 'e2e-encryption-section', children: (0, jsx_runtime_1.jsx)(EndToEnd_1.default, {}) }))] })] }) }), (0, jsx_runtime_1.jsx)(Page_1.PageFooter, { isDirty: isDirty, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => reset(passwordDefaultValues), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: passwordFormId, primary: true, disabled: !isDirty, type: 'submit', children: t('Save_changes') })] }) })] }));
};
exports.default = AccountSecurityPage;
