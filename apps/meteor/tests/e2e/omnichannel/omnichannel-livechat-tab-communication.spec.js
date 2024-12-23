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
const agents_1 = require("../utils/omnichannel/agents");
const test_1 = require("../utils/test");
test_1.test.describe('OC - Livechat - Cross Tab Communication', () => {
    let pageLivechat1;
    let pageLivechat2;
    let poHomeOmnichannel;
    let agent;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, api }) {
        agent = yield (0, agents_1.createAgent)(api, 'user1');
        const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/');
        poHomeOmnichannel = new page_objects_1.HomeOmnichannel(page);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, api }) {
        const context = yield browser.newContext();
        const p1 = yield context.newPage();
        const p2 = yield context.newPage();
        pageLivechat1 = new page_objects_1.OmnichannelLiveChat(p1, api);
        pageLivechat2 = new page_objects_1.OmnichannelLiveChat(p2, api);
        yield pageLivechat1.page.goto('/livechat');
        yield pageLivechat2.page.goto('/livechat');
    }));
    test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield pageLivechat1.page.close();
        yield pageLivechat2.page.close();
    }));
    test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeOmnichannel.page.close();
        yield agent.delete();
    }));
    (0, test_1.test)('OC - Livechat - Send messages, close chat and start again 2 tabs', () => __awaiter(void 0, void 0, void 0, function* () {
        const visitor = (0, data_1.createFakeVisitor)();
        yield test_1.test.step('expect livechat conversations to be synced', () => __awaiter(void 0, void 0, void 0, function* () {
            yield pageLivechat1.openAnyLiveChat();
            yield pageLivechat1.sendMessage(visitor, false);
            yield pageLivechat1.onlineAgentMessage.fill('this_a_test_message_from_user');
            yield pageLivechat1.btnSendMessageToOnlineAgent.click();
            yield (0, test_1.expect)(pageLivechat1.txtChatMessage('this_a_test_message_from_user')).toBeVisible();
            yield (0, test_1.expect)(pageLivechat2.txtChatMessage('this_a_test_message_from_user')).toBeVisible();
        }));
        yield test_1.test.step('expect to close livechat conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(pageLivechat1.btnOptions).toBeVisible();
            yield pageLivechat1.btnOptions.click();
            yield (0, test_1.expect)(pageLivechat1.btnCloseChat).toBeVisible();
            yield pageLivechat1.btnCloseChat.click();
            yield pageLivechat1.btnCloseChatConfirm.click();
        }));
        yield test_1.test.step('expect to restart a livechat conversation and tabs to be synced', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(pageLivechat1.btnNewChat).toBeVisible();
            yield pageLivechat1.startNewChat();
            yield pageLivechat1.onlineAgentMessage.fill('this_a_test_message_from_user_after_close');
            yield pageLivechat1.btnSendMessageToOnlineAgent.click();
            yield pageLivechat1.txtChatMessage('this_a_test_message_from_user').waitFor({ state: 'hidden' });
            yield pageLivechat2.txtChatMessage('this_a_test_message_from_user').waitFor({ state: 'hidden' });
            yield (0, test_1.expect)(pageLivechat1.txtChatMessage('this_a_test_message_from_user')).not.toBeVisible();
            yield (0, test_1.expect)(pageLivechat2.txtChatMessage('this_a_test_message_from_user')).not.toBeVisible();
            yield (0, test_1.expect)(pageLivechat1.txtChatMessage('this_a_test_message_from_user_after_close')).toBeVisible();
            yield (0, test_1.expect)(pageLivechat2.txtChatMessage('this_a_test_message_from_user_after_close')).toBeVisible();
        }));
        yield test_1.test.step('expect to close livechat conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(pageLivechat1.btnOptions).toBeVisible();
            yield pageLivechat1.btnOptions.click();
            yield (0, test_1.expect)(pageLivechat1.btnCloseChat).toBeVisible();
            yield pageLivechat1.btnCloseChat.click();
            yield pageLivechat1.btnCloseChatConfirm.click();
        }));
    }));
});
