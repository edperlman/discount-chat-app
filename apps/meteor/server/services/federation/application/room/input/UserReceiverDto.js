"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationUserTypingStatusEventDto = void 0;
const RoomReceiverDto_1 = require("./RoomReceiverDto");
class FederationUserTypingStatusEventDto extends RoomReceiverDto_1.FederationBaseRoomInputDto {
    constructor({ externalRoomId, normalizedRoomId, externalUserIdsTyping }) {
        super({ externalRoomId, normalizedRoomId, externalEventId: '' });
        this.externalRoomId = externalRoomId;
        this.normalizedRoomId = normalizedRoomId;
        this.externalUserIdsTyping = externalUserIdsTyping;
    }
}
exports.FederationUserTypingStatusEventDto = FederationUserTypingStatusEventDto;
