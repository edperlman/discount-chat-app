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
const constants_1 = require("../config/constants");
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const agents_1 = require("../utils/omnichannel/agents");
const departments_1 = require("../utils/omnichannel/departments");
const monitors_1 = require("../utils/omnichannel/monitors");
const units_1 = require("../utils/omnichannel/units");
const test_1 = require("../utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe('OC - Manage Units', () => {
    test_1.test.skip(!constants_1.IS_EE, 'OC - Manage Units > Enterprise Edition Only');
    let poOmnichannelUnits;
    let department;
    let department2;
    let agent;
    let monitor;
    let monitor2;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        department = yield (0, departments_1.createDepartment)(api);
        department2 = yield (0, departments_1.createDepartment)(api);
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        agent = yield (0, agents_1.createAgent)(api, 'user2');
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        monitor = yield (0, monitors_1.createMonitor)(api, 'user2');
        monitor2 = yield (0, monitors_1.createMonitor)(api, 'user3');
    }));
    test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield department.delete();
        yield department2.delete();
        yield monitor.delete();
        yield monitor2.delete();
        yield agent.delete();
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannelUnits = new page_objects_1.OmnichannelUnits(page);
        yield page.goto('/omnichannel');
        yield poOmnichannelUnits.sidenav.linkUnits.click();
    }));
    (0, test_1.test)('OC - Manage Units - Create Unit', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const unitName = faker_1.faker.string.uuid();
        yield test_1.test.step('expect correct form default state', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelUnits.btnCreateUnit.click();
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).toBeVisible();
            yield (0, test_1.expect)(poOmnichannelUnits.btnSave).toBeDisabled();
            yield (0, test_1.expect)(poOmnichannelUnits.btnCancel).toBeEnabled();
            yield poOmnichannelUnits.btnCancel.click();
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).not.toBeVisible();
        }));
        yield test_1.test.step('expect to create new unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelUnits.btnCreateUnit.click();
            yield poOmnichannelUnits.inputName.fill(unitName);
            yield poOmnichannelUnits.selectVisibility('public');
            yield poOmnichannelUnits.selectDepartment(department.data);
            yield poOmnichannelUnits.selectMonitor('user2');
            yield poOmnichannelUnits.btnSave.click();
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).not.toBeVisible();
            yield poOmnichannelUnits.search(unitName);
            yield (0, test_1.expect)(poOmnichannelUnits.findRowByName(unitName)).toBeVisible();
        }));
        yield test_1.test.step('expect to delete unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelUnits.btnDeleteByName(unitName).click();
            yield (0, test_1.expect)(poOmnichannelUnits.confirmDeleteModal).toBeVisible();
            yield poOmnichannelUnits.btnConfirmDeleteModal.click();
            yield (0, test_1.expect)(poOmnichannelUnits.confirmDeleteModal).not.toBeVisible();
            yield (0, test_1.expect)(page.locator('h3 >> text="No units yet"')).toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Manage Units - Edit unit name', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api, page }) {
        const unitName = faker_1.faker.string.uuid();
        const editedUnitName = faker_1.faker.string.uuid();
        const unit = yield test_1.test.step('expect to create new unit', () => __awaiter(void 0, void 0, void 0, function* () {
            const { data: newUnit } = yield (0, units_1.createOrUpdateUnit)(api, {
                name: unitName,
                visibility: 'public',
                monitors: [{ monitorId: monitor.data._id, username: 'user2' }],
                departments: [{ departmentId: department.data._id }],
            });
            return newUnit;
        }));
        yield page.goto('/omnichannel');
        yield poOmnichannelUnits.sidenav.linkUnits.click();
        yield test_1.test.step('expect to edit unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelUnits.search(unit.name);
            yield poOmnichannelUnits.findRowByName(unit.name).click();
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).toBeVisible();
            yield poOmnichannelUnits.inputName.fill(editedUnitName);
            yield poOmnichannelUnits.btnSave.click();
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).not.toBeVisible();
            yield (0, test_1.expect)(poOmnichannelUnits.inputSearch).toBeVisible();
            yield poOmnichannelUnits.search(editedUnitName);
            yield (0, test_1.expect)(poOmnichannelUnits.findRowByName(editedUnitName)).toBeVisible();
        }));
        yield test_1.test.step('expect to add another monitor to list', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelUnits.findRowByName(editedUnitName).click();
            yield poOmnichannelUnits.selectMonitor('user3');
            yield poOmnichannelUnits.btnSave.click();
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).not.toBeVisible();
            yield poOmnichannelUnits.search(editedUnitName);
            yield poOmnichannelUnits.findRowByName(editedUnitName).click();
            yield (0, test_1.expect)(poOmnichannelUnits.inputMonitors).toHaveText(/user2/);
            yield (0, test_1.expect)(poOmnichannelUnits.inputMonitors).toHaveText(/user3/);
        }));
        yield test_1.test.step('expect unit to remove one of the two monitors', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelUnits.search(editedUnitName);
            yield poOmnichannelUnits.findRowByName(editedUnitName).click();
            yield poOmnichannelUnits.selectMonitor('user2');
            yield poOmnichannelUnits.btnSave.click();
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).not.toBeVisible();
            yield poOmnichannelUnits.search(editedUnitName);
            yield poOmnichannelUnits.findRowByName(editedUnitName).click();
            yield (0, test_1.expect)(poOmnichannelUnits.inputMonitors).toHaveText(/user3/);
            yield (0, test_1.expect)(poOmnichannelUnits.inputMonitors).not.toHaveText(/user2/);
        }));
        yield test_1.test.step('expect to delete unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelUnits.findRowByName(editedUnitName).click();
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).toBeVisible();
            yield test_1.test.step('expect to confirm delete', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelUnits.btnDelete.click();
                yield (0, test_1.expect)(poOmnichannelUnits.confirmDeleteModal).toBeVisible();
                yield poOmnichannelUnits.btnConfirmDeleteModal.click();
                yield (0, test_1.expect)(poOmnichannelUnits.confirmDeleteModal).not.toBeVisible();
            }));
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).not.toBeVisible();
            yield (0, test_1.expect)(poOmnichannelUnits.findRowByName(editedUnitName)).not.toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Manage Units - Edit unit departments', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api, page }) {
        const unit = yield test_1.test.step('expect to create new unit', () => __awaiter(void 0, void 0, void 0, function* () {
            const { data: unit } = yield (0, units_1.createOrUpdateUnit)(api, {
                name: faker_1.faker.string.uuid(),
                visibility: 'public',
                monitors: [{ monitorId: monitor.data._id, username: 'user2' }],
                departments: [{ departmentId: department.data._id }],
            });
            return unit;
        }));
        yield page.reload();
        yield test_1.test.step('expect to add unit departments', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelUnits.search(unit.name);
            yield poOmnichannelUnits.findRowByName(unit.name).click();
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).toBeVisible();
            yield poOmnichannelUnits.selectDepartment({ name: department2.data.name, _id: department2.data._id });
            yield poOmnichannelUnits.btnSave.click();
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).not.toBeVisible();
            yield poOmnichannelUnits.search(unit.name);
            yield poOmnichannelUnits.findRowByName(unit.name).click();
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).toBeVisible();
            yield (0, test_1.expect)(poOmnichannelUnits.selectOptionChip(department2.data.name)).toBeVisible();
            yield poOmnichannelUnits.selectOptionChip(department2.data.name).hover();
            yield (0, test_1.expect)(page.getByRole('tooltip', { name: department2.data.name })).toBeVisible();
            yield poOmnichannelUnits.btnContextualbarClose.click();
        }));
        yield test_1.test.step('expect to remove unit departments', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelUnits.search(unit.name);
            yield poOmnichannelUnits.findRowByName(unit.name).click();
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).toBeVisible();
            yield poOmnichannelUnits.selectDepartment({ name: department2.data.name, _id: department2.data._id });
            yield poOmnichannelUnits.btnSave.click();
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).not.toBeVisible();
            yield poOmnichannelUnits.search(unit.name);
            yield poOmnichannelUnits.findRowByName(unit.name).click();
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).toBeVisible();
            yield (0, test_1.expect)(page.getByRole('option', { name: department2.data.name })).toBeHidden();
            yield poOmnichannelUnits.btnContextualbarClose.click();
        }));
        yield test_1.test.step('expect to delete unit', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelUnits.findRowByName(unit.name).click();
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).toBeVisible();
            yield test_1.test.step('expect to confirm delete', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelUnits.btnDelete.click();
                yield (0, test_1.expect)(poOmnichannelUnits.confirmDeleteModal).toBeVisible();
                yield poOmnichannelUnits.btnConfirmDeleteModal.click();
                yield (0, test_1.expect)(poOmnichannelUnits.confirmDeleteModal).not.toBeVisible();
            }));
            yield (0, test_1.expect)(poOmnichannelUnits.contextualBar).not.toBeVisible();
            yield (0, test_1.expect)(poOmnichannelUnits.findRowByName(unit.name)).not.toBeVisible();
        }));
    }));
});
