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
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('sidebar-administration-menu', () => {
    let poHomeDiscussion;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeDiscussion = new page_objects_1.HomeDiscussion(page);
        yield page.goto('/home');
    }));
    test_1.test.describe('admin user', () => {
        (0, test_1.test)('should open workspace page', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            test_1.test.skip(!constants_1.IS_EE, 'Enterprise only');
            yield poHomeDiscussion.sidenav.openAdministrationByLabel('Workspace');
            yield (0, test_1.expect)(page).toHaveURL('admin/info');
        }));
        (0, test_1.test)('should open omnichannel page', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poHomeDiscussion.sidenav.openAdministrationByLabel('Omnichannel');
            yield (0, test_1.expect)(page).toHaveURL('omnichannel/current');
        }));
    });
    test_1.test.describe('regular user', () => {
        test_1.test.use({ storageState: userStates_1.Users.user1.state });
        (0, test_1.test)('expect to not render administration menu when no permission', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield (0, test_1.expect)(page.locator('role=button[name="Administration"]')).not.toBeVisible();
        }));
    });
});
