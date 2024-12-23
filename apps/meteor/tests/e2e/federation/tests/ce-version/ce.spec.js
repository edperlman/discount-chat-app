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
const channel_1 = require("../../page-objects/channel");
const auth_1 = require("../../utils/auth");
const channel_2 = require("../../utils/channel");
const format_1 = require("../../utils/format");
const register_user_1 = require("../../utils/register-user");
const test_1 = require("../../utils/test");
test_1.test.describe.parallel('Federation - CE version', () => {
    let poFederationChannelServer2;
    let userFromServer2UsernameOnly;
    let userFromServer1UsernameOnly;
    let fullUsernameFromServer1;
    let fullUsernameFromServer2;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ apiServer1, apiServer2, browser }) {
        yield (0, test_1.setupTesting)(apiServer1);
        yield (0, test_1.setupTesting)(apiServer2);
        userFromServer1UsernameOnly = yield (0, register_user_1.registerUser)(apiServer1);
        userFromServer2UsernameOnly = yield (0, register_user_1.registerUser)(apiServer2);
        fullUsernameFromServer1 = (0, format_1.formatIntoFullMatrixUsername)(userFromServer1UsernameOnly, constants.RC_SERVER_1.matrixServerName);
        fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
        const page = yield browser.newPage();
        poFederationChannelServer2 = new channel_1.FederationChannel(page);
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ apiServer1, apiServer2 }) {
        yield (0, test_1.tearDownTesting)(apiServer1);
        yield (0, test_1.tearDownTesting)(apiServer2);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poFederationChannelServer2 = new channel_1.FederationChannel(page);
        yield (0, auth_1.doLogin)({
            page,
            server: {
                url: constants.RC_SERVER_2.url,
                username: constants.RC_SERVER_2.username,
                password: constants.RC_SERVER_2.password,
            },
        });
        yield page.goto(`${constants.RC_SERVER_2.url}/home`);
    }));
    (0, test_1.test)('expect to not be able to create channels from the UI', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poFederationChannelServer2.sidenav.openNewByLabel('Channel');
        yield (0, test_1.expect)(poFederationChannelServer2.sidenav.checkboxFederatedChannel).toBeDisabled();
    }));
    (0, test_1.test)('expect to not be able to create DMs from UI inviting external users (an user who does not exists on the server yet)', () => __awaiter(void 0, void 0, void 0, function* () {
        yield poFederationChannelServer2.createDirectMessagesUsingModal([fullUsernameFromServer1]);
        yield (0, test_1.expect)(poFederationChannelServer2.toastError).toBeVisible();
    }));
    (0, test_1.test)('expect to not be able to create DMs from UI inviting external users (an user who already exists in the server)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, }) {
        const page2 = yield browser.newPage();
        const poFederationChannelServer1 = new channel_1.FederationChannel(page2);
        yield (0, channel_2.createGroupAndInviteRemoteUserToCreateLocalUser)({
            page: page2,
            poFederationChannelServer: poFederationChannelServer1,
            fullUsernameFromServer: fullUsernameFromServer2,
            server: constants.RC_SERVER_1,
        });
        yield poFederationChannelServer2.createDirectMessagesUsingModal([fullUsernameFromServer1]);
        yield (0, test_1.expect)(poFederationChannelServer2.toastError).toBeVisible();
    }));
    (0, test_1.test)('expect to not be able to invite federated users to non-federated rooms (using modal)', () => __awaiter(void 0, void 0, void 0, function* () {
        const channelName = faker_1.faker.string.uuid();
        yield poFederationChannelServer2.createNonFederatedPublicChannelAndInviteUsersUsingCreationModal(channelName, [
            fullUsernameFromServer2,
        ]);
        yield poFederationChannelServer2.sidenav.openChat(channelName);
        yield poFederationChannelServer2.tabs.btnTabMembers.click();
        yield poFederationChannelServer2.tabs.members.showAllUsers();
        yield (0, test_1.expect)(poFederationChannelServer2.tabs.members.getUserInList(constants.RC_SERVER_2.username)).toBeVisible();
    }));
});
