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
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const sleep_1 = require("../../../lib/utils/sleep");
const api_data_1 = require("../../data/api-data");
const permissions_helper_1 = require("../../data/permissions.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
(0, mocha_1.describe)('[Failed Login Attempts]', () => {
    const maxAttemptsByUser = 2;
    const maxAttemptsByIp = 4;
    const userBlockSeconds = 3;
    const ipBlockSeconds = 8;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)(() => Promise.all([
        (0, permissions_helper_1.updateSetting)('Block_Multiple_Failed_Logins_Enabled', true),
        (0, permissions_helper_1.updateSetting)('Block_Multiple_Failed_Logins_By_Ip', true),
        (0, permissions_helper_1.updateSetting)('Block_Multiple_Failed_Logins_By_User', true),
        (0, permissions_helper_1.updateSetting)('Block_Multiple_Failed_Logins_Attempts_Until_Block_by_User', maxAttemptsByUser),
        (0, permissions_helper_1.updateSetting)('Block_Multiple_Failed_Logins_Time_To_Unblock_By_User_In_Minutes', userBlockSeconds / 60),
        (0, permissions_helper_1.updateSetting)('Block_Multiple_Failed_Logins_Attempts_Until_Block_By_Ip', maxAttemptsByIp),
        (0, permissions_helper_1.updateSetting)('Block_Multiple_Failed_Logins_Time_To_Unblock_By_Ip_In_Minutes', ipBlockSeconds / 60),
        (0, permissions_helper_1.updatePermission)('logout-other-user', ['admin']),
    ]));
    (0, mocha_1.after)(() => Promise.all([
        (0, permissions_helper_1.updateSetting)('Block_Multiple_Failed_Logins_Attempts_Until_Block_by_User', 10),
        (0, permissions_helper_1.updateSetting)('Block_Multiple_Failed_Logins_Time_To_Unblock_By_User_In_Minutes', 5),
        (0, permissions_helper_1.updateSetting)('Block_Multiple_Failed_Logins_Attempts_Until_Block_By_Ip', 50),
        (0, permissions_helper_1.updateSetting)('Block_Multiple_Failed_Logins_Time_To_Unblock_By_Ip_In_Minutes', 5),
        (0, permissions_helper_1.updateSetting)('Block_Multiple_Failed_Logins_Enabled', true),
        (0, permissions_helper_1.updateSetting)('Block_Multiple_Failed_Logins_By_Ip', true),
        (0, permissions_helper_1.updateSetting)('Block_Multiple_Failed_Logins_By_User', true),
        (0, permissions_helper_1.updatePermission)('logout-other-user', ['admin']),
    ]));
    function shouldFailLoginWithUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('login'))
                .send({
                user: username,
                password,
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message', 'Unauthorized');
            });
        });
    }
    function shouldSuccesfullyLoginWithUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('login'))
                .send({
                user: username,
                password,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'success');
                (0, chai_1.expect)(res.body).to.have.property('data').and.to.be.an('object');
                (0, chai_1.expect)(res.body.data).to.have.property('userId');
                (0, chai_1.expect)(res.body.data).to.have.property('authToken');
            });
        });
    }
    function shouldLogoutUser(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('users.logout')).set(api_data_1.credentials).send({ userId: uid }).expect('Content-Type', 'application/json').expect(200);
        });
    }
    function shouldBlockLogin(username, password, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('login'))
                .send({
                user: username,
                password,
            })
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('error', `error-login-blocked-for-${reason}`);
            });
        });
    }
    function failMaxAttempts(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            for (let i = 0; i < maxAttemptsByUser; i++) {
                promises.push(shouldFailLoginWithUser(username, password));
            }
            yield Promise.all(promises);
        });
    }
    (0, mocha_1.describe)('[Block by User]', () => {
        let user;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Block_Multiple_Failed_Logins_By_Ip', false);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Block_Multiple_Failed_Logins_By_Ip', true);
        }));
        (0, mocha_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
        }));
        (0, mocha_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(user);
        }));
        (0, mocha_1.it)('should block by User when the limit amount of failed attempts is reached', () => __awaiter(void 0, void 0, void 0, function* () {
            yield failMaxAttempts(user.username, `${user_1.password}-incorrect`);
            yield shouldBlockLogin(user.username, user_1.password, 'user');
        }));
        (0, mocha_1.it)('should unblock user after block time', () => __awaiter(void 0, void 0, void 0, function* () {
            yield failMaxAttempts(user.username, `${user_1.password}-incorrect`);
            yield shouldBlockLogin(user.username, user_1.password, 'user');
            yield (0, sleep_1.sleep)(userBlockSeconds * 1000);
            yield shouldSuccesfullyLoginWithUser(user.username, user_1.password);
        }));
        (0, mocha_1.it)('should reset counter of failed attempts after a successful login', () => __awaiter(void 0, void 0, void 0, function* () {
            yield failMaxAttempts(user.username, `${user_1.password}-incorrect`);
            yield shouldBlockLogin(user.username, user_1.password, 'user');
            yield (0, sleep_1.sleep)(userBlockSeconds * 1000);
            yield shouldFailLoginWithUser(user.username, `${user_1.password}-incorrect`);
            yield shouldSuccesfullyLoginWithUser(user.username, user_1.password);
            yield shouldLogoutUser(user._id);
            yield failMaxAttempts(user.username, `${user_1.password}-incorrect`);
        }));
        (0, mocha_1.it)('should count failed attempts by user', () => __awaiter(void 0, void 0, void 0, function* () {
            const newUser = yield (0, users_helper_1.createUser)();
            yield failMaxAttempts(user.username, `${user_1.password}-incorrect`);
            yield shouldFailLoginWithUser(newUser.username, `${user_1.password}-incorrect`);
            yield shouldSuccesfullyLoginWithUser(newUser.username, user_1.password);
            yield (0, users_helper_1.deleteUser)(newUser);
        }));
    });
    (0, mocha_1.describe)('[Block by IP]', () => {
        let user;
        let user2;
        let userLogin;
        (0, mocha_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
            user2 = yield (0, users_helper_1.createUser)();
            userLogin = yield (0, users_helper_1.createUser)();
        }));
        (0, mocha_1.afterEach)(() => Promise.all([(0, users_helper_1.deleteUser)(user), (0, users_helper_1.deleteUser)(user2), (0, users_helper_1.deleteUser)(userLogin)]));
        (0, mocha_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            // reset counter
            yield (0, sleep_1.sleep)(ipBlockSeconds * 1000);
        }));
        (0, mocha_1.it)('should block by IP when trying to login with one user and the limit amount of failed attempts is reached', () => __awaiter(void 0, void 0, void 0, function* () {
            yield failMaxAttempts(user.username, `${user_1.password}-incorrect`);
            yield (0, sleep_1.sleep)(userBlockSeconds * 1000);
            yield failMaxAttempts(user.username, `${user_1.password}-incorrect`);
            yield shouldBlockLogin(user.username, user_1.password, 'ip');
        }));
        (0, mocha_1.it)('should block by IP when trying to login with multiple users and the limit amount of failed attempts is reached', () => __awaiter(void 0, void 0, void 0, function* () {
            yield failMaxAttempts(user.username, `${user_1.password}-incorrect`);
            yield failMaxAttempts(user2.username, `${user_1.password}-incorrect`);
            yield shouldBlockLogin(userLogin.username, user_1.password, 'ip');
        }));
        (0, mocha_1.it)('should unblock IP after block time', () => __awaiter(void 0, void 0, void 0, function* () {
            yield failMaxAttempts(user.username, `${user_1.password}-incorrect`);
            yield failMaxAttempts(user2.username, `${user_1.password}-incorrect`);
            yield shouldBlockLogin(userLogin.username, user_1.password, 'ip');
            yield (0, sleep_1.sleep)(ipBlockSeconds * 1000);
            yield shouldSuccesfullyLoginWithUser(userLogin.username, user_1.password);
        })).timeout(20000);
        (0, mocha_1.it)('should reset counter of failed attempts after a successful login', () => __awaiter(void 0, void 0, void 0, function* () {
            yield failMaxAttempts(user.username, `${user_1.password}-incorrect`);
            yield failMaxAttempts(user2.username, `${user_1.password}-incorrect`);
            yield (0, sleep_1.sleep)(ipBlockSeconds * 1000);
            yield shouldFailLoginWithUser(userLogin.username, `${user_1.password}-incorrect`);
            yield shouldSuccesfullyLoginWithUser(userLogin.username, user_1.password);
            yield shouldLogoutUser(userLogin._id);
            yield failMaxAttempts(user.username, `${user_1.password}-incorrect`);
            yield failMaxAttempts(user2.username, `${user_1.password}-incorrect`);
            yield shouldBlockLogin(userLogin.username, user_1.password, 'ip');
        })).timeout(20000);
    });
});
