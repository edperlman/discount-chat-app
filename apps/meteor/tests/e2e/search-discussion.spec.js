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
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const utils_1 = require("./utils");
const getSettingValueById_1 = require("./utils/getSettingValueById");
const setSettingValueById_1 = require("./utils/setSettingValueById");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.describe.serial('search-discussion', () => {
    let settingDefaultValue;
    let poHomeChannel;
    let discussionName;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        settingDefaultValue = yield (0, getSettingValueById_1.getSettingValueById)(api, 'UI_Allow_room_names_with_special_chars');
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        discussionName = yield (0, utils_1.createTargetDiscussion)(api);
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield (0, setSettingValueById_1.setSettingValueById)(api, 'UI_Allow_room_names_with_special_chars', settingDefaultValue);
    }));
    const testDiscussionSearch = (page) => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.sidenav.openSearch();
        yield poHomeChannel.sidenav.inputSearch.type(discussionName);
        const targetSearchItem = page.locator('role=listbox').getByText(discussionName).first();
        yield (0, test_1.expect)(targetSearchItem).toBeVisible();
    });
    (0, test_1.test)('expect search discussion to show fname when UI_Allow_room_names_with_special_chars=true', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield (0, setSettingValueById_1.setSettingValueById)(api, 'UI_Allow_room_names_with_special_chars', true);
        yield testDiscussionSearch(page);
    }));
    (0, test_1.test)('expect search discussion to show fname when UI_Allow_room_names_with_special_chars=false', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield (0, setSettingValueById_1.setSettingValueById)(api, 'UI_Allow_room_names_with_special_chars', false);
        yield testDiscussionSearch(page);
    }));
});
