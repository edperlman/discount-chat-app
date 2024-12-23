"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesList = void 0;
const RecordList_1 = require("./RecordList");
const isFileMessageInRoom = (upload, rid) => upload.rid === rid && 'rid' in upload;
class FilesList extends RecordList_1.RecordList {
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
    filter(message) {
        const { rid } = this._options;
        if (!isFileMessageInRoom(message, rid)) {
            return false;
        }
        return true;
    }
}
exports.FilesList = FilesList;
