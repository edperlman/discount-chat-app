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
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const { FederationUserServiceEE } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../server/local-services/federation/application/UserService', {
    mongodb: {
        'ObjectId': class ObjectId {
            toHexString() {
                return 'hexString';
            }
        },
        '@global': true,
    },
});
describe('FederationEE - Application - FederationUserServiceEE', () => {
    let service;
    const roomAdapter = {
        getFederatedRoomByExternalId: sinon_1.default.stub(),
        createFederatedRoom: sinon_1.default.stub(),
        addUserToRoom: sinon_1.default.stub(),
        getFederatedRoomByInternalId: sinon_1.default.stub(),
        isUserAlreadyJoined: sinon_1.default.stub(),
    };
    const userAdapter = {
        getFederatedUserByExternalId: sinon_1.default.stub(),
        getFederatedUserByInternalId: sinon_1.default.stub(),
        getInternalUserById: sinon_1.default.stub(),
        getFederatedUserByInternalUsername: sinon_1.default.stub(),
        createFederatedUser: sinon_1.default.stub(),
        getInternalUserByUsername: sinon_1.default.stub(),
        getSearchedServerNamesByUserId: sinon_1.default.stub(),
        addServerNameToSearchedServerNamesListByUserId: sinon_1.default.stub(),
        removeServerNameFromSearchedServerNamesListByUserId: sinon_1.default.stub(),
    };
    const settingsAdapter = {
        getHomeServerDomain: sinon_1.default.stub().returns('localDomain'),
        isFederationEnabled: sinon_1.default.stub(),
    };
    const bridge = {
        createUser: sinon_1.default.stub(),
        joinRoom: sinon_1.default.stub(),
        getRoomData: sinon_1.default.stub(),
        getUserProfileInformation: sinon_1.default.stub(),
        extractHomeserverOrigin: sinon_1.default.stub(),
        searchPublicRooms: sinon_1.default.stub(),
    };
    const fileAdapter = {
        getBufferForAvatarFile: sinon_1.default.stub(),
    };
    beforeEach(() => {
        service = new FederationUserServiceEE(settingsAdapter, fileAdapter, userAdapter, bridge);
    });
    afterEach(() => {
        roomAdapter.getFederatedRoomByExternalId.reset();
        roomAdapter.createFederatedRoom.reset();
        roomAdapter.addUserToRoom.reset();
        roomAdapter.getFederatedRoomByInternalId.reset();
        roomAdapter.isUserAlreadyJoined.reset();
        userAdapter.getFederatedUserByExternalId.reset();
        userAdapter.getFederatedUserByInternalId.reset();
        userAdapter.getInternalUserById.reset();
        userAdapter.getFederatedUserByInternalUsername.reset();
        userAdapter.createFederatedUser.reset();
        userAdapter.getInternalUserByUsername.reset();
        userAdapter.getSearchedServerNamesByUserId.reset();
        userAdapter.addServerNameToSearchedServerNamesListByUserId.reset();
        userAdapter.removeServerNameFromSearchedServerNamesListByUserId.reset();
        settingsAdapter.isFederationEnabled.reset();
        bridge.createUser.reset();
        bridge.joinRoom.reset();
        bridge.getUserProfileInformation.reset();
        bridge.getRoomData.reset();
        bridge.searchPublicRooms.reset();
        fileAdapter.getBufferForAvatarFile.reset();
    });
    describe('#getSearchedServerNamesByInternalUserId()', () => {
        it('should throw an error if the federation is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(false);
            yield (0, chai_1.expect)(service.getSearchedServerNamesByInternalUserId({})).to.be.rejectedWith('Federation is disabled');
        }));
        it('should return the Matrix default public rooms + the ones already saved by the user', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(true);
            userAdapter.getSearchedServerNamesByUserId.resolves(['server1.com', 'server2.com']);
            const result = yield service.getSearchedServerNamesByInternalUserId({});
            (0, chai_1.expect)(result).to.be.eql([
                {
                    name: 'localDomain',
                    default: true,
                    local: true,
                },
                {
                    name: 'matrix.org',
                    default: true,
                    local: false,
                },
                {
                    name: 'gitter.im',
                    default: true,
                    local: false,
                },
                {
                    name: 'libera.chat',
                    default: true,
                    local: false,
                },
                {
                    name: 'server1.com',
                    default: false,
                    local: false,
                },
                {
                    name: 'server2.com',
                    default: false,
                    local: false,
                },
            ]);
        }));
    });
    describe('#addSearchedServerNameByInternalUserId()', () => {
        it('should throw an error if the federation is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(false);
            yield (0, chai_1.expect)(service.addSearchedServerNameByInternalUserId('internalUserId', 'serverName')).to.be.rejectedWith('Federation is disabled');
        }));
        it('should throw an error when trying to add a default server', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(true);
            yield (0, chai_1.expect)(service.addSearchedServerNameByInternalUserId('internalUserId', 'matrix.org')).to.be.rejectedWith('already-a-default-server');
        }));
        it('should call the bridge to check if the server is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(true);
            bridge.searchPublicRooms.resolves();
            yield service.addSearchedServerNameByInternalUserId('internalUserId', 'serverName');
            (0, chai_1.expect)(bridge.searchPublicRooms.calledWith({ serverName: 'serverName' })).to.be.true;
        }));
        it('should call the function to add the server name', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(true);
            bridge.searchPublicRooms.resolves();
            yield service.addSearchedServerNameByInternalUserId('internalUserId', 'serverName');
            (0, chai_1.expect)(userAdapter.addServerNameToSearchedServerNamesListByUserId.calledWith('internalUserId', 'serverName')).to.be.true;
        }));
    });
    describe('#removeSearchedServerNameByInternalUserId()', () => {
        it('should throw an error if the federation is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(false);
            yield (0, chai_1.expect)(service.removeSearchedServerNameByInternalUserId('internalUserId', 'serverName')).to.be.rejectedWith('Federation is disabled');
        }));
        it('should throw an error when trying to remove a default server', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(true);
            yield (0, chai_1.expect)(service.removeSearchedServerNameByInternalUserId('internalUserId', 'matrix.org')).to.be.rejectedWith('cannot-remove-default-server');
        }));
        it('should throw an error when the server does not exists', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(true);
            userAdapter.getSearchedServerNamesByUserId.resolves([]);
            yield (0, chai_1.expect)(service.removeSearchedServerNameByInternalUserId('internalUserId', 'serverName')).to.be.rejectedWith('server-not-found');
        }));
        it('should call the function to remove the server name', () => __awaiter(void 0, void 0, void 0, function* () {
            settingsAdapter.isFederationEnabled.returns(true);
            userAdapter.getSearchedServerNamesByUserId.resolves(['serverName']);
            yield service.removeSearchedServerNameByInternalUserId('internalUserId', 'serverName');
            (0, chai_1.expect)(userAdapter.removeServerNameFromSearchedServerNamesListByUserId.calledWith('internalUserId', 'serverName')).to.be.true;
        }));
    });
});
