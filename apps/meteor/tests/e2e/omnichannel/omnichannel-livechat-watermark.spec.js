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
const test_1 = require("../utils/test");
const visitor = (0, data_1.createFakeVisitor)();
test_1.test.skip(!constants_1.IS_EE, 'Enterprise Only');
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe('OC - Livechat - Hide watermark', () => __awaiter(void 0, void 0, void 0, function* () {
    let agent;
    let poLiveChat;
    let poOmnichannelSettings;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        agent = yield (0, agents_1.createAgent)(api, 'user1');
        const res = yield (0, agents_1.makeAgentAvailable)(api, agent.data._id);
        yield (0, test_1.expect)(res.status()).toBe(200);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, api }) {
        const { page: livechatPage } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/livechat', false);
        poLiveChat = new page_objects_1.OmnichannelLiveChat(livechatPage, api);
    }));
    test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield poLiveChat.page.close();
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannelSettings = new page_objects_1.OmnichannelSettings(page);
        yield page.goto('/admin/settings/Omnichannel');
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const res = yield api.post('/settings/Livechat_hide_watermark', { value: false });
        yield (0, test_1.expect)(res.status()).toBe(200);
    }));
    (0, test_1.test)('OC - Livechat - Hide watermark', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('expect to open Livechat', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.openLiveChat();
            yield poLiveChat.sendMessage(visitor, false);
        }));
        yield test_1.test.step('expect watermark to start visible (default)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poLiveChat.onlineAgentMessage).toBeVisible();
            yield (0, test_1.expect)(poLiveChat.txtWatermark).toBeVisible();
        }));
        yield test_1.test.step('expect to change setting', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelSettings.group('Livechat').click();
            yield poOmnichannelSettings.labelHideWatermark.click();
            yield poOmnichannelSettings.btnSave.click();
        }));
        yield test_1.test.step('expect watermark to be hidden', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLiveChat.page.reload();
            yield poLiveChat.openLiveChat();
            yield (0, test_1.expect)(poLiveChat.onlineAgentMessage).toBeVisible();
            yield (0, test_1.expect)(poLiveChat.txtWatermark).toBeHidden();
        }));
    }));
}));
