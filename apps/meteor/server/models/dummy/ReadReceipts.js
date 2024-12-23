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
exports.ReadReceiptsDummy = void 0;
const BaseDummy_1 = require("./BaseDummy");
class ReadReceiptsDummy extends BaseDummy_1.BaseDummy {
    constructor() {
        super('read_receipts');
    }
    findByMessageId(_messageId) {
        return this.find({});
    }
    removeByUserId(_userId) {
        return this.deleteMany({});
    }
    removeByRoomId(_roomId) {
        return this.deleteMany({});
    }
    removeByRoomIds(_roomIds) {
        return this.deleteMany({});
    }
    removeByMessageId(_messageId) {
        return this.deleteMany({});
    }
    removeByMessageIds(_messageIds) {
        return this.deleteMany({});
    }
    removeOTRReceiptsUntilDate(_roomId, _until) {
        return this.deleteMany({});
    }
    removeByIdPinnedTimestampLimitAndUsers(_roomId, _ignorePinned, _ignoreDiscussion, _ts, _users, _ignoreThreads) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.deleteMany({});
        });
    }
    setPinnedByMessageId(_messageId, _pinned = true) {
        return this.updateMany({}, {});
    }
    setAsThreadById(_messageId) {
        return this.updateMany({}, {});
    }
}
exports.ReadReceiptsDummy = ReadReceiptsDummy;
