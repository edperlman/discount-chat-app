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
const rooms_1 = require("../utils/omnichannel/rooms");
const test_1 = require("../utils/test");
test_1.test.use({ storageState: userStates_1.Users.user3.state });
test_1.test.describe('OC - Manual Selection', () => {
    let poOmnichannel;
    let agents;
    let agentB;
    // Change routing method to manual selection
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const res = yield api.post('/settings/Livechat_Routing_Method', { value: 'Manual_Selection' });
        (0, test_1.expect)(res.status()).toBe(200);
    }));
    // Create agent and make it available
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        agents = yield Promise.all([yield (0, agents_1.createAgent)(api, 'user3'), yield (0, agents_1.createAgent)(api, 'user1')]);
        (yield Promise.all(agents.map(({ data: agent }) => (0, agents_1.makeAgentAvailable)(api, agent._id)))).forEach((res) => {
            (0, test_1.expect)(res.status()).toBe(200);
        });
    }));
    // Create page object and redirect to home
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannel = new page_objects_1.HomeOmnichannel(page);
        yield page.goto('/home');
    }));
    // Create agent b session
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
        agentB = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1).then(({ page }) => ({ page, poHomeOmnichannel: new page_objects_1.HomeOmnichannel(page) }));
    }));
    test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield agentB.page.close();
    }));
    // Delete all data
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield Promise.all([
            ...agents.map((agent) => agent.delete()),
            api.post('/settings/Livechat_Routing_Method', { value: 'Auto_Selection' }),
        ]);
    }));
    (0, test_1.test)('OC - Manual Selection - Queue', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        const { data: { room }, } = yield (0, rooms_1.createConversation)(api);
        yield test_1.test.step('expect not be able to see queue when livechat is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.sidenav.switchOmnichannelStatus('offline');
            yield agentB.poHomeOmnichannel.sidenav.switchOmnichannelStatus('offline');
            yield (0, test_1.expect)(poOmnichannel.sidenav.getSidebarItemByName(room.fname)).not.toBeVisible();
            yield (0, test_1.expect)(agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(room.fname)).not.toBeVisible();
            yield poOmnichannel.sidenav.switchOmnichannelStatus('online');
            yield agentB.poHomeOmnichannel.sidenav.switchOmnichannelStatus('online');
            yield (0, test_1.expect)(poOmnichannel.sidenav.getSidebarItemByName(room.fname)).toBeVisible();
            yield (0, test_1.expect)(agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(room.fname)).toBeVisible();
        }));
        yield test_1.test.step('expect to be able join chat in read mode', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.sidenav.getSidebarItemByName(room.fname).click();
            yield (0, test_1.expect)(poOmnichannel.content.inputMessage).not.toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.content.btnTakeChat).toBeVisible();
        }));
        yield test_1.test.step('expect to be able take chat', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.content.btnTakeChat.click();
            yield (0, test_1.expect)(poOmnichannel.content.lastSystemMessageBody).toHaveText('joined the channel');
            yield (0, test_1.expect)(poOmnichannel.content.inputMessage).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.content.btnTakeChat).not.toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.sidenav.getSidebarItemByName(room.fname)).toBeVisible();
        }));
        yield test_1.test.step('expect chat to leave the queue', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.waitForTimeout(250);
            yield (0, test_1.expect)(agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(room.fname)).not.toBeVisible();
        }));
        yield test_1.test.step('expect to be able return to queue', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.content.btnReturnToQueue.click();
            yield poOmnichannel.content.btnReturnToQueueConfirm.click();
            yield (0, test_1.expect)(page).toHaveURL('/home');
        }));
        yield test_1.test.step('expect chat to be back in queue', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannel.sidenav.getSidebarItemByName(room.fname)).toBeVisible();
            yield (0, test_1.expect)(agentB.poHomeOmnichannel.sidenav.getSidebarItemByName(room.fname)).toBeVisible();
            yield poOmnichannel.sidenav.getSidebarItemByName(room.fname).click();
            yield (0, test_1.expect)(poOmnichannel.content.inputMessage).not.toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.content.btnTakeChat).toBeVisible();
        }));
    }));
});
