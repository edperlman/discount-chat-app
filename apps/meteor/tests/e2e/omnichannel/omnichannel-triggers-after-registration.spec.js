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
const faker_1 = require("@faker-js/faker");
const data_1 = require("../../mocks/data");
const createAuxContext_1 = require("../fixtures/createAuxContext");
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const test_1 = require("../utils/test");
test_1.test.describe('OC - Livechat New Chat Triggers - After Registration', () => {
    let triggersName;
    let triggerMessage;
    let poLiveChat;
    let newVisitor;
    let agent;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api, browser, page }) {
        newVisitor = (0, data_1.createFakeVisitor)();
        triggersName = faker_1.faker.string.uuid();
        triggerMessage = 'This is a trigger message after guest registration';
        yield api.post('/livechat/triggers', {
            name: triggersName,
            description: 'Creating a fresh trigger',
            enabled: true,
            runOnce: false,
            conditions: [
                {
                    name: 'after-guest-registration',
                    value: '',
                },
            ],
            actions: [
                {
                    name: 'send-message',
                    params: {
                        name: '',
                        msg: triggerMessage,
                        sender: 'queue',
                    },
                },
            ],
        });
        yield Promise.all([
            api.post('/livechat/users/agent', { username: 'user1' }),
            api.post('/livechat/users/manager', { username: 'user1' }),
        ]);
        const { page: agentPage } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1);
        agent = { page: agentPage, poHomeOmnichannel: new page_objects_1.HomeOmnichannel(agentPage) };
        poLiveChat = new page_objects_1.OmnichannelLiveChat(page, api);
    }));
    test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const ids = (yield (yield api.get('/livechat/triggers')).json()).triggers.map((trigger) => trigger._id);
        yield Promise.all(ids.map((id) => api.delete(`/livechat/triggers/${id}`)));
        yield Promise.all([api.delete('/livechat/users/agent/user1'), api.delete('/livechat/users/manager/user1')]);
        yield agent.page.close();
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/settings/Livechat_clear_local_storage_when_chat_ended', { value: false });
    }));
    test_1.test.describe('OC - Livechat New Chat Triggers - After Registration', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, test_1.test)('expect trigger message after registration', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.page.goto('/livechat');
            yield poLiveChat.sendMessageAndCloseChat(newVisitor);
            yield poLiveChat.startNewChat();
            yield (0, test_1.expect)(poLiveChat.txtChatMessage(triggerMessage)).toBeVisible();
        }));
    }));
    test_1.test.describe('OC - Livechat Triggers - After Registration - Reload', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, test_1.test)('expect trigger message after registration', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('expect trigger message after registration to be visible', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.goto('/livechat');
                yield poLiveChat.openAnyLiveChat();
                yield poLiveChat.sendMessage(newVisitor, false);
                yield (0, test_1.expect)(poLiveChat.txtChatMessage(triggerMessage)).toBeVisible();
            }));
            yield test_1.test.step('expect trigger message after registration to be visible after reload', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.page.reload();
                yield poLiveChat.openAnyLiveChat();
                yield (0, test_1.expect)(poLiveChat.txtChatMessage(triggerMessage)).toBeVisible();
            }));
            yield test_1.test.step('expect to close room and reload', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.onlineAgentMessage.type('message_after_trigger');
                yield poLiveChat.btnSendMessageToOnlineAgent.click();
                yield (0, test_1.expect)(poLiveChat.txtChatMessage('message_after_trigger')).toBeVisible();
                yield poLiveChat.closeChat();
                yield (0, test_1.expect)(poLiveChat.btnNewChat).toBeVisible();
                yield poLiveChat.startNewChat();
                yield poLiveChat.page.reload();
            }));
            yield test_1.test.step('expect trigger message after registration to be visible after reload on new chat', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.openAnyLiveChat();
                yield (0, test_1.expect)(poLiveChat.txtChatMessage(triggerMessage)).toBeVisible();
            }));
        }));
    }));
    test_1.test.describe('OC - Livechat New Chat Triggers - After Registration, clear Local storage', () => __awaiter(void 0, void 0, void 0, function* () {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield api.post('/settings/Livechat_clear_local_storage_when_chat_ended', { value: true });
        }));
        (0, test_1.test)('expect trigger message after registration not be visible after local storage clear', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.page.goto('/livechat');
            yield poLiveChat.sendMessageAndCloseChat(newVisitor);
            yield (0, test_1.expect)(poLiveChat.btnNewChat).toBeVisible();
            yield (0, test_1.expect)(poLiveChat.txtChatMessage(triggerMessage)).not.toBeVisible();
            yield poLiveChat.startNewChat();
            yield poLiveChat.sendMessage(newVisitor, false);
            yield (0, test_1.expect)(poLiveChat.txtChatMessage(triggerMessage)).toBeVisible();
        }));
    }));
});
