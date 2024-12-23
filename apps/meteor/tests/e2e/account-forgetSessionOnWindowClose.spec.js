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
const test_1 = require("./utils/test");
test_1.test.describe.serial('Forget session on window close setting', () => {
    let poRegistration;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poRegistration = new page_objects_1.Registration(page);
        yield page.goto('/home');
    }));
    test_1.test.describe('Setting off', () => __awaiter(void 0, void 0, void 0, function* () {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield api.post('/settings/Accounts_ForgetUserSessionOnWindowClose', { value: false });
        }));
        (0, test_1.test)('Login using credentials and reload to stay logged in', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, context }) {
            yield poRegistration.username.type('user1');
            yield poRegistration.inputPassword.type(constants_1.DEFAULT_USER_CREDENTIALS.password);
            yield poRegistration.btnLogin.click();
            yield (0, test_1.expect)(page.locator('role=heading[name="Welcome to Rocket.Chat"]')).toBeVisible();
            const newPage = yield context.newPage();
            yield newPage.goto('/home');
            yield (0, test_1.expect)(newPage.locator('role=heading[name="Welcome to Rocket.Chat"]')).toBeVisible();
        }));
    }));
    // TODO: Fix this test
    test_1.test.describe.skip('Setting on', () => __awaiter(void 0, void 0, void 0, function* () {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield api.post('/settings/Accounts_ForgetUserSessionOnWindowClose', { value: true });
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield api.post('/settings/Accounts_ForgetUserSessionOnWindowClose', { value: false });
        }));
        (0, test_1.test)('Login using credentials and reload to get logged out', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, context }) {
            yield poRegistration.username.type('user1');
            yield poRegistration.inputPassword.type(constants_1.DEFAULT_USER_CREDENTIALS.password);
            yield poRegistration.btnLogin.click();
            yield (0, test_1.expect)(page.locator('role=heading[name="Welcome to Rocket.Chat"]')).toBeVisible();
            const newPage = yield context.newPage();
            yield newPage.goto('/home');
            yield (0, test_1.expect)(newPage.locator('role=button[name="Login"]')).toBeVisible();
        }));
    }));
});
