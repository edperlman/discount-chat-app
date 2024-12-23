"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallDialpadButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const CallContext_1 = require("../../../../contexts/CallContext");
const useDialModal_1 = require("../../../../hooks/useDialModal");
const rcxCallDialButton = (0, css_in_js_1.css) `
	.rcx-show-call-button-on-hover:not(:hover) & {
		display: none !important;
	}
`;
const CallDialpadButton = ({ phoneNumber }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { outBoundCallsAllowed, outBoundCallsEnabledForUser } = (0, CallContext_1.useVoipOutboundStates)();
    const { openDialModal } = (0, useDialModal_1.useDialModal)();
    const onClick = (event) => {
        event.stopPropagation();
        openDialModal({ initialValue: phoneNumber });
    };
    return ((0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { "rcx-call-dial-button": true, title: outBoundCallsAllowed ? t('Call_number') : t('Call_number_premium_only'), className: rcxCallDialButton, disabled: !outBoundCallsEnabledForUser || !phoneNumber, tiny: true, icon: 'phone', onClick: onClick }));
};
exports.CallDialpadButton = CallDialpadButton;
