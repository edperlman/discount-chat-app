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
const TeamAutocomplete_1 = __importDefault(require("../../../../teams/contextualBar/TeamAutocomplete"));
const ChannelToTeamSelection = ({ teamId, onCancel, onChange, onConfirm }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { variant: 'warning', cancelText: t('Cancel'), confirmText: t('Continue'), title: t('Teams_Select_a_team'), onClose: onCancel, onCancel: onCancel, onConfirm: onConfirm, confirmDisabled: !teamId, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { blockEnd: 20, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: t('Teams_move_channel_to_team_description_first') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: t('Teams_move_channel_to_team_description_second') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: t('Teams_move_channel_to_team_description_third') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { children: t('Teams_move_channel_to_team_description_fourth') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', width: '100%', children: (0, jsx_runtime_1.jsx)(TeamAutocomplete_1.default, { onChange: onChange, value: teamId }) })] }));
};
exports.default = ChannelToTeamSelection;
