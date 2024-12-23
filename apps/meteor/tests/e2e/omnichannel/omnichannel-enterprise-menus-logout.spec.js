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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../config/constants");
const inject_initial_data_1 = __importDefault(require("../fixtures/inject-initial-data"));
const test_1 = require("../utils/test");
test_1.test.describe('OC - Enterprise Menu Items After Relogin', () => {
    // Create page object and redirect to home
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto('/omnichannel/current');
        yield page.locator('role=textbox[name=/username/i]').waitFor({ state: 'visible' });
        yield page.locator('role=textbox[name=/username/i]').fill(constants_1.ADMIN_CREDENTIALS.email);
        yield page.locator('[name=password]').fill(constants_1.ADMIN_CREDENTIALS.password);
        yield page.locator('role=button[name="Login"]').click();
        yield page.locator('.main-content').waitFor();
    }));
    // Delete all data
    test_1.test.afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, inject_initial_data_1.default)();
    }));
    (0, test_1.test)('OC - Enterprise Menu Items - Logout & Login', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        test_1.test.skip(!constants_1.IS_EE);
        yield test_1.test.step('expect EE menu items to be visible', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(page.locator('a[href="/omnichannel/tags"]')).toBeVisible();
        }));
    }));
});
