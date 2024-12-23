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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const emailValidator_1 = require("../../../../../../../lib/emailValidator");
const RegisteredWorkspaceModal_1 = __importDefault(require("../RegisteredWorkspaceModal"));
const RegisterWorkspaceSetupStepOneModal_1 = __importDefault(require("./RegisterWorkspaceSetupStepOneModal"));
const RegisterWorkspaceSetupStepTwoModal_1 = __importDefault(require("./RegisterWorkspaceSetupStepTwoModal"));
const RegisterWorkspaceSetupModal = ({ onClose }) => {
    const setModal = (0, ui_contexts_1.useSetModal)();
    const [step, setStep] = (0, react_1.useState)(1);
    const [email, setEmail] = (0, react_1.useState)('');
    const [terms, setTerms] = (0, react_1.useState)(false);
    const [validInfo, setValidInfo] = (0, react_1.useState)(false);
    const [intentData, setIntentData] = (0, react_1.useState)({
        device_code: '',
        interval: 0,
        user_code: '',
    });
    // reset validInfo when users go back to step 1
    (0, react_1.useEffect)(() => {
        setValidInfo(false);
    }, [step]);
    (0, react_1.useEffect)(() => {
        if (step === 1) {
            setValidInfo((0, emailValidator_1.validateEmail)(email) && terms);
        }
    }, [email, terms]);
    const onSuccess = () => {
        const handleModalClose = () => setModal(null);
        setModal((0, jsx_runtime_1.jsx)(RegisteredWorkspaceModal_1.default, { onClose: handleModalClose }));
    };
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: step === 1 ? ((0, jsx_runtime_1.jsx)(RegisterWorkspaceSetupStepOneModal_1.default, { email: email, setEmail: setEmail, step: step, setStep: setStep, terms: terms, setTerms: setTerms, onClose: onClose, validInfo: validInfo, setIntentData: setIntentData })) : ((0, jsx_runtime_1.jsx)(RegisterWorkspaceSetupStepTwoModal_1.default, { email: email, step: step, setStep: setStep, onClose: onClose, intentData: intentData, onSuccess: onSuccess })) }));
};
exports.default = RegisterWorkspaceSetupModal;
