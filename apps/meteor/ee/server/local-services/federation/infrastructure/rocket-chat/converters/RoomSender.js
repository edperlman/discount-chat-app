"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationRoomSenderConverterEE = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const RoomReceiver_1 = require("../../../../../../../server/services/federation/infrastructure/matrix/converters/room/RoomReceiver");
const RoomInputDto_1 = require("../../../application/room/sender/input/RoomInputDto");
const RoomSenderDto_1 = require("../../../application/room/sender/input/RoomSenderDto");
const ensureUserHasAHomeServer = (username, localHomeServer) => {
    return (username === null || username === void 0 ? void 0 : username.includes(':')) ? username : `${username}:${localHomeServer}`;
};
const isAnExistentUser = (invitee) => typeof invitee !== 'string';
const normalizeInvitees = (externalInviteesUsername, homeServerDomainName) => {
    return externalInviteesUsername
        .filter(Boolean)
        .map((inviteeUsername) => ensureUserHasAHomeServer(inviteeUsername, homeServerDomainName))
        .map((inviteeUsername) => ({
        normalizedInviteeId: (0, RoomReceiver_1.removeExternalSpecificCharsFromExternalIdentifier)(inviteeUsername),
        inviteeUsernameOnly: (0, RoomReceiver_1.formatExternalUserIdToInternalUsernameFormat)(inviteeUsername),
        rawInviteeId: `@${(0, RoomReceiver_1.removeExternalSpecificCharsFromExternalIdentifier)(inviteeUsername)}`,
    }));
};
const getInviteesUsername = (externalInvitees) => {
    return externalInvitees
        .map((invitee) => {
        return isAnExistentUser(invitee) ? (invitee === null || invitee === void 0 ? void 0 : invitee.username) || '' : invitee;
    })
        .filter(Boolean);
};
const getExternalUsersToBeInvited = (invitees) => {
    const externalAndNonExistentInviteesUsername = invitees.filter((invitee) => !isAnExistentUser(invitee));
    const externalExistentUsers = invitees
        .filter(isAnExistentUser)
        .filter((invitee) => (0, core_typings_1.isUserFederated)(invitee) || (0, RoomReceiver_1.isAnExternalIdentifierFormat)(invitee.username || ''));
    return [...externalAndNonExistentInviteesUsername, ...externalExistentUsers];
};
const getInternalUsernames = (invitees) => {
    return invitees
        .filter(isAnExistentUser)
        .map((invitee) => invitee.username || '')
        .filter(Boolean);
};
const getAllUsersExceptOwnerByUserId = (invitees, ownerId) => invitees.filter(Boolean).filter((invitee) => {
    return isAnExistentUser(invitee) ? invitee._id !== ownerId : invitee;
});
const getAllUsersExceptOwnerByUsername = (invitees, ownerUsername) => invitees.filter(Boolean).filter((inviteeUsername) => inviteeUsername !== ownerUsername);
class FederationRoomSenderConverterEE {
    static toRoomInviteUserDto(internalInviterId, internalRoomId, externalInviteeId) {
        const normalizedInviteeId = (0, RoomReceiver_1.removeExternalSpecificCharsFromExternalIdentifier)(externalInviteeId);
        const inviteeUsernameOnly = (0, RoomReceiver_1.formatExternalUserIdToInternalUsernameFormat)(externalInviteeId);
        return new RoomSenderDto_1.FederationRoomInviteUserDto({
            internalInviterId,
            internalRoomId,
            rawInviteeId: externalInviteeId,
            normalizedInviteeId,
            inviteeUsernameOnly,
        });
    }
    static toSetupRoomDto(internalInviterId, internalRoomId) {
        return new RoomSenderDto_1.FederationSetupRoomDto({
            internalInviterId,
            internalRoomId,
        });
    }
    static toOnRoomCreationDto(internalInviterId, internalInviterUsername, internalRoomId, externalInviteesUsername, homeServerDomainName) {
        const allExceptOwner = getAllUsersExceptOwnerByUsername(externalInviteesUsername, internalInviterUsername);
        const users = normalizeInvitees(allExceptOwner, homeServerDomainName);
        return new RoomSenderDto_1.FederationOnRoomCreationDto({
            internalInviterId,
            internalRoomId,
            invitees: users,
        });
    }
    static toOnAddedUsersToARoomDto(internalInviterId, internalInviterUsername, internalRoomId, externalInvitees, homeServerDomainName) {
        const externalInviteesUsername = getInviteesUsername(externalInvitees);
        const externalInviterId = (0, RoomReceiver_1.isAnExternalIdentifierFormat)(internalInviterUsername) &&
            (0, RoomReceiver_1.extractServerNameFromExternalIdentifier)(internalInviterUsername) !== homeServerDomainName &&
            internalInviterId;
        const allExceptOwner = getAllUsersExceptOwnerByUsername(externalInviteesUsername, internalInviterUsername);
        const users = normalizeInvitees(allExceptOwner, homeServerDomainName);
        return new RoomSenderDto_1.FederationOnUsersAddedToARoomDto({
            internalInviterId,
            internalRoomId,
            invitees: users,
            inviteComesFromAnExternalHomeServer: Boolean(externalInviterId),
        });
    }
    static toOnDirectMessageCreatedDto(internalInviterId, internalRoomId, externalInvitees, homeServerDomainName) {
        const allExceptOwner = getAllUsersExceptOwnerByUserId(externalInvitees, internalInviterId);
        const externalUsernamesToBeInvited = getInviteesUsername(getExternalUsersToBeInvited(allExceptOwner));
        const internalUsernamesToBeInvited = getInternalUsernames(allExceptOwner).filter((internal) => !externalUsernamesToBeInvited.includes(internal));
        const allUsernamesToBeInvited = [...externalUsernamesToBeInvited, ...internalUsernamesToBeInvited];
        const externalInviterId = (0, RoomReceiver_1.isAnExternalUserIdFormat)(internalInviterId) && internalInviterId;
        return new RoomSenderDto_1.FederationOnDirectMessageRoomCreationDto({
            internalInviterId,
            internalRoomId,
            invitees: normalizeInvitees(allUsernamesToBeInvited, homeServerDomainName),
            inviteComesFromAnExternalHomeServer: Boolean(externalInviterId),
        });
    }
    static toBeforeDirectMessageCreatedDto(members, homeServerDomainName) {
        const invitees = getExternalUsersToBeInvited(members);
        const inviteesUsername = getInviteesUsername(invitees);
        return new RoomSenderDto_1.FederationBeforeDirectMessageRoomCreationDto({
            invitees: normalizeInvitees(inviteesUsername, homeServerDomainName),
        });
    }
    static toBeforeAddUserToARoomDto(members, internalRoom, homeServerDomainName, internalInviter) {
        const { invitees } = FederationRoomSenderConverterEE.toBeforeDirectMessageCreatedDto(members, homeServerDomainName);
        return new RoomSenderDto_1.FederationBeforeAddUserToARoomDto({
            internalRoomId: internalRoom._id,
            invitees,
            internalInviter,
        });
    }
    static toCreateDirectMessageDto(internalInviterId, invitees) {
        return new RoomSenderDto_1.FederationCreateDirectMessageDto({
            internalInviterId,
            invitees,
        });
    }
    static toJoinExternalPublicRoomDto(internalUserId, externalRoomId, roomName, pageToken) {
        return new RoomInputDto_1.FederationJoinExternalPublicRoomInputDto({
            externalRoomId,
            internalUserId,
            normalizedRoomId: (0, RoomReceiver_1.convertExternalRoomIdToInternalRoomIdFormat)(externalRoomId),
            externalRoomHomeServerName: (0, RoomReceiver_1.extractServerNameFromExternalIdentifier)(externalRoomId),
            roomName,
            pageToken,
        });
    }
    static toJoinInternalPublicRoomDto(internalUserId, internalRoomId) {
        return new RoomInputDto_1.FederationJoinInternalPublicRoomInputDto({
            internalRoomId,
            internalUserId,
        });
    }
}
exports.FederationRoomSenderConverterEE = FederationRoomSenderConverterEE;
