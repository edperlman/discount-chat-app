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
const { FederationRoomServiceSender } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../../../server/local-services/federation/application/room/sender/RoomServiceSender', {
    mongodb: {
        'ObjectId': class ObjectId {
            toHexString() {
                return 'hexString';
            }
        },
        '@global': true,
    },
});
describe('FederationEE - Application - FederationRoomServiceSender', () => {
    let service;
    const roomAdapter = {
        getFederatedRoomByInternalId: sinon_1.default.stub(),
        updateFederatedRoomByInternalRoomId: sinon_1.default.stub(),
        getInternalRoomById: sinon_1.default.stub(),
        getInternalRoomRolesByUserId: sinon_1.default.stub(),
        isUserAlreadyJoined: sinon_1.default.stub(),
        getFederatedRoomByExternalId: sinon_1.default.stub(),
        createFederatedRoom: sinon_1.default.stub(),
        addUserToRoom: sinon_1.default.stub(),
    };
    const userAdapter = {
        getFederatedUserByExternalId: sinon_1.default.stub(),
        getFederatedUserByInternalId: sinon_1.default.stub(),
        createFederatedUser: sinon_1.default.stub(),
        getInternalUserById: sinon_1.default.stub(),
        getFederatedUserByInternalUsername: sinon_1.default.stub(),
        createLocalUser: sinon_1.default.stub(),
        getInternalUserByUsername: sinon_1.default.stub(),
        updateFederationAvatar: sinon_1.default.stub(),
        setAvatar: sinon_1.default.stub(),
        updateRealName: sinon_1.default.stub(),
    };
    const settingsAdapter = {
        getHomeServerDomain: sinon_1.default.stub().returns('localDomain'),
        isFederationEnabled: sinon_1.default.stub(),
        getMaximumSizeOfUsersWhenJoiningPublicRooms: sinon_1.default.stub(),
    };
    const messageAdapter = {};
    const bridge = {
        searchPublicRooms: sinon_1.default.stub(),
        getUserProfileInformation: sinon_1.default.stub().resolves({}),
        extractHomeserverOrigin: sinon_1.default.stub(),
        createUser: sinon_1.default.stub(),
        inviteToRoom: sinon_1.default.stub(),
        createRoom: sinon_1.default.stub(),
        joinRoom: sinon_1.default.stub(),
        convertMatrixUrlToHttp: sinon_1.default.stub().returns('toHttpUrl'),
        getRoomData: sinon_1.default.stub(),
    };
    const fileAdapter = {
        getBufferForAvatarFile: sinon_1.default.stub().resolves(undefined),
    };
    const notificationAdapter = {
        subscribeToUserTypingEventsOnFederatedRoomId: sinon_1.default.stub(),
        broadcastUserTypingOnRoom: sinon_1.default.stub(),
    };
    const queueAdapter = {
        enqueueJob: sinon_1.default.stub(),
    };
    const invitees = [
        {
            inviteeUsernameOnly: 'marcos.defendi',
            normalizedInviteeId: 'marcos.defendi:matrix.com',
            rawInviteeId: '@marcos.defendi:matrix.com',
        },
    ];
    beforeEach(() => {
        service = new FederationRoomServiceSender(roomAdapter, userAdapter, fileAdapter, settingsAdapter, messageAdapter, notificationAdapter, queueAdapter, bridge);
    });
    afterEach(() => {
        roomAdapter.getFederatedRoomByInternalId.reset();
        roomAdapter.updateFederatedRoomByInternalRoomId.reset();
        roomAdapter.getInternalRoomById.reset();
        roomAdapter.getFederatedRoomByExternalId.reset();
        roomAdapter.getInternalRoomRolesByUserId.reset();
        roomAdapter.addUserToRoom.reset();
        roomAdapter.createFederatedRoom.reset();
        roomAdapter.isUserAlreadyJoined.reset();
        userAdapter.getFederatedUserByInternalId.reset();
        userAdapter.getInternalUserById.reset();
        userAdapter.createFederatedUser.reset();
        userAdapter.getFederatedUserByInternalUsername.reset();
        userAdapter.createLocalUser.reset();
        userAdapter.getInternalUserByUsername.reset();
        userAdapter.getFederatedUserByExternalId.reset();
        userAdapter.updateFederationAvatar.reset();
        userAdapter.setAvatar.reset();
        userAdapter.updateRealName.reset();
        bridge.extractHomeserverOrigin.reset();
        bridge.createUser.reset();
        bridge.createRoom.reset();
        bridge.inviteToRoom.reset();
        bridge.joinRoom.reset();
        bridge.getUserProfileInformation.reset();
        bridge.joinRoom.reset();
        bridge.searchPublicRooms.reset();
        bridge.getRoomData.reset();
        queueAdapter.enqueueJob.reset();
        settingsAdapter.isFederationEnabled.reset();
        settingsAdapter.getMaximumSizeOfUsersWhenJoiningPublicRooms.reset();
        notificationAdapter.broadcastUserTypingOnRoom.reset();
        notificationAdapter.subscribeToUserTypingEventsOnFederatedRoomId.reset();
    });
    describe('#onRoomCreated()', () => {
        const user = FederatedUserEE.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: true,
        });
        const room = FederatedRoomEE.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should NOT create the inviter user if the user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.onCall(0).resolves(user);
            userAdapter.getFederatedUserByInternalId.onCall(1).resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            yield service.onRoomCreated({ invitees });
            (0, chai_1.expect)(bridge.createUser.called).to.be.false;
            (0, chai_1.expect)(userAdapter.createFederatedUser.called).to.be.false;
        }));
        it('should create the inviter user both externally and internally if it does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.onCall(0).resolves(undefined);
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            userAdapter.getInternalUserById.resolves({ username: 'username', name: 'name' });
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            bridge.createUser.resolves('externalInviterId');
            yield service.onRoomCreated({ invitees });
            const inviter = FederatedUserEE.createInstance('externalInviterId', {
                name: 'name',
                username: 'username',
                existsOnlyOnProxyServer: true,
            });
            (0, chai_1.expect)(bridge.createUser.calledWith('username', 'name', 'localDomain')).to.be.true;
            (0, chai_1.expect)(userAdapter.createFederatedUser.calledWith(inviter)).to.be.true;
        }));
        it('should throw an error if the inviter user was not found', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            userAdapter.getInternalUserById.resolves({ username: 'username', name: 'name' });
            yield (0, chai_1.expect)(service.onRoomCreated({ invitees, internalInviterId: 'internalInviterId' })).to.be.rejectedWith('User with internalId internalInviterId not found');
        }));
        it('should throw an error if the internal room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            roomAdapter.getInternalRoomById.resolves(undefined);
            yield (0, chai_1.expect)(service.onRoomCreated({ invitees, internalInviterId: 'internalInviterId', internalRoomId: 'internalRoomId' })).to.be.rejectedWith('Room with internalId internalRoomId not found');
        }));
        it('should create the room in the proxy home server and update it locally', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getInternalRoomById.resolves({ name: 'name', t: rooms_1.RoomType.CHANNEL, topic: 'topic', _id: '_id' });
            roomAdapter.getFederatedRoomByInternalId.onCall(0).resolves(undefined);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            bridge.createRoom.resolves('externalRoomId');
            yield service.onRoomCreated({ invitees, internalInviterId: 'internalInviterId', internalRoomId: 'internalRoomId' });
            (0, chai_1.expect)(bridge.createRoom.calledWith(user.getExternalId(), rooms_1.RoomType.CHANNEL, 'name', 'topic')).to.be.true;
            (0, chai_1.expect)(roomAdapter.updateFederatedRoomByInternalRoomId.calledWith('_id', 'externalRoomId')).to.be.true;
        }));
        it('should NOT create the invitee user if the user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            yield service.onRoomCreated({ internalInviterId: 'internalInviterId', invitees });
            (0, chai_1.expect)(userAdapter.createFederatedUser.called).to.be.false;
        }));
        it('should create the invitee user internally if it does not exists (using the username only if it is from the proxy home server)', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.onCall(0).resolves(undefined);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            bridge.extractHomeserverOrigin.returns('localDomain');
            yield service.onRoomCreated({ internalInviterId: 'internalInviterId', invitees });
            const invitee = FederatedUserEE.createInstance(invitees[0].rawInviteeId, {
                name: invitees[0].inviteeUsernameOnly,
                username: invitees[0].inviteeUsernameOnly,
                existsOnlyOnProxyServer: true,
            });
            (0, chai_1.expect)(userAdapter.createFederatedUser.calledWith(invitee)).to.be.true;
        }));
        it('should create the invitee user internally if it does not exists (using the normalized invite id if it is NOT from the proxy home server)', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.onCall(0).resolves(undefined);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            bridge.extractHomeserverOrigin.returns('externalDomain');
            yield service.onRoomCreated({ internalInviterId: 'internalInviterId', invitees });
            const invitee = FederatedUserEE.createInstance(invitees[0].rawInviteeId, {
                name: invitees[0].normalizedInviteeId,
                username: invitees[0].normalizedInviteeId,
                existsOnlyOnProxyServer: false,
            });
            (0, chai_1.expect)(userAdapter.createFederatedUser.calledWith(invitee)).to.be.true;
        }));
        it('should throw an error if the invitee user was not found', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(undefined);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            yield (0, chai_1.expect)(service.onRoomCreated({ invitees, internalInviterId: 'internalInviterId' })).to.be.rejectedWith(`User with internalUsername ${invitees[0].normalizedInviteeId} not found`);
        }));
        it('should create the invitee user on the proxy home server if the invitee is from the same home server AND it does not exists yet', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.getUserProfileInformation.resolves(undefined);
            yield service.onRoomCreated(Object.assign({ invitees, internalInviterId: 'internalInviterId', internalRoomId: 'internalRoomId' }, invitees[0]));
            (0, chai_1.expect)(bridge.createUser.calledWith(invitees[0].inviteeUsernameOnly, user.getName(), 'localDomain')).to.be.true;
        }));
        it('should NOT create the invitee user on the proxy home server if the invitee is from the same home server but it already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.getUserProfileInformation.resolves({});
            yield service.onRoomCreated(Object.assign({ invitees, internalInviterId: 'internalInviterId', internalRoomId: 'internalRoomId' }, invitees[0]));
            (0, chai_1.expect)(bridge.createUser.called).to.be.false;
        }));
        it('should NOT create the invitee user on the proxy home server if its not from the same home server', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            bridge.extractHomeserverOrigin.returns('externalDomain');
            yield service.onRoomCreated(Object.assign({ invitees, internalInviterId: 'internalInviterId', internalRoomId: 'internalRoomId' }, invitees[0]));
            (0, chai_1.expect)(bridge.createUser.called).to.be.false;
        }));
        it('should always invite the invitee user to the room', () => __awaiter(void 0, void 0, void 0, function* () {
            const invitee = FederatedUserEE.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: true,
            });
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(invitee);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            yield service.onRoomCreated(Object.assign({ invitees, internalInviterId: 'internalInviterId', internalRoomId: 'internalRoomId' }, invitees[0]));
            (0, chai_1.expect)(bridge.inviteToRoom.calledWith(room.getExternalId(), user.getExternalId(), invitee.getExternalId())).to.be.true;
        }));
        it('should automatically join the invitee if he/she is from the proxy homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            const invitee = FederatedUserEE.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: true,
            });
            bridge.extractHomeserverOrigin.returns('localDomain');
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(invitee);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            yield service.onRoomCreated(Object.assign({ invitees, internalRoomId: 'internalRoomId' }, invitees[0]));
            (0, chai_1.expect)(bridge.joinRoom.calledWith(room.getExternalId(), invitee.getExternalId())).to.be.true;
        }));
        it('should NOT automatically join the invitee if he/she is NOT from the proxy homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            const invitee = FederatedUserEE.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: true,
            });
            bridge.extractHomeserverOrigin.returns('externalDomain');
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(invitee);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            yield service.onRoomCreated(Object.assign(Object.assign({ invitees, internalRoomId: 'internalRoomId' }, invitees[0]), { ahahha: 'ahha' }));
            (0, chai_1.expect)(bridge.joinRoom.called).to.be.false;
        }));
    });
    describe('#beforeAddUserToARoom()', () => {
        const federatedUser = FederatedUserEE.createInstance('externalInviteeId', {
            name: 'normalizedInviteeId',
            username: 'normalizedInviteeId',
            existsOnlyOnProxyServer: false,
        });
        const room = FederatedRoomEE.createInstance('externalRoomId', 'normalizedRoomId', federatedUser, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        const validParams = {
            invitees: [
                ...invitees,
                {
                    inviteeUsernameOnly: 'marcos.defendiNotToBeInvited',
                    normalizedInviteeId: 'marcos.defendi:matrix.comNotToBeInvited',
                    rawInviteeId: '@marcos.defendi:matrix.comNotToBeInvited',
                },
            ],
        };
        it('should not create the invitee locally if the inviter was provided but it does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const createUsersLocallyOnlySpy = sinon_1.default.spy(service, 'createUsersLocallyOnly');
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            yield service.beforeAddUserToARoom(Object.assign(Object.assign({}, validParams), { internalInviter: 'internalInviterId', internalRoomId: 'internalRoomId' }));
            (0, chai_1.expect)(createUsersLocallyOnlySpy.called).to.be.false;
        }));
        it('should not create the invitee locally if the inviter was provided but the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const createUsersLocallyOnlySpy = sinon_1.default.spy(service, 'createUsersLocallyOnly');
            userAdapter.getFederatedUserByInternalId.resolves(federatedUser);
            roomAdapter.getFederatedRoomByInternalId.resolves(undefined);
            yield service.beforeAddUserToARoom(Object.assign(Object.assign({}, validParams), { internalInviter: 'internalInviterId', internalRoomId: 'internalRoomId' }));
            (0, chai_1.expect)(createUsersLocallyOnlySpy.called).to.be.false;
        }));
        it('should throw an error if the inviter was provided and he/she is not neither owner, moderator or the room creator', () => __awaiter(void 0, void 0, void 0, function* () {
            const createUsersLocallyOnlySpy = sinon_1.default.spy(service, 'createUsersLocallyOnly');
            userAdapter.getFederatedUserByInternalId.resolves({ getInternalId: () => 'differentId' });
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            roomAdapter.getInternalRoomRolesByUserId.resolves([]);
            yield (0, chai_1.expect)(service.beforeAddUserToARoom(Object.assign(Object.assign({}, validParams), { internalInviter: 'internalInviterId', internalRoomId: 'internalRoomId' }))).to.be.rejectedWith('You are not allowed to add users to this room');
            (0, chai_1.expect)(createUsersLocallyOnlySpy.called).to.be.false;
        }));
        it('should create the user locally if the inviter was provided and he/she is an owner', () => __awaiter(void 0, void 0, void 0, function* () {
            const createUsersLocallyOnlySpy = sinon_1.default.spy(service, 'createUsersLocallyOnly');
            userAdapter.getFederatedUserByInternalId.resolves({ getInternalId: () => 'differentId' });
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            roomAdapter.getInternalRoomRolesByUserId.resolves(['owner']);
            yield service.beforeAddUserToARoom(Object.assign(Object.assign({}, validParams), { internalInviter: 'internalInviterId', internalRoomId: 'internalRoomId' }));
            (0, chai_1.expect)(createUsersLocallyOnlySpy.calledWith(validParams.invitees)).to.be.true;
        }));
        it('should create the user locally if the inviter was provided and he/she is an moderator', () => __awaiter(void 0, void 0, void 0, function* () {
            const createUsersLocallyOnlySpy = sinon_1.default.spy(service, 'createUsersLocallyOnly');
            userAdapter.getFederatedUserByInternalId.resolves({ getInternalId: () => 'differentId' });
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            roomAdapter.getInternalRoomRolesByUserId.resolves(['moderator']);
            yield service.beforeAddUserToARoom(Object.assign(Object.assign({}, validParams), { internalInviter: 'internalInviterId', internalRoomId: 'internalRoomId' }));
            (0, chai_1.expect)(createUsersLocallyOnlySpy.calledWith(validParams.invitees)).to.be.true;
        }));
        it('should create the user locally if the inviter was provided and he/she is the room creator', () => __awaiter(void 0, void 0, void 0, function* () {
            const createUsersLocallyOnlySpy = sinon_1.default.spy(service, 'createUsersLocallyOnly');
            userAdapter.getFederatedUserByInternalId.resolves(federatedUser);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            roomAdapter.getInternalRoomRolesByUserId.resolves([]);
            yield service.beforeAddUserToARoom(Object.assign(Object.assign({}, validParams), { internalInviter: 'internalInviterId', internalRoomId: 'internalRoomId' }));
            (0, chai_1.expect)(createUsersLocallyOnlySpy.calledWith(validParams.invitees)).to.be.true;
        }));
        it('should create the invitee locally for each external user', () => __awaiter(void 0, void 0, void 0, function* () {
            const avatarSpy = sinon_1.default.spy(service, 'updateUserAvatarInternally');
            const displayNameSpy = sinon_1.default.spy(service, 'updateUserDisplayNameInternally');
            bridge.extractHomeserverOrigin.onCall(0).returns('externalDomain');
            bridge.extractHomeserverOrigin.onCall(1).returns('localDomain');
            bridge.getUserProfileInformation.resolves({ avatarUrl: 'avatarUrl', displayName: 'displayName' });
            userAdapter.getFederatedUserByExternalId.resolves(federatedUser);
            yield service.beforeAddUserToARoom(validParams);
            const invitee = FederatedUserEE.createLocalInstanceOnly({
                name: 'displayName',
                username: invitees[0].normalizedInviteeId,
                existsOnlyOnProxyServer: false,
            });
            (0, chai_1.expect)(userAdapter.createLocalUser.calledOnceWithExactly(invitee)).to.be.true;
            (0, chai_1.expect)(avatarSpy.calledWith(federatedUser, 'avatarUrl')).to.be.true;
            (0, chai_1.expect)(displayNameSpy.calledWith(federatedUser, 'displayName')).to.be.true;
        }));
        it('should NOT update the avatar nor the display name if both does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            bridge.extractHomeserverOrigin.onCall(0).returns('externalDomain');
            bridge.extractHomeserverOrigin.onCall(1).returns('localDomain');
            bridge.getUserProfileInformation.resolves({ avatarUrl: '', displayName: '' });
            userAdapter.getFederatedUserByExternalId.resolves(federatedUser);
            yield service.beforeAddUserToARoom(validParams);
            (0, chai_1.expect)(userAdapter.setAvatar.called).to.be.false;
            (0, chai_1.expect)(userAdapter.updateFederationAvatar.called).to.be.false;
            (0, chai_1.expect)(userAdapter.updateRealName.called).to.be.false;
        }));
        it('should NOT update the avatar url nor the display name if the user is from the local home server', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByExternalId.resolves(FederatedUserEE.createInstance('externalInviterId', {
                name: 'normalizedInviterId',
                username: 'normalizedInviterId',
                existsOnlyOnProxyServer: true,
            }));
            bridge.extractHomeserverOrigin.onCall(0).returns('externalDomain');
            bridge.extractHomeserverOrigin.onCall(1).returns('localDomain');
            bridge.getUserProfileInformation.resolves({ avatarUrl: 'avatarUrl', displayName: 'displayName' });
            yield service.beforeAddUserToARoom(validParams);
            (0, chai_1.expect)(userAdapter.setAvatar.called).to.be.false;
            (0, chai_1.expect)(userAdapter.updateFederationAvatar.called).to.be.false;
            (0, chai_1.expect)(userAdapter.updateRealName.called).to.be.false;
        }));
        it('should NOT update the avatar url if the url received in the event is equal to the one already used', () => __awaiter(void 0, void 0, void 0, function* () {
            const existsOnlyOnProxyServer = false;
            userAdapter.getFederatedUserByExternalId.resolves(FederatedUserEE.createWithInternalReference('externalInviterId', existsOnlyOnProxyServer, {
                federation: {
                    avatarUrl: 'avatarUrl',
                },
            }));
            bridge.extractHomeserverOrigin.onCall(0).returns('externalDomain');
            bridge.extractHomeserverOrigin.onCall(1).returns('localDomain');
            bridge.getUserProfileInformation.resolves({ avatarUrl: 'avatarUrl', displayName: 'displayName' });
            yield service.beforeAddUserToARoom(validParams);
            (0, chai_1.expect)(userAdapter.setAvatar.called).to.be.false;
            (0, chai_1.expect)(userAdapter.updateFederationAvatar.called).to.be.false;
        }));
        it('should call the functions to update the avatar internally correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const existsOnlyOnProxyServer = false;
            const userAvatar = FederatedUserEE.createWithInternalReference('externalInviterId', existsOnlyOnProxyServer, {
                federation: {
                    avatarUrl: 'currentAvatarUrl',
                },
                _id: 'userId',
            });
            userAdapter.getFederatedUserByExternalId.resolves(userAvatar);
            bridge.extractHomeserverOrigin.onCall(0).returns('externalDomain');
            bridge.extractHomeserverOrigin.onCall(1).returns('localDomain');
            bridge.getUserProfileInformation.resolves({ avatarUrl: 'avatarUrl', displayName: 'displayName' });
            yield service.beforeAddUserToARoom(validParams);
            (0, chai_1.expect)(userAdapter.setAvatar.calledWith(userAvatar, 'toHttpUrl')).to.be.true;
            (0, chai_1.expect)(userAdapter.updateFederationAvatar.calledWith(userAvatar.getInternalId(), 'avatarUrl')).to.be.true;
        }));
        it('should NOT update the display name if the name received in the event is equal to the one already used', () => __awaiter(void 0, void 0, void 0, function* () {
            const existsOnlyOnProxyServer = false;
            userAdapter.getFederatedUserByExternalId.resolves(FederatedUserEE.createWithInternalReference('externalInviterId', existsOnlyOnProxyServer, {
                name: 'displayName',
            }));
            bridge.extractHomeserverOrigin.onCall(0).returns('externalDomain');
            bridge.extractHomeserverOrigin.onCall(1).returns('localDomain');
            bridge.getUserProfileInformation.resolves({ avatarUrl: '', displayName: 'displayName' });
            yield service.beforeAddUserToARoom(validParams);
            (0, chai_1.expect)(userAdapter.setAvatar.called).to.be.false;
            (0, chai_1.expect)(userAdapter.updateFederationAvatar.called).to.be.false;
            (0, chai_1.expect)(userAdapter.updateRealName.called).to.be.false;
        }));
        it('should call the functions to update the display name internally correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const existsOnlyOnProxyServer = false;
            const user = FederatedUserEE.createWithInternalReference('externalInviterId', existsOnlyOnProxyServer, {
                _id: 'userId',
                name: 'currentName',
            });
            userAdapter.getFederatedUserByExternalId.resolves(user);
            bridge.extractHomeserverOrigin.onCall(0).returns('externalDomain');
            bridge.extractHomeserverOrigin.onCall(1).returns('localDomain');
            bridge.getUserProfileInformation.resolves({ avatarUrl: '', displayName: 'displayName' });
            yield service.beforeAddUserToARoom(validParams);
            (0, chai_1.expect)(userAdapter.setAvatar.called).to.be.false;
            (0, chai_1.expect)(userAdapter.updateFederationAvatar.called).to.be.false;
            (0, chai_1.expect)(userAdapter.updateRealName.calledWith(user.getInternalReference(), 'displayName')).to.be.true;
        }));
    });
    describe('#onUsersAddedToARoom()', () => {
        const user = FederatedUserEE.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: true,
        });
        const room = FederatedRoomEE.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
        it('should throw an error if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            roomAdapter.getInternalRoomById.resolves(undefined);
            yield (0, chai_1.expect)(service.onUsersAddedToARoom({ invitees, internalInviterId: 'internalInviterId', internalRoomId: 'internalRoomId' })).to.be.rejectedWith('Could not find the room to invite. RoomId: internalRoomId');
        }));
        it('should NOT create the inviter user if the user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.onCall(0).resolves(user);
            userAdapter.getFederatedUserByInternalId.onCall(1).resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            yield service.onUsersAddedToARoom({ internalInviterId: 'internalInviterId', invitees });
            (0, chai_1.expect)(bridge.createUser.called).to.be.false;
            (0, chai_1.expect)(userAdapter.createFederatedUser.called).to.be.false;
        }));
        it('should throw an error if the inviter user was not found and the user is not joining by himself', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getInternalUserById.resolves({ username: 'username', name: 'name' });
            yield (0, chai_1.expect)(service.onUsersAddedToARoom({ invitees, internalInviterId: 'internalInviterId' })).to.be.rejectedWith('User with internalId internalInviterId not found');
        }));
        it('should NOT throw an error if the inviter user was not found but the user is joining by himself (which means there is no inviter)', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            userAdapter.getInternalUserById.resolves({ username: 'username', name: 'name' });
            yield (0, chai_1.expect)(service.onUsersAddedToARoom({ invitees, internalInviterId: '' })).not.to.be.rejectedWith('User with internalId internalInviterId not found');
        }));
        it('should NOT create the invitee user if the user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            yield service.onUsersAddedToARoom({ internalInviterId: 'internalInviterId', invitees });
            (0, chai_1.expect)(userAdapter.createFederatedUser.called).to.be.false;
        }));
        it('should create the invitee user internally if it does not exists (using the username only if it is from the proxy home server)', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.onCall(0).resolves(undefined);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            bridge.extractHomeserverOrigin.returns('localDomain');
            yield service.onUsersAddedToARoom({ internalInviterId: 'internalInviterId', invitees });
            const invitee = FederatedUserEE.createInstance(invitees[0].rawInviteeId, {
                name: invitees[0].inviteeUsernameOnly,
                username: invitees[0].inviteeUsernameOnly,
                existsOnlyOnProxyServer: true,
            });
            (0, chai_1.expect)(userAdapter.createFederatedUser.calledWith(invitee)).to.be.true;
        }));
        it('should create the invitee user internally if it does not exists (using the normalized invite id if it is NOT from the proxy home server)', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.onCall(0).resolves(undefined);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            bridge.extractHomeserverOrigin.returns('externalDomain');
            yield service.onUsersAddedToARoom({ internalInviterId: 'internalInviterId', invitees });
            const invitee = FederatedUserEE.createInstance(invitees[0].rawInviteeId, {
                name: invitees[0].normalizedInviteeId,
                username: invitees[0].normalizedInviteeId,
                existsOnlyOnProxyServer: false,
            });
            (0, chai_1.expect)(userAdapter.createFederatedUser.calledWith(invitee)).to.be.true;
        }));
        it('should throw an error if the invitee user was not found', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(undefined);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            yield (0, chai_1.expect)(service.onUsersAddedToARoom({ invitees, internalInviterId: 'internalInviterId' })).to.be.rejectedWith(`User with internalUsername ${invitees[0].normalizedInviteeId} not found`);
        }));
        it('should create the invitee user on the proxy home server if the invitee is from the same home server AND it does not exists yet', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.getUserProfileInformation.resolves(undefined);
            yield service.onUsersAddedToARoom(Object.assign({ internalInviterId: 'internalInviterId', invitees, internalRoomId: 'internalRoomId' }, invitees[0]));
            (0, chai_1.expect)(bridge.createUser.calledWith(invitees[0].inviteeUsernameOnly, user.getName(), 'localDomain')).to.be.true;
        }));
        it('should NOT create the invitee user on the proxy home server if the invitee is from the same home server but it already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            bridge.extractHomeserverOrigin.returns('localDomain');
            bridge.getUserProfileInformation.resolves({});
            yield service.onUsersAddedToARoom(Object.assign({ internalInviterId: 'internalInviterId', invitees, internalRoomId: 'internalRoomId' }, invitees[0]));
            (0, chai_1.expect)(bridge.createUser.called).to.be.false;
        }));
        it('should NOT create the invitee user on the proxy home server if its not from the same home server', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(user);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            bridge.extractHomeserverOrigin.returns('externalDomain');
            yield service.onUsersAddedToARoom(Object.assign({ internalInviterId: 'internalInviterId', invitees, internalRoomId: 'internalRoomId' }, invitees[0]));
            (0, chai_1.expect)(bridge.createUser.called).to.be.false;
        }));
        it('should NOT auto-join the user to the room if the user is auto-joining the room but he is NOT from the same homeserver', () => __awaiter(void 0, void 0, void 0, function* () {
            const invitee = FederatedUserEE.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: true,
            });
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            userAdapter.getFederatedUserByInternalUsername.resolves(invitee);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            bridge.extractHomeserverOrigin.returns('externalDomain');
            yield service.onUsersAddedToARoom(Object.assign({ internalInviterId: '', invitees, internalRoomId: 'internalRoomId' }, invitees[0]));
            (0, chai_1.expect)(bridge.joinRoom.called).to.be.false;
            (0, chai_1.expect)(bridge.inviteToRoom.called).to.be.false;
        }));
        it('should auto-join the user to the room if the user is auto-joining the room', () => __awaiter(void 0, void 0, void 0, function* () {
            const invitee = FederatedUserEE.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: true,
            });
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            userAdapter.getFederatedUserByInternalUsername.resolves(invitee);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            bridge.extractHomeserverOrigin.returns('localDomain');
            yield service.onUsersAddedToARoom(Object.assign({ internalInviterId: '', invitees, internalRoomId: 'internalRoomId' }, invitees[0]));
            (0, chai_1.expect)(bridge.joinRoom.calledWith(room.getExternalId(), invitee.getExternalId())).to.be.true;
            (0, chai_1.expect)(bridge.inviteToRoom.called).to.be.false;
        }));
        it('should invite the user to the user only if the user is NOT auto-joining the room', () => __awaiter(void 0, void 0, void 0, function* () {
            const invitee = FederatedUserEE.createInstance('externalInviteeId', {
                name: 'normalizedInviteeId',
                username: 'normalizedInviteeId',
                existsOnlyOnProxyServer: true,
            });
            userAdapter.getFederatedUserByInternalId.resolves(user);
            userAdapter.getFederatedUserByInternalUsername.resolves(invitee);
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            yield service.onUsersAddedToARoom(Object.assign({ internalInviterId: 'internalInviterId', invitees, internalRoomId: 'internalRoomId' }, invitees[0]));
            (0, chai_1.expect)(bridge.inviteToRoom.calledWith(room.getExternalId(), user.getExternalId(), invitee.getExternalId())).to.be.true;
        }));
    });
    describe('#searchPublicRooms()', () => {
        it('should throw an error if the federation is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(false);
            yield (0, chai_1.expect)(service.searchPublicRooms({})).to.be.rejectedWith('Federation is disabled');
        }));
        it('should call the bridge search public rooms with the provided server name', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(true);
            yield service.searchPublicRooms({ serverName: 'serverName' });
            (0, chai_1.expect)(bridge.searchPublicRooms.calledWith({
                serverName: 'serverName',
                roomName: undefined,
                limit: undefined,
                pageToken: undefined,
            })).to.be.true;
        }));
        it('should call the bridge search public rooms with the proxy home server name when the server name was not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(true);
            yield service.searchPublicRooms({});
            (0, chai_1.expect)(bridge.searchPublicRooms.calledWith({
                serverName: 'localDomain',
                roomName: undefined,
                limit: undefined,
                pageToken: undefined,
            })).to.be.true;
        }));
        it('should return the Matrix public rooms for the server', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(true);
            settingsAdapter.getMaximumSizeOfUsersWhenJoiningPublicRooms.returns('100');
            bridge.searchPublicRooms.resolves({
                chunk: [
                    {
                        room_id: 'externalRoomId',
                        name: 'externalRoomName',
                        num_joined_members: 1,
                        topic: 'externalRoomTopic',
                        canonical_alias: 'externalRoomAlias',
                        join_rule: 'public',
                    },
                    {
                        room_id: 'externalRoomId2',
                        name: 'externalRoomName2',
                        num_joined_members: 1,
                        topic: 'externalRoomTopic2',
                        canonical_alias: 'externalRoomAlias2',
                        join_rule: 'public',
                    },
                ],
                next_batch: 'next_batch',
                prev_batch: 'prev_batch',
                total_room_count_estimate: 10000,
            });
            const result = yield service.searchPublicRooms({});
            (0, chai_1.expect)(result).to.be.eql({
                rooms: [
                    {
                        id: 'externalRoomId',
                        name: 'externalRoomName',
                        joinedMembers: 1,
                        topic: 'externalRoomTopic',
                        canonicalAlias: 'externalRoomAlias',
                        canJoin: true,
                        pageToken: undefined,
                    },
                    {
                        id: 'externalRoomId2',
                        name: 'externalRoomName2',
                        joinedMembers: 1,
                        topic: 'externalRoomTopic2',
                        canonicalAlias: 'externalRoomAlias2',
                        canJoin: true,
                        pageToken: undefined,
                    },
                ],
                count: 2,
                total: 10000,
                nextPageToken: 'next_batch',
                prevPageToken: 'prev_batch',
            });
        }));
        it('should return the Matrix public rooms for the server filtering all the rooms that is not possible to join', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(true);
            settingsAdapter.getMaximumSizeOfUsersWhenJoiningPublicRooms.returns('100');
            bridge.searchPublicRooms.resolves({
                chunk: [
                    {
                        room_id: 'externalRoomId',
                        name: 'externalRoomName',
                        num_joined_members: 1,
                        topic: 'externalRoomTopic',
                        canonical_alias: 'externalRoomAlias',
                        join_rule: 'public',
                    },
                    {
                        room_id: 'externalRoomId2',
                        name: 'externalRoomName2',
                        num_joined_members: 1,
                        topic: 'externalRoomTopic2',
                        canonical_alias: 'externalRoomAlias2',
                        join_rule: 'knock',
                    },
                ],
                next_batch: 'next_batch',
                prev_batch: 'prev_batch',
                total_room_count_estimate: 10000,
            });
            const result = yield service.searchPublicRooms({});
            (0, chai_1.expect)(result).to.be.eql({
                rooms: [
                    {
                        id: 'externalRoomId',
                        name: 'externalRoomName',
                        joinedMembers: 1,
                        topic: 'externalRoomTopic',
                        canonicalAlias: 'externalRoomAlias',
                        canJoin: true,
                        pageToken: undefined,
                    },
                ],
                count: 2,
                total: 10000,
                nextPageToken: 'next_batch',
                prevPageToken: 'prev_batch',
            });
        }));
        it('should return the Matrix public rooms for the server filtering all the rooms that is not possible to join (all of the as canJoin = false, since they have more users than the allowed)', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(true);
            settingsAdapter.getMaximumSizeOfUsersWhenJoiningPublicRooms.returns('100');
            bridge.searchPublicRooms.resolves({
                chunk: [
                    {
                        room_id: 'externalRoomId',
                        name: 'externalRoomName',
                        num_joined_members: 101,
                        topic: 'externalRoomTopic',
                        canonical_alias: 'externalRoomAlias',
                        join_rule: 'public',
                    },
                    {
                        room_id: 'externalRoomId2',
                        name: 'externalRoomName2',
                        num_joined_members: 4000,
                        topic: 'externalRoomTopic2',
                        canonical_alias: 'externalRoomAlias2',
                        join_rule: 'knock',
                    },
                ],
                next_batch: 'next_batch',
                prev_batch: 'prev_batch',
                total_room_count_estimate: 10000,
            });
            const result = yield service.searchPublicRooms({});
            (0, chai_1.expect)(result).to.be.eql({
                rooms: [
                    {
                        id: 'externalRoomId',
                        name: 'externalRoomName',
                        joinedMembers: 101,
                        topic: 'externalRoomTopic',
                        canonicalAlias: 'externalRoomAlias',
                        canJoin: false,
                        pageToken: undefined,
                    },
                ],
                count: 2,
                total: 10000,
                nextPageToken: 'next_batch',
                prevPageToken: 'prev_batch',
            });
        }));
        it('should return the Matrix public rooms for the server including a valid pageToken for each room', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(true);
            settingsAdapter.getMaximumSizeOfUsersWhenJoiningPublicRooms.returns('100');
            bridge.searchPublicRooms.resolves({
                chunk: [
                    {
                        room_id: 'externalRoomId',
                        name: 'externalRoomName',
                        num_joined_members: 101,
                        topic: 'externalRoomTopic',
                        canonical_alias: 'externalRoomAlias',
                        join_rule: 'public',
                    },
                    {
                        room_id: 'externalRoomId2',
                        name: 'externalRoomName2',
                        num_joined_members: 4000,
                        topic: 'externalRoomTopic2',
                        canonical_alias: 'externalRoomAlias2',
                        join_rule: 'knock',
                    },
                ],
                next_batch: 'next_batch',
                prev_batch: 'prev_batch',
                total_room_count_estimate: 10000,
            });
            const result = yield service.searchPublicRooms({ pageToken: 'pageToken' });
            (0, chai_1.expect)(result).to.be.eql({
                rooms: [
                    {
                        id: 'externalRoomId',
                        name: 'externalRoomName',
                        joinedMembers: 101,
                        topic: 'externalRoomTopic',
                        canonicalAlias: 'externalRoomAlias',
                        canJoin: false,
                        pageToken: 'pageToken',
                    },
                ],
                count: 2,
                total: 10000,
                nextPageToken: 'next_batch',
                prevPageToken: 'prev_batch',
            });
        }));
    });
    describe('#scheduleJoinExternalPublicRoom()', () => {
        it('should throw an error if the federation is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(false);
            yield (0, chai_1.expect)(service.scheduleJoinExternalPublicRoom({})).to.be.rejectedWith('Federation is disabled');
        }));
        it('should enqueue a job to join the room', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(true);
            const internalUserId = 'internalUserId';
            const externalRoomId = 'externalRoomId';
            const roomName = 'roomName';
            const pageToken = 'pageToken';
            yield service.scheduleJoinExternalPublicRoom(internalUserId, externalRoomId, roomName, pageToken);
            (0, chai_1.expect)(queueAdapter.enqueueJob.calledOnceWithExactly('federation-enterprise.joinExternalPublicRoom', {
                internalUserId,
                externalRoomId,
                roomName,
                pageToken,
            }));
        }));
        describe('#joinExternalPublicRoom()', () => {
            const user = FederatedUserEE.createInstance('externalInviterId', {
                name: 'normalizedInviterId',
                username: 'normalizedInviterId',
                existsOnlyOnProxyServer: true,
            });
            const room = FederatedRoomEE.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
            it('should throw an error if the federation is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
                settingsAdapter.isFederationEnabled.returns(false);
                yield (0, chai_1.expect)(service.joinExternalPublicRoom({})).to.be.rejectedWith('Federation is disabled');
            }));
            it('should throw an error if the user already joined the room', () => __awaiter(void 0, void 0, void 0, function* () {
                settingsAdapter.isFederationEnabled.returns(true);
                roomAdapter.getFederatedRoomByExternalId.resolves(room);
                roomAdapter.isUserAlreadyJoined.resolves(true);
                yield (0, chai_1.expect)(service.joinExternalPublicRoom({})).to.be.rejectedWith('already-joined');
            }));
            it('should NOT create an external user if it already exists', () => __awaiter(void 0, void 0, void 0, function* () {
                settingsAdapter.isFederationEnabled.returns(true);
                userAdapter.getFederatedUserByInternalId.resolves(user);
                const spy = sinon_1.default.spy(service, 'createFederatedUserIncludingHomeserverUsingLocalInformation');
                sinon_1.default.stub(service, 'isRoomSizeAllowed').returns(true);
                yield service.joinExternalPublicRoom({});
                (0, chai_1.expect)(spy.called).to.be.false;
            }));
            it('should create an external user if it does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                settingsAdapter.isFederationEnabled.returns(true);
                userAdapter.getFederatedUserByInternalId.onFirstCall().resolves(undefined);
                userAdapter.getInternalUserById.resolves({ _id: 'id', username: 'username' });
                userAdapter.getFederatedUserByInternalId.resolves(user);
                const spy = sinon_1.default.spy(service, 'createFederatedUserIncludingHomeserverUsingLocalInformation');
                sinon_1.default.stub(service, 'isRoomSizeAllowed').returns(true);
                yield service.joinExternalPublicRoom({ internalUserId: 'internalUserId' });
                (0, chai_1.expect)(spy.calledWith('internalUserId')).to.be.true;
            }));
            it('should throw an error if the federated user was not found even after creation', () => __awaiter(void 0, void 0, void 0, function* () {
                settingsAdapter.isFederationEnabled.returns(true);
                userAdapter.getFederatedUserByInternalId.resolves(undefined);
                userAdapter.getInternalUserById.resolves({ _id: 'id', username: 'username' });
                yield (0, chai_1.expect)(service.joinExternalPublicRoom({ internalUserId: 'internalUserId' })).to.be.rejectedWith('User with internalId internalUserId not found');
            }));
            it('should throw an error if the room the user is trying to join does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
                settingsAdapter.isFederationEnabled.returns(true);
                userAdapter.getFederatedUserByInternalId.resolves(user);
                userAdapter.getInternalUserById.resolves({ _id: 'id', username: 'username' });
                bridge.searchPublicRooms.resolves({ chunk: [{ room_id: 'differentId' }] });
                yield (0, chai_1.expect)(service.joinExternalPublicRoom({ internalUserId: 'internalUserId', externalRoomId: 'externalRoomId' })).to.be.rejectedWith("Cannot find the room you're trying to join");
            }));
            it('should throw an error if the room the user is trying to join does not exists due to the server was not able to search', () => __awaiter(void 0, void 0, void 0, function* () {
                settingsAdapter.isFederationEnabled.returns(true);
                userAdapter.getFederatedUserByInternalId.resolves(user);
                userAdapter.getInternalUserById.resolves({ _id: 'id', username: 'username' });
                bridge.searchPublicRooms.rejects();
                yield (0, chai_1.expect)(service.joinExternalPublicRoom({ internalUserId: 'internalUserId', externalRoomId: 'externalRoomId' })).to.be.rejectedWith("Cannot find the room you're trying to join");
            }));
            it('should throw an error if the room the user is trying to join contains more users (its bigger) than the allowed by the setting', () => __awaiter(void 0, void 0, void 0, function* () {
                settingsAdapter.isFederationEnabled.returns(true);
                settingsAdapter.getMaximumSizeOfUsersWhenJoiningPublicRooms.returns('100');
                userAdapter.getFederatedUserByInternalId.resolves(user);
                userAdapter.getInternalUserById.resolves({ _id: 'id', username: 'username' });
                bridge.searchPublicRooms.resolves({ chunk: [{ room_id: 'externalRoomId', num_joined_members: 101 }] });
                yield (0, chai_1.expect)(service.joinExternalPublicRoom({ internalUserId: 'internalUserId', externalRoomId: 'externalRoomId' })).to.be.rejectedWith("Can't join a room bigger than the admin of your workspace has set as the maximum size");
            }));
            it('should join the user to the remote room', () => __awaiter(void 0, void 0, void 0, function* () {
                settingsAdapter.isFederationEnabled.returns(true);
                userAdapter.getFederatedUserByInternalId.resolves(user);
                sinon_1.default.stub(service, 'isRoomSizeAllowed').returns(true);
                yield service.joinExternalPublicRoom({
                    externalRoomId: 'externalRoomId',
                    internalUserId: 'internalUserId',
                    externalRoomHomeServerName: 'externalRoomHomeServerName',
                });
                (0, chai_1.expect)(bridge.joinRoom.calledWith('externalRoomId', user.getExternalId(), ['externalRoomHomeServerName'])).to.be.true;
            }));
        });
    });
});
