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
const setSettingValueById_1 = require("./utils/setSettingValueById");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.user1.state });
test_1.test.describe.serial('file-upload', () => {
    let poHomeChannel;
    let targetChannel;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield (0, setSettingValueById_1.setSettingValueById)(api, 'FileUpload_MediaTypeBlackList', 'image/svg+xml');
        targetChannel = yield (0, utils_1.createTargetChannel)(api, { members: ['user1'] });
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
        yield poHomeChannel.sidenav.openChat(targetChannel);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield (0, setSettingValueById_1.setSettingValueById)(api, 'FileUpload_MediaTypeBlackList', 'image/svg+xml');
        (0, test_1.expect)((yield api.post('/channels.delete', { roomName: targetChannel })).status()).toBe(200);
    }));
    (0, test_1.test)('expect successfully cancel upload', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.content.dragAndDropTxtFile();
        yield poHomeChannel.content.btnModalCancel.click();
        yield (0, test_1.expect)(poHomeChannel.content.modalFilePreview).not.toBeVisible();
    }));
    (0, test_1.test)('expect send file not show modal', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.content.dragAndDropTxtFile();
        yield poHomeChannel.content.btnModalConfirm.click();
        yield (0, test_1.expect)(poHomeChannel.content.modalFilePreview).not.toBeVisible();
    }));
    (0, test_1.test)('expect send file with name/description updated', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.content.dragAndDropTxtFile();
        yield poHomeChannel.content.descriptionInput.fill('any_description');
        yield poHomeChannel.content.fileNameInput.fill('any_file1.txt');
        yield poHomeChannel.content.btnModalConfirm.click();
        yield (0, test_1.expect)(poHomeChannel.content.getFileDescription).toHaveText('any_description');
        yield (0, test_1.expect)(poHomeChannel.content.lastMessageFileName).toContainText('any_file1.txt');
    }));
    (0, test_1.test)('expect send lst file succesfully', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.content.dragAndDropLstFile();
        yield poHomeChannel.content.descriptionInput.fill('lst_description');
        yield poHomeChannel.content.btnModalConfirm.click();
        yield (0, test_1.expect)(poHomeChannel.content.getFileDescription).toHaveText('lst_description');
        yield (0, test_1.expect)(poHomeChannel.content.lastMessageFileName).toContainText('lst-test.lst');
    }));
    (0, test_1.test)('expect send drawio (unknown media type) file succesfully', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.reload();
        yield poHomeChannel.content.sendFileMessage('diagram.drawio');
        yield poHomeChannel.content.descriptionInput.fill('drawio_description');
        yield poHomeChannel.content.btnModalConfirm.click();
        yield (0, test_1.expect)(poHomeChannel.content.getFileDescription).toHaveText('drawio_description');
        yield (0, test_1.expect)(poHomeChannel.content.lastMessageFileName).toContainText('diagram.drawio');
    }));
    (0, test_1.test)('expect not to send drawio file (unknown media type) when the default media type is blocked', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api, page }) {
        yield (0, setSettingValueById_1.setSettingValueById)(api, 'FileUpload_MediaTypeBlackList', 'application/octet-stream');
        yield page.reload();
        yield poHomeChannel.content.sendFileMessage('diagram.drawio');
        yield (0, test_1.expect)(poHomeChannel.content.btnModalConfirm).not.toBeVisible();
    }));
});
test_1.test.describe('file-upload-not-member', () => {
    let poHomeChannel;
    let targetChannel;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        targetChannel = yield (0, utils_1.createTargetChannel)(api);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
        yield poHomeChannel.sidenav.openChat(targetChannel);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        (0, test_1.expect)((yield api.post('/channels.delete', { roomName: targetChannel })).status()).toBe(200);
    }));
    (0, test_1.test)('expect not be able to upload if not a member', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poHomeChannel.content.dragAndDropTxtFile();
        yield (0, test_1.expect)(poHomeChannel.content.modalFilePreview).not.toBeVisible();
    }));
});
