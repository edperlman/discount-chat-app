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
const constants_1 = require("../config/constants");
const createAuxContext_1 = require("../fixtures/createAuxContext");
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const agents_1 = require("../utils/omnichannel/agents");
const departments_1 = require("../utils/omnichannel/departments");
const managers_1 = require("../utils/omnichannel/managers");
const monitors_1 = require("../utils/omnichannel/monitors");
const rooms_1 = require("../utils/omnichannel/rooms");
const units_1 = require("../utils/omnichannel/units");
const test_1 = require("../utils/test");
const wrapSession = (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) { return ({ page, poHomeOmnichannel: new page_objects_1.HomeOmnichannel(page) }); });
test_1.test.use({ storageState: userStates_1.Users.user3.state });
test_1.test.skip(!constants_1.IS_EE, 'Enterprise Edition Only');
test_1.test.describe('OC - Chat transfers [Monitor role]', () => {
    let departments;
    let conversations;
    let agents;
    let monitors;
    let units;
    let sessions;
    let poOmnichannel;
    // Create agents
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        agents = yield Promise.all([(0, agents_1.createAgent)(api, 'user1'), (0, agents_1.createAgent)(api, 'user2'), (0, agents_1.createAgent)(api, 'rocketchat.internal.admin.test')]);
        (yield Promise.all(agents.map(({ data: agent }) => (0, agents_1.makeAgentAvailable)(api, agent._id)))).forEach((res) => {
            (0, test_1.expect)(res.status()).toBe(200);
        });
    }));
    // Create departments
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        departments = yield Promise.all([(0, departments_1.createDepartment)(api), (0, departments_1.createDepartment)(api)]);
    }));
    // Add agents to departments
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const [departmentA, departmentB] = departments.map(({ data }) => data);
        const promises = yield Promise.all([
            (0, departments_1.addAgentToDepartment)(api, { department: departmentA, agentId: 'user1' }),
            (0, departments_1.addAgentToDepartment)(api, { department: departmentA, agentId: 'rocketchat.internal.admin.test' }),
            (0, departments_1.addAgentToDepartment)(api, { department: departmentB, agentId: 'user2' }),
        ]);
        promises.forEach((res) => (0, test_1.expect)(res.status()).toBe(200));
    }));
    // Create conversations
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const [departmentA] = departments.map(({ data }) => data);
        conversations = yield Promise.all([
            (0, rooms_1.createConversation)(api, {
                agentId: `user1`,
                departmentId: departmentA._id,
            }),
            (0, rooms_1.createConversation)(api, {
                agentId: `user1`,
                departmentId: departmentA._id,
            }),
            (0, rooms_1.createConversation)(api, {
                agentId: `user1`,
                departmentId: departmentA._id,
            }),
        ]);
    }));
    // Create monitors
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        monitors = yield Promise.all([(0, monitors_1.createMonitor)(api, 'user3')]);
    }));
    // Create units
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const [departmentA, departmentB] = departments.map(({ data }) => data);
        units = yield Promise.all([
            (0, units_1.createOrUpdateUnit)(api, {
                monitors: [{ monitorId: 'user3', username: 'user3' }],
                departments: [{ departmentId: departmentA._id }],
            }),
            (0, units_1.createOrUpdateUnit)(api, {
                monitors: [{ monitorId: 'rocketchat.internal.admin.test', username: 'rocketchat.internal.admin.test' }],
                departments: [{ departmentId: departmentB._id }],
            }),
        ]);
    }));
    // Create sessions
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
        sessions = yield Promise.all([
            (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1).then(wrapSession),
            (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user2).then(wrapSession),
            (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.admin).then(wrapSession),
        ]);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannel = new page_objects_1.HomeOmnichannel(page);
        yield page.goto('/omnichannel/current');
    }));
    // Close sessions
    test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(sessions.map(({ page }) => page.close()));
    }));
    test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all([
            ...conversations.map((conversation) => conversation.delete()),
            ...monitors.map((monitor) => monitor.delete()),
            ...agents.map((agent) => agent.delete()),
            ...units.map((unit) => unit.delete()),
            ...departments.map((department) => department.delete()),
        ]);
    }));
    (0, test_1.test)(`OC - Chat transfers [Monitor role] - Transfer to another department`, (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const [, departmentB] = departments.map(({ data }) => data);
        const [roomA] = conversations.map(({ data }) => data.room);
        const [agentA, agentB] = sessions;
        yield test_1.test.step('expect room a to bot be visible for user2', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(roomA.fname)).not.toBeVisible();
        }));
        yield test_1.test.step('expect to be able to join chats from same unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.currentChats.findRowByName(roomA.fname).click();
            yield (0, test_1.expect)(page).toHaveURL(`/omnichannel/current/${roomA._id}`);
            yield poOmnichannel.content.btnForwardChat.click();
        }));
        yield test_1.test.step('expect agent and department fields to be visible and enabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.inputFowardUser).toBeEnabled();
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.inputFowardDepartment).toBeEnabled();
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.btnForward).toBeDisabled();
        }));
        yield test_1.test.step('expect to transfer from dep a to dep b', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.content.forwardChatModal.selectDepartment(departmentB.name);
            yield poOmnichannel.content.forwardChatModal.inputComment.type('any_comment');
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.btnForward).toBeEnabled();
            yield poOmnichannel.content.forwardChatModal.btnForward.click();
            // await expect(agentA.poHomeOmnichannel.toastSuccess).toBeVisible();
        }));
        yield test_1.test.step('expect conversation to have been assigned to user 2', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(agentA.page).toHaveURL(`/home`);
            yield (0, test_1.expect)(agentA.poHomeOmnichannel.sidenav.getSidebarItemByName(roomA.fname)).not.toBeVisible();
            yield (0, test_1.expect)(agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(roomA.fname)).toBeVisible();
        }));
        yield test_1.test.step('expect user 1 to have left the conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(roomA.fname).click();
            yield agentB.poHomeOmnichannel.content.findSystemMessage(`Transfer: user3 transferred the chat to the department ${departmentB.name}}`);
            yield agentB.poHomeOmnichannel.content.findSystemMessage('left the channel');
        }));
    }));
    (0, test_1.test)(`OC - Chat transfers [Monitor role] - Transfer to another agent, different department`, (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const [, roomB] = conversations.map(({ data }) => data.room);
        const [agentA, agentB] = sessions;
        yield test_1.test.step('expect room a to bot be visible for user2', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(roomB.fname)).not.toBeVisible();
        }));
        yield test_1.test.step('expect to be able to join chats from same unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.currentChats.findRowByName(roomB.fname).click();
            yield (0, test_1.expect)(page).toHaveURL(`/omnichannel/current/${roomB._id}`);
            yield poOmnichannel.content.btnForwardChat.click();
        }));
        yield test_1.test.step('expect agent and department fields to be visible and enabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.inputFowardUser).toBeEnabled();
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.inputFowardDepartment).toBeEnabled();
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.btnForward).toBeDisabled();
        }));
        yield test_1.test.step('expect to transfer from user1 to user2', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.content.forwardChatModal.selectUser(`user2`);
            yield poOmnichannel.content.forwardChatModal.inputComment.type('any_comment');
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.btnForward).toBeEnabled();
            yield poOmnichannel.content.forwardChatModal.btnForward.click();
            // await expect(agentA.poHomeOmnichannel.toastSuccess).toBeVisible();
        }));
        yield test_1.test.step('expect conversation to have been assigned to user 2', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(agentA.page).toHaveURL(`/home`);
            yield (0, test_1.expect)(agentA.poHomeOmnichannel.sidenav.getSidebarItemByName(roomB.fname)).not.toBeVisible();
            yield (0, test_1.expect)(agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(roomB.fname)).toBeVisible();
        }));
        yield test_1.test.step('expect user 1 to have left the conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(roomB.fname).click();
            yield (0, test_1.expect)(agentB.poHomeOmnichannel.content.findSystemMessage(`New Chat Transfer: user3 transferred the chat to user2 with a comment: any_comment`)).toBeVisible();
            yield (0, test_1.expect)(agentB.poHomeOmnichannel.content.findSystemMessage('left the channel')).toBeVisible();
        }));
    }));
    (0, test_1.test)(`OC - Chat transfers [Monitor role] - Transfer to another agent, same department`, (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const [, , roomC] = conversations.map(({ data }) => data.room);
        const [agentA, , agentC] = sessions;
        yield test_1.test.step('expect room a to bot be visible for user2', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(agentC.poHomeOmnichannel.sidenav.getSidebarItemByName(roomC.fname)).not.toBeVisible();
        }));
        yield test_1.test.step('expect to be able to join chats from same unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.currentChats.findRowByName(roomC.fname).click();
            yield (0, test_1.expect)(page).toHaveURL(`/omnichannel/current/${roomC._id}`);
            yield poOmnichannel.content.btnForwardChat.click();
        }));
        yield test_1.test.step('expect agent and department fields to be visible and enabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.inputFowardUser).toBeEnabled();
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.inputFowardDepartment).toBeEnabled();
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.btnForward).toBeDisabled();
        }));
        yield test_1.test.step('expect to transfer from dep a to dep b', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.content.forwardChatModal.selectUser('rocketchat.internal.admin.test');
            yield poOmnichannel.content.forwardChatModal.inputComment.type('any_comment');
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.btnForward).toBeEnabled();
            yield poOmnichannel.content.forwardChatModal.btnForward.click();
            // await expect(agentA.poHomeOmnichannel.toastSuccess).toBeVisible();
        }));
        yield test_1.test.step('expect conversation to have been assigned to user 2', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(agentA.page).toHaveURL(`/home`);
            yield (0, test_1.expect)(agentA.poHomeOmnichannel.sidenav.getSidebarItemByName(roomC.fname)).not.toBeVisible();
            yield (0, test_1.expect)(agentC.poHomeOmnichannel.sidenav.getSidebarItemByName(roomC.fname)).toBeVisible();
        }));
        yield test_1.test.step('expect user 1 to have left the conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agentC.poHomeOmnichannel.sidenav.getSidebarItemByName(roomC.fname).click();
            yield (0, test_1.expect)(agentC.poHomeOmnichannel.content.findSystemMessage(`New Chat Transfer: user3 transferred the chat to RocketChat Internal Admin Test with a comment: any_comment`)).toBeVisible();
            yield (0, test_1.expect)(agentC.poHomeOmnichannel.content.findSystemMessage('left the channel')).toBeVisible();
        }));
    }));
});
test_1.test.describe('OC - Chat transfers [Manager role]', () => {
    let departments;
    let conversations;
    let agents;
    let managers;
    let sessions;
    let poOmnichannel;
    // Create agents
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        agents = yield Promise.all([(0, agents_1.createAgent)(api, 'user1'), (0, agents_1.createAgent)(api, 'user2'), (0, agents_1.createAgent)(api, 'rocketchat.internal.admin.test')]);
        (yield Promise.all(agents.map(({ data: agent }) => (0, agents_1.makeAgentAvailable)(api, agent._id)))).forEach((res) => {
            (0, test_1.expect)(res.status()).toBe(200);
        });
    }));
    // Create managers
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        managers = yield Promise.all([(0, managers_1.createManager)(api, 'user3')]);
    }));
    // Create departments
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        departments = yield Promise.all([(0, departments_1.createDepartment)(api), (0, departments_1.createDepartment)(api)]);
    }));
    // Add agents to departments
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const [departmentA, departmentB] = departments.map(({ data }) => data);
        const promises = yield Promise.all([
            (0, departments_1.addAgentToDepartment)(api, { department: departmentA, agentId: 'user1' }),
            (0, departments_1.addAgentToDepartment)(api, { department: departmentA, agentId: 'rocketchat.internal.admin.test' }),
            (0, departments_1.addAgentToDepartment)(api, { department: departmentB, agentId: 'user2' }),
        ]);
        promises.forEach((res) => (0, test_1.expect)(res.status()).toBe(200));
    }));
    // Create conversations
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const [departmentA] = departments.map(({ data }) => data);
        conversations = yield Promise.all([
            (0, rooms_1.createConversation)(api, {
                agentId: `user1`,
                departmentId: departmentA._id,
            }),
            (0, rooms_1.createConversation)(api, {
                agentId: `user1`,
                departmentId: departmentA._id,
            }),
            (0, rooms_1.createConversation)(api, {
                agentId: `user1`,
                departmentId: departmentA._id,
            }),
        ]);
    }));
    // Create sessions
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
        sessions = yield Promise.all([
            (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1).then(wrapSession),
            (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user2).then(wrapSession),
            (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.admin).then(wrapSession),
        ]);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannel = new page_objects_1.HomeOmnichannel(page);
        yield page.goto('/omnichannel/current');
    }));
    // Close sessions
    test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(sessions.map(({ page }) => page.close()));
    }));
    test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all([
            ...conversations.map((conversation) => conversation.delete()),
            ...managers.map((manager) => manager.delete()),
            ...agents.map((agent) => agent.delete()),
            ...departments.map((department) => department.delete()),
        ]);
    }));
    (0, test_1.test)(`OC - Chat transfers [Manager role] - Transfer to another department`, (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const [, departmentB] = departments.map(({ data }) => data);
        const [roomA] = conversations.map(({ data }) => data.room);
        const [agentA, agentB] = sessions;
        yield test_1.test.step('expect room a to bot be visible for user2', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(roomA.fname)).not.toBeVisible();
        }));
        yield test_1.test.step('expect to be able to join chats from same unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.currentChats.findRowByName(roomA.fname).click();
            yield (0, test_1.expect)(page).toHaveURL(`/omnichannel/current/${roomA._id}`);
            yield poOmnichannel.content.btnForwardChat.click();
        }));
        yield test_1.test.step('expect agent and department fields to be visible and enabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.inputFowardUser).toBeEnabled();
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.inputFowardDepartment).toBeEnabled();
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.btnForward).toBeDisabled();
        }));
        yield test_1.test.step('expect to transfer from dep a to dep b', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.content.forwardChatModal.selectDepartment(departmentB.name);
            yield poOmnichannel.content.forwardChatModal.inputComment.type('any_comment');
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.btnForward).toBeEnabled();
            yield poOmnichannel.content.forwardChatModal.btnForward.click();
            // await expect(agentA.poHomeOmnichannel.toastSuccess).toBeVisible();
        }));
        yield test_1.test.step('expect conversation to have been assigned to user 2', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(agentA.page).toHaveURL(`/home`);
            yield (0, test_1.expect)(agentA.poHomeOmnichannel.sidenav.getSidebarItemByName(roomA.fname)).not.toBeVisible();
            yield (0, test_1.expect)(agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(roomA.fname)).toBeVisible();
        }));
        yield test_1.test.step('expect user 1 to have left the conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(roomA.fname).click();
            yield agentB.poHomeOmnichannel.content.findSystemMessage(`Transfer: user3 transferred the chat to the department ${departmentB.name}}`);
            yield agentB.poHomeOmnichannel.content.findSystemMessage('left the channel');
        }));
    }));
    (0, test_1.test)(`OC - Chat transfers [Manager role] - Transfer to another agent, different department`, (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const [, roomB] = conversations.map(({ data }) => data.room);
        const [agentA, agentB] = sessions;
        yield test_1.test.step('expect room a to bot be visible for user2', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(roomB.fname)).not.toBeVisible();
        }));
        yield test_1.test.step('expect to be able to join chats from same unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.currentChats.findRowByName(roomB.fname).click();
            yield (0, test_1.expect)(page).toHaveURL(`/omnichannel/current/${roomB._id}`);
            yield poOmnichannel.content.btnForwardChat.click();
        }));
        yield test_1.test.step('expect agent and department fields to be visible and enabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.inputFowardUser).toBeEnabled();
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.inputFowardDepartment).toBeEnabled();
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.btnForward).toBeDisabled();
        }));
        yield test_1.test.step('expect to transfer from user1 to user2', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.content.forwardChatModal.selectUser(`user2`);
            yield poOmnichannel.content.forwardChatModal.inputComment.type('any_comment');
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.btnForward).toBeEnabled();
            yield poOmnichannel.content.forwardChatModal.btnForward.click();
            // await expect(agentA.poHomeOmnichannel.toastSuccess).toBeVisible();
        }));
        yield test_1.test.step('expect conversation to have been assigned to user 2', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(agentA.page).toHaveURL(`/home`);
            yield (0, test_1.expect)(agentA.poHomeOmnichannel.sidenav.getSidebarItemByName(roomB.fname)).not.toBeVisible();
            yield (0, test_1.expect)(agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(roomB.fname)).toBeVisible();
        }));
        yield test_1.test.step('expect user 1 to have left the conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(roomB.fname).click();
            yield (0, test_1.expect)(agentB.poHomeOmnichannel.content.findSystemMessage(`New Chat Transfer: user3 transferred the chat to user2 with a comment: any_comment`)).toBeVisible();
            yield (0, test_1.expect)(agentB.poHomeOmnichannel.content.findSystemMessage('left the channel')).toBeVisible();
        }));
    }));
    (0, test_1.test)(`OC - Chat transfers [Manager role] - Transfer to another agent, same department`, (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const [, , roomC] = conversations.map(({ data }) => data.room);
        const [agentA, , agentC] = sessions;
        yield test_1.test.step('expect room a to bot be visible for user2', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(agentC.poHomeOmnichannel.sidenav.getSidebarItemByName(roomC.fname)).not.toBeVisible();
        }));
        yield test_1.test.step('expect to be able to join chats from same unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.currentChats.findRowByName(roomC.fname).click();
            yield (0, test_1.expect)(page).toHaveURL(`/omnichannel/current/${roomC._id}`);
            yield poOmnichannel.content.btnForwardChat.click();
        }));
        yield test_1.test.step('expect agent and department fields to be visible and enabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.inputFowardUser).toBeEnabled();
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.inputFowardDepartment).toBeEnabled();
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.btnForward).toBeDisabled();
        }));
        yield test_1.test.step('expect to transfer from dep a to dep b', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.content.forwardChatModal.selectUser('rocketchat.internal.admin.test');
            yield poOmnichannel.content.forwardChatModal.inputComment.type('any_comment');
            yield (0, test_1.expect)(poOmnichannel.content.forwardChatModal.btnForward).toBeEnabled();
            yield poOmnichannel.content.forwardChatModal.btnForward.click();
            // await expect(agentA.poHomeOmnichannel.toastSuccess).toBeVisible();
        }));
        yield test_1.test.step('expect conversation to have been assigned to user 2', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(agentA.page).toHaveURL(`/home`);
            yield (0, test_1.expect)(agentA.poHomeOmnichannel.sidenav.getSidebarItemByName(roomC.fname)).not.toBeVisible();
            yield (0, test_1.expect)(agentC.poHomeOmnichannel.sidenav.getSidebarItemByName(roomC.fname)).toBeVisible();
        }));
        yield test_1.test.step('expect user 1 to have left the conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield agentC.poHomeOmnichannel.sidenav.getSidebarItemByName(roomC.fname).click();
            yield (0, test_1.expect)(agentC.poHomeOmnichannel.content.findSystemMessage(`New Chat Transfer: user3 transferred the chat to RocketChat Internal Admin Test with a comment: any_comment`)).toBeVisible();
            yield (0, test_1.expect)(agentC.poHomeOmnichannel.content.findSystemMessage('left the channel')).toBeVisible();
        }));
    }));
});
