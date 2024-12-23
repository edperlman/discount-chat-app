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
const setSettingValueById_1 = require("./utils/setSettingValueById");
const test_1 = require("./utils/test");
test_1.test.use({ storageState: userStates_1.Users.admin.state });
const userData = {
    username: faker_1.faker.string.uuid(),
    name: faker_1.faker.person.firstName(),
    email: faker_1.faker.internet.email(),
    password: faker_1.faker.internet.password(),
};
const findSysMes = (page, id) => page.locator(`[data-qa="system-message"][data-system-message-type="${id}"]`);
// There currently are over 33 system messages. Testing only a couple due to test being too slow right now.
// Ideally, we should test all.
test_1.test.describe.serial('System Messages', () => {
    let poHomeChannel;
    let user;
    let group;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'Hide_System_Messages', [])).status()).toBe(200);
        const groupResult = yield api.post('/groups.create', { name: faker_1.faker.string.uuid() });
        yield (0, test_1.expect)(groupResult.status()).toBe(200);
        group = (yield groupResult.json()).group;
        const result = yield api.post('/users.create', userData);
        (0, test_1.expect)(result.status()).toBe(200);
        user = (yield result.json()).user;
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poHomeChannel = new page_objects_1.HomeChannel(page);
        yield page.goto('/home');
        if (!(group === null || group === void 0 ? void 0 : group.name)) {
            return;
        }
        yield poHomeChannel.sidenav.openChat(group.name);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield (0, test_1.expect)((yield api.post('/groups.delete', { roomId: group._id })).status()).toBe(200);
    }));
    (0, test_1.test)('expect "User added" system message to be visible', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield (0, test_1.expect)((yield api.post('/groups.invite', { roomId: group._id, userId: user._id })).status()).toBe(200);
        yield (0, test_1.expect)(findSysMes(page, 'au')).toBeVisible();
    }));
    (0, test_1.test)('expect "User added" system message to be hidden', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'Hide_System_Messages', ['au'])).status()).toBe(200);
        yield (0, test_1.expect)(findSysMes(page, 'au')).not.toBeVisible();
    }));
    (0, test_1.test)('expect "User removed" system message to be visible', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield (0, test_1.expect)((yield api.post('/groups.kick', { roomId: group._id, userId: user._id })).status()).toBe(200);
        yield (0, test_1.expect)(findSysMes(page, 'ru')).toBeVisible();
    }));
    (0, test_1.test)('expect "User removed" system message to be hidden', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'Hide_System_Messages', ['ru'])).status()).toBe(200);
        yield (0, test_1.expect)(findSysMes(page, 'ru')).not.toBeVisible();
    }));
});
