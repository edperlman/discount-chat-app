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
test_1.test.describe.serial('create-channel', () => {
    let poHomeChannel;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    (0, test_1.test)('expect create a public channel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.openNewByLabel('Channel');
        yield poHomeChannel.sidenav.inputChannelName.type(channelName);
        yield poHomeChannel.sidenav.checkboxPrivateChannel.click();
        yield poHomeChannel.sidenav.btnCreate.click();
        yield (0, test_1.expect)(page).toHaveURL(`/channel/${channelName}`);
    }));
    (0, test_1.test)('expect create a private channel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const channelName = faker_1.faker.string.uuid();
        yield poHomeChannel.sidenav.openNewByLabel('Channel');
        yield poHomeChannel.sidenav.inputChannelName.type(channelName);
        yield poHomeChannel.sidenav.btnCreate.click();
        yield (0, test_1.expect)(page).toHaveURL(`/group/${channelName}`);
    }));
});