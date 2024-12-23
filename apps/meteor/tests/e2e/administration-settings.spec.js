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
const utils_1 = require("./utils");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.parallel('administration-settings', () => {
    let poAdmin;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poAdmin = new page_objects_1.Admin(page);
    }));
    test_1.test.describe('General', () => {
        let inputSiteURLSetting;
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            inputSiteURLSetting = (yield (0, utils_1.getSettingValueById)(api, 'Site_Url'));
        }));
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/admin/settings/General');
        }));
        (0, test_1.test)('should be able to reset a setting after a change', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poAdmin.inputSiteURL.fill('any_text');
            yield poAdmin.btnResetSiteURL.click();
            yield (0, test_1.expect)(poAdmin.inputSiteURL).toHaveValue(inputSiteURLSetting);
        }));
        (0, test_1.test)('should be able to go back to the settings page', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poAdmin.btnBack.click();
            yield (0, test_1.expect)(page).toHaveURL('/admin/settings');
        }));
    });
    test_1.test.describe('Layout', () => {
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/admin/settings/Layout');
        }));
        (0, test_1.test)('should code mirror full screen be displayed correctly', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poAdmin.getAccordionBtnByName('Custom CSS').click();
            yield poAdmin.btnFullScreen.click();
            yield (0, test_1.expect)(page.getByRole('code')).toHaveCSS('width', '920px');
        }));
    });
});
