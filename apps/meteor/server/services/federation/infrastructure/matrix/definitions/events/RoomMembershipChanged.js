"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixEventRoomMembershipChanged = exports.RoomMembershipChangedEventType = void 0;
const AbstractMatrixEvent_1 = require("../AbstractMatrixEvent");
const MatrixEventType_1 = require("../MatrixEventType");
var RoomMembershipChangedEventType;
(function (RoomMembershipChangedEventType) {
    RoomMembershipChangedEventType["JOIN"] = "join";
    RoomMembershipChangedEventType["INVITE"] = "invite";
    RoomMembershipChangedEventType["LEAVE"] = "leave";
})(RoomMembershipChangedEventType || (exports.RoomMembershipChangedEventType = RoomMembershipChangedEventType = {}));
class MatrixEventRoomMembershipChanged extends AbstractMatrixEvent_1.AbstractMatrixEvent {
    constructor() {
        super(...arguments);
        this.type = MatrixEventType_1.MatrixEventType.ROOM_MEMBERSHIP_CHANGED;
    }
}
exports.MatrixEventRoomMembershipChanged = MatrixEventRoomMembershipChanged;
