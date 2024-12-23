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
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useLicense_1 = require("../../../hooks/useLicense");
const toast_1 = require("../../../lib/toast");
const SetupWizardContext_1 = require("../contexts/SetupWizardContext");
const SERVER_OPTIONS = {
    REGISTERED: 'REGISTERED',
    OFFLINE: 'OFFLINE',
};
const RegisterServerStep = () => {
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const { currentStep, goToNextStep, setSetupWizardData, registerServer, maxSteps, completeSetupWizard, saveAgreementData } = (0, SetupWizardContext_1.useSetupWizardContext)();
    const [serverOption, setServerOption] = (0, react_1.useState)(SERVER_OPTIONS.REGISTERED);
    const invalidateLicenseQuery = (0, useLicense_1.useInvalidateLicense)();
    const handleRegister = (data) => __awaiter(void 0, void 0, void 0, function* () {
        goToNextStep();
        setSetupWizardData((prevState) => (Object.assign(Object.assign({}, prevState), { serverData: data })));
        yield registerServer(data);
    });
    const registerManually = (0, ui_contexts_1.useEndpoint)('POST', '/v1/cloud.manualRegister');
    const registerPreIntent = (0, ui_contexts_1.useEndpoint)('POST', '/v1/cloud.registerPreIntent');
    const getWorkspaceRegisterData = (0, ui_contexts_1.useMethod)('cloud:getWorkspaceRegisterData');
    const { data: clientKey } = (0, react_query_1.useQuery)(['setupWizard/clientKey'], () => __awaiter(void 0, void 0, void 0, function* () { return getWorkspaceRegisterData(); }), {
        staleTime: Infinity,
    });
    const { data: offline, isLoading, isError, } = (0, react_query_1.useQuery)(['setupWizard/registerIntent'], () => __awaiter(void 0, void 0, void 0, function* () { return registerPreIntent(); }), {
        staleTime: Infinity,
        select: (data) => data.offline,
    });
    const { mutate } = (0, react_query_1.useMutation)(['setupWizard/confirmOfflineRegistration'], (token) => __awaiter(void 0, void 0, void 0, function* () { return registerManually({ cloudBlob: token }); }), {
        onSuccess: () => {
            invalidateLicenseQuery(100);
            completeSetupWizard();
        },
        onError: () => {
            (0, toast_1.dispatchToastMessage)({ type: 'error', message: t('Cloud_register_error') });
        },
    });
    const handleConfirmOffline = (_a) => __awaiter(void 0, [_a], void 0, function* ({ token, agreement }) {
        yield saveAgreementData(agreement);
        mutate(token);
    });
    if (serverOption === SERVER_OPTIONS.OFFLINE) {
        return ((0, jsx_runtime_1.jsx)(onboarding_ui_1.RegisterOfflinePage, { termsHref: 'https://rocket.chat/terms', policyHref: 'https://rocket.chat/privacy', clientKey: clientKey || '', onCopySecurityCode: () => (0, toast_1.dispatchToastMessage)({ type: 'success', message: t('Copied') }), onBackButtonClick: () => setServerOption(SERVER_OPTIONS.REGISTERED), onSubmit: handleConfirmOffline }));
    }
    return ((0, jsx_runtime_1.jsx)(react_i18next_1.I18nextProvider, { i18n: i18n, defaultNS: 'onboarding', children: (0, jsx_runtime_1.jsx)(onboarding_ui_1.RegisterServerPage, { onClickRegisterOffline: () => setServerOption(SERVER_OPTIONS.OFFLINE), stepCount: maxSteps, onSubmit: handleRegister, currentStep: currentStep, offline: isError || (!isLoading && offline) }) }));
};
exports.default = RegisterServerStep;
