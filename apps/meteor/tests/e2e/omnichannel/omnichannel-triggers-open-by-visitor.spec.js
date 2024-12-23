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
const createAuxContext_1 = require("../fixtures/createAuxContext");
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const test_1 = require("../utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe('OC - Livechat Triggers - Open by Visitor', () => {
    let poLiveChat;
    let newVisitor;
    let agent;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api, browser }) {
        newVisitor = (0, data_1.createFakeVisitor)();
        const requests = yield Promise.all([
            api.post('/livechat/users/agent', { username: 'user1' }),
            api.post('/livechat/users/manager', { username: 'user1' }),
            api.post('/livechat/triggers', {
                name: 'open',
                description: '',
                enabled: true,
                runOnce: false,
                conditions: [
                    {
                        name: 'chat-opened-by-visitor',
                        value: '',
                    },
                ],
                actions: [
                    {
                        name: 'send-message',
                        params: {
                            name: '',
                            msg: 'This is a trigger message open by visitor',
                            sender: 'queue',
                        },
                    },
                ],
            }),
        ]);
        requests.every((e) => (0, test_1.expect)(e.status()).toBe(200));
        const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/');
        agent = { page, poHomeOmnichannel: new page_objects_1.HomeOmnichannel(page) };
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        poLiveChat = new page_objects_1.OmnichannelLiveChat(page, api);
        yield page.goto('/livechat');
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const ids = (yield (yield api.get('/livechat/triggers')).json()).triggers.map((trigger) => trigger._id);
        yield Promise.all(ids.map((id) => api.delete(`/livechat/triggers/${id}`)));
        yield Promise.all([
            api.delete('/livechat/users/agent/user1'),
            api.delete('/livechat/users/manager/user1'),
            api.post('/settings/Livechat_clear_local_storage_when_chat_ended', { value: false }),
        ]);
        yield agent.page.close();
    }));
    (0, test_1.test)('OC - Livechat Triggers - after the visitor opens the chat the trigger message should not be visible neither after a page reload', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poLiveChat.openLiveChat();
        yield (0, test_1.expect)(poLiveChat.txtChatMessage('This is a trigger message open by visitor')).toBeVisible();
        yield poLiveChat.btnChatNow.click();
        yield poLiveChat.sendMessage(newVisitor, false);
        yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor');
        yield poLiveChat.btnSendMessageToOnlineAgent.click();
        yield (0, test_1.expect)(poLiveChat.txtChatMessage('this_a_test_message_from_visitor')).toBeVisible();
        yield poLiveChat.page.reload();
        // if the request took too long, the loadMessage cleans triggers, but if the fetch is fast enough, the trigger message will be visible
        yield poLiveChat.page.waitForRequest(/livechat\/messages.history/);
        yield poLiveChat.openLiveChat();
        yield (0, test_1.expect)(poLiveChat.txtChatMessage('This is a trigger message open by visitor')).not.toBeVisible();
        yield (0, test_1.expect)(poLiveChat.txtChatMessage('this_a_test_message_from_visitor')).toBeVisible();
    }));
});
