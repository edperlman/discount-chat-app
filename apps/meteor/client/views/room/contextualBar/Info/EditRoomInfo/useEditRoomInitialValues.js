"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEditRoomInitialValues = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const convertTimeUnit_1 = require("../../../../../lib/convertTimeUnit");
const roomCoordinator_1 = require("../../../../../lib/rooms/roomCoordinator");
const useRetentionPolicy_1 = require("../../../hooks/useRetentionPolicy");
const useEditRoomInitialValues = (room) => {
    const retentionPolicy = (0, useRetentionPolicy_1.useRetentionPolicy)(room);
    const canEditRoomRetentionPolicy = (0, ui_contexts_1.usePermission)('edit-room-retention-policy', room._id);
    const { t, ro, archived, topic, description, announcement, joinCodeRequired, sysMes, encrypted, retention, reactWhenReadOnly, sidepanel, } = room;
    return (0, react_1.useMemo)(() => {
        var _a, _b, _c, _d, _e;
        return (Object.assign(Object.assign({ roomName: t === 'd' && room.usernames ? room.usernames.join(' x ') : roomCoordinator_1.roomCoordinator.getRoomName(t, room), roomType: t, readOnly: !!ro, reactWhenReadOnly, archived: !!archived, roomTopic: topic !== null && topic !== void 0 ? topic : '', roomDescription: description !== null && description !== void 0 ? description : '', roomAnnouncement: announcement !== null && announcement !== void 0 ? announcement : '', roomAvatar: undefined, joinCode: '', joinCodeRequired: !!joinCodeRequired, systemMessages: Array.isArray(sysMes) ? sysMes : [], hideSysMes: Array.isArray(sysMes) ? !!(sysMes === null || sysMes === void 0 ? void 0 : sysMes.length) : !!sysMes, encrypted }, (canEditRoomRetentionPolicy &&
            (retentionPolicy === null || retentionPolicy === void 0 ? void 0 : retentionPolicy.enabled) && {
            retentionEnabled: (_a = retention === null || retention === void 0 ? void 0 : retention.enabled) !== null && _a !== void 0 ? _a : retentionPolicy.isActive,
            retentionOverrideGlobal: !!(retention === null || retention === void 0 ? void 0 : retention.overrideGlobal),
            retentionMaxAge: (_b = retention === null || retention === void 0 ? void 0 : retention.maxAge) !== null && _b !== void 0 ? _b : (0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.days, retentionPolicy.maxAge),
            retentionExcludePinned: (_c = retention === null || retention === void 0 ? void 0 : retention.excludePinned) !== null && _c !== void 0 ? _c : retentionPolicy.excludePinned,
            retentionFilesOnly: (_d = retention === null || retention === void 0 ? void 0 : retention.filesOnly) !== null && _d !== void 0 ? _d : retentionPolicy.filesOnly,
            retentionIgnoreThreads: (_e = retention === null || retention === void 0 ? void 0 : retention.ignoreThreads) !== null && _e !== void 0 ? _e : retentionPolicy.ignoreThreads,
        })), { showDiscussions: sidepanel === null || sidepanel === void 0 ? void 0 : sidepanel.items.includes('discussions'), showChannels: sidepanel === null || sidepanel === void 0 ? void 0 : sidepanel.items.includes('channels') }));
    }, [
        announcement,
        archived,
        description,
        joinCodeRequired,
        retention,
        retentionPolicy,
        ro,
        room,
        sysMes,
        t,
        topic,
        encrypted,
        reactWhenReadOnly,
        canEditRoomRetentionPolicy,
        sidepanel,
    ]);
};
exports.useEditRoomInitialValues = useEditRoomInitialValues;
