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
const page_objects_1 = require("./page-objects");
const setSettingValueById_1 = require("./utils/setSettingValueById");
const test_1 = require("./utils/test");
test_1.test.describe('anonymous-user', () => {
    let poHomeChannel;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_AllowAnonymousRead', true)).status()).toBe(200);
        yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_AllowAnonymousWrite', true)).status()).toBe(200);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_AllowAnonymousRead', false)).status()).toBe(200);
        yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_AllowAnonymousWrite', false)).status()).toBe(200);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
        yield poHomeChannel.sidenav.openChat('general');
    }));
    (0, test_1.test)('expect to go to the login page as anonymous user', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.content.btnAnonymousSignIn.click();
        yield (0, test_1.expect)(page.locator('role=form')).toBeVisible();
    }));
    (0, test_1.test)('expect to chat as anonymous user', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        const poRegistration = new page_objects_1.Registration(page);
        yield poHomeChannel.content.btnAnonymousTalk.click();
        yield (0, test_1.expect)(poRegistration.username).toBeVisible();
        yield poRegistration.username.type(faker_1.faker.internet.userName());
        yield poRegistration.btnRegisterConfirmUsername.click();
        yield poHomeChannel.content.sendMessage('hello world');
    }));
});
