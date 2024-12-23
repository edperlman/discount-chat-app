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
const test_1 = require("../utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe('OC - Livechat Triggers - SetDepartment', () => {
    test_1.test.skip(!constants_1.IS_EE, 'Enterprise Only');
    let poLiveChat;
    let departments;
    let departmentA;
    let departmentB;
    let agents;
    let agent1;
    let agent2;
    let poHomeOmnichannelAgent1;
    let poHomeOmnichannelAgent2;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        // Assign agents & departments
        agents = yield Promise.all([(0, agents_1.createAgent)(api, 'user1'), (0, agents_1.createAgent)(api, 'user2')]);
        [agent1, agent2] = agents.map(({ data }) => data);
        departments = yield Promise.all([
            (0, departments_1.createDepartment)(api, { showOnRegistration: true }),
            (0, departments_1.createDepartment)(api, { showOnRegistration: true }),
        ]);
        [departmentA, departmentB] = departments.map(({ data }) => data);
        yield Promise.all([
            (0, departments_1.addAgentToDepartment)(api, { department: departmentA, agentId: agent1._id }),
            (0, departments_1.addAgentToDepartment)(api, { department: departmentB, agentId: agent2._id }),
            api.post('/livechat/triggers', {
                name: 'open',
                description: '',
                enabled: true,
                runOnce: false,
                conditions: [
                    {
                        name: 'chat-opened-by-visitor',
                        value: '',
                    },
                ],
                actions: [
                    {
                        name: 'send-message',
                        params: {
                            name: '',
                            msg: 'This is a trigger message open by visitor',
                            sender: 'queue',
                        },
                    },
                ],
            }),
        ]);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page }) {
        const { page: agent1Page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/', true);
        poHomeOmnichannelAgent1 = new page_objects_1.HomeOmnichannel(agent1Page);
        const { page: agent2Page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user2, '/', true);
        poHomeOmnichannelAgent2 = new page_objects_1.HomeOmnichannel(agent2Page);
        poLiveChat = new page_objects_1.OmnichannelLiveChatEmbedded(page);
    }));
    test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeOmnichannelAgent1.page.close();
        yield poHomeOmnichannelAgent2.page.close();
        yield poLiveChat.page.close();
        yield page.close();
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const ids = (yield (yield api.get('/livechat/triggers')).json()).triggers.map((trigger) => trigger._id);
        yield Promise.all(ids.map((id) => api.delete(`/livechat/triggers/${id}`)));
        (0, test_1.expect)((yield api.post('/settings/Omnichannel_enable_department_removal', { value: true })).status()).toBe(200);
        yield Promise.all([...agents.map((agent) => agent.delete())]);
        yield Promise.all([...departments.map((department) => department.delete())]);
        (0, test_1.expect)((yield api.post('/settings/Omnichannel_enable_department_removal', { value: false })).status()).toBe(200);
        yield api.post('/settings/Livechat_registration_form', { value: true });
    }));
    (0, test_1.test)('OC - Livechat Triggers - setDepartment should affect agent.next call', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poLiveChat.page.goto('/packages/rocketchat_livechat/assets/demo.html');
        const depId = departmentB._id;
        yield poLiveChat.page.evaluate((depId) => window.RocketChat.livechat.setDepartment(depId), depId);
        yield poLiveChat.openLiveChat();
        yield (0, test_1.expect)(poLiveChat.txtChatMessage('This is a trigger message open by visitor')).toBeVisible();
        yield (0, test_1.expect)(poLiveChat.headerTitle).toContainText(agent2.username);
    }));
    (0, test_1.test)('OC - Livechat Triggers - setDepartment should affect agent.next call - Register Form Disabled', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/settings/Livechat_registration_form', { value: false });
        yield poLiveChat.page.goto('/packages/rocketchat_livechat/assets/demo.html');
        const depId = departmentB._id;
        yield poLiveChat.page.evaluate((depId) => window.RocketChat.livechat.setDepartment(depId), depId);
        yield poLiveChat.openLiveChat();
        yield (0, test_1.expect)(poLiveChat.txtChatMessage('This is a trigger message open by visitor')).toBeVisible();
        yield (0, test_1.expect)(poLiveChat.headerTitle).toContainText(agent2.username);
    }));
});
