"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoomActions = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useRoomConvertToTeam_1 = require("./actions/useRoomConvertToTeam");
const useRoomLeave_1 = require("./actions/useRoomLeave");
const useRoomMoveToTeam_1 = require("./actions/useRoomMoveToTeam");
const useHideRoomAction_1 = require("../../../../../hooks/useHideRoomAction");
const useDeleteRoom_1 = require("../../../../hooks/roomActions/useDeleteRoom");
const useRoomActions = (room, options) => {
    var _a;
    const { onClickEnterRoom, onClickEdit, resetState } = options;
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleLeave = (0, useRoomLeave_1.useRoomLeave)(room);
    const { handleDelete, canDeleteRoom } = (0, useDeleteRoom_1.useDeleteRoom)(room, { reload: resetState });
    const handleMoveToTeam = (0, useRoomMoveToTeam_1.useRoomMoveToTeam)(room);
    const handleConvertToTeam = (0, useRoomConvertToTeam_1.useRoomConvertToTeam)(room);
    const handleHide = (0, useHideRoomAction_1.useHideRoomAction)({ rid: room._id, type: room.t, name: (_a = room.name) !== null && _a !== void 0 ? _a : '' });
    return (0, react_1.useMemo)(() => {
        const memoizedActions = {
            items: [
                {
                    id: 'hide',
                    content: t('Hide'),
                    icon: 'eye-off',
                    onClick: handleHide,
                },
                ...(onClickEnterRoom
                    ? [
                        {
                            id: 'enter',
                            content: t('Enter'),
                            icon: 'login',
                            onClick: onClickEnterRoom,
                        },
                    ]
                    : []),
                ...(onClickEdit
                    ? [
                        {
                            id: 'edit',
                            content: t('Edit'),
                            icon: 'edit',
                            onClick: onClickEdit,
                        },
                    ]
                    : []),
                ...(handleLeave
                    ? [
                        {
                            id: 'leave',
                            content: t('Leave'),
                            icon: 'sign-out',
                            onClick: handleLeave,
                        },
                    ]
                    : []),
                ...(handleMoveToTeam
                    ? [
                        {
                            id: 'move_channel_team',
                            content: t('Teams_move_channel_to_team'),
                            icon: 'team-arrow-right',
                            onClick: handleMoveToTeam,
                        },
                    ]
                    : []),
                ...(handleConvertToTeam
                    ? [
                        {
                            id: 'convert_channel_team',
                            content: t('Teams_convert_channel_to_team'),
                            icon: 'team',
                            onClick: handleConvertToTeam,
                        },
                    ]
                    : []),
                ...(canDeleteRoom
                    ? [
                        {
                            id: 'delete',
                            content: t('Delete'),
                            icon: 'trash',
                            onClick: handleDelete,
                            variant: 'danger',
                        },
                    ]
                    : []),
            ],
        };
        return memoizedActions;
    }, [canDeleteRoom, handleConvertToTeam, handleDelete, handleHide, handleLeave, handleMoveToTeam, onClickEdit, onClickEnterRoom, t]);
};
exports.useRoomActions = useRoomActions;
