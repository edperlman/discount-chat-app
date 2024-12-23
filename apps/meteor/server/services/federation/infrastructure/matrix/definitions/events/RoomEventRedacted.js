"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixEventRoomRedacted = void 0;
const AbstractMatrixEvent_1 = require("../AbstractMatrixEvent");
const MatrixEventType_1 = require("../MatrixEventType");
class MatrixEventRoomRedacted extends AbstractMatrixEvent_1.AbstractMatrixEvent {
    constructor() {
        super(...arguments);
        this.type = MatrixEventType_1.MatrixEventType.ROOM_EVENT_REDACTED;
    }
}
exports.MatrixEventRoomRedacted = MatrixEventRoomRedacted;
