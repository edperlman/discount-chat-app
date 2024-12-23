"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const DialInput_1 = require("./DialInput");
const Pad_1 = __importDefault(require("./Pad"));
const useDialPad_1 = require("./hooks/useDialPad");
const useEnterKey_1 = require("./hooks/useEnterKey");
const callButtonStyle = (0, css_in_js_1.css) `
	> i {
		font-size: 32px !important;
	}
`;
const DialPadModal = ({ initialValue, errorMessage: initialErrorMessage, handleClose }) => {
    const { inputName, inputRef, inputError, isButtonDisabled, handleOnChange, handleBackspaceClick, handlePadButtonClick, handlePadButtonLongPressed, handleCallButtonClick, } = (0, useDialPad_1.useDialPad)({ initialValue, initialErrorMessage });
    (0, useEnterKey_1.useEnterKey)(handleCallButtonClick, isButtonDisabled);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { width: '432px', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, {}), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: handleClose })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { display: 'flex', justifyContent: 'center', flexDirection: 'column', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(DialInput_1.DialInput, { ref: inputRef, inputName: inputName, inputError: inputError, handleBackspaceClick: handleBackspaceClick, isButtonDisabled: isButtonDisabled, handleOnChange: handleOnChange }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { fontSize: '12px', h: '16px', textAlign: 'center', children: inputError })] }), (0, jsx_runtime_1.jsx)(Pad_1.default, { onClickPadButton: handlePadButtonClick, onLongPressPadButton: handlePadButtonLongPressed })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { justifyContent: 'center', children: (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { className: callButtonStyle, icon: 'phone', disabled: isButtonDisabled, borderRadius: 'full', secondary: true, info: true, size: '64px', onClick: () => {
                        handleCallButtonClick();
                        handleClose();
                    } }) })] }));
};
exports.default = DialPadModal;
