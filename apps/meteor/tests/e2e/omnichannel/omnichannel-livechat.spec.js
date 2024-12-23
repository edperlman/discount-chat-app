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
const utils_1 = require("../utils");
const agents_1 = require("../utils/omnichannel/agents");
const test_1 = require("../utils/test");
const firstVisitor = (0, data_1.createFakeVisitor)();
const secondVisitor = (0, data_1.createFakeVisitor)();
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.describe.serial('OC - Livechat', () => {
    let poLiveChat;
    let poHomeOmnichannel;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const statusCode = (yield api.post('/livechat/users/agent', { username: 'user1' })).status();
        (0, test_1.expect)(statusCode).toBe(200);
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, api }) {
        const { page: livechatPage } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/livechat', false);
        poLiveChat = new page_objects_1.OmnichannelLiveChat(livechatPage, api);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeOmnichannel = new page_objects_1.HomeOmnichannel(page);
        yield page.goto('/');
        yield page.locator('.main-content').waitFor();
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.delete('/livechat/users/agent/user1');
        yield poLiveChat.page.close();
    }));
    (0, test_1.test)('OC - Livechat - Send message to online agent', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('expect message to be sent by livechat', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.page.reload();
            yield poLiveChat.openAnyLiveChat();
            yield poLiveChat.sendMessage(firstVisitor, false);
            yield poLiveChat.onlineAgentMessage.fill('this_a_test_message_from_user');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            yield (0, test_1.expect)(poLiveChat.page.locator('div >> text="this_a_test_message_from_user"')).toBeVisible();
        }));
        yield test_1.test.step('expect message to be received by agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeOmnichannel.sidenav.openChat(firstVisitor.name);
            yield (0, test_1.expect)(poHomeOmnichannel.content.lastUserMessage).toBeVisible();
            yield (0, test_1.expect)(poHomeOmnichannel.content.lastUserMessage).toContainText('this_a_test_message_from_user');
        }));
    }));
    (0, test_1.test)('OC - Livechat - Send message to livechat customer', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeOmnichannel.sidenav.openChat(firstVisitor.name);
        yield test_1.test.step('expect message to be sent by agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeOmnichannel.content.sendMessage('this_a_test_message_from_agent');
            yield (0, test_1.expect)(poLiveChat.page.locator('div >> text="this_a_test_message_from_agent"')).toBeVisible();
        }));
        yield test_1.test.step('expect when user minimizes the livechat screen, the composer should be hidden', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.openAnyLiveChat();
            yield (0, test_1.expect)(poLiveChat.page.locator('[contenteditable="true"]')).not.toBeVisible();
        }));
        yield test_1.test.step('expect message to be received by minimized livechat', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeOmnichannel.content.sendMessage('this_a_test_message_again_from_agent');
            yield (0, test_1.expect)(poLiveChat.unreadMessagesBadge(1)).toBeVisible();
        }));
        yield test_1.test.step('expect multiple messages to be received by minimized livechat', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeOmnichannel.content.sendMessage('this_a_test_message_once_again_from_agent');
            yield (0, test_1.expect)(poLiveChat.unreadMessagesBadge(2)).toBeVisible();
        }));
        yield test_1.test.step('expect unread messages to be visible after a reload', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.page.reload();
            yield (0, test_1.expect)(poLiveChat.unreadMessagesBadge(2)).toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Livechat - Send message to agent after reload', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('expect unread counter to be empty after user sends a message', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.openAnyLiveChat();
            yield poLiveChat.onlineAgentMessage.fill('this_a_test_message_from_user');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            (0, test_1.expect)(yield poLiveChat.unreadMessagesBadge(0).all()).toHaveLength(0);
        }));
    }));
    (0, test_1.test)('OC - Livechat - Close livechat conversation', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeOmnichannel.sidenav.openChat(firstVisitor.name);
        yield test_1.test.step('expect livechat conversation to be closed by agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeOmnichannel.content.btnCloseChat.click();
            yield poHomeOmnichannel.content.closeChatModal.inputComment.fill('this_is_a_test_comment');
            yield poHomeOmnichannel.content.closeChatModal.btnConfirm.click();
            yield (0, test_1.expect)(poHomeOmnichannel.toastSuccess).toBeVisible();
        }));
    }));
});
test_1.test.describe.serial('OC - Livechat - Visitors closing the room is disabled', () => {
    let poLiveChat;
    let poHomeOmnichannel;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/livechat/users/agent', { username: 'user1' });
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, api }) {
        const { page: livechatPage } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/livechat', false);
        poLiveChat = new page_objects_1.OmnichannelLiveChat(livechatPage, api);
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, api }) {
        yield (0, utils_1.setSettingValueById)(api, 'Livechat_allow_visitor_closing_chat', false);
        const { page: omniPage } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/', true);
        poHomeOmnichannel = new page_objects_1.HomeOmnichannel(omniPage);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield (0, utils_1.setSettingValueById)(api, 'Livechat_allow_visitor_closing_chat', true);
        yield api.delete('/livechat/users/agent/user1');
        yield poLiveChat.page.close();
    }));
    (0, test_1.test)('OC - Livechat - Close Chat disabled', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poLiveChat.page.reload();
        yield poLiveChat.openAnyLiveChat();
        yield poLiveChat.sendMessage(firstVisitor, false);
        yield poLiveChat.onlineAgentMessage.fill('this_a_test_message_from_user');
        yield poLiveChat.btnSendMessageToOnlineAgent.click();
        yield test_1.test.step('expect to close a livechat conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poLiveChat.btnOptions).not.toBeVisible();
            yield (0, test_1.expect)(poLiveChat.btnCloseChat).not.toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Livechat - Close chat disabled, agents can close', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeOmnichannel.sidenav.openChat(firstVisitor.name);
        yield test_1.test.step('expect livechat conversation to be closed by agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeOmnichannel.content.btnCloseChat.click();
            yield poHomeOmnichannel.content.closeChatModal.inputComment.fill('this_is_a_test_comment');
            yield poHomeOmnichannel.content.closeChatModal.btnConfirm.click();
            yield (0, test_1.expect)(poHomeOmnichannel.toastSuccess).toBeVisible();
        }));
    }));
});
test_1.test.describe.serial('OC - Livechat - Resub after close room', () => {
    let poLiveChat;
    let poHomeOmnichannel;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const statusCode = (yield api.post('/livechat/users/agent', { username: 'user1' })).status();
        (0, test_1.expect)(statusCode).toBe(200);
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, api }) {
        yield api.post('/settings/Livechat_clear_local_storage_when_chat_ended', { value: true });
        const { page: omniPage } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/', true);
        poHomeOmnichannel = new page_objects_1.HomeOmnichannel(omniPage);
        const { page: livechatPage } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/livechat', false);
        poLiveChat = new page_objects_1.OmnichannelLiveChat(livechatPage, api);
        yield poLiveChat.sendMessageAndCloseChat(firstVisitor);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/settings/Livechat_clear_local_storage_when_chat_ended', { value: false });
        yield api.delete('/livechat/users/agent/user1');
        yield poLiveChat.page.close();
        yield poHomeOmnichannel.page.close();
    }));
    (0, test_1.test)('OC - Livechat - Resub after close room', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('expect livechat conversation to be opened again, different guest', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.startNewChat();
            yield poLiveChat.sendMessage(secondVisitor, false);
            yield poLiveChat.onlineAgentMessage.fill('this_a_test_message_from_user');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            yield (0, test_1.expect)(poLiveChat.page.locator('div >> text="this_a_test_message_from_user"')).toBeVisible();
        }));
        yield test_1.test.step('expect message to be received by agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeOmnichannel.sidenav.openChat(secondVisitor.name);
            yield (0, test_1.expect)(poHomeOmnichannel.content.lastUserMessage).toBeVisible();
            yield (0, test_1.expect)(poHomeOmnichannel.content.lastUserMessage).toContainText('this_a_test_message_from_user');
        }));
        yield test_1.test.step('expect message to be sent by agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeOmnichannel.content.sendMessage('this_a_test_message_from_agent');
            yield (0, test_1.expect)(poLiveChat.page.locator('div >> text="this_a_test_message_from_agent"')).toBeVisible();
        }));
    }));
});
test_1.test.describe('OC - Livechat - Resume chat after closing', () => {
    let poLiveChat;
    let poHomeOmnichannel;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const statusCode = (yield api.post('/livechat/users/agent', { username: 'user1' })).status();
        (0, test_1.expect)(statusCode).toBe(200);
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, api }) {
        const { page: omniPage } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/', true);
        poHomeOmnichannel = new page_objects_1.HomeOmnichannel(omniPage);
        const { page: livechatPage } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/livechat', false);
        poLiveChat = new page_objects_1.OmnichannelLiveChat(livechatPage, api);
        yield poLiveChat.sendMessageAndCloseChat(firstVisitor);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.delete('/livechat/users/agent/user1');
        yield poLiveChat.page.close();
        yield poHomeOmnichannel.page.close();
    }));
    (0, test_1.test)('OC - Livechat - Resume chat after closing', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('expect livechat conversation to be opened again', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.startNewChat();
            yield (0, test_1.expect)(poLiveChat.onlineAgentMessage).toBeVisible();
            yield poLiveChat.onlineAgentMessage.fill('this_a_test_message_from_user');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            yield (0, test_1.expect)(poLiveChat.page.locator('div >> text="this_a_test_message_from_user"')).toBeVisible();
        }));
        yield test_1.test.step('expect message to be received by agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeOmnichannel.sidenav.openChat(firstVisitor.name);
            yield (0, test_1.expect)(poHomeOmnichannel.content.lastUserMessage).toBeVisible();
            yield (0, test_1.expect)(poHomeOmnichannel.content.lastUserMessage).toContainText('this_a_test_message_from_user');
        }));
        yield test_1.test.step('expect message to be sent by agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeOmnichannel.content.sendMessage('this_a_test_message_from_agent');
            yield (0, test_1.expect)(poLiveChat.page.locator('div >> text="this_a_test_message_from_agent"')).toBeVisible();
        }));
    }));
});
test_1.test.describe('OC - Livechat - Close chat using widget', () => {
    let poLiveChat;
    let poHomeOmnichannel;
    let agent;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, api }) {
        agent = yield (0, agents_1.createAgent)(api, 'user1');
        const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/');
        poHomeOmnichannel = new page_objects_1.HomeOmnichannel(page);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        poLiveChat = new page_objects_1.OmnichannelLiveChat(page, api);
        yield poLiveChat.page.goto('/livechat');
    }));
    test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeOmnichannel.page.close();
        yield agent.delete();
    }));
    (0, test_1.test)('OC - Livechat - Close Chat', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poLiveChat.openAnyLiveChat();
        yield poLiveChat.sendMessage(firstVisitor, false);
        yield poLiveChat.onlineAgentMessage.fill('this_a_test_message_from_user');
        yield poLiveChat.btnSendMessageToOnlineAgent.click();
        yield test_1.test.step('expect to close a livechat conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poLiveChat.btnOptions).toBeVisible();
            yield poLiveChat.btnOptions.click();
            yield (0, test_1.expect)(poLiveChat.btnCloseChat).toBeVisible();
            yield poLiveChat.btnCloseChat.click();
            yield poLiveChat.btnCloseChatConfirm.click();
            yield (0, test_1.expect)(poLiveChat.btnNewChat).toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Livechat - Close Chat twice', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poLiveChat.sendMessageAndCloseChat(firstVisitor);
        yield poLiveChat.startNewChat();
        yield poLiveChat.onlineAgentMessage.fill('this_a_test_message_from_user');
        yield poLiveChat.btnSendMessageToOnlineAgent.click();
        yield test_1.test.step('expect to close a livechat conversation a second time', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poLiveChat.btnOptions).toBeVisible();
            yield poLiveChat.btnOptions.click();
            yield (0, test_1.expect)(poLiveChat.btnCloseChat).toBeVisible();
            yield poLiveChat.btnCloseChat.click();
            yield poLiveChat.btnCloseChatConfirm.click();
            yield (0, test_1.expect)(poLiveChat.btnNewChat).toBeVisible();
        }));
    }));
});
test_1.test.describe('OC - Livechat - Livechat_Display_Offline_Form', () => {
    let poLiveChat;
    const message = 'This form is not available';
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/settings/Livechat_display_offline_form', { value: false });
        yield api.post('/settings/Livechat_offline_form_unavailable', { value: message });
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        poLiveChat = new page_objects_1.OmnichannelLiveChat(page, api);
        yield poLiveChat.page.goto('/livechat');
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/settings/Livechat_display_offline_form', { value: true });
        yield api.post('/settings/Livechat_offline_form_unavailable', { value: '' });
    }));
    (0, test_1.test)('OC - Livechat - Livechat_Display_Offline_Form false', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('expect offline form to not be visible', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.openAnyLiveChat();
            yield (0, test_1.expect)(poLiveChat.page.locator(`div >> text=${message}`)).toBeVisible();
            yield (0, test_1.expect)(poLiveChat.textAreaMessage).not.toBeVisible();
        }));
    }));
});
