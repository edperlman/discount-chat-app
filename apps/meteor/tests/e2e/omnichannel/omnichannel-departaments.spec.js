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
const departments_1 = require("../utils/omnichannel/departments");
const test_1 = require("../utils/test");
const ERROR = {
    requiredName: 'Name required',
    requiredEmail: 'Email required',
    invalidEmail: 'Invalid email address',
};
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe('OC - Manage Departments', () => {
    test_1.test.skip(!constants_1.IS_EE, 'Enterprise Edition Only');
    let poOmnichannelDepartments;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        // turn on department removal
        yield api.post('/settings/Omnichannel_enable_department_removal', { value: true });
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        // turn off department removal
        yield api.post('/settings/Omnichannel_enable_department_removal', { value: false });
    }));
    test_1.test.describe('Create first department', () => __awaiter(void 0, void 0, void 0, function* () {
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            poOmnichannelDepartments = new page_objects_1.OmnichannelDepartments(page);
            yield page.goto('/omnichannel');
            yield poOmnichannelDepartments.sidenav.linkDepartments.click();
        }));
        (0, test_1.test)('Create department', () => __awaiter(void 0, void 0, void 0, function* () {
            const departmentName = faker_1.faker.string.uuid();
            yield poOmnichannelDepartments.headingButtonNew('Create department').click();
            yield test_1.test.step('expect name and email to be required', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(poOmnichannelDepartments.invalidInputEmail).not.toBeVisible();
                yield poOmnichannelDepartments.inputName.fill('any_text');
                yield poOmnichannelDepartments.inputName.fill('');
                yield (0, test_1.expect)(poOmnichannelDepartments.invalidInputName).toBeVisible();
                yield (0, test_1.expect)(poOmnichannelDepartments.errorMessage(ERROR.requiredName)).toBeVisible();
                yield poOmnichannelDepartments.inputName.fill('any_text');
                yield (0, test_1.expect)(poOmnichannelDepartments.invalidInputName).not.toBeVisible();
                yield poOmnichannelDepartments.inputEmail.fill('any_text');
                yield (0, test_1.expect)(poOmnichannelDepartments.invalidInputEmail).toBeVisible();
                yield (0, test_1.expect)(poOmnichannelDepartments.errorMessage(ERROR.invalidEmail)).toBeVisible();
                yield poOmnichannelDepartments.inputEmail.fill('');
                yield (0, test_1.expect)(poOmnichannelDepartments.invalidInputEmail).toBeVisible();
                yield (0, test_1.expect)(poOmnichannelDepartments.errorMessage(ERROR.requiredEmail)).toBeVisible();
                yield poOmnichannelDepartments.inputEmail.fill(faker_1.faker.internet.email());
                yield (0, test_1.expect)(poOmnichannelDepartments.invalidInputEmail).not.toBeVisible();
                yield (0, test_1.expect)(poOmnichannelDepartments.errorMessage(ERROR.requiredEmail)).not.toBeVisible();
            }));
            yield test_1.test.step('expect create new department', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelDepartments.btnEnabled.click();
                yield poOmnichannelDepartments.inputName.fill(departmentName);
                yield poOmnichannelDepartments.inputEmail.fill(faker_1.faker.internet.email());
                yield poOmnichannelDepartments.btnSave.click();
                yield poOmnichannelDepartments.search(departmentName);
                yield (0, test_1.expect)(poOmnichannelDepartments.firstRowInTable).toBeVisible();
            }));
            yield test_1.test.step('expect to delete department', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelDepartments.search(departmentName);
                yield poOmnichannelDepartments.selectedDepartmentMenu(departmentName).click();
                yield poOmnichannelDepartments.menuDeleteOption.click();
                yield test_1.test.step('expect confirm delete department', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield test_1.test.step('expect delete to be disabled when name is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
                        yield (0, test_1.expect)(poOmnichannelDepartments.btnModalConfirmDelete).toBeDisabled();
                        yield poOmnichannelDepartments.inputModalConfirmDelete.fill('someramdomname');
                        yield (0, test_1.expect)(poOmnichannelDepartments.btnModalConfirmDelete).toBeDisabled();
                    }));
                    yield test_1.test.step('expect to successfuly delete if department name is correct', () => __awaiter(void 0, void 0, void 0, function* () {
                        yield (0, test_1.expect)(poOmnichannelDepartments.btnModalConfirmDelete).toBeDisabled();
                        yield poOmnichannelDepartments.inputModalConfirmDelete.fill(departmentName);
                        yield (0, test_1.expect)(poOmnichannelDepartments.btnModalConfirmDelete).toBeEnabled();
                        yield poOmnichannelDepartments.btnModalConfirmDelete.click();
                    }));
                }));
                yield test_1.test.step('expect department to have been deleted', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poOmnichannelDepartments.search(departmentName);
                    yield (0, test_1.expect)(poOmnichannelDepartments.firstRowInTable).toHaveCount(0);
                }));
            }));
        }));
    }));
    test_1.test.describe('After creation', () => __awaiter(void 0, void 0, void 0, function* () {
        let department;
        test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api, page }) {
            poOmnichannelDepartments = new page_objects_1.OmnichannelDepartments(page);
            department = yield (0, departments_1.createDepartment)(api).then((res) => res.data);
            yield page.goto('/omnichannel/departments');
        }));
        test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield (0, departments_1.deleteDepartment)(api, { id: department._id });
        }));
        (0, test_1.test)('Edit department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('expect create new department', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelDepartments.search(department.name);
                yield (0, test_1.expect)(poOmnichannelDepartments.firstRowInTable).toBeVisible();
                return department;
            }));
            yield test_1.test.step('expect update department name', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelDepartments.search(department.name);
                yield poOmnichannelDepartments.firstRowInTableMenu.click();
                yield poOmnichannelDepartments.menuEditOption.click();
                yield poOmnichannelDepartments.inputName.fill(`edited-${department.name}`);
                yield poOmnichannelDepartments.btnSave.click();
                yield poOmnichannelDepartments.search(`edited-${department.name}`);
                yield (0, test_1.expect)(poOmnichannelDepartments.firstRowInTable).toBeVisible();
            }));
        }));
        (0, test_1.test)('Archive department', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('expect create new department', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelDepartments.search(department.name);
                yield (0, test_1.expect)(poOmnichannelDepartments.firstRowInTable).toBeVisible();
            }));
            yield test_1.test.step('expect archive department', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelDepartments.search(department.name);
                yield (0, test_1.expect)(poOmnichannelDepartments.firstRowInTable).toBeVisible();
                yield poOmnichannelDepartments.firstRowInTableMenu.click();
                yield poOmnichannelDepartments.menuArchiveOption.click();
                yield (0, test_1.expect)(poOmnichannelDepartments.toastSuccess).toBeVisible();
                yield poOmnichannelDepartments.archivedDepartmentsTab.click();
                yield poOmnichannelDepartments.search(department.name);
                yield (0, test_1.expect)(poOmnichannelDepartments.firstRowInTable).toBeVisible();
            }));
            yield test_1.test.step('expect archived department to not be editable', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelDepartments.firstRowInTableMenu.click();
                yield (0, test_1.expect)(poOmnichannelDepartments.menuEditOption).not.toBeVisible();
            }));
            yield test_1.test.step('expect unarchive department', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelDepartments.menuUnarchiveOption.click();
                yield (0, test_1.expect)(poOmnichannelDepartments.firstRowInTable).toHaveCount(0);
            }));
        }));
        (0, test_1.test)('Request tag(s) before closing conversation', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('expect create new department', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelDepartments.search(department.name);
                yield (0, test_1.expect)(poOmnichannelDepartments.firstRowInTable).toBeVisible();
            }));
            yield test_1.test.step('expect save form button be disabled', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelDepartments.search(department.name);
                yield poOmnichannelDepartments.firstRowInTableMenu.click();
                yield poOmnichannelDepartments.menuEditOption.click();
                yield (0, test_1.expect)(poOmnichannelDepartments.btnSave).toBeDisabled();
                yield poOmnichannelDepartments.btnBack.click();
            }));
            yield test_1.test.step('Disabled tags state', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelDepartments.search(department.name);
                yield poOmnichannelDepartments.firstRowInTableMenu.click();
                yield poOmnichannelDepartments.menuEditOption.click();
                yield test_1.test.step('expect to have department tags toggle button', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(poOmnichannelDepartments.toggleRequestTags).toBeVisible();
                }));
                yield test_1.test.step('expect have no add tag to department', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(poOmnichannelDepartments.inputTags).not.toBeVisible();
                    yield (0, test_1.expect)(poOmnichannelDepartments.btnTagsAdd).not.toBeVisible();
                    yield poOmnichannelDepartments.btnBack.click();
                }));
            }));
            yield test_1.test.step('Enabled tags state', () => __awaiter(void 0, void 0, void 0, function* () {
                const tagName = faker_1.faker.string.sample(5);
                yield poOmnichannelDepartments.search(department.name);
                yield poOmnichannelDepartments.firstRowInTableMenu.click();
                yield poOmnichannelDepartments.menuEditOption.click();
                yield test_1.test.step('expect to have form save option disabled', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, test_1.expect)(poOmnichannelDepartments.btnSave).toBeDisabled();
                }));
                yield test_1.test.step('expect clicking on toggle button to enable tags', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poOmnichannelDepartments.toggleRequestTags.click();
                    yield (0, test_1.expect)(poOmnichannelDepartments.inputTags).toBeVisible();
                    yield (0, test_1.expect)(poOmnichannelDepartments.btnTagsAdd).toBeVisible();
                }));
                yield test_1.test.step('expect to have add and remove one tag properly tags', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poOmnichannelDepartments.inputTags.fill(tagName);
                    yield poOmnichannelDepartments.btnTagsAdd.click();
                    yield (0, test_1.expect)(poOmnichannelDepartments.btnTag(tagName)).toBeVisible();
                    yield (0, test_1.expect)(poOmnichannelDepartments.btnSave).toBeEnabled();
                }));
                yield test_1.test.step('expect to be invalid if there is no tag added', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poOmnichannelDepartments.btnTag(tagName).click();
                    yield (0, test_1.expect)(poOmnichannelDepartments.invalidInputTags).toBeVisible();
                    yield (0, test_1.expect)(poOmnichannelDepartments.btnSave).toBeDisabled();
                }));
                yield test_1.test.step('expect to be not possible adding empty tags', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield poOmnichannelDepartments.inputTags.fill('');
                    yield (0, test_1.expect)(poOmnichannelDepartments.btnTagsAdd).toBeDisabled();
                }));
                yield test_1.test.step('expect to not be possible adding same tag twice', () => __awaiter(void 0, void 0, void 0, function* () {
                    const tagName = faker_1.faker.string.sample(5);
                    yield poOmnichannelDepartments.inputTags.fill(tagName);
                    yield poOmnichannelDepartments.btnTagsAdd.click();
                    yield poOmnichannelDepartments.inputTags.fill(tagName);
                    yield (0, test_1.expect)(poOmnichannelDepartments.btnTagsAdd).toBeDisabled();
                }));
            }));
        }));
        (0, test_1.test)('Toggle department removal', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            yield test_1.test.step('expect create new department', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelDepartments.search(department.name);
                yield (0, test_1.expect)(poOmnichannelDepartments.firstRowInTable).toBeVisible();
            }));
            yield test_1.test.step('expect to be able to delete department', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelDepartments.search(department.name);
                yield poOmnichannelDepartments.selectedDepartmentMenu(department.name).click();
                yield (0, test_1.expect)(poOmnichannelDepartments.menuDeleteOption).toBeEnabled();
            }));
            yield test_1.test.step('expect to disable department removal setting', () => __awaiter(void 0, void 0, void 0, function* () {
                const statusCode = (yield api.post('/settings/Omnichannel_enable_department_removal', { value: false })).status();
                (0, test_1.expect)(statusCode).toBe(200);
            }));
            yield test_1.test.step('expect not to be able to delete department', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelDepartments.search(department.name);
                yield poOmnichannelDepartments.selectedDepartmentMenu(department.name).click();
                yield (0, test_1.expect)(poOmnichannelDepartments.menuDeleteOption).toBeDisabled();
            }));
            yield test_1.test.step('expect to enable department removal setting', () => __awaiter(void 0, void 0, void 0, function* () {
                const statusCode = (yield api.post('/settings/Omnichannel_enable_department_removal', { value: true })).status();
                (0, test_1.expect)(statusCode).toBe(200);
            }));
            yield test_1.test.step('expect to delete department', () => __awaiter(void 0, void 0, void 0, function* () {
                const deleteRes = yield (0, departments_1.deleteDepartment)(api, { id: department._id });
                (0, test_1.expect)(deleteRes.status()).toBe(200);
            }));
        }));
    }));
});
