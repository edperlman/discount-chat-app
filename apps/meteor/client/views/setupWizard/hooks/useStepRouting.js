"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStepRouting = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useStepRouting = () => {
    const param = (0, ui_contexts_1.useRouteParameter)('step');
    const router = (0, ui_contexts_1.useRouter)();
    const hasAdminRole = (0, ui_contexts_1.useRole)('admin');
    const hasOrganizationData = !!(0, ui_contexts_1.useSetting)('Organization_Name');
    const [currentStep, setCurrentStep] = (0, react_1.useState)(() => {
        const initialStep = (() => {
            switch (true) {
                case hasOrganizationData: {
                    return 3;
                }
                case hasAdminRole: {
                    return 2;
                }
                default: {
                    return 1;
                }
            }
        })();
        if (!param) {
            return initialStep;
        }
        const step = parseInt(param, 10);
        if (step && Number.isFinite(step) && step >= 1) {
            return step;
        }
        return initialStep;
    });
    (0, react_1.useEffect)(() => {
        switch (true) {
            case (currentStep === 1 || currentStep === 2) && hasOrganizationData: {
                setCurrentStep(3);
                router.navigate(`/setup-wizard/3`);
                break;
            }
            case currentStep === 1 && hasAdminRole: {
                setCurrentStep(2);
                router.navigate(`/setup-wizard/2`);
                break;
            }
            default: {
                router.navigate(`/setup-wizard/${currentStep}`);
            }
        }
    }, [router, currentStep, hasAdminRole, hasOrganizationData]);
    return [currentStep, setCurrentStep];
};
exports.useStepRouting = useStepRouting;
