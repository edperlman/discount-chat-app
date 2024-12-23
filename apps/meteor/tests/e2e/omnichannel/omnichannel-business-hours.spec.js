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
const businessHours_1 = require("../utils/omnichannel/businessHours");
const departments_1 = require("../utils/omnichannel/departments");
const test_1 = require("../utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe('OC - Business Hours', () => {
    test_1.test.skip(!constants_1.IS_EE, 'OC - Manage Business Hours > Enterprise Edition Only');
    let poOmnichannelBusinessHours;
    let department;
    let department2;
    let agent;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        department = yield (0, departments_1.createDepartment)(api);
        department2 = yield (0, departments_1.createDepartment)(api);
        agent = yield (0, agents_1.createAgent)(api, 'user2');
        yield api.post('/settings/Livechat_enable_business_hours', { value: true }).then((res) => (0, test_1.expect)(res.status()).toBe(200));
        yield api.post('/settings/Livechat_business_hour_type', { value: 'Multiple' }).then((res) => (0, test_1.expect)(res.status()).toBe(200));
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield department.delete();
        yield department2.delete();
        yield agent.delete();
        yield api.post('/settings/Livechat_enable_business_hours', { value: false }).then((res) => (0, test_1.expect)(res.status()).toBe(200));
        yield api.post('/settings/Livechat_business_hour_type', { value: 'Single' }).then((res) => (0, test_1.expect)(res.status()).toBe(200));
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannelBusinessHours = new page_objects_1.OmnichannelBusinessHours(page);
    }));
    (0, test_1.test)('OC - Manage Business Hours - Create Business Hours', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const BHName = faker_1.faker.string.uuid();
        yield page.goto('/omnichannel');
        yield poOmnichannelBusinessHours.sidenav.linkBusinessHours.click();
        yield test_1.test.step('expect correct form default state', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelBusinessHours.btnCreateBusinessHour.click();
            yield poOmnichannelBusinessHours.btnBack.click();
            yield (0, test_1.expect)(poOmnichannelBusinessHours.inputSearch).toBeVisible();
        }));
        yield test_1.test.step('expect to create a new business hours', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelBusinessHours.btnCreateBusinessHour.click();
            yield poOmnichannelBusinessHours.inputName.fill(BHName);
            yield poOmnichannelBusinessHours.selectDepartment(department.data);
            yield poOmnichannelBusinessHours.btnSave.click();
            yield test_1.test.step('expect business hours to have been created', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelBusinessHours.search(BHName);
                yield (0, test_1.expect)(poOmnichannelBusinessHours.findRowByName(BHName)).toBeVisible();
            }));
        }));
        yield test_1.test.step('expect to be able to delete business hours', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('expect to be able to cancel delete', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelBusinessHours.btnDeleteByName(BHName).click();
                yield (0, test_1.expect)(poOmnichannelBusinessHours.confirmDeleteModal).toBeVisible();
                yield poOmnichannelBusinessHours.btnCancelDeleteModal.click();
                yield (0, test_1.expect)(poOmnichannelBusinessHours.confirmDeleteModal).not.toBeVisible();
            }));
            yield test_1.test.step('expect to confirm delete', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelBusinessHours.btnDeleteByName(BHName).click();
                yield (0, test_1.expect)(poOmnichannelBusinessHours.confirmDeleteModal).toBeVisible();
                yield poOmnichannelBusinessHours.btnConfirmDeleteModal.click();
                yield (0, test_1.expect)(poOmnichannelBusinessHours.confirmDeleteModal).not.toBeVisible();
            }));
        }));
        yield test_1.test.step('expect business hours to have been deleted', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelBusinessHours.search(BHName);
            yield (0, test_1.expect)(poOmnichannelBusinessHours.findRowByName(BHName)).not.toBeVisible();
        }));
    }));
    (0, test_1.test)('OC - Business hours - Edit BH departments', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api, page }) {
        const BHName = faker_1.faker.string.uuid();
        yield test_1.test.step('expect to create new businessHours', () => __awaiter(void 0, void 0, void 0, function* () {
            const createBH = yield (0, businessHours_1.createBusinessHour)(api, {
                id: '33',
                name: BHName,
                departments: [department.data._id],
            });
            (0, test_1.expect)(createBH.status()).toBe(200);
        }));
        yield page.goto('/omnichannel');
        yield poOmnichannelBusinessHours.sidenav.linkBusinessHours.click();
        yield test_1.test.step('expect to add business hours departments', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelBusinessHours.search(BHName);
            yield poOmnichannelBusinessHours.findRowByName(BHName).click();
            yield poOmnichannelBusinessHours.selectDepartment({ name: department2.data.name, _id: department2.data._id });
            yield poOmnichannelBusinessHours.btnSave.click();
        }));
        yield test_1.test.step('expect department to be in the chosen departments list', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelBusinessHours.search(BHName);
            yield poOmnichannelBusinessHours.findRowByName(BHName).click();
            yield (0, test_1.expect)(page.getByRole('option', { name: department2.data.name })).toBeVisible();
            yield poOmnichannelBusinessHours.btnBack.click();
        }));
        yield test_1.test.step('expect to remove business hours departments', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelBusinessHours.search(BHName);
            yield poOmnichannelBusinessHours.findRowByName(BHName).click();
            yield poOmnichannelBusinessHours.selectDepartment({ name: department2.data.name, _id: department2.data._id });
            yield poOmnichannelBusinessHours.btnSave.click();
        }));
        yield test_1.test.step('expect department to not be in the chosen departments list', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelBusinessHours.search(BHName);
            yield poOmnichannelBusinessHours.findRowByName(BHName).click();
            yield (0, test_1.expect)(page.getByRole('option', { name: department2.data.name })).toBeHidden();
            yield poOmnichannelBusinessHours.btnBack.click();
        }));
        yield test_1.test.step('expect delete business hours', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelBusinessHours.btnDeleteByName(BHName).click();
            yield (0, test_1.expect)(poOmnichannelBusinessHours.confirmDeleteModal).toBeVisible();
            yield poOmnichannelBusinessHours.btnConfirmDeleteModal.click();
            yield (0, test_1.expect)(poOmnichannelBusinessHours.confirmDeleteModal).not.toBeVisible();
        }));
    }));
});
