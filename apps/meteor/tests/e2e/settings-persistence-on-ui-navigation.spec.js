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
const userStates_1 = require("./fixtures/userStates");
const utils_1 = require("./utils");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('settings-persistence-on-ui-navigation', () => {
    test_1.test.beforeAll(({ api }) => (0, utils_1.setSettingValueById)(api, 'Hide_System_Messages', []));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto('/admin/settings/Message');
        // Intercept the API call and delay its response
        yield page.route('/api/v1/method.call/saveSettings', (route) => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield route.fetch();
            yield new Promise((resolve) => setTimeout(resolve, 2000)); // Delay the response by 2 seconds
            return route.fulfill({
                response,
                status: response.status(),
                headers: response.headers(),
                body: yield response.body(),
            });
        }));
    }));
    test_1.test.afterAll(({ api }) => (0, utils_1.setSettingValueById)(api, 'Hide_System_Messages', []));
    (0, test_1.test)('expect settings to persist in ui when navigating back and forth', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const settingInput = yield page.locator('[data-qa-setting-id="Hide_System_Messages"] input');
        yield settingInput.pressSequentially('User joined');
        yield settingInput.press('Enter');
        yield page.locator('button:has-text("Save changes")').click();
        yield page.locator('button[title="Back"]').click();
        yield page.waitForResponse((response) => response.url().includes('/api/v1/method.call/saveSettings') && response.status() === 200);
        yield page.locator('a[href="/admin/settings/Message"] >> text=Open').click();
        yield (0, test_1.expect)(page.locator('label[for="Hide_System_Messages"][title="Hide_System_Messages"]')).toBeVisible();
    }));
});
