"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsAppLogStorage = void 0;
const storage_1 = require("../../../src/server/storage");
class TestsAppLogStorage extends storage_1.AppLogStorage {
    constructor() {
        super('nothing');
    }
    find(query, options) {
        return Promise.resolve([]);
    }
    storeEntries(logEntry) {
        return Promise.resolve({});
    }
    getEntriesFor(appId) {
        return Promise.resolve([]);
    }
    removeEntriesFor(appId) {
        return Promise.resolve();
    }
}
exports.TestsAppLogStorage = TestsAppLogStorage;
