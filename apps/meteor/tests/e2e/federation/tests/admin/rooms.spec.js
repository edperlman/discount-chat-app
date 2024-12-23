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
const admin_1 = require("../../page-objects/admin");
const channel_1 = require("../../page-objects/channel");
const auth_1 = require("../../utils/auth");
const channel_2 = require("../../utils/channel");
const format_1 = require("../../utils/format");
const register_user_1 = require("../../utils/register-user");
const test_1 = require("../../utils/test");
test_1.test.describe.parallel('Federation - Admin Panel - Rooms', () => {
    let poFederationChannelServer1;
    let userFromServer2UsernameOnly;
    const channelName = faker_1.faker.string.uuid();
    let poFederationAdmin;
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ apiServer1, apiServer2, browser }) {
        yield (0, test_1.setupTesting)(apiServer1);
        yield (0, test_1.setupTesting)(apiServer2);
        userFromServer2UsernameOnly = yield (0, register_user_1.registerUser)(apiServer2);
        const fullUsernameFromServer2 = (0, format_1.formatIntoFullMatrixUsername)(userFromServer2UsernameOnly, constants.RC_SERVER_2.matrixServerName);
        const page = yield browser.newPage();
        poFederationChannelServer1 = new channel_1.FederationChannel(page);
        yield (0, auth_1.doLogin)({
            page,
            server: constants.RC_SERVER_1,
        });
        yield page.goto(`${constants.RC_SERVER_1.url}/home`);
        yield (0, channel_2.createChannelUsingAPI)(apiServer2, channelName);
        yield poFederationChannelServer1.createPublicChannelAndInviteUsersUsingCreationModal(channelName, [fullUsernameFromServer2]);
        yield page.close();
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ apiServer1, apiServer2 }) {
        yield (0, test_1.tearDownTesting)(apiServer1);
        yield (0, test_1.tearDownTesting)(apiServer2);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poFederationAdmin = new admin_1.FederationAdmin(page);
        yield (0, auth_1.doLogin)({
            page,
            server: {
                url: constants.RC_SERVER_2.url,
                username: constants.RC_SERVER_2.username,
                password: constants.RC_SERVER_2.password,
            },
        });
        yield page.goto(`${constants.RC_SERVER_2.url}/admin/rooms`);
    }));
    (0, test_1.test)('expect to have the 2 rooms(with the same name) created and showing correctly', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poFederationAdmin.inputSearchRooms.type(channelName);
        yield page.waitForTimeout(5000);
        yield (0, test_1.expect)(yield page.locator(`table tbody tr`).count()).toBe(2);
    }));
    (0, test_1.test)('expect to be able to edit only (name, topic and favorite) when the room is a federated one', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield poFederationAdmin.inputSearchRooms.type(channelName);
        yield page.waitForTimeout(5000);
        yield page.locator(`table tbody tr`).first().click();
        yield (0, test_1.expect)(poFederationAdmin.roomsInputName).not.toBeDisabled();
        yield (0, test_1.expect)(poFederationAdmin.roomsInputTopic).not.toBeDisabled();
        yield (0, test_1.expect)(poFederationAdmin.roomsInputFavorite).not.toBeDisabled();
        yield (0, test_1.expect)(poFederationAdmin.roomsInputDescription).not.toBeVisible();
        yield (0, test_1.expect)(poFederationAdmin.roomsInputAnnouncement).not.toBeVisible();
        yield (0, test_1.expect)(poFederationAdmin.roomsInputPrivate).not.toBeVisible();
        yield (0, test_1.expect)(poFederationAdmin.roomsInputReadOnly).not.toBeVisible();
        yield (0, test_1.expect)(poFederationAdmin.roomsInputArchived).not.toBeVisible();
        yield (0, test_1.expect)(poFederationAdmin.roomsInputDefault).toBeDisabled();
        yield (0, test_1.expect)(poFederationAdmin.roomsInputFeatured).toBeDisabled();
        yield (0, test_1.expect)(poFederationAdmin.roomsBtnDelete).toBeDisabled();
        yield (0, test_1.expect)(poFederationAdmin.roomsBtnUploadAvatar).toBeDisabled();
        yield (0, test_1.expect)(poFederationAdmin.roomsBtnDefaultAvatar).toBeDisabled();
    }));
});
