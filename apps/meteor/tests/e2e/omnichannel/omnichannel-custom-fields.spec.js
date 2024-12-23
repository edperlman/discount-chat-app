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
test_1.test.describe('omnichannel-customFields', () => {
    let poOmnichannelCustomFields;
    const newField = 'any_field';
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannelCustomFields = new page_objects_1.OmnichannelCustomFields(page);
        yield page.goto('/omnichannel');
        yield poOmnichannelCustomFields.sidenav.linkCustomFields.click();
    }));
    (0, test_1.test)('expect add new "custom field"', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poOmnichannelCustomFields.btnAdd.click();
        yield page.waitForURL('/omnichannel/customfields/new');
        yield poOmnichannelCustomFields.inputField.type(newField);
        yield poOmnichannelCustomFields.inputLabel.type('any_label');
        yield poOmnichannelCustomFields.btnSave.click();
        yield (0, test_1.expect)(poOmnichannelCustomFields.firstRowInTable(newField)).toBeVisible();
    }));
    (0, test_1.test)('expect update "newField"', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const newLabel = 'new_any_label';
        yield poOmnichannelCustomFields.inputSearch.fill(newField);
        yield poOmnichannelCustomFields.firstRowInTable(newField).click();
        yield poOmnichannelCustomFields.inputLabel.fill('new_any_label');
        yield poOmnichannelCustomFields.visibleLabel.click();
        yield poOmnichannelCustomFields.btnSave.click();
        yield (0, test_1.expect)(page.locator(`[qa-user-id="${newField}"] td:nth-child(2)`)).toHaveText(newLabel);
    }));
    (0, test_1.test)('expect remove "new_field"', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poOmnichannelCustomFields.inputSearch.fill(newField);
        yield poOmnichannelCustomFields.firstRowInTable(newField).click();
        yield poOmnichannelCustomFields.btnDeleteCustomField.click();
        yield poOmnichannelCustomFields.btnModalRemove.click();
        yield poOmnichannelCustomFields.inputSearch.fill(newField);
        yield (0, test_1.expect)(poOmnichannelCustomFields.firstRowInTable(newField)).toBeHidden();
    }));
});
