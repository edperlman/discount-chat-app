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
exports.MatrixBridgeEE = void 0;
const rooms_1 = require("@rocket.chat/apps-engine/definition/rooms");
const Bridge_1 = require("../../../../../../server/services/federation/infrastructure/matrix/Bridge");
const MatrixPowerLevels_1 = require("../../../../../../server/services/federation/infrastructure/matrix/definitions/MatrixPowerLevels");
const MatrixRoomType_1 = require("../../../../../../server/services/federation/infrastructure/matrix/definitions/MatrixRoomType");
const MatrixRoomVisibility_1 = require("../../../../../../server/services/federation/infrastructure/matrix/definitions/MatrixRoomVisibility");
const DEFAULT_TIMEOUT_IN_MS = 10000;
class MatrixBridgeEE extends Bridge_1.MatrixBridge {
    constructor(internalSettings, eventHandler) {
        super(internalSettings, eventHandler);
        this.internalSettings = internalSettings;
        this.eventHandler = eventHandler;
    }
    mountPowerLevelRulesWithMinimumPowerLevelForEachAction() {
        return {
            ban: MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
            events_default: MatrixPowerLevels_1.MATRIX_POWER_LEVELS.USER,
            historical: MatrixPowerLevels_1.MATRIX_POWER_LEVELS.ADMIN,
            invite: MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
            kick: MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
            redact: MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
            state_default: MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
            users_default: MatrixPowerLevels_1.MATRIX_POWER_LEVELS.USER,
            events: {
                'm.room.avatar': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
                'm.room.canonical_alias': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
                'm.room.encryption': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.ADMIN,
                'm.room.history_visibility': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.ADMIN,
                'm.room.name': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
                'm.room.power_levels': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.MODERATOR,
                'm.room.server_acl': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.ADMIN,
                'm.room.tombstone': MatrixPowerLevels_1.MATRIX_POWER_LEVELS.ADMIN,
            },
        };
    }
    createRoom(externalCreatorId, roomType, roomName, roomTopic) {
        return __awaiter(this, void 0, void 0, function* () {
            const intent = this.bridgeInstance.getIntent(externalCreatorId);
            const privateRoomTypes = [rooms_1.RoomType.DIRECT_MESSAGE, rooms_1.RoomType.PRIVATE_GROUP];
            const visibility = privateRoomTypes.includes(roomType) ? MatrixRoomVisibility_1.MatrixRoomVisibility.PRIVATE : MatrixRoomVisibility_1.MatrixRoomVisibility.PUBLIC;
            const matrixRoomType = privateRoomTypes.includes(roomType) ? MatrixRoomType_1.MatrixRoomType.PRIVATE : MatrixRoomType_1.MatrixRoomType.PUBLIC;
            const matrixRoom = yield intent.createRoom({
                createAsClient: true,
                options: Object.assign({ name: roomName, topic: roomTopic, room_alias_name: `${roomName}${Date.now()}`, visibility, preset: matrixRoomType, creation_content: {
                        was_internally_programatically_created: true,
                    }, power_level_content_override: this.mountPowerLevelRulesWithMinimumPowerLevelForEachAction() }, (roomTopic ? { topic: roomTopic } : {})),
            });
            yield intent.setRoomDirectoryVisibility(matrixRoom.room_id, visibility);
            return matrixRoom.room_id;
        });
    }
    searchPublicRooms(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { serverName, limit = 50, roomName, pageToken } = params;
            try {
                return yield this.bridgeInstance.getIntent().matrixClient.doRequest('POST', `/_matrix/client/r0/publicRooms?server=${serverName}`, {}, Object.assign({ filter: { generic_search_term: roomName }, limit }, (pageToken ? { since: pageToken } : {})), DEFAULT_TIMEOUT_IN_MS);
            }
            catch (error) {
                throw new Error('invalid-server-name');
            }
        });
    }
}
exports.MatrixBridgeEE = MatrixBridgeEE;
