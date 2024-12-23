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
exports.ConverterCache = void 0;
const models_1 = require("@rocket.chat/models");
class ConverterCache {
    constructor() {
        this._userCache = new Map();
        // display name uses a different cache because it's only used on mentions so we don't need to load it every time we load an user
        this._userDisplayNameCache = new Map();
        this._userNameToIdCache = new Map();
        this._roomCache = new Map();
        this._roomNameCache = new Map();
    }
    addUser(importId, _id, username) {
        const cache = {
            _id,
            username,
        };
        this._userCache.set(importId, cache);
        if (username) {
            this._userNameToIdCache.set(username, _id);
        }
        return cache;
    }
    addUserDisplayName(importId, name) {
        this._userDisplayNameCache.set(importId, name);
        return name;
    }
    addRoom(importId, rid) {
        this._roomCache.set(importId, rid);
        return rid;
    }
    addRoomName(importId, name) {
        this._roomNameCache.set(importId, name);
        return name;
    }
    addUserData(userData) {
        if (!userData._id) {
            return;
        }
        if (!userData.importIds.length) {
            return;
        }
        this.addUser(userData.importIds[0], userData._id, userData.username);
    }
    addUsernameToId(username, id) {
        this._userNameToIdCache.set(username, id);
    }
    findImportedRoomId(importId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._roomCache.has(importId)) {
                return this._roomCache.get(importId);
            }
            const options = {
                projection: {
                    _id: 1,
                },
            };
            const room = yield models_1.Rooms.findOneByImportId(importId, options);
            if (room) {
                return this.addRoom(importId, room._id);
            }
            return null;
        });
    }
    findImportedRoomName(importId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._roomNameCache.has(importId)) {
                return this._roomNameCache.get(importId);
            }
            const options = {
                projection: {
                    _id: 1,
                    name: 1,
                },
            };
            const room = yield models_1.Rooms.findOneByImportId(importId, options);
            if (room) {
                if (!this._roomCache.has(importId)) {
                    this.addRoom(importId, room._id);
                }
                if (room === null || room === void 0 ? void 0 : room.name) {
                    return this.addRoomName(importId, room.name);
                }
            }
        });
    }
    findImportedUser(importId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (importId === 'rocket.cat') {
                return {
                    _id: 'rocket.cat',
                    username: 'rocket.cat',
                };
            }
            const options = {
                projection: {
                    _id: 1,
                    username: 1,
                },
            };
            if (this._userCache.has(importId)) {
                return this._userCache.get(importId);
            }
            const user = yield models_1.Users.findOneByImportId(importId, options);
            if (user) {
                return this.addUser(importId, user._id, user.username);
            }
            return null;
        });
    }
    findImportedUserId(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.findImportedUser(_id);
            return data === null || data === void 0 ? void 0 : data._id;
        });
    }
    findImportedUsername(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.findImportedUser(_id);
            return data === null || data === void 0 ? void 0 : data.username;
        });
    }
    findImportedUserDisplayName(importId) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                projection: {
                    _id: 1,
                    name: 1,
                    username: 1,
                },
            };
            if (this._userDisplayNameCache.has(importId)) {
                return this._userDisplayNameCache.get(importId);
            }
            const user = importId === 'rocket.cat' ? yield models_1.Users.findOneById('rocket.cat', options) : yield models_1.Users.findOneByImportId(importId, options);
            if (user) {
                if (!this._userCache.has(importId)) {
                    this.addUser(importId, user._id, user.username);
                }
                if (!user.name) {
                    return;
                }
                return this.addUserDisplayName(importId, user.name);
            }
        });
    }
    convertImportedIdsToUsernames(importedIds_1) {
        return __awaiter(this, arguments, void 0, function* (importedIds, idToRemove = undefined) {
            return (yield Promise.all(importedIds.map((user) => __awaiter(this, void 0, void 0, function* () {
                if (user === 'rocket.cat') {
                    return user;
                }
                if (this._userCache.has(user)) {
                    const cache = this._userCache.get(user);
                    if (cache) {
                        return cache.username;
                    }
                }
                const obj = yield models_1.Users.findOneByImportId(user, { projection: { _id: 1, username: 1 } });
                if (obj) {
                    this.addUser(user, obj._id, obj.username);
                    if (idToRemove && obj._id === idToRemove) {
                        return false;
                    }
                    return obj.username;
                }
                return false;
            })))).filter((user) => user);
        });
    }
    getIdOfUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username) {
                return;
            }
            if (this._userNameToIdCache.has(username)) {
                return this._userNameToIdCache.get(username);
            }
            const user = yield models_1.Users.findOneByUsername(username, { projection: { _id: 1 } });
            this.addUsernameToId(username, user === null || user === void 0 ? void 0 : user._id);
            return user === null || user === void 0 ? void 0 : user._id;
        });
    }
}
exports.ConverterCache = ConverterCache;
