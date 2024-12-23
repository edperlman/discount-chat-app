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
const setSettingValueById_1 = require("./utils/setSettingValueById");
const setUserPreferences_1 = require("./utils/setUserPreferences");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
test_1.test.describe('Translations', () => {
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        (0, test_1.expect)((yield (0, setUserPreferences_1.setUserPreferences)(api, { language: '' })).status()).toBe(200);
        (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'Language', 'en')).status()).toBe(200);
        (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'Site_Name', 'Rocket.Chat')).status()).toBe(200);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        (0, test_1.expect)((yield (0, setUserPreferences_1.setUserPreferences)(api, { language: '' })).status()).toBe(200);
        (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'Language', 'en')).status()).toBe(200);
    }));
    (0, test_1.test)("expect to display text in the user's preference language", (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield page.goto('/home');
        yield page.waitForTimeout(5000);
        yield (0, test_1.expect)(page.locator('h2')).toHaveText('Welcome to Rocket.Chat');
        const response = page.waitForResponse('**/i18n/pt-BR.json');
        (0, test_1.expect)((yield (0, setUserPreferences_1.setUserPreferences)(api, { language: 'pt-BR' })).status()).toBe(200);
        yield response;
        yield (0, test_1.expect)(page.locator('h2')).toHaveText('Bem-vindo ao Rocket.Chat');
        (0, test_1.expect)((yield (0, setUserPreferences_1.setUserPreferences)(api, { language: '' })).status()).toBe(200);
    }));
    (0, test_1.test)('expect to keep chosen language after refresh', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield page.goto('/home');
        yield (0, test_1.expect)(page.locator('h2')).toHaveText('Welcome to Rocket.Chat');
        const response = page.waitForResponse('**/i18n/pt-BR.json');
        (0, test_1.expect)((yield (0, setUserPreferences_1.setUserPreferences)(api, { language: 'pt-BR' })).status()).toBe(200);
        yield response;
        yield (0, test_1.expect)(page.locator('h2')).toHaveText('Bem-vindo ao Rocket.Chat');
        // Test if selected language remaing after refresh
        yield page.goto('/home');
        yield (0, test_1.expect)(page.locator('h2')).toHaveText('Bem-vindo ao Rocket.Chat');
        (0, test_1.expect)((yield (0, setUserPreferences_1.setUserPreferences)(api, { language: '' })).status()).toBe(200);
    }));
    test_1.test.describe('Browser', () => __awaiter(void 0, void 0, void 0, function* () {
        test_1.test.use({ locale: 'pt-BR' });
        (0, test_1.test)("expect to display text in the browser's language", (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
            yield page.goto('/home');
            yield (0, test_1.expect)(page.locator('h2')).toHaveText('Bem-vindo ao Rocket.Chat');
        }));
    }));
});
