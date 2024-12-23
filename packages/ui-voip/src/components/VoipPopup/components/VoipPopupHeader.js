"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_i18next_1 = require("react-i18next");
const VoipSettingsButton_1 = __importDefault(require("../../VoipSettingsButton"));
const VoipPopupHeader = ({ children, hideSettings, onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'header', p: 12, pbe: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', children: [children && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'h3', id: 'voipPopupTitle', color: 'titles-labels', fontScale: 'p2', fontWeight: '700', children: children })), !hideSettings && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mis: 8, children: (0, jsx_runtime_1.jsx)(VoipSettingsButton_1.default, { mini: true }) })), onClose && (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { mini: true, mis: 8, "aria-label": t('Close'), icon: 'cross', onClick: onClose })] }));
};
exports.default = VoipPopupHeader;
