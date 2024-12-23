"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSecondaryPreferred = readSecondaryPreferred;
const mongodb_1 = require("mongodb");
function readSecondaryPreferred(db, tags = []) {
    var _a;
    const { readPreference } = (db === null || db === void 0 ? void 0 : db.options) || {};
    if (tags.length) {
        return new mongodb_1.ReadPreference(mongodb_1.ReadPreference.SECONDARY_PREFERRED, tags);
    }
    if (readPreference && readPreference instanceof mongodb_1.ReadPreference && ((_a = readPreference.tags) === null || _a === void 0 ? void 0 : _a.length)) {
        return new mongodb_1.ReadPreference(mongodb_1.ReadPreference.SECONDARY_PREFERRED, readPreference.tags);
    }
    // For some reason the new ReadPreference definition requires the tags parameter even not been
    // required by the code implementation and, for some reason, when passing an empty array it
    // doesn't ignore the tags and stop using the secondaries.
    return mongodb_1.ReadPreference.SECONDARY_PREFERRED;
}
