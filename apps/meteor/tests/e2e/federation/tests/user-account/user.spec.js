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
const faker_1 = require("@faker-js/faker");
const constants = __importStar(require("../../config/constants"));
const account_profile_1 = require("../../page-objects/account-profile");
const channel_1 = require("../../page-objects/channel");
const auth_1 = require("../../utils/auth");
const channel_2 = require("../../utils/channel");
const format_1 = require("../../utils/format");
const register_user_1 = require("../../utils/register-user");
const test_1 = require("../../utils/test");
test_1.test.describe.parallel('Federation - User Account Pannel', () => {
    let poFederationChannelServer1;
    let poFederationChannelServer2;
    let poFederationAccountProfileServer1;
    let userFromServer2UsernameOnly;
    let createdChannelName;
    let pageForServer2;
    let usernameWithDomainFromServer2;
    const adminUsernameWithDomainFromServer1 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(constants.RC_SERVER_1.username, constants.RC_SERVER_1.matrixServerName);
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ apiServer1, apiServer2, browser }) {
        yield (0, test_1.setupTesting)(apiServer1);
        yield (0, test_1.setupTesting)(apiServer2);
        userFromServer2UsernameOnly = yield (0, register_user_1.registerUser)(apiServer2);
        const page = yield browser.newPage();
        poFederationChannelServer1 = new channel_1.FederationChannel(page);
        usernameWithDomainFromServer2 = (0, format_1.formatUsernameAndDomainIntoMatrixFormat)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
        const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
        createdChannelName = yield (0, channel_2.createChannelAndInviteRemoteUserToCreateLocalUser)({
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
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, page }) {
        pageForServer2 = yield browser.newPage();
        poFederationAccountProfileServer1 = new account_profile_1.FederationAccountProfile(page);
        poFederationChannelServer1 = new channel_1.FederationChannel(page);
        yield (0, auth_1.doLogin)({
            page,
            server: {
                url: constants.RC_SERVER_1.url,
                username: constants.RC_SERVER_1.username,
                password: constants.RC_SERVER_1.password,
            },
        });
        poFederationChannelServer2 = new channel_1.FederationChannel(pageForServer2);
        yield (0, auth_1.doLogin)({
            page: pageForServer2,
            server: {
                url: constants.RC_SERVER_2.url,
                username: userFromServer2UsernameOnly,
                password: constants.RC_SERVER_2.password,
            },
            storeState: false,
        });
        yield page.addInitScript(() => {
            window.localStorage.setItem('fuselage-localStorage-members-list-type', JSON.stringify('online'));
        });
    }));
    test_1.test.afterEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poFederationChannelServer1.sidenav.logout();
        yield page.close();
    }));
    (0, test_1.test)('expect to be able to edit a name in Server A and it must be reflected on Server B', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto(`${constants.RC_SERVER_1.url}/home`);
        yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
        const newName = faker_1.faker.person.fullName();
        yield page.goto(`${constants.RC_SERVER_1.url}/account/profile`);
        yield poFederationAccountProfileServer1.inputName.fill(newName);
        yield poFederationAccountProfileServer1.btnSubmit.click();
        yield page.goto(`${constants.RC_SERVER_1.url}/home`);
        yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
        yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
        yield poFederationChannelServer2.tabs.btnTabMembers.click();
        yield poFederationChannelServer2.tabs.members.showAllUsers();
        yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(adminUsernameWithDomainFromServer1)).toContainText(newName);
        yield pageForServer2.close();
    }));
    (0, test_1.test)('expect to be able to edit a name in Server B and it must be reflected on Server A', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto(`${constants.RC_SERVER_1.url}/home`);
        yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
        const poFederationAccountProfileServer2 = new account_profile_1.FederationAccountProfile(pageForServer2);
        const newName = faker_1.faker.person.fullName();
        yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/account/profile`);
        yield poFederationAccountProfileServer2.inputName.fill(newName);
        yield poFederationAccountProfileServer2.btnSubmit.click();
        yield pageForServer2.goto(`${constants.RC_SERVER_2.url}/home`);
        yield poFederationChannelServer1.sidenav.openChat(createdChannelName);
        yield poFederationChannelServer2.sidenav.openChat(createdChannelName);
        yield poFederationChannelServer1.tabs.btnTabMembers.click();
        yield poFederationChannelServer1.tabs.members.showAllUsers();
        yield (0, test_1.expect)(poFederationChannelServer1.tabs.members.getUserInList(usernameWithDomainFromServer2)).toContainText(newName);
        yield pageForServer2.close();
    }));
});
