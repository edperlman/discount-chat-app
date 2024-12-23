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
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.describe('OC - Livechat - Avatar visibility', () => __awaiter(void 0, void 0, void 0, function* () {
    let agent;
    let poLiveChat;
    let poAuxContext;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        agent = yield (0, agents_1.createAgent)(api, 'user1');
        const res = yield (0, agents_1.makeAgentAvailable)(api, agent.data._id);
        if (res.status() !== 200) {
            throw new Error('Failed to make agent available');
        }
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
        const { page: pageCtx } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1);
        poAuxContext = { page: pageCtx, poHomeOmnichannel: new page_objects_1.HomeOmnichannel(pageCtx) };
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poLiveChat = new page_objects_1.OmnichannelLiveChatEmbedded(page);
        yield page.goto('/packages/rocketchat_livechat/assets/demo.html');
    }));
    test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poAuxContext.page.close();
        yield page.close();
    }));
    test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield agent.delete();
    }));
    (0, test_1.test)('OC - Livechat - Change avatar visibility', () => __awaiter(void 0, void 0, void 0, function* () {
        const visitor = (0, data_1.createFakeVisitor)();
        yield test_1.test.step('should initiate Livechat conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.openLiveChat();
            yield poLiveChat.sendMessage(visitor, false);
            yield poLiveChat.onlineAgentMessage.fill('this_a_test_message_from_user');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            yield (0, test_1.expect)(poLiveChat.txtChatMessage('this_a_test_message_from_user')).toBeVisible();
        }));
        yield test_1.test.step('expect to send a message as agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poAuxContext.poHomeOmnichannel.sidenav.openChat(visitor.name);
            yield poAuxContext.poHomeOmnichannel.content.sendMessage('this_is_a_test_message_from_agent');
            yield (0, test_1.expect)(poLiveChat.txtChatMessage('this_is_a_test_message_from_agent')).toBeVisible();
        }));
        yield test_1.test.step('expect visitor avatar to be hidden', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poLiveChat.imgAvatar(visitor.name)).not.toBeVisible();
        }));
        yield test_1.test.step('expect agent avatar to be visible', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poLiveChat.imgAvatar('user1')).toBeVisible();
        }));
        yield test_1.test.step('expect to make visitor avatar visible', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.setTheme({ hideGuestAvatar: false }));
            yield (0, test_1.expect)(poLiveChat.imgAvatar(visitor.name)).toBeVisible();
        }));
        yield test_1.test.step('expect to hide agent avatar', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.setTheme({ hideAgentAvatar: false }));
            yield (0, test_1.expect)(poLiveChat.imgAvatar('user1')).toBeVisible();
        }));
        yield test_1.test.step('should close the conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poAuxContext.poHomeOmnichannel.sidenav.openChat(visitor.name);
            yield poAuxContext.poHomeOmnichannel.content.btnCloseChat.click();
            yield poAuxContext.poHomeOmnichannel.content.closeChatModal.inputComment.fill('this_is_a_test_comment');
            yield poAuxContext.poHomeOmnichannel.content.closeChatModal.btnConfirm.click();
            yield (0, test_1.expect)(poAuxContext.poHomeOmnichannel.toastSuccess).toBeVisible();
        }));
    }));
}));
