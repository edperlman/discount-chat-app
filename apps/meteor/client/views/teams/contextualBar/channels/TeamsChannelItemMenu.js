"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useRemoveRoomFromTeam_1 = require("./hooks/useRemoveRoomFromTeam");
const useToggleAutoJoin_1 = require("./hooks/useToggleAutoJoin");
const useDeleteRoom_1 = require("../../../hooks/roomActions/useDeleteRoom");
const TeamsChannelItemMenu = ({ room, mainRoom, reload }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { handleRemoveRoom, canRemoveTeamChannel } = (0, useRemoveRoomFromTeam_1.useRemoveRoomFromTeam)(room, { reload });
    const { handleDelete, canDeleteRoom } = (0, useDeleteRoom_1.useDeleteRoom)(room, { reload });
    const { handleToggleAutoJoin, canEditTeamChannel } = (0, useToggleAutoJoin_1.useToggleAutoJoin)(room, { reload, mainRoom });
    const toggleAutoJoin = {
        id: 'toggleAutoJoin',
        icon: room.t === 'c' ? 'hash' : 'hashtag-lock',
        content: t('Team_Auto-join'),
        onClick: handleToggleAutoJoin,
        addon: (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { checked: room.teamDefault }),
    };
    const removeRoom = {
        id: 'removeRoom',
        icon: 'cross',
        content: t('Team_Remove_from_team'),
        onClick: handleRemoveRoom,
        variant: 'danger',
    };
    const deleteRoom = {
        id: 'deleteRoom',
        icon: 'trash',
        content: t('Delete'),
        onClick: handleDelete,
        variant: 'danger',
    };
    return ((0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { title: t('More'), placement: 'bottom-end', sections: [
            {
                title: '',
                items: [canEditTeamChannel && toggleAutoJoin, canRemoveTeamChannel && removeRoom, canDeleteRoom && deleteRoom].filter(Boolean),
            },
        ] }));
};
exports.default = TeamsChannelItemMenu;
