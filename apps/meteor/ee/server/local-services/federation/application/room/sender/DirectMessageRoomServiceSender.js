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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederationDirectMessageRoomServiceSender = void 0;
const FederatedUser_1 = require("../../../domain/FederatedUser");
const AbstractFederationApplicationServiceEE_1 = require("../../AbstractFederationApplicationServiceEE");
class FederationDirectMessageRoomServiceSender extends AbstractFederationApplicationServiceEE_1.AbstractFederationApplicationServiceEE {
    constructor(internalRoomAdapter, internalUserAdapter, internalFileAdapter, internalSettingsAdapter, bridge) {
        super(bridge, internalUserAdapter, internalFileAdapter, internalSettingsAdapter);
        this.internalRoomAdapter = internalRoomAdapter;
        this.internalUserAdapter = internalUserAdapter;
        this.internalFileAdapter = internalFileAdapter;
        this.internalSettingsAdapter = internalSettingsAdapter;
        this.bridge = bridge;
    }
    onDirectMessageRoomCreation(dmRoomOnCreationInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { internalRoomId, internalInviterId, invitees, inviteComesFromAnExternalHomeServer } = dmRoomOnCreationInput;
            const atLeastOneExternalUser = invitees.some((invitee) => !FederatedUser_1.FederatedUserEE.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(invitee.rawInviteeId), this.internalHomeServerDomain));
            if (invitees.length === 0 || inviteComesFromAnExternalHomeServer || !atLeastOneExternalUser) {
                return;
            }
            yield this.createExternalDirectMessageRoomAndInviteUsers({
                internalInviterId,
                internalRoomId,
                invitees,
                inviteComesFromAnExternalHomeServer,
            });
        });
    }
    beforeDirectMessageRoomCreation(dmBeforeRoomCreationInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { invitees = [] } = dmBeforeRoomCreationInput;
            if (invitees.length === 0) {
                return;
            }
            yield this.createUsersLocallyOnly(invitees);
        });
    }
    createInternalLocalDirectMessageRoom(dmRoomCreateInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { internalInviterId, invitees } = dmRoomCreateInput;
            yield this.internalRoomAdapter.createLocalDirectMessageRoom(invitees, internalInviterId);
        });
    }
    createExternalDirectMessageRoomAndInviteUsers(dmRoomOnCreationInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { internalRoomId, internalInviterId, invitees } = dmRoomOnCreationInput;
            const inviterUser = yield this.internalUserAdapter.getFederatedUserByInternalId(internalInviterId);
            if (!inviterUser) {
                const internalUser = yield this.internalUserAdapter.getInternalUserById(internalInviterId);
                const username = internalUser.username || internalInviterId;
                const name = internalUser.name || internalInviterId;
                const existsOnlyOnProxyServer = true;
                const externalInviterId = yield this.bridge.createUser(username, name, this.internalHomeServerDomain);
                yield this.createFederatedUserInternallyOnly(externalInviterId, username, existsOnlyOnProxyServer, name);
            }
            const federatedInviterUser = inviterUser || (yield this.internalUserAdapter.getFederatedUserByInternalId(internalInviterId));
            if (!federatedInviterUser) {
                throw new Error(`User with internalId ${internalInviterId} not found`);
            }
            const isInviterFromTheSameHomeServer = FederatedUser_1.FederatedUserEE.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(federatedInviterUser.getExternalId()), this.internalHomeServerDomain);
            const internalFederatedRoom = yield this.internalRoomAdapter.getFederatedRoomByInternalId(internalRoomId);
            yield Promise.all(invitees.map((member) => this.createUserForDirectMessageRoom({
                internalInviterId,
                internalRoomId,
                inviteeUsernameOnly: member.inviteeUsernameOnly,
                normalizedInviteeId: member.normalizedInviteeId,
                rawInviteeId: member.rawInviteeId,
            })));
            if (internalFederatedRoom || !isInviterFromTheSameHomeServer) {
                return;
            }
            const allInviteeExternalIds = invitees.map((invitee) => invitee.rawInviteeId);
            const externalRoomId = yield this.bridge.createDirectMessageRoom(federatedInviterUser.getExternalId(), allInviteeExternalIds, {
                internalRoomId,
            });
            const inviteesFromTheSameHomeServer = invitees.filter((invitee) => FederatedUser_1.FederatedUserEE.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(invitee.rawInviteeId), this.internalHomeServerDomain));
            yield Promise.all(inviteesFromTheSameHomeServer.map((invitee) => this.bridge.joinRoom(externalRoomId, invitee.rawInviteeId)));
            yield this.internalRoomAdapter.updateFederatedRoomByInternalRoomId(internalRoomId, externalRoomId);
        });
    }
    createUserForDirectMessageRoom(roomInviteUserInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const { normalizedInviteeId, inviteeUsernameOnly, rawInviteeId } = roomInviteUserInput;
            const isInviteeFromTheSameHomeServer = FederatedUser_1.FederatedUserEE.isOriginalFromTheProxyServer(this.bridge.extractHomeserverOrigin(rawInviteeId), this.internalHomeServerDomain);
            const username = isInviteeFromTheSameHomeServer ? inviteeUsernameOnly : normalizedInviteeId;
            const existsOnlyOnProxyServer = isInviteeFromTheSameHomeServer;
            const inviteeUser = yield this.internalUserAdapter.getFederatedUserByInternalUsername(username);
            if (!inviteeUser) {
                yield this.createFederatedUserInternallyOnly(rawInviteeId, username, existsOnlyOnProxyServer);
            }
            if (!isInviteeFromTheSameHomeServer) {
                return;
            }
            const federatedInviteeUser = inviteeUser || (yield this.internalUserAdapter.getFederatedUserByInternalUsername(inviteeUsernameOnly));
            if (!federatedInviteeUser) {
                throw new Error(`User with internalUsername ${inviteeUsernameOnly} not found`);
            }
            const profile = yield this.bridge.getUserProfileInformation(federatedInviteeUser.getExternalId());
            if (profile) {
                return;
            }
            yield this.bridge.createUser(inviteeUsernameOnly, federatedInviteeUser.getName() || federatedInviteeUser.getUsername() || inviteeUsernameOnly, this.internalHomeServerDomain);
        });
    }
}
exports.FederationDirectMessageRoomServiceSender = FederationDirectMessageRoomServiceSender;
