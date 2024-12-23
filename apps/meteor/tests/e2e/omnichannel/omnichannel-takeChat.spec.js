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
test_1.test.describe('omnichannel-takeChat', () => {
    let poLiveChat;
    let newVisitor;
    let agent;
    const sendLivechatMessage = () => __awaiter(void 0, void 0, void 0, function* () {
        yield poLiveChat.openLiveChat();
        yield poLiveChat.sendMessage(newVisitor, false);
        yield poLiveChat.onlineAgentMessage.fill('this_a_test_message_from_user');
        yield poLiveChat.btnSendMessageToOnlineAgent.click();
    });
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api, browser }) {
        yield Promise.all([
            yield api.post('/livechat/users/agent', { username: 'user1' }).then((res) => (0, test_1.expect)(res.status()).toBe(200)),
            yield api.post('/settings/Livechat_Routing_Method', { value: 'Manual_Selection' }).then((res) => (0, test_1.expect)(res.status()).toBe(200)),
            yield api.post('/settings/Livechat_enabled_when_agent_idle', { value: false }).then((res) => (0, test_1.expect)(res.status()).toBe(200)),
        ]);
        const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1);
        agent = { page, poHomeChannel: new page_objects_1.HomeOmnichannel(page) };
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield agent.poHomeChannel.sidenav.switchOmnichannelStatus('online');
        yield agent.poHomeChannel.sidenav.switchStatus('online');
        yield agent.page.close();
        yield Promise.all([
            yield api.delete('/livechat/users/agent/user1'),
            yield api.post('/settings/Livechat_Routing_Method', { value: 'Auto_Selection' }),
            yield api.post('/settings/Livechat_enabled_when_agent_idle', { value: true }),
        ]);
    }));
    test_1.test.beforeEach('start a new livechat chat', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield agent.poHomeChannel.sidenav.switchStatus('online');
        newVisitor = (0, data_1.createFakeVisitor)();
        poLiveChat = new page_objects_1.OmnichannelLiveChat(page, api);
        yield page.goto('/livechat');
    }));
    (0, test_1.test)('When agent is online should take the chat', () => __awaiter(void 0, void 0, void 0, function* () {
        yield sendLivechatMessage();
        yield agent.poHomeChannel.sidenav.getQueuedChat(newVisitor.name).click();
        yield (0, test_1.expect)(agent.poHomeChannel.content.btnTakeChat).toBeVisible();
        yield agent.poHomeChannel.content.btnTakeChat.click();
        yield agent.poHomeChannel.sidenav.openChat(newVisitor.name);
        yield (0, test_1.expect)(agent.poHomeChannel.content.btnTakeChat).not.toBeVisible();
        yield (0, test_1.expect)(agent.poHomeChannel.content.inputMessage).toBeVisible();
    }));
    (0, test_1.test)('When agent is offline should not take the chat', () => __awaiter(void 0, void 0, void 0, function* () {
        yield agent.poHomeChannel.sidenav.switchStatus('offline');
        yield sendLivechatMessage();
        yield (0, test_1.expect)(poLiveChat.alertMessage('Error starting a new conversation: Sorry, no online agents [no-agent-online]')).toBeVisible();
    }));
    (0, test_1.test)('When a new livechat conversation starts but agent is offline, it should not be able to take the chat', () => __awaiter(void 0, void 0, void 0, function* () {
        yield sendLivechatMessage();
        yield agent.poHomeChannel.sidenav.switchStatus('offline');
        yield agent.poHomeChannel.sidenav.getQueuedChat(newVisitor.name).click();
        yield (0, test_1.expect)(agent.poHomeChannel.content.btnTakeChat).toBeDisabled();
        yield agent.poHomeChannel.sidenav.switchStatus('online');
        yield agent.poHomeChannel.sidenav.switchOmnichannelStatus('offline');
        yield (0, test_1.expect)(agent.poHomeChannel.content.btnTakeChat).toBeDisabled();
    }));
});
