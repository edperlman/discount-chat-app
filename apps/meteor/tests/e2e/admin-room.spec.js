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
const utils_1 = require("./utils");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('admin-rooms', () => {
    let channel;
    let privateRoom;
    let admin;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        admin = new page_objects_1.Admin(page);
        yield page.goto('/admin/rooms');
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        [channel, privateRoom] = yield Promise.all([(0, utils_1.createTargetChannel)(api), (0, utils_1.createTargetPrivateChannel)(api)]);
    }));
    (0, test_1.test)('should display the Rooms Table', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield (0, test_1.expect)(page.locator('[data-qa-type="PageHeader-title"]')).toContainText('Rooms');
    }));
    (0, test_1.test)('should filter room by name', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield admin.inputSearchRooms.fill(channel);
        yield (0, test_1.expect)(page.locator(`[qa-room-name="${channel}"]`)).toBeVisible();
    }));
    (0, test_1.test)('should filter rooms by type', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const dropdown = yield admin.dropdownFilterRoomType();
        yield dropdown.click();
        const privateOption = page.locator('text=Private channels');
        yield privateOption.waitFor();
        yield privateOption.click();
        const selectedDropdown = yield admin.dropdownFilterRoomType('Rooms (1)');
        yield (0, test_1.expect)(selectedDropdown).toBeVisible();
        yield (0, test_1.expect)(page.locator('text=Private Channel').first()).toBeVisible();
    }));
    (0, test_1.test)('should filter rooms by type and name', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield admin.inputSearchRooms.fill(privateRoom);
        const dropdown = yield admin.dropdownFilterRoomType();
        yield dropdown.click();
        yield page.locator('text=Private channels').click();
        yield (0, test_1.expect)(page.locator(`[qa-room-name="${privateRoom}"]`)).toBeVisible();
    }));
    (0, test_1.test)('should be empty in case of the search does not find any room', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const nonExistingChannel = faker_1.faker.string.alpha(10);
        yield admin.inputSearchRooms.fill(nonExistingChannel);
        const dropdown = yield admin.dropdownFilterRoomType();
        yield dropdown.click();
        yield page.locator('text=Private channels').click();
        yield (0, test_1.expect)(page.locator('text=No results found')).toBeVisible();
    }));
    (0, test_1.test)('should filter rooms by type and name and clean the filter after changing section', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield admin.inputSearchRooms.fill(privateRoom);
        const dropdown = yield admin.dropdownFilterRoomType();
        yield dropdown.click();
        yield page.locator('text=Private channels').click();
        const workspaceButton = yield admin.adminSectionButton(page_objects_1.AdminSectionsHref.Workspace);
        yield workspaceButton.click();
        const roomsButton = yield admin.adminSectionButton(page_objects_1.AdminSectionsHref.Rooms);
        yield roomsButton.click();
        const selectDropdown = yield admin.dropdownFilterRoomType('All rooms');
        yield (0, test_1.expect)(selectDropdown).toBeVisible();
    }));
});
