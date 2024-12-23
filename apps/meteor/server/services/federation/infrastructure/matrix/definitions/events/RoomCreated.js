"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixEventRoomCreated = void 0;
const AbstractMatrixEvent_1 = require("../AbstractMatrixEvent");
const MatrixEventType_1 = require("../MatrixEventType");
class MatrixEventRoomCreated extends AbstractMatrixEvent_1.AbstractMatrixEvent {
    constructor() {
        super(...arguments);
        this.type = MatrixEventType_1.MatrixEventType.ROOM_CREATED;
    }
}
exports.MatrixEventRoomCreated = MatrixEventRoomCreated;
