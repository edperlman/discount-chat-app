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
const constants_1 = require("../config/constants");
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const test_1 = require("../utils/test");
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.skip(!constants_1.IS_EE, 'OC - Manage Monitors > Enterprise Only');
test_1.test.describe.serial('OC - Manage Monitors', () => {
    let poMonitors;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield Promise.all([
            api.post('/livechat/users/agent', { username: 'user1' }),
            api.post('/livechat/users/agent', { username: 'user2' }),
            api.post('/livechat/users/manager', { username: 'user1' }),
        ]);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield Promise.all([
            api.delete('/livechat/users/agent/user1'),
            api.delete('/livechat/users/manager/user1'),
            api.delete('/livechat/users/agent/user2'),
            api.delete('/livechat/users/manager/user2'),
        ]);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poMonitors = new page_objects_1.OmnichannelMonitors(page);
        yield page.goto('/omnichannel');
        yield page.locator('.main-content').waitFor();
        yield poMonitors.sidenav.linkMonitors.click();
    }));
    (0, test_1.test)('OC - Manager Monitors - Add monitor', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('expect to add agent as monitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poMonitors.findRowByName('user1')).not.toBeVisible();
            yield poMonitors.selectMonitor('user1');
            yield poMonitors.btnAddMonitor.click();
            yield (0, test_1.expect)(poMonitors.findRowByName('user1')).toBeVisible();
        }));
        yield test_1.test.step('expect to remove agent from monitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poMonitors.btnRemoveByName('user1').click();
            yield (0, test_1.expect)(poMonitors.modalConfirmRemove).toBeVisible();
            yield poMonitors.btnConfirmRemove.click();
            yield (0, test_1.expect)(poMonitors.findRowByName('user1')).not.toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Manager Monitors - Search', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('expect to add 2 monitors', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poMonitors.selectMonitor('user1');
            yield poMonitors.btnAddMonitor.click();
            yield (0, test_1.expect)(poMonitors.findRowByName('user1')).toBeVisible();
            yield poMonitors.selectMonitor('user2');
            yield poMonitors.btnAddMonitor.click();
            yield (0, test_1.expect)(poMonitors.findRowByName('user2')).toBeVisible();
        }));
        yield test_1.test.step('expect to search monitor', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poMonitors.findRowByName('user1')).toBeVisible();
            yield (0, test_1.expect)(poMonitors.findRowByName('user2')).toBeVisible();
            yield poMonitors.inputSearch.fill('user1');
            yield (0, test_1.expect)(poMonitors.findRowByName('user1')).toBeVisible();
            yield (0, test_1.expect)(poMonitors.findRowByName('user2')).not.toBeVisible();
            yield poMonitors.inputSearch.fill('user2');
            yield (0, test_1.expect)(poMonitors.findRowByName('user1')).not.toBeVisible();
            yield (0, test_1.expect)(poMonitors.findRowByName('user2')).toBeVisible();
            yield poMonitors.inputSearch.fill('');
            yield (0, test_1.expect)(poMonitors.findRowByName('user1')).toBeVisible();
            yield (0, test_1.expect)(poMonitors.findRowByName('user2')).toBeVisible();
        }));
        yield test_1.test.step('expect to remove monitors', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poMonitors.btnRemoveByName('user1').click();
            yield (0, test_1.expect)(poMonitors.modalConfirmRemove).toBeVisible();
            yield poMonitors.btnConfirmRemove.click();
            yield (0, test_1.expect)(poMonitors.findRowByName('user1')).not.toBeVisible();
            yield poMonitors.btnRemoveByName('user2').click();
            yield (0, test_1.expect)(poMonitors.modalConfirmRemove).toBeVisible();
            yield poMonitors.btnConfirmRemove.click();
            yield (0, test_1.expect)(poMonitors.findRowByName('user2')).not.toBeVisible();
        }));
    }));
});
