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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const RegisterWorkspaceModal_1 = __importDefault(require("../RegisterWorkspaceModal"));
const RegisterWorkspaceSetupStepOneModal = (_a) => {
    var { email, setEmail, step, setStep, terms, setTerms, onClose, validInfo, setIntentData } = _a, props = __rest(_a, ["email", "setEmail", "step", "setStep", "terms", "setTerms", "onClose", "validInfo", "setIntentData"]);
    const setModal = (0, ui_contexts_1.useSetModal)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const createRegistrationIntent = (0, ui_contexts_1.useEndpoint)('POST', '/v1/cloud.createRegistrationIntent');
    const handleBack = () => {
        const handleModalClose = () => setModal(null);
        setModal((0, jsx_runtime_1.jsx)(RegisterWorkspaceModal_1.default, { onClose: handleModalClose }));
    };
    const handleRegisterWorkspace = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { intentData } = yield createRegistrationIntent({ resend: false, email });
            setIntentData(intentData);
            setStep(step + 1);
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    });
    const emailField = (0, fuselage_hooks_1.useUniqueId)();
    const termsField = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.HeaderText, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Tagline, { children: t('RegisterWorkspace_Setup_Steps', { step, numberOfSteps: 2 }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('RegisterWorkspace_with_email') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: onClose })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', fontSize: 'p2', withRichContent: true, children: t('RegisterWorkspace_Setup_Subtitle') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { pbs: 10, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: emailField, children: t('RegisterWorkspace_Setup_Label') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { id: emailField, onChange: (e) => {
                                            setEmail(e.target.value);
                                        } }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mb: 16, fontSize: 'c1', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', children: (0, jsx_runtime_1.jsx)("strong", { children: t('RegisterWorkspace_Setup_Have_Account_Title') }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', children: t('RegisterWorkspace_Setup_Have_Account_Subtitle') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', pbs: 16, children: (0, jsx_runtime_1.jsx)("strong", { children: t('RegisterWorkspace_Setup_No_Account_Title') }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', children: t('RegisterWorkspace_Setup_No_Account_Subtitle') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { justifyContent: 'initial', children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { display: 'block', fontScale: 'c1', htmlFor: termsField, children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'RegisterWorkspace_Setup_Terms_Privacy', children: ["I agree with ", (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: 'https://rocket.chat/terms', children: "Terms and Conditions" }), " and", ' ', (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: 'https://rocket.chat/privacy', children: "Privacy Policy" })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { id: termsField, checked: terms, onChange: () => setTerms(!terms) })] }) })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { align: 'end', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleBack, children: t('Back') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: handleRegisterWorkspace, disabled: !validInfo, children: t('Next') })] }) })] })));
};
exports.default = RegisterWorkspaceSetupStepOneModal;
