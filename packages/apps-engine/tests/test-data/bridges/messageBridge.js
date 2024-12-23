"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsMessageBridge = void 0;
const bridges_1 = require("../../../src/server/bridges");
class TestsMessageBridge extends bridges_1.MessageBridge {
    create(message, appId) {
        throw new Error('Method not implemented.');
    }
    getById(messageId, appId) {
        throw new Error('Method not implemented.');
    }
    update(message, appId) {
        throw new Error('Method not implemented.');
    }
    notifyUser(user, message, appId) {
        throw new Error('Method not implemented.');
    }
    notifyRoom(room, message, appId) {
        throw new Error('Method not implemented.');
    }
    delete(message, user, appId) {
        throw new Error('Method not implemented.');
    }
    typing(options) {
        throw new Error('Method not implemented.');
    }
    addReaction(_messageId, _userId, _reaction) {
        throw new Error('Method not implemented.');
    }
    removeReaction(_messageId, _userId, _reaction) {
        throw new Error('Method not implemented.');
    }
}
exports.TestsMessageBridge = TestsMessageBridge;
