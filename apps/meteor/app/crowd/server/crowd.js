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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CROWD = void 0;
const cron_1 = require("@rocket.chat/cron");
const models_1 = require("@rocket.chat/models");
const sha256_1 = require("@rocket.chat/sha256");
const atlassian_crowd_patched_1 = __importDefault(require("atlassian-crowd-patched"));
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const logger_1 = require("./logger");
const crowd_1 = require("../../../server/settings/crowd");
const deleteUser_1 = require("../../lib/server/functions/deleteUser");
const setRealName_1 = require("../../lib/server/functions/setRealName");
const setUserActiveStatus_1 = require("../../lib/server/functions/setUserActiveStatus");
const notifyListener_1 = require("../../lib/server/lib/notifyListener");
const server_1 = require("../../settings/server");
function fallbackDefaultAccountSystem(bind, username, password) {
    if (typeof username === 'string') {
        if (username.indexOf('@') === -1) {
            username = { username };
        }
        else {
            username = { email: username };
        }
    }
    logger_1.logger.info('Fallback to default account system', username);
    const loginRequest = {
        user: username,
        password: {
            digest: (0, sha256_1.SHA256)(password),
            algorithm: 'sha-256',
        },
    };
    return accounts_base_1.Accounts._runLoginHandlers(bind, loginRequest);
}
class CROWD {
    constructor() {
        let url = server_1.settings.get('CROWD_URL');
        this.options = {
            crowd: {
                base: !/\/$/.test(url) ? (url += '/') : url,
            },
            application: {
                name: server_1.settings.get('CROWD_APP_USERNAME'),
                password: server_1.settings.get('CROWD_APP_PASSWORD'),
            },
            rejectUnauthorized: server_1.settings.get('CROWD_Reject_Unauthorized'),
        };
        this.crowdClient = new atlassian_crowd_patched_1.default(this.options);
    }
    checkConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => this.crowdClient.ping((err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            }));
        });
    }
    fetchCrowdUser(crowdUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => this.crowdClient.user.find(crowdUsername, (err, userResponse) => {
                if (err) {
                    reject(err);
                }
                resolve({
                    displayname: userResponse['display-name'],
                    username: userResponse.name,
                    email: userResponse.email,
                    active: userResponse.active,
                    crowd_username: crowdUsername,
                });
            }));
        });
    }
    searchForCrowdUserByMail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => this.crowdClient.search('user', `email=" ${email} "`, (err, response) => {
                if (err) {
                    resolve(undefined);
                }
                resolve(response);
            }));
        });
    }
    authenticate(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username || !password) {
                logger_1.logger.error('No username or password');
                return;
            }
            const projection = { username: 1, crowd_username: 1, crowd: 1 };
            logger_1.logger.info('Extracting crowd_username');
            let user = null;
            let crowdUsername = username;
            if (username.indexOf('@') !== -1) {
                const email = username;
                user = yield models_1.Users.findOne({ 'emails.address': email }, { projection });
                if (user) {
                    crowdUsername = user.crowd_username;
                }
                else {
                    logger_1.logger.debug('Could not find a user by email', username);
                }
            }
            if (user == null) {
                user = yield models_1.Users.findOne({ username }, { projection });
                if (user) {
                    crowdUsername = user.crowd_username;
                }
                else {
                    logger_1.logger.debug('Could not find a user by username');
                }
            }
            if (user == null) {
                user = yield models_1.Users.findOne({ crowd_username: username }, { projection });
                if (user) {
                    crowdUsername = user.crowd_username;
                }
                else {
                    logger_1.logger.debug('Could not find a user with by crowd_username', username);
                }
            }
            if (user && !crowdUsername) {
                logger_1.logger.debug('Local user found, redirecting to fallback login');
                return {
                    crowd: false,
                };
            }
            if (!user && crowdUsername) {
                logger_1.logger.debug('New user. User is not synced yet.');
            }
            logger_1.logger.debug('Going to crowd:', crowdUsername);
            return new Promise((resolve, reject) => this.crowdClient.user.authenticate(crowdUsername, password, (err, res) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    reject(err);
                }
                const user = res;
                try {
                    const crowdUser = yield this.fetchCrowdUser(crowdUsername);
                    if (user && server_1.settings.get('CROWD_Allow_Custom_Username') === true) {
                        crowdUser.username = user.name;
                    }
                    if (user) {
                        crowdUser._id = user._id;
                    }
                    crowdUser.password = password;
                    resolve(crowdUser);
                }
                catch (err) {
                    reject(err);
                }
            })));
        });
    }
    syncDataToUser(crowdUser, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = {
                username: this.cleanUsername(crowdUser.username),
                crowd_username: crowdUser.crowd_username,
                emails: [
                    {
                        address: crowdUser.email,
                        verified: server_1.settings.get('Accounts_Verify_Email_For_External_Accounts'),
                    },
                ],
                crowd: true,
            };
            if (crowdUser.password) {
                yield accounts_base_1.Accounts.setPasswordAsync(id, crowdUser.password, {
                    logout: false,
                });
                yield models_1.Users.unsetRequirePasswordChange(id);
            }
            if (crowdUser.displayname) {
                yield (0, setRealName_1._setRealName)(id, crowdUser.displayname);
            }
            yield models_1.Users.updateOne({ _id: id }, {
                $set: user,
            });
            void (0, notifyListener_1.notifyOnUserChange)({
                clientAction: 'updated',
                id,
                diff: Object.assign(Object.assign({}, user), (crowdUser.displayname && { name: crowdUser.displayname })),
            });
            yield (0, setUserActiveStatus_1.setUserActiveStatus)(id, crowdUser.active);
        });
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            var _d;
            // if crowd is disabled bail out
            if (server_1.settings.get('CROWD_Enable') !== true) {
                return;
            }
            const users = (yield models_1.Users.findCrowdUsers().toArray()) || [];
            logger_1.logger.info('Sync started...');
            try {
                for (var _e = true, users_1 = __asyncValues(users), users_1_1; users_1_1 = yield users_1.next(), _a = users_1_1.done, !_a; _e = true) {
                    _c = users_1_1.value;
                    _e = false;
                    const user = _c;
                    let crowdUsername = user.hasOwnProperty('crowd_username') ? user.crowd_username : user.username;
                    logger_1.logger.info('Syncing user', crowdUsername);
                    if (!crowdUsername) {
                        logger_1.logger.warn('User has no crowd_username', user.username);
                        continue;
                    }
                    let crowdUser = null;
                    try {
                        crowdUser = yield this.fetchCrowdUser(crowdUsername);
                    }
                    catch (err) {
                        logger_1.logger.debug({ err });
                        logger_1.logger.error({ msg: 'Could not sync user with username', crowd_username: crowdUsername });
                        const email = (_d = user.emails) === null || _d === void 0 ? void 0 : _d[0].address;
                        logger_1.logger.info('Attempting to find for user by email', email);
                        const response = yield this.searchForCrowdUserByMail(email);
                        if (!response || response.users.length === 0) {
                            logger_1.logger.warn('Could not find user in CROWD with username or email:', crowdUsername, email);
                            if (server_1.settings.get('CROWD_Remove_Orphaned_Users') === true) {
                                logger_1.logger.info('Removing user:', crowdUsername);
                                setImmediate(() => __awaiter(this, void 0, void 0, function* () {
                                    yield (0, deleteUser_1.deleteUser)(user._id);
                                    logger_1.logger.info('User removed:', crowdUsername);
                                }));
                            }
                            return;
                        }
                        crowdUsername = response.users[0].name;
                        logger_1.logger.info('User found by email. Syncing user', crowdUsername);
                        if (!crowdUsername) {
                            logger_1.logger.warn('User has no crowd_username', user.username);
                            continue;
                        }
                        crowdUser = yield this.fetchCrowdUser(crowdUsername);
                    }
                    if (server_1.settings.get('CROWD_Allow_Custom_Username') === true) {
                        crowdUser.username = user.username;
                    }
                    yield this.syncDataToUser(crowdUser, user._id);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_e && !_a && (_b = users_1.return)) yield _b.call(users_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    cleanUsername(username) {
        if (server_1.settings.get('CROWD_Clean_Usernames') === true) {
            return username.split('@')[0];
        }
        return username;
    }
    updateUserCollection(crowdUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = crowdUser.crowd_username || crowdUser.username;
            const mail = crowdUser.email;
            // If id is not provided, user is linked by crowd_username or email address
            const userQuery = Object.assign(Object.assign({}, (crowdUser._id && { _id: crowdUser._id })), (!crowdUser._id && {
                $or: [{ crowd_username: username }, { 'emails.address': mail }],
            }));
            // find our existing user if they exist
            const user = yield models_1.Users.findOne(userQuery);
            if (user) {
                const stampedToken = accounts_base_1.Accounts._generateStampedLoginToken();
                yield models_1.Users.updateOne({ _id: user._id }, {
                    $push: {
                        'services.resume.loginTokens': accounts_base_1.Accounts._hashStampedToken(stampedToken),
                    },
                });
                // TODO this can be optmized so places that care about loginTokens being removed are invoked directly
                // instead of having to listen to every watch.users event
                void (0, notifyListener_1.notifyOnUserChangeAsync)(() => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const userTokens = yield models_1.Users.findOneById(crowdUser._id, { projection: { 'services.resume.loginTokens': 1 } });
                    if (!userTokens) {
                        return;
                    }
                    return {
                        clientAction: 'updated',
                        id: crowdUser._id,
                        diff: { 'services.resume.loginTokens': (_b = (_a = userTokens.services) === null || _a === void 0 ? void 0 : _a.resume) === null || _b === void 0 ? void 0 : _b.loginTokens },
                    };
                }));
                yield this.syncDataToUser(crowdUser, user._id);
                return {
                    userId: user._id,
                    token: stampedToken.token,
                };
            }
            // Attempt to create the new user
            try {
                crowdUser._id = yield accounts_base_1.Accounts.createUserAsync(crowdUser);
                void (0, notifyListener_1.notifyOnUserChangeById)({ clientAction: 'inserted', id: crowdUser._id });
                // sync the user data
                yield this.syncDataToUser(crowdUser, crowdUser._id);
                return {
                    userId: crowdUser._id,
                };
            }
            catch (err) {
                logger_1.logger.error({ msg: 'Error creating new crowd user.', err });
            }
        });
    }
}
exports.CROWD = CROWD;
accounts_base_1.Accounts.registerLoginHandler('crowd', function (loginRequest) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!loginRequest.crowd) {
            return undefined;
        }
        logger_1.logger.info('Init CROWD login', loginRequest.username);
        if (server_1.settings.get('CROWD_Enable') !== true) {
            return fallbackDefaultAccountSystem(this, loginRequest.username, loginRequest.crowdPassword);
        }
        try {
            const crowd = new CROWD();
            const user = yield crowd.authenticate(loginRequest.username, loginRequest.crowdPassword);
            if (user && user.crowd === false) {
                logger_1.logger.debug(`User ${loginRequest.username} is not a valid crowd user, falling back`);
                return fallbackDefaultAccountSystem(this, loginRequest.username, loginRequest.crowdPassword);
            }
            if (!user) {
                logger_1.logger.debug(`User ${loginRequest.username} is not allowed to access Rocket.Chat`);
                return new meteor_1.Meteor.Error('not-authorized', 'User is not authorized by crowd');
            }
            const result = yield crowd.updateUserCollection(user);
            return result;
        }
        catch (err) {
            logger_1.logger.debug({ err });
            logger_1.logger.error('Crowd user not authenticated due to an error');
            throw new meteor_1.Meteor.Error('user-not-found', err.message);
        }
    });
});
const jobName = 'CROWD_Sync';
meteor_1.Meteor.startup(() => {
    server_1.settings.watchMultiple(['CROWD_Sync_User_Data', 'CROWD_Sync_Interval'], function addCronJobDebounced(_a) {
        return __awaiter(this, arguments, void 0, function* ([data, interval]) {
            if (data !== true) {
                logger_1.logger.info('Disabling CROWD Background Sync');
                if (yield cron_1.cronJobs.has(jobName)) {
                    yield cron_1.cronJobs.remove(jobName);
                }
                return;
            }
            const crowd = new CROWD();
            if (interval) {
                if (yield cron_1.cronJobs.has(jobName)) {
                    yield cron_1.cronJobs.remove(jobName);
                }
                logger_1.logger.info('Enabling CROWD Background Sync');
                const cronInterval = crowd_1.crowdIntervalValuesToCronMap[String(interval)];
                yield cron_1.cronJobs.add(jobName, cronInterval, () => crowd.sync());
            }
        });
    });
});
