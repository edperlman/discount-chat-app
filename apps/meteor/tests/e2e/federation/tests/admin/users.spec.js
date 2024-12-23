"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const constants = __importStar(require("../../config/constants"));
const admin_1 = require("../../page-objects/admin");
const channel_1 = require("../../page-objects/channel");
const auth_1 = require("../../utils/auth");
const channel_2 = require("../../utils/channel");
const format_1 = require("../../utils/format");
const register_user_1 = require("../../utils/register-user");
const test_1 = require("../../utils/test");
test_1.test.describe.parallel('Federation - Admin Panel - Users', () => {
    let poFederationChannelServer1;
    let userFromServer2UsernameOnly;
    let usernameWithDomainFromServer2;
    let poFederationAdmin;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poFederationAdmin = new admin_1.FederationAdmin(page);
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ apiServer1, apiServer2, browser }) {
        yield (0, test_1.setupTesting)(apiServer1);
        yield (0, test_1.setupTesting)(apiServer2);
        userFromServer2UsernameOnly = yield (0, register_user_1.registerUser)(apiServer2);
        usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
        const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
        const page = yield browser.newPage();
        poFederationChannelServer1 = new channel_1.FederationChannel(page);
        yield (0, channel_2.createChannelAndInviteRemoteUserToCreateLocalUser)({
            page,
            poFederationChannelServer: poFederationChannelServer1,
            fullUsernameFromServer: fullUsernameFromServer2,
            server: constants.RC_SERVER_1,
        });
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ apiServer1, apiServer2 }) {
        yield (0, test_1.tearDownTesting)(apiServer1);
        yield (0, test_1.tearDownTesting)(apiServer2);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poFederationChannelServer1 = new channel_1.FederationChannel(page);
        yield (0, auth_1.doLogin)({
            page,
            server: {
                url: constants.RC_SERVER_1.url,
                username: constants.RC_SERVER_1.username,
                password: constants.RC_SERVER_1.password,
            },
        });
        yield page.goto(`${constants.RC_SERVER_1.url}/admin/users`);
    }));
    (0, test_1.test)('expect to not be able to edit federated users from the admin panel', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poFederationAdmin.inputSearchUsers.type(usernameWithDomainFromServer2);
        yield page.locator(`table tr`).locator(`figure[data-username="${usernameWithDomainFromServer2}"]`).click();
        yield (0, test_1.expect)(poFederationAdmin.tabs.users.btnEdit).toBeDisabled();
    }));
    (0, test_1.test)('expect to not be able to edit federated users from the admin panel (trying to bypass by url)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poFederationAdmin.inputSearchUsers.type(usernameWithDomainFromServer2);
        yield page.locator(`table tr`).locator(`figure[data-username="${usernameWithDomainFromServer2}"]`).click();
        yield (0, test_1.expect)(poFederationAdmin.tabs.users.btnEdit).toBeDisabled();
        const currentUrl = yield page.url();
        yield page.goto(`${currentUrl.replace('info', 'edit')}`);
        yield (0, test_1.expect)(page.locator('.rcx-box.rcx-box--full.rcx-callout__wrapper')).toBeVisible();
        yield (0, test_1.expect)(page.locator('.rcx-box.rcx-box--full.rcx-callout__wrapper').locator('.rcx-box.rcx-box--full.rcx-callout__children')).toContainText('Not possible to edit a federated user');
    }));
    (0, test_1.test)('expect not to have the kebab menu enabled, since there should not be any menu option enabled for federated users', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, }) {
        yield poFederationAdmin.inputSearchUsers.type(usernameWithDomainFromServer2);
        yield page.locator(`table tr`).locator(`figure[data-username="${usernameWithDomainFromServer2}"]`).click();
        yield (0, test_1.expect)(page.locator('[data-testid="menu"]')).not.toBeVisible();
    }));
    (0, test_1.test)('expect to federated users (remote only) not being counted as a seat cap in an EE environment', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page, apiServer2, }) {
        var _b, _c;
        const before = parseInt(((_b = (yield page.locator('role=status').textContent())) === null || _b === void 0 ? void 0 : _b.replace('Seats Available', '').trim()) || '0');
        const newUserFromServer2 = yield (0, register_user_1.registerUser)(apiServer2);
        const page2 = yield browser.newPage();
        const poFederationChannelServer1ForUser2 = new channel_1.FederationChannel(page2);
        const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(newUserFromServer2, constants.RC_SERVER_2.matrixServerName);
        yield (0, channel_2.createChannelAndInviteRemoteUserToCreateLocalUser)({
            page: page2,
            poFederationChannelServer: poFederationChannelServer1ForUser2,
            fullUsernameFromServer: fullUsernameFromServer2,
            server: constants.RC_SERVER_1,
        });
        const after = parseInt(((_c = (yield page.locator('role=status').textContent())) === null || _c === void 0 ? void 0 : _c.replace('Seats Available', '').trim()) || '0');
        (0, test_1.expect)(before).toEqual(after);
        yield page2.close();
    }));
    (0, test_1.test)('expect to federated users (but local ones) being counted as a seat cap in an EE environment', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page, apiServer1, }) {
        var _b, _c;
        const before = parseInt(((_b = (yield page.locator('role=status').textContent())) === null || _b === void 0 ? void 0 : _b.replace('Seats Available', '').trim()) || '0');
        const newUserFromServer1 = yield (0, register_user_1.registerUser)(apiServer1);
        const page2 = yield browser.newPage();
        const poFederationChannelServer1ForUser2 = new channel_1.FederationChannel(page2);
        const fullUsernameFromServer1 = (0, format_1.formatIntoFullMatrixUsername)(newUserFromServer1, constants.RC_SERVER_1.matrixServerName);
        yield (0, channel_2.createChannelAndInviteRemoteUserToCreateLocalUser)({
            page: page2,
            poFederationChannelServer: poFederationChannelServer1ForUser2,
            fullUsernameFromServer: fullUsernameFromServer1,
            server: constants.RC_SERVER_1,
        });
        yield page.reload();
        const after = parseInt(((_c = (yield page.locator('role=status').textContent())) === null || _c === void 0 ? void 0 : _c.replace('Seats Available', '').trim()) || '0');
        (0, test_1.expect)(before).not.toEqual(after);
        (0, test_1.expect)(before - 1).toEqual(after);
        yield page2.close();
    }));
});
