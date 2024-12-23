"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsThreadBridge = void 0;
const ThreadBridge_1 = require("../../../src/server/bridges/ThreadBridge");
class TestsThreadBridge extends ThreadBridge_1.ThreadBridge {
    getById(messageId, appId) {
        throw new Error('Method not implemented.');
    }
}
exports.TestsThreadBridge = TestsThreadBridge;
