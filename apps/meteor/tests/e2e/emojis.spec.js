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
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('emoji', () => {
    let poHomeChannel;
    let targetChannel;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        targetChannel = yield (0, utils_1.createTargetChannel)(api);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    (0, test_1.test)('expect pick and send grinning emoji', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.content.pickEmoji('grinning');
        yield page.keyboard.press('Enter');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText('😀');
    }));
    (0, test_1.test)('expect send emoji via text', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.content.sendMessage(':innocent:');
        yield page.keyboard.press('Enter');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText('😇');
    }));
    (0, test_1.test)('expect render special characters and numbers properly', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.content.sendMessage('® © ™ # *');
        yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText('® © ™ # *');
    }));
});
