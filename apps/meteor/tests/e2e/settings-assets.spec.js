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
const page_objects_1 = require("./page-objects");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('settings-assets', () => {
    let poAdmin;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poAdmin = new page_objects_1.Admin(page);
        yield page.goto('/admin/settings');
        yield poAdmin.btnAssetsSettings.click();
        yield (0, test_1.expect)(page.locator('[data-qa-type="PageHeader-title"]')).toHaveText('Assets');
    }));
    (0, test_1.test)('expect upload and delete logo asset and label should be visible', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield (0, test_1.expect)(page.locator('[title="Assets_logo"]')).toHaveText('logo (svg, png, jpg)');
        yield poAdmin.inputAssetsLogo.setInputFiles('./tests/e2e/fixtures/files/test-image.jpeg');
        yield (0, test_1.expect)(page.locator('role=img[name="Asset preview"]')).toBeVisible();
        yield poAdmin.btnDeleteAssetsLogo.click();
        yield (0, test_1.expect)(page.locator('role=img[name="Asset preview"]')).not.toBeVisible();
    }));
    (0, test_1.test)('expect upload and delete logo asset for dark theme and label should be visible', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield (0, test_1.expect)(page.locator('[title="Assets_logo_dark"]')).toHaveText('logo - dark theme (svg, png, jpg)');
        yield poAdmin.inputAssetsLogo.setInputFiles('./tests/e2e/fixtures/files/test-image.jpeg');
        yield (0, test_1.expect)(page.locator('role=img[name="Asset preview"]')).toBeVisible();
        yield poAdmin.btnDeleteAssetsLogo.click();
        yield (0, test_1.expect)(page.locator('role=img[name="Asset preview"]')).not.toBeVisible();
    }));
    (0, test_1.test)('expect upload and delete background asset and label should be visible', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield (0, test_1.expect)(page.locator('[title="Assets_background"]')).toHaveText('login background (svg, png, jpg)');
        yield poAdmin.inputAssetsLogo.setInputFiles('./tests/e2e/fixtures/files/test-image.jpeg');
        yield (0, test_1.expect)(page.locator('role=img[name="Asset preview"]')).toBeVisible();
        yield poAdmin.btnDeleteAssetsLogo.click();
        yield (0, test_1.expect)(page.locator('role=img[name="Asset preview"]')).not.toBeVisible();
    }));
    (0, test_1.test)('expect upload and delete background asset for dark theme and label should be visible', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield (0, test_1.expect)(page.locator('[title="Assets_background_dark"]')).toHaveText('login background - dark theme (svg, png, jpg)');
        yield poAdmin.inputAssetsLogo.setInputFiles('./tests/e2e/fixtures/files/test-image.jpeg');
        yield (0, test_1.expect)(page.locator('role=img[name="Asset preview"]')).toBeVisible();
        yield poAdmin.btnDeleteAssetsLogo.click();
        yield (0, test_1.expect)(page.locator('role=img[name="Asset preview"]')).not.toBeVisible();
    }));
});
