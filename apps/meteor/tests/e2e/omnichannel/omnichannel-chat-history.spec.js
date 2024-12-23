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
test_1.test.describe('Omnichannel chat history', () => {
    let poLiveChat;
    let newVisitor;
    let agent;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api, browser }) {
        newVisitor = (0, data_1.createFakeVisitor)();
        // Set user user 1 as manager and agent
        yield api.post('/livechat/users/agent', { username: 'user1' });
        yield api.post('/livechat/users/manager', { username: 'user1' });
        const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1);
        agent = { page, poHomeOmnichannel: new page_objects_1.HomeOmnichannel(page) };
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        poLiveChat = new page_objects_1.OmnichannelLiveChat(page, api);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.delete('/livechat/users/agent/user1');
        yield api.delete('/livechat/users/manager/user1');
        yield agent.page.close();
    }));
    (0, test_1.test)('Receiving a message from visitor', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('Expect send a message as a visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.goto('/livechat');
            yield poLiveChat.openLiveChat();
            yield poLiveChat.sendMessage(newVisitor, false);
            yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
        }));
        yield test_1.test.step('Expect to have 1 omnichannel assigned to agent 1', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agent.poHomeOmnichannel.sidenav.openChat(newVisitor.name);
        }));
        yield test_1.test.step('Expect to be able to close an omnichannel to conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agent.poHomeOmnichannel.content.btnCloseChat.click();
            yield agent.poHomeOmnichannel.content.inputModalClosingComment.type('any_comment');
            yield agent.poHomeOmnichannel.content.btnModalConfirm.click();
            yield (0, test_1.expect)(agent.poHomeOmnichannel.toastSuccess).toBeVisible();
        }));
        yield test_1.test.step('Expect send a message as a visitor again to reopen chat', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.goto('/livechat');
            yield poLiveChat.openLiveChat();
            yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_visitor');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
        }));
        yield test_1.test.step('Expect to have 1 omnichannel assigned to agent 1', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agent.poHomeOmnichannel.sidenav.openChat(newVisitor.name);
        }));
        yield test_1.test.step('Expect to be able to see conversation history', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agent.poHomeOmnichannel.btnContactInfo.click();
            yield agent.poHomeOmnichannel.contacts.contactInfo.tabHistory.click();
            yield (0, test_1.expect)(agent.poHomeOmnichannel.contacts.contactInfo.historyItem).toBeVisible();
            yield agent.poHomeOmnichannel.contacts.contactInfo.historyItem.click();
            yield (0, test_1.expect)(agent.poHomeOmnichannel.contacts.contactInfo.historyMessage).toBeVisible();
        }));
    }));
});
