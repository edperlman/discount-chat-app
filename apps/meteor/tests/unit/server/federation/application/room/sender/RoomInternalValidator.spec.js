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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rooms_1 = require("@rocket.chat/apps-engine/definition/rooms");
const chai_1 = require("chai");
const sinon_1 = __importDefault(require("sinon"));
const RoomInternalValidator_1 = require("../../../../../../../server/services/federation/application/room/sender/RoomInternalValidator");
const FederatedRoom_1 = require("../../../../../../../server/services/federation/domain/FederatedRoom");
const FederatedUser_1 = require("../../../../../../../server/services/federation/domain/FederatedUser");
describe('Federation - Application - FederationRoomInternalHooksValidator', () => {
    let service;
    const roomAdapter = {
        getFederatedRoomByInternalId: sinon_1.default.stub(),
        createFederatedRoom: sinon_1.default.stub(),
    };
    const userAdapter = {
        getFederatedUserByExternalId: sinon_1.default.stub(),
        getFederatedUserByInternalId: sinon_1.default.stub(),
    };
    const settingsAdapter = {
        getHomeServerDomain: sinon_1.default.stub().returns('localDomain'),
    };
    const bridge = {
        extractHomeserverOrigin: sinon_1.default.stub(),
    };
    beforeEach(() => {
        service = new RoomInternalValidator_1.FederationRoomInternalValidator(roomAdapter, userAdapter, {}, settingsAdapter, bridge);
    });
    afterEach(() => {
        roomAdapter.getFederatedRoomByInternalId.reset();
        roomAdapter.createFederatedRoom.reset();
        userAdapter.getFederatedUserByExternalId.reset();
        userAdapter.getFederatedUserByInternalId.reset();
        bridge.extractHomeserverOrigin.reset();
    });
    describe('#canAddFederatedUserToNonFederatedRoom()', () => {
        it('should NOT throw an error if the internal room is federated', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, chai_1.expect)(service.canAddFederatedUserToNonFederatedRoom('external user', { federated: true })).to.not.be.rejected;
        }));
        it('should throw an error if the user is tryng to add an external user to a non federated room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, chai_1.expect)(service.canAddFederatedUserToNonFederatedRoom('external user', {})).to.be.rejectedWith('error-cant-add-federated-users');
        }));
        it('should NOT throw an error if the internal room is NOT federated but the user is adding a non federated user to it', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByExternalId.resolves(undefined);
            yield (0, chai_1.expect)(service.canAddFederatedUserToNonFederatedRoom({}, { federated: true })).to.not.be.rejected;
        }));
        it('should throw an error if the internal room is NOT federated and the user is trying to add a federated user to it', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = FederatedUser_1.FederatedUser.createInstance('externalInviterId', {
                name: 'normalizedInviterId',
                username: 'normalizedInviterId',
                existsOnlyOnProxyServer: false,
            });
            userAdapter.getFederatedUserByInternalId.resolves(user);
            yield (0, chai_1.expect)(service.canAddFederatedUserToNonFederatedRoom({}, {})).to.be.rejectedWith('error-cant-add-federated-users');
        }));
    });
    describe('#canAddFederatedUserToFederatedRoom()', () => {
        const user = FederatedUser_1.FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: false,
        });
        const room = FederatedRoom_1.FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT throw an error if room is not federated', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, chai_1.expect)(service.canAddFederatedUserToFederatedRoom('external user', {}, {})).to.not.be.rejected;
        }));
        it('should throw an error if the user is trying to add a new external user AND the room is not a DM', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, chai_1.expect)(service.canAddFederatedUserToFederatedRoom('external user', {}, { federated: true, t: rooms_1.RoomType.CHANNEL })).to.be.rejectedWith('error-this-is-a-premium-feature');
        }));
        it('should NOT throw an error if the user is trying to add a new external user but the room is a DM', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, chai_1.expect)(service.canAddFederatedUserToFederatedRoom('external user', {}, { federated: true, t: rooms_1.RoomType.DIRECT_MESSAGE })).to.not.be.rejected;
        }));
        it('should NOT throw an error if there is no existent federated room', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            yield (0, chai_1.expect)(service.canAddFederatedUserToFederatedRoom({}, {}, { federated: true })).to.not.be.rejected;
        }));
        it('should NOT throw an error if there is no existent inviter user', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            yield (0, chai_1.expect)(service.canAddFederatedUserToFederatedRoom({}, {}, { federated: true })).to.not.be.rejected;
        }));
        it('should NOT throw an error if the whole action(external room + external inviter) is executed remotely', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            bridge.extractHomeserverOrigin.returns('externalDomain');
            yield (0, chai_1.expect)(service.canAddFederatedUserToFederatedRoom({}, {}, { federated: true })).to.not.be.rejected;
        }));
        it('should NOT throw an error if the user is trying to add an external user AND the room is a direct message one', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            bridge.extractHomeserverOrigin.returns('localDomain');
            yield (0, chai_1.expect)(service.canAddFederatedUserToFederatedRoom({}, {}, { federated: true, t: rooms_1.RoomType.DIRECT_MESSAGE }))
                .to.not.be.rejected;
        }));
        it('should NOT throw an error if the user is trying to add a NON external user AND the room is a direct message one', () => __awaiter(void 0, void 0, void 0, function* () {
            const localUser = FederatedUser_1.FederatedUser.createInstance('externalInviterId', {
                name: 'normalizedInviterId',
                username: 'normalizedInviterId',
                existsOnlyOnProxyServer: true,
            });
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(localUser);
            bridge.extractHomeserverOrigin.returns('localDomain');
            yield (0, chai_1.expect)(service.canAddFederatedUserToFederatedRoom({}, {}, { federated: true, t: rooms_1.RoomType.DIRECT_MESSAGE }))
                .to.not.be.rejected;
        }));
        it('should NOT throw an error if the user is trying to add a NON external user AND the room is a NOT direct message one', () => __awaiter(void 0, void 0, void 0, function* () {
            const localUser = FederatedUser_1.FederatedUser.createInstance('externalInviterId', {
                name: 'normalizedInviterId',
                username: 'normalizedInviterId',
                existsOnlyOnProxyServer: true,
            });
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(localUser);
            bridge.extractHomeserverOrigin.returns('localDomain');
            yield (0, chai_1.expect)(service.canAddFederatedUserToFederatedRoom({}, {}, { federated: true, t: rooms_1.RoomType.CHANNEL })).to.not
                .be.rejected;
        }));
        it('should throw an error if the user is trying to add an external user AND the room is a NOT direct message one', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            bridge.extractHomeserverOrigin.returns('localDomain');
            yield (0, chai_1.expect)(service.canAddFederatedUserToFederatedRoom({}, {}, { federated: true, t: rooms_1.RoomType.CHANNEL })).to.be.rejectedWith('error-this-is-a-premium-feature');
        }));
    });
    describe('#canCreateDirectMessageFromUI()', () => {
        it('should throw an error if there at least one user with federated property equal to true', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield service.canCreateDirectMessageFromUI([{ federated: true }, {}]);
            }
            catch (e) {
                (0, chai_1.expect)(e.message).to.be.equal('error-this-is-a-premium-feature');
            }
        }));
        it('should throw an error if there at least one new external user (comaring by username, even if federated is equal false)', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('localDomain');
            try {
                yield service.canCreateDirectMessageFromUI(['@myexternal:external.com', {}]);
            }
            catch (e) {
                (0, chai_1.expect)(e.message).to.be.equal('error-this-is-a-premium-feature');
            }
        }));
    });
});
