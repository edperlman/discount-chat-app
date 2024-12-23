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
test_1.test.describe.serial('OC - Livechat Triggers', () => {
    let triggersName;
    let triggerMessage;
    let poLiveChat;
    let newVisitor;
    let agent;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api, browser }) {
        newVisitor = (0, data_1.createFakeVisitor)();
        triggersName = faker_1.faker.string.uuid();
        triggerMessage = 'This is a trigger message';
        const requests = yield Promise.all([
            api.post('/livechat/users/agent', { username: 'user1' }),
            api.post('/livechat/users/manager', { username: 'user1' }),
            api.post('/settings/Livechat_clear_local_storage_when_chat_ended', { value: true }),
        ]);
        requests.every((e) => (0, test_1.expect)(e.status()).toBe(200));
        const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/omnichannel/triggers');
        agent = { page, poHomeOmnichannel: new page_objects_1.HomeOmnichannel(page) };
        yield page.emulateMedia({ reducedMotion: 'reduce' });
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        poLiveChat = new page_objects_1.OmnichannelLiveChat(page, api);
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
    (0, test_1.test)('OC - Livechat Triggers - Baseline', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto('/livechat');
        yield poLiveChat.openLiveChat();
        yield test_1.test.step('expect to register visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poLiveChat.btnChatNow).not.toBeVisible();
            yield poLiveChat.sendMessage(newVisitor, false);
        }));
        yield test_1.test.step('expect send a message as a visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_user');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            yield (0, test_1.expect)(poLiveChat.txtChatMessage('this_a_test_message_from_user')).toBeVisible();
        }));
        yield test_1.test.step('expect to finish this chat', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.closeChat();
            yield (0, test_1.expect)(poLiveChat.txtHeaderTitle).toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Livechat Triggers - Create and edit trigger', () => __awaiter(void 0, void 0, void 0, function* () {
        triggerMessage = 'This is a trigger message time on site';
        yield test_1.test.step('expect create new trigger', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agent.poHomeOmnichannel.triggers.createTrigger(triggersName, triggerMessage, 'time-on-site', 5);
            yield agent.poHomeOmnichannel.triggers.btnCloseToastMessage.click();
        }));
        triggerMessage = 'This is a trigger message chat opened by visitor';
        yield test_1.test.step('expect update trigger', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agent.poHomeOmnichannel.triggers.firstRowInTriggerTable(triggersName).click();
            yield agent.poHomeOmnichannel.triggers.updateTrigger(triggersName, triggerMessage);
            yield agent.poHomeOmnichannel.triggers.btnCloseToastMessage.click();
        }));
    }));
    (0, test_1.test)('OC - Livechat Triggers - Condition: chat opened by visitor', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('expect to start conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.goto('/livechat');
            yield poLiveChat.openLiveChat();
        }));
        yield test_1.test.step('expect trigger message before registration', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poLiveChat.txtChatMessage(triggerMessage)).toBeVisible();
        }));
        yield test_1.test.step('expect to register visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.btnChatNow.click();
            yield poLiveChat.sendMessage(newVisitor, false);
        }));
        yield test_1.test.step('expect trigger message after registration', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poLiveChat.txtChatMessage(triggerMessage)).not.toBeVisible();
        }));
        yield test_1.test.step('expect send a message as a visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_user');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            yield (0, test_1.expect)(poLiveChat.txtChatMessage('this_a_test_message_from_user')).toBeVisible();
        }));
        yield test_1.test.step('expect to finish this chat', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.closeChat();
            yield (0, test_1.expect)(poLiveChat.txtHeaderTitle).toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Livechat Triggers - Condition: after guest registration', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        triggerMessage = 'This is a trigger message after guest registration';
        yield test_1.test.step('expect update trigger to after guest registration', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agent.poHomeOmnichannel.triggers.firstRowInTriggerTable(`edited-${triggersName}`).click();
            yield agent.poHomeOmnichannel.triggers.fillTriggerForm({ condition: 'after-guest-registration', triggerMessage });
            yield agent.poHomeOmnichannel.triggers.btnSave.click();
            yield agent.poHomeOmnichannel.triggers.btnCloseToastMessage.click();
            yield agent.page.waitForTimeout(500);
        }));
        yield test_1.test.step('expect to start conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.goto('/livechat');
            yield poLiveChat.openLiveChat();
        }));
        yield test_1.test.step('expect not to have trigger message before registration', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poLiveChat.txtChatMessage(triggerMessage)).not.toBeVisible();
            yield (0, test_1.expect)(poLiveChat.btnChatNow).not.toBeVisible();
        }));
        yield test_1.test.step('expect to register visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.sendMessage(newVisitor, false);
        }));
        yield test_1.test.step('expect trigger message after registration', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poLiveChat.txtChatMessage(triggerMessage)).toBeVisible();
        }));
        yield test_1.test.step('expect send a message as a visitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_user');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            yield (0, test_1.expect)(poLiveChat.txtChatMessage('this_a_test_message_from_user')).toBeVisible();
            yield (0, test_1.expect)(poLiveChat.txtChatMessage(triggerMessage)).toBeVisible();
        }));
        yield test_1.test.step('expect to finish this chat', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.closeChat();
            yield (0, test_1.expect)(poLiveChat.txtHeaderTitle).toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Livechat Triggers - Delete trigger', () => __awaiter(void 0, void 0, void 0, function* () {
        yield agent.poHomeOmnichannel.triggers.btnDeletefirstRowInTable.click();
        yield agent.poHomeOmnichannel.triggers.btnModalRemove.click();
        yield (0, test_1.expect)(agent.poHomeOmnichannel.triggers.removeToastMessage).toBeVisible();
    }));
});
