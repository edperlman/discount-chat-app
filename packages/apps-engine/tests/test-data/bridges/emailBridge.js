"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsEmailBridge = void 0;
const EmailBridge_1 = require("../../../src/server/bridges/EmailBridge");
class TestsEmailBridge extends EmailBridge_1.EmailBridge {
    sendEmail(email, appId) {
        throw new Error('Method not implemented.');
    }
}
exports.TestsEmailBridge = TestsEmailBridge;
