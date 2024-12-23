"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationJoinInternalPublicRoomInputDto = exports.FederationJoinExternalPublicRoomInputDto = exports.FederationSearchPublicRoomsInputDto = exports.isAValidExternalRoomIdFormat = void 0;
class FederationPagination {
    constructor({ count, pageToken }) {
        this.count = count;
        this.pageToken = pageToken;
    }
}
const isAValidExternalRoomIdFormat = (externalRoomId) => Boolean(externalRoomId && externalRoomId.charAt(0) === '!' && externalRoomId.includes(':'));
exports.isAValidExternalRoomIdFormat = isAValidExternalRoomIdFormat;
class FederationSearchPublicRoomsInputDto extends FederationPagination {
    constructor({ serverName, roomName, count, pageToken }) {
        super({ count, pageToken });
        this.serverName = serverName;
        this.roomName = roomName;
    }
}
exports.FederationSearchPublicRoomsInputDto = FederationSearchPublicRoomsInputDto;
class FederationJoinExternalPublicRoomInputDto {
    constructor({ externalRoomId, internalUserId, normalizedRoomId, externalRoomHomeServerName, roomName, pageToken, }) {
        this.validateExternalRoomId(externalRoomId);
        this.externalRoomId = externalRoomId;
        this.internalUserId = internalUserId;
        this.normalizedRoomId = normalizedRoomId;
        this.externalRoomHomeServerName = externalRoomHomeServerName;
        this.roomName = roomName;
        this.pageToken = pageToken;
    }
    validateExternalRoomId(externalRoomId) {
        if (!(0, exports.isAValidExternalRoomIdFormat)(externalRoomId)) {
            throw new Error('Invalid external room id format');
        }
    }
}
exports.FederationJoinExternalPublicRoomInputDto = FederationJoinExternalPublicRoomInputDto;
class FederationJoinInternalPublicRoomInputDto {
    constructor({ internalRoomId, internalUserId }) {
        this.internalRoomId = internalRoomId;
        this.internalUserId = internalUserId;
    }
}
exports.FederationJoinInternalPublicRoomInputDto = FederationJoinInternalPublicRoomInputDto;
