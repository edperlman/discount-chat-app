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
test_1.test.use({ storageState: userStates_1.Users.user2.state });
test_1.test.describe.serial('permissions', () => {
    let poHomeChannel;
    let targetChannel;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        targetChannel = yield (0, utils_1.createTargetChannel)(api);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
    }));
    test_1.test.describe.serial('Edit message', () => {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const statusCode = (yield api.post('/settings/Message_AllowEditing', { value: false })).status();
            yield (0, test_1.expect)(statusCode).toBe(200);
        }));
        (0, test_1.test)('expect option(edit) not be visible', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.content.sendMessage('expect option(edit) not be visible');
            yield (0, test_1.expect)(page.locator('.rcx-message', { hasText: 'expect option(edit) not be visible' })).not.toHaveAttribute('aria-busy', 'true');
            yield poHomeChannel.content.openLastMessageMenu();
            yield (0, test_1.expect)(poHomeChannel.content.btnOptionEditMessage).toBeHidden();
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const statusCode = (yield api.post('/settings/Message_AllowEditing', { value: true })).status();
            yield (0, test_1.expect)(statusCode).toBe(200);
        }));
    });
    test_1.test.describe.serial('Delete message', () => {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const statusCode = (yield api.post('/settings/Message_AllowDeleting', { value: false })).status();
            yield (0, test_1.expect)(statusCode).toBe(200);
        }));
        (0, test_1.test)('expect option(delete) not be visible', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.content.sendMessage('expect option(delete) not be visible');
            yield (0, test_1.expect)(page.locator('.rcx-message', { hasText: 'expect option(delete) not be visible' })).not.toHaveAttribute('aria-busy', 'true');
            yield poHomeChannel.content.openLastMessageMenu();
            yield (0, test_1.expect)(poHomeChannel.content.btnOptionDeleteMessage).toBeHidden();
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const statusCode = (yield api.post('/settings/Message_AllowDeleting', { value: true })).status();
            yield (0, test_1.expect)(statusCode).toBe(200);
        }));
    });
    test_1.test.describe.serial('Pin message', () => {
        test_1.test.use({ storageState: userStates_1.Users.admin.state });
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const statusCode = (yield api.post('/settings/Message_AllowPinning', { value: false })).status();
            yield (0, test_1.expect)(statusCode).toBe(200);
        }));
        (0, test_1.test)('expect option(pin) not be visible', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.content.sendMessage('expect option(pin) not be visible');
            yield (0, test_1.expect)(page.locator('.rcx-message', { hasText: 'expect option(pin) not be visible' })).not.toHaveAttribute('aria-busy', 'true');
            yield poHomeChannel.content.openLastMessageMenu();
            yield (0, test_1.expect)(poHomeChannel.content.btnOptionPinMessage).toBeHidden();
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const statusCode = (yield api.post('/settings/Message_AllowPinning', { value: true })).status();
            yield (0, test_1.expect)(statusCode).toBe(200);
        }));
    });
    // FIXME: Wrong behavior in Rocket.chat, currently it shows the button
    // and after a click a "not allowed" alert pops up
    test_1.test.describe.skip('Star message', () => {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const statusCode = (yield api.post('/settings/Message_AllowStarring', { value: false })).status();
            yield (0, test_1.expect)(statusCode).toBe(200);
        }));
        (0, test_1.test)('expect option(star) not be visible', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.content.sendMessage('expect option(star) not be visible');
            yield (0, test_1.expect)(page.locator('.rcx-message', { hasText: 'expect option(star) not be visible' })).not.toHaveAttribute('aria-busy', 'true');
            yield poHomeChannel.content.openLastMessageMenu();
            yield (0, test_1.expect)(poHomeChannel.content.btnOptionStarMessage).toBeHidden();
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const statusCode = (yield api.post('/settings/Message_AllowStarring', { value: true })).status();
            yield (0, test_1.expect)(statusCode).toBe(200);
        }));
    });
    test_1.test.describe.serial('Upload file', () => {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const statusCode = (yield api.post('/settings/FileUpload_Enabled', { value: false })).status();
            yield (0, test_1.expect)(statusCode).toBe(200);
        }));
        (0, test_1.test)('expect option (upload file) not be visible', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield (0, test_1.expect)(poHomeChannel.content.btnOptionFileUpload).toBeDisabled();
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const statusCode = (yield api.post('/settings/FileUpload_Enabled', { value: true })).status();
            yield (0, test_1.expect)(statusCode).toBe(200);
        }));
    });
    test_1.test.describe.serial('Upload audio', () => {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const statusCode = (yield api.post('/settings/Message_AudioRecorderEnabled', { value: false })).status();
            yield (0, test_1.expect)(statusCode).toBe(200);
        }));
        (0, test_1.test)('expect option (upload audio) not be visible', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield (0, test_1.expect)(poHomeChannel.content.btnRecordAudio).toBeDisabled();
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const statusCode = (yield api.post('/settings/Message_AudioRecorderEnabled', { value: true })).status();
            yield (0, test_1.expect)(statusCode).toBe(200);
        }));
    });
    test_1.test.describe.serial('Upload video', () => {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const statusCode = (yield api.post('/settings/Message_VideoRecorderEnabled', { value: false })).status();
            yield (0, test_1.expect)(statusCode).toBe(200);
        }));
        (0, test_1.test)('expect option (upload video) not be visible', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield (0, test_1.expect)(poHomeChannel.content.btnVideoMessage).toBeDisabled();
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const statusCode = (yield api.post('/settings/Message_VideoRecorderEnabled', { value: true })).status();
            yield (0, test_1.expect)(statusCode).toBe(200);
        }));
    });
    test_1.test.describe.serial('Filter words', () => {
        test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const statusCode1 = (yield api.post('/settings/Message_AllowBadWordsFilter', { value: true })).status();
            const statusCode2 = (yield api.post('/settings/Message_BadWordsFilterList', { value: 'badword' })).status();
            yield (0, test_1.expect)(statusCode1).toBe(200);
            yield (0, test_1.expect)(statusCode2).toBe(200);
        }));
        (0, test_1.test)('expect badword be censored', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.content.sendMessage('badword');
            yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText('*'.repeat(7));
        }));
        test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
            const statusCode = (yield api.post('/settings/Message_AllowBadWordsFilter', { value: false })).status();
            yield (0, test_1.expect)(statusCode).toBe(200);
        }));
    });
});
