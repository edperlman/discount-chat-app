"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixEventRoomJoinRulesChanged = void 0;
const AbstractMatrixEvent_1 = require("../AbstractMatrixEvent");
const MatrixEventType_1 = require("../MatrixEventType");
class MatrixEventRoomJoinRulesChanged extends AbstractMatrixEvent_1.AbstractMatrixEvent {
    constructor() {
        super(...arguments);
        this.type = MatrixEventType_1.MatrixEventType.ROOM_JOIN_RULES_CHANGED;
    }
}
exports.MatrixEventRoomJoinRulesChanged = MatrixEventRoomJoinRulesChanged;
