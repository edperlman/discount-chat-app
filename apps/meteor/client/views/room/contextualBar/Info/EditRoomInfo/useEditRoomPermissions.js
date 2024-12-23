"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEditRoomPermissions = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const E2EEState_1 = require("../../../../../../app/e2e/client/E2EEState");
const IRoomTypeConfig_1 = require("../../../../../../definition/IRoomTypeConfig");
const roomCoordinator_1 = require("../../../../../lib/rooms/roomCoordinator");
const useE2EEState_1 = require("../../../hooks/useE2EEState");
const getCanChangeType = (room, canCreateChannel, canCreateGroup, isAdmin) => (!room.default || isAdmin) && ((room.t === 'p' && canCreateChannel) || (room.t === 'c' && canCreateGroup));
const useEditRoomPermissions = (room) => {
    const isAdmin = (0, ui_contexts_1.useRole)('admin');
    const e2eeState = (0, useE2EEState_1.useE2EEState)();
    const isE2EEReady = e2eeState === E2EEState_1.E2EEState.READY || e2eeState === E2EEState_1.E2EEState.SAVE_PASSWORD;
    const canCreateChannel = (0, ui_contexts_1.usePermission)('create-c');
    const canCreateGroup = (0, ui_contexts_1.usePermission)('create-p');
    const teamsInfoEndpoint = (0, ui_contexts_1.useEndpoint)('GET', '/v1/teams.info');
    const teamId = room.teamId || '';
    const { data: teamInfoData } = (0, react_query_1.useQuery)(['teamId', teamId], () => __awaiter(void 0, void 0, void 0, function* () { return teamsInfoEndpoint({ teamId }); }), {
        keepPreviousData: true,
        retry: false,
        enabled: room.teamId !== '',
    });
    const canCreateTeamChannel = (0, ui_contexts_1.usePermission)('create-team-channel', teamInfoData === null || teamInfoData === void 0 ? void 0 : teamInfoData.teamInfo.roomId);
    const canCreateTeamGroup = (0, ui_contexts_1.usePermission)('create-team-group', teamInfoData === null || teamInfoData === void 0 ? void 0 : teamInfoData.teamInfo.roomId);
    const canChangeType = getCanChangeType(room, teamId ? canCreateTeamChannel : canCreateChannel, teamId ? canCreateTeamGroup : canCreateGroup, isAdmin);
    const canSetReadOnly = (0, ui_contexts_1.usePermission)('set-readonly', room._id);
    const canSetReactWhenReadOnly = (0, ui_contexts_1.usePermission)('set-react-when-readonly', room._id);
    const canEditRoomRetentionPolicy = (0, ui_contexts_1.usePermission)('edit-room-retention-policy', room._id);
    const canArchiveOrUnarchive = (0, ui_contexts_1.useAtLeastOnePermission)((0, react_1.useMemo)(() => ['archive-room', 'unarchive-room'], []), room._id);
    const canToggleEncryption = (0, ui_contexts_1.usePermission)('toggle-room-e2e-encryption', room._id) && (room.encrypted || isE2EEReady);
    const [canViewName, canViewTopic, canViewAnnouncement, canViewArchived, canViewDescription, canViewType, canViewReadOnly, canViewHideSysMes, canViewJoinCode, canViewReactWhenReadOnly, canViewEncrypted,] = (0, react_1.useMemo)(() => {
        var _a;
        const isAllowed = ((_a = roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t)) === null || _a === void 0 ? void 0 : _a.allowRoomSettingChange) ||
            (() => {
                undefined;
            });
        return [
            isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.NAME),
            isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.TOPIC),
            isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.ANNOUNCEMENT),
            isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.ARCHIVE_OR_UNARCHIVE),
            isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.DESCRIPTION),
            isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.TYPE),
            isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.READ_ONLY),
            isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.SYSTEM_MESSAGES),
            isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.JOIN_CODE),
            isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.REACT_WHEN_READ_ONLY),
            isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.E2E),
        ];
    }, [room]);
    return {
        canChangeType,
        canSetReadOnly,
        canSetReactWhenReadOnly,
        canEditRoomRetentionPolicy,
        canArchiveOrUnarchive,
        canToggleEncryption,
        canViewName,
        canViewTopic,
        canViewAnnouncement,
        canViewArchived,
        canViewDescription,
        canViewType,
        canViewReadOnly,
        canViewHideSysMes,
        canViewJoinCode,
        canViewReactWhenReadOnly,
        canViewEncrypted,
    };
};
exports.useEditRoomPermissions = useEditRoomPermissions;
