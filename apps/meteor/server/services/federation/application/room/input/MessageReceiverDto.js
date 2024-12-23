"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationMessageReactionEventDto = void 0;
const RoomReceiverDto_1 = require("./RoomReceiverDto");
class FederationMessageReactionEventDto extends RoomReceiverDto_1.FederationBaseRoomInputDto {
    constructor({ externalRoomId, normalizedRoomId, externalEventId, externalReactedEventId, emoji, externalSenderId, }) {
        super({ externalRoomId, normalizedRoomId, externalEventId });
        this.emoji = emoji;
        this.externalSenderId = externalSenderId;
        this.externalReactedEventId = externalReactedEventId;
    }
}
exports.FederationMessageReactionEventDto = FederationMessageReactionEventDto;
