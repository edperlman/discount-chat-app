"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const definitions_1 = require("../../definitions");
const useVoipDialer_1 = require("../../hooks/useVoipDialer");
const useVoipSession_1 = require("../../hooks/useVoipSession");
const VoipDialerView_1 = __importDefault(require("./views/VoipDialerView"));
const VoipErrorView_1 = __importDefault(require("./views/VoipErrorView"));
const VoipIncomingView_1 = __importDefault(require("./views/VoipIncomingView"));
const VoipOngoingView_1 = __importDefault(require("./views/VoipOngoingView"));
const VoipOutgoingView_1 = __importDefault(require("./views/VoipOutgoingView"));
const VoipPopup = ({ position }) => {
    const session = (0, useVoipSession_1.useVoipSession)();
    const { open: isDialerOpen } = (0, useVoipDialer_1.useVoipDialer)();
    if ((0, definitions_1.isVoipIncomingSession)(session)) {
        return (0, jsx_runtime_1.jsx)(VoipIncomingView_1.default, { session: session, position: position });
    }
    if ((0, definitions_1.isVoipOngoingSession)(session)) {
        return (0, jsx_runtime_1.jsx)(VoipOngoingView_1.default, { session: session, position: position });
    }
    if ((0, definitions_1.isVoipOutgoingSession)(session)) {
        return (0, jsx_runtime_1.jsx)(VoipOutgoingView_1.default, { session: session, position: position });
    }
    if ((0, definitions_1.isVoipErrorSession)(session)) {
        return (0, jsx_runtime_1.jsx)(VoipErrorView_1.default, { session: session, position: position });
    }
    if (isDialerOpen) {
        return (0, jsx_runtime_1.jsx)(VoipDialerView_1.default, { position: position });
    }
    return null;
};
exports.default = VoipPopup;
