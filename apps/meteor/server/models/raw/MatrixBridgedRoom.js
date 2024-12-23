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
exports.MatrixBridgedRoomRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class MatrixBridgedRoomRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'matrix_bridged_rooms', trash);
    }
    modelIndexes() {
        return [
            { key: { rid: 1 }, unique: true, sparse: true },
            { key: { mri: 1 }, unique: true, sparse: true },
            { key: { fromServer: 1 }, sparse: true },
        ];
    }
    getExternalRoomId(localRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bridgedRoom = yield this.findOne({ rid: localRoomId });
            return bridgedRoom ? bridgedRoom.mri : null;
        });
    }
    getLocalRoomId(externalRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bridgedRoom = yield this.findOne({ mri: externalRoomId });
            return bridgedRoom ? bridgedRoom.rid : null;
        });
    }
    removeByLocalRoomId(localRoomId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.deleteOne({ rid: localRoomId });
        });
    }
    createOrUpdateByLocalRoomId(localRoomId, externalRoomId, fromServer) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOne({ rid: localRoomId }, { $set: { rid: localRoomId, mri: externalRoomId, fromServer } }, { upsert: true });
        });
    }
    getExternalServerConnectedExcluding(exclude) {
        return __awaiter(this, void 0, void 0, function* () {
            const externalServers = yield this.col.distinct('fromServer');
            return externalServers.filter((serverName) => serverName !== exclude);
        });
    }
}
exports.MatrixBridgedRoomRaw = MatrixBridgedRoomRaw;
