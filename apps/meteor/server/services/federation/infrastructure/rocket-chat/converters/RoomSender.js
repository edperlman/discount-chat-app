"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationRoomSenderConverter = void 0;
const RoomSenderDto_1 = require("../../../application/room/input/RoomSenderDto");
const RoomReceiver_1 = require("../../matrix/converters/room/RoomReceiver");
class FederationRoomSenderConverter {
    static toCreateDirectMessageRoomDto(internalInviterId, internalRoomId, externalInviteeId) {
        const normalizedInviteeId = (0, RoomReceiver_1.removeExternalSpecificCharsFromExternalIdentifier)(externalInviteeId);
        const inviteeUsernameOnly = (0, RoomReceiver_1.formatExternalUserIdToInternalUsernameFormat)(externalInviteeId);
        return new RoomSenderDto_1.FederationCreateDMAndInviteUserDto({
            internalInviterId,
            internalRoomId,
            rawInviteeId: externalInviteeId,
            normalizedInviteeId,
            inviteeUsernameOnly,
        });
    }
    static toSendExternalMessageDto(internalSenderId, internalRoomId, message) {
        return new RoomSenderDto_1.FederationRoomSendExternalMessageDto({
            internalRoomId,
            internalSenderId,
            message,
            isThreadedMessage: Boolean(message.tmid),
        });
    }
    static toAfterUserLeaveRoom(internalUserId, internalRoomId) {
        return new RoomSenderDto_1.FederationAfterLeaveRoomDto({
            internalRoomId,
            internalUserId,
        });
    }
    static toOnUserRemovedFromRoom(internalUserId, internalRoomId, actionDoneByInternalId) {
        return new RoomSenderDto_1.FederationAfterRemoveUserFromRoomDto({
            internalRoomId,
            internalUserId,
            actionDoneByInternalId,
        });
    }
}
exports.FederationRoomSenderConverter = FederationRoomSenderConverter;
