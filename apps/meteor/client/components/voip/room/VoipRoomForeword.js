"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoipRoomForeword = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const client_1 = require("../../../../app/utils/client");
const parseOutboundPhoneNumber_1 = require("../../../lib/voip/parseOutboundPhoneNumber");
const VoipRoomForeword = ({ room }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const avatarUrl = (0, client_1.getUserAvatarURL)(room.name);
    const roomName = room.fname;
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'div', flexGrow: 1, display: 'flex', justifyContent: 'center', flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', justifyContent: 'center', mbs: 24, children: (0, jsx_runtime_1.jsx)(fuselage_1.Avatar, { size: 'x48', title: room.name, url: avatarUrl }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { color: 'default', fontScale: 'h2', flexGrow: 1, mb: 16, children: t('You_have_joined_a_new_call_with') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'div', mb: 8, flexGrow: 1, display: 'flex', justifyContent: 'center', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 4, children: (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { style: { cursor: 'default' }, variant: 'primary', medium: true, children: roomName && (0, parseOutboundPhoneNumber_1.parseOutboundPhoneNumber)(roomName) }) }) })] }));
};
exports.VoipRoomForeword = VoipRoomForeword;
