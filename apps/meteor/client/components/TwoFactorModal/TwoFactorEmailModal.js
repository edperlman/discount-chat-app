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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../GenericModal"));
const TwoFactorModal_1 = require("./TwoFactorModal");
const TwoFactorEmailModal = ({ onConfirm, onClose, emailOrUsername, invalidAttempt }) => {
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const [code, setCode] = (0, react_1.useState)('');
    const ref = (0, fuselage_hooks_1.useAutoFocus)();
    const sendEmailCode = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.2fa.sendEmailCode');
    const onClickResendCode = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield sendEmailCode({ emailOrUsername });
            dispatchToastMessage({ type: 'success', message: t('Email_sent') });
        }
        catch (error) {
            dispatchToastMessage({
                type: 'error',
                message: t('error-email-send-failed', { message: error }),
            });
        }
    });
    const onConfirmEmailCode = (e) => {
        e.preventDefault();
        onConfirm(code, TwoFactorModal_1.Method.EMAIL);
    };
    const onChange = ({ currentTarget }) => {
        setCode(currentTarget.value);
    };
    const id = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: onConfirmEmailCode }, props)), onCancel: onClose, confirmText: t('Verify'), title: t('Enter_authentication_code'), onClose: onClose, variant: 'warning', confirmDisabled: !code, tagline: t('Email_two-factor_authentication'), icon: null, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { alignSelf: 'stretch', htmlFor: id, children: t('Enter_the_code_we_just_emailed_you') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { id: id, ref: ref, value: code, onChange: onChange, placeholder: t('Enter_code_here') }) }), invalidAttempt && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('Invalid_password') })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { display: 'flex', justifyContent: 'end', onClick: onClickResendCode, small: true, mbs: 24, children: t('Cloud_resend_email') })] }));
};
exports.default = TwoFactorEmailModal;
