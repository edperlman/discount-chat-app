"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixEventUserTypingStatusChanged = void 0;
const AbstractMatrixEvent_1 = require("../AbstractMatrixEvent");
const MatrixEventType_1 = require("../MatrixEventType");
class MatrixEventUserTypingStatusChanged extends AbstractMatrixEvent_1.AbstractMatrixEvent {
    constructor() {
        super(...arguments);
        this.type = MatrixEventType_1.MatrixEventType.USER_TYPING_STATUS_CHANGED;
    }
}
exports.MatrixEventUserTypingStatusChanged = MatrixEventUserTypingStatusChanged;
