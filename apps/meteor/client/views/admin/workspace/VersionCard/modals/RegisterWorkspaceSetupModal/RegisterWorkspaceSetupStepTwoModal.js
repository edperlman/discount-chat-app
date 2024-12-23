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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const setIntervalTime = (interval) => (interval ? interval * 1000 : 0);
const RegisterWorkspaceSetupStepTwoModal = (_a) => {
    var { email, step, setStep, onClose, intentData, onSuccess } = _a, props = __rest(_a, ["email", "step", "setStep", "onClose", "intentData", "onSuccess"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const cloudConfirmationPoll = (0, ui_contexts_1.useEndpoint)('GET', '/v1/cloud.confirmationPoll');
    const createRegistrationIntent = (0, ui_contexts_1.useEndpoint)('POST', '/v1/cloud.createRegistrationIntent');
    const handleBackFromConfirmation = () => setStep(step - 1);
    const handleResendRegistrationEmail = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield createRegistrationIntent({ resend: true, email });
            dispatchToastMessage({ type: 'success', message: t('Email_sent') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    });
    const getConfirmation = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { pollData } = yield cloudConfirmationPoll({
                deviceCode: intentData.device_code,
            });
            if ('successful' in pollData && pollData.successful) {
                dispatchToastMessage({ type: 'success', message: t('Workspace_registered') });
                onSuccess();
            }
        }
        catch (error) {
            console.log(error);
        }
    }), [cloudConfirmationPoll, intentData.device_code, dispatchToastMessage, t, onSuccess]);
    (0, react_1.useEffect)(() => {
        const pollInterval = setInterval(() => getConfirmation(), setIntervalTime(intentData.interval));
        return () => clearInterval(pollInterval);
    }, [getConfirmation, intentData]);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.HeaderText, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Tagline, { children: t('RegisterWorkspace_Setup_Steps', { step, numberOfSteps: 2 }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Awaiting_confirmation') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: onClose })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontSize: 'p2', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: (0, jsx_runtime_1.jsx)(react_i18next_1.Trans, { i18nKey: 'RegisterWorkspace_Setup_Email_Confirmation', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'p', children: ["Email sent to", ' ', (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'span', fontScale: 'p2b', children: [email, ' '] }), "with a confirmation link."] }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', children: t('RegisterWorkspace_Setup_Email_Verification') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { pbs: 10, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Security_code') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { defaultValue: intentData.user_code, disabled: true }) })] })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'div', display: 'flex', justifyContent: 'start', fontSize: 'c1', w: 'full', children: ["Didn\u2019t receive email?", ' ', (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'a', pi: 4, onClick: handleResendRegistrationEmail, children: "Resend" }), ' ', "or", ' ', (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'a', pi: 4, onClick: handleBackFromConfirmation, children: "change email" })] }) })] })));
};
exports.default = RegisterWorkspaceSetupStepTwoModal;
