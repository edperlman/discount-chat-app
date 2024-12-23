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
const departments_1 = require("../utils/omnichannel/departments");
const test_1 = require("../utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('OC - Manage Agents', () => {
    let poOmnichannelAgents;
    let department;
    // Create agent and department
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        department = yield (0, departments_1.createDepartment)(api);
    }));
    // Create page object and redirect to home
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannelAgents = new page_objects_1.OmnichannelAgents(page);
        yield page.goto('/omnichannel');
        yield poOmnichannelAgents.sidenav.linkAgents.click();
    }));
    // Ensure that there is no leftover data even if test fails
    test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.delete('/livechat/users/agent/user1');
        yield api.post('/settings/Omnichannel_enable_department_removal', { value: true }).then((res) => (0, test_1.expect)(res.status()).toBe(200));
        yield department.delete();
        yield api.post('/settings/Omnichannel_enable_department_removal', { value: false }).then((res) => (0, test_1.expect)(res.status()).toBe(200));
    }));
    (0, test_1.test)('OC - Manage Agents - Add, search and remove using table', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('expect "user1" be first ', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelAgents.inputUsername.type('user');
            yield (0, test_1.expect)(page.locator('role=option[name="user1"]')).toContainText('user1');
            yield poOmnichannelAgents.inputUsername.fill('');
        }));
        yield test_1.test.step('expect add "user1" as agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelAgents.selectUsername('user1');
            yield poOmnichannelAgents.btnAdd.click();
            yield poOmnichannelAgents.inputSearch.fill('user1');
            yield (0, test_1.expect)(poOmnichannelAgents.firstRowInTable).toBeVisible();
            yield (0, test_1.expect)(poOmnichannelAgents.firstRowInTable).toHaveText('user1');
        }));
        yield test_1.test.step('expect remove "user1" as agent', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelAgents.inputSearch.fill('user1');
            yield poOmnichannelAgents.btnDeleteFirstRowInTable.click();
            yield poOmnichannelAgents.btnModalRemove.click();
            yield poOmnichannelAgents.inputSearch.fill('user1');
            yield (0, test_1.expect)(poOmnichannelAgents.findRowByUsername('user1')).not.toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Manage Agents [CE]- Edit and Remove', () => __awaiter(void 0, void 0, void 0, function* () {
        test_1.test.skip(constants_1.IS_EE, 'Community Edition Only');
        yield poOmnichannelAgents.selectUsername('user1');
        yield poOmnichannelAgents.btnAdd.click();
        yield poOmnichannelAgents.inputSearch.fill('user1');
        yield poOmnichannelAgents.firstRowInTable.click();
        yield poOmnichannelAgents.btnEdit.click();
        yield test_1.test.step('expect max chats fields to be hidden', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannelAgents.inputMaxChats).toBeHidden();
        }));
        yield test_1.test.step('expect update "user1" information', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelAgents.selectStatus('Not available');
            yield poOmnichannelAgents.selectDepartment(department.data.name);
            yield poOmnichannelAgents.btnSave.click();
        }));
        yield test_1.test.step('expect removing "user1" via sidebar', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelAgents.inputSearch.fill('user1');
            yield poOmnichannelAgents.firstRowInTable.click();
            yield poOmnichannelAgents.btnRemove.click();
        }));
    }));
    (0, test_1.test)('OC - Manage Agents [EE] - Edit ', () => __awaiter(void 0, void 0, void 0, function* () {
        test_1.test.skip(!constants_1.IS_EE, 'Enterprise Only');
        yield poOmnichannelAgents.selectUsername('user1');
        yield poOmnichannelAgents.btnAdd.click();
        yield poOmnichannelAgents.inputSearch.fill('user1');
        yield poOmnichannelAgents.findRowByUsername('user1').click();
        yield poOmnichannelAgents.btnEdit.click();
        yield test_1.test.step('expect max chats field to be visible', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannelAgents.inputMaxChats).toBeVisible();
        }));
        yield test_1.test.step('expect update "user1" information', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelAgents.inputMaxChats.click();
            yield poOmnichannelAgents.inputMaxChats.fill('2');
            yield poOmnichannelAgents.btnSave.click();
        }));
    }));
    (0, test_1.test)('OC - Edit agent  - Manage departments', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poOmnichannelAgents.selectUsername('user1');
        yield poOmnichannelAgents.btnAdd.click();
        yield poOmnichannelAgents.inputSearch.fill('user1');
        yield poOmnichannelAgents.findRowByUsername('user1').click();
        yield poOmnichannelAgents.btnEdit.click();
        yield poOmnichannelAgents.selectDepartment(department.data.name);
        yield poOmnichannelAgents.btnSave.click();
        yield test_1.test.step('expect the selected department is visible', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelAgents.findRowByUsername('user1').click();
            // mock the endpoint to use the one without pagination
            yield page.route('/api/v1/livechat/department?showArchived=true', (route) => __awaiter(void 0, void 0, void 0, function* () {
                yield route.fulfill({ json: { departments: [] } });
            }));
            yield poOmnichannelAgents.btnEdit.click();
            yield (0, test_1.expect)(poOmnichannelAgents.findSelectedDepartment(department.data.name)).toBeVisible();
        }));
    }));
});
