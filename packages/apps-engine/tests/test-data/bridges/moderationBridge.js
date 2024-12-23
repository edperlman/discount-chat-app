"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsModerationBridge = void 0;
const bridges_1 = require("../../../src/server/bridges");
class TestsModerationBridge extends bridges_1.ModerationBridge {
    report(messageId, description, userId, appId) {
        throw new Error('Method not implemented.');
    }
    dismissReportsByMessageId(messageId, reason, action, appId) {
        throw new Error('Method not implemented.');
    }
    dismissReportsByUserId(userId, reason, action, appId) {
        throw new Error('Method not implemented.');
    }
}
exports.TestsModerationBridge = TestsModerationBridge;
