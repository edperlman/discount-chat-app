"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmarshHistoryRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class SmarshHistoryRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'smarsh_history', trash);
    }
}
exports.SmarshHistoryRaw = SmarshHistoryRaw;
