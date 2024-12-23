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
exports.MessageReadsRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class MessageReadsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'message_reads', trash);
    }
    modelIndexes() {
        return [{ key: { tmid: 1, userId: 1 }, unique: true }, { key: { ls: 1 } }];
    }
    findOneByUserIdAndThreadId(userId, tmid) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({ userId, tmid });
        });
    }
    getMinimumLastSeenByThreadId(tmid) {
        return this.findOne({
            tmid,
        }, {
            sort: {
                ls: 1,
            },
        });
    }
    updateReadTimestampByUserIdAndThreadId(userId, tmid) {
        const query = {
            userId,
            tmid,
        };
        const update = {
            $set: {
                ls: new Date(),
            },
        };
        return this.updateOne(query, update, { upsert: true });
    }
    countByThreadAndUserIds(tmid, userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                tmid,
                userId: { $in: userIds },
            };
            return this.col.countDocuments(query);
        });
    }
    countByThreadId(tmid) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                tmid,
            };
            return this.col.countDocuments(query);
        });
    }
}
exports.MessageReadsRaw = MessageReadsRaw;
