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
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.describe.serial('message-composer', () => {
    let poHomeChannel;
    let targetChannel;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        targetChannel = yield (0, utils_1.createTargetChannel)(api);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    (0, test_1.test)('should have all formatters and the main actions visible on toolbar', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.content.sendMessage('hello composer');
        yield (0, test_1.expect)(poHomeChannel.composerToolbarActions).toHaveCount(12);
    }));
    (0, test_1.test)('should have only the main formatter and the main action', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.setViewportSize({ width: 768, height: 600 });
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield (0, test_1.expect)(poHomeChannel.composerToolbarActions).toHaveCount(5);
    }));
    (0, test_1.test)('should navigate on toolbar using arrow keys', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('ArrowRight');
        yield page.keyboard.press('ArrowRight');
        yield (0, test_1.expect)(poHomeChannel.composerToolbar.getByRole('button', { name: 'Italic' })).toBeFocused();
        yield page.keyboard.press('ArrowLeft');
        yield (0, test_1.expect)(poHomeChannel.composerToolbar.getByRole('button', { name: 'Bold' })).toBeFocused();
    }));
    (0, test_1.test)('should move the focus away from toolbar using tab key', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield page.keyboard.press('Tab');
        yield page.keyboard.press('Tab');
        yield (0, test_1.expect)(poHomeChannel.composerToolbar.getByRole('button', { name: 'Emoji' })).not.toBeFocused();
    }));
    (0, test_1.test)('should add a link to the selected text', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        const url = faker_1.faker.internet.url();
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield page.keyboard.type('hello composer');
        yield page.keyboard.press('Control+A'); // on Windows and Linux
        yield page.keyboard.press('Meta+A'); // on macOS
        yield poHomeChannel.composerToolbar.getByRole('button', { name: 'Link' }).click();
        yield page.keyboard.type(url);
        yield page.keyboard.press('Enter');
        yield (0, test_1.expect)(poHomeChannel.composer).toHaveValue(`[hello composer](${url})`);
    }));
    (0, test_1.test)('should select popup item and not send the message when pressing enter', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.content.sendMessage('hello composer');
        yield test_1.test.step('mention popup', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.keyboard.type('hello composer @all');
            yield page.keyboard.press('Enter');
            yield (0, test_1.expect)(poHomeChannel.composer).toHaveValue('hello composer @all ');
            yield poHomeChannel.composer.fill('');
        }));
        yield test_1.test.step('emoji popup', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.keyboard.type('hello composer :flag_br');
            yield page.keyboard.press('Enter');
            yield (0, test_1.expect)(poHomeChannel.composer).toHaveValue('hello composer :flag_br: ');
            yield poHomeChannel.composer.fill('');
        }));
        yield test_1.test.step('slash command', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.keyboard.type('/gim');
            yield page.keyboard.press('Enter');
            yield (0, test_1.expect)(poHomeChannel.composer).toHaveValue('/gimme ');
            yield poHomeChannel.composer.fill('');
        }));
    }));
});
