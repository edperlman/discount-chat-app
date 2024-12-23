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
const priority_1 = require("../utils/omnichannel/priority");
const sla_1 = require("../utils/omnichannel/sla");
const test_1 = require("../utils/test");
const getRoomId = (page) => {
    // url is of the form: http://localhost:3000/live/:rid/room-info
    const url = page === null || page === void 0 ? void 0 : page.url();
    // rid comes after /live/ and before /room-info (or /)
    const rid = url === null || url === void 0 ? void 0 : url.split('/live/')[1].split('/')[0];
    if (!rid) {
        throw new Error(`Could not get room id from url: ${page.url()}`);
    }
    return rid;
};
test_1.test.describe.serial('omnichannel-changing-room-priority-and-sla', () => {
    test_1.test.skip(!constants_1.IS_EE, 'Enterprise Only');
    let poLiveChat;
    let newVisitor;
    let agent;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api, browser }) {
        let statusCode = (yield api.post('/livechat/users/agent', { username: constants_1.ADMIN_CREDENTIALS.username })).status();
        (0, test_1.expect)(statusCode).toBe(200);
        statusCode = (yield api.post('/livechat/users/manager', { username: constants_1.ADMIN_CREDENTIALS.username })).status();
        (0, test_1.expect)(statusCode).toBe(200);
        statusCode = (yield api.post('/settings/Livechat_Routing_Method', { value: 'Manual_Selection' })).status();
        (0, test_1.expect)(statusCode).toBe(200);
        const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.admin);
        agent = { page, poHomeChannel: new page_objects_1.HomeChannel(page) };
        yield agent.poHomeChannel.sidenav.switchStatus('online');
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield agent.page.close();
        yield Promise.all([
            api.delete(`/livechat/users/agent/${constants_1.ADMIN_CREDENTIALS.username}`),
            api.delete(`/livechat/users/manager/${constants_1.ADMIN_CREDENTIALS.username}`),
            api.post('/settings/Livechat_Routing_Method', { value: 'Auto_Selection' }),
        ]);
    }));
    (0, test_1.test)('expect to initiate a new livechat conversation', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        newVisitor = (0, data_1.createFakeVisitor)();
        poLiveChat = new page_objects_1.OmnichannelLiveChat(page, api);
        yield page.goto('/livechat');
        yield poLiveChat.openLiveChat();
        yield poLiveChat.sendMessage(newVisitor, false);
        yield poLiveChat.onlineAgentMessage.type('this_a_test_message_from_user');
        yield poLiveChat.btnSendMessageToOnlineAgent.click();
        yield agent.poHomeChannel.sidenav.getQueuedChat(newVisitor.name).click();
    }));
    (0, test_1.test)('expect to change priority of room and corresponding system message should be displayed', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const priority = yield (0, priority_1.getPriorityByi18nLabel)(api, 'High');
        yield test_1.test.step('change priority of room to the new priority', () => __awaiter(void 0, void 0, void 0, function* () {
            const status = (yield api.post(`/livechat/room/${getRoomId(agent.page)}/priority`, { priorityId: priority._id })).status();
            yield (0, test_1.expect)(status).toBe(200);
            yield agent.page.waitForTimeout(1000);
        }));
        yield (0, test_1.expect)(agent.poHomeChannel.content.lastSystemMessageBody).toHaveText(`Priority changed: ${constants_1.ADMIN_CREDENTIALS.username} changed the priority to ${priority.name || priority.i18n}`);
    }));
    (0, test_1.test)('expect to change SLA of room and corresponding system message should be displayed', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const sla = yield (0, sla_1.createSLA)(api);
        yield test_1.test.step('change SLA of room to the new SLA', () => __awaiter(void 0, void 0, void 0, function* () {
            const status = (yield api.put(`/livechat/inquiry.setSLA`, { sla: sla.name, roomId: getRoomId(agent.page) })).status();
            (0, test_1.expect)(status).toBe(200);
            yield agent.page.waitForTimeout(1000);
        }));
        yield (0, test_1.expect)(agent.poHomeChannel.content.lastSystemMessageBody).toHaveText(`SLA Policy changed: ${constants_1.ADMIN_CREDENTIALS.username} changed the SLA Policy to ${sla.name}`);
        yield test_1.test.step('cleanup SLA', () => __awaiter(void 0, void 0, void 0, function* () {
            const status = (yield api.delete(`/livechat/sla/${sla._id}`)).status();
            (0, test_1.expect)(status).toBe(200);
        }));
    }));
});
