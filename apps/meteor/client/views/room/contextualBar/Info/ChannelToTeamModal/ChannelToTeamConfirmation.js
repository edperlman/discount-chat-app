"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../../../components/GenericModal"));
const ChannelToTeamConfirmation = ({ onCancel, onConfirm }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'warning', icon: 'warning', title: t('Confirmation'), confirmText: t('Yes'), onClose: onCancel, onCancel: onCancel, onConfirm: onConfirm, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: t('Teams_move_channel_to_team_confirm_description') }) }));
};
exports.default = ChannelToTeamConfirmation;
