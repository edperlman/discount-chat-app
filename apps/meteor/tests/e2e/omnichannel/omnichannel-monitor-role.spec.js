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
const monitors_1 = require("../utils/omnichannel/monitors");
const rooms_1 = require("../utils/omnichannel/rooms");
const units_1 = require("../utils/omnichannel/units");
const test_1 = require("../utils/test");
const MONITOR = 'user3';
const MONITOR_ADMIN = 'rocketchat.internal.admin.test';
const ROOM_A = faker_1.faker.person.fullName();
const ROOM_B = faker_1.faker.person.fullName();
const ROOM_C = faker_1.faker.person.fullName();
const ROOM_D = faker_1.faker.person.fullName();
test_1.test.use({ storageState: userStates_1.Users.user3.state });
test_1.test.describe('OC - Monitor Role', () => {
    test_1.test.skip(!constants_1.IS_EE, 'Enterprise Edition Only');
    let departments;
    let conversations;
    let agents;
    let monitors;
    let units;
    let poOmnichannel;
    // Reset user3 roles
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const res = yield api.post('/users.update', {
            data: { roles: ['user'] },
            userId: 'user3',
        });
        yield (0, test_1.expect)(res.status()).toBe(200);
    }));
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
        agents = yield Promise.all([(0, agents_1.createAgent)(api, 'user1'), (0, agents_1.createAgent)(api, 'user2')]);
        const agentsStatuses = yield Promise.all(agents.map(({ data: agent }) => (0, agents_1.makeAgentAvailable)(api, agent._id)));
        agentsStatuses.forEach((res) => (0, test_1.expect)(res.status()).toBe(200));
    }));
    // Create departments
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        departments = yield Promise.all([(0, departments_1.createDepartment)(api), (0, departments_1.createDepartment)(api), (0, departments_1.createDepartment)(api)]);
    }));
    // Create conversations
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const [departmentA, departmentB] = departments.map(({ data }) => data);
        conversations = yield Promise.all([
            (0, rooms_1.createConversation)(api, {
                visitorName: ROOM_A,
                agentId: `user1`,
                departmentId: departmentA._id,
            }),
            (0, rooms_1.createConversation)(api, {
                visitorName: ROOM_B,
                agentId: `user2`,
                departmentId: departmentA._id,
            }),
            (0, rooms_1.createConversation)(api, {
                visitorName: ROOM_C,
                agentId: `user2`,
                departmentId: departmentB._id,
            }),
            (0, rooms_1.createConversation)(api, {
                visitorName: ROOM_D,
            }),
        ]);
    }));
    // Create monitors
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        monitors = yield Promise.all([(0, monitors_1.createMonitor)(api, MONITOR), (0, monitors_1.createMonitor)(api, MONITOR_ADMIN)]);
    }));
    // Create units
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const [departmentA, departmentB, departmentC] = departments.map(({ data }) => data);
        units = yield Promise.all([
            (0, units_1.createOrUpdateUnit)(api, {
                monitors: [{ monitorId: MONITOR, username: MONITOR }],
                departments: [{ departmentId: departmentA._id }, { departmentId: departmentB._id }],
            }),
            (0, units_1.createOrUpdateUnit)(api, {
                monitors: [{ monitorId: MONITOR_ADMIN, username: MONITOR_ADMIN }],
                departments: [{ departmentId: departmentC._id }],
            }),
        ]);
    }));
    // Delete all created data
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield Promise.all([
            ...agents.map((agent) => agent.delete()),
            ...departments.map((department) => department.delete()),
            ...conversations.map((conversation) => conversation.delete()),
            ...units.map((unit) => unit.delete()),
            ...monitors.map((monitor) => monitor.delete()),
            // Reset setting
            api.post('/settings/Livechat_allow_manual_on_hold', { value: false }),
            api.post('/settings/Livechat_allow_manual_on_hold_upon_agent_engagement_only', { value: true }),
        ]);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannel = new page_objects_1.HomeOmnichannel(page);
        yield page.goto('/omnichannel');
    }));
    (0, test_1.test)('OC - Monitor Role - Basic permissions', () => __awaiter(void 0, void 0, void 0, function* () {
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
        // await test.step('expect to be able to see contact center', async () => {});
        // await test.step('expect to be able to see queue', async () => {});
        // await test.step('expect to be able to edit custom fields', async () => {});
    }));
    (0, test_1.test)('OC - Monitor Role - Canned responses', () => __awaiter(void 0, void 0, void 0, function* () {
        // TODO: move to unit test
        yield test_1.test.step('expect not to be able to create public canned responses (administration)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.omnisidenav.linkCannedResponses.click();
            yield poOmnichannel.cannedResponses.btnNew.click();
            yield (0, test_1.expect)(poOmnichannel.cannedResponses.radioPublic).toBeDisabled();
        }));
    }));
    (0, test_1.test)('OC - Monitor Role - Current Chats', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const [conversationA] = conversations;
        const { room: roomA } = conversationA.data;
        yield test_1.test.step('expect to be able to view only chats from same unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannel.currentChats.findRowByName(ROOM_A)).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.currentChats.findRowByName(ROOM_B)).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.currentChats.findRowByName(ROOM_C)).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.currentChats.findRowByName(ROOM_D)).not.toBeVisible();
        }));
        yield test_1.test.step('expect to be able to join chats from same unit', () => __awaiter(void 0, void 0, void 0, function* () {
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
            yield (0, test_1.expect)(poOmnichannel.content.lastSystemMessageBody).toHaveText(`Chat On Hold: The chat was manually placed On Hold by ${MONITOR}`);
            yield (0, test_1.expect)(poOmnichannel.content.inputMessage).not.toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.content.btnResume).toBeVisible();
        }));
        yield test_1.test.step('expect to be able resume a conversation from another agent on hold', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.content.btnResume.click();
            yield (0, test_1.expect)(poOmnichannel.content.btnResume).not.toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.content.inputMessage).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.content.btnOnHold).toBeVisible();
        }));
        // await test.step('expect to be able to edit room information from another agent', async () => {);
        yield test_1.test.step('expect to be able to close a conversation from another agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.content.btnCloseChat.click();
            yield poOmnichannel.content.inputModalClosingComment.type('any_comment');
            yield poOmnichannel.content.btnModalConfirm.click();
            yield (0, test_1.expect)(poOmnichannel.toastSuccess).toBeVisible();
            yield page.waitForURL('/omnichannel/current');
        }));
        yield test_1.test.step('expect not to be able to remove closed room', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannel.currentChats.findRowByName(ROOM_A)).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.currentChats.btnRemoveByName(ROOM_A)).not.toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Monitor Role - Permission revoked', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        const [unitA, unitB] = units;
        const [monitor] = monitors;
        yield poOmnichannel.omnisidenav.linkCurrentChats.click();
        yield test_1.test.step('expect not to be able to see chats from removed department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('expect rooms from both departments to be visible', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(poOmnichannel.currentChats.findRowByName(ROOM_B)).toBeVisible();
                yield (0, test_1.expect)(poOmnichannel.currentChats.findRowByName(ROOM_C)).toBeVisible();
                yield (0, test_1.expect)(poOmnichannel.currentChats.findRowByName(ROOM_D)).not.toBeVisible();
            }));
            yield test_1.test.step('expect to remove departmentB from unit', () => __awaiter(void 0, void 0, void 0, function* () {
                const [departmentA] = departments.map(({ data }) => data);
                yield (0, units_1.createOrUpdateUnit)(api, {
                    id: unitA.data._id,
                    monitors: [{ monitorId: MONITOR, username: MONITOR }],
                    departments: [{ departmentId: departmentA._id }],
                });
                yield page.reload();
            }));
            yield test_1.test.step('expect to have only room B visible', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(poOmnichannel.currentChats.findRowByName(ROOM_B)).toBeVisible();
                yield (0, test_1.expect)(poOmnichannel.currentChats.findRowByName(ROOM_C)).not.toBeVisible();
                yield (0, test_1.expect)(poOmnichannel.currentChats.findRowByName(ROOM_D)).not.toBeVisible();
            }));
        }));
        yield test_1.test.step('expect not to be able to see conversations once unit is removed', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield unitA.delete();
            yield (0, test_1.expect)(res.status()).toBe(200);
            yield page.reload();
            yield (0, test_1.expect)(page.locator('text="No chats yet"')).toBeVisible();
        }));
        yield test_1.test.step('expect to be able to see all conversations once all units are removed', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield unitB.delete();
            yield (0, test_1.expect)(res.status()).toBe(200);
            yield page.reload();
            yield (0, test_1.expect)(poOmnichannel.currentChats.findRowByName(ROOM_D)).toBeVisible();
        }));
        yield test_1.test.step('expect not to be able to see current chats once role is removed', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield monitor.delete();
            yield (0, test_1.expect)(res.status()).toBe(200);
            yield page.reload();
            yield (0, test_1.expect)(page.locator('p >> text="You are not authorized to view this page."')).toBeVisible();
        }));
        yield test_1.test.step('expect monitor to be automaticaly removed from unit once monitor is removed', () => __awaiter(void 0, void 0, void 0, function* () {
            const { data: monitors } = yield (0, units_1.fetchUnitMonitors)(api, unitA.data._id);
            yield (0, test_1.expect)(monitors).toHaveLength(0);
        }));
    }));
});
