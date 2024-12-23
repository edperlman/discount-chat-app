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
exports.InvitesRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class InvitesRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'invites', trash);
    }
    findOneByUserRoomMaxUsesAndExpiration(userId, rid, maxUses, daysToExpire) {
        return this.findOne(Object.assign(Object.assign({ rid,
            userId, days: daysToExpire, maxUses }, (daysToExpire > 0 ? { expires: { $gt: new Date() } } : {})), (maxUses > 0 ? { uses: { $lt: maxUses } } : {})));
    }
    increaseUsageById(_id, uses = 1) {
        return this.updateOne({ _id }, {
            $inc: {
                uses,
            },
        });
    }
    countUses() {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.col.aggregate([{ $group: { _id: null, totalUses: { $sum: '$uses' } } }]).toArray();
            return (result === null || result === void 0 ? void 0 : result.totalUses) || 0;
        });
    }
}
exports.InvitesRaw = InvitesRaw;
