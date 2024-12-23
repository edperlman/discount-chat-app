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
exports.loadMessageHistory = loadMessageHistory;
const models_1 = require("@rocket.chat/models");
const cached_1 = require("../../../settings/server/cached");
const normalizeMessagesForUser_1 = require("../../../utils/server/lib/normalizeMessagesForUser");
const getHiddenSystemMessages_1 = require("../lib/getHiddenSystemMessages");
function loadMessageHistory(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, rid, end, limit = 20, ls, showThreadMessages = true, offset = 0, }) {
        const room = yield models_1.Rooms.findOneById(rid, { projection: { sysMes: 1 } });
        if (!room) {
            throw new Error('error-invalid-room');
        }
        const hiddenSystemMessages = cached_1.settings.get('Hide_System_Messages');
        const hiddenMessageTypes = (0, getHiddenSystemMessages_1.getHiddenSystemMessages)(room, hiddenSystemMessages);
        const options = {
            sort: {
                ts: -1,
            },
            limit,
            skip: offset,
        };
        const records = end
            ? yield models_1.Messages.findVisibleByRoomIdBeforeTimestampNotContainingTypes(rid, end, hiddenMessageTypes, options, showThreadMessages).toArray()
            : yield models_1.Messages.findVisibleByRoomIdNotContainingTypes(rid, hiddenMessageTypes, options, showThreadMessages).toArray();
        const messages = yield (0, normalizeMessagesForUser_1.normalizeMessagesForUser)(records, userId);
        let unreadNotLoaded = 0;
        let firstUnread;
        if (ls) {
            const firstMessage = messages[messages.length - 1];
            const lastSeen = new Date(ls);
            if (firstMessage && new Date(firstMessage.ts) > lastSeen) {
                const unreadMessages = models_1.Messages.findVisibleByRoomIdBetweenTimestampsNotContainingTypes(rid, lastSeen, firstMessage.ts, hiddenMessageTypes, {
                    limit: 1,
                    sort: {
                        ts: 1,
                    },
                }, showThreadMessages);
                const totalCursor = yield models_1.Messages.countVisibleByRoomIdBetweenTimestampsNotContainingTypes(rid, lastSeen, firstMessage.ts, hiddenMessageTypes, showThreadMessages);
                firstUnread = (yield unreadMessages.toArray())[0];
                unreadNotLoaded = totalCursor;
            }
        }
        return {
            messages,
            firstUnread,
            unreadNotLoaded,
        };
    });
}
