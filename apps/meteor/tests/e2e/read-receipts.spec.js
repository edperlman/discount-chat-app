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
const constants_1 = require("./config/constants");
const createAuxContext_1 = require("./fixtures/createAuxContext");
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const utils_1 = require("./utils");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('read-receipts', () => {
    let poHomeChannel;
    let targetChannel;
    test_1.test.skip(!constants_1.IS_EE, 'Enterprise Only');
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        targetChannel = yield (0, utils_1.createTargetChannel)(api);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    test_1.test.describe('read receipt settings disabled', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, test_1.test)('should not show read receipts item menu', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.content.sendMessage('hello world');
            yield poHomeChannel.content.openLastMessageMenu();
            (0, test_1.expect)(page.locator('role=menuitem[name="Read receipts"]')).not.toBeVisible;
        }));
    }));
    test_1.test.describe('read receipts enabled', () => __awaiter(void 0, void 0, void 0, function* () {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, utils_1.setSettingValueById)(api, 'Message_Read_Receipt_Enabled', true);
            yield (0, utils_1.setSettingValueById)(api, 'Message_Read_Receipt_Store_Users', true);
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, utils_1.setSettingValueById)(api, 'Message_Read_Receipt_Enabled', false);
            yield (0, utils_1.setSettingValueById)(api, 'Message_Read_Receipt_Store_Users', false);
        }));
        let auxContext;
        test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            if (auxContext) {
                yield auxContext.page.close();
            }
            auxContext = undefined;
        }));
        (0, test_1.test)('should show read receipts message sent status in the sent message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
            const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1);
            auxContext = { page, poHomeChannel: new page_objects_1.HomeChannel(page) };
            yield auxContext.poHomeChannel.sidenav.openChat(targetChannel);
            yield auxContext.poHomeChannel.content.sendMessage('hello admin');
            yield (0, test_1.expect)(auxContext.poHomeChannel.content.lastUserMessage.getByRole('status', { name: 'Message sent' })).toBeVisible();
        }));
        (0, test_1.test)('should show read receipts message viewed status in the sent message', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage.getByRole('status', { name: 'Message viewed' })).toBeVisible();
        }));
        (0, test_1.test)('should show the reads receipt modal with the users who read the message', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.content.openLastMessageMenu();
            yield page.locator('role=menuitem[name="Read receipts"]').click();
            yield (0, test_1.expect)(page.getByRole('dialog').getByRole('listitem')).toHaveCount(2);
        }));
    }));
});
