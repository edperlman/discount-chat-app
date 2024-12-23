"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomActivityIcon = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useIsRoomOverMacLimit_1 = require("../../../hooks/omnichannel/useIsRoomOverMacLimit");
const RoomActivityIcon = ({ room }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const isRoomOverMacLimit = (0, useIsRoomOverMacLimit_1.useIsRoomOverMacLimit)(room);
    return isRoomOverMacLimit ? ((0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'warning', verticalAlign: 'middle', size: 'x20', color: 'danger', title: t('Workspace_exceeded_MAC_limit_disclaimer') })) : null;
};
exports.RoomActivityIcon = RoomActivityIcon;
