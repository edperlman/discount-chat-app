"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestContactBridge = void 0;
const bridges_1 = require("../../../src/server/bridges");
class TestContactBridge extends bridges_1.ContactBridge {
    addContactEmail(contactId, email, appId) {
        throw new Error('Method not implemented.');
    }
    getById(id) {
        throw new Error('Method not implemented.');
    }
    verifyContact(verifyContactChannelParams) {
        throw new Error('Method not implemented.');
    }
}
exports.TestContactBridge = TestContactBridge;
