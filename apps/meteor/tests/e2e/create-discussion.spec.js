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
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('create-discussion', () => {
    let poHomeDiscussion;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeDiscussion = new page_objects_1.HomeDiscussion(page);
        yield page.goto('/home');
    }));
    (0, test_1.test)('expect create discussion', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const discussionName = faker_1.faker.string.uuid();
        const discussionMessage = faker_1.faker.animal.type();
        yield poHomeDiscussion.sidenav.openNewByLabel('Discussion');
        yield poHomeDiscussion.inputChannelName.type('general');
        yield page.locator('role=listbox >> role=option[name=general]').click();
        yield poHomeDiscussion.inputName.type(discussionName);
        yield poHomeDiscussion.inputMessage.type(discussionMessage);
        yield poHomeDiscussion.btnCreate.click();
        yield (0, test_1.expect)(page).toHaveURL(/\/channel\/[a-z0-9]{0,17}$/i);
    }));
});
