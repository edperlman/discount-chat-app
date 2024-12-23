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
const constants_1 = require("../config/constants");
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const agents_1 = require("../utils/omnichannel/agents");
const departments_1 = require("../utils/omnichannel/departments");
const managers_1 = require("../utils/omnichannel/managers");
const rooms_1 = require("../utils/omnichannel/rooms");
const test_1 = require("../utils/test");
const MANAGER = 'user3';
const ROOM_A = faker_1.faker.person.fullName();
const ROOM_B = faker_1.faker.person.fullName();
const ROOM_C = faker_1.faker.person.fullName();
test_1.test.use({ storageState: userStates_1.Users.user3.state });
test_1.test.describe('OC - Manager Role', () => {
    test_1.test.skip(!constants_1.IS_EE, 'Enterprise Edition Only');
    let departments;
    let conversations;
    let agents;
    let poOmnichannel;
    let manager;
    // Allow manual on hold
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const responses = yield Promise.all([
            api.post('/settings/Livechat_allow_manual_on_hold', { value: true }),
            api.post('/settings/Livechat_allow_manual_on_hold_upon_agent_engagement_only', { value: false }),
        ]);
        responses.forEach((res) => (0, test_1.expect)(res.status()).toBe(200));
    }));
    // Create agents
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        agents = yield Promise.all([(0, agents_1.createAgent)(api, 'user1'), (0, agents_1.createAgent)(api, 'user2'), (0, agents_1.createAgent)(api, MANAGER)]);
        const agentsStatuses = yield Promise.all(agents.slice(0, 2).map(({ data: agent }) => (0, agents_1.makeAgentAvailable)(api, agent._id)));
        agentsStatuses.forEach((res) => (0, test_1.expect)(res.status()).toBe(200));
    }));
    // Create departments
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        departments = yield Promise.all([(0, departments_1.createDepartment)(api), (0, departments_1.createDepartment)(api)]);
    }));
    // Create manager
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        manager = yield (0, managers_1.createManager)(api, MANAGER);
    }));
    // Create conversations
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const [departmentA, departmentB] = departments.map(({ data }) => data);
        conversations = yield Promise.all([
            (0, rooms_1.createConversation)(api, {
                visitorName: ROOM_A,
                visitorToken: 'roomA',
                agentId: `user1`,
                departmentId: departmentA._id,
            }),
            (0, rooms_1.createConversation)(api, {
                visitorName: ROOM_B,
                visitorToken: 'roomB',
                agentId: `user2`,
                departmentId: departmentB._id,
            }),
            (0, rooms_1.createConversation)(api, {
                visitorName: ROOM_C,
                visitorToken: 'roomC',
                agentId: `user2`,
            }),
        ]);
    }));
    // Delete all created data
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield Promise.all([
            ...agents.map((agent) => agent.delete()),
            ...departments.map((department) => department.delete()),
            ...conversations.map((conversation) => conversation.delete()),
            manager.delete(),
            // Reset setting
            api.post('/settings/Livechat_allow_manual_on_hold', { value: false }),
            api.post('/settings/Livechat_allow_manual_on_hold_upon_agent_engagement_only', { value: true }),
        ]);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannel = new page_objects_1.HomeOmnichannel(page);
        yield page.goto('/omnichannel');
    }));
    (0, test_1.test)('OC - Manager Role - Basic permissions', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('expect agent to not have access to omnichannel administration', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannel.omnisidenav.linkCurrentChats).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.omnisidenav.linkAnalytics).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.omnisidenav.linkRealTimeMonitoring).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.omnisidenav.linkAgents).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.omnisidenav.linkDepartments).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.omnisidenav.linkBusinessHours).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.omnisidenav.linkReports).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.omnisidenav.linkCannedResponses).toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Manager Role - Current Chats', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const [conversationA] = conversations;
        const { room: roomA } = conversationA.data;
        yield test_1.test.step('expect to be able to view all chats', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannel.currentChats.findRowByName(ROOM_A)).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.currentChats.findRowByName(ROOM_B)).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.currentChats.findRowByName(ROOM_C)).toBeVisible();
        }));
        yield test_1.test.step('expect to be able to join chats', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.currentChats.findRowByName(ROOM_A).click();
            yield (0, test_1.expect)(page).toHaveURL(`/omnichannel/current/${roomA._id}`);
            yield (0, test_1.expect)(poOmnichannel.content.btnJoinRoom).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.content.inputMessage).not.toBeVisible();
            yield poOmnichannel.content.btnJoinRoom.click();
            yield (0, test_1.expect)(poOmnichannel.content.lastSystemMessageBody).toHaveText('joined the channel');
            yield (0, test_1.expect)(poOmnichannel.content.btnJoinRoom).not.toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.content.inputMessage).toBeVisible();
        }));
        yield test_1.test.step('expect to be able to put a conversation from another agent on hold', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.content.btnOnHold.click({ clickCount: 2 });
            yield (0, test_1.expect)(poOmnichannel.content.modalOnHold).toBeVisible();
            yield poOmnichannel.content.btnOnHoldConfirm.click();
            yield (0, test_1.expect)(poOmnichannel.content.lastSystemMessageBody).toHaveText(`Chat On Hold: The chat was manually placed On Hold by ${MANAGER}`);
            yield (0, test_1.expect)(poOmnichannel.content.inputMessage).not.toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.content.btnResume).toBeVisible();
        }));
        yield test_1.test.step('expect to be able resume a conversation from another agent on hold', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.content.btnResume.click();
            yield (0, test_1.expect)(poOmnichannel.content.btnResume).not.toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.content.inputMessage).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.content.btnOnHold).toBeVisible();
        }));
        yield test_1.test.step('expect to be able to close a conversation from another agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.content.btnCloseChat.click();
            yield poOmnichannel.content.inputModalClosingComment.type('any_comment');
            yield poOmnichannel.content.btnModalConfirm.click();
            yield (0, test_1.expect)(poOmnichannel.toastSuccess).toBeVisible();
            yield page.waitForURL('/omnichannel/current');
        }));
        yield test_1.test.step('expect to be able to remove closed rooms', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.currentChats.btnRemoveByName(ROOM_A).click();
            yield (0, test_1.expect)(poOmnichannel.currentChats.modalConfirmRemove).toBeVisible();
            yield poOmnichannel.currentChats.btnConfirmRemove.click();
            yield (0, test_1.expect)(poOmnichannel.currentChats.modalConfirmRemove).not.toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.currentChats.findRowByName(ROOM_A)).not.toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Manager Role - Add/remove agents', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poOmnichannel.agents.sidenav.linkAgents.click();
        yield test_1.test.step('expect add "user1" as agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.agents.selectUsername('user1');
            yield poOmnichannel.agents.btnAdd.click();
            yield poOmnichannel.agents.inputSearch.fill('user1');
            yield (0, test_1.expect)(poOmnichannel.agents.findRowByName('user1')).toBeVisible();
        }));
        yield test_1.test.step('expect remove "user1" as agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.agents.inputSearch.fill('user1');
            yield poOmnichannel.agents.btnDeleteFirstRowInTable.click();
            yield poOmnichannel.agents.btnModalRemove.click();
            yield poOmnichannel.agents.inputSearch.fill('');
            yield poOmnichannel.agents.inputSearch.fill('user1');
            yield (0, test_1.expect)(poOmnichannel.agents.findRowByName('user1')).toBeHidden();
        }));
    }));
    (0, test_1.test)('OC - Manager Role - Add/remove managers', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poOmnichannel.omnisidenav.linkManagers.click();
        yield test_1.test.step('expect add "user1" as manager', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.managers.selectUsername('user1');
            yield poOmnichannel.managers.btnAdd.click();
            yield (0, test_1.expect)(poOmnichannel.managers.findRowByName('user1')).toBeVisible();
        }));
        yield test_1.test.step('expect search for manager', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.managers.search('user1');
            yield (0, test_1.expect)(poOmnichannel.managers.findRowByName('user1')).toBeVisible();
            yield poOmnichannel.managers.search('NonExistingUser');
            yield (0, test_1.expect)(poOmnichannel.managers.findRowByName('user1')).toBeHidden();
            yield poOmnichannel.managers.clearSearch();
        }));
        yield test_1.test.step('expect remove "user1" as manager', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.managers.search('user1');
            yield poOmnichannel.managers.btnDeleteSelectedAgent('user1').click();
            yield poOmnichannel.managers.btnModalRemove.click();
            yield (0, test_1.expect)(poOmnichannel.managers.findRowByName('user1')).toBeHidden();
        }));
    }));
    (0, test_1.test)('OC - Manager Role - Add/remove monitors', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poOmnichannel.omnisidenav.linkMonitors.click();
        yield test_1.test.step('expect to add agent as monitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannel.monitors.findRowByName('user1')).not.toBeVisible();
            yield poOmnichannel.monitors.selectMonitor('user1');
            yield poOmnichannel.monitors.btnAddMonitor.click();
            yield (0, test_1.expect)(poOmnichannel.monitors.findRowByName('user1')).toBeVisible();
        }));
        yield test_1.test.step('expect to remove agent from monitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.monitors.btnRemoveByName('user1').click();
            yield (0, test_1.expect)(poOmnichannel.monitors.modalConfirmRemove).toBeVisible();
            yield poOmnichannel.monitors.btnConfirmRemove.click();
            yield (0, test_1.expect)(poOmnichannel.monitors.findRowByName('user1')).not.toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Manager Role - Permission revoked', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poOmnichannel.omnisidenav.linkCurrentChats.click();
        yield test_1.test.step('expect not to be able to see current chats once role is removed', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield manager.delete();
            yield (0, test_1.expect)(res.status()).toBe(200);
            yield page.reload();
            yield (0, test_1.expect)(page.locator('p >> text="You are not authorized to view this page."')).toBeVisible();
        }));
    }));
});
