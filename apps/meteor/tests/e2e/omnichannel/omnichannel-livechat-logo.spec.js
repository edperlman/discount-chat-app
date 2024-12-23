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
const createAuxContext_1 = require("../fixtures/createAuxContext");
const userStates_1 = require("../fixtures/userStates");
const page_objects_1 = require("../page-objects");
const test_1 = require("../utils/test");
test_1.test.skip(!constants_1.IS_EE, 'Enterprise Only');
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe('OC - Livechat - Widget logo', () => __awaiter(void 0, void 0, void 0, function* () {
    let poLiveChat;
    let poOmnichannelSettings;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, api }) {
        const { page: livechatPage } = yield (0, createAuxContext_1.createAuxContext)(browser, userStates_1.Users.user1, '/livechat', false);
        poLiveChat = new page_objects_1.OmnichannelLiveChat(livechatPage, api);
    }));
    test_1.test.afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield poLiveChat.page.close();
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poOmnichannelSettings = new page_objects_1.OmnichannelSettings(page);
        yield page.goto('/admin/settings/Omnichannel');
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const res = yield api.post('/assets.unsetAsset', { assetName: 'livechat_widget_logo' });
        if (res.status() !== 200) {
            throw new Error('Failed to unset asset');
        }
    }));
    (0, test_1.test)('OC - Livechat - Change widget logo', () => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('expect to have default logo', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelSettings.group('Livechat').click();
            yield (0, test_1.expect)(poLiveChat.imgLogo).not.toBeVisible();
            yield (0, test_1.expect)(poOmnichannelSettings.imgLivechatLogoPreview).not.toBeVisible();
        }));
        yield test_1.test.step('expect to change widget logo', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poOmnichannelSettings.labelLivechatLogo).toHaveText('Livechat widget logo (svg, png, jpg)');
            yield poOmnichannelSettings.inputLivechatLogo.setInputFiles('./tests/e2e/fixtures/files/test-image.jpeg');
            yield (0, test_1.expect)(poOmnichannelSettings.imgLivechatLogoPreview).toBeVisible();
            yield poLiveChat.page.reload();
            yield (0, test_1.expect)(poLiveChat.imgLogo).toBeVisible();
            yield (0, test_1.expect)(poLiveChat.imgLogo).toHaveAttribute('src', 'assets/livechat_widget_logo.jpeg');
        }));
        yield test_1.test.step('expect to remove custom logo', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poOmnichannelSettings.btnDeleteLivechatLogo.click();
            yield (0, test_1.expect)(poOmnichannelSettings.imgLivechatLogoPreview).not.toBeVisible();
            yield poLiveChat.page.reload();
            yield (0, test_1.expect)(poLiveChat.imgLogo).not.toBeVisible();
        }));
    }));
}));
