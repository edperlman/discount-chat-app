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
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('sidebar', () => {
    let poHomeDiscussion;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeDiscussion = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    (0, test_1.test)('should navigate on sidebar toolbar using arrow keys', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeDiscussion.sidenav.userProfileMenu.focus();
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('ArrowRight');
        yield (0, test_1.expect)(poHomeDiscussion.sidenav.sidebarToolbar.getByRole('button', { name: 'Search' })).toBeFocused();
    }));
    (0, test_1.test)('should navigate on sidebar items using arrow keys and restore focus', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // focus should be on the next item
        yield poHomeDiscussion.sidenav.sidebarChannelsList.getByRole('link').first().focus();
        yield page.keyboard.press('ArrowDown');
        yield (0, test_1.expect)(poHomeDiscussion.sidenav.sidebarChannelsList.getByRole('link').first()).not.toBeFocused();
        // shouldn't focus the first item
        yield page.keyboard.press('Shift+Tab');
        yield page.keyboard.press('Tab');
        yield (0, test_1.expect)(poHomeDiscussion.sidenav.sidebarChannelsList.getByRole('link').first()).not.toBeFocused();
    }));
});
