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
const omnichannel_sla_policies_1 = require("../page-objects/omnichannel-sla-policies");
const test_1 = require("../utils/test");
const ERROR = {
    nameRequired: 'Name required',
    estimatedWaitTimeRequired: 'Estimated wait time (time in minutes) required',
};
const INITIAL_SLA = {
    name: faker_1.faker.person.firstName(),
    description: faker_1.faker.lorem.sentence(),
    estimatedWaitTime: faker_1.faker.string.numeric({ length: 1, exclude: '0' }),
};
const EDITED_SLA = {
    name: faker_1.faker.person.firstName(),
    description: faker_1.faker.lorem.sentence(),
    estimatedWaitTime: faker_1.faker.string.numeric({ length: 1, exclude: '0' }),
};
test_1.test.skip(!constants_1.IS_EE, 'Omnichannel SLA Policies > Enterprise Only');
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.describe('Omnichannel SLA Policies', () => {
    let poOmnichannelSlaPolicies;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.post('/livechat/users/agent', { username: 'user1' });
        yield api.post('/livechat/users/manager', { username: 'user1' });
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannelSlaPolicies = new omnichannel_sla_policies_1.OmnichannelSlaPolicies(page);
        yield page.goto('/omnichannel');
        yield poOmnichannelSlaPolicies.sidenav.linkSlaPolicies.click();
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield api.delete('/livechat/users/agent/user1');
        yield api.delete('/livechat/users/manager/user1');
    }));
    (0, test_1.test)('Manage SLAs', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('Add new SLA', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelSlaPolicies.headingButtonNew('Create SLA policy').click();
            yield test_1.test.step('field name is required', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelSlaPolicies.manageSlaPolicy.inputName.fill('any_text');
                yield poOmnichannelSlaPolicies.manageSlaPolicy.inputName.fill('');
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.errorMessage(ERROR.nameRequired)).toBeVisible();
            }));
            yield test_1.test.step('input a valid name', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelSlaPolicies.manageSlaPolicy.inputName.fill(INITIAL_SLA.name);
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.errorMessage(ERROR.nameRequired)).not.toBeVisible();
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.btnSave).toBeDisabled();
            }));
            yield test_1.test.step('input a valid description', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelSlaPolicies.manageSlaPolicy.inputDescription.fill(INITIAL_SLA.description);
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.btnSave).toBeDisabled();
            }));
            yield test_1.test.step('only allow numbers on estimated wait time field', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelSlaPolicies.manageSlaPolicy.inputEstimatedWaitTime.type('a');
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.inputEstimatedWaitTime).toHaveValue('');
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.btnSave).toBeDisabled();
            }));
            yield test_1.test.step('not allow 0 on estimated wait time field', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelSlaPolicies.manageSlaPolicy.inputEstimatedWaitTime.fill('0');
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.errorMessage(ERROR.estimatedWaitTimeRequired)).toBeVisible();
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.btnSave).toBeDisabled();
            }));
            yield test_1.test.step('input a valid estimated wait time', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelSlaPolicies.manageSlaPolicy.inputEstimatedWaitTime.fill(INITIAL_SLA.estimatedWaitTime);
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.errorMessage(ERROR.estimatedWaitTimeRequired)).not.toBeVisible();
            }));
            yield test_1.test.step('save sla', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.btnSave).toBeEnabled();
                yield poOmnichannelSlaPolicies.manageSlaPolicy.btnSave.click();
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.inputName).not.toBeVisible();
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.findRowByName(INITIAL_SLA.name)).toBeVisible();
            }));
        }));
        yield test_1.test.step('Search SLA', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelSlaPolicies.inputSearch.type('random_text_that_should_have_no_match');
            yield (0, test_1.expect)(poOmnichannelSlaPolicies.findRowByName(INITIAL_SLA.name)).not.toBeVisible();
            yield (0, test_1.expect)(poOmnichannelSlaPolicies.txtEmptyState).toBeVisible();
            yield poOmnichannelSlaPolicies.inputSearch.fill(INITIAL_SLA.name);
            yield (0, test_1.expect)(poOmnichannelSlaPolicies.findRowByName(INITIAL_SLA.name)).toBeVisible();
            yield (0, test_1.expect)(poOmnichannelSlaPolicies.txtEmptyState).not.toBeVisible();
            yield poOmnichannelSlaPolicies.inputSearch.fill('');
        }));
        yield test_1.test.step('Edit SLA', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelSlaPolicies.findRowByName(INITIAL_SLA.name).click();
            yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.inputName).toHaveValue(INITIAL_SLA.name);
            yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.inputDescription).toHaveValue(INITIAL_SLA.description);
            yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.inputEstimatedWaitTime).toHaveValue(INITIAL_SLA.estimatedWaitTime);
            yield test_1.test.step('edit name', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelSlaPolicies.manageSlaPolicy.inputName.fill(EDITED_SLA.name);
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.errorMessage(ERROR.nameRequired)).not.toBeVisible();
            }));
            yield test_1.test.step('edit description', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelSlaPolicies.manageSlaPolicy.inputDescription.fill(EDITED_SLA.description);
            }));
            yield test_1.test.step('edit estimated wait time', () => __awaiter(void 0, void 0, void 0, function* () {
                yield poOmnichannelSlaPolicies.manageSlaPolicy.inputEstimatedWaitTime.fill(EDITED_SLA.estimatedWaitTime);
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.errorMessage(ERROR.estimatedWaitTimeRequired)).not.toBeVisible();
            }));
            yield test_1.test.step('save sla', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.btnSave).toBeEnabled();
                yield poOmnichannelSlaPolicies.manageSlaPolicy.btnSave.click();
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.manageSlaPolicy.inputName).not.toBeVisible();
                yield (0, test_1.expect)(poOmnichannelSlaPolicies.findRowByName(EDITED_SLA.name)).toBeVisible();
            }));
        }));
        yield test_1.test.step('Remove SLA', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelSlaPolicies.btnRemove(EDITED_SLA.name).click();
            yield (0, test_1.expect)(poOmnichannelSlaPolicies.txtDeleteModalTitle).toBeVisible();
            yield poOmnichannelSlaPolicies.btnDelete.click();
            yield (0, test_1.expect)(poOmnichannelSlaPolicies.findRowByName(EDITED_SLA.name)).not.toBeVisible();
        }));
    }));
});
