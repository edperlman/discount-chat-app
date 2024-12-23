"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const CallContext_1 = require("../../contexts/CallContext");
const useDialModal_1 = require("../../hooks/useDialModal");
const NavBarItemOmniChannelCallDialPad = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { openDialModal } = (0, useDialModal_1.useDialModal)();
    const { outBoundCallsAllowed, outBoundCallsEnabledForUser } = (0, CallContext_1.useVoipOutboundStates)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.NavBarItem, Object.assign({ icon: 'dialpad', onClick: () => openDialModal(), disabled: !outBoundCallsEnabledForUser, "aria-label": t('Open_Dialpad'), "data-tooltip": outBoundCallsAllowed ? t('New_Call') : t('New_Call_Premium_Only') }, props)));
};
exports.default = NavBarItemOmniChannelCallDialPad;
