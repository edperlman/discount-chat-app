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
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const agents_1 = require("../utils/omnichannel/agents");
const test_1 = require("../utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.skip(!constants_1.IS_EE, 'Enterprise Only');
test_1.test.describe('OC - Livechat - Message list background', () => __awaiter(void 0, void 0, void 0, function* () {
    let agent;
    let poLiveChat;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        agent = yield (0, agents_1.createAgent)(api, 'user1');
        const res = yield (0, agents_1.makeAgentAvailable)(api, agent.data._id);
        if (res.status() !== 200) {
            throw new Error('Failed to make agent available');
        }
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poLiveChat = new page_objects_1.OmnichannelLiveChatEmbedded(page);
        yield page.goto('/packages/rocketchat_livechat/assets/demo.html');
    }));
    test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.close();
    }));
    test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield agent.delete();
    }));
    (0, test_1.test)('OC - Livechat - Change message list background', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api, page }) {
        const visitor = (0, data_1.createFakeVisitor)();
        yield test_1.test.step('should initiate Livechat conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.openLiveChat();
            yield poLiveChat.sendMessage(visitor, false);
            yield poLiveChat.onlineAgentMessage.fill('message_from_user');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            yield (0, test_1.expect)(poLiveChat.txtChatMessage('message_from_user')).toBeVisible();
        }));
        yield test_1.test.step('expect message list to have default background', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(yield poLiveChat.messageListBackground).toBe('rgba(0, 0, 0, 0)');
        }));
        yield test_1.test.step('expect to change message list background', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api.post('/settings/Livechat_background', { value: 'rgb(186, 1, 85)' });
            yield (0, test_1.expect)(res.status()).toBe(200);
            yield page.reload();
            yield poLiveChat.openLiveChat();
            yield (0, test_1.expect)(yield poLiveChat.messageListBackground).toBe('rgb(186, 1, 85)');
        }));
        yield test_1.test.step('expect to give priority to background provided via api', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.setTheme({ background: 'rgb(186, 218, 85)' }));
            yield (0, test_1.expect)(yield poLiveChat.messageListBackground).toBe('rgb(186, 218, 85)');
        }));
        yield test_1.test.step('expect to fallback to setting if api background is not available', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.page.evaluate(() => window.RocketChat.livechat.setTheme({ background: undefined }));
            yield (0, test_1.expect)(yield poLiveChat.messageListBackground).toBe('rgb(186, 1, 85)');
        }));
        yield test_1.test.step('expect to reset message list background to default', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api.post('/settings/Livechat_background', { value: '' });
            yield (0, test_1.expect)(res.status()).toBe(200);
            yield page.reload();
            yield poLiveChat.openLiveChat();
            yield (0, test_1.expect)(yield poLiveChat.messageListBackground).toBe('rgba(0, 0, 0, 0)');
        }));
        yield test_1.test.step('should close the conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.btnOptions.click();
            yield poLiveChat.btnCloseChat.click();
            yield poLiveChat.btnCloseChatConfirm.click();
            yield (0, test_1.expect)(poLiveChat.btnNewChat).toBeVisible();
        }));
    }));
}));
