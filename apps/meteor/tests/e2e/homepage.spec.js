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
const userStates_1 = require("./fixtures/userStates");
const test_1 = require("./utils/test");
const CardIds = {
    Users: 'homepage-add-users-card',
    Chan: 'homepage-create-channels-card',
    Rooms: 'homepage-join-rooms-card',
    Mobile: 'homepage-mobile-apps-card',
    Desktop: 'homepage-desktop-apps-card',
    Docs: 'homepage-documentation-card',
    Custom: 'homepage-custom-card',
};
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('homepage', () => {
    let regularUserPage;
    let adminPage;
    test_1.test.describe('for admins', () => {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
            adminPage = yield browser.newPage({ storageState: userStates_1.Users.admin.state });
            yield adminPage.goto('/home');
            yield adminPage.waitForSelector('[data-qa-id="home-header"]');
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            (0, test_1.expect)((yield api.post('/settings/Layout_Home_Custom_Block_Visible', { value: false })).status()).toBe(200);
            (0, test_1.expect)((yield api.post('/settings/Layout_Custom_Body_Only', { value: false })).status()).toBe(200);
            yield adminPage.close();
        }));
        (0, test_1.test)('expect customize button and all cards to be visible', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('expect show customize button', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(adminPage.locator('role=button[name="Customize"]')).toBeVisible();
            }));
            yield test_1.test.step('expect all cards to be visible', () => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all(Object.values(CardIds).map((id) => (0, test_1.expect)(adminPage.locator(`[data-qa-id="${id}"]`)).toBeVisible()));
            }));
        }));
        test_1.test.describe('custom body with empty custom content', () => __awaiter(void 0, void 0, void 0, function* () {
            test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                yield (0, test_1.expect)((yield api.post('/settings/Layout_Home_Body', { value: '' })).status()).toBe(200);
            }));
            (0, test_1.test)('visibility and button functionality in custom body with empty custom content', () => __awaiter(void 0, void 0, void 0, function* () {
                yield test_1.test.step('expect default value in custom body', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(adminPage.locator('div >> text="Admins may insert content html to be rendered in this white space."')).toBeVisible();
                }));
                yield test_1.test.step('expect both change visibility and show only custom content buttons to be disabled', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(adminPage.locator('role=button[name="Show to workspace"]')).toBeDisabled();
                    yield (0, test_1.expect)(adminPage.locator('role=button[name="Show only this content"]')).toBeDisabled();
                }));
                yield test_1.test.step('expect visibility tag to show "not visible"', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(adminPage.locator('span >> text="Not visible to workspace"')).toBeVisible();
                }));
            }));
        }));
        test_1.test.describe('custom body with custom content', () => {
            test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                yield (0, test_1.expect)((yield api.post('/settings/Layout_Home_Body', { value: 'Hello admin' })).status()).toBe(200);
            }));
            (0, test_1.test)('visibility and button functionality in custom body with custom content', () => __awaiter(void 0, void 0, void 0, function* () {
                yield test_1.test.step('expect custom body to be visible', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(adminPage.locator('div >> text="Hello admin"')).toBeVisible();
                }));
                yield test_1.test.step('expect correct state for card buttons', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(adminPage.locator('role=button[name="Show to workspace"]')).not.toBeDisabled();
                    yield (0, test_1.expect)(adminPage.locator('role=button[name="Show only this content"]')).toBeDisabled();
                }));
            }));
            test_1.test.describe('enterprise edition', () => {
                test_1.test.skip(!constants_1.IS_EE, 'Enterprise Only');
                test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                    yield (0, test_1.expect)((yield api.post('/settings/Layout_Home_Body', { value: 'Hello admin' })).status()).toBe(200);
                    yield (0, test_1.expect)((yield api.post('/settings/Layout_Home_Custom_Block_Visible', { value: true })).status()).toBe(200);
                    yield (0, test_1.expect)((yield api.post('/settings/Layout_Custom_Body_Only', { value: true })).status()).toBe(200);
                }));
                (0, test_1.test)('display custom content only', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield test_1.test.step('expect default layout to not be visible (show only custom content card)', () => __awaiter(void 0, void 0, void 0, function* () {
                        yield (0, test_1.expect)(adminPage.locator('role=heading[name="Welcome to Rocket.Chat"]')).not.toBeVisible();
                    }));
                    yield test_1.test.step('expect correct state for card buttons', () => __awaiter(void 0, void 0, void 0, function* () {
                        yield (0, test_1.expect)(adminPage.locator('role=button[name="Hide on workspace"]')).toBeDisabled();
                        yield (0, test_1.expect)(adminPage.locator('role=button[name="Show default content"]')).not.toBeDisabled();
                    }));
                    yield test_1.test.step('expect visibility tag to show "visible to workspace"', () => __awaiter(void 0, void 0, void 0, function* () {
                        yield (0, test_1.expect)(adminPage.locator('span >> text="Visible to workspace"')).toBeVisible();
                    }));
                }));
            });
        });
    });
    test_1.test.describe('for regular users', () => {
        const notVisibleCards = [CardIds.Users, CardIds.Custom];
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api, browser }) {
            (0, test_1.expect)((yield api.post('/settings/Layout_Home_Body', { value: '' })).status()).toBe(200);
            regularUserPage = yield browser.newPage({ storageState: userStates_1.Users.user2.state });
            yield regularUserPage.goto('/home');
            yield regularUserPage.waitForSelector('[data-qa-id="home-header"]');
        }));
        test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield regularUserPage.close();
        }));
        (0, test_1.test)('the option customize is not be active', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('expect to not show customize button', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(regularUserPage.locator('role=button[name="Customize"]')).not.toBeVisible();
            }));
            yield test_1.test.step(`expect ${notVisibleCards.join(' and ')} cards to not be visible`, () => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all(notVisibleCards.map((id) => (0, test_1.expect)(regularUserPage.locator(`[data-qa-id="${id}"]`)).not.toBeVisible()));
            }));
            yield test_1.test.step('expect all other cards to be visible', () => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all(Object.values(CardIds)
                    .filter((id) => !notVisibleCards.includes(id))
                    .map((id) => (0, test_1.expect)(regularUserPage.locator(`[data-qa-id="${id}"]`)).toBeVisible()));
            }));
            yield test_1.test.step('expect welcome text to use Site_Name default setting', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(regularUserPage.locator('role=heading[name="Welcome to Rocket.Chat"]')).toBeVisible();
            }));
            yield test_1.test.step('expect header text to use Layout_Home_Title default setting', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(regularUserPage.locator('[data-qa-type="PageHeader-title"]')).toContainText('Home');
            }));
        }));
        test_1.test.describe('custom values', () => {
            test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                (0, test_1.expect)((yield api.post('/settings/Site_Name', { value: 'NewSiteName' })).status()).toBe(200);
                (0, test_1.expect)((yield api.post('/settings/Layout_Home_Title', { value: 'NewTitle' })).status()).toBe(200);
                yield regularUserPage.goto('/home');
                yield regularUserPage.waitForSelector('[data-qa-id="home-header"]');
            }));
            test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                (0, test_1.expect)((yield api.post('/settings/Site_Name', { value: 'Rocket.Chat' })).status()).toBe(200);
                (0, test_1.expect)((yield api.post('/settings/Layout_Home_Title', { value: 'Home' })).status()).toBe(200);
            }));
            (0, test_1.test)('expect welcome text and header text to be correct', () => __awaiter(void 0, void 0, void 0, function* () {
                yield test_1.test.step('expect welcome text to be NewSiteName', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(regularUserPage.locator('role=heading[name="Welcome to NewSiteName"]')).toBeVisible();
                }));
                yield test_1.test.step('expect header text to be Layout_Home_Title setting', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(regularUserPage.locator('[data-qa-type="PageHeader-title"]')).toContainText('NewTitle');
                }));
            }));
        });
        test_1.test.describe('custom body with content', () => {
            test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                (0, test_1.expect)((yield api.post('/settings/Layout_Home_Body', { value: 'Hello' })).status()).toBe(200);
                (0, test_1.expect)((yield api.post('/settings/Layout_Home_Custom_Block_Visible', { value: true })).status()).toBe(200);
                yield regularUserPage.goto('/home');
                yield regularUserPage.waitForSelector('[data-qa-id="home-header"]');
            }));
            test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                (0, test_1.expect)((yield api.post('/settings/Layout_Home_Body', { value: '' })).status()).toBe(200);
                (0, test_1.expect)((yield api.post('/settings/Layout_Home_Custom_Block_Visible', { value: false })).status()).toBe(200);
            }));
            (0, test_1.test)('expect custom body to be visible', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(regularUserPage.locator('div >> text="Hello"')).toBeVisible();
            }));
            test_1.test.describe('enterprise edition', () => {
                test_1.test.skip(!constants_1.IS_EE, 'Enterprise Only');
                test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                    (0, test_1.expect)((yield api.post('/settings/Layout_Custom_Body_Only', { value: true })).status()).toBe(200);
                }));
                test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                    (0, test_1.expect)((yield api.post('/settings/Layout_Custom_Body_Only', { value: false })).status()).toBe(200);
                }));
                (0, test_1.test)('expect default layout not be visible and custom body visible', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield test_1.test.step('expect default layout to not be visible', () => __awaiter(void 0, void 0, void 0, function* () {
                        yield (0, test_1.expect)(regularUserPage.locator('[data-qa-id="homepage-welcome-text"]')).not.toBeVisible();
                    }));
                    yield test_1.test.step('expect custom body to be visible', () => __awaiter(void 0, void 0, void 0, function* () {
                        yield (0, test_1.expect)(regularUserPage.locator('div >> text="Hello"')).toBeVisible();
                    }));
                }));
            });
        });
    });
});
