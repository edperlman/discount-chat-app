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
const omnichannel_livechat_appearance_1 = require("../page-objects/omnichannel-livechat-appearance");
const test_1 = require("../utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('OC - Livechat Appearance - EE', () => {
    let poLivechatAppearance;
    test_1.test.skip(!constants_1.IS_EE, 'Enterprise Only');
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poLivechatAppearance = new omnichannel_livechat_appearance_1.OmnichannelLivechatAppearance(page);
        yield page.goto('/omnichannel');
        yield poLivechatAppearance.sidenav.linkLivechatAppearance.click();
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const res = yield Promise.all([
            api.post('/settings/Livechat_hide_system_messages', { value: ['uj', 'ul', 'livechat-close'] }),
            api.post('/settings/Livechat_background', { value: '' }),
        ]);
        if (res.some((r) => r.status() !== 200)) {
            throw new Error('Failed to reset settings');
        }
    }));
    (0, test_1.test)('OC - Livechat Appearance - Hide system messages', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('expect to have default values', () => __awaiter(void 0, void 0, void 0, function* () {
            // Clicking at the edge of the element to prevent playwright from clicking a chip by mistake
            yield poLivechatAppearance.inputHideSystemMessages.locator('.rcx-icon--name-chevron-down').click();
            yield (0, test_1.expect)(poLivechatAppearance.findHideSystemMessageOption('uj')).toHaveAttribute('aria-selected', 'true');
            yield (0, test_1.expect)(poLivechatAppearance.findHideSystemMessageOption('ul')).toHaveAttribute('aria-selected', 'true');
            yield (0, test_1.expect)(poLivechatAppearance.findHideSystemMessageOption('livechat-close')).toHaveAttribute('aria-selected', 'true');
            yield poLivechatAppearance.inputHideSystemMessages.locator('.rcx-icon--name-chevron-up').click();
        }));
        yield test_1.test.step('expect to change values', () => __awaiter(void 0, void 0, void 0, function* () {
            // Clicking at the edge of the element to prevent playwright from clicking a chip by mistake
            yield poLivechatAppearance.inputHideSystemMessages.locator('.rcx-icon--name-chevron-down').click();
            yield poLivechatAppearance.findHideSystemMessageOption('livechat_transfer_history').click();
            yield poLivechatAppearance.findHideSystemMessageOption('livechat-close').click();
            yield poLivechatAppearance.btnSave.click();
        }));
        yield test_1.test.step('expect to have saved changes', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.reload();
            // Clicking at the edge of the element to prevent playwright from clicking a chip by mistake
            yield poLivechatAppearance.inputHideSystemMessages.locator('.rcx-icon--name-chevron-down').click();
            yield (0, test_1.expect)(poLivechatAppearance.findHideSystemMessageOption('uj')).toHaveAttribute('aria-selected', 'true');
            yield (0, test_1.expect)(poLivechatAppearance.findHideSystemMessageOption('ul')).toHaveAttribute('aria-selected', 'true');
            yield (0, test_1.expect)(poLivechatAppearance.findHideSystemMessageOption('livechat_transfer_history')).toHaveAttribute('aria-selected', 'true');
            yield (0, test_1.expect)(poLivechatAppearance.findHideSystemMessageOption('livechat-close')).toHaveAttribute('aria-selected', 'false');
        }));
    }));
    (0, test_1.test)('OC - Livechat Appearance - Change Livechat background', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('expect to have default value', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(yield poLivechatAppearance.inputLivechatBackground).toHaveValue('');
        }));
        yield test_1.test.step('expect to change value', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLivechatAppearance.inputLivechatBackground.fill('rgb(186, 1, 85)');
            yield poLivechatAppearance.btnSave.click();
        }));
        yield test_1.test.step('expect to have saved changes', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.reload();
            yield (0, test_1.expect)(poLivechatAppearance.inputLivechatBackground).toHaveValue('rgb(186, 1, 85)');
        }));
    }));
});
test_1.test.describe('OC - Livechat Appearance - CE', () => {
    let poLivechatAppearance;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poLivechatAppearance = new omnichannel_livechat_appearance_1.OmnichannelLivechatAppearance(page);
        yield page.goto('/omnichannel');
        yield poLivechatAppearance.sidenav.linkLivechatAppearance.click();
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const res = yield api.post('/settings/Livechat_title', { value: 'Rocket.Chat' });
        if (res.status() !== 200) {
            throw new Error('Failed to reset settings');
        }
    }));
    (0, test_1.test)('OC - Livechat Appearance - Change Livechat Title', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield test_1.test.step('expect to have default value', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poLivechatAppearance.inputLivechatTitle).toHaveValue('Rocket.Chat');
        }));
        yield test_1.test.step('expect to change value', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poLivechatAppearance.inputLivechatTitle.fill('Test Title');
            yield poLivechatAppearance.btnSave.click();
        }));
        yield test_1.test.step('expect to have saved changes', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.reload();
            yield (0, test_1.expect)(poLivechatAppearance.inputLivechatTitle).toHaveValue('Test Title');
        }));
    }));
});
