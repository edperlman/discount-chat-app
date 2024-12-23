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
const test_1 = require("./utils/test");
test_1.test.describe.parallel('register', () => {
    let poRegistration;
    let poUtils;
    test_1.test.describe('Registration default flow', () => __awaiter(void 0, void 0, void 0, function* () {
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            poRegistration = new page_objects_1.Registration(page);
            poUtils = new page_objects_1.Utils(page);
        }));
        (0, test_1.test)('Successfully Registration flow', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield test_1.test.step('expect trigger a validation error if no data is provided on register', () => __awaiter(void 0, void 0, void 0, function* () {
                yield page.goto('/home');
                yield poRegistration.goToRegister.click();
                yield poRegistration.btnRegister.click();
                yield (0, test_1.expect)(poRegistration.inputName).toBeInvalid();
                yield (0, test_1.expect)(poRegistration.inputEmail).toBeInvalid();
                yield (0, test_1.expect)(poRegistration.inputPassword).toBeInvalid();
                yield (0, test_1.expect)(poRegistration.username).toBeInvalid();
            }));
            yield test_1.test.step('expect trigger a validation error if different password is provided on register', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poRegistration.inputName.fill(faker_1.faker.person.firstName());
                yield poRegistration.inputEmail.fill(faker_1.faker.internet.email());
                yield poRegistration.username.fill(faker_1.faker.internet.userName());
                yield poRegistration.inputPassword.fill('any_password');
                yield poRegistration.inputPasswordConfirm.fill('any_password_2');
                yield poRegistration.btnRegister.click();
                yield (0, test_1.expect)(poRegistration.inputPasswordConfirm).toBeInvalid();
            }));
            yield test_1.test.step('expect successfully register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poRegistration.inputPasswordConfirm.fill('any_password');
                yield poRegistration.btnRegister.click();
                yield (0, test_1.expect)(poUtils.mainContent).toBeVisible();
            }));
        }));
        test_1.test.describe('Registration without Account confirmation password set', () => __awaiter(void 0, void 0, void 0, function* () {
            test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                const result = yield api.post('/settings/Accounts_RequirePasswordConfirmation', { value: false });
                yield (0, test_1.expect)(result.ok()).toBeTruthy();
            }));
            test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto('/home');
                yield poRegistration.goToRegister.click();
            }));
            test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                const result = yield api.post('/settings/Accounts_RequirePasswordConfirmation', {
                    value: true,
                });
                yield (0, test_1.expect)(result.ok()).toBeTruthy();
            }));
            (0, test_1.test)('expect to register a user without password confirmation', () => __awaiter(void 0, void 0, void 0, function* () {
                yield test_1.test.step('expect to not have password confirmation field', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(poRegistration.inputPasswordConfirm).toBeHidden();
                }));
                yield test_1.test.step('expect to found no errors after submit the form', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poRegistration.inputName.fill(faker_1.faker.person.firstName());
                    yield poRegistration.inputEmail.fill(faker_1.faker.internet.email());
                    yield poRegistration.username.fill(faker_1.faker.internet.userName());
                    yield poRegistration.inputPassword.fill('any_password');
                    yield poRegistration.btnRegister.click();
                    yield (0, test_1.expect)(poUtils.mainContent).toBeVisible();
                }));
            }));
        }));
        test_1.test.describe('Registration with manually confirmation enabled', () => __awaiter(void 0, void 0, void 0, function* () {
            test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                const result = yield api.post('/settings/Accounts_ManuallyApproveNewUsers', { value: true });
                yield (0, test_1.expect)(result.ok()).toBeTruthy();
            }));
            test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                poRegistration = new page_objects_1.Registration(page);
                yield page.goto('/home');
                yield poRegistration.goToRegister.click();
            }));
            test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                const result = yield api.post('/settings/Accounts_ManuallyApproveNewUsers', {
                    value: false,
                });
                yield (0, test_1.expect)(result.ok()).toBeTruthy();
            }));
            (0, test_1.test)('it should expect to have a textbox asking the reason for the registration', () => __awaiter(void 0, void 0, void 0, function* () {
                yield test_1.test.step('expect to have a textbox asking the reason for the registration', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(poRegistration.inputReason).toBeVisible();
                }));
                yield test_1.test.step('expect to show and error if no reason is provided', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poRegistration.btnRegister.click();
                    yield (0, test_1.expect)(poRegistration.inputReason).toBeInvalid();
                }));
            }));
        }));
        test_1.test.describe('Registration form Disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                const result = yield api.post('/settings/Accounts_RegistrationForm', { value: 'Disabled' });
                yield (0, test_1.expect)(result.ok()).toBeTruthy();
            }));
            test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
                yield api.post('/settings/Accounts_RegistrationForm', { value: 'Public' });
            }));
            (0, test_1.test)('It should expect a message warning that registration is disabled', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto('/home');
                yield poRegistration.goToRegister.click();
                yield (0, test_1.expect)(poRegistration.registrationDisabledCallout).toBeVisible();
            }));
        }));
        (0, test_1.test)('should not have any accessibility violations', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, makeAxeBuilder }) {
            yield page.goto('/home');
            yield poRegistration.goToRegister.click();
            const results = yield makeAxeBuilder().analyze();
            (0, test_1.expect)(results.violations).toEqual([]);
        }));
    }));
    test_1.test.describe('Registration for secret password', () => __awaiter(void 0, void 0, void 0, function* () {
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api, page }) {
            poRegistration = new page_objects_1.Registration(page);
            poUtils = new page_objects_1.Utils(page);
            const result = yield api.post('/settings/Accounts_RegistrationForm', { value: 'Secret URL' });
            yield api.post('/settings/Accounts_RegistrationForm_SecretURL', { value: 'secret' });
            yield (0, test_1.expect)(result.ok()).toBeTruthy();
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const result = yield api.post('/settings/Accounts_RegistrationForm', { value: 'Public' });
            yield (0, test_1.expect)(result.ok()).toBeTruthy();
        }));
        (0, test_1.test)('It should expect a message warning that registration is disabled', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/home');
            yield poRegistration.goToRegister.click();
            yield (0, test_1.expect)(poRegistration.registrationDisabledCallout).toBeVisible();
        }));
        test_1.test.describe('Using an invalid secret password', () => __awaiter(void 0, void 0, void 0, function* () {
            test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield page.goto('/register/invalid_secret');
            }));
            (0, test_1.test)('It should expect a invalid page informing that the secret password is invalid', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
                yield (0, test_1.expect)(page.locator('role=heading[level=2][name="The URL provided is invalid."]')).toBeVisible({
                    timeout: 10000,
                });
            }));
        }));
        (0, test_1.test)('It should register a user if the right secret password is provided', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/register/secret');
            yield page.waitForSelector('role=form');
            yield poRegistration.inputName.fill(faker_1.faker.person.firstName());
            yield poRegistration.inputEmail.fill(faker_1.faker.internet.email());
            yield poRegistration.username.fill(faker_1.faker.internet.userName());
            yield poRegistration.inputPassword.fill('any_password');
            yield poRegistration.inputPasswordConfirm.fill('any_password');
            yield poRegistration.btnRegister.click();
            yield (0, test_1.expect)(poUtils.mainContent).toBeVisible();
        }));
    }));
    test_1.test.describe('Registration by Secret is disabled url should fail', () => __awaiter(void 0, void 0, void 0, function* () {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const result = yield api.post('/settings/Accounts_RegistrationForm', { value: 'Public' });
            yield api.post('/settings/Accounts_RegistrationForm_SecretURL', { value: 'secret' });
            yield (0, test_1.expect)(result.ok()).toBeTruthy();
        }));
        (0, test_1.test)('It should show an invalid page informing that the url is not valid', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/register/secret');
            yield page.waitForSelector('role=heading[level=2]');
            yield (0, test_1.expect)(page.locator('role=heading[level=2][name="The URL provided is invalid."]')).toBeVisible();
        }));
    }));
});
