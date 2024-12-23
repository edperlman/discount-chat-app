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
const onboarding_ui_1 = require("@rocket.chat/onboarding-ui");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const SetupWizardContext_1 = require("../contexts/SetupWizardContext");
const setIntervalTime = (interval) => (interval ? interval * 1000 : 0);
const CloudAccountConfirmation = () => {
    const { registerServer, currentStep, maxSteps, goToStep, setupWizardData: { registrationData }, saveWorkspaceData, } = (0, SetupWizardContext_1.useSetupWizardContext)();
    const setShowSetupWizard = (0, ui_contexts_1.useSettingSetValue)('Show_Setup_Wizard');
    const cloudConfirmationPoll = (0, ui_contexts_1.useEndpoint)('GET', '/v1/cloud.confirmationPoll');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const getConfirmation = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (registrationData.device_code) {
                const { pollData } = yield cloudConfirmationPoll({
                    deviceCode: registrationData.device_code,
                });
                if ('successful' in pollData && pollData.successful) {
                    yield saveWorkspaceData();
                    dispatchToastMessage({ type: 'success', message: t('Your_workspace_is_ready') });
                    return setShowSetupWizard('completed');
                }
            }
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [cloudConfirmationPoll, registrationData.device_code, setShowSetupWizard, saveWorkspaceData, dispatchToastMessage, t]);
    (0, react_1.useEffect)(() => {
        const pollInterval = setInterval(() => getConfirmation(), setIntervalTime(registrationData.interval));
        return () => clearInterval(pollInterval);
    }, [getConfirmation, registrationData.interval]);
    return ((0, jsx_runtime_1.jsx)(react_i18next_1.I18nextProvider, { i18n: i18n, defaultNS: 'onboarding', children: (0, jsx_runtime_1.jsx)(onboarding_ui_1.AwaitingConfirmationPage, { currentStep: currentStep, stepCount: maxSteps, emailAddress: registrationData.cloudEmail, securityCode: registrationData.user_code, onResendEmailRequest: () => registerServer({ email: registrationData.cloudEmail, resend: true }), onChangeEmailRequest: () => goToStep(3) }) }));
};
exports.default = CloudAccountConfirmation;
