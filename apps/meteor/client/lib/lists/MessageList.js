"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageList = void 0;
const RecordList_1 = require("./RecordList");
class MessageList extends RecordList_1.RecordList {
    filter(message) {
        return message._hidden !== true;
    }
    compare(a, b) {
        return a.ts.getTime() - b.ts.getTime();
    }
}
exports.MessageList = MessageList;
