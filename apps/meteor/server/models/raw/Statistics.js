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
exports.StatisticsRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class StatisticsRaw extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'statistics');
    }
    modelIndexes() {
        return [{ key: { createdAt: -1 } }];
    }
    findLast() {
        return __awaiter(this, void 0, void 0, function* () {
            const records = yield this.find({}, {
                sort: {
                    createdAt: -1,
                },
                limit: 1,
            }).toArray();
            return records === null || records === void 0 ? void 0 : records[0];
        });
    }
    findLastStatsToken() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const records = yield this.find({}, {
                sort: {
                    createdAt: -1,
                },
                projection: {
                    statsToken: 1,
                },
                limit: 1,
            }).toArray();
            return (_a = records === null || records === void 0 ? void 0 : records[0]) === null || _a === void 0 ? void 0 : _a.statsToken;
        });
    }
    findMonthlyPeakConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            const oneMonthAgo = new Date();
            oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
            oneMonthAgo.setHours(0, 0, 0, 0);
            return this.findOne({
                createdAt: { $gte: oneMonthAgo },
            }, {
                sort: {
                    dailyPeakConnections: -1,
                },
                projection: {
                    dailyPeakConnections: 1,
                    createdAt: 1,
                },
            });
        });
    }
}
exports.StatisticsRaw = StatisticsRaw;
