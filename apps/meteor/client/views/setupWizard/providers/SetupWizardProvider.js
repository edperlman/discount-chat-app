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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const meteor_1 = require("meteor/meteor");
const react_1 = __importStar(require("react"));
const callbacks_1 = require("../../../../lib/callbacks");
const emailValidator_1 = require("../../../../lib/emailValidator");
const useLicense_1 = require("../../../hooks/useLicense");
const queryClient_1 = require("../../../lib/queryClient");
const SetupWizardContext_1 = require("../contexts/SetupWizardContext");
const useParameters_1 = require("../hooks/useParameters");
const useStepRouting_1 = require("../hooks/useStepRouting");
const initialData = {
    organizationData: {
        organizationName: '',
        organizationIndustry: '',
        organizationSize: '',
        country: '',
    },
    serverData: {
        agreement: false,
        email: '',
        updates: false,
    },
    registrationData: { cloudEmail: '', device_code: '', user_code: '' },
};
const SetupWizardProvider = ({ children }) => {
    const invalidateLicenseQuery = (0, useLicense_1.useInvalidateLicense)();
    const t = (0, ui_contexts_1.useTranslation)();
    const [setupWizardData, setSetupWizardData] = (0, react_1.useState)(initialData);
    const [currentStep, setCurrentStep] = (0, useStepRouting_1.useStepRouting)();
    const { isSuccess, data } = (0, useParameters_1.useParameters)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const dispatchSettings = (0, ui_contexts_1.useSettingsDispatch)();
    const setShowSetupWizard = (0, ui_contexts_1.useSettingSetValue)('Show_Setup_Wizard');
    const registerUser = (0, ui_contexts_1.useMethod)('registerUser');
    const defineUsername = (0, ui_contexts_1.useMethod)('setUsername');
    const loginWithPassword = (0, ui_contexts_1.useLoginWithPassword)();
    const setForceLogin = (0, ui_contexts_1.useSessionDispatch)('forceLogin');
    const createRegistrationIntent = (0, ui_contexts_1.useEndpoint)('POST', '/v1/cloud.createRegistrationIntent');
    const goToPreviousStep = (0, react_1.useCallback)(() => setCurrentStep((currentStep) => currentStep - 1), [setCurrentStep]);
    const goToNextStep = (0, react_1.useCallback)(() => setCurrentStep((currentStep) => currentStep + 1), [setCurrentStep]);
    const goToStep = (0, react_1.useCallback)((step) => setCurrentStep(() => step), [setCurrentStep]);
    const _validateEmail = (0, react_1.useCallback)((email) => {
        if (!(0, emailValidator_1.validateEmail)(email)) {
            return t('Invalid_email');
        }
        return true;
    }, [t]);
    const registerAdminUser = (0, react_1.useCallback)((_a) => __awaiter(void 0, [_a], void 0, function* ({ fullname, username, email, password }) {
        yield registerUser({ name: fullname, username, email, pass: password });
        void callbacks_1.callbacks.run('userRegistered', {});
        try {
            yield loginWithPassword(email, password);
        }
        catch (error) {
            if (error instanceof meteor_1.Meteor.Error && error.error === 'error-invalid-email') {
                dispatchToastMessage({ type: 'success', message: t('We_have_sent_registration_email') });
                return;
            }
            if (error instanceof Error || typeof error === 'string') {
                dispatchToastMessage({ type: 'error', message: error });
            }
            throw error;
        }
        setForceLogin(false);
        yield defineUsername(username);
        yield dispatchSettings([{ _id: 'Organization_Email', value: email }]);
        void callbacks_1.callbacks.run('usernameSet', {});
    }), [registerUser, setForceLogin, defineUsername, dispatchSettings, loginWithPassword, dispatchToastMessage, t]);
    const saveAgreementData = (0, react_1.useCallback)((agreement) => __awaiter(void 0, void 0, void 0, function* () {
        yield dispatchSettings([
            {
                _id: 'Cloud_Service_Agree_PrivacyTerms',
                value: agreement,
            },
        ]);
    }), [dispatchSettings]);
    const saveWorkspaceData = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        const { serverData: { updates, agreement }, } = setupWizardData;
        yield dispatchSettings([
            {
                _id: 'Register_Server',
                value: true,
            },
            {
                _id: 'Allow_Marketing_Emails',
                value: updates,
            },
        ]);
        yield saveAgreementData(agreement);
    }), [dispatchSettings, saveAgreementData, setupWizardData]);
    const saveOrganizationData = (0, react_1.useCallback)((organizationData) => __awaiter(void 0, void 0, void 0, function* () {
        const { organizationName, organizationIndustry, organizationSize, country } = organizationData;
        yield dispatchSettings([
            {
                _id: 'Country',
                value: country,
            },
            {
                _id: 'Industry',
                value: organizationIndustry,
            },
            {
                _id: 'Size',
                value: organizationSize,
            },
            {
                _id: 'Organization_Name',
                value: organizationName,
            },
        ]);
    }), [dispatchSettings]);
    const registerServer = (0, fuselage_hooks_1.useMutableCallback)((_a) => __awaiter(void 0, [_a], void 0, function* ({ email, resend = false }) {
        try {
            const { intentData } = yield createRegistrationIntent({ resend, email });
            invalidateLicenseQuery(100);
            queryClient_1.queryClient.invalidateQueries(['getRegistrationStatus']);
            setSetupWizardData((prevState) => (Object.assign(Object.assign({}, prevState), { registrationData: Object.assign(Object.assign({}, intentData), { cloudEmail: email }) })));
            goToStep(4);
            setShowSetupWizard('in_progress');
        }
        catch (e) {
            dispatchToastMessage({ type: 'error', message: t('Cloud_register_error') });
        }
    }));
    const completeSetupWizard = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        dispatchToastMessage({ type: 'success', message: t('Your_workspace_is_ready') });
        return setShowSetupWizard('completed');
    }));
    const value = (0, react_1.useMemo)(() => ({
        setupWizardData,
        setSetupWizardData,
        currentStep,
        loaded: isSuccess,
        settings: data.settings,
        skipCloudRegistration: data.serverAlreadyRegistered,
        goToPreviousStep,
        goToNextStep,
        goToStep,
        registerAdminUser,
        validateEmail: _validateEmail,
        registerServer,
        saveAgreementData,
        saveWorkspaceData,
        saveOrganizationData,
        completeSetupWizard,
        maxSteps: data.serverAlreadyRegistered ? 2 : 4,
    }), [
        setupWizardData,
        currentStep,
        isSuccess,
        data.settings,
        data.serverAlreadyRegistered,
        goToPreviousStep,
        goToNextStep,
        goToStep,
        registerAdminUser,
        _validateEmail,
        registerServer,
        saveAgreementData,
        saveWorkspaceData,
        saveOrganizationData,
        completeSetupWizard,
    ]);
    return (0, jsx_runtime_1.jsx)(SetupWizardContext_1.SetupWizardContext.Provider, { value: value, children: children });
};
exports.default = SetupWizardProvider;
