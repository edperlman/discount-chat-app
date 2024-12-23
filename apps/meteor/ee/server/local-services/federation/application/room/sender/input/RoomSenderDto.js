"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationSetupRoomDto = exports.FederationOnUsersAddedToARoomDto = exports.FederationBeforeAddUserToARoomDto = exports.FederationBeforeDirectMessageRoomCreationDto = exports.FederationCreateDirectMessageDto = exports.FederationOnDirectMessageRoomCreationDto = exports.FederationOnRoomCreationDto = exports.FederationRoomInviteUserDto = void 0;
class FederationInviterDto {
    constructor({ internalInviterId }) {
        this.internalInviterId = internalInviterId;
    }
}
class FederationRoomInviteUserDto extends FederationInviterDto {
    constructor({ internalInviterId, internalRoomId, inviteeUsernameOnly, normalizedInviteeId, rawInviteeId }) {
        super({ internalInviterId });
        this.internalRoomId = internalRoomId;
        this.inviteeUsernameOnly = inviteeUsernameOnly;
        this.normalizedInviteeId = normalizedInviteeId;
        this.rawInviteeId = rawInviteeId;
    }
}
exports.FederationRoomInviteUserDto = FederationRoomInviteUserDto;
class FederationOnRoomCreationDto extends FederationInviterDto {
    constructor({ internalInviterId, internalRoomId, invitees }) {
        super({ internalInviterId });
        this.internalRoomId = internalRoomId;
        this.invitees = invitees;
    }
}
exports.FederationOnRoomCreationDto = FederationOnRoomCreationDto;
class FederationOnDirectMessageRoomCreationDto extends FederationInviterDto {
    constructor({ internalInviterId, internalRoomId, invitees, inviteComesFromAnExternalHomeServer }) {
        super({ internalInviterId });
        this.internalRoomId = internalRoomId;
        this.invitees = invitees;
        this.inviteComesFromAnExternalHomeServer = inviteComesFromAnExternalHomeServer;
    }
}
exports.FederationOnDirectMessageRoomCreationDto = FederationOnDirectMessageRoomCreationDto;
class FederationCreateDirectMessageDto extends FederationInviterDto {
    constructor({ internalInviterId, invitees }) {
        super({ internalInviterId });
        this.invitees = invitees;
    }
}
exports.FederationCreateDirectMessageDto = FederationCreateDirectMessageDto;
class FederationBeforeDirectMessageRoomCreationDto {
    constructor({ invitees }) {
        this.invitees = invitees;
    }
}
exports.FederationBeforeDirectMessageRoomCreationDto = FederationBeforeDirectMessageRoomCreationDto;
class FederationBeforeAddUserToARoomDto extends FederationBeforeDirectMessageRoomCreationDto {
    constructor({ invitees, internalRoomId, internalInviter }) {
        super({ invitees });
        this.internalRoomId = internalRoomId;
        this.internalInviter = internalInviter;
    }
}
exports.FederationBeforeAddUserToARoomDto = FederationBeforeAddUserToARoomDto;
class FederationOnUsersAddedToARoomDto extends FederationOnRoomCreationDto {
    constructor({ internalInviterId, internalRoomId, invitees, inviteComesFromAnExternalHomeServer }) {
        super({ internalInviterId, internalRoomId, invitees });
        this.inviteComesFromAnExternalHomeServer = inviteComesFromAnExternalHomeServer;
    }
}
exports.FederationOnUsersAddedToARoomDto = FederationOnUsersAddedToARoomDto;
class FederationSetupRoomDto extends FederationInviterDto {
    constructor({ internalInviterId, internalRoomId }) {
        super({ internalInviterId });
        this.internalRoomId = internalRoomId;
    }
}
exports.FederationSetupRoomDto = FederationSetupRoomDto;
