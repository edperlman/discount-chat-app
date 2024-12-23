"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDialPad = void 0;
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useDialModal_1 = require("../../../../hooks/useDialModal");
const useOutboundDialer_1 = require("../../../../hooks/useOutboundDialer");
const useDialPad = ({ initialValue, initialErrorMessage }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const outboundClient = (0, useOutboundDialer_1.useOutboundDialer)();
    const { closeDialModal } = (0, useDialModal_1.useDialModal)();
    const { setFocus, register, setValue, setError, clearErrors, watch, formState: { errors, isDirty }, } = (0, react_hook_form_1.useForm)({
        defaultValues: {
            PhoneInput: initialValue || '',
        },
    });
    const { ref, onChange } = register('PhoneInput');
    const value = watch('PhoneInput');
    const [disabled, setDisabled] = (0, react_1.useState)(true);
    const handleBackspaceClick = (0, react_1.useCallback)(() => {
        clearErrors();
        setValue('PhoneInput', value.slice(0, -1), { shouldDirty: true });
    }, [clearErrors, setValue, value]);
    const handlePadButtonClick = (0, react_1.useCallback)((digit) => {
        clearErrors();
        setValue('PhoneInput', value + digit, { shouldDirty: true });
    }, [clearErrors, setValue, value]);
    const handlePadButtonLongPressed = (0, react_1.useCallback)((digit) => {
        if (digit !== '+') {
            return;
        }
        setValue('PhoneInput', value + digit);
    }, [setValue, value]);
    const handleCallButtonClick = (0, react_1.useCallback)(() => {
        if (!outboundClient) {
            return setError('PhoneInput', { message: t('Something_went_wrong_try_again_later') });
        }
        outboundClient.makeCall(value);
        closeDialModal();
    }, [outboundClient, setError, t, value, closeDialModal]);
    const handleOnChange = (0, react_1.useCallback)((e) => onChange(e), [onChange]);
    (0, react_1.useEffect)(() => {
        setDisabled(!value);
    }, [value]);
    (0, react_1.useEffect)(() => {
        setFocus('PhoneInput');
    }, [setFocus]);
    return {
        inputName: 'PhoneInput',
        inputRef: ref,
        inputError: isDirty ? (_a = errors.PhoneInput) === null || _a === void 0 ? void 0 : _a.message : initialErrorMessage,
        isButtonDisabled: disabled,
        handleOnChange,
        handleBackspaceClick,
        handlePadButtonClick,
        handlePadButtonLongPressed,
        handleCallButtonClick,
    };
};
exports.useDialPad = useDialPad;
