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
const { FederationUserServiceSender } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../../server/services/federation/application/user/sender/UserServiceSender', {
    mongodb: {
        'ObjectId': class ObjectId {
            toHexString() {
                return 'hexString';
            }
        },
        '@global': true,
    },
});
const { FederatedUser } = proxyquire_1.default.noCallThru().load('../../../../../../../server/services/federation/domain/FederatedUser', {
    mongodb: {
        'ObjectId': class ObjectId {
            toHexString() {
                return 'hexString';
            }
        },
        '@global': true,
    },
});
const { FederatedRoom } = proxyquire_1.default.noCallThru().load('../../../../../../../server/services/federation/domain/FederatedRoom', {
    mongodb: {
        'ObjectId': class ObjectId {
            toHexString() {
                return 'hexString';
            }
        },
        '@global': true,
    },
});
describe('Federation - Application - FederationUserServiceSender', () => {
    let service;
    const userAdapter = {
        getFederatedUserByExternalId: sinon_1.default.stub(),
        getFederatedUserByInternalId: sinon_1.default.stub(),
        getInternalUserById: sinon_1.default.stub(),
        updateFederationAvatar: sinon_1.default.stub(),
        getFederatedUserByInternalUsername: sinon_1.default.stub(),
        getInternalUserByUsername: sinon_1.default.stub(),
        createFederatedUser: sinon_1.default.stub(),
    };
    const settingsAdapter = {
        getHomeServerDomain: sinon_1.default.stub().returns('localDomain'),
        isTypingStatusEnabled: sinon_1.default.stub(),
    };
    const fileAdapter = {
        getBufferForAvatarFile: sinon_1.default.stub(),
        getFileMetadataForAvatarFile: sinon_1.default.stub(),
    };
    const bridge = {
        uploadContent: sinon_1.default.stub(),
        setUserAvatar: sinon_1.default.stub(),
        notifyUserTyping: sinon_1.default.stub(),
        setUserDisplayName: sinon_1.default.stub(),
        createUser: sinon_1.default.stub(),
        getUserProfileInformation: sinon_1.default.stub(),
    };
    const roomAdapter = {
        getFederatedRoomByInternalId: sinon_1.default.stub(),
        setUserDisplayName: sinon_1.default.stub(),
        createUser: sinon_1.default.stub(),
        getUserProfileInformation: sinon_1.default.stub(),
    };
    beforeEach(() => {
        service = new FederationUserServiceSender(roomAdapter, userAdapter, fileAdapter, settingsAdapter, bridge);
    });
    afterEach(() => {
        userAdapter.getFederatedUserByInternalId.reset();
        userAdapter.getFederatedUserByExternalId.reset();
        userAdapter.updateFederationAvatar.reset();
        userAdapter.getInternalUserById.reset();
        userAdapter.getInternalUserByUsername.reset();
        userAdapter.getFederatedUserByInternalUsername.reset();
        userAdapter.createFederatedUser.reset();
        fileAdapter.getBufferForAvatarFile.reset();
        fileAdapter.getFileMetadataForAvatarFile.reset();
        bridge.uploadContent.reset();
        bridge.setUserAvatar.reset();
        bridge.notifyUserTyping.reset();
        settingsAdapter.isTypingStatusEnabled.reset();
        roomAdapter.getFederatedRoomByInternalId.reset();
        bridge.setUserDisplayName.reset();
        bridge.createUser.reset();
        bridge.getUserProfileInformation.reset();
    });
    describe('#afterUserAvatarChanged()', () => {
        const userAvatar = FederatedUser.createInstance('externalInviterId', {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            existsOnlyOnProxyServer: true,
        });
        it('should NOT update the avatar externally if the user does not exists remotely nor locally', () => __awaiter(void 0, void 0, void 0, function* () {
            const spy = sinon_1.default.spy(service, 'createFederatedUserIncludingHomeserverUsingLocalInformation');
            userAdapter.getFederatedUserByInternalUsername.resolves(undefined);
            userAdapter.getInternalUserByUsername.resolves(undefined);
            yield service.afterUserAvatarChanged({});
            (0, chai_1.expect)(fileAdapter.getBufferForAvatarFile.called).to.be.false;
            (0, chai_1.expect)(spy.called).to.be.false;
        }));
        it('should create a federated user first if it does not exists yet, but it does exists locally only (the case when the local user didnt have any contact with federation yet', () => __awaiter(void 0, void 0, void 0, function* () {
            const spy = sinon_1.default.spy(service, 'createFederatedUserIncludingHomeserverUsingLocalInformation');
            userAdapter.getFederatedUserByInternalUsername.resolves(undefined);
            userAdapter.getInternalUserById.resolves({ username: 'username' });
            userAdapter.getInternalUserByUsername.resolves({ _id: 'id' });
            yield service.afterUserAvatarChanged({});
            (0, chai_1.expect)(spy.calledWith('id')).to.be.true;
        }));
        it('should NOT update the avatar externally if the user exists but is from an external home server', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(FederatedUser.createInstance('externalInviterId', {
                name: 'normalizedInviterId',
                username: 'normalizedInviterId',
                existsOnlyOnProxyServer: false,
            }));
            yield service.afterUserAvatarChanged('username');
            (0, chai_1.expect)(fileAdapter.getBufferForAvatarFile.called).to.be.false;
        }));
        it('should NOT update the avatar externally if the buffer from the image does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalUsername.resolves(userAvatar);
            fileAdapter.getBufferForAvatarFile.resolves(undefined);
            yield service.afterUserAvatarChanged('username');
            (0, chai_1.expect)(fileAdapter.getFileMetadataForAvatarFile.called).to.be.false;
        }));
        it('should NOT update the avatar externally if the avatar metadata (type) does not exists locally', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalUsername.resolves(userAvatar);
            fileAdapter.getBufferForAvatarFile.resolves({});
            fileAdapter.getFileMetadataForAvatarFile.resolves({ name: 'name' });
            yield service.afterUserAvatarChanged('username');
            (0, chai_1.expect)(bridge.uploadContent.called).to.be.false;
        }));
        it('should NOT update the avatar externally if the avatar metadata (name) does not exists locally', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalUsername.resolves(userAvatar);
            fileAdapter.getBufferForAvatarFile.resolves({});
            fileAdapter.getFileMetadataForAvatarFile.resolves({ type: 'type' });
            yield service.afterUserAvatarChanged('username');
            (0, chai_1.expect)(bridge.uploadContent.called).to.be.false;
        }));
        it('should NOT update the avatar externally if the upload to the Matrix server didnt execute correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalUsername.resolves(userAvatar);
            fileAdapter.getBufferForAvatarFile.resolves({});
            fileAdapter.getFileMetadataForAvatarFile.resolves({ type: 'type', name: 'name' });
            bridge.uploadContent.resolves(undefined);
            yield service.afterUserAvatarChanged('username');
            (0, chai_1.expect)(userAdapter.updateFederationAvatar.called).to.be.false;
            (0, chai_1.expect)(bridge.setUserAvatar.called).to.be.false;
        }));
        it('should update the avatar externally correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalUsername.resolves(FederatedUser.createWithInternalReference('externalInviterId', true, {
                name: 'normalizedInviterId',
                username: 'normalizedInviterId',
                _id: '_id',
            }));
            fileAdapter.getBufferForAvatarFile.resolves({});
            fileAdapter.getFileMetadataForAvatarFile.resolves({ type: 'type', name: 'name' });
            bridge.uploadContent.resolves('url');
            yield service.afterUserAvatarChanged('username');
            (0, chai_1.expect)(userAdapter.updateFederationAvatar.calledWith('_id', 'url')).to.be.true;
            (0, chai_1.expect)(bridge.setUserAvatar.calledWith('externalInviterId', 'url')).to.be.true;
        }));
    });
    describe('#afterUserRealNameChanged()', () => {
        it('should NOT update the name externally if the user does not exists remotely nor locally', () => __awaiter(void 0, void 0, void 0, function* () {
            const spy = sinon_1.default.spy(service, 'createFederatedUserIncludingHomeserverUsingLocalInformation');
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            userAdapter.getInternalUserById.resolves(undefined);
            yield service.afterUserRealNameChanged('id', 'name');
            (0, chai_1.expect)(bridge.setUserDisplayName.called).to.be.false;
            (0, chai_1.expect)(spy.called).to.be.false;
        }));
        it('should create a federated user first if it does not exists yet, but it does exists locally only (the case when the local user didnt have any contact with federation yet', () => __awaiter(void 0, void 0, void 0, function* () {
            const spy = sinon_1.default.spy(service, 'createFederatedUserIncludingHomeserverUsingLocalInformation');
            userAdapter.getFederatedUserByInternalId.resolves(undefined);
            userAdapter.getInternalUserById.resolves({ _id: 'id', username: 'username' });
            yield service.afterUserRealNameChanged('id', 'name');
            (0, chai_1.expect)(spy.calledWith('id')).to.be.true;
        }));
        it('should NOT update the name externally if the user exists but is from an external home server', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(FederatedUser.createInstance('externalInviterId', {
                name: 'normalizedInviterId',
                username: 'normalizedInviterId',
                existsOnlyOnProxyServer: false,
            }));
            yield service.afterUserRealNameChanged('id', 'name');
            (0, chai_1.expect)(bridge.setUserDisplayName.called).to.be.false;
        }));
        it('should NOT update the name externally if the external username is equal to the current one', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(FederatedUser.createInstance('externalInviterId', {
                name: 'normalizedInviterId',
                username: 'normalizedInviterId',
                existsOnlyOnProxyServer: false,
            }));
            bridge.getUserProfileInformation.resolves({ displayname: 'normalizedInviterId' });
            yield service.afterUserRealNameChanged('id', 'name');
            (0, chai_1.expect)(bridge.setUserDisplayName.called).to.be.false;
        }));
        it('should update the name externally correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            userAdapter.getFederatedUserByInternalId.resolves(FederatedUser.createWithInternalReference('externalInviterId', true, {
                name: 'normalizedInviterId',
                username: 'normalizedInviterId',
                _id: '_id',
            }));
            bridge.getUserProfileInformation.resolves({ displayname: 'different' });
            yield service.afterUserRealNameChanged('id', 'name');
            (0, chai_1.expect)(bridge.setUserDisplayName.calledWith('externalInviterId', 'name')).to.be.true;
        }));
    });
    describe('#onUserTyping()', () => {
        const user = FederatedUser.createWithInternalReference('externalInviterId', true, {
            name: 'normalizedInviterId',
            username: 'normalizedInviterId',
            _id: '_id',
        });
        it('should NOT notify about the typing event externally if the setting is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isTypingStatusEnabled.returns(false);
            yield service.onUserTyping({});
            (0, chai_1.expect)(bridge.notifyUserTyping.called).to.be.false;
        }));
        it('should NOT notify about the typing event externally if the user does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isTypingStatusEnabled.returns(true);
            userAdapter.getFederatedUserByInternalUsername.resolves(undefined);
            yield service.onUserTyping({});
            (0, chai_1.expect)(bridge.notifyUserTyping.called).to.be.false;
        }));
        it('should NOT notify about the typing event externally if the room does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isTypingStatusEnabled.returns(true);
            userAdapter.getFederatedUserByInternalUsername.resolves({});
            yield service.onUserTyping({});
            (0, chai_1.expect)(bridge.notifyUserTyping.called).to.be.false;
        }));
        it('should notify about the typing event externally correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            const room = FederatedRoom.createInstance('externalRoomId', 'normalizedRoomId', user, rooms_1.RoomType.CHANNEL, 'externalRoomName');
            settingsAdapter.isTypingStatusEnabled.returns(true);
            userAdapter.getFederatedUserByInternalUsername.resolves(FederatedUser.createWithInternalReference('externalInviterId', true, {
                name: 'normalizedInviterId',
                username: 'normalizedInviterId',
                _id: '_id',
            }));
            roomAdapter.getFederatedRoomByInternalId.resolves(room);
            const isTyping = true;
            yield service.onUserTyping('internalUsername', 'internalRoomId', isTyping);
            (0, chai_1.expect)(bridge.notifyUserTyping.calledWith(room.getExternalId(), user.getExternalId(), isTyping)).to.be.true;
        }));
    });
});
