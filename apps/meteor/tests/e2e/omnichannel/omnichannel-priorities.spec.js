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
const omnichannel_priorities_1 = require("../page-objects/omnichannel-priorities");
const test_1 = require("../utils/test");
const PRIORITY_NAME = faker_1.faker.person.firstName();
const ERROR = {
    fieldNameRequired: 'Name required',
};
test_1.test.skip(!constants_1.IS_EE, 'Omnichannel Priorities > Enterprise Only');
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.describe.serial('Omnichannel Priorities', () => {
    let poOmnichannelPriorities;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield Promise.all([
            api.post('/livechat/users/agent', { username: 'user1' }),
            api.post('/livechat/users/manager', { username: 'user1' }),
        ]);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannelPriorities = new omnichannel_priorities_1.OmnichannelPriorities(page);
        yield page.goto('/omnichannel');
        yield page.locator('.main-content').waitFor();
        yield poOmnichannelPriorities.sidenav.linkPriorities.click();
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield Promise.all([api.delete('/livechat/users/agent/user1'), api.delete('/livechat/users/manager/user1')]);
    }));
    (0, test_1.test)('Manage Priorities', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('All default priorities should be visible', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                (0, test_1.expect)(poOmnichannelPriorities.findPriority('Highest')).toBeVisible(),
                (0, test_1.expect)(poOmnichannelPriorities.findPriority('High')).toBeVisible(),
                (0, test_1.expect)(poOmnichannelPriorities.findPriority('Medium')).toBeVisible(),
                (0, test_1.expect)(poOmnichannelPriorities.findPriority('Low')).toBeVisible(),
                (0, test_1.expect)(poOmnichannelPriorities.findPriority('Lowest')).toBeVisible(),
            ]);
        }));
        yield test_1.test.step('Add new priority', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannelPriorities.btnReset).toBeDisabled();
            yield poOmnichannelPriorities.findPriority('Highest').click();
            yield test_1.test.step('default state', () => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all([
                    (0, test_1.expect)(poOmnichannelPriorities.managePriority.btnSave).toBeDisabled(),
                    (0, test_1.expect)(poOmnichannelPriorities.managePriority.btnReset).not.toBeVisible(),
                    (0, test_1.expect)(poOmnichannelPriorities.managePriority.inputName).toHaveValue('Highest'),
                ]);
            }));
            yield test_1.test.step('field name is required', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelPriorities.managePriority.inputName.fill('any_text');
                yield (0, test_1.expect)(poOmnichannelPriorities.managePriority.btnSave).toBeEnabled();
                yield poOmnichannelPriorities.managePriority.inputName.fill('');
                yield (0, test_1.expect)(poOmnichannelPriorities.managePriority.errorMessage(ERROR.fieldNameRequired)).toBeVisible();
                yield (0, test_1.expect)(poOmnichannelPriorities.managePriority.btnSave).toBeDisabled();
            }));
            yield test_1.test.step('edit and save priority', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelPriorities.managePriority.inputName.fill(PRIORITY_NAME);
                yield Promise.all([
                    (0, test_1.expect)(poOmnichannelPriorities.managePriority.btnReset).toBeVisible(),
                    (0, test_1.expect)(poOmnichannelPriorities.managePriority.btnSave).toBeEnabled(),
                ]);
                yield poOmnichannelPriorities.managePriority.btnSave.click();
                yield Promise.all([
                    poOmnichannelPriorities.btnCloseToastSuccess.click(),
                    (0, test_1.expect)(poOmnichannelPriorities.managePriority.inputName).not.toBeVisible(),
                    (0, test_1.expect)(poOmnichannelPriorities.findPriority(PRIORITY_NAME)).toBeVisible(),
                    (0, test_1.expect)(poOmnichannelPriorities.findPriority('Highest')).not.toBeVisible(),
                ]);
            }));
        }));
        yield test_1.test.step('Reset priority', () => __awaiter(void 0, void 0, void 0, function* () {
            yield test_1.test.step('reset individual', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelPriorities.findPriority(PRIORITY_NAME).click();
                yield (0, test_1.expect)(poOmnichannelPriorities.managePriority.btnReset).toBeVisible();
                yield poOmnichannelPriorities.managePriority.btnReset.click();
                yield Promise.all([
                    (0, test_1.expect)(poOmnichannelPriorities.managePriority.inputName).toHaveValue('Highest'),
                    (0, test_1.expect)(poOmnichannelPriorities.managePriority.btnReset).not.toBeVisible(),
                ]);
                yield (0, test_1.expect)(poOmnichannelPriorities.managePriority.btnSave).toBeEnabled();
                yield poOmnichannelPriorities.managePriority.btnSave.click();
                yield poOmnichannelPriorities.btnCloseToastSuccess.click();
                yield (0, test_1.expect)(poOmnichannelPriorities.findPriority('Highest')).toBeVisible();
                yield (0, test_1.expect)(poOmnichannelPriorities.btnReset).not.toBeEnabled();
            }));
            yield test_1.test.step('reset all', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelPriorities.findPriority('Highest').click();
                yield poOmnichannelPriorities.managePriority.inputName.fill(PRIORITY_NAME);
                yield Promise.all([
                    (0, test_1.expect)(poOmnichannelPriorities.managePriority.btnReset).toBeVisible(),
                    (0, test_1.expect)(poOmnichannelPriorities.managePriority.btnSave).toBeEnabled(),
                ]);
                yield poOmnichannelPriorities.managePriority.btnSave.click();
                yield poOmnichannelPriorities.btnCloseToastSuccess.click();
                yield Promise.all([
                    (0, test_1.expect)(poOmnichannelPriorities.managePriority.inputName).not.toBeVisible(),
                    (0, test_1.expect)(poOmnichannelPriorities.findPriority(PRIORITY_NAME)).toBeVisible(),
                    (0, test_1.expect)(poOmnichannelPriorities.findPriority('Highest')).not.toBeVisible(),
                ]);
                yield (0, test_1.expect)(poOmnichannelPriorities.btnReset).toBeEnabled();
                yield poOmnichannelPriorities.btnReset.click();
                yield poOmnichannelPriorities.btnResetConfirm.click();
                yield Promise.all([
                    (0, test_1.expect)(poOmnichannelPriorities.toastSuccess).toBeVisible(),
                    (0, test_1.expect)(poOmnichannelPriorities.btnReset).not.toBeEnabled(),
                    (0, test_1.expect)(poOmnichannelPriorities.findPriority(PRIORITY_NAME)).not.toBeVisible(),
                    (0, test_1.expect)(poOmnichannelPriorities.findPriority('Highest')).toBeVisible(),
                ]);
            }));
        }));
    }));
});
