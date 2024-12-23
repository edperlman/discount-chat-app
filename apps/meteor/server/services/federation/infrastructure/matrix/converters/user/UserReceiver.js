"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixUserReceiverConverter = void 0;
const UserReceiverDto_1 = require("../../../../application/room/input/UserReceiverDto");
const RoomReceiver_1 = require("../room/RoomReceiver");
class MatrixUserReceiverConverter {
    static toUserTypingDto(externalEvent) {
        return new UserReceiverDto_1.FederationUserTypingStatusEventDto({
            externalEventId: '',
            externalRoomId: externalEvent.room_id,
            externalUserIdsTyping: externalEvent.content.user_ids,
            normalizedRoomId: (0, RoomReceiver_1.convertExternalRoomIdToInternalRoomIdFormat)(externalEvent.room_id),
        });
    }
}
exports.MatrixUserReceiverConverter = MatrixUserReceiverConverter;
