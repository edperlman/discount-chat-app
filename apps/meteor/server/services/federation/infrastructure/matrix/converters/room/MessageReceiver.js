"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixMessageReceiverConverter = exports.convertEmojisFromRCFormatToMatrixFormat = void 0;
const emojione_1 = __importDefault(require("emojione"));
const RoomReceiver_1 = require("./RoomReceiver");
const MessageReceiverDto_1 = require("../../../../application/room/input/MessageReceiverDto");
const convertEmojisMatrixFormatToRCFormat = (emoji) => emojione_1.default.toShort(emoji);
const convertEmojisFromRCFormatToMatrixFormat = (emoji) => emojione_1.default.shortnameToUnicode(emoji);
exports.convertEmojisFromRCFormatToMatrixFormat = convertEmojisFromRCFormatToMatrixFormat;
class MatrixMessageReceiverConverter {
    static toMessageReactionDto(externalEvent) {
        return new MessageReceiverDto_1.FederationMessageReactionEventDto({
            externalEventId: externalEvent.event_id,
            externalRoomId: externalEvent.room_id,
            normalizedRoomId: (0, RoomReceiver_1.convertExternalRoomIdToInternalRoomIdFormat)(externalEvent.room_id),
            externalSenderId: externalEvent.sender,
            emoji: convertEmojisMatrixFormatToRCFormat(externalEvent.content['m.relates_to'].key),
            externalReactedEventId: externalEvent.content['m.relates_to'].event_id,
        });
    }
}
exports.MatrixMessageReceiverConverter = MatrixMessageReceiverConverter;
