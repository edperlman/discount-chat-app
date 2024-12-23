"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixEventType = void 0;
var MatrixEventType;
(function (MatrixEventType) {
    MatrixEventType["ROOM_CREATED"] = "m.room.create";
    MatrixEventType["ROOM_MEMBERSHIP_CHANGED"] = "m.room.member";
    MatrixEventType["ROOM_MESSAGE_SENT"] = "m.room.message";
    MatrixEventType["ROOM_JOIN_RULES_CHANGED"] = "m.room.join_rules";
    MatrixEventType["ROOM_NAME_CHANGED"] = "m.room.name";
    MatrixEventType["ROOM_POWER_LEVELS_CHANGED"] = "m.room.power_levels";
    MatrixEventType["ROOM_TOPIC_CHANGED"] = "m.room.topic";
    MatrixEventType["ROOM_EVENT_REDACTED"] = "m.room.redaction";
    MatrixEventType["MESSAGE_REACTED"] = "m.reaction";
    MatrixEventType["MESSAGE_ON_THREAD"] = "m.thread";
    MatrixEventType["USER_TYPING_STATUS_CHANGED"] = "m.typing";
})(MatrixEventType || (exports.MatrixEventType = MatrixEventType = {}));
