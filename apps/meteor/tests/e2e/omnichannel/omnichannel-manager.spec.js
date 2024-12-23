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
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const test_1 = require("../utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('omnichannel-manager', () => {
    let poOmnichannelManagers;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannelManagers = new page_objects_1.OmnichannelManager(page);
        yield page.goto('/omnichannel');
        yield poOmnichannelManagers.sidenav.linkManagers.click();
    }));
    (0, test_1.test)('OC - Manage Managers - Add, Search and Remove', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('expect "user1" be first ', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelManagers.inputUsername.fill('user');
            yield (0, test_1.expect)(page.locator('role=option[name="user1"]')).toContainText('user1');
        }));
        yield test_1.test.step('expect add "user1" as manager', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelManagers.selectUsername('user1');
            yield poOmnichannelManagers.btnAdd.click();
            yield (0, test_1.expect)(poOmnichannelManagers.findRowByName('user1')).toBeVisible();
        }));
        yield test_1.test.step('expect search for manager', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelManagers.search('user1');
            yield (0, test_1.expect)(poOmnichannelManagers.findRowByName('user1')).toBeVisible();
            yield poOmnichannelManagers.search('NonExistingUser');
            yield (0, test_1.expect)(poOmnichannelManagers.findRowByName('user1')).toBeHidden();
            yield poOmnichannelManagers.clearSearch();
        }));
        yield test_1.test.step('expect remove "user1" as manager', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelManagers.search('user1');
            yield poOmnichannelManagers.btnDeleteSelectedAgent('user1').click();
            yield poOmnichannelManagers.btnModalRemove.click();
            yield (0, test_1.expect)(poOmnichannelManagers.findRowByName('user1')).toBeHidden();
        }));
    }));
});
