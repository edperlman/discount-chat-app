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
const page_objects_1 = require("./page-objects");
const setSettingValueById_1 = require("./utils/setSettingValueById");
const test_1 = require("./utils/test");
test_1.test.describe.serial('Presence', () => {
    let poRegistration;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poRegistration = new page_objects_1.Registration(page);
        yield page.goto('/home');
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'API_Use_REST_For_DDP_Calls', true)).status()).toBe(200);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'API_Use_REST_For_DDP_Calls', true)).status()).toBe(200);
    }));
    test_1.test.describe('Login using default settings', () => {
        (0, test_1.test)('expect user to be online after log in', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poRegistration.username.type('user1');
            yield poRegistration.inputPassword.type(constants_1.DEFAULT_USER_CREDENTIALS.password);
            yield poRegistration.btnLogin.click();
            yield (0, test_1.expect)(page.getByRole('button', { name: 'User menu' }).locator('.rcx-status-bullet--online')).toBeVisible();
        }));
    });
    test_1.test.describe('Login using with "Methods by REST" disabled', () => {
        test_1.test.skip(constants_1.IS_EE, `Micro services don't support turning this setting off`);
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'API_Use_REST_For_DDP_Calls', false)).status()).toBe(200);
        }));
        (0, test_1.test)('expect user to be online after log in', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poRegistration.username.type('user1');
            yield poRegistration.inputPassword.type(constants_1.DEFAULT_USER_CREDENTIALS.password);
            yield poRegistration.btnLogin.click();
            yield (0, test_1.expect)(page.getByRole('button', { name: 'User menu' }).locator('.rcx-status-bullet--online')).toBeVisible();
        }));
    });
});
