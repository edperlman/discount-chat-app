"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronHistoryRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class CronHistoryRaw extends BaseRaw_1.BaseRaw {
    constructor(db) {
        super(db, 'cron_history');
    }
    modelIndexes() {
        return [{ key: { intendedAt: 1, name: 1 }, unique: true }];
    }
}
exports.CronHistoryRaw = CronHistoryRaw;
