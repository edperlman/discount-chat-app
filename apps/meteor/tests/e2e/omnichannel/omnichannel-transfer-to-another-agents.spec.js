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
const createAuxContext_1 = require("../fixtures/createAuxContext");
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const agents_1 = require("../utils/omnichannel/agents");
const managers_1 = require("../utils/omnichannel/managers");
const rooms_1 = require("../utils/omnichannel/rooms");
const test_1 = require("../utils/test");
test_1.test.describe('OC - Chat transfers [Agent role]', () => {
    let sessions;
    let agents;
    let managers;
    let conversations;
    // Create agents and managers
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        agents = yield Promise.all([(0, agents_1.createAgent)(api, 'user1'), (0, agents_1.createAgent)(api, 'user2')]);
        managers = yield Promise.all([(0, managers_1.createManager)(api, 'user1')]);
    }));
    // Livechat when agent idle
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/settings/Livechat_enabled_when_agent_idle', { value: false }).then((res) => (0, test_1.expect)(res.status()).toBe(200));
    }));
    // Create agent sessions
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
        sessions = yield Promise.all([
            (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1).then(({ page }) => ({ page, poHomeOmnichannel: new page_objects_1.HomeOmnichannel(page) })),
            (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user2).then(({ page }) => ({ page, poHomeOmnichannel: new page_objects_1.HomeOmnichannel(page) })),
        ]);
    }));
    // Delete all data
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield Promise.all([
            ...conversations.map((conversation) => conversation.delete()),
            ...agents.map((agent) => agent.delete()),
            ...managers.map((manager) => manager.delete()),
            api.post('/settings/Livechat_enabled_when_agent_idle', { value: true }).then((res) => (0, test_1.expect)(res.status()).toBe(200)),
        ]);
    }));
    // Make "user-1" online & "user-2" offline so that chat can be automatically routed to "user-1"
    test_1.test.beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const [agentA, agentB] = sessions;
        yield agentA.poHomeOmnichannel.sidenav.switchStatus('online');
        yield agentB.poHomeOmnichannel.sidenav.switchStatus('offline');
    }));
    // Close sessions
    test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(sessions.map(({ page }) => page.close()));
    }));
    // Start a new chat for each test
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        conversations = [yield (0, rooms_1.createConversation)(api)];
    }));
    (0, test_1.test)('OC - Chat transfers [Agent role] - Transfer omnichannel chat to another agent', () => __awaiter(void 0, void 0, void 0, function* () {
        const [agentA, agentB] = sessions;
        const [{ visitor }] = conversations.map(({ data }) => data);
        yield test_1.test.step('expect to have 1 omnichannel assigned to agent 1', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agentA.poHomeOmnichannel.sidenav.getSidebarItemByName(visitor.name).click();
        }));
        yield test_1.test.step('expect to not be able to transfer chat to "user-2" when that user is offline', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agentB.poHomeOmnichannel.sidenav.switchStatus('offline');
            yield agentA.poHomeOmnichannel.content.btnForwardChat.click();
            yield agentA.poHomeOmnichannel.content.forwardChatModal.inputFowardUser.click();
            yield agentA.poHomeOmnichannel.content.forwardChatModal.inputFowardUser.type('user2');
            yield (0, test_1.expect)(agentA.page.locator('text=Empty')).toBeVisible();
            yield agentA.page.goto('/');
        }));
        yield test_1.test.step('expect to be able to transfer an omnichannel to conversation to agent 2 as agent 1 when agent 2 is online', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agentB.poHomeOmnichannel.sidenav.switchStatus('online');
            yield agentA.poHomeOmnichannel.sidenav.getSidebarItemByName(visitor.name).click();
            yield agentA.poHomeOmnichannel.content.btnForwardChat.click();
            yield agentA.poHomeOmnichannel.content.forwardChatModal.selectUser('user2');
            yield agentA.poHomeOmnichannel.content.forwardChatModal.inputComment.type('any_comment');
            yield agentA.poHomeOmnichannel.content.forwardChatModal.btnForward.click();
            yield (0, test_1.expect)(agentA.poHomeOmnichannel.toastSuccess).toBeVisible();
        }));
        yield test_1.test.step('expect to have 1 omnichannel assigned to agent 2', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(visitor.name).click();
        }));
    }));
});
