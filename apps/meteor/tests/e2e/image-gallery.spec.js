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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const createAuxContext_1 = require("./fixtures/createAuxContext");
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const utils_1 = require("./utils");
const test_1 = require("./utils/test");
test_1.test.describe.serial('Image Gallery', () => __awaiter(void 0, void 0, void 0, function* () {
    let poHomeChannel;
    let targetChannel;
    let targetChannelLargeImage;
    const viewport = {
        width: 1280,
        height: 720,
    };
    // Using more than 5 images so that new images need to be loaded by the gallery
    const imageNames = ['number1.png', 'number2.png', 'number3.png', 'number4.png', 'number5.png', 'number6.png'];
    test_1.test.use({ viewport });
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api, browser }) {
        targetChannel = yield (0, utils_1.createTargetChannel)(api);
        targetChannelLargeImage = yield (0, utils_1.createTargetChannel)(api);
        const { page } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1);
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield poHomeChannel.sidenav.openChat(targetChannelLargeImage);
        yield poHomeChannel.content.btnJoinRoom.click();
        yield poHomeChannel.sidenav.openChat(targetChannel);
        yield poHomeChannel.content.btnJoinRoom.click();
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield poHomeChannel.page.close();
        yield (0, utils_1.deleteChannel)(api, targetChannel);
        yield (0, utils_1.deleteChannel)(api, targetChannelLargeImage);
    }));
    test_1.test.describe('When sending an image as a file', () => {
        test_1.test.beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            yield poHomeChannel.sidenav.openChat(targetChannel);
            try {
                for (var _d = true, imageNames_1 = __asyncValues(imageNames), imageNames_1_1; imageNames_1_1 = yield imageNames_1.next(), _a = imageNames_1_1.done, !_a; _d = true) {
                    _c = imageNames_1_1.value;
                    _d = false;
                    const imageName = _c;
                    yield poHomeChannel.content.sendFileMessage(imageName);
                    yield poHomeChannel.content.btnModalConfirm.click();
                    yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText(imageName);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = imageNames_1.return)) yield _b.call(imageNames_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            yield poHomeChannel.sidenav.openChat(targetChannelLargeImage);
            yield poHomeChannel.content.sendFileMessage('test-large-image.jpeg');
            yield poHomeChannel.content.btnModalConfirm.click();
            yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText('test-large-image.jpeg');
            yield poHomeChannel.content.lastUserMessage.locator('img.gallery-item').click();
        }));
        (0, test_1.test)('expect to have a large image not out of viewport bounds', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, test_1.expect)(yield poHomeChannel.content.imageGalleryImage.evaluate((el) => parseInt(window.getComputedStyle(el).getPropertyValue('width')))).toBeLessThanOrEqual(viewport.width);
            (0, test_1.expect)(yield poHomeChannel.content.imageGalleryImage.evaluate((el) => parseInt(window.getComputedStyle(el).getPropertyValue('height')))).toBeLessThanOrEqual(viewport.height);
        }));
        (0, test_1.test)('expect to zoom in image', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (yield poHomeChannel.content.getGalleryButtonByName('zoom-in')).click();
            (0, test_1.expect)(parseInt((yield poHomeChannel.content.imageGalleryImage.getAttribute('data-qa-zoom-scale')))).toBeGreaterThan(1);
        }));
        (0, test_1.test)('expect to zoom out image', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (yield poHomeChannel.content.getGalleryButtonByName('zoom-out')).click();
            (0, test_1.expect)(parseInt((yield poHomeChannel.content.imageGalleryImage.getAttribute('data-qa-zoom-scale')))).toEqual(1);
        }));
        (0, test_1.test)('expect to resize image to default ratio', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(yield poHomeChannel.content.getGalleryButtonByName('zoom-out')).toBeDisabled();
            yield (yield poHomeChannel.content.getGalleryButtonByName('zoom-in')).dblclick();
            yield (0, test_1.expect)(yield poHomeChannel.content.getGalleryButtonByName('zoom-out')).toBeEnabled();
            yield (yield poHomeChannel.content.getGalleryButtonByName('resize')).click();
            (0, test_1.expect)(parseInt((yield poHomeChannel.content.imageGalleryImage.getAttribute('data-qa-zoom-scale')))).toEqual(1);
        }));
        (0, test_1.test)('expect to close gallery', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (yield poHomeChannel.content.getGalleryButtonByName('close')).click();
            yield (0, test_1.expect)(poHomeChannel.content.imageGalleryImage).not.toBeVisible();
        }));
        (0, test_1.test)('expect successfully move to older images by using the left arrow button', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.sidenav.openChat(targetChannel);
            yield poHomeChannel.content.lastUserMessage.locator('img.gallery-item').click();
            /* eslint-disable no-await-in-loop */
            for (let i = 0; i < imageNames.length - 1; i++) {
                yield (0, test_1.expect)(poHomeChannel.content.previousSlideButton).toBeEnabled();
                yield (0, test_1.expect)(poHomeChannel.content.currentGalleryImage).toHaveAttribute('src', new RegExp(`${imageNames[imageNames.length - (i + 1)]}$`));
                yield poHomeChannel.content.previousSlideButton.click();
            }
            yield (0, test_1.expect)(poHomeChannel.content.previousSlideButton).toBeDisabled();
        }));
        (0, test_1.test)('expect successfully move to newer images by using the right arrow button', () => __awaiter(void 0, void 0, void 0, function* () {
            for (let i = 0; i < imageNames.length - 1; i++) {
                yield (0, test_1.expect)(poHomeChannel.content.nextSlideButton).toBeEnabled();
                yield (0, test_1.expect)(poHomeChannel.content.currentGalleryImage).toHaveAttribute('src', new RegExp(`${imageNames[i]}$`));
                yield poHomeChannel.content.nextSlideButton.click();
            }
            yield (0, test_1.expect)(poHomeChannel.content.nextSlideButton).toBeDisabled();
            yield (yield poHomeChannel.content.getGalleryButtonByName('close')).click();
        }));
    });
    test_1.test.describe('When sending an image as a link', () => {
        const imageLink = 'https://i0.wp.com/merithu.com.br/wp-content/uploads/2019/11/rocket-chat.png';
        test_1.test.beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield poHomeChannel.content.sendMessage(imageLink);
            yield (0, test_1.expect)(poHomeChannel.content.lastUserMessage).toContainText(imageLink);
            yield poHomeChannel.content.lastUserMessage.locator('img.preview-image').click();
        }));
        (0, test_1.test)('expect to open the image inside the image gallery', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poHomeChannel.content.imageGalleryImage).toBeVisible();
        }));
    });
}));
