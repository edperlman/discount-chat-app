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
const createAuxContext_1 = require("./fixtures/createAuxContext");
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.describe('video conference ringing', () => {
    let poHomeChannel;
    test_1.test.skip(!constants_1.IS_EE, 'Enterprise Only');
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    let auxContext;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
        const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user2);
        auxContext = { page, poHomeChannel: new page_objects_1.HomeChannel(page) };
    }));
    test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield auxContext.page.close();
    }));
    (0, test_1.test)('expect is ringing in direct', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.sidenav.openChat('user2');
        yield auxContext.poHomeChannel.sidenav.openChat('user1');
        yield poHomeChannel.content.btnCall.click();
        yield poHomeChannel.content.menuItemVideoCall.click();
        yield poHomeChannel.content.btnStartVideoCall.click();
        yield (0, test_1.expect)(poHomeChannel.content.videoConfRingCallText('Calling')).toBeVisible();
        yield (0, test_1.expect)(auxContext.poHomeChannel.content.videoConfRingCallText('Incoming call from')).toBeVisible();
        yield auxContext.poHomeChannel.content.btnDeclineVideoCall.click();
        yield auxContext.page.close();
    }));
});
