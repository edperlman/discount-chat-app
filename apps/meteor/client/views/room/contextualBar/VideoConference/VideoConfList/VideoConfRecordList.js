"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoConfRecordList = void 0;
const RecordList_1 = require("../../../../../lib/lists/RecordList");
class VideoConfRecordList extends RecordList_1.RecordList {
    compare(a, b) {
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
}
exports.VideoConfRecordList = VideoConfRecordList;
