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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomConverter = void 0;
const models_1 = require("@rocket.chat/models");
const limax_1 = __importDefault(require("limax"));
const RecordConverter_1 = require("./RecordConverter");
const createDirectMessage_1 = require("../../../../../server/methods/createDirectMessage");
const saveRoomSettings_1 = require("../../../../channel-settings/server/methods/saveRoomSettings");
const notifyListener_1 = require("../../../../lib/server/lib/notifyListener");
const createChannel_1 = require("../../../../lib/server/methods/createChannel");
const createPrivateGroup_1 = require("../../../../lib/server/methods/createPrivateGroup");
class RoomConverter extends RecordConverter_1.RecordConverter {
    convertChannels(startedByUserId_1) {
        return __awaiter(this, arguments, void 0, function* (startedByUserId, callbacks = {}) {
            this.startedByUserId = startedByUserId;
            return this.convertData(callbacks);
        });
    }
    convertRecord(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = record;
            if (!data.name && data.t !== 'd') {
                throw new Error('importer-channel-missing-name');
            }
            data.importIds = data.importIds.filter((item) => item);
            data.users = [...new Set(data.users)];
            if (!data.importIds.length) {
                throw new Error('importer-channel-missing-import-id');
            }
            const existingRoom = yield this.findExistingRoom(data);
            yield this.insertOrUpdateRoom(existingRoom, data, this.startedByUserId);
            return !existingRoom;
        });
    }
    insertOrUpdateRoom(existingRoom, data, startedByUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (existingRoom) {
                yield this.updateRoom(existingRoom, data, startedByUserId);
            }
            else {
                yield this.insertRoom(data, startedByUserId);
            }
            if (data.archived && data._id) {
                yield this.archiveRoomById(data._id);
            }
        });
    }
    findExistingRoom(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data._id && data._id.toUpperCase() === 'GENERAL') {
                const room = yield models_1.Rooms.findOneById('GENERAL', {});
                // Prevent the importer from trying to create a new general
                if (!room) {
                    throw new Error('importer-channel-general-not-found');
                }
                return room;
            }
            if (data.t === 'd') {
                const users = yield this._cache.convertImportedIdsToUsernames(data.users);
                if (users.length !== data.users.length) {
                    throw new Error('importer-channel-missing-users');
                }
                return models_1.Rooms.findDirectRoomContainingAllUsernames(users, {});
            }
            if (!data.name) {
                return null;
            }
            // Imported room names always allow special chars
            const roomName = (0, limax_1.default)(data.name.trim(), { maintainCase: true });
            return models_1.Rooms.findOneByNonValidatedName(roomName, {});
        });
    }
    updateRoom(room, roomData, startedByUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            roomData._id = room._id;
            if (roomData._id.toUpperCase() === 'GENERAL' && roomData.name !== room.name) {
                yield (0, saveRoomSettings_1.saveRoomSettings)(startedByUserId, 'GENERAL', 'roomName', roomData.name);
            }
            yield this.updateRoomId(room._id, roomData);
        });
    }
    insertRoom(roomData, startedByUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the rocketchatId of the user who created this channel
            const creatorId = yield this.getRoomCreatorId(roomData, startedByUserId);
            const members = yield this._cache.convertImportedIdsToUsernames(roomData.users, roomData.t !== 'd' ? creatorId : undefined);
            if (roomData.t === 'd') {
                if (members.length < roomData.users.length) {
                    this._logger.warn(`One or more imported users not found: ${roomData.users}`);
                    throw new Error('importer-channel-missing-users');
                }
            }
            // Create the channel
            try {
                let roomInfo;
                if (roomData.t === 'd') {
                    roomInfo = yield (0, createDirectMessage_1.createDirectMessage)(members, startedByUserId, true);
                }
                else {
                    if (!roomData.name) {
                        return;
                    }
                    if (roomData.t === 'p') {
                        const user = yield models_1.Users.findOneById(creatorId);
                        if (!user) {
                            throw new Error('importer-channel-invalid-creator');
                        }
                        roomInfo = yield (0, createPrivateGroup_1.createPrivateGroupMethod)(user, roomData.name, members, false, {}, {});
                    }
                    else {
                        roomInfo = yield (0, createChannel_1.createChannelMethod)(creatorId, roomData.name, members, false, {}, {});
                    }
                }
                roomData._id = roomInfo.rid;
            }
            catch (e) {
                this._logger.warn({ msg: 'Failed to create new room', name: roomData.name, members });
                this._logger.error(e);
                throw e;
            }
            yield this.updateRoomId(roomData._id, roomData);
        });
    }
    archiveRoomById(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const responses = yield Promise.all([models_1.Rooms.archiveById(rid), models_1.Subscriptions.archiveByRoomId(rid)]);
            if ((_a = responses[1]) === null || _a === void 0 ? void 0 : _a.modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(rid);
            }
        });
    }
    updateRoomId(_id, roomData) {
        return __awaiter(this, void 0, void 0, function* () {
            const set = {
                ts: roomData.ts,
                topic: roomData.topic,
                description: roomData.description,
            };
            const roomUpdate = {};
            if (Object.keys(set).length > 0) {
                roomUpdate.$set = set;
            }
            if (roomData.importIds.length) {
                roomUpdate.$addToSet = {
                    importIds: {
                        $each: roomData.importIds,
                    },
                };
            }
            if (roomUpdate.$set || roomUpdate.$addToSet) {
                yield models_1.Rooms.updateOne({ _id: roomData._id }, roomUpdate);
            }
        });
    }
    getRoomCreatorId(roomData, startedByUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            if (roomData.u) {
                const creatorId = yield this._cache.findImportedUserId(roomData.u._id);
                if (creatorId) {
                    return creatorId;
                }
                if (roomData.t !== 'd') {
                    return startedByUserId;
                }
                throw new Error('importer-channel-invalid-creator');
            }
            if (roomData.t === 'd') {
                try {
                    for (var _d = true, _e = __asyncValues(roomData.users), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const member = _c;
                        const userId = yield this._cache.findImportedUserId(member);
                        if (userId) {
                            return userId;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            throw new Error('importer-channel-invalid-creator');
        });
    }
    getDataType() {
        return 'channel';
    }
}
exports.RoomConverter = RoomConverter;
