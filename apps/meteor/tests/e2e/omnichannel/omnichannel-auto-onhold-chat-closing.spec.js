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
test_1.test.describe('omnichannel-auto-onhold-chat-closing', () => {
    test_1.test.skip(!constants_1.IS_EE, 'Enterprise Only');
    let poLiveChat;
    let newVisitor;
    let agent;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api, browser }) {
        yield Promise.all([
            api.post('/livechat/users/agent', { username: 'user1' }).then((res) => (0, test_1.expect)(res.status()).toBe(200)),
            api.post('/settings/Livechat_Routing_Method', { value: 'Auto_Selection' }).then((res) => (0, test_1.expect)(res.status()).toBe(200)),
            api.post('/settings/Livechat_auto_close_on_hold_chats_timeout', { value: 5 }).then((res) => (0, test_1.expect)(res.status()).toBe(200)),
            api.post('/settings/Livechat_allow_manual_on_hold', { value: true }).then((res) => (0, test_1.expect)(res.status()).toBe(200)),
        ]);
        const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1);
        agent = { page, poHomeChannel: new page_objects_1.HomeChannel(page) };
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield agent.page.close();
        yield Promise.all([
            api.delete('/livechat/users/agent/user1').then((res) => (0, test_1.expect)(res.status()).toBe(200)),
            api.post('/settings/Livechat_auto_close_on_hold_chats_timeout', { value: 3600 }).then((res) => (0, test_1.expect)(res.status()).toBe(200)),
            api.post('/settings/Livechat_allow_manual_on_hold', { value: false }).then((res) => (0, test_1.expect)(res.status()).toBe(200)),
        ]);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        // make "user-1" online
        yield agent.poHomeChannel.sidenav.switchStatus('online');
        // start a new chat for each test
        newVisitor = (0, data_1.createFakeVisitor)();
        poLiveChat = new page_objects_1.OmnichannelLiveChat(page, api);
        yield page.goto('/livechat');
        yield poLiveChat.openLiveChat();
        yield poLiveChat.sendMessage(newVisitor, false);
        yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_user');
        yield poLiveChat.btnSendMessageToOnlineAgent.click();
    }));
    // Note: Skipping this test as the scheduler is gonna take 1 minute to process now
    // And waiting for 1 minute in a test is horrible
    test_1.test.skip('expect on-hold chat to be closed automatically in 5 seconds', () => __awaiter(void 0, void 0, void 0, function* () {
        yield agent.poHomeChannel.sidenav.openChat(newVisitor.name);
        yield agent.poHomeChannel.content.sendMessage('this_is_a_test_message_from_agent');
        yield agent.poHomeChannel.content.btnOnHold.click();
        yield agent.poHomeChannel.content.btnModalConfirm.click();
        // expect to see a system message saying the chat was on-hold
        yield (0, test_1.expect)(agent.poHomeChannel.content.lastSystemMessageBody).toHaveText(`Chat On Hold: The chat was manually placed On Hold by user1`);
        yield (0, test_1.expect)(agent.poHomeChannel.content.inputMessage).not.toBeVisible();
        yield (0, test_1.expect)(agent.poHomeChannel.content.resumeOnHoldOmnichannelChatButton).toBeVisible();
        // current url
        const chatRoomUrl = agent.page.url();
        // wait for the chat to be closed automatically for 5 seconds
        yield agent.page.waitForTimeout(7000);
        // expect to see a system message saying the chat was closed automatically in the closed chat room
        yield agent.page.goto(chatRoomUrl);
        (0, test_1.expect)(yield agent.poHomeChannel.content.lastSystemMessageBody.innerText()).toBe('Conversation closed: Closed automatically because chat was On Hold for 5 seconds.');
    }));
});
