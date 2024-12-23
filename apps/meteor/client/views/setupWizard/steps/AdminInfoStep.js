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
const onboarding_ui_1 = require("@rocket.chat/onboarding-ui");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const SetupWizardContext_1 = require("../contexts/SetupWizardContext");
const toRegExp = (username) => new RegExp(`^${(0, string_helpers_1.escapeRegExp)(username).trim()}$`, 'i');
const usernameBlackList = ['all', 'here', 'admin'].map(toRegExp);
const hasBlockedName = (username) => !!usernameBlackList.length && usernameBlackList.some((restrictedUsername) => restrictedUsername.test((0, string_helpers_1.escapeRegExp)(username).trim()));
const AdminInfoStep = () => {
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const regexpForUsernameValidation = (0, ui_contexts_1.useSetting)('UTF8_User_Names_Validation');
    const usernameRegExp = new RegExp(`^${regexpForUsernameValidation}$`);
    const { currentStep, validateEmail, registerAdminUser, maxSteps } = (0, SetupWizardContext_1.useSetupWizardContext)();
    // TODO: check if username exists
    const validateUsername = (username) => {
        if (!usernameRegExp.test(username) || hasBlockedName(username)) {
            return t('Invalid_username');
        }
        return true;
    };
    const handleSubmit = (data) => __awaiter(void 0, void 0, void 0, function* () {
        registerAdminUser(data);
    });
    return ((0, jsx_runtime_1.jsx)(react_i18next_1.I18nextProvider, { i18n: i18n, defaultNS: 'onboarding', children: (0, jsx_runtime_1.jsx)(onboarding_ui_1.AdminInfoPage, { validatePassword: (password) => password.length > 0, passwordRulesHint: '', validateUsername: validateUsername, validateEmail: validateEmail, currentStep: currentStep, stepCount: maxSteps, onSubmit: handleSubmit }) }));
};
exports.default = AdminInfoStep;
