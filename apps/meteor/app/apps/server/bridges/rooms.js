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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoomBridge = void 0;
const rooms_1 = require("@rocket.chat/apps-engine/definition/rooms");
const RoomBridge_1 = require("@rocket.chat/apps-engine/server/bridges/RoomBridge");
const models_1 = require("@rocket.chat/models");
const createDirectMessage_1 = require("../../../../server/methods/createDirectMessage");
const createDiscussion_1 = require("../../../discussion/server/methods/createDiscussion");
const addUserToRoom_1 = require("../../../lib/server/functions/addUserToRoom");
const deleteRoom_1 = require("../../../lib/server/functions/deleteRoom");
const removeUserFromRoom_1 = require("../../../lib/server/functions/removeUserFromRoom");
const createChannel_1 = require("../../../lib/server/methods/createChannel");
const createPrivateGroup_1 = require("../../../lib/server/methods/createPrivateGroup");
class AppRoomBridge extends RoomBridge_1.RoomBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    create(room, members, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is creating a new room.`, room);
            const rcRoom = yield ((_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('rooms').convertAppRoom(room));
            switch (room.type) {
                case rooms_1.RoomType.CHANNEL:
                    return this.createChannel(room.creator.id, rcRoom, members);
                case rooms_1.RoomType.PRIVATE_GROUP:
                    return this.createPrivateGroup(room.creator.id, rcRoom, members);
                case rooms_1.RoomType.DIRECT_MESSAGE:
                    return this.createDirectMessage(room.creator.id, members);
                default:
                    throw new Error('Only channels, private groups and direct messages can be created.');
            }
        });
    }
    prepareExtraData(room) {
        const extraData = Object.assign({}, room);
        delete extraData.name;
        delete extraData.t;
        delete extraData.ro;
        delete extraData.customFields;
        return extraData;
    }
    createChannel(userId, room, members) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield (0, createChannel_1.createChannelMethod)(userId, room.name || '', members, room.ro, room.customFields, this.prepareExtraData(room))).rid;
        });
    }
    createDirectMessage(userId, members) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield (0, createDirectMessage_1.createDirectMessage)(members, userId)).rid;
        });
    }
    createPrivateGroup(userId, room, members) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.Users.findOneById(userId);
            if (!user) {
                throw new Error('Invalid user');
            }
            return (yield (0, createPrivateGroup_1.createPrivateGroupMethod)(user, room.name || '', members, room.ro, room.customFields, this.prepareExtraData(room))).rid;
        });
    }
    getById(roomId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is getting the roomById: "${roomId}"`);
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const promise = (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('rooms').convertById(roomId);
            return promise;
        });
    }
    getByName(roomName, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is getting the roomByName: "${roomName}"`);
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const promise = (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('rooms').convertByName(roomName);
            return promise;
        });
    }
    getCreatorById(roomId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.orch.debugLog(`The App ${appId} is getting the room's creator by id: "${roomId}"`);
            const room = yield models_1.Rooms.findOneById(roomId);
            if (!((_a = room === null || room === void 0 ? void 0 : room.u) === null || _a === void 0 ? void 0 : _a._id)) {
                return undefined;
            }
            return (_b = this.orch.getConverters()) === null || _b === void 0 ? void 0 : _b.get('users').convertById(room.u._id);
        });
    }
    getCreatorByName(roomName, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.orch.debugLog(`The App ${appId} is getting the room's creator by name: "${roomName}"`);
            const room = yield models_1.Rooms.findOneByName(roomName, {});
            if (!((_a = room === null || room === void 0 ? void 0 : room.u) === null || _a === void 0 ? void 0 : _a._id)) {
                return undefined;
            }
            return (_b = this.orch.getConverters()) === null || _b === void 0 ? void 0 : _b.get('users').convertById(room.u._id);
        });
    }
    getMessages(roomId, options, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is getting the messages of the room: "${roomId}" with options:`, options);
            const { limit, skip = 0, sort: _sort } = options;
            const messageConverter = (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('messages');
            if (!messageConverter) {
                throw new Error('Message converter not found');
            }
            // We support only one field for now
            const sort = (_sort === null || _sort === void 0 ? void 0 : _sort.createdAt) ? { ts: _sort.createdAt } : undefined;
            const messageQueryOptions = {
                limit,
                skip,
                sort,
            };
            const query = {
                rid: roomId,
                _hidden: { $ne: true },
                t: { $exists: false },
            };
            const cursor = models_1.Messages.find(query, messageQueryOptions);
            const messagePromises = yield cursor.map((message) => messageConverter.convertMessageRaw(message)).toArray();
            return Promise.all(messagePromises);
        });
    }
    getMembers(roomId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is getting the room's members by room id: "${roomId}"`);
            const subscriptions = yield models_1.Subscriptions.findByRoomId(roomId, {});
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const promises = Promise.all((yield subscriptions.toArray()).map((sub) => { var _a, _b; return (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('users').convertById((_b = sub.u) === null || _b === void 0 ? void 0 : _b._id); }));
            return promises;
        });
    }
    getDirectByUsernames(usernames, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is getting direct room by usernames: "${usernames}"`);
            const room = yield models_1.Rooms.findDirectRoomContainingAllUsernames(usernames, {});
            if (!room) {
                return undefined;
            }
            return (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('rooms').convertRoom(room);
        });
    }
    update(room_1) {
        return __awaiter(this, arguments, void 0, function* (room, members = [], appId) {
            var _a, members_1, members_1_1;
            var _b, e_1, _c, _d;
            var _e;
            this.orch.debugLog(`The App ${appId} is updating a room.`);
            if (!room.id || !(yield models_1.Rooms.findOneById(room.id))) {
                throw new Error('A room must exist to update.');
            }
            const rm = yield ((_e = this.orch.getConverters()) === null || _e === void 0 ? void 0 : _e.get('rooms').convertAppRoom(room));
            yield models_1.Rooms.updateOne({ _id: rm._id }, { $set: rm });
            try {
                for (_a = true, members_1 = __asyncValues(members); members_1_1 = yield members_1.next(), _b = members_1_1.done, !_b; _a = true) {
                    _d = members_1_1.value;
                    _a = false;
                    const username = _d;
                    const member = yield models_1.Users.findOneByUsername(username, {});
                    if (!member) {
                        continue;
                    }
                    yield (0, addUserToRoom_1.addUserToRoom)(rm._id, member);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = members_1.return)) yield _c.call(members_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    delete(roomId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is deleting a room.`);
            yield (0, deleteRoom_1.deleteRoom)(roomId);
        });
    }
    createDiscussion(room_1) {
        return __awaiter(this, arguments, void 0, function* (room, parentMessage = undefined, reply = '', members = [], appId) {
            var _a, _b;
            this.orch.debugLog(`The App ${appId} is creating a new discussion.`, room);
            const rcRoom = yield ((_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('rooms').convertAppRoom(room));
            let rcMessage;
            if (parentMessage) {
                rcMessage = yield ((_b = this.orch.getConverters()) === null || _b === void 0 ? void 0 : _b.get('messages').convertAppMessage(parentMessage));
            }
            if (!rcRoom.prid || !(yield models_1.Rooms.findOneById(rcRoom.prid))) {
                throw new Error('There must be a parent room to create a discussion.');
            }
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const discussion = {
                prid: rcRoom.prid,
                t_name: rcRoom.fname,
                pmid: rcMessage ? rcMessage._id : undefined,
                reply: reply && reply.trim() !== '' ? reply : undefined,
                users: members.length > 0 ? members : [],
            };
            const { rid } = yield (0, createDiscussion_1.createDiscussion)(room.creator.id, discussion);
            return rid;
        });
    }
    getModerators(roomId, appId) {
        this.orch.debugLog(`The App ${appId} is getting room moderators for room id: ${roomId}`);
        return this.getUsersByRoomIdAndSubscriptionRole(roomId, 'moderator');
    }
    getOwners(roomId, appId) {
        this.orch.debugLog(`The App ${appId} is getting room owners for room id: ${roomId}`);
        return this.getUsersByRoomIdAndSubscriptionRole(roomId, 'owner');
    }
    getLeaders(roomId, appId) {
        this.orch.debugLog(`The App ${appId} is getting room leaders for room id: ${roomId}`);
        return this.getUsersByRoomIdAndSubscriptionRole(roomId, 'leader');
    }
    getUsersByRoomIdAndSubscriptionRole(roomId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const subs = (yield models_1.Subscriptions.findByRoomIdAndRoles(roomId, [role], {
                projection: { uid: '$u._id', _id: 0 },
            }).toArray());
            // Was this a bug?
            const users = yield models_1.Users.findByIds(subs.map((user) => user.uid)).toArray();
            const userConverter = this.orch.getConverters().get('users');
            return users.map((user) => userConverter.convertToApp(user));
        });
    }
    getUnreadByUser(roomId, uid, options, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.orch.debugLog(`The App ${appId} is getting the unread messages for the user: "${uid}" in the room: "${roomId}"`);
            const messageConverter = (_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('messages');
            if (!messageConverter) {
                throw new Error('Message converter not found');
            }
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(roomId, uid, { projection: { ls: 1 } });
            if (!subscription) {
                const errorMessage = `No subscription found for user with ID "${uid}" in room with ID "${roomId}". This means the user is not subscribed to the room.`;
                this.orch.debugLog(errorMessage);
                throw new Error('User not subscribed to room');
            }
            const lastSeen = subscription === null || subscription === void 0 ? void 0 : subscription.ls;
            if (!lastSeen) {
                return [];
            }
            const sort = ((_b = options.sort) === null || _b === void 0 ? void 0 : _b.createdAt) ? { ts: options.sort.createdAt } : { ts: 1 };
            const cursor = models_1.Messages.findVisibleByRoomIdBetweenTimestampsNotContainingTypes(roomId, lastSeen, new Date(), [], Object.assign(Object.assign({}, options), { sort }));
            const messages = yield cursor.toArray();
            return Promise.all(messages.map((msg) => messageConverter.convertMessageRaw(msg)));
        });
    }
    getUserUnreadMessageCount(roomId, uid, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is getting the unread messages count of the room: "${roomId}" for the user: "${uid}"`);
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(roomId, uid, { projection: { ls: 1 } });
            if (!subscription) {
                const errorMessage = `No subscription found for user with ID "${uid}" in room with ID "${roomId}". This means the user is not subscribed to the room.`;
                this.orch.debugLog(errorMessage);
                throw new Error('User not subscribed to room');
            }
            const lastSeen = subscription === null || subscription === void 0 ? void 0 : subscription.ls;
            if (!lastSeen) {
                return 0;
            }
            return models_1.Messages.countVisibleByRoomIdBetweenTimestampsNotContainingTypes(roomId, lastSeen, new Date(), []);
        });
    }
    removeUsers(roomId, usernames, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is removing users ${usernames} from room id: ${roomId}`);
            if (!roomId) {
                throw new Error('roomId was not provided.');
            }
            const members = yield models_1.Users.findUsersByUsernames(usernames, { limit: 50 }).toArray();
            yield Promise.all(members.map((user) => (0, removeUserFromRoom_1.removeUserFromRoom)(roomId, user)));
        });
    }
}
exports.AppRoomBridge = AppRoomBridge;
