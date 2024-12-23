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
const constants_1 = require("./config/constants");
const page_objects_1 = require("./page-objects");
const test_1 = require("./utils/test");
test_1.test.describe.parallel('Login', () => {
    let poRegistration;
    let poUtils;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poRegistration = new page_objects_1.Registration(page);
        poUtils = new page_objects_1.Utils(page);
        yield page.goto('/home');
    }));
    (0, test_1.test)('should not have any accessibility violations', (_a) => __awaiter(void 0, [_a], void 0, function* ({ makeAxeBuilder }) {
        const results = yield makeAxeBuilder().analyze();
        (0, test_1.expect)(results.violations).toEqual([]);
    }));
    (0, test_1.test)('Login with invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('expect to have username and password marked as invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poRegistration.username.type(faker_1.faker.internet.email());
            yield poRegistration.inputPassword.type('any_password');
            yield poRegistration.btnLogin.click();
            yield (0, test_1.expect)(poRegistration.username).toBeInvalid();
            yield (0, test_1.expect)(poRegistration.inputPassword).toBeInvalid();
        }));
    }));
    (0, test_1.test)('Login with valid username and password', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('expect successful login', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poRegistration.username.type('user1');
            yield poRegistration.inputPassword.type(constants_1.DEFAULT_USER_CREDENTIALS.password);
            yield poRegistration.btnLogin.click();
            yield (0, test_1.expect)(poUtils.mainContent).toBeVisible();
        }));
    }));
    (0, test_1.test)('Login with valid email and password', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('expect successful login', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poRegistration.username.type('user1@email.com');
            yield poRegistration.inputPassword.type(constants_1.DEFAULT_USER_CREDENTIALS.password);
            yield poRegistration.btnLogin.click();
            yield (0, test_1.expect)(poUtils.mainContent).toBeVisible();
        }));
    }));
});
