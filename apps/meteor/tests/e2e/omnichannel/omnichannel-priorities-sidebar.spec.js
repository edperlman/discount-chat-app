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
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const omnichannel_room_info_1 = require("../page-objects/omnichannel-room-info");
const rooms_1 = require("../utils/omnichannel/rooms");
const test_1 = require("../utils/test");
const visitor = (0, data_1.createFakeVisitor)();
const getPrioritySystemMessage = (username, priority) => `Priority changed: ${username} changed the priority to ${priority}`;
test_1.test.skip(!constants_1.IS_EE, 'Omnichannel Priorities > Enterprise Only');
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.describe.serial('OC - Priorities [Sidebar]', () => {
    let poHomeChannel;
    let poRoomInfo;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        (yield Promise.all([
            api.post('/livechat/users/agent', { username: 'user1' }),
            api.post('/livechat/users/manager', { username: 'user1' }),
            api.post('/settings/Livechat_Routing_Method', { value: 'Manual_Selection' }),
        ])).every((res) => (0, test_1.expect)(res.status()).toBe(200));
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeOmnichannel(page);
        poRoomInfo = new omnichannel_room_info_1.OmnichannelRoomInfo(page);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto('/');
        yield page.locator('.main-content').waitFor();
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield (0, rooms_1.createConversation)(api, { visitorName: visitor.name });
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        (yield Promise.all([
            api.delete('/livechat/users/agent/user1'),
            api.delete('/livechat/users/manager/user1'),
            api.post('/settings/Livechat_Routing_Method', { value: 'Auto_Selection' }),
        ])).every((res) => (0, test_1.expect)(res.status()).toBe(200));
    }));
    (0, test_1.test)('OC - Priorities [Sidebar] - Update conversation priority', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const systemMessage = poHomeChannel.content.lastSystemMessageBody;
        yield page.emulateMedia({ reducedMotion: 'reduce' });
        yield test_1.test.step('expect to change inquiry priority using sidebar menu', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.getSidebarItemByName(visitor.name).click();
            yield (0, test_1.expect)(poHomeChannel.content.btnTakeChat).toBeVisible();
            yield (0, test_1.expect)(poRoomInfo.getLabel('Priority')).not.toBeVisible();
            yield poHomeChannel.sidenav.selectPriority(visitor.name, 'Lowest');
            yield systemMessage.locator(`text="${getPrioritySystemMessage('user1', 'Lowest')}"`).waitFor();
            yield (0, test_1.expect)(poRoomInfo.getLabel('Priority')).toBeVisible();
            yield (0, test_1.expect)(poRoomInfo.getInfo('Lowest')).toBeVisible();
            yield poHomeChannel.sidenav.selectPriority(visitor.name, 'Highest');
            yield systemMessage.locator(`text="${getPrioritySystemMessage('user1', 'Highest')}"`).waitFor();
            yield (0, test_1.expect)(poRoomInfo.getInfo('Highest')).toBeVisible();
            yield poHomeChannel.sidenav.selectPriority(visitor.name, 'Unprioritized');
            yield systemMessage.locator(`text="${getPrioritySystemMessage('user1', 'Unprioritized')}"`).waitFor();
            yield (0, test_1.expect)(poRoomInfo.getLabel('Priority')).not.toBeVisible();
            yield (0, test_1.expect)(poRoomInfo.getInfo('Unprioritized')).not.toBeVisible();
        }));
        yield test_1.test.step('expect to change subscription priority using sidebar menu', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.content.btnTakeChat.click();
            yield systemMessage.locator('text="joined the channel"').waitFor();
            yield page.waitForTimeout(500);
            yield (0, test_1.expect)(poRoomInfo.getLabel('Priority')).not.toBeVisible();
            yield poHomeChannel.sidenav.selectPriority(visitor.name, 'Lowest');
            yield systemMessage.locator(`text="${getPrioritySystemMessage('user1', 'Lowest')}"`).waitFor();
            yield (0, test_1.expect)(poRoomInfo.getLabel('Priority')).toBeVisible();
            yield (0, test_1.expect)(poRoomInfo.getInfo('Lowest')).toBeVisible();
            yield poHomeChannel.sidenav.selectPriority(visitor.name, 'Highest');
            yield systemMessage.locator(`text="${getPrioritySystemMessage('user1', 'Highest')}"`).waitFor();
            yield (0, test_1.expect)(poRoomInfo.getInfo('Highest')).toBeVisible();
            yield poHomeChannel.sidenav.selectPriority(visitor.name, 'Unprioritized');
            yield systemMessage.locator(`text="${getPrioritySystemMessage('user1', 'Unprioritized')}"`).waitFor();
            yield (0, test_1.expect)(poRoomInfo.getLabel('Priority')).not.toBeVisible();
            yield (0, test_1.expect)(poRoomInfo.getInfo('Unprioritized')).not.toBeVisible();
        }));
    }));
});
