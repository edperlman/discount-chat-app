"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_1 = require("../../mocks/data");
const constants_1 = require("../config/constants");
const createAuxContext_1 = require("../fixtures/createAuxContext");
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const test_1 = require("../utils/test");
test_1.test.describe('omnichannel-auto-transfer-unanswered-chat', () => {
    test_1.test.skip(!constants_1.IS_EE, 'Enterprise Only');
    let poLiveChat;
    let newVisitor;
    let agent1;
    let agent2;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api, browser }) {
        yield Promise.all([
            api.post('/livechat/users/agent', { username: 'user1' }).then((res) => (0, test_1.expect)(res.status()).toBe(200)),
            api.post('/livechat/users/agent', { username: 'user2' }).then((res) => (0, test_1.expect)(res.status()).toBe(200)),
            api.post('/settings/Livechat_Routing_Method', { value: 'Auto_Selection' }).then((res) => (0, test_1.expect)(res.status()).toBe(200)),
            api.post('/settings/Livechat_auto_transfer_chat_timeout', { value: 5 }).then((res) => (0, test_1.expect)(res.status()).toBe(200)),
        ]);
        const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1);
        agent1 = { page, poHomeChannel: new page_objects_1.HomeChannel(page) };
        const { page: page2 } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user2);
        agent2 = { page: page2, poHomeChannel: new page_objects_1.HomeChannel(page2) };
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield agent1.page.close();
        yield agent2.page.close();
        yield Promise.all([
            api.delete('/livechat/users/agent/user1').then((res) => (0, test_1.expect)(res.status()).toBe(200)),
            api.delete('/livechat/users/agent/user2').then((res) => (0, test_1.expect)(res.status()).toBe(200)),
            api.post('/settings/Livechat_auto_transfer_chat_timeout', { value: 0 }).then((res) => (0, test_1.expect)(res.status()).toBe(200)),
        ]);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        // make "user-1" online
        yield agent1.poHomeChannel.sidenav.switchOmnichannelStatus('online');
        yield agent2.poHomeChannel.sidenav.switchOmnichannelStatus('offline');
        // start a new chat for each test
        newVisitor = (0, data_1.createFakeVisitor)();
        poLiveChat = new page_objects_1.OmnichannelLiveChat(page, api);
        yield page.goto('/livechat');
        yield poLiveChat.openLiveChat();
        yield poLiveChat.sendMessage(newVisitor, false);
        yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_user');
        yield poLiveChat.btnSendMessageToOnlineAgent.click();
    }));
    (0, test_1.test)('expect chat to be auto transferred to next agent within 5 seconds of no reply from first agent', () => __awaiter(void 0, void 0, void 0, function* () {
        yield agent1.poHomeChannel.sidenav.openChat(newVisitor.name);
        yield agent2.poHomeChannel.sidenav.switchOmnichannelStatus('online');
        // wait for the chat to be closed automatically for 5 seconds
        yield agent1.page.waitForTimeout(7000);
        yield agent2.poHomeChannel.sidenav.openChat(newVisitor.name);
    }));
});
