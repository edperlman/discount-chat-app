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
const firstVisitor = (0, data_1.createFakeVisitor)();
const secondVisitor = (0, data_1.createFakeVisitor)();
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.describe('OC - Livechat - Queue Management', () => {
    test_1.test.skip(!constants_1.IS_EE, 'Enterprise Only');
    let poHomeOmnichannel;
    let poLiveChat;
    const waitingQueueMessage = 'This is a message from Waiting Queue';
    const queuePosition1 = 'Your spot is #1';
    const queuePosition2 = 'Your spot is #2';
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api, browser }) {
        yield Promise.all([
            api.post('/settings/Livechat_Routing_Method', { value: 'Manual_Selection' }),
            api.post('/settings/Livechat_waiting_queue', { value: true }),
            api.post('/settings/Livechat_waiting_queue_message', { value: waitingQueueMessage }),
            api.post('/livechat/users/agent', { username: 'user1' }),
        ]);
        const { page: omniPage } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/', true);
        poHomeOmnichannel = new page_objects_1.HomeOmnichannel(omniPage);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, api }) {
        const context = yield browser.newContext();
        const page2 = yield context.newPage();
        poLiveChat = new page_objects_1.OmnichannelLiveChat(page2, api);
        yield poLiveChat.page.goto('/livechat');
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield Promise.all([
            api.post('/settings/Livechat_Routing_Method', { value: 'Auto_Selection' }),
            api.post('/settings/Livechat_waiting_queue', { value: false }),
            api.post('/settings/Livechat_waiting_queue_message', { value: '' }),
            api.delete('/livechat/users/agent/user1'),
        ]);
        yield poHomeOmnichannel.page.close();
    }));
    test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield poLiveChat.closeChat();
        yield poLiveChat.page.close();
    }));
    (0, test_1.test)('OC - Queue Management - Waiting Queue Message enabled', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('should start livechat session', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.openAnyLiveChatAndSendMessage({
                liveChatUser: firstVisitor,
                message: 'Test message',
                isOffline: false,
            });
        }));
        yield test_1.test.step('expect to receive Waiting Queue message on chat', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poLiveChat.page.locator(`div >> text=${waitingQueueMessage}`)).toBeVisible();
        }));
    }));
    test_1.test.describe('OC - Queue Management - Update Queue Position', () => {
        let poLiveChat2;
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, api }) {
            const context = yield browser.newContext();
            const page = yield context.newPage();
            poLiveChat2 = new page_objects_1.OmnichannelLiveChat(page, api);
            yield poLiveChat2.page.goto('/livechat');
        }));
        test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat2.closeChat();
            yield poLiveChat2.page.close();
        }));
        (0, test_1.test)('Update user position on Queue', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('should start secondary livechat session', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat2.openAnyLiveChatAndSendMessage({
                    liveChatUser: secondVisitor,
                    message: 'Test message',
                    isOffline: false,
                });
            }));
            yield test_1.test.step('should start primary livechat session', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poLiveChat.openAnyLiveChatAndSendMessage({
                    liveChatUser: firstVisitor,
                    message: 'Test message',
                    isOffline: false,
                });
            }));
            yield test_1.test.step('should verify the queue position of the primary user', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(poLiveChat.page.locator(`div[role='alert'] >> text=${queuePosition2}`)).toBeVisible();
            }));
            yield test_1.test.step('should allow the agent to take the secondary user chat', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poHomeOmnichannel.sidenav.getQueuedChat(secondVisitor.name).click();
                yield (0, test_1.expect)(poHomeOmnichannel.content.btnTakeChat).toBeVisible();
                yield poHomeOmnichannel.content.btnTakeChat.click();
                yield (0, test_1.expect)(poHomeOmnichannel.content.lastSystemMessageBody).toHaveText('joined the channel');
            }));
            yield test_1.test.step('expect the queue position of the primary user to update after the secondary users chat is taken', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(poLiveChat.page.locator(`div[role='alert'] >> text=${queuePosition1}`)).toBeVisible();
            }));
        }));
    });
});
