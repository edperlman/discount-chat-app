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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const SetupWizardContext_1 = require("../contexts/SetupWizardContext");
const getSettingOptions = (settings, settingId, t) => {
    if (!settings) {
        return [];
    }
    const setting = settings.find(({ _id }) => _id === settingId);
    if (!(setting === null || setting === void 0 ? void 0 : setting.values)) {
        return [];
    }
    return setting.values.map(({ i18nLabel, key }) => [String(key), t(i18nLabel)]);
};
const OrganizationInfoStep = () => {
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const hasAdminRole = (0, ui_contexts_1.useRole)('admin');
    const { setupWizardData: { organizationData }, saveOrganizationData, setSetupWizardData, settings, goToPreviousStep, goToNextStep, completeSetupWizard, currentStep, skipCloudRegistration, maxSteps, } = (0, SetupWizardContext_1.useSetupWizardContext)();
    const countryOptions = getSettingOptions(settings, 'Country', t);
    const organizationIndustryOptions = getSettingOptions(settings, 'Industry', t);
    const organizationSizeOptions = getSettingOptions(settings, 'Size', t);
    const handleSubmit = (data) => __awaiter(void 0, void 0, void 0, function* () {
        if (skipCloudRegistration) {
            return completeSetupWizard();
        }
        setSetupWizardData((prevState) => (Object.assign(Object.assign({}, prevState), { organizationData: data })));
        yield saveOrganizationData(data);
        goToNextStep();
    });
    return ((0, jsx_runtime_1.jsx)(react_i18next_1.I18nextProvider, { i18n: i18n, defaultNS: 'onboarding', children: (0, jsx_runtime_1.jsx)(onboarding_ui_1.OrganizationInfoPage, { initialValues: organizationData, onSubmit: handleSubmit, onBackButtonClick: !hasAdminRole ? goToPreviousStep : undefined, currentStep: currentStep, stepCount: maxSteps, organizationIndustryOptions: organizationIndustryOptions, organizationSizeOptions: organizationSizeOptions, countryOptions: countryOptions, nextStep: skipCloudRegistration ? t('Register') : undefined }) }));
};
exports.default = OrganizationInfoStep;
