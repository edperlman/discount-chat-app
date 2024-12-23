"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationAfterRemoveUserFromRoomDto = exports.FederationAfterLeaveRoomDto = exports.FederationRoomSendExternalMessageDto = exports.FederationCreateDMAndInviteUserDto = void 0;
class FederationSenderBaseRoomInputDto {
    constructor({ internalRoomId }) {
        this.internalRoomId = internalRoomId;
    }
}
class FederationCreateDMAndInviteUserDto extends FederationSenderBaseRoomInputDto {
    constructor({ internalRoomId, internalInviterId, rawInviteeId, normalizedInviteeId, inviteeUsernameOnly, }) {
        super({ internalRoomId });
        this.internalInviterId = internalInviterId;
        this.rawInviteeId = rawInviteeId;
        this.normalizedInviteeId = normalizedInviteeId;
        this.inviteeUsernameOnly = inviteeUsernameOnly;
    }
}
exports.FederationCreateDMAndInviteUserDto = FederationCreateDMAndInviteUserDto;
class FederationRoomSendExternalMessageDto extends FederationSenderBaseRoomInputDto {
    constructor({ internalRoomId, internalSenderId, message, isThreadedMessage }) {
        super({ internalRoomId });
        this.internalSenderId = internalSenderId;
        this.message = message;
        this.isThreadedMessage = isThreadedMessage;
    }
}
exports.FederationRoomSendExternalMessageDto = FederationRoomSendExternalMessageDto;
class FederationAfterLeaveRoomDto extends FederationSenderBaseRoomInputDto {
    constructor({ internalRoomId, internalUserId }) {
        super({ internalRoomId });
        this.internalUserId = internalUserId;
    }
}
exports.FederationAfterLeaveRoomDto = FederationAfterLeaveRoomDto;
class FederationAfterRemoveUserFromRoomDto extends FederationSenderBaseRoomInputDto {
    constructor({ internalRoomId, internalUserId, actionDoneByInternalId }) {
        super({ internalRoomId });
        this.internalUserId = internalUserId;
        this.actionDoneByInternalId = actionDoneByInternalId;
    }
}
exports.FederationAfterRemoveUserFromRoomDto = FederationAfterRemoveUserFromRoomDto;
