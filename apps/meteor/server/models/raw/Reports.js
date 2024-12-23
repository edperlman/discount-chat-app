"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class ReportsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'reports', trash);
    }
    createWithMessageDescriptionAndUserId(message, description, userId) {
        const record = {
            message,
            description,
            ts: new Date(),
            userId,
        };
        return this.insertOne(record);
    }
}
exports.ReportsRaw = ReportsRaw;
