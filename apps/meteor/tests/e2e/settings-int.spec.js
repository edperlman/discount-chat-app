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
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('settings-int', () => {
    let poAdmin;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poAdmin = new page_objects_1.Admin(page);
        yield page.goto('/admin/settings/Message');
        yield (0, test_1.expect)(page.locator('[data-qa-type="PageHeader-title"]')).toHaveText('Message');
    }));
    (0, test_1.test)('expect not being able to set int value as empty string', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.locator('#Message_AllowEditing_BlockEditInMinutes').fill('');
        yield page.locator('#Message_AllowEditing_BlockEditInMinutes').blur();
        yield poAdmin.btnSaveSettings.click();
        yield (0, test_1.expect)(page.locator('.rcx-toastbar.rcx-toastbar--error')).toBeVisible();
    }));
});
