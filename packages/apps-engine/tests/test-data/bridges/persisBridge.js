"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsPersisBridge = void 0;
const bridges_1 = require("../../../src/server/bridges");
class TestsPersisBridge extends bridges_1.PersistenceBridge {
    purge(appId) {
        throw new Error('Method not implemented.');
    }
    create(data, appId) {
        throw new Error('Method not implemented.');
    }
    createWithAssociations(data, associations, appId) {
        throw new Error('Method not implemented.');
    }
    readById(id, appId) {
        throw new Error('Method not implemented.');
    }
    readByAssociations(associations, appId) {
        throw new Error('Method not implemented.');
    }
    remove(id, appId) {
        throw new Error('Method not implemented.');
    }
    removeByAssociations(associations, appId) {
        throw new Error('Method not implemented.');
    }
    update(id, data, upsert, appId) {
        throw new Error('Method not implemented.');
    }
    updateByAssociations(associations, data, upsert, appId) {
        throw new Error('Method not implemented');
    }
}
exports.TestsPersisBridge = TestsPersisBridge;
