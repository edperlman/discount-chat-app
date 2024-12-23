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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
const path_1 = __importDefault(require("path"));
const faker_1 = require("@faker-js/faker");
const docker_compose_1 = require("docker-compose");
const mongodb_1 = require("mongodb");
const constants = __importStar(require("./config/constants"));
const users_1 = require("./fixtures/collections/users");
const userStates_1 = require("./fixtures/userStates");
const page_objects_1 = require("./page-objects");
const convertHexToRGB_1 = require("./utils/convertHexToRGB");
const custom_role_1 = require("./utils/custom-role");
const getUserInfo_1 = require("./utils/getUserInfo");
const parseMeteorResponse_1 = require("./utils/parseMeteorResponse");
const setSettingValueById_1 = require("./utils/setSettingValueById");
const test_1 = require("./utils/test");
const resetTestData = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* ({ api, cleanupOnly = false } = {}) {
    // Reset saml users' data on mongo in the beforeAll hook to allow re-running the tests within the same playwright session
    // This is needed because those tests will modify this data and running them a second time would trigger different code paths
    const connection = yield mongodb_1.MongoClient.connect(constants.URL_MONGODB);
    const usernamesToDelete = [userStates_1.Users.userForSamlMerge, userStates_1.Users.userForSamlMerge2, userStates_1.Users.samluser1, userStates_1.Users.samluser2, userStates_1.Users.samluser4].map(({ data: { username } }) => username);
    yield connection
        .db()
        .collection('users')
        .deleteMany({
        username: {
            $in: usernamesToDelete,
        },
    });
    if (cleanupOnly) {
        return;
    }
    const usersFixtures = [userStates_1.Users.userForSamlMerge, userStates_1.Users.userForSamlMerge2].map((user) => (0, users_1.createUserFixture)(user));
    yield Promise.all(usersFixtures.map((user) => connection.db().collection('users').updateOne({ username: user.username }, { $set: user }, { upsert: true })));
    const settings = [
        { _id: 'Accounts_AllowAnonymousRead', value: false },
        { _id: 'SAML_Custom_Default_logout_behaviour', value: 'SAML' },
        { _id: 'SAML_Custom_Default_immutable_property', value: 'EMail' },
        { _id: 'SAML_Custom_Default_mail_overwrite', value: false },
        { _id: 'SAML_Custom_Default_name_overwrite', value: false },
        { _id: 'SAML_Custom_Default', value: false },
        { _id: 'SAML_Custom_Default_role_attribute_sync', value: true },
        { _id: 'SAML_Custom_Default_role_attribute_name', value: 'role' },
        { _id: 'SAML_Custom_Default_user_data_fieldmap', value: '{"username":"username", "email":"email", "name": "cn"}' },
        { _id: 'SAML_Custom_Default_provider', value: 'test-sp' },
        { _id: 'SAML_Custom_Default_issuer', value: 'http://localhost:3000/_saml/metadata/test-sp' },
        { _id: 'SAML_Custom_Default_entry_point', value: 'http://localhost:8080/simplesaml/saml2/idp/SSOService.php' },
        { _id: 'SAML_Custom_Default_idp_slo_redirect_url', value: 'http://localhost:8080/simplesaml/saml2/idp/SingleLogoutService.php' },
        { _id: 'SAML_Custom_Default_button_label_text', value: 'SAML test login button' },
        { _id: 'SAML_Custom_Default_button_color', value: '#185925' },
    ];
    yield Promise.all(settings.map(({ _id, value }) => (0, setSettingValueById_1.setSettingValueById)(api, _id, value)));
});
const setupCustomRole = (api) => __awaiter(void 0, void 0, void 0, function* () {
    const roleResponse = yield (0, custom_role_1.createCustomRole)(api, { name: 'saml-role' });
    (0, test_1.expect)(roleResponse.status()).toBe(200);
    const { role } = yield roleResponse.json();
    return role._id;
});
test_1.test.describe('SAML', () => {
    let poRegistration;
    let samlRoleId;
    let targetInviteGroupId;
    let targetInviteGroupName;
    let inviteId;
    const containerPath = path_1.default.join(__dirname, 'containers', 'saml');
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield resetTestData({ api });
        // Only one setting updated through the API to avoid refreshing the service configurations several times
        yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'SAML_Custom_Default', true)).status()).toBe(200);
        // Create a new custom role
        if (constants.IS_EE) {
            samlRoleId = yield setupCustomRole(api);
        }
        yield docker_compose_1.v2.buildOne('testsamlidp_idp', {
            cwd: containerPath,
        });
        yield docker_compose_1.v2.upOne('testsamlidp_idp', {
            cwd: containerPath,
        });
    }));
    test_1.test.beforeAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        const groupResponse = yield api.post('/groups.create', { name: faker_1.faker.string.uuid() });
        (0, test_1.expect)(groupResponse.status()).toBe(200);
        const { group } = yield groupResponse.json();
        targetInviteGroupId = group._id;
        targetInviteGroupName = group.name;
        const inviteResponse = yield api.post('/findOrCreateInvite', { rid: targetInviteGroupId, days: 1, maxUses: 0 });
        (0, test_1.expect)(inviteResponse.status()).toBe(200);
        const { _id } = yield inviteResponse.json();
        inviteId = _id;
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield docker_compose_1.v2.down({
            cwd: containerPath,
        });
        // the compose CLI doesn't have any way to remove images, so try to remove it with a direct call to the docker cli, but ignore errors if it fails.
        try {
            child_process_1.default.spawn('docker', ['rmi', 'saml-testsamlidp_idp'], {
                cwd: containerPath,
            });
        }
        catch (_b) {
            // ignore errors here
        }
        // Remove saml test users so they don't interfere with other tests
        yield resetTestData({ cleanupOnly: true });
        // Remove created custom role
        if (constants.IS_EE) {
            (0, test_1.expect)((yield (0, custom_role_1.deleteCustomRole)(api, 'saml-role')).status()).toBe(200);
        }
    }));
    test_1.test.afterAll((_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        (0, test_1.expect)((yield api.post('/groups.delete', { roomId: targetInviteGroupId })).status()).toBe(200);
    }));
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        poRegistration = new page_objects_1.Registration(page);
        yield page.goto('/home');
    }));
    (0, test_1.test)('Login', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield test_1.test.step('expect to have SAML login button available', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poRegistration.btnLoginWithSaml).toBeVisible({ timeout: 10000 });
        }));
        yield test_1.test.step('expect to have SAML login button to have the required background color', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(poRegistration.btnLoginWithSaml).toHaveCSS('background-color', (0, convertHexToRGB_1.convertHexToRGB)('#185925'));
        }));
        yield test_1.test.step('expect to be redirected to the IdP for login', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poRegistration.btnLoginWithSaml.click();
            yield (0, test_1.expect)(page).toHaveURL(/.*\/simplesaml\/module.php\/core\/loginuserpass.php.*/);
        }));
        yield test_1.test.step('expect to be redirected back on successful login', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.getByLabel('Username').fill('samluser1');
            yield page.getByLabel('Password').fill('password');
            yield page.locator('role=button[name="Login"]').click();
            yield (0, test_1.expect)(page).toHaveURL('/home');
        }));
        yield test_1.test.step('expect user data to have been mapped to the correct fields', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const user = yield (0, getUserInfo_1.getUserInfo)(api, 'samluser1');
            (0, test_1.expect)(user).toBeDefined();
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.username).toBe('samluser1');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.name).toBe('Saml User 1');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.emails).toBeDefined();
            (0, test_1.expect)((_a = user === null || user === void 0 ? void 0 : user.emails) === null || _a === void 0 ? void 0 : _a[0].address).toBe('samluser1@example.com');
        }));
    }));
    (0, test_1.test)('Allow password change for OAuth users', (_a) => __awaiter(void 0, [_a], void 0, function* ({ api }) {
        yield test_1.test.step("should not send password reset mail if 'Allow Password Change for OAuth Users' setting is disabled", () => __awaiter(void 0, void 0, void 0, function* () {
            (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_AllowPasswordChangeForOAuthUsers', false)).status()).toBe(200);
            const response = yield api.post('/method.call/sendForgotPasswordEmail', {
                message: JSON.stringify({ msg: 'method', id: 'id', method: 'sendForgotPasswordEmail', params: ['samluser1@example.com'] }),
            });
            const mailSent = yield (0, parseMeteorResponse_1.parseMeteorResponse)(response);
            (0, test_1.expect)(response.status()).toBe(200);
            (0, test_1.expect)(mailSent).toBe(false);
        }));
        yield test_1.test.step("should send password reset mail if 'Allow Password Change for OAuth Users' setting is enabled", () => __awaiter(void 0, void 0, void 0, function* () {
            (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'Accounts_AllowPasswordChangeForOAuthUsers', true)).status()).toBe(200);
            const response = yield api.post('/method.call/sendForgotPasswordEmail', {
                message: JSON.stringify({ msg: 'method', id: 'id', method: 'sendForgotPasswordEmail', params: ['samluser1@example.com'] }),
            });
            const mailSent = yield (0, parseMeteorResponse_1.parseMeteorResponse)(response);
            (0, test_1.expect)(response.status()).toBe(200);
            (0, test_1.expect)(mailSent).toBe(true);
        }));
    }));
    const doLoginStep = (page_1, username_1, ...args_1) => __awaiter(void 0, [page_1, username_1, ...args_1], void 0, function* (page, username, redirectUrl = '/home') {
        yield test_1.test.step('expect successful login', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poRegistration.btnLoginWithSaml.click();
            // Redirect to Idp
            yield (0, test_1.expect)(page).toHaveURL(/.*\/simplesaml\/module.php\/core\/loginuserpass.php.*/);
            // Fill username and password
            yield page.getByLabel('Username').fill(username);
            yield page.getByLabel('Password').fill('password');
            yield page.locator('role=button[name="Login"]').click();
            // Redirect back to rocket.chat
            if (redirectUrl) {
                yield (0, test_1.expect)(page).toHaveURL(redirectUrl);
                yield (0, test_1.expect)(page.getByRole('button', { name: 'User menu' })).toBeVisible();
            }
        }));
    });
    const doLogoutStep = (page) => __awaiter(void 0, void 0, void 0, function* () {
        yield test_1.test.step('logout', () => __awaiter(void 0, void 0, void 0, function* () {
            yield page.getByRole('button', { name: 'User menu' }).click();
            yield page.locator('//*[contains(@class, "rcx-option__content") and contains(text(), "Logout")]').click();
            yield (0, test_1.expect)(page).toHaveURL('/home');
            yield (0, test_1.expect)(page.getByRole('button', { name: 'User menu' })).not.toBeVisible();
        }));
    });
    (0, test_1.test)('Logout - Rocket.Chat only', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield test_1.test.step('Configure logout to only logout from Rocket.Chat', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'SAML_Custom_Default_logout_behaviour', 'Local')).status()).toBe(200);
        }));
        yield page.goto('/home');
        yield doLoginStep(page, 'samluser1');
        yield doLogoutStep(page);
        yield test_1.test.step('expect IdP to redirect back automatically on new login request', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poRegistration.btnLoginWithSaml.click();
            yield (0, test_1.expect)(page).toHaveURL('/home');
        }));
    }));
    (0, test_1.test)('Logout - Single Sign Out', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield test_1.test.step('Configure logout to terminate SAML session', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'SAML_Custom_Default_logout_behaviour', 'SAML')).status()).toBe(200);
        }));
        yield page.goto('/home');
        yield doLoginStep(page, 'samluser1');
        yield doLogoutStep(page);
        yield test_1.test.step('expect IdP to show login form on new login request', () => __awaiter(void 0, void 0, void 0, function* () {
            yield poRegistration.btnLoginWithSaml.click();
            yield (0, test_1.expect)(page).toHaveURL(/.*\/simplesaml\/module.php\/core\/loginuserpass.php.*/);
            yield (0, test_1.expect)(page.getByLabel('Username')).toBeVisible();
        }));
    }));
    (0, test_1.test)('User Merge - By Email', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield test_1.test.step('Configure SAML to identify users by email', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'SAML_Custom_Default_immutable_property', 'EMail')).status()).toBe(200);
        }));
        yield doLoginStep(page, 'samluser2');
        yield test_1.test.step('expect user data to have been mapped to the correct fields', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const user = yield (0, getUserInfo_1.getUserInfo)(api, 'samluser2');
            (0, test_1.expect)(user).toBeDefined();
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user._id).toBe('user_for_saml_merge');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.username).toBe('samluser2');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.name).toBe('user_for_saml_merge');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.emails).toBeDefined();
            (0, test_1.expect)((_a = user === null || user === void 0 ? void 0 : user.emails) === null || _a === void 0 ? void 0 : _a[0].address).toBe('user_for_saml_merge@email.com');
        }));
    }));
    (0, test_1.test)('User Merge - By Email with Name Override', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield test_1.test.step('Configure SAML to identify users by email', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'SAML_Custom_Default_immutable_property', 'EMail')).status()).toBe(200);
            (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'SAML_Custom_Default_name_overwrite', true)).status()).toBe(200);
        }));
        yield doLoginStep(page, 'samluser2');
        yield test_1.test.step('expect user data to have been mapped to the correct fields', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const user = yield (0, getUserInfo_1.getUserInfo)(api, 'samluser2');
            (0, test_1.expect)(user).toBeDefined();
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user._id).toBe('user_for_saml_merge');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.username).toBe('samluser2');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.name).toBe('Saml User 2');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.emails).toBeDefined();
            (0, test_1.expect)((_a = user === null || user === void 0 ? void 0 : user.emails) === null || _a === void 0 ? void 0 : _a[0].address).toBe('user_for_saml_merge@email.com');
        }));
    }));
    (0, test_1.test)('User Merge - By Username', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield test_1.test.step('Configure SAML to identify users by username', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'SAML_Custom_Default_immutable_property', 'Username')).status()).toBe(200);
            (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'SAML_Custom_Default_name_overwrite', false)).status()).toBe(200);
            (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'SAML_Custom_Default_mail_overwrite', false)).status()).toBe(200);
        }));
        yield doLoginStep(page, 'samluser3');
        yield test_1.test.step('expect user data to have been mapped to the correct fields', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const user = yield (0, getUserInfo_1.getUserInfo)(api, 'user_for_saml_merge2');
            (0, test_1.expect)(user).toBeDefined();
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user._id).toBe('user_for_saml_merge2');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.username).toBe('user_for_saml_merge2');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.name).toBe('user_for_saml_merge2');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.emails).toBeDefined();
            (0, test_1.expect)((_a = user === null || user === void 0 ? void 0 : user.emails) === null || _a === void 0 ? void 0 : _a[0].address).toBe('user_for_saml_merge2@email.com');
        }));
    }));
    (0, test_1.test)('User Merge - By Username with Email Override', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield test_1.test.step('Configure SAML to identify users by username', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'SAML_Custom_Default_immutable_property', 'Username')).status()).toBe(200);
            (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'SAML_Custom_Default_name_overwrite', false)).status()).toBe(200);
            (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'SAML_Custom_Default_mail_overwrite', true)).status()).toBe(200);
        }));
        yield doLoginStep(page, 'samluser3');
        yield test_1.test.step('expect user data to have been mapped to the correct fields', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const user = yield (0, getUserInfo_1.getUserInfo)(api, 'user_for_saml_merge2');
            (0, test_1.expect)(user).toBeDefined();
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user._id).toBe('user_for_saml_merge2');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.username).toBe('user_for_saml_merge2');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.name).toBe('user_for_saml_merge2');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.emails).toBeDefined();
            (0, test_1.expect)((_a = user === null || user === void 0 ? void 0 : user.emails) === null || _a === void 0 ? void 0 : _a[0].address).toBe('samluser3@example.com');
        }));
    }));
    (0, test_1.test)('User Merge - By Username with Name Override', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        yield test_1.test.step('Configure SAML to identify users by username', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'SAML_Custom_Default_immutable_property', 'Username')).status()).toBe(200);
            yield (0, test_1.expect)((yield (0, setSettingValueById_1.setSettingValueById)(api, 'SAML_Custom_Default_name_overwrite', true)).status()).toBe(200);
        }));
        yield doLoginStep(page, 'samluser3');
        yield test_1.test.step('expect user data to have been mapped to the correct fields', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const user = yield (0, getUserInfo_1.getUserInfo)(api, 'user_for_saml_merge2');
            (0, test_1.expect)(user).toBeDefined();
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user._id).toBe('user_for_saml_merge2');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.username).toBe('user_for_saml_merge2');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.name).toBe('Saml User 3');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.emails).toBeDefined();
            (0, test_1.expect)((_a = user === null || user === void 0 ? void 0 : user.emails) === null || _a === void 0 ? void 0 : _a[0].address).toBe('samluser3@example.com');
        }));
    }));
    (0, test_1.test)('User Mapping - Custom Role', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, api }) {
        test_1.test.skip(!constants.IS_EE);
        yield doLoginStep(page, 'samluser4');
        yield test_1.test.step('expect users role to have been mapped correctly', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            const user = yield (0, getUserInfo_1.getUserInfo)(api, 'samluser4');
            (0, test_1.expect)(user).toBeDefined();
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.username).toBe('samluser4');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.name).toBe('Saml User 4');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.emails).toBeDefined();
            (0, test_1.expect)((_a = user === null || user === void 0 ? void 0 : user.emails) === null || _a === void 0 ? void 0 : _a[0].address).toBe('samluser4@example.com');
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.roles).toBeDefined();
            (0, test_1.expect)((_b = user === null || user === void 0 ? void 0 : user.roles) === null || _b === void 0 ? void 0 : _b.length).toBe(1);
            (0, test_1.expect)(user === null || user === void 0 ? void 0 : user.roles).toContain(samlRoleId);
        }));
    }));
    (0, test_1.test)('Redirect to a specific group after login when using a valid invite link', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield page.goto(`/invite/${inviteId}`);
        yield page.getByRole('link', { name: 'Back to Login' }).click();
        yield doLoginStep(page, 'samluser1', null);
        yield test_1.test.step('expect to be redirected to the invited room after succesful login', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(page).toHaveURL(`/group/${targetInviteGroupName}`);
        }));
    }));
    (0, test_1.test)('Redirect to home after login when no redirectUrl is provided', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield doLoginStep(page, 'samluser2');
        yield test_1.test.step('expect to be redirected to the homepage after succesful login', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, test_1.expect)(page).toHaveURL('/home');
        }));
    }));
    test_1.test.fixme('User Merge - By Custom Identifier', () => __awaiter(void 0, void 0, void 0, function* () {
        // Test user merge with a custom identifier configured in the fieldmap
    }));
    test_1.test.fixme('Signature Validation', () => __awaiter(void 0, void 0, void 0, function* () {
        // Test login with signed responses
    }));
    test_1.test.fixme('Login - User without username', () => __awaiter(void 0, void 0, void 0, function* () {
        // Test login with a SAML user with no username
        // Test different variations of the Immutable Property setting
    }));
    test_1.test.fixme('Login - User without email', () => __awaiter(void 0, void 0, void 0, function* () {
        // Test login with a SAML user with no email
        // Test different variations of the Immutable Property setting
    }));
    test_1.test.fixme('Login - User without name', () => __awaiter(void 0, void 0, void 0, function* () {
        // Test login with a SAML user with no name
    }));
    test_1.test.fixme('Login - User with channels attribute', () => __awaiter(void 0, void 0, void 0, function* () {
        // Test login with a SAML user with a "channels" attribute
    }));
    test_1.test.fixme('Data Sync - Custom Field Map', () => __awaiter(void 0, void 0, void 0, function* () {
        // Test the data sync using a custom fieldmap setting
    }));
});
