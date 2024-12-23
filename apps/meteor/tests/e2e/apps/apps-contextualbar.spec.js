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
const constants_1 = require("../config/constants");
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const test_1 = require("../utils/test");
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.describe.serial('Apps > ContextualBar', () => {
    test_1.test.skip(!constants_1.IS_EE, 'Premium Only');
    let poHomeChannel;
    let page;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser }) {
        page = yield browser.newPage();
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
        yield poHomeChannel.sidenav.openChat('general');
    }));
    test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield page.close();
    }));
    (0, test_1.test)('expect allow user open app contextualbar', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.content.dispatchSlashCommand('/contextualbar');
        yield (0, test_1.expect)(poHomeChannel.btnContextualbarClose).toBeVisible();
    }));
    (0, test_1.test)('expect app contextualbar to be closed', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.btnContextualbarClose.click();
        yield (0, test_1.expect)(poHomeChannel.btnContextualbarClose).toBeHidden();
    }));
});
