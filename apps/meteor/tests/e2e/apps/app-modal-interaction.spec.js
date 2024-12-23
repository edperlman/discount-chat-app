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
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const create_target_channel_1 = require("../utils/create-target-channel");
const test_1 = require("../utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
// TODO: Remove the skip on this test once a fix in the apps engine is done
// For some reason the app doesn't work properly when installed via insertApp method
test_1.test.describe.skip('app-surfaces-interaction', () => {
    let poHomeChannel;
    let targetChannel;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        targetChannel = yield (0, create_target_channel_1.createTargetChannel)(api);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    (0, test_1.test)('expect to submit an success modal', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield page.locator('role=button[name="Options"]').click();
        yield page.locator('[data-key="success"]').click();
        yield page.locator('role=button[name="success"]').click();
        const updatedButton = page.locator('role=button[name="success"]');
        yield (0, test_1.expect)(updatedButton).not.toBeVisible();
    }));
    (0, test_1.test)('expect to not close the modal and there is an error in the modal', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield page.locator('role=button[name="Options"]').click();
        yield page.locator('[data-key="error"]').click();
        yield page.locator('role=button[name="error"]').click();
        const updatedTitle = page.locator('role=button[name="error"]');
        (0, test_1.expect)(updatedTitle).toBeDefined();
        const input = page.locator('input[type="text"]');
        yield input.click();
        yield input.fill('fixed');
        yield page.locator('role=button[name="error"]').click();
        yield (0, test_1.expect)(input).not.toBeVisible();
    }));
    (0, test_1.test)('expect to show the toaster error for modal that timeout the execution', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield page.locator('role=button[name="Options"]').click();
        yield page.locator('[data-key="timeout"]').click();
        yield page.locator('role=button[name="timeout"]').click();
        yield page.locator('role=alert').waitFor();
        const toaster = page.locator('role=alert');
        yield (0, test_1.expect)(toaster).toBeVisible();
    }));
    (0, test_1.test)('expect change the modal and then submit the updated modal', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield page.locator('role=button[name="Options"]').click();
        yield page.locator('[data-key="update"]').click();
        yield page.locator('role=button[name="update"]').click();
        const updatedTitle = page.locator('role=button[name="title updated"]');
        (0, test_1.expect)(updatedTitle).toBeDefined();
        const updatedButton = page.locator('role=button[name="updated"]');
        (0, test_1.expect)(updatedButton).toBeDefined();
    }));
});
