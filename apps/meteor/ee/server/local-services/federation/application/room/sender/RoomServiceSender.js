"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationRoomServiceSender = void 0;
const MatrixRoomJoinRules_1 = require("../../../../../../../server/services/federation/infrastructure/matrix/definitions/MatrixRoomJoinRules");
const FederatedRoomInternalRoles_1 = require("../../../../../../../server/services/federation/infrastructure/rocket-chat/definitions/FederatedRoomInternalRoles");
const FederatedUser_1 = require("../../../domain/FederatedUser");
const AbstractFederationApplicationServiceEE_1 = require("../../AbstractFederationApplicationServiceEE");
class FederationRoomServiceSender extends AbstractFederationApplicationServiceEE_1.AbstractFederationApplicationServiceEE {
    constructor(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalSettingsAdapter, internalMessageAdapter, internalNotificationAdapter, internalQueueAdapter, bridge) {
        super(bridge, internalUserAdapter, internalFileAdapter, internalSettingsAdapter);
        this.internalRoomAdapter = internalRoomAdapter;
        this.internalUserAdapter = internalUserAdapter;
        this.internalFileAdapter = internalFileAdapter;
        this.internalSettingsAdapter = internalSettingsAdapter;
        this.internalMessageAdapter = internalMessageAdapter;
        this.internalNotificationAdapter = internalNotificationAdapter;
        this.internalQueueAdapter = internalQueueAdapter;
        this.bridge = bridge;
    }
    onRoomCreated(roomOnCreationInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { internalInviterId, internalRoomId, invitees } = roomOnCreationInput;
            yield this.setupFederatedRoom({ internalInviterId, internalRoomId });
            if (invitees.length === 0) {
                return;
            }
            yield this.inviteLocalThenExternalUsers(invitees, internalInviterId, internalRoomId);
        });
    }
    beforeAddUserToARoom(dmBeforeAddUserToARoomInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { invitees = [], internalInviter, internalRoomId } = dmBeforeAddUserToARoomInput;
            if (invitees.length === 0) {
                return;
            }
            if (internalInviter) {
                const federatedUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalInviter._id);
                if (!federatedUser) {
                    return;
                }
                const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoomId);
                if (!federatedRoom) {
                    return;
                }
                const userRolesInThisRoom = yield this.internalRoomAdapter.getInternalRoomRolesByUserId(federatedRoom.getInternalId(), federatedUser.getInternalId());
                const canAddUserToARoom = userRolesInThisRoom.includes(FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.OWNER) ||
                    userRolesInThisRoom.includes(FederatedRoomInternalRoles_1.ROCKET_CHAT_FEDERATION_ROLES.MODERATOR) ||
                    federatedRoom.isTheCreator(federatedUser.getInternalId());
                if (!canAddUserToARoom) {
                    throw new Error('You are not allowed to add users to this room');
                }
            }
            yield this.createUsersLocallyOnly(invitees);
        });
    }
    inviteLocalThenExternalUsers(invitees, internalInviterId, internalRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const localUsers = invitees.filter((user) => FederatedUser_1.FederatedUserEE.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(user.rawInviteeId), this.internalHomeServerDomain));
            const externalUsers = invitees.filter((user) => !FederatedUser_1.FederatedUserEE.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(user.rawInviteeId), this.internalHomeServerDomain));
            try {
                for (var _d = true, _e = __asyncValues([...localUsers, ...externalUsers]), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const user = _c;
                    yield this.inviteUserToAFederatedRoom({
                        internalInviterId,
                        internalRoomId,
                        inviteeUsernameOnly: user.inviteeUsernameOnly,
                        normalizedInviteeId: user.normalizedInviteeId,
                        rawInviteeId: user.rawInviteeId,
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    onUsersAddedToARoom(roomOnUsersAddedToARoomInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { internalInviterId, internalRoomId, invitees, inviteComesFromAnExternalHomeServer } = roomOnUsersAddedToARoomInput;
            if (inviteComesFromAnExternalHomeServer) {
                return;
            }
            yield this.inviteLocalThenExternalUsers(invitees, internalInviterId, internalRoomId);
        });
    }
    searchPublicRooms(roomSearchInputDto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.internalSettingsAdapter.isFederationEnabled()) {
                throw new Error('Federation is disabled');
            }
            const { serverName, roomName, count, pageToken } = roomSearchInputDto;
            const rooms = yield this.bridge.searchPublicRooms({
                serverName: serverName || this.internalHomeServerDomain,
                roomName,
                limit: count,
                pageToken,
            });
            return RoomMapper.toSearchPublicRoomsDto(rooms, parseInt(this.internalSettingsAdapter.getMaximumSizeOfUsersWhenJoiningPublicRooms() || '0'), pageToken);
        });
    }
    scheduleJoinExternalPublicRoom(internalUserId, externalRoomId, roomName, pageToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.internalSettingsAdapter.isFederationEnabled()) {
                throw new Error('Federation is disabled');
            }
            yield this.internalQueueAdapter.enqueueJob('federation-enterprise.joinExternalPublicRoom', {
                internalUserId,
                externalRoomId,
                roomName,
                pageToken,
            });
        });
    }
    joinExternalPublicRoom(joinExternalPublicRoomInputDto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.internalSettingsAdapter.isFederationEnabled()) {
                throw new Error('Federation is disabled');
            }
            const { externalRoomId, internalUserId, externalRoomHomeServerName, roomName, pageToken } = joinExternalPublicRoomInputDto;
            const room = yield this.internalRoomAdapter.getFederatedRoomByExternalId(externalRoomId);
            if (room) {
                const alreadyJoined = yield this.internalRoomAdapter.isUserAlreadyJoined(room.getInternalId(), internalUserId);
                if (alreadyJoined) {
                    throw new Error('already-joined');
                }
            }
            const user = yield this.internalUserAdapter.getFederatedUserByInternalId(internalUserId);
            if (!user) {
                yield this.createFederatedUserIncludingHomeserverUsingLocalInformation(internalUserId);
            }
            const federatedUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalUserId);
            if (!federatedUser) {
                throw new Error(`User with internalId ${internalUserId} not found`);
            }
            if (!(yield this.isRoomSizeAllowed(externalRoomId, externalRoomHomeServerName, roomName, pageToken))) {
                throw new Error("Can't join a room bigger than the admin of your workspace has set as the maximum size");
            }
            yield this.bridge.joinRoom(externalRoomId, federatedUser.getExternalId(), [externalRoomHomeServerName]);
        });
    }
    isRoomSizeAllowed(externalRoomId, serverName, roomName, pageToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rooms = yield this.bridge.searchPublicRooms({
                    serverName,
                    limit: 50,
                    roomName,
                    pageToken,
                });
                const room = rooms.chunk.find((room) => room.room_id === externalRoomId);
                if (!room) {
                    throw new Error("Cannot find the room you're trying to join");
                }
                return room.num_joined_members <= parseInt(this.internalSettingsAdapter.getMaximumSizeOfUsersWhenJoiningPublicRooms() || '0');
            }
            catch (error) {
                throw new Error("Cannot find the room you're trying to join");
            }
        });
    }
    setupFederatedRoom(roomInviteUserInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { internalInviterId, internalRoomId } = roomInviteUserInput;
            const inviterUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalInviterId);
            if (!inviterUser) {
                yield this.createFederatedUserIncludingHomeserverUsingLocalInformation(internalInviterId);
            }
            const federatedInviterUser = inviterUser || (yield this.internalUserAdapter.getFederatedUserByInternalId(internalInviterId));
            if (!federatedInviterUser) {
                throw new Error(`User with internalId ${internalInviterId} not found`);
            }
            const internalFederatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoomId);
            if (internalFederatedRoom) {
                return;
            }
            const internalRoom = yield this.internalRoomAdapter.getInternalRoomById(internalRoomId);
            if (!internalRoom || !internalRoom.name) {
                throw new Error(`Room with internalId ${internalRoomId} not found`);
            }
            const roomName = internalRoom.fname || internalRoom.name;
            const externalRoomId = yield this.bridge.createRoom(federatedInviterUser.getExternalId(), internalRoom.t, roomName, internalRoom.topic);
            yield this.internalRoomAdapter.updateFederatedRoomByInternalRoomId(internalRoom._id, externalRoomId);
        });
    }
    inviteUserToAFederatedRoom(roomInviteUserInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { internalInviterId, internalRoomId, normalizedInviteeId, inviteeUsernameOnly, rawInviteeId } = roomInviteUserInput;
            const isUserAutoJoining = Boolean(!internalInviterId);
            const isInviteeFromTheSameHomeServer = FederatedUser_1.FederatedUserEE.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(rawInviteeId), this.internalHomeServerDomain);
            if (isUserAutoJoining && !isInviteeFromTheSameHomeServer) {
                return;
            }
            const federatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoomId);
            if (!federatedRoom) {
                throw new Error(`Could not find the room to invite. RoomId: ${internalRoomId}`);
            }
            const federatedInviterUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalInviterId);
            if (!federatedInviterUser && !isUserAutoJoining) {
                throw new Error(`User with internalId ${internalInviterId} not found`);
            }
            const username = isInviteeFromTheSameHomeServer ? inviteeUsernameOnly : normalizedInviteeId;
            const inviteeUser = yield this.internalUserAdapter.getFederatedUserByInternalUsername(username);
            if (!inviteeUser) {
                const existsOnlyOnProxyServer = isInviteeFromTheSameHomeServer;
                yield this.createFederatedUserInternallyOnly(rawInviteeId, username, existsOnlyOnProxyServer);
            }
            const federatedInviteeUser = inviteeUser || (yield this.internalUserAdapter.getFederatedUserByInternalUsername(username));
            if (!federatedInviteeUser) {
                throw new Error(`User with internalUsername ${username} not found`);
            }
            if (isInviteeFromTheSameHomeServer) {
                const profile = yield this.bridge.getUserProfileInformation(federatedInviteeUser.getExternalId());
                if (!profile) {
                    yield this.bridge.createUser(inviteeUsernameOnly, federatedInviteeUser.getName() || federatedInviteeUser.getUsername() || username, this.internalHomeServerDomain);
                }
            }
            if (!federatedInviterUser && isUserAutoJoining) {
                yield this.bridge.joinRoom(federatedRoom.getExternalId(), federatedInviteeUser.getExternalId());
                return;
            }
            if (!federatedInviterUser) {
                throw new Error(`User with internalId ${internalInviterId} not found`);
            }
            yield this.bridge.inviteToRoom(federatedRoom.getExternalId(), federatedInviterUser.getExternalId(), federatedInviteeUser.getExternalId());
            if (isInviteeFromTheSameHomeServer) {
                yield this.bridge.joinRoom(federatedRoom.getExternalId(), federatedInviteeUser.getExternalId());
            }
        });
    }
}
exports.FederationRoomServiceSender = FederationRoomServiceSender;
class RoomMapper {
    static toSearchPublicRoomsDto(rooms, maxSizeOfUsersAllowed, pageToken) {
        var _a;
        return Object.assign(Object.assign({ rooms: ((rooms === null || rooms === void 0 ? void 0 : rooms.chunk) || [])
                .filter((room) => room.join_rule && room.join_rule !== MatrixRoomJoinRules_1.MatrixRoomJoinRules.KNOCK)
                .map((room) => ({
                id: room.room_id,
                name: room.name,
                canJoin: room.num_joined_members <= maxSizeOfUsersAllowed,
                canonicalAlias: room.canonical_alias,
                joinedMembers: room.num_joined_members,
                topic: room.topic,
                pageToken,
            })), count: ((_a = rooms === null || rooms === void 0 ? void 0 : rooms.chunk) === null || _a === void 0 ? void 0 : _a.length) || 0, total: (rooms === null || rooms === void 0 ? void 0 : rooms.total_room_count_estimate) || 0 }, ((rooms === null || rooms === void 0 ? void 0 : rooms.next_batch) ? { nextPageToken: rooms.next_batch } : {})), ((rooms === null || rooms === void 0 ? void 0 : rooms.prev_batch) ? { prevPageToken: rooms.prev_batch } : {}));
    }
}
