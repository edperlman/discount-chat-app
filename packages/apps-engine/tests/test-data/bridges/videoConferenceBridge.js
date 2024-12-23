"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsVideoConferenceBridge = void 0;
const bridges_1 = require("../../../src/server/bridges");
class TestsVideoConferenceBridge extends bridges_1.VideoConferenceBridge {
    getById(callId, appId) {
        throw new Error('Method not implemented.');
    }
    create(call, appId) {
        throw new Error('Method not implemented');
    }
    update(call, appId) {
        throw new Error('Method not implemented.');
    }
    registerProvider(info, appId) {
        return Promise.resolve();
    }
    unRegisterProvider(info, appId) {
        return Promise.resolve();
    }
}
exports.TestsVideoConferenceBridge = TestsVideoConferenceBridge;
