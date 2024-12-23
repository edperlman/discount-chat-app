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
const tags_1 = require("../utils/omnichannel/tags");
const test_1 = require("../utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe('OC - Manage Tags', () => {
    test_1.test.skip(!constants_1.IS_EE, 'OC - Manage Tags > Enterprise Edition Only');
    let poOmnichannelTags;
    let department;
    let department2;
    let agent;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        department = yield (0, departments_1.createDepartment)(api);
        department2 = yield (0, departments_1.createDepartment)(api);
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        agent = yield (0, agents_1.createAgent)(api, 'user2');
    }));
    test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield department.delete();
        yield department2.delete();
        yield agent.delete();
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannelTags = new page_objects_1.OmnichannelTags(page);
    }));
    (0, test_1.test)('OC - Manage Tags - Create Tag', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const tagName = faker_1.faker.string.uuid();
        yield page.goto('/omnichannel');
        yield poOmnichannelTags.sidenav.linkTags.click();
        yield test_1.test.step('expect correct form default state', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelTags.btnCreateTag.click();
            yield (0, test_1.expect)(poOmnichannelTags.contextualBar).toBeVisible();
            yield (0, test_1.expect)(poOmnichannelTags.btnSave).toBeDisabled();
            yield (0, test_1.expect)(poOmnichannelTags.btnCancel).toBeEnabled();
            yield poOmnichannelTags.btnCancel.click();
            yield (0, test_1.expect)(poOmnichannelTags.contextualBar).not.toBeVisible();
        }));
        yield test_1.test.step('expect to create new tag', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelTags.btnCreateTag.click();
            yield poOmnichannelTags.inputName.fill(tagName);
            yield poOmnichannelTags.selectDepartment(department.data);
            yield poOmnichannelTags.btnSave.click();
            yield (0, test_1.expect)(poOmnichannelTags.contextualBar).not.toBeVisible();
            yield test_1.test.step('expect tag to have been created', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelTags.search(tagName);
                yield (0, test_1.expect)(poOmnichannelTags.findRowByName(tagName)).toBeVisible();
            }));
        }));
        yield test_1.test.step('expect to delete tag', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('expect to be able to cancel delete', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelTags.btnDeleteByName(tagName).click();
                yield (0, test_1.expect)(poOmnichannelTags.confirmDeleteModal).toBeVisible();
                yield poOmnichannelTags.btnCancelDeleteModal.click();
                yield (0, test_1.expect)(poOmnichannelTags.confirmDeleteModal).not.toBeVisible();
            }));
            yield test_1.test.step('expect to confirm delete', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelTags.btnDeleteByName(tagName).click();
                yield (0, test_1.expect)(poOmnichannelTags.confirmDeleteModal).toBeVisible();
                yield poOmnichannelTags.btnConfirmDeleteModal.click();
                yield (0, test_1.expect)(poOmnichannelTags.confirmDeleteModal).not.toBeVisible();
                yield (0, test_1.expect)(page.locator('h3 >> text="No results found"')).toBeVisible();
            }));
        }));
    }));
    (0, test_1.test)('OC - Manage Tags - Edit tag departments', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api, page }) {
        const tag = yield test_1.test.step('expect to create new tag', () => __awaiter(void 0, void 0, void 0, function* () {
            const { data: tag } = yield (0, tags_1.createTag)(api, {
                name: faker_1.faker.string.uuid(),
                departments: [department.data._id],
            });
            return tag;
        }));
        yield page.goto('/omnichannel');
        yield poOmnichannelTags.sidenav.linkTags.click();
        yield test_1.test.step('expect to add tag departments', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelTags.search(tag.name);
            yield poOmnichannelTags.findRowByName(tag.name).click();
            yield (0, test_1.expect)(poOmnichannelTags.contextualBar).toBeVisible();
            yield poOmnichannelTags.selectDepartment({ name: department2.data.name, _id: department2.data._id });
            yield poOmnichannelTags.btnSave.click();
        }));
        yield test_1.test.step('expect department to be in the chosen departments list', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelTags.search(tag.name);
            yield poOmnichannelTags.findRowByName(tag.name).click();
            yield (0, test_1.expect)(poOmnichannelTags.contextualBar).toBeVisible();
            yield (0, test_1.expect)(page.getByRole('option', { name: department2.data.name })).toBeVisible();
            yield poOmnichannelTags.btnContextualbarClose.click();
        }));
        yield test_1.test.step('expect to remove tag departments', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelTags.search(tag.name);
            yield poOmnichannelTags.findRowByName(tag.name).click();
            yield (0, test_1.expect)(poOmnichannelTags.contextualBar).toBeVisible();
            yield poOmnichannelTags.selectDepartment({ name: department2.data.name, _id: department2.data._id });
            yield poOmnichannelTags.btnSave.click();
        }));
        yield test_1.test.step('expect department to not be in the chosen departments list', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelTags.search(tag.name);
            yield poOmnichannelTags.findRowByName(tag.name).click();
            yield (0, test_1.expect)(poOmnichannelTags.contextualBar).toBeVisible();
            yield (0, test_1.expect)(page.getByRole('option', { name: department2.data.name })).toBeHidden();
        }));
        yield test_1.test.step('expect to delete tag', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelTags.btnDeleteByName(tag.name).click();
            yield (0, test_1.expect)(poOmnichannelTags.confirmDeleteModal).toBeVisible();
            yield poOmnichannelTags.btnConfirmDeleteModal.click();
            yield (0, test_1.expect)(poOmnichannelTags.confirmDeleteModal).not.toBeVisible();
            yield (0, test_1.expect)(page.locator('h3 >> text="No results found"')).toBeVisible();
        }));
    }));
});
