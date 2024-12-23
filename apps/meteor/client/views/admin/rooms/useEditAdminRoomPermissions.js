"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEditAdminRoomPermissions = void 0;
const react_1 = require("react");
const IRoomTypeConfig_1 = require("../../../../definition/IRoomTypeConfig");
const roomCoordinator_1 = require("../../../lib/rooms/roomCoordinator");
const useEditAdminRoomPermissions = (room) => {
    const [canViewName, canViewTopic, canViewAnnouncement, canViewArchived, canViewDescription, canViewType, canViewReadOnly, canViewReactWhenReadOnly,] = (0, react_1.useMemo)(() => {
        const isAllowed = roomCoordinator_1.roomCoordinator.getRoomDirectives(room.t).allowRoomSettingChange;
        return [
            isAllowed === null || isAllowed === void 0 ? void 0 : isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.NAME),
            isAllowed === null || isAllowed === void 0 ? void 0 : isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.TOPIC),
            isAllowed === null || isAllowed === void 0 ? void 0 : isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.ANNOUNCEMENT),
            isAllowed === null || isAllowed === void 0 ? void 0 : isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.ARCHIVE_OR_UNARCHIVE),
            isAllowed === null || isAllowed === void 0 ? void 0 : isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.DESCRIPTION),
            isAllowed === null || isAllowed === void 0 ? void 0 : isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.TYPE),
            isAllowed === null || isAllowed === void 0 ? void 0 : isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.READ_ONLY),
            isAllowed === null || isAllowed === void 0 ? void 0 : isAllowed(room, IRoomTypeConfig_1.RoomSettingsEnum.REACT_WHEN_READ_ONLY),
        ];
    }, [room]);
    return {
        canViewName,
        canViewTopic,
        canViewAnnouncement,
        canViewArchived,
        canViewDescription,
        canViewType,
        canViewReadOnly,
        canViewReactWhenReadOnly,
    };
};
exports.useEditAdminRoomPermissions = useEditAdminRoomPermissions;
