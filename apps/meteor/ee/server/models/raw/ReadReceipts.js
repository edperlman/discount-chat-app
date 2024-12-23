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
exports.ReadReceiptsRaw = void 0;
const constants_1 = require("../../../../app/otr/lib/constants");
const BaseRaw_1 = require("../../../../server/models/raw/BaseRaw");
class ReadReceiptsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'read_receipts', trash);
    }
    modelIndexes() {
        return [{ key: { roomId: 1, userId: 1, messageId: 1 }, unique: true }, { key: { messageId: 1 } }, { key: { userId: 1 } }];
    }
    findByMessageId(messageId) {
        return this.find({ messageId });
    }
    removeByUserId(userId) {
        return this.deleteMany({ userId });
    }
    removeByRoomId(roomId) {
        return this.deleteMany({ roomId });
    }
    removeByRoomIds(roomIds) {
        return this.deleteMany({ roomId: { $in: roomIds } });
    }
    removeByMessageId(messageId) {
        return this.deleteMany({ messageId });
    }
    removeByMessageIds(messageIds) {
        return this.deleteMany({ messageId: { $in: messageIds } });
    }
    removeOTRReceiptsUntilDate(roomId, until) {
        const query = {
            roomId,
            t: {
                $in: [
                    'otr',
                    constants_1.otrSystemMessages.USER_JOINED_OTR,
                    constants_1.otrSystemMessages.USER_REQUESTED_OTR_KEY_REFRESH,
                    constants_1.otrSystemMessages.USER_KEY_REFRESHED_SUCCESSFULLY,
                ],
            },
            ts: { $lte: until },
        };
        return this.col.deleteMany(query);
    }
    removeByIdPinnedTimestampLimitAndUsers(roomId, ignorePinned, ignoreDiscussion, ts, users, ignoreThreads) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                roomId,
                ts,
            };
            if (ignorePinned) {
                query.pinned = { $ne: true };
            }
            if (ignoreDiscussion) {
                query.drid = { $exists: false };
            }
            if (ignoreThreads) {
                query.tmid = { $exists: false };
            }
            if (users.length) {
                query.userId = { $in: users };
            }
            return this.deleteMany(query);
        });
    }
    setPinnedByMessageId(messageId, pinned = true) {
        return this.updateMany({ messageId }, { $set: { pinned } });
    }
    setAsThreadById(messageId) {
        return this.updateMany({ messageId }, { $set: { tmid: messageId } });
    }
}
exports.ReadReceiptsRaw = ReadReceiptsRaw;
