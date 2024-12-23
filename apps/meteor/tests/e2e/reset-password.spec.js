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
test_1.test.describe.parallel('Reset Password', () => {
    let poRegistration;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api, page }) {
        poRegistration = new page_objects_1.Registration(page);
        yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_RequirePasswordConfirmation', true);
        yield page.goto('/reset-password/someToken');
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_RequirePasswordConfirmation', true);
    }));
    (0, test_1.test)('should confirm password be invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poRegistration.inputPassword.fill('123456');
        yield poRegistration.inputPasswordConfirm.fill('123455');
        yield poRegistration.btnReset.click();
        yield (0, test_1.expect)(poRegistration.inputPasswordConfirm).toBeInvalid();
    }));
    (0, test_1.test)('should confirm password not be visible', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_RequirePasswordConfirmation', false);
        yield (0, test_1.expect)(poRegistration.inputPasswordConfirm).not.toBeVisible();
    }));
    (0, test_1.test)('should not have any accessibility violations', (_a) => __awaiter(void 0, [_a], void 0, function* ({ makeAxeBuilder }) {
        const results = yield makeAxeBuilder().analyze();
        (0, test_1.expect)(results.violations).toEqual([]);
    }));
});
