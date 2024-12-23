"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../../../../components/GenericModal"));
const ChannelDesertionTable_1 = __importDefault(require("../../../../ChannelDesertionTable"));
const LeaveTeamModalChannels = ({ rooms, onToggleAllRooms, onChangeRoomSelection, onConfirm, onCancel, eligibleRoomsLength, selectedRooms, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { variant: 'warning', title: t('Teams_leave'), onConfirm: onConfirm, onCancel: onCancel, onClose: onCancel, confirmText: t('Continue'), children: [t('Teams_leave_channels'), (0, jsx_runtime_1.jsx)(ChannelDesertionTable_1.default, { rooms: rooms, lastOwnerWarning: t('Teams_channels_last_owner_leave_channel_warning'), onToggleAllRooms: onToggleAllRooms, eligibleRoomsLength: eligibleRoomsLength, onChangeRoomSelection: onChangeRoomSelection, selectedRooms: selectedRooms })] }));
};
exports.default = LeaveTeamModalChannels;
