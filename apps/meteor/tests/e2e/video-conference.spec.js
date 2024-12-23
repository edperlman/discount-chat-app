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
const constants_1 = require("./config/constants");
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const utils_1 = require("./utils");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.describe('video conference', () => {
    test_1.test.skip(!constants_1.IS_EE, 'Premium Only');
    let poHomeChannel;
    let targetChannel;
    let targetReadOnlyChannel;
    let targetTeam;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        targetChannel = yield (0, utils_1.createTargetChannel)(api);
        targetReadOnlyChannel = yield (0, utils_1.createTargetChannel)(api, { readOnly: true });
        targetTeam = yield (0, utils_1.createTargetTeam)(api);
        yield (0, utils_1.createDirectMessage)(api);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    (0, test_1.test)('expect create video conference in a "targetChannel"', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.content.btnCall.click();
        yield poHomeChannel.content.menuItemVideoCall.click();
        yield poHomeChannel.content.btnStartVideoCall.click();
        yield (0, test_1.expect)(poHomeChannel.content.videoConfMessageBlock.last()).toBeVisible();
    }));
    test_1.test.describe('test received in a "target channel"', () => __awaiter(void 0, void 0, void 0, function* () {
        test_1.test.use({ storageState: userStates_1.Users.user2.state });
        (0, test_1.test)('verify if user received a invite call from "targetChannel"', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield (0, test_1.expect)(poHomeChannel.content.videoConfMessageBlock.last()).toBeVisible();
        }));
    }));
    (0, test_1.test)('expect create video conference in a direct', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.sidenav.openChat('user2');
        yield poHomeChannel.content.btnCall.click();
        yield poHomeChannel.content.menuItemVideoCall.click();
        yield poHomeChannel.content.btnStartVideoCall.click();
        yield (0, test_1.expect)(poHomeChannel.content.videoConfMessageBlock.last()).toBeVisible();
    }));
    test_1.test.describe('verify if user received from a direct', () => __awaiter(void 0, void 0, void 0, function* () {
        test_1.test.use({ storageState: userStates_1.Users.user2.state });
        (0, test_1.test)('verify if user received a call invite in direct', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat('user1');
            yield (0, test_1.expect)(poHomeChannel.content.videoConfMessageBlock.last()).toBeVisible();
        }));
    }));
    (0, test_1.test)('expect create video conference in a "targetTeam"', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.sidenav.openChat(targetTeam);
        yield poHomeChannel.content.btnCall.click();
        yield poHomeChannel.content.menuItemVideoCall.click();
        yield poHomeChannel.content.btnStartVideoCall.click();
        yield (0, test_1.expect)(poHomeChannel.content.videoConfMessageBlock.last()).toBeVisible();
    }));
    test_1.test.describe('verify if received from a "targetTeam"', () => __awaiter(void 0, void 0, void 0, function* () {
        test_1.test.use({ storageState: userStates_1.Users.user2.state });
        (0, test_1.test)('verify if user received from a "targetTeam"', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetTeam);
            yield (0, test_1.expect)(poHomeChannel.content.videoConfMessageBlock.last()).toBeVisible();
        }));
    }));
    (0, test_1.test)('expect create video conference in a direct multiple', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.sidenav.openChat('rocketchat.internal.admin.test, user2');
        yield poHomeChannel.content.btnCall.click();
        yield poHomeChannel.content.menuItemVideoCall.click();
        yield poHomeChannel.content.btnStartVideoCall.click();
        yield (0, test_1.expect)(poHomeChannel.content.videoConfMessageBlock.last()).toBeVisible();
    }));
    test_1.test.describe('received in a direct multiple', () => __awaiter(void 0, void 0, void 0, function* () {
        test_1.test.use({ storageState: userStates_1.Users.user2.state });
        (0, test_1.test)('verify if user received from a multiple', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat('rocketchat.internal.admin.test, user1');
            yield (0, test_1.expect)(poHomeChannel.content.videoConfMessageBlock.last()).toBeVisible();
        }));
    }));
    (0, test_1.test)('expect create video conference not available in a "targetReadOnlyChannel"', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.sidenav.openChat(targetReadOnlyChannel);
        yield (0, test_1.expect)(poHomeChannel.content.btnCall).hasAttribute('disabled');
    }));
});
