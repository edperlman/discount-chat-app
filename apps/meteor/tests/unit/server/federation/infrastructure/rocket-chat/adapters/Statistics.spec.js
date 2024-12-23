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
const get = sinon_1.default.stub();
const findBiggestFederatedRoomInNumberOfUsers = sinon_1.default.stub();
const findSmallestFederatedRoomInNumberOfUsers = sinon_1.default.stub();
const countFederatedExternalUsers = sinon_1.default.stub();
const countFederatedRooms = sinon_1.default.stub();
const getExternalServerConnectedExcluding = sinon_1.default.stub();
const { getMatrixFederationStatistics } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../../server/services/federation/infrastructure/rocket-chat/adapters/Statistics', {
    '../../../../../../app/settings/server': {
        settings: {
            get,
        },
    },
    '@rocket.chat/models': {
        MatrixBridgedRoom: {
            getExternalServerConnectedExcluding,
        },
        Rooms: {
            findBiggestFederatedRoomInNumberOfUsers,
            findSmallestFederatedRoomInNumberOfUsers,
            countFederatedRooms,
        },
        Users: {
            countFederatedExternalUsers,
        },
    },
});
describe('Federation - Infrastructure - RocketChat - Statistics', () => {
    afterEach(() => {
        findBiggestFederatedRoomInNumberOfUsers.reset();
        findSmallestFederatedRoomInNumberOfUsers.reset();
        countFederatedExternalUsers.reset();
        countFederatedRooms.reset();
        getExternalServerConnectedExcluding.reset();
    });
    describe('#getMatrixFederationStatistics()', () => {
        it('should return null as the biggestRoom when there is no biggest room available', () => __awaiter(void 0, void 0, void 0, function* () {
            findBiggestFederatedRoomInNumberOfUsers.resolves(null);
            getExternalServerConnectedExcluding.resolves([]);
            (0, chai_1.expect)((yield getMatrixFederationStatistics()).biggestRoom).to.be.null;
        }));
        it('should return null as the smallestRoom when there is no smallest room available', () => __awaiter(void 0, void 0, void 0, function* () {
            findSmallestFederatedRoomInNumberOfUsers.resolves(null);
            getExternalServerConnectedExcluding.resolves([]);
            (0, chai_1.expect)((yield getMatrixFederationStatistics()).smallestRoom).to.be.null;
        }));
        it('should return all matrix federation statistics metrics related', () => __awaiter(void 0, void 0, void 0, function* () {
            const props = {
                Federation_Matrix_enabled: true,
                Federation_Matrix_max_size_of_public_rooms_users: '100',
            };
            get.callsFake((key) => props[key]);
            const biggestRoom = { _id: '_id', name: 'name', usersCount: 99 };
            const smallestRoom = { _id: '_id', name: 'name', usersCount: 2 };
            findBiggestFederatedRoomInNumberOfUsers.resolves(biggestRoom);
            findSmallestFederatedRoomInNumberOfUsers.resolves(smallestRoom);
            countFederatedExternalUsers.resolves(10);
            countFederatedRooms.resolves(20);
            getExternalServerConnectedExcluding.resolves(['server1', 'server2']);
            (0, chai_1.expect)(yield getMatrixFederationStatistics()).to.be.eql({
                enabled: props.Federation_Matrix_enabled,
                maximumSizeOfPublicRoomsUsers: props.Federation_Matrix_max_size_of_public_rooms_users,
                biggestRoom,
                smallestRoom,
                amountOfExternalUsers: 10,
                amountOfFederatedRooms: 20,
                externalConnectedServers: { quantity: 2, servers: ['server1', 'server2'] },
            });
        }));
    });
});
