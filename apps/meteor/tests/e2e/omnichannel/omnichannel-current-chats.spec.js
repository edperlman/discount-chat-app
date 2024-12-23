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
const rooms_1 = require("../utils/omnichannel/rooms");
const tags_1 = require("../utils/omnichannel/tags");
const test_1 = require("../utils/test");
const visitorA = faker_1.faker.person.firstName();
const visitorB = faker_1.faker.person.firstName();
const visitorC = faker_1.faker.person.firstName();
test_1.test.skip(!constants_1.IS_EE, 'OC - Current Chats > Enterprise Only');
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe('OC - Current Chats [Auto Selection]', () => __awaiter(void 0, void 0, void 0, function* () {
    let poCurrentChats;
    let departments;
    let conversations;
    let agents;
    let tags;
    // Allow manual on hold
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const responses = yield Promise.all([
            api.post('/settings/Livechat_allow_manual_on_hold', { value: true }),
            api.post('/settings/Livechat_allow_manual_on_hold_upon_agent_engagement_only', { value: false }),
        ]);
        responses.forEach((res) => (0, test_1.expect)(res.status()).toBe(200));
    }));
    // Create departments
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        departments = yield Promise.all([(0, departments_1.createDepartment)(api), (0, departments_1.createDepartment)(api)]);
    }));
    // Create agents
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        agents = yield Promise.all([(0, agents_1.createAgent)(api, 'user1'), (0, agents_1.createAgent)(api, 'user2')]);
        const agentsStatuses = yield Promise.all(agents.map(({ data: agent }) => (0, agents_1.makeAgentAvailable)(api, agent._id)));
        agentsStatuses.forEach((res) => (0, test_1.expect)(res.status()).toBe(200));
    }));
    // Add agents to departments
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const [departmentA, departmentB] = departments.map(({ data }) => data);
        const promises = yield Promise.all([
            (0, departments_1.addAgentToDepartment)(api, { department: departmentA, agentId: 'user1' }),
            (0, departments_1.addAgentToDepartment)(api, { department: departmentB, agentId: 'user2' }),
        ]);
        promises.forEach((res) => (0, test_1.expect)(res.status()).toBe(200));
    }));
    // Create tags
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        tags = yield Promise.all([(0, tags_1.createTag)(api, { name: 'tagA' }), (0, tags_1.createTag)(api, { name: 'tagB' })]);
        tags.forEach((res) => (0, test_1.expect)(res.response.status()).toBe(200));
    }));
    // Create rooms
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const [departmentA, departmentB] = departments.map(({ data }) => data);
        conversations = yield Promise.all([
            (0, rooms_1.createConversation)(api, {
                visitorName: visitorA,
                visitorToken: visitorA,
                agentId: `user1`,
                departmentId: departmentA._id,
            }),
            (0, rooms_1.createConversation)(api, {
                visitorName: visitorB,
                visitorToken: visitorB,
                agentId: `user2`,
                departmentId: departmentB._id,
            }),
            (0, rooms_1.createConversation)(api, {
                visitorName: visitorC,
                visitorToken: visitorC,
            }),
        ]);
        const [conversationA, conversationB] = conversations.map(({ data }) => data);
        yield Promise.all([
            (0, rooms_1.updateRoom)(api, {
                roomId: conversationA.room._id,
                visitorId: conversationA.visitor._id,
                tags: ['tagA'],
            }),
            (0, rooms_1.updateRoom)(api, {
                roomId: conversationB.room._id,
                visitorId: conversationB.visitor._id,
                tags: ['tagB'],
            }),
        ]);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poCurrentChats = new page_objects_1.OmnichannelCurrentChats(page);
        yield page.goto('/omnichannel');
        yield poCurrentChats.sidenav.linkCurrentChats.click();
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield Promise.all([
            // Delete conversations
            ...conversations.map((conversation) => conversation.delete()),
            // // Delete departments
            ...departments.map((department) => department.delete()),
            // Delete agents
            ...agents.map((agent) => agent.delete()),
            // Delete tags
            ...tags.map((tag) => tag.delete()),
            // Reset setting
            api.post('/settings/Livechat_allow_manual_on_hold', { value: false }),
            api.post('/settings/Livechat_allow_manual_on_hold_upon_agent_engagement_only', { value: true }),
        ]);
    }));
    // Change conversation A to on hold and close conversation B
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const [conversationA, , conversationC] = conversations.map(({ data }) => data);
        const statesPromises = yield Promise.all([
            api.post('/livechat/room.onHold', { roomId: conversationA.room._id }),
            api.post('/livechat/room.close', { rid: conversationC.room._id, token: visitorC }),
        ]);
        statesPromises.forEach((res) => (0, test_1.expect)(res.status()).toBe(200));
    }));
    test_1.test.skip('OC - Current chats - Accessibility violations', (_a) => __awaiter(void 0, [_a], void 0, function* ({ makeAxeBuilder }) {
        const results = yield makeAxeBuilder().analyze();
        (0, test_1.expect)(results.violations).toEqual([]);
    }));
    (0, test_1.test)('OC - Current chats - Filters', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const [departmentA, departmentB] = departments.map(({ data }) => data);
        yield test_1.test.step('expect to filter by guest', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).toBeVisible();
            yield poCurrentChats.inputGuest.fill(visitorA);
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).not.toBeVisible();
            yield poCurrentChats.inputGuest.fill('');
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).toBeVisible();
        }));
        yield test_1.test.step('expect to filter by server', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).toBeVisible();
            yield poCurrentChats.selectServedBy('user1');
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).not.toBeVisible();
            yield poCurrentChats.selectServedBy('user2');
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).not.toBeVisible();
            yield poCurrentChats.selectServedBy('all');
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).toBeVisible();
        }));
        yield test_1.test.step('expect to filter by status', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poCurrentChats.selectStatus('closed');
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).not.toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).not.toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorC)).toBeVisible();
            yield poCurrentChats.selectStatus('opened');
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).not.toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorC)).not.toBeVisible();
            yield poCurrentChats.selectStatus('onhold');
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).not.toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorC)).not.toBeVisible();
            yield poCurrentChats.selectStatus('all');
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorC)).toBeVisible();
        }));
        yield test_1.test.step('expect to filter by department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poCurrentChats.selectDepartment(departmentA.name);
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).not.toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorC)).not.toBeVisible();
            yield poCurrentChats.selectDepartment(departmentB.name);
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).not.toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorC)).not.toBeVisible();
            yield poCurrentChats.selectDepartment('All');
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorC)).toBeVisible();
        }));
        yield test_1.test.step('expect to filter by tags', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poCurrentChats.addTag('tagA');
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).not.toBeVisible();
            yield poCurrentChats.addTag('tagB');
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).toBeVisible();
            yield poCurrentChats.removeTag('tagA');
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).not.toBeVisible();
            yield poCurrentChats.removeTag('tagB');
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorB)).toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorA)).toBeVisible();
        }));
        yield test_1.test.step('expect department filter to show selected value after page reload', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poCurrentChats.selectDepartment(departmentA.name);
            yield page.reload();
            yield (0, test_1.expect)(poCurrentChats.inputDepartmentValue).toContainText(departmentA.name);
        }));
        // TODO: Unit test await test.step('expect to filter by period', async () => {});
        // TODO: Unit test await test.step('expect to filter by custom fields', async () => {});
        // TODO: Unit test await test.step('expect to filter clear all', async () => {});
    }));
    (0, test_1.test)('OC - Current chats - Basic navigation', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('expect to be return using return button', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room: roomA } = conversations[0].data;
            yield poCurrentChats.findRowByName(visitorA).click();
            yield (0, test_1.expect)(page).toHaveURL(`/omnichannel/current/${roomA._id}`);
            yield poCurrentChats.content.btnReturn.click();
            yield (0, test_1.expect)(page).toHaveURL(`/omnichannel/current`);
        }));
    }));
    (0, test_1.test)('OC - Current chats - Access in progress conversation from another agent', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('expect to be able to join', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room: roomB, visitor: visitorB } = conversations[1].data;
            yield poCurrentChats.findRowByName(visitorB.name).click();
            yield (0, test_1.expect)(page).toHaveURL(`/omnichannel/current/${roomB._id}`);
            yield (0, test_1.expect)(poCurrentChats.content.btnJoinRoom).toBeVisible();
            yield poCurrentChats.content.btnJoinRoom.click();
            yield (0, test_1.expect)(poCurrentChats.content.btnJoinRoom).not.toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Current chats - Remove conversations', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('expect to be able to remove conversation from table', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poCurrentChats.btnRemoveByName(visitorC).click();
            yield (0, test_1.expect)(poCurrentChats.modalConfirmRemove).toBeVisible();
            yield poCurrentChats.btnConfirmRemove.click();
            yield (0, test_1.expect)(poCurrentChats.modalConfirmRemove).not.toBeVisible();
            yield (0, test_1.expect)(poCurrentChats.findRowByName(visitorC)).not.toBeVisible();
        }));
        // TODO: await test.step('expect to be able to close all closes conversations', async () => {});
    }));
}));
test_1.test.describe('OC - Current Chats [Manual Selection]', () => {
    let queuedConversation;
    let poCurrentChats;
    let agent;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const res = yield api.post('/settings/Livechat_Routing_Method', { value: 'Manual_Selection' });
        (0, test_1.expect)(res.status()).toBe(200);
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        agent = yield (0, agents_1.createAgent)(api, 'rocketchat.internal.admin.test');
        const agentStatus = yield (0, agents_1.makeAgentAvailable)(api, agent.data._id);
        (0, test_1.expect)(agentStatus.status()).toBe(200);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poCurrentChats = new page_objects_1.OmnichannelCurrentChats(page);
        yield page.goto('/omnichannel');
        yield poCurrentChats.sidenav.linkCurrentChats.click();
    }));
    (0, test_1.test)('OC - Current chats - Access queued conversation', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        queuedConversation = yield (0, rooms_1.createConversation)(api, { visitorToken: 'visitorQueued' });
        yield test_1.test.step('expect to be able to take it', () => __awaiter(void 0, void 0, void 0, function* () {
            const { room, visitor } = queuedConversation.data;
            yield poCurrentChats.inputGuest.fill(visitor.name);
            yield poCurrentChats.findRowByName(visitor.name).click();
            yield (0, test_1.expect)(page).toHaveURL(`/omnichannel/current/${room._id}`);
            yield (0, test_1.expect)(poCurrentChats.content.btnTakeChat).toBeVisible();
            yield poCurrentChats.content.btnTakeChat.click();
            yield (0, test_1.expect)(poCurrentChats.content.btnTakeChat).not.toBeVisible();
        }));
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const res = yield api.post('/settings/Livechat_Routing_Method', { value: 'Auto_Selection' });
        (0, test_1.expect)(res.status()).toBe(200);
    }));
    test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield queuedConversation.delete();
        yield agent.delete();
    }));
});
