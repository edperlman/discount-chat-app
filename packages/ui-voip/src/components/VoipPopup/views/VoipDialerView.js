"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const __1 = require("../..");
const useVoipAPI_1 = require("../../../hooks/useVoipAPI");
const VoipPopupContainer_1 = __importDefault(require("../components/VoipPopupContainer"));
const VoipPopupContent_1 = __importDefault(require("../components/VoipPopupContent"));
const VoipPopupFooter_1 = __importDefault(require("../components/VoipPopupFooter"));
const VoipPopupHeader_1 = __importDefault(require("../components/VoipPopupHeader"));
const VoipDialerView = ({ position }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { makeCall, closeDialer } = (0, useVoipAPI_1.useVoipAPI)();
    const [number, setNumber] = (0, react_1.useState)('');
    const handleCall = () => {
        makeCall(number);
        closeDialer();
    };
    return ((0, jsx_runtime_1.jsxs)(VoipPopupContainer_1.default, { secondary: true, "data-testid": 'vc-popup-dialer', position: position, children: [(0, jsx_runtime_1.jsx)(VoipPopupHeader_1.default, { hideSettings: true, onClose: closeDialer, children: t('New_Call') }), (0, jsx_runtime_1.jsx)(VoipPopupContent_1.default, { children: (0, jsx_runtime_1.jsx)(__1.VoipDialPad, { editable: true, value: number, onChange: (value) => setNumber(value) }) }), (0, jsx_runtime_1.jsx)(VoipPopupFooter_1.default, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { large: true, children: [(0, jsx_runtime_1.jsx)(__1.VoipSettingsButton, {}), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { medium: true, success: true, icon: 'phone', disabled: !number, flexGrow: 1, onClick: handleCall, children: t('Call') })] }) })] }));
};
exports.default = VoipDialerView;
