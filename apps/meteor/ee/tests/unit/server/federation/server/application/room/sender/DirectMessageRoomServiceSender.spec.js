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
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const { FederatedRoomEE } = proxyquire_1.default.noCallThru().load('../../../../../../../../server/local-services/federation/domain/FederatedRoom', {
    mongodb: {
        'ObjectId': class ObjectId {
            toHexString() {
                return 'hexString';
            }
        },
        '@global': true,
    },
});
const { FederatedUserEE } = proxyquire_1.default.noCallThru().load('../../../../../../../../server/local-services/federation/domain/FederatedUser', {
    mongodb: {
        'ObjectId': class ObjectId {
            toHexString() {
                return 'hexString';
            }
        },
        '@global': true,
    },
});
const { FederationDirectMessageRoomServiceSender } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../../../server/local-services/federation/application/room/sender/DirectMessageRoomServiceSender', {
    mongodb: {
        'ObjectId': class ObjectId {
            toHexString() {
                return 'hexString';
            }
        },
        '@global': true,
    },
});
describe('FederationEE - Application - FederationDirectMessageRoomServiceSender', () => {
    let service;
    const roomAdapter = {
        getFederatedRoomByInternalId: sinon_1.default.stub(),
        updateFederatedRoomByInternalRoomId: sinon_1.default.stub(),
    };
    const userAdapter = {
        getFederatedUserByExternalId: sinon_1.default.stub(),
        getFederatedUserByInternalId: sinon_1.default.stub(),
        createFederatedUser: sinon_1.default.stub(),
        getInternalUserById: sinon_1.default.stub(),
        getFederatedUserByInternalUsername: sinon_1.default.stub(),
        createLocalUser: sinon_1.default.stub(),
        getInternalUserByUsername: sinon_1.default.stub(),
    };
    const settingsAdapter = {
        getHomeServerDomain: sinon_1.default.stub().returns('localDomain'),
    };
    const bridge = {
        getUserProfileInformation: sinon_1.default.stub().resolves({}),
        extractHomeserverOrigin: sinon_1.default.stub(),
        createUser: sinon_1.default.stub(),
        createDirectMessageRoom: sinon_1.default.stub(),
        joinRoom: sinon_1.default.stub(),
    };
    const invitees = [
        {
            inviteeUsernameOnly: 'marcos.defendi',
            normalizedInviteeId: 'marcos.defendi:matrix.com',
            rawInviteeId: '@marcos.defendi:matrix.com',
        },
    ];
    beforeEach(() => {
        service = new FederationDirectMessageRoomServiceSender(roomAdapter, userAdapter, {}, settingsAdapter, bridge);
    });
    afterEach(() => {
        roomAdapter.getFederatedRoomByInternalId.reset();
        roomAdapter.updateFederatedRoomByInternalRoomId.reset();
        userAdapter.getFederatedUserByInternalId.reset();
        userAdapter.getInternalUserById.reset();
        userAdapter.createFederatedUser.reset();
        userAdapter.getFederatedUserByInternalUsername.reset();
        userAdapter.getFederatedUserByExternalId.reset();
        userAdapter.createLocalUser.reset();
        userAdapter.getInternalUserByUsername.reset();
        bridge.extractHomeserverOrigin.reset();
        bridge.createUser.reset();
        bridge.createDirectMessageRoom.reset();
        bridge.joinRoom.reset();
    });
    describe('#onDirectMessageRoomCreation()', () => {
        const user = FederatedUserEE.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: true,
        });
        const room = FederatedRoomEE.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT create the inviter user both externally and internally if it already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            yield service.onDirectMessageRoomCreation({
                invitees,
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
            });
            (0, chai_1.expect)(bridge.createUser.called).to.be.false;
        }));
        it('should create the inviter user both externally and internally if it does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.onCall(0).resolves(undefined);
            userAdapter.getFederatedUserByInternalId.onCall(1).resolves(user);
            userAdapter.getInternalUserById.resolves({ username: 'username', name: 'name' });
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            bridge.createUser.resolves('externalInviterId');
            yield service.onDirectMessageRoomCreation({
                invitees,
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
            });
            const inviter = FederatedUserEE.createInstance('externalInviterId', {
                name: 'name',
                username: 'username',
                existsOnlyOnProxyServer: true,
            });
            (0, chai_1.expect)(bridge.createUser.calledWith('username', 'name', 'localDomain')).to.be.true;
            (0, chai_1.expect)(userAdapter.createFederatedUser.calledWith(inviter)).to.be.true;
        }));
        it('should throw an error if the inviter does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            userAdapter.getInternalUserById.resolves({ username: 'username', name: 'name' });
            yield (0, chai_1.expect)(service.onDirectMessageRoomCreation({ invitees, internalInviterId: 'internalInviterId', internalRoomId: 'internalRoomId' })).to.be.rejectedWith('User with internalId internalInviterId not found');
        }));
        it('should create the external room with all (the external) the invitees, the inviter is from the same homeserver and at least one invitee is external', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.onCall(0).returns('matrix.com');
            bridge.extractHomeserverOrigin.returns('localDomain');
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            bridge.createDirectMessageRoom.resolves('externalRoomId');
            yield service.onDirectMessageRoomCreation({
                invitees,
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
            });
            (0, chai_1.expect)(bridge.createDirectMessageRoom.calledWith(user.getExternalId(), invitees.map((invitee) => invitee.rawInviteeId))).to.be.true;
            (0, chai_1.expect)(roomAdapter.updateFederatedRoomByInternalRoomId.calledWith('internalRoomId', 'externalRoomId')).to.be.true;
        }));
        it('should automatically join all the invitees who are original from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.onCall(0).returns('matrix.com');
            bridge.extractHomeserverOrigin.returns('localDomain');
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            bridge.createDirectMessageRoom.resolves('externalRoomId');
            yield service.onDirectMessageRoomCreation({
                invitees,
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
            });
            invitees.forEach((invitee) => (0, chai_1.expect)(bridge.joinRoom.calledWith('externalRoomId', invitee.rawInviteeId)).to.be.true);
        }));
        it('should NOT create the external room with any invitee when all of them are local only and the inviter is from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('localDomain');
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            bridge.createDirectMessageRoom.resolves('externalRoomId');
            yield service.onDirectMessageRoomCreation({
                invitees,
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
            });
            (0, chai_1.expect)(bridge.createDirectMessageRoom.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.updateFederatedRoomByInternalRoomId.called).to.be.false;
        }));
        it('should NOT create the external room with all the invitees when the inviter is NOT from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('externalDomain');
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            yield service.onDirectMessageRoomCreation({
                invitees,
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
            });
            (0, chai_1.expect)(bridge.createDirectMessageRoom.called).to.be.false;
            (0, chai_1.expect)(roomAdapter.updateFederatedRoomByInternalRoomId.called).to.be.false;
        }));
        it('should create the invitee user if it does not exists and it is from the same home server, but he is not the only one, there is also an external invitee', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.onCall(0).returns('matrix.com');
            bridge.extractHomeserverOrigin.returns('localDomain');
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalUsername.onCall(0).resolves(undefined);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            yield service.onDirectMessageRoomCreation({
                invitees,
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
            });
            const invitee = FederatedUserEE.createInstance(invitees[0].rawInviteeId, {
                name: invitees[0].inviteeUsernameOnly,
                username: invitees[0].inviteeUsernameOnly,
                existsOnlyOnProxyServer: true,
            });
            (0, chai_1.expect)(userAdapter.createFederatedUser.calledWith(invitee)).to.be.true;
        }));
        it('should create the invitee user if it does not exists and it is NOT from the same home server', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('externalDomain');
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalUsername.onCall(0).resolves(undefined);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            yield service.onDirectMessageRoomCreation({
                invitees,
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
            });
            const invitee = FederatedUserEE.createInstance(invitees[0].rawInviteeId, {
                name: invitees[0].normalizedInviteeId,
                username: invitees[0].normalizedInviteeId,
                existsOnlyOnProxyServer: false,
            });
            (0, chai_1.expect)(userAdapter.createFederatedUser.calledWith(invitee)).to.be.true;
        }));
        it('should NOT create the invitee user if it already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            yield service.onDirectMessageRoomCreation({
                invitees,
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
            });
            (0, chai_1.expect)(userAdapter.createFederatedUser.called).to.be.false;
        }));
        it('should NOT create the user on the proxy homeserver if it is NOT from the same homeserver, which means is a external user', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('externalDomain');
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            yield service.onDirectMessageRoomCreation({
                invitees,
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
            });
            (0, chai_1.expect)(bridge.createUser.called).to.be.false;
        }));
        it('should throw an error if the invitee is from the same home server but the federated user does not exists and also there is at least one external user', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.onCall(0).returns('matrix.com');
            bridge.extractHomeserverOrigin.returns('localDomain');
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalUsername.resolves(undefined);
            yield (0, chai_1.expect)(service.onDirectMessageRoomCreation({ invitees, internalInviterId: 'internalInviterId', internalRoomId: 'internalRoomId' })).to.be.rejectedWith(`User with internalUsername ${invitees[0].inviteeUsernameOnly} not found`);
        }));
        it('should NOT create the user on the proxy homeserver if it is from the same home server AND already exists on it', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('localDomain');
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            bridge.getUserProfileInformation.resolves({});
            yield service.onDirectMessageRoomCreation({
                invitees,
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
            });
            (0, chai_1.expect)(bridge.createUser.called).to.be.false;
        }));
        it('should create the user on the proxy home server if it is from the same home server AND does not exists there yet', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.returns('externalDomain');
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            bridge.getUserProfileInformation.resolves(undefined);
            yield service.onDirectMessageRoomCreation({
                invitees,
                internalInviterId: 'internalInviterId',
                internalRoomId: 'internalRoomId',
            });
            const invitee = FederatedUserEE.createInstance(invitees[0].rawInviteeId, {
                name: invitees[0].normalizedInviteeId,
                username: invitees[0].normalizedInviteeId,
                existsOnlyOnProxyServer: false,
            });
            (0, chai_1.expect)(bridge.createUser.calledWith(invitees[0].inviteeUsernameOnly, invitee.getUsername(), 'localDomain')).to.be.false;
        }));
    });
    describe('#beforeDirectMessageRoomCreation()', () => {
        it('should create the invitee locally for each external user', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.onCall(0).returns('externalDomain');
            bridge.extractHomeserverOrigin.onCall(1).returns('localDomain');
            yield service.beforeDirectMessageRoomCreation({
                invitees: [
                    ...invitees,
                    {
                        inviteeUsernameOnly: 'marcos.defendiNotToBeInvited',
                        normalizedInviteeId: 'marcos.defendi:matrix.comNotToBeInvited',
                        rawInviteeId: '@marcos.defendi:matrix.comNotToBeInvited',
                    },
                ],
            });
            const invitee = FederatedUserEE.createLocalInstanceOnly({
                name: invitees[0].normalizedInviteeId,
                username: invitees[0].normalizedInviteeId,
                existsOnlyOnProxyServer: false,
            });
            (0, chai_1.expect)(userAdapter.createLocalUser.calledOnceWithExactly(invitee)).to.be.true;
        }));
    });
});
