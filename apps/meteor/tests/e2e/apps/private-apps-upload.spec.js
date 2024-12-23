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
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe.serial('Private apps upload', () => {
    let poMarketplace;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poMarketplace = new page_objects_1.Marketplace(page);
        yield page.goto('/marketplace/private');
    }));
    test_1.test.describe('Premium', () => {
        test_1.test.skip(!constants_1.IS_EE, 'Premium Only');
        (0, test_1.test)('expect to allow admin to upload a private app in EE, which should be enabled by default', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            const fileChooserPromise = page.waitForEvent('filechooser');
            yield poMarketplace.btnUploadPrivateApp.click();
            yield (0, test_1.expect)(poMarketplace.btnInstallPrivateApp).toBeDisabled();
            yield poMarketplace.btnUploadPrivateAppFile.click();
            const fileChooser = yield fileChooserPromise;
            yield fileChooser.setFiles('./tests/e2e/fixtures/files/test-app_0.0.1.zip');
            yield (0, test_1.expect)(poMarketplace.btnInstallPrivateApp).toBeEnabled();
            yield poMarketplace.btnInstallPrivateApp.click();
            yield page.getByRole('button', { name: 'Agree' }).click();
            yield (0, test_1.expect)(poMarketplace.appStatusTag).toHaveText('Enabled');
        }));
        (0, test_1.test)('expect to allow admin to update a enabled private app in EE, which should remain enabled', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            const fileChooserPromise = page.waitForEvent('filechooser');
            yield poMarketplace.btnUploadPrivateApp.click();
            yield (0, test_1.expect)(poMarketplace.btnInstallPrivateApp).toBeDisabled();
            yield poMarketplace.btnUploadPrivateAppFile.click();
            const fileChooser = yield fileChooserPromise;
            yield fileChooser.setFiles('./tests/e2e/fixtures/files/test-app_0.0.1.zip');
            yield (0, test_1.expect)(poMarketplace.btnInstallPrivateApp).toBeEnabled();
            yield poMarketplace.btnInstallPrivateApp.click();
            yield poMarketplace.btnConfirmAppUpdate.click();
            yield page.getByRole('button', { name: 'Agree' }).click();
            yield page.goto('/marketplace/private');
            yield poMarketplace.lastAppRow.click();
            yield (0, test_1.expect)(poMarketplace.appStatusTag).toHaveText('Enabled');
        }));
        (0, test_1.test)('expect to allow disabling a recently installed private app in EE', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poMarketplace.lastAppRow.click();
            yield (0, test_1.expect)(poMarketplace.appStatusTag).toHaveText('Enabled');
            yield poMarketplace.appMenu.click();
            yield (0, test_1.expect)(poMarketplace.btnDisableApp).toBeEnabled();
            yield poMarketplace.btnDisableApp.click();
            yield poMarketplace.btnConfirmAppUpdate.click();
            yield (0, test_1.expect)(poMarketplace.appStatusTag).toHaveText('Disabled');
        }));
        (0, test_1.test)('expect to allow admin to update a disabled private app in EE, which should remain disabled', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            const fileChooserPromise = page.waitForEvent('filechooser');
            yield poMarketplace.btnUploadPrivateApp.click();
            yield (0, test_1.expect)(poMarketplace.btnInstallPrivateApp).toBeDisabled();
            yield poMarketplace.btnUploadPrivateAppFile.click();
            const fileChooser = yield fileChooserPromise;
            yield fileChooser.setFiles('./tests/e2e/fixtures/files/test-app_0.0.1.zip');
            yield (0, test_1.expect)(poMarketplace.btnInstallPrivateApp).toBeEnabled();
            yield poMarketplace.btnInstallPrivateApp.click();
            yield poMarketplace.btnConfirmAppUpdate.click();
            yield page.getByRole('button', { name: 'Agree' }).click();
            yield page.goto('/marketplace/private');
            yield poMarketplace.lastAppRow.click();
            yield (0, test_1.expect)(poMarketplace.appStatusTag).toHaveText('Disabled');
        }));
    });
    test_1.test.describe('Community Edition', () => {
        test_1.test.skip(constants_1.IS_EE, 'CE Only');
        (0, test_1.test)('expect to allow admin to upload a private app in CE, but it should be disabled by default', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            const fileChooserPromise = page.waitForEvent('filechooser');
            yield poMarketplace.btnUploadPrivateApp.click();
            yield (0, test_1.expect)(poMarketplace.btnConfirmAppUploadModal).toBeEnabled();
            yield poMarketplace.btnConfirmAppUploadModal.click();
            yield (0, test_1.expect)(poMarketplace.btnInstallPrivateApp).toBeDisabled();
            yield poMarketplace.btnUploadPrivateAppFile.click();
            const fileChooser = yield fileChooserPromise;
            yield fileChooser.setFiles('./tests/e2e/fixtures/files/test-app_0.0.1.zip');
            yield (0, test_1.expect)(poMarketplace.btnInstallPrivateApp).toBeEnabled();
            yield poMarketplace.btnInstallPrivateApp.click();
            yield page.getByRole('button', { name: 'Agree' }).click();
            yield (0, test_1.expect)(poMarketplace.appStatusTag).toHaveText('Disabled');
        }));
        (0, test_1.test)('expect not to allow enabling a recently installed private app in CE', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poMarketplace.lastAppRow.click();
            yield (0, test_1.expect)(poMarketplace.appStatusTag).toHaveText('Disabled');
            yield poMarketplace.appMenu.click();
            yield (0, test_1.expect)(poMarketplace.btnEnableApp).toBeDisabled();
        }));
    });
});
