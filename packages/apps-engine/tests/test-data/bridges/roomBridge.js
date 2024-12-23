"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestsRoomBridge = void 0;
const bridges_1 = require("../../../src/server/bridges");
class TestsRoomBridge extends bridges_1.RoomBridge {
    create(room, members, appId) {
        throw new Error('Method not implemented.');
    }
    getById(roomId, appId) {
        throw new Error('Method not implemented.');
    }
    getCreatorById(roomId, appId) {
        throw new Error('Method not implemented.');
    }
    getByName(roomName, appId) {
        throw new Error('Method not implemented.');
    }
    getCreatorByName(roomName, appId) {
        throw new Error('Method not implemented.');
    }
    getDirectByUsernames(username, appId) {
        throw new Error('Method not implemented');
    }
    getMembers(roomName, appId) {
        throw new Error('Method not implemented.');
    }
    getMessages(roomId, options, appId) {
        throw new Error('Method not implemented.');
    }
    update(room, members, appId) {
        throw new Error('Method not implemented.');
    }
    createDiscussion(room, parentMessage, reply, members, appId) {
        throw new Error('Method not implemented.');
    }
    delete(roomId, appId) {
        throw new Error('Method not implemented.');
    }
    getLeaders(roomId, appId) {
        throw new Error('Method not implemented.');
    }
    getModerators(roomId, appId) {
        throw new Error('Method not implemented.');
    }
    getOwners(roomId, appId) {
        throw new Error('Method not implemented.');
    }
    removeUsers(roomId, usernames, appId) {
        throw new Error('Method not implemented');
    }
    getUnreadByUser(roomId, uid, options, appId) {
        throw new Error('Method not implemented.');
    }
    getUserUnreadMessageCount(roomId, uid, appId) {
        throw new Error('Method not implemented.');
    }
}
exports.TestsRoomBridge = TestsRoomBridge;
