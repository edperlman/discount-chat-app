"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannedResponseList = void 0;
const RecordList_1 = require("./RecordList");
class CannedResponseList extends RecordList_1.RecordList {
    constructor(_options) {
        super();
        this._options = _options;
    }
    get options() {
        return this._options;
    }
    updateFilters(options) {
        this._options = options;
        this.clear();
    }
}
exports.CannedResponseList = CannedResponseList;
