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
exports.findMentionedMessages = findMentionedMessages;
exports.findStarredMessages = findStarredMessages;
exports.findDiscussionsFromRoom = findDiscussionsFromRoom;
const models_1 = require("@rocket.chat/models");
const canAccessRoom_1 = require("../../../authorization/server/functions/canAccessRoom");
function findMentionedMessages(_a) {
    return __awaiter(this, arguments, void 0, function* ({ uid, roomId, pagination: { offset, count, sort }, }) {
        const room = yield models_1.Rooms.findOneById(roomId);
        if (!room || !(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, { _id: uid }))) {
            throw new Error('error-not-allowed');
        }
        const user = yield models_1.Users.findOneById(uid, { projection: { username: 1 } });
        if (!user) {
            throw new Error('invalid-user');
        }
        const { cursor, totalCount } = models_1.Messages.findPaginatedVisibleByMentionAndRoomId(user.username, roomId, {
            sort: sort || { ts: -1 },
            skip: offset,
            limit: count,
        });
        const [messages, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            messages,
            count: messages.length,
            offset,
            total,
        };
    });
}
function findStarredMessages(_a) {
    return __awaiter(this, arguments, void 0, function* ({ uid, roomId, pagination: { offset, count, sort }, }) {
        const room = yield models_1.Rooms.findOneById(roomId);
        if (!room || !(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, { _id: uid }))) {
            throw new Error('error-not-allowed');
        }
        const user = yield models_1.Users.findOneById(uid, { projection: { username: 1 } });
        if (!user) {
            throw new Error('invalid-user');
        }
        const { cursor, totalCount } = models_1.Messages.findStarredByUserAtRoom(uid, roomId, {
            sort: sort || { ts: -1 },
            skip: offset,
            limit: count,
        });
        const [messages, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            messages,
            count: messages.length,
            offset,
            total,
        };
    });
}
function findDiscussionsFromRoom(_a) {
    return __awaiter(this, arguments, void 0, function* ({ uid, roomId, text, pagination: { offset, count, sort }, }) {
        const room = yield models_1.Rooms.findOneById(roomId);
        if (!room || !(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, { _id: uid }))) {
            throw new Error('error-not-allowed');
        }
        const { cursor, totalCount } = yield models_1.Messages.findDiscussionsByRoomAndText(roomId, text, {
            sort: sort || { ts: -1 },
            skip: offset,
            limit: count,
        });
        const [messages, total] = yield Promise.all([cursor.toArray(), totalCount]);
        return {
            messages,
            count: messages.length,
            offset,
            total,
        };
    });
}
