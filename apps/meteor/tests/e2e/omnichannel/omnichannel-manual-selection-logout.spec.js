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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const inject_initial_data_1 = __importDefault(require("../fixtures/inject-initial-data"));
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const agents_1 = require("../utils/omnichannel/agents");
const rooms_1 = require("../utils/omnichannel/rooms");
const test_1 = require("../utils/test");
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.describe('OC - Manual Selection After Relogin', () => {
    let poOmnichannel;
    let agent;
    // Change routing method to manual selection
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const res = yield api.post('/settings/Livechat_Routing_Method', { value: 'Manual_Selection' });
        (0, test_1.expect)(res.status()).toBe(200);
    }));
    // Create agent and make it available
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        agent = yield (0, agents_1.createAgent)(api, 'user1');
        yield (0, agents_1.makeAgentAvailable)(api, agent.data._id);
    }));
    // Create page object and redirect to home
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannel = new page_objects_1.HomeOmnichannel(page);
        yield page.goto('/home');
        yield poOmnichannel.sidenav.logout();
        yield poOmnichannel.page.locator('role=textbox[name=/username/i]').waitFor({ state: 'visible' });
        yield poOmnichannel.page.locator('role=textbox[name=/username/i]').fill('user1');
        yield poOmnichannel.page.locator('[name=password]').fill(constants_1.DEFAULT_USER_CREDENTIALS.password);
        yield poOmnichannel.page.locator('role=button[name="Login"]').click();
        yield poOmnichannel.page.locator('.main-content').waitFor();
    }));
    // Delete all data
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield agent.delete();
        yield api.post('/settings/Livechat_Routing_Method', { value: 'Auto_Selection' });
        yield (0, inject_initial_data_1.default)();
    }));
    (0, test_1.test)('OC - Manual Selection - Logout & Login', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        (0, test_1.expect)(yield poOmnichannel.page.locator('#omnichannel-status-toggle').getAttribute('title')).toEqual('Turn off answer chats');
        const { data: { room }, } = yield (0, rooms_1.createConversation)(api);
        yield test_1.test.step('expect login and see the chat in queue after login', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.sidenav.getSidebarItemByName(room.fname).click();
            yield (0, test_1.expect)(poOmnichannel.content.inputMessage).not.toBeVisible();
        }));
        yield test_1.test.step('expect take chat to be visible and return to queue not visible', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannel.content.btnTakeChat).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.content.btnReturnToQueue).not.toBeVisible();
        }));
        yield test_1.test.step('expect to be able take chat', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannel.content.btnTakeChat.click();
            yield (0, test_1.expect)(poOmnichannel.content.lastSystemMessageBody).toHaveText('joined the channel');
            yield (0, test_1.expect)(poOmnichannel.content.inputMessage).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.content.btnTakeChat).not.toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.content.btnReturnToQueue).toBeVisible();
            yield (0, test_1.expect)(poOmnichannel.sidenav.getSidebarItemByName(room.fname)).toBeVisible();
        }));
    }));
});
