"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
// import { useTranslation } from '@rocket.chat/ui-contexts';
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const CallContext_1 = require("../../../../../contexts/CallContext");
const useDialModal_1 = require("../../../../../hooks/useDialModal");
const ContactInfoCallButton = ({ phoneNumber }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { openDialModal } = (0, useDialModal_1.useDialModal)();
    const { outBoundCallsAllowed, outBoundCallsEnabledForUser } = (0, CallContext_1.useVoipOutboundStates)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { onClick: () => openDialModal({ initialValue: phoneNumber }), tiny: true, disabled: !outBoundCallsEnabledForUser || !phoneNumber, title: outBoundCallsAllowed ? t('Call_number') : t('Call_number_premium_only'), icon: 'dialpad' }));
};
exports.default = ContactInfoCallButton;
