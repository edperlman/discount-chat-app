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
const faker_1 = require("@faker-js/faker");
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.user3.state });
test_1.test.describe.serial('settings-account-profile', () => {
    let poHomeChannel;
    let poAccountProfile;
    const token = faker_1.faker.string.alpha(10);
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        poAccountProfile = new page_objects_1.AccountProfile(page);
    }));
    // FIXME: solve test intermitencies
    test_1.test.describe('Profile', () => {
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/account/profile');
        }));
        test_1.test.skip('expect update profile with new name/username', () => __awaiter(void 0, void 0, void 0, function* () {
            const newName = faker_1.faker.person.fullName();
            const newUsername = faker_1.faker.internet.userName({ firstName: newName });
            yield poAccountProfile.inputName.fill(newName);
            yield poAccountProfile.inputUsername.fill(newUsername);
            yield poAccountProfile.btnSubmit.click();
            yield poAccountProfile.btnClose.click();
            yield poHomeChannel.sidenav.openChat('general');
            yield poHomeChannel.content.sendMessage('any_message');
            yield (0, test_1.expect)(poHomeChannel.content.lastUserMessageNotSequential).toContainText(newUsername);
            yield poHomeChannel.content.lastUserMessageNotSequential.locator('figure').click();
            yield poHomeChannel.content.linkUserCard.click();
            yield (0, test_1.expect)(poHomeChannel.tabs.userInfoUsername).toHaveText(newUsername);
        }));
        test_1.test.describe('Avatar', () => {
            (0, test_1.test)('should change avatar image by uploading file', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poAccountProfile.inputImageFile.setInputFiles('./tests/e2e/fixtures/files/test-image.jpeg');
                yield poAccountProfile.btnSubmit.click();
                yield (0, test_1.expect)(poAccountProfile.userAvatarEditor).toHaveAttribute('src');
            }));
            (0, test_1.test)('should change avatar image from url', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poAccountProfile.inputAvatarLink.fill('https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50');
                yield poAccountProfile.btnSetAvatarLink.click();
                yield poAccountProfile.btnSubmit.click();
                yield (0, test_1.expect)(poAccountProfile.userAvatarEditor).toHaveAttribute('src');
            }));
            (0, test_1.test)('should display a skeleton if the image url is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poAccountProfile.inputAvatarLink.fill('https://invalidUrl');
                yield poAccountProfile.btnSetAvatarLink.click();
                yield poAccountProfile.btnSubmit.click();
                yield (0, test_1.expect)(poAccountProfile.userAvatarEditor).not.toHaveAttribute('src');
            }));
        });
    });
    test_1.test.describe('Security', () => {
        (0, test_1.test)('should not have any accessibility violations', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, makeAxeBuilder }) {
            yield page.goto('/account/security');
            const results = yield makeAxeBuilder().analyze();
            (0, test_1.expect)(results.violations).toEqual([]);
        }));
    });
    (0, test_1.test)('Personal Access Tokens', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const response = page.waitForResponse('**/api/v1/users.getPersonalAccessTokens');
        yield page.goto('/account/tokens');
        yield response;
        yield test_1.test.step('expect show empty personal access tokens table', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poAccountProfile.tokensTableEmpty).toBeVisible();
            yield (0, test_1.expect)(poAccountProfile.inputToken).toBeVisible();
        }));
        yield test_1.test.step('expect show new personal token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poAccountProfile.inputToken.type(token);
            yield poAccountProfile.btnTokensAdd.click();
            yield (0, test_1.expect)(poAccountProfile.tokenAddedModal).toBeVisible();
            yield page.locator('role=button[name=Ok]').click();
        }));
        yield test_1.test.step('expect not allow add new personal token with same name', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poAccountProfile.inputToken.type(token);
            yield poAccountProfile.btnTokensAdd.click();
            yield (0, test_1.expect)(page.locator('.rcx-toastbar.rcx-toastbar--error')).toBeVisible();
        }));
        yield test_1.test.step('expect regenerate personal token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poAccountProfile.tokenInTable(token).locator('button >> nth=0').click();
            yield poAccountProfile.btnRegenerateTokenModal.click();
            yield (0, test_1.expect)(poAccountProfile.tokenAddedModal).toBeVisible();
            yield page.locator('role=button[name=Ok]').click();
        }));
        yield test_1.test.step('expect delete personal token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poAccountProfile.tokenInTable(token).locator('button >> nth=1').click();
            yield poAccountProfile.btnRemoveTokenModal.click();
            yield (0, test_1.expect)(page.locator('.rcx-toastbar.rcx-toastbar--success')).toBeVisible();
        }));
    }));
    test_1.test.describe('Omnichannel', () => {
        (0, test_1.test)('should not have any accessibility violations', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, makeAxeBuilder }) {
            yield page.goto('/account/omnichannel');
            const results = yield makeAxeBuilder().analyze();
            (0, test_1.expect)(results.violations).toEqual([]);
        }));
    });
    test_1.test.describe('Feature Preview', () => {
        (0, test_1.test)('should not have any accessibility violations', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, makeAxeBuilder }) {
            yield page.goto('/account/feature-preview');
            const results = yield makeAxeBuilder().analyze();
            (0, test_1.expect)(results.violations).toEqual([]);
        }));
    });
    test_1.test.describe('Accessibility & Appearance', () => {
        (0, test_1.test)('should not have any accessibility violations', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, makeAxeBuilder }) {
            yield page.goto('/account/accessibility-and-appearance');
            const results = yield makeAxeBuilder().analyze();
            (0, test_1.expect)(results.violations).toEqual([]);
        }));
    });
});
