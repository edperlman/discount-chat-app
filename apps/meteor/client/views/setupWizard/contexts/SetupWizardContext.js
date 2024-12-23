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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSetupWizardContext = exports.SetupWizardContext = void 0;
const react_1 = require("react");
exports.SetupWizardContext = (0, react_1.createContext)({
    setupWizardData: {
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
        registrationData: { cloudEmail: '', user_code: '', device_code: '' },
    },
    setSetupWizardData: (data) => data,
    loaded: false,
    settings: [],
    skipCloudRegistration: false,
    goToPreviousStep: () => undefined,
    goToNextStep: () => undefined,
    goToStep: () => undefined,
    registerAdminUser: () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }),
    registerServer: () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }),
    saveAgreementData: () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }),
    saveWorkspaceData: () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }),
    saveOrganizationData: () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }),
    validateEmail: () => true,
    currentStep: 1,
    completeSetupWizard: () => __awaiter(void 0, void 0, void 0, function* () { return undefined; }),
    maxSteps: 4,
});
const useSetupWizardContext = () => (0, react_1.useContext)(exports.SetupWizardContext);
exports.useSetupWizardContext = useSetupWizardContext;
