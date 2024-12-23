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
exports.MatrixBridgedUserRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class MatrixBridgedUserRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'matrix_bridged_users', trash);
    }
    modelIndexes() {
        return [
            { key: { uid: 1 }, unique: true, sparse: true },
            { key: { mui: 1 }, unique: true, sparse: true },
            { key: { fromServer: 1 }, sparse: true },
        ];
    }
    getExternalUserIdByLocalUserId(localUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bridgedUser = yield this.findOne({ uid: localUserId });
            return bridgedUser ? bridgedUser.mui : null;
        });
    }
    getBridgedUserByExternalUserId(externalUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({ mui: externalUserId });
        });
    }
    getLocalUserIdByExternalId(externalUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bridgedUser = yield this.findOne({ mui: externalUserId });
            return bridgedUser ? bridgedUser.uid : null;
        });
    }
    getLocalUsersByExternalIds(externalUserIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const bridgedUsers = yield this.find({ mui: { $in: externalUserIds } }).toArray();
            return bridgedUsers;
        });
    }
    getBridgedUserByLocalId(localUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({ uid: localUserId });
        });
    }
    createOrUpdateByLocalId(localUserId, externalUserId, remote, fromServer) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOne({ uid: localUserId }, {
                $set: {
                    uid: localUserId,
                    mui: externalUserId,
                    remote,
                    fromServer,
                },
            }, { upsert: true });
        });
    }
}
exports.MatrixBridgedUserRaw = MatrixBridgedUserRaw;
