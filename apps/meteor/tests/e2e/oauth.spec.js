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
const page_objects_1 = require("./page-objects");
const setSettingValueById_1 = require("./utils/setSettingValueById");
const test_1 = require("./utils/test");
test_1.test.describe('OAuth', () => {
    let poRegistration;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poRegistration = new page_objects_1.Registration(page);
    }));
    (0, test_1.test)('Login Page', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield test_1.test.step('expect OAuth button to be visible', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_OAuth_Google', true)).status()).toBe(200);
            yield page.waitForTimeout(5000);
            yield page.goto('/home');
            yield (0, test_1.expect)(poRegistration.btnLoginWithGoogle).toBeVisible();
        }));
        yield test_1.test.step('expect Custom OAuth button to be visible', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_OAuth_Custom-Test', true)).status()).toBe(200);
            yield page.waitForTimeout(5000);
            yield page.goto('/home');
            yield (0, test_1.expect)(poRegistration.btnLoginWithCustomOAuth).toBeVisible();
        }));
        yield test_1.test.step('expect redirect to the configured URL.', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poRegistration.btnLoginWithCustomOAuth.click();
            yield (0, test_1.expect)(page).toHaveURL(/https\:\/\/(www)?\.rocket\.chat/);
        }));
        yield test_1.test.step('expect OAuth button to not be visible', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_OAuth_Google', false)).status()).toBe(200);
            yield page.waitForTimeout(5000);
            yield page.goto('/home');
            yield (0, test_1.expect)(poRegistration.btnLoginWithGoogle).not.toBeVisible();
        }));
        yield test_1.test.step('expect Custom OAuth button to not be visible', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_OAuth_Custom-Test', false)).status()).toBe(200);
            yield page.waitForTimeout(5000);
            yield page.goto('/home');
            yield (0, test_1.expect)(poRegistration.btnLoginWithCustomOAuth).not.toBeVisible();
        }));
    }));
});
