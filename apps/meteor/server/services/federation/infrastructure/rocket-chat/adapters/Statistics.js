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
exports.getMatrixFederationStatistics = void 0;
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../../../../app/settings/server");
class RocketChatStatisticsAdapter {
    getBiggestRoomAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield models_1.Rooms.findBiggestFederatedRoomInNumberOfUsers({ projection: { usersCount: 1, fname: 1, name: 1 } });
            if (!room) {
                return null;
            }
            return {
                _id: room._id,
                name: room.fname || room.name || '',
                usersCount: room.usersCount,
            };
        });
    }
    getSmallestRoomAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield models_1.Rooms.findSmallestFederatedRoomInNumberOfUsers({ projection: { usersCount: 1, fname: 1, name: 1 } });
            if (!room) {
                return null;
            }
            return {
                _id: room._id,
                name: room.fname || room.name || '',
                usersCount: room.usersCount,
            };
        });
    }
    getAmountOfExternalUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Users.countFederatedExternalUsers();
        });
    }
    getAmountOfExternalRooms() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Rooms.countFederatedRooms();
        });
    }
    getAmountOfConnectedExternalServers() {
        return __awaiter(this, void 0, void 0, function* () {
            const externalServers = yield models_1.MatrixBridgedRoom.getExternalServerConnectedExcluding(server_1.settings.get('Federation_Matrix_homeserver_domain'));
            return {
                quantity: externalServers.length,
                servers: externalServers,
            };
        });
    }
}
const getMatrixFederationStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    const statisticsService = new RocketChatStatisticsAdapter();
    return {
        enabled: server_1.settings.get('Federation_Matrix_enabled'),
        maximumSizeOfPublicRoomsUsers: server_1.settings.get('Federation_Matrix_max_size_of_public_rooms_users'),
        biggestRoom: yield statisticsService.getBiggestRoomAvailable(),
        smallestRoom: yield statisticsService.getSmallestRoomAvailable(),
        amountOfExternalUsers: yield statisticsService.getAmountOfExternalUsers(),
        amountOfFederatedRooms: yield statisticsService.getAmountOfExternalRooms(),
        externalConnectedServers: yield statisticsService.getAmountOfConnectedExternalServers(),
    };
});
exports.getMatrixFederationStatistics = getMatrixFederationStatistics;
