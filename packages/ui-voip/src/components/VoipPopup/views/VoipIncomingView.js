"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_i18next_1 = require("react-i18next");
const __1 = require("../..");
const useVoipContactId_1 = require("../../../hooks/useVoipContactId");
const VoipPopupContainer_1 = __importDefault(require("../components/VoipPopupContainer"));
const VoipPopupContent_1 = __importDefault(require("../components/VoipPopupContent"));
const VoipPopupFooter_1 = __importDefault(require("../components/VoipPopupFooter"));
const VoipPopupHeader_1 = __importDefault(require("../components/VoipPopupHeader"));
const VoipIncomingView = ({ session, position }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const contactData = (0, useVoipContactId_1.useVoipContactId)({ session });
    return ((0, jsx_runtime_1.jsxs)(VoipPopupContainer_1.default, { "data-testid": 'vc-popup-incoming', position: position, children: [(0, jsx_runtime_1.jsx)(VoipPopupHeader_1.default, { children: `${session.transferedBy ? t('Incoming_call_transfer') : t('Incoming_call')}...` }), (0, jsx_runtime_1.jsx)(VoipPopupContent_1.default, { children: (0, jsx_runtime_1.jsx)(__1.VoipContactId, Object.assign({}, contactData)) }), (0, jsx_runtime_1.jsx)(VoipPopupFooter_1.default, { children: (0, jsx_runtime_1.jsx)(__1.VoipActions, { onAccept: session.accept, onDecline: session.end }) })] }));
};
exports.default = VoipIncomingView;
