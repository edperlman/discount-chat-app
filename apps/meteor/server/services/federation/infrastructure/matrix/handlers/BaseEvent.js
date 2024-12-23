"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixBaseEventHandler = void 0;
class MatrixBaseEventHandler {
    equals(event) {
        return this.eventType === event.type;
    }
}
exports.MatrixBaseEventHandler = MatrixBaseEventHandler;
