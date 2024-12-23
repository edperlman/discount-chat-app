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
const setSettingValueById_1 = require("./utils/setSettingValueById");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('access-security-page', () => {
    let poAccountProfile;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield Promise.all([
            (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_AllowPasswordChange', false),
            (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_TwoFactorAuthentication_Enabled', false),
            (0, setSettingValueById_1.setSettingValueById)(api, 'E2E_Enable', false),
        ]);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poAccountProfile = new page_objects_1.AccountProfile(page);
        yield page.goto('/account/security');
        yield page.waitForSelector('.main-content');
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        return Promise.all([
            (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_AllowPasswordChange', true),
            (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_TwoFactorAuthentication_Enabled', true),
            (0, setSettingValueById_1.setSettingValueById)(api, 'E2E_Enable', false),
        ]);
    }));
    (0, test_1.test)('security tab is invisible when password change, 2FA and E2E are disabled', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const securityTab = poAccountProfile.sidenav.linkSecurity;
        yield (0, test_1.expect)(securityTab).not.toBeVisible();
        const mainContent = page.locator('.main-content').getByText('You are not authorized to view this page.').first();
        yield (0, test_1.expect)(mainContent).toBeVisible();
    }));
    test_1.test.describe.serial('can access account security sections', () => {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield Promise.all([
                (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_AllowPasswordChange', true),
                (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_TwoFactorAuthentication_Enabled', false),
                (0, setSettingValueById_1.setSettingValueById)(api, 'E2E_Enable', false),
            ]);
        }));
        test_1.test.beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield poAccountProfile.securityHeader.waitFor({ state: 'visible' });
        }));
        (0, test_1.test)('security page is visible when password change is enabled but 2FA and E2E are disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            const securityTab = poAccountProfile.sidenav.linkSecurity;
            yield (0, test_1.expect)(securityTab).toBeVisible();
        }));
        (0, test_1.test)('can access password change when enabled but 2FA and E2E are disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poAccountProfile.securityPasswordSection).toBeVisible();
        }));
        (0, test_1.test)('can access 2FA setting when enabled but password change and E2E are disabled', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield Promise.all([
                (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_AllowPasswordChange', false),
                (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_TwoFactorAuthentication_Enabled', true),
                (0, setSettingValueById_1.setSettingValueById)(api, 'E2E_Enable', false),
            ]);
            yield (0, test_1.expect)(poAccountProfile.security2FASection).toBeVisible();
        }));
        (0, test_1.test)('can access E2E setting when enabled but password change and 2FA are disabled', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield Promise.all([
                (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_AllowPasswordChange', false),
                (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_TwoFactorAuthentication_Enabled', false),
                (0, setSettingValueById_1.setSettingValueById)(api, 'E2E_Enable', true),
            ]);
            yield (0, test_1.expect)(poAccountProfile.securityE2EEncryptionSection).toBeVisible();
        }));
    });
});
