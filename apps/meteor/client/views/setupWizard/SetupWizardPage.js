"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const SetupWizardContext_1 = require("./contexts/SetupWizardContext");
const AdminInfoStep_1 = __importDefault(require("./steps/AdminInfoStep"));
const CloudAccountConfirmation_1 = __importDefault(require("./steps/CloudAccountConfirmation"));
const OrganizationInfoStep_1 = __importDefault(require("./steps/OrganizationInfoStep"));
const RegisterServerStep_1 = __importDefault(require("./steps/RegisterServerStep"));
const SetupWizardPage = () => {
    const { currentStep } = (0, SetupWizardContext_1.useSetupWizardContext)();
    switch (currentStep) {
        case 1:
            return (0, jsx_runtime_1.jsx)(AdminInfoStep_1.default, {});
        case 2:
            return (0, jsx_runtime_1.jsx)(OrganizationInfoStep_1.default, {});
        case 3:
            return (0, jsx_runtime_1.jsx)(RegisterServerStep_1.default, {});
        case 4:
            return (0, jsx_runtime_1.jsx)(CloudAccountConfirmation_1.default, {});
        default:
            throw new Error('Wrong wizard step');
    }
};
exports.default = SetupWizardPage;
