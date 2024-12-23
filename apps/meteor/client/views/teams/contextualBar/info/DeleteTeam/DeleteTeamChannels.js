"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const ChannelDeletionTable_1 = __importDefault(require("./ChannelDeletionTable"));
const GenericModal_1 = __importDefault(require("../../../../../components/GenericModal"));
const DeleteTeamChannels = ({ rooms, onCancel, selectedRooms, onToggleAllRooms, onConfirm, onChangeRoomSelection, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { variant: 'warning', title: t('Teams_about_the_channels'), onConfirm: onConfirm, onCancel: onCancel, onClose: onCancel, confirmText: t('Continue'), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { withRichContent: true, mbe: 16, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'span', color: 'status-font-on-danger', fontWeight: 'bold', children: [t('Team_Delete_Channel_modal_content_danger'), ' '] }), t('Teams_delete_team_Warning')] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [t('Teams_delete_team_choose_channels'), " ", t('Teams_delete_team_public_notice')] }), (0, jsx_runtime_1.jsx)(ChannelDeletionTable_1.default, { rooms: rooms, onToggleAllRooms: onToggleAllRooms, onChangeRoomSelection: onChangeRoomSelection, selectedRooms: selectedRooms })] }));
};
exports.default = DeleteTeamChannels;
