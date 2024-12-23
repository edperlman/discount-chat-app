"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_i18next_1 = require("react-i18next");
const VoipStatus = ({ isHeld = false, isMuted = false }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    if (!isHeld && !isMuted) {
        return null;
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p2', display: 'flex', justifyContent: 'space-between', paddingInline: 12, pb: 4, children: [isHeld && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', color: 'default', children: t('On_Hold') })), isMuted && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', color: 'status-font-on-warning', children: t('Muted') }))] }));
};
exports.default = VoipStatus;
