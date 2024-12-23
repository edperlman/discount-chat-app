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
const agents_1 = require("../utils/omnichannel/agents");
const departments_1 = require("../utils/omnichannel/departments");
const test_1 = require("../utils/test");
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.describe('OC - Livechat - Department Flow', () => {
    // Needs Departments to test this, so needs an EE license for multiple deps
    test_1.test.skip(!constants_1.IS_EE, 'Enterprise Only');
    let poLiveChat;
    let poHomeOmnichannelAgent1;
    let poHomeOmnichannelAgent2;
    let departments;
    let departmentA;
    let departmentB;
    let agents;
    let agent1;
    let agent2;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        // Assign agents & departments
        agents = yield Promise.all([(0, agents_1.createAgent)(api, 'user1'), (0, agents_1.createAgent)(api, 'user2')]);
        [agent1, agent2] = agents.map(({ data }) => data);
        departments = yield Promise.all([
            (0, departments_1.createDepartment)(api, { showOnRegistration: true }),
            (0, departments_1.createDepartment)(api, { showOnRegistration: true }),
        ]);
        [departmentA, departmentB] = departments.map(({ data }) => data);
        yield (0, departments_1.addAgentToDepartment)(api, { department: departmentA, agentId: agent1._id });
        yield (0, departments_1.addAgentToDepartment)(api, { department: departmentB, agentId: agent2._id });
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api, browser }) {
        // Create Pages
        const { page: agent1Page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/', true);
        poHomeOmnichannelAgent1 = new page_objects_1.HomeOmnichannel(agent1Page);
        const { page: agent2Page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user2, '/', true);
        poHomeOmnichannelAgent2 = new page_objects_1.HomeOmnichannel(agent2Page);
        poLiveChat = new page_objects_1.OmnichannelLiveChat(page, api);
        yield poLiveChat.page.goto('/livechat');
    }));
    test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeOmnichannelAgent1.page.close();
        yield poHomeOmnichannelAgent2.page.close();
        yield page.close();
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield (0, test_1.expect)((yield api.post('/settings/Omnichannel_enable_department_removal', { value: true })).status()).toBe(200);
        yield Promise.all([...agents.map((agent) => agent.delete())]);
        yield Promise.all([...departments.map((department) => department.delete())]);
        yield (0, test_1.expect)((yield api.post('/settings/Omnichannel_enable_department_removal', { value: false })).status()).toBe(200);
    }));
    (0, test_1.test)('OC - Livechat - Chat with Department', () => __awaiter(void 0, void 0, void 0, function* () {
        const guest = (0, data_1.createFakeVisitor)();
        yield test_1.test.step('expect start Chat with department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.openAnyLiveChat();
            yield poLiveChat.sendMessage(guest, false, departmentA.name);
            yield (0, test_1.expect)(poLiveChat.onlineAgentMessage).toBeVisible();
            yield poLiveChat.onlineAgentMessage.fill('this_a_test_message_from_user');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            yield (0, test_1.expect)(poLiveChat.page.locator('div >> text="this_a_test_message_from_user"')).toBeVisible();
        }));
        yield test_1.test.step('expect message to be received by department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeOmnichannelAgent1.sidenav.openChat(guest.name);
            yield (0, test_1.expect)(poHomeOmnichannelAgent1.content.lastUserMessage).toBeVisible();
            yield (0, test_1.expect)(poHomeOmnichannelAgent1.content.lastUserMessage).toContainText('this_a_test_message_from_user');
        }));
        yield test_1.test.step('expect message to be sent by department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeOmnichannelAgent1.content.sendMessage('this_a_test_message_from_agent');
            yield (0, test_1.expect)(poLiveChat.page.locator('div >> text="this_a_test_message_from_agent"')).toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Livechat - Change Department', () => __awaiter(void 0, void 0, void 0, function* () {
        const guest = (0, data_1.createFakeVisitor)();
        yield test_1.test.step('expect start Chat with department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.openAnyLiveChat();
            yield poLiveChat.sendMessage(guest, false, departmentA.name);
            yield (0, test_1.expect)(poLiveChat.onlineAgentMessage).toBeVisible();
            yield poLiveChat.onlineAgentMessage.fill('this_a_test_message_from_user');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            yield (0, test_1.expect)(poLiveChat.page.locator('div >> text="this_a_test_message_from_user"')).toBeVisible();
        }));
        yield test_1.test.step('expect message to be received by department 1', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeOmnichannelAgent1.sidenav.openChat(guest.name);
            yield (0, test_1.expect)(poHomeOmnichannelAgent1.content.lastUserMessage).toBeVisible();
            yield (0, test_1.expect)(poHomeOmnichannelAgent1.content.lastUserMessage).toContainText('this_a_test_message_from_user');
        }));
        yield test_1.test.step('expect message to be sent by department 1', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeOmnichannelAgent1.content.sendMessage('this_a_test_message_from_agent_department_1');
            yield (0, test_1.expect)(poLiveChat.page.locator('div >> text="this_a_test_message_from_agent_department_1"')).toBeVisible();
            yield poHomeOmnichannelAgent1.page.close();
        }));
        yield test_1.test.step('expect to change department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.btnOptions.click();
            yield poLiveChat.btnChangeDepartment.click();
            yield (0, test_1.expect)(poLiveChat.selectDepartment).toBeVisible();
            yield poLiveChat.selectDepartment.selectOption({ label: departmentB.name });
            yield (0, test_1.expect)(poLiveChat.btnSendMessage('Start chat')).toBeEnabled();
            yield poLiveChat.btnSendMessage('Start chat').click();
            yield (0, test_1.expect)(poLiveChat.livechatModal).toBeVisible();
            yield (0, test_1.expect)(poLiveChat.livechatModalText('Are you sure you want to switch the department?')).toBeVisible();
            yield poLiveChat.btnYes.click();
            yield (0, test_1.expect)(poLiveChat.livechatModal).toBeVisible();
            yield (0, test_1.expect)(poLiveChat.livechatModalText('Department switched')).toBeVisible();
            yield poLiveChat.btnOk.click();
            // Expect keep chat history
            yield (0, test_1.expect)(poLiveChat.page.locator('div >> text="this_a_test_message_from_user"')).toBeVisible();
            // Expect user to have changed
            yield (0, test_1.expect)(yield poLiveChat.headerTitle.textContent()).toEqual(agent2.username);
            yield poLiveChat.onlineAgentMessage.fill('this_a_test_message_from_user_to_department_2');
            yield poLiveChat.btnSendMessageToOnlineAgent.click();
            yield (0, test_1.expect)(poLiveChat.page.locator('div >> text="this_a_test_message_from_user_to_department_2"')).toBeVisible();
        }));
        yield test_1.test.step('expect message to be received by department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeOmnichannelAgent2.sidenav.openChat(guest.name);
            yield (0, test_1.expect)(poHomeOmnichannelAgent2.content.lastUserMessage).toBeVisible();
            yield (0, test_1.expect)(poHomeOmnichannelAgent2.content.lastUserMessage).toContainText('this_a_test_message_from_user_to_department_2');
        }));
        yield test_1.test.step('expect message to be sent by department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeOmnichannelAgent2.content.sendMessage('this_a_test_message_from_agent_department_2');
            yield (0, test_1.expect)(poLiveChat.page.locator('div >> text="this_a_test_message_from_agent_department_2"')).toBeVisible();
        }));
    }));
});
