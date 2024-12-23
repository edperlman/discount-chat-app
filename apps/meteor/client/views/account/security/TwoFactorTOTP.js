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
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const yaqrcode_1 = __importDefault(require("yaqrcode"));
const BackupCodesModal_1 = __importDefault(require("./BackupCodesModal"));
const TextCopy_1 = __importDefault(require("../../../components/TextCopy"));
const TwoFactorTotpModal_1 = __importDefault(require("../../../components/TwoFactorModal/TwoFactorTotpModal"));
const TwoFactorTOTP = (props) => {
    var _a, _b;
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const user = (0, ui_contexts_1.useUser)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const enableTotpFn = (0, ui_contexts_1.useMethod)('2fa:enable');
    const disableTotpFn = (0, ui_contexts_1.useMethod)('2fa:disable');
    const verifyCodeFn = (0, ui_contexts_1.useMethod)('2fa:validateTempToken');
    const checkCodesRemainingFn = (0, ui_contexts_1.useMethod)('2fa:checkCodesRemaining');
    const regenerateCodesFn = (0, ui_contexts_1.useMethod)('2fa:regenerateCodes');
    const [registeringTotp, setRegisteringTotp] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(false));
    const [qrCode, setQrCode] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)());
    const [totpSecret, setTotpSecret] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)());
    const [codesRemaining, setCodesRemaining] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(0));
    const { register, handleSubmit } = (0, react_hook_form_1.useForm)({ defaultValues: { authCode: '' } });
    const totpEnabled = (_b = (_a = user === null || user === void 0 ? void 0 : user.services) === null || _a === void 0 ? void 0 : _a.totp) === null || _b === void 0 ? void 0 : _b.enabled;
    const closeModal = (0, react_1.useCallback)(() => setModal(null), [setModal]);
    (0, react_1.useEffect)(() => {
        const updateCodesRemaining = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!totpEnabled) {
                return false;
            }
            const result = yield checkCodesRemainingFn();
            setCodesRemaining(result.remaining);
        });
        updateCodesRemaining();
    }, [checkCodesRemainingFn, setCodesRemaining, totpEnabled]);
    const handleEnableTotp = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield enableTotpFn();
            setTotpSecret(result.secret);
            setQrCode((0, yaqrcode_1.default)(result.url, { size: 200 }));
            setRegisteringTotp(true);
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [dispatchToastMessage, enableTotpFn, setQrCode, setRegisteringTotp, setTotpSecret]);
    const handleDisableTotp = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        const onDisable = (authCode) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const result = yield disableTotpFn(authCode);
                if (!result) {
                    return dispatchToastMessage({ type: 'error', message: t('Invalid_two_factor_code') });
                }
                dispatchToastMessage({ type: 'success', message: t('Two-factor_authentication_disabled') });
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            closeModal();
        });
        setModal((0, jsx_runtime_1.jsx)(TwoFactorTotpModal_1.default, { onConfirm: onDisable, onClose: closeModal }));
    }), [closeModal, disableTotpFn, dispatchToastMessage, setModal, t]);
    const handleVerifyCode = (0, react_1.useCallback)((_a) => __awaiter(void 0, [_a], void 0, function* ({ authCode }) {
        try {
            const result = yield verifyCodeFn(authCode);
            if (!result) {
                return dispatchToastMessage({ type: 'error', message: t('Invalid_two_factor_code') });
            }
            setModal((0, jsx_runtime_1.jsx)(BackupCodesModal_1.default, { codes: result.codes, onClose: closeModal }));
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [closeModal, dispatchToastMessage, setModal, t, verifyCodeFn]);
    const handleRegenerateCodes = (0, react_1.useCallback)(() => {
        const onRegenerate = (authCode) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const result = yield regenerateCodesFn(authCode);
                if (!result) {
                    return dispatchToastMessage({ type: 'error', message: t('Invalid_two_factor_code') });
                }
                setModal((0, jsx_runtime_1.jsx)(BackupCodesModal_1.default, { codes: result.codes, onClose: closeModal }));
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
        });
        setModal((0, jsx_runtime_1.jsx)(TwoFactorTotpModal_1.default, { onConfirm: onRegenerate, onClose: closeModal }));
    }, [closeModal, dispatchToastMessage, regenerateCodesFn, setModal, t]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }, props, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { blockEnd: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'h4', children: t('Two-factor_authentication_via_TOTP') }), !totpEnabled && !registeringTotp && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: t('Two-factor_authentication_is_currently_disabled') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: handleEnableTotp, children: t('Enable_two-factor_authentication') })] })), !totpEnabled && registeringTotp && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: t('Scan_QR_code') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: t('Scan_QR_code_alternative_s') }), (0, jsx_runtime_1.jsx)(TextCopy_1.default, { text: totpSecret || '' }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'img', size: 'x200', src: qrCode, "aria-hidden": 'true' }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', w: 'full', children: [(0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ placeholder: t('Enter_authentication_code') }, register('authCode'))), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: handleSubmit(handleVerifyCode), children: t('Verify') })] })] })), totpEnabled && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { danger: true, onClick: handleDisableTotp, children: t('Disable_two-factor_authentication') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2m', mbs: 8, children: t('Backup_codes') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: t('You_have_n_codes_remaining', { number: codesRemaining }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleRegenerateCodes, children: t('Regenerate_codes') })] }))] }) })));
};
exports.default = TwoFactorTOTP;
