"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiTextContext = exports.RoomMemberActions = exports.RoomSettingsEnum = void 0;
exports.RoomSettingsEnum = {
    TYPE: 'type',
    NAME: 'roomName',
    TOPIC: 'roomTopic',
    ANNOUNCEMENT: 'roomAnnouncement',
    DESCRIPTION: 'roomDescription',
    READ_ONLY: 'readOnly',
    REACT_WHEN_READ_ONLY: 'reactWhenReadOnly',
    ARCHIVE_OR_UNARCHIVE: 'archiveOrUnarchive',
    JOIN_CODE: 'joinCode',
    BROADCAST: 'broadcast',
    SYSTEM_MESSAGES: 'systemMessages',
    E2E: 'encrypted',
};
exports.RoomMemberActions = {
    ARCHIVE: 'archive',
    IGNORE: 'ignore',
    BLOCK: 'block',
    MUTE: 'mute',
    SET_AS_OWNER: 'setAsOwner',
    SET_AS_LEADER: 'setAsLeader',
    SET_AS_MODERATOR: 'setAsModerator',
    LEAVE: 'leave',
    REMOVE_USER: 'removeUser',
    JOIN: 'join',
    INVITE: 'invite',
};
exports.UiTextContext = {
    HIDE_WARNING: 'hideWarning',
    LEAVE_WARNING: 'leaveWarning',
};
