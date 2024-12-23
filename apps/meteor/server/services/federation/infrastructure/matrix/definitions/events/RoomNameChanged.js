"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixEventRoomNameChanged = void 0;
const AbstractMatrixEvent_1 = require("../AbstractMatrixEvent");
const MatrixEventType_1 = require("../MatrixEventType");
class MatrixEventRoomNameChanged extends AbstractMatrixEvent_1.AbstractMatrixEvent {
    constructor() {
        super(...arguments);
        this.type = MatrixEventType_1.MatrixEventType.ROOM_NAME_CHANGED;
    }
}
exports.MatrixEventRoomNameChanged = MatrixEventRoomNameChanged;
