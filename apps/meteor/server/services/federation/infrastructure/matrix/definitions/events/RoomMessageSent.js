"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixEventRoomMessageSent = exports.MatrixEnumRelatesToRelType = exports.MatrixEnumSendMessageType = void 0;
const AbstractMatrixEvent_1 = require("../AbstractMatrixEvent");
const MatrixEventType_1 = require("../MatrixEventType");
var MatrixEnumSendMessageType;
(function (MatrixEnumSendMessageType) {
    MatrixEnumSendMessageType["TEXT"] = "m.text";
    MatrixEnumSendMessageType["EMOTE"] = "m.emote";
    MatrixEnumSendMessageType["NOTICE"] = "m.notice";
    MatrixEnumSendMessageType["IMAGE"] = "m.image";
    MatrixEnumSendMessageType["FILE"] = "m.file";
    MatrixEnumSendMessageType["AUDIO"] = "m.audio";
    MatrixEnumSendMessageType["LOCATION"] = "m.location";
    MatrixEnumSendMessageType["VIDEO"] = "m.video";
})(MatrixEnumSendMessageType || (exports.MatrixEnumSendMessageType = MatrixEnumSendMessageType = {}));
var MatrixEnumRelatesToRelType;
(function (MatrixEnumRelatesToRelType) {
    MatrixEnumRelatesToRelType["REPLACE"] = "m.replace";
})(MatrixEnumRelatesToRelType || (exports.MatrixEnumRelatesToRelType = MatrixEnumRelatesToRelType = {}));
class MatrixEventRoomMessageSent extends AbstractMatrixEvent_1.AbstractMatrixEvent {
    constructor() {
        super(...arguments);
        this.type = MatrixEventType_1.MatrixEventType.ROOM_MESSAGE_SENT;
    }
}
exports.MatrixEventRoomMessageSent = MatrixEventRoomMessageSent;
