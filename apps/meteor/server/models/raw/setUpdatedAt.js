"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpdatedAt = setUpdatedAt;
function setUpdatedAt(record) {
    if (/(^|,)\$/.test(Object.keys(record).join(','))) {
        record.$set = record.$set || {};
        record.$set._updatedAt = new Date();
    }
    else {
        record._updatedAt = new Date();
    }
}
