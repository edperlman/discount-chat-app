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
const useVoipContactId_1 = require("../../../hooks/useVoipContactId");
const VoipPopupContainer_1 = __importDefault(require("../components/VoipPopupContainer"));
const VoipPopupContent_1 = __importDefault(require("../components/VoipPopupContent"));
const VoipPopupFooter_1 = __importDefault(require("../components/VoipPopupFooter"));
const VoipPopupHeader_1 = __importDefault(require("../components/VoipPopupHeader"));
const VoipErrorView = ({ session, position }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const contactData = (0, useVoipContactId_1.useVoipContactId)({ session });
    const { status } = session.error;
    const title = (0, react_1.useMemo)(() => {
        switch (status) {
            case 487:
                return t('Call_terminated');
            case 486:
                return t('Caller_is_busy');
            case 480:
                return t('Temporarily_unavailable');
            default:
                return t('Unable_to_complete_call');
        }
    }, [status, t]);
    return ((0, jsx_runtime_1.jsxs)(VoipPopupContainer_1.default, { "data-testid": 'vc-popup-error', position: position, children: [(0, jsx_runtime_1.jsx)(VoipPopupHeader_1.default, { hideSettings: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p2', color: 'danger', fontWeight: 700, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'warning', size: 16 }), " ", title] }) }), (0, jsx_runtime_1.jsx)(VoipPopupContent_1.default, { children: (0, jsx_runtime_1.jsx)(__1.VoipContactId, Object.assign({}, contactData)) }), (0, jsx_runtime_1.jsx)(VoipPopupFooter_1.default, { children: (0, jsx_runtime_1.jsx)(__1.VoipActions, { onEndCall: session.end }) })] }));
};
exports.default = VoipErrorView;
