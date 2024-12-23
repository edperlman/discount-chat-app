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
const test_1 = require("./utils/test");
test_1.test.describe.parallel('Forgot Password', () => {
    let poRegistration;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poRegistration = new page_objects_1.Registration(page);
        yield page.goto('/home');
        yield poRegistration.btnForgotPassword.click();
    }));
    (0, test_1.test)('Send email to recover account', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('expect trigger a validation error if no email is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poRegistration.btnSendInstructions.click();
            yield (0, test_1.expect)(poRegistration.inputEmail).toBeInvalid();
        }));
        yield test_1.test.step('expect trigger a validation if a invalid email is provided (1)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poRegistration.inputEmail.fill('mail@mail');
            yield poRegistration.btnSendInstructions.click();
            yield (0, test_1.expect)(poRegistration.inputEmail).toBeInvalid();
        }));
        yield test_1.test.step('expect trigger a validation if a invalid email is provided (2)', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poRegistration.inputEmail.fill('mail');
            yield poRegistration.btnSendInstructions.click();
            yield (0, test_1.expect)(poRegistration.inputEmail).toBeInvalid();
        }));
        yield test_1.test.step('expect to show a success callout if a valid email is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poRegistration.inputEmail.fill('mail@mail.com');
            yield poRegistration.btnSendInstructions.click();
            yield (0, test_1.expect)(poRegistration.forgotPasswordEmailCallout).toBeVisible();
        }));
    }));
    (0, test_1.test)('should not have any accessibility violations', (_a) => __awaiter(void 0, [_a], void 0, function* ({ makeAxeBuilder }) {
        const results = yield makeAxeBuilder().analyze();
        (0, test_1.expect)(results.violations).toEqual([]);
    }));
});
