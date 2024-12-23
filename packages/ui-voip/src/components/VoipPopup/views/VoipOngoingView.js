"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const __1 = require("../..");
const useVoipContactId_1 = require("../../../hooks/useVoipContactId");
const useVoipTransferModal_1 = require("../../../hooks/useVoipTransferModal");
const VoipPopupContainer_1 = __importDefault(require("../components/VoipPopupContainer"));
const VoipPopupContent_1 = __importDefault(require("../components/VoipPopupContent"));
const VoipPopupFooter_1 = __importDefault(require("../components/VoipPopupFooter"));
const VoipPopupHeader_1 = __importDefault(require("../components/VoipPopupHeader"));
const VoipOngoingView = ({ session, position }) => {
    const { startTransfer } = (0, useVoipTransferModal_1.useVoipTransferModal)({ session });
    const contactData = (0, useVoipContactId_1.useVoipContactId)({ session, transferEnabled: false });
    const [isDialPadOpen, setDialerOpen] = (0, react_1.useState)(false);
    const [dtmfValue, setDTMF] = (0, react_1.useState)('');
    const handleDTMF = (value, digit) => {
        setDTMF(value);
        if (digit) {
            session.dtmf(digit);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(VoipPopupContainer_1.default, { secondary: true, "data-testid": 'vc-popup-ongoing', position: position, children: [(0, jsx_runtime_1.jsx)(VoipPopupHeader_1.default, { children: (0, jsx_runtime_1.jsx)(__1.VoipTimer, {}) }), (0, jsx_runtime_1.jsxs)(VoipPopupContent_1.default, { children: [(0, jsx_runtime_1.jsx)(__1.VoipStatus, { isMuted: session.isMuted, isHeld: session.isHeld }), (0, jsx_runtime_1.jsx)(__1.VoipContactId, Object.assign({}, contactData)), isDialPadOpen && (0, jsx_runtime_1.jsx)(__1.VoipDialPad, { value: dtmfValue, longPress: false, onChange: handleDTMF })] }), (0, jsx_runtime_1.jsx)(VoipPopupFooter_1.default, { children: (0, jsx_runtime_1.jsx)(__1.VoipActions, { isMuted: session.isMuted, isHeld: session.isHeld, isDTMFActive: isDialPadOpen, onMute: session.mute, onHold: session.hold, onEndCall: session.end, onTransfer: startTransfer, onDTMF: () => setDialerOpen(!isDialPadOpen) }) })] }));
};
exports.default = VoipOngoingView;
