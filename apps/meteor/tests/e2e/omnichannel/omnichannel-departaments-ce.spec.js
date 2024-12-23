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
const test_1 = require("../utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('OC - Manage Departments (CE)', () => {
    test_1.test.skip(constants_1.IS_EE, 'Community Edition Only');
    let poOmnichannelDepartments;
    let departmentName;
    test_1.test.beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        departmentName = faker_1.faker.string.uuid();
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannelDepartments = new page_objects_1.OmnichannelDepartments(page);
        yield page.goto('/omnichannel');
        yield poOmnichannelDepartments.sidenav.linkDepartments.click();
    }));
    (0, test_1.test)('OC - Manage Departments (CE) - Create department', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('expect create new department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelDepartments.headingButtonNew('Create department').click();
            yield poOmnichannelDepartments.btnEnabled.click();
            yield poOmnichannelDepartments.inputName.fill(departmentName);
            yield poOmnichannelDepartments.inputEmail.fill(faker_1.faker.internet.email());
            yield poOmnichannelDepartments.btnSave.click();
            yield poOmnichannelDepartments.btnCloseToastSuccess.click();
            yield poOmnichannelDepartments.inputSearch.fill(departmentName);
            yield (0, test_1.expect)(poOmnichannelDepartments.firstRowInTable).toBeVisible();
        }));
        yield test_1.test.step('expect to not be possible adding a second department ', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelDepartments.headingButtonNew('Create department').click();
            yield (0, test_1.expect)(poOmnichannelDepartments.upgradeDepartmentsModal).toBeVisible();
            yield poOmnichannelDepartments.btnUpgradeDepartmentsModalClose.click();
        }));
    }));
});
