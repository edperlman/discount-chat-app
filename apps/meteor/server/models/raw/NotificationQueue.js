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
exports.NotificationQueueRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class NotificationQueueRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'notification_queue', trash);
    }
    modelIndexes() {
        return [
            { key: { uid: 1 } },
            { key: { ts: 1 }, expireAfterSeconds: 2 * 60 * 60 },
            { key: { schedule: 1 }, sparse: true },
            { key: { sending: 1 }, sparse: true },
            { key: { error: 1 }, sparse: true },
        ];
    }
    unsetSendingById(_id) {
        return this.updateOne({ _id }, {
            $unset: {
                sending: 1,
            },
        });
    }
    setErrorById(_id, error) {
        return this.updateOne({
            _id,
        }, {
            $set: {
                error,
            },
            $unset: {
                sending: 1,
            },
        });
    }
    clearScheduleByUserId(uid) {
        return this.updateMany({
            uid,
            schedule: { $exists: true },
        }, {
            $unset: {
                schedule: 1,
            },
        });
    }
    clearQueueByUserId(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const op = yield this.deleteMany({
                uid,
            });
            return op.deletedCount;
        });
    }
    findNextInQueueOrExpired(expired) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const result = yield this.findOneAndUpdate({
                $and: [
                    {
                        $or: [{ sending: { $exists: false } }, { sending: { $lte: expired } }],
                    },
                    {
                        $or: [{ schedule: { $exists: false } }, { schedule: { $lte: now } }],
                    },
                    {
                        error: { $exists: false },
                    },
                ],
            }, {
                $set: {
                    sending: now,
                },
            }, {
                sort: {
                    ts: 1,
                },
            });
            return result.value;
        });
    }
}
exports.NotificationQueueRaw = NotificationQueueRaw;
