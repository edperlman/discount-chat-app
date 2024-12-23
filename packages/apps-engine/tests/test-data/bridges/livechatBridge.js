"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestLivechatBridge = void 0;
const LivechatBridge_1 = require("../../../src/server/bridges/LivechatBridge");
class TestLivechatBridge extends LivechatBridge_1.LivechatBridge {
    findDepartmentsEnabledWithAgents(appId) {
        throw new Error('Method not implemented.');
    }
    isOnline(departmentId) {
        throw new Error('Method not implemented');
    }
    isOnlineAsync(departmentId) {
        throw new Error('Method not implemented');
    }
    createMessage(message, appId) {
        throw new Error('Method not implemented');
    }
    getMessageById(messageId, appId) {
        throw new Error('Method not implemented');
    }
    updateMessage(message, appId) {
        throw new Error('Method not implemented');
    }
    createVisitor(visitor, appId) {
        throw new Error('Method not implemented');
    }
    createAndReturnVisitor(visitor, appId) {
        throw new Error('Method not implemented');
    }
    transferVisitor(visitor, transferData, appId) {
        throw new Error('Method not implemented');
    }
    findVisitors(query, appId) {
        console.warn('The method AppLivechatBridge.findVisitors is deprecated. Please consider using its alternatives');
        throw new Error('Method not implemented');
    }
    findVisitorById(id, appId) {
        throw new Error('Method not implemented');
    }
    findVisitorByEmail(email, appId) {
        throw new Error('Method not implemented');
    }
    findVisitorByToken(token, appId) {
        throw new Error('Method not implemented');
    }
    findVisitorByPhoneNumber(phoneNumber, appId) {
        throw new Error('Method not implemented');
    }
    createRoom(visitor, agent, appId, extraParams) {
        throw new Error('Method not implemented');
    }
    closeRoom(room, comment, closer, appId) {
        throw new Error('Method not implemented');
    }
    findRooms(visitor, departmentId, appId) {
        throw new Error('Method not implemented');
    }
    findOpenRoomsByAgentId(agentId, appId) {
        throw new Error('Method not implemented');
    }
    countOpenRoomsByAgentId(agentId, appId) {
        throw new Error('Method not implemented');
    }
    findDepartmentByIdOrName(value, appId) {
        throw new Error('Method not implemented');
    }
    _fetchLivechatRoomMessages(appId, roomId) {
        throw new Error('Method not implemented');
    }
    setCustomFields(data, appId) {
        throw new Error('Method not implemented');
    }
}
exports.TestLivechatBridge = TestLivechatBridge;
