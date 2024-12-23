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
const crypto_1 = __importDefault(require("crypto"));
const random_1 = require("@rocket.chat/random");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const mongodb_1 = require("mongodb");
const api_data_1 = require("../../data/api-data");
const interactions_1 = require("../../data/interactions");
const rooms_1 = require("../../data/livechat/rooms");
const users_1 = require("../../data/livechat/users");
const permissions_helper_1 = require("../../data/permissions.helper");
const rooms_helper_1 = require("../../data/rooms.helper");
const teams_helper_1 = require("../../data/teams.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
const constants_1 = require("../../e2e/config/constants");
const MAX_BIO_LENGTH = 260;
const MAX_NICKNAME_LENGTH = 120;
const customFieldText = {
    type: 'text',
    required: true,
    minLength: 2,
    maxLength: 10,
};
function setCustomFields(customFields) {
    const stringified = customFields ? JSON.stringify(customFields) : '';
    return api_data_1.request.post((0, api_data_1.api)('settings/Accounts_CustomFields')).set(api_data_1.credentials).send({ value: stringified }).expect(200);
}
function clearCustomFields() {
    return setCustomFields(null);
}
const joinChannel = ({ overrideCredentials = api_data_1.credentials, roomId }) => api_data_1.request.post((0, api_data_1.api)('channels.join')).set(overrideCredentials).send({
    roomId,
});
const inviteToChannel = ({ overrideCredentials = api_data_1.credentials, roomId, userId, }) => api_data_1.request.post((0, api_data_1.api)('channels.invite')).set(overrideCredentials).send({
    userId,
    roomId,
});
const addRoomOwner = ({ type, roomId, userId }) => (0, rooms_helper_1.actionRoom)({ action: 'addOwner', type, roomId, extraData: { userId } });
const removeRoomOwner = ({ type, roomId, userId }) => (0, rooms_helper_1.actionRoom)({ action: 'removeOwner', type, roomId, extraData: { userId } });
const getChannelRoles = (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, overrideCredentials = api_data_1.credentials, }) {
    return (yield api_data_1.request.get((0, api_data_1.api)('channels.roles')).set(overrideCredentials).query({
        roomId,
    })).body.roles;
});
const setRoomConfig = ({ roomId, favorite, isDefault }) => {
    return api_data_1.request
        .post((0, api_data_1.api)('rooms.saveRoomSettings'))
        .set(api_data_1.credentials)
        .send({
        rid: roomId,
        default: isDefault,
        favorite: favorite
            ? {
                defaultValue: true,
                favorite: false,
            }
            : undefined,
    });
};
const preferences = {
    data: Object.assign({ newRoomNotification: 'door', newMessageNotification: 'chime', muteFocusedConversations: true, clockMode: 1, useEmojis: true, convertAsciiEmoji: true, saveMobileBandwidth: true, collapseMediaByDefault: false, autoImageLoad: true, emailNotificationMode: 'mentions', unreadAlert: true, notificationsSoundVolume: 100, desktopNotifications: 'default', pushNotifications: 'default', enableAutoAway: true, highlights: [], desktopNotificationRequireInteraction: false, hideUsernames: false, hideRoles: false, displayAvatars: true, hideFlexTab: false, sendOnEnter: 'normal', idleTimeLimit: 3600, notifyCalendarEvents: false, enableMobileRinging: false }, (constants_1.IS_EE && {
        omnichannelTranscriptPDF: false,
    })),
};
const getUserStatus = (userId) => new Promise((resolve) => {
    void api_data_1.request
        .get((0, api_data_1.api)('users.getStatus'))
        .query({ userId })
        .set(api_data_1.credentials)
        .expect('Content-Type', 'application/json')
        .expect(200)
        .end((_end, res) => {
        resolve(res.body);
    });
});
const registerUser = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (userData = {}, overrideCredentials = api_data_1.credentials) {
    const username = userData.username || `user.test.${Date.now()}`;
    const email = userData.email || `${username}@rocket.chat`;
    const result = yield api_data_1.request
        .post((0, api_data_1.api)('users.register'))
        .set(overrideCredentials)
        .send(Object.assign({ email, name: username, username, pass: user_1.password }, userData));
    return result.body.user;
});
// For changing user data when it's not possible to do so via API
const updateUserInDb = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield mongodb_1.MongoClient.connect(constants_1.URL_MONGODB);
    yield connection
        .db()
        .collection('users')
        .updateOne({ _id: userId }, { $set: Object.assign({}, userData) });
    yield connection.close();
});
(0, mocha_1.describe)('[Users]', () => {
    let targetUser;
    let userCredentials;
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.before)('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, users_helper_1.createUser)({
            active: true,
            roles: ['user'],
            joinDefaultChannels: true,
            verified: true,
        });
        targetUser = {
            _id: user._id,
            username: user.username,
        };
        userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
    }));
    (0, mocha_1.after)(() => Promise.all([(0, users_helper_1.deleteUser)(targetUser), (0, permissions_helper_1.updateSetting)('E2E_Enable', false)]));
    (0, mocha_1.it)('enabling E2E in server and generating keys to user...', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updateSetting)('E2E_Enable', true);
        yield api_data_1.request
            .post((0, api_data_1.api)('e2e.setUserPublicAndPrivateKeys'))
            .set(userCredentials)
            .send({
            private_key: 'test',
            public_key: 'test',
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        });
        yield api_data_1.request
            .get((0, api_data_1.api)('e2e.fetchMyKeys'))
            .set(userCredentials)
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('public_key', 'test');
            (0, chai_1.expect)(res.body).to.have.property('private_key', 'test');
        });
    }));
    (0, mocha_1.it)('should fail when trying to set keys for a user with keys already set', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api_data_1.request
            .post((0, api_data_1.api)('e2e.setUserPublicAndPrivateKeys'))
            .set(userCredentials)
            .send({
            private_key: 'test',
            public_key: 'test',
        })
            .expect('Content-Type', 'application/json')
            .expect(400)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error', 'Keys already set [error-keys-already-set]');
        });
    }));
    (0, mocha_1.describe)('[/users.create]', () => {
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () { return clearCustomFields(); }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () { return clearCustomFields(); }));
        (0, mocha_1.it)('should create a new user with custom fields', () => __awaiter(void 0, void 0, void 0, function* () {
            yield setCustomFields({ customFieldText });
            const username = `customField_${api_data_1.apiUsername}`;
            const email = `customField_${api_data_1.apiEmail}`;
            const customFields = { customFieldText: 'success' };
            const res = yield api_data_1.request
                .post((0, api_data_1.api)('users.create'))
                .set(api_data_1.credentials)
                .send({
                email,
                name: username,
                username,
                password: user_1.password,
                active: true,
                roles: ['user'],
                joinDefaultChannels: true,
                verified: true,
                customFields,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.nested.property('user.username', username);
            (0, chai_1.expect)(res.body).to.have.nested.property('user.emails[0].address', email);
            (0, chai_1.expect)(res.body).to.have.nested.property('user.active', true);
            (0, chai_1.expect)(res.body).to.have.nested.property('user.name', username);
            (0, chai_1.expect)(res.body).to.have.nested.property('user.customFields.customFieldText', 'success');
            (0, chai_1.expect)(res.body).to.not.have.nested.property('user.e2e');
            const { user } = res.body;
            yield (0, users_helper_1.deleteUser)(user);
        }));
        function failCreateUser(name) {
            (0, mocha_1.it)(`should not create a new user if username is the reserved word ${name}`, (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.create'))
                    .set(api_data_1.credentials)
                    .send({
                    email: `create_user_fail_${api_data_1.apiEmail}`,
                    name: `create_user_fail_${api_data_1.apiUsername}`,
                    username: name,
                    password: user_1.password,
                    active: true,
                    roles: ['user'],
                    joinDefaultChannels: true,
                    verified: true,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', `${name} is blocked and can't be used! [error-blocked-username]`);
                })
                    .end(done);
            });
        }
        function failUserWithCustomField(field) {
            (0, mocha_1.it)(`should not create a user if a custom field ${field.reason}`, () => __awaiter(this, void 0, void 0, function* () {
                yield setCustomFields({ customFieldText });
                const customFields = {};
                customFields[field.name] = field.value;
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.create'))
                    .set(api_data_1.credentials)
                    .send({
                    email: `customField_fail_${api_data_1.apiEmail}`,
                    name: `customField_fail_${api_data_1.apiUsername}`,
                    username: `customField_fail_${api_data_1.apiUsername}`,
                    password: user_1.password,
                    active: true,
                    roles: ['user'],
                    joinDefaultChannels: true,
                    verified: true,
                    customFields,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-user-registration-custom-field');
                });
            }));
        }
        [
            { name: 'customFieldText', value: '', reason: 'is required and missing' },
            { name: 'customFieldText', value: '0', reason: 'length is less than minLength' },
            { name: 'customFieldText', value: '0123456789-0', reason: 'length is more than maxLength' },
        ].forEach((field) => {
            failUserWithCustomField(field);
        });
        api_data_1.reservedWords.forEach((name) => {
            failCreateUser(name);
        });
        (0, mocha_1.describe)('users default roles configuration', () => {
            const users = [];
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Accounts_Registration_Users_Default_Roles', 'user,admin');
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Accounts_Registration_Users_Default_Roles', 'user');
                yield Promise.all(users.map((user) => (0, users_helper_1.deleteUser)(user)));
            }));
            (0, mocha_1.it)('should create a new user with default roles', (done) => {
                const username = `defaultUserRole_${api_data_1.apiUsername}${Date.now()}`;
                const email = `defaultUserRole_${api_data_1.apiEmail}${Date.now()}`;
                void api_data_1.request
                    .post((0, api_data_1.api)('users.create'))
                    .set(api_data_1.credentials)
                    .send({
                    email,
                    name: username,
                    username,
                    password: user_1.password,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.nested.property('user.username', username);
                    (0, chai_1.expect)(res.body).to.have.nested.property('user.emails[0].address', email);
                    (0, chai_1.expect)(res.body).to.have.nested.property('user.active', true);
                    (0, chai_1.expect)(res.body).to.have.nested.property('user.name', username);
                    (0, chai_1.expect)(res.body.user.roles).to.have.members(['user', 'admin']);
                    users.push(res.body.user);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should create a new user with only the role provided', (done) => {
                const username = `defaultUserRole_${api_data_1.apiUsername}${Date.now()}`;
                const email = `defaultUserRole_${api_data_1.apiEmail}${Date.now()}`;
                void api_data_1.request
                    .post((0, api_data_1.api)('users.create'))
                    .set(api_data_1.credentials)
                    .send({
                    email,
                    name: username,
                    username,
                    password: user_1.password,
                    roles: ['guest'],
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.nested.property('user.username', username);
                    (0, chai_1.expect)(res.body).to.have.nested.property('user.emails[0].address', email);
                    (0, chai_1.expect)(res.body).to.have.nested.property('user.active', true);
                    (0, chai_1.expect)(res.body).to.have.nested.property('user.name', username);
                    (0, chai_1.expect)(res.body.user.roles).to.have.members(['guest']);
                    users.push(res.body.user);
                })
                    .end(done);
            });
        });
        (0, mocha_1.describe)('auto join default channels', () => {
            let defaultTeamRoomId;
            let defaultTeamId;
            let group;
            let user;
            let userCredentials;
            let user2;
            let user3;
            let userNoDefault;
            const teamName = `defaultTeam_${Date.now()}`;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                const defaultTeam = yield (0, teams_helper_1.createTeam)(api_data_1.credentials, teamName, 0);
                defaultTeamRoomId = defaultTeam.roomId;
                defaultTeamId = defaultTeam._id;
            }));
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                const { body } = yield (0, rooms_helper_1.createRoom)({
                    name: `defaultGroup_${Date.now()}`,
                    type: 'p',
                    credentials: api_data_1.credentials,
                    extraData: {
                        broadcast: false,
                        encrypted: false,
                        teamId: defaultTeamId,
                        topic: '',
                    },
                });
                group = body.group;
            }));
            (0, mocha_1.after)(() => Promise.all([
                (0, rooms_helper_1.deleteRoom)({ roomId: group._id, type: 'p' }),
                (0, teams_helper_1.deleteTeam)(api_data_1.credentials, teamName),
                (0, users_helper_1.deleteUser)(user),
                (0, users_helper_1.deleteUser)(user2),
                (0, users_helper_1.deleteUser)(user3),
                (0, users_helper_1.deleteUser)(userNoDefault),
            ]));
            (0, mocha_1.it)('should not create subscriptions to non default teams or rooms even if joinDefaultChannels is true', () => __awaiter(void 0, void 0, void 0, function* () {
                userNoDefault = yield (0, users_helper_1.createUser)({ joinDefaultChannels: true });
                const noDefaultUserCredentials = yield (0, users_helper_1.login)(userNoDefault.username, user_1.password);
                yield api_data_1.request
                    .get((0, api_data_1.api)('subscriptions.getOne'))
                    .set(noDefaultUserCredentials)
                    .query({ roomId: defaultTeamRoomId })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('subscription').that.is.null;
                });
                yield api_data_1.request
                    .get((0, api_data_1.api)('subscriptions.getOne'))
                    .set(noDefaultUserCredentials)
                    .query({ roomId: group._id })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('subscription').that.is.null;
                });
            }));
            (0, mocha_1.it)('should create a subscription for a default team room if joinDefaultChannels is true', () => __awaiter(void 0, void 0, void 0, function* () {
                yield setRoomConfig({ roomId: defaultTeamRoomId, favorite: true, isDefault: true });
                user = yield (0, users_helper_1.createUser)({ joinDefaultChannels: true });
                userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
                yield api_data_1.request
                    .get((0, api_data_1.api)('subscriptions.getOne'))
                    .set(userCredentials)
                    .query({ roomId: defaultTeamRoomId })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('subscription');
                    (0, chai_1.expect)(res.body.subscription).to.have.property('rid', defaultTeamRoomId);
                });
            }));
            (0, mocha_1.it)('should NOT create a subscription for non auto-join rooms inside a default team', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .get((0, api_data_1.api)('subscriptions.getOne'))
                    .set(userCredentials)
                    .query({ roomId: group._id })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('subscription').that.is.null;
                });
            }));
            (0, mocha_1.it)('should create a subscription for the user in all the auto join rooms of the team', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request.post((0, api_data_1.api)('teams.updateRoom')).set(api_data_1.credentials).send({
                    roomId: group._id,
                    isDefault: true,
                });
                user2 = yield (0, users_helper_1.createUser)({ joinDefaultChannels: true });
                const user2Credentials = yield (0, users_helper_1.login)(user2.username, user_1.password);
                yield api_data_1.request
                    .get((0, api_data_1.api)('subscriptions.getOne'))
                    .set(user2Credentials)
                    .query({ roomId: group._id })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('subscription');
                    (0, chai_1.expect)(res.body.subscription).to.have.property('rid', group._id);
                });
            }));
            (0, mocha_1.it)('should create a subscription for a default room inside a non default team', () => __awaiter(void 0, void 0, void 0, function* () {
                yield setRoomConfig({ roomId: defaultTeamRoomId, isDefault: false });
                yield setRoomConfig({ roomId: group._id, favorite: true, isDefault: true });
                user3 = yield (0, users_helper_1.createUser)({ joinDefaultChannels: true });
                const user3Credentials = yield (0, users_helper_1.login)(user3.username, user_1.password);
                // New user should be subscribed to the default room inside a team
                yield api_data_1.request
                    .get((0, api_data_1.api)('subscriptions.getOne'))
                    .set(user3Credentials)
                    .query({ roomId: group._id })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('subscription');
                    (0, chai_1.expect)(res.body.subscription).to.have.property('rid', group._id);
                });
                // New user should not be subscribed to the parent team
                yield api_data_1.request
                    .get((0, api_data_1.api)('subscriptions.getOne'))
                    .set(user3Credentials)
                    .query({ roomId: defaultTeamRoomId })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('subscription').that.is.null;
                });
            }));
        });
    });
    (0, mocha_1.describe)('[/users.register]', () => {
        const email = `email@email${Date.now()}.com`;
        const username = `myusername${Date.now()}`;
        let user;
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () { return (0, users_helper_1.deleteUser)(user); }));
        (0, mocha_1.it)('should register new user', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.register'))
                .send({
                email,
                name: 'name',
                username,
                pass: 'test',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.username', username);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.active', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.name', 'name');
                user = res.body.user;
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when trying register new user with an invalid username', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.register'))
                .send({
                email,
                name: 'name',
                username: 'test$username<>',
                pass: 'test',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error').and.to.be.equal('The username provided is not valid');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when trying register new user with an existing username', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.register'))
                .send({
                email,
                name: 'name',
                username,
                pass: 'test',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error').and.to.be.equal('Username is already in use');
            })
                .end(done);
        });
        (0, mocha_1.it)("should return an error when registering a user's name with invalid characters: >, <, /, or \\", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.register'))
                .send({
                email,
                name: '</\\name>',
                username,
                pass: 'test',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error').and.to.be.equal('Name contains invalid characters');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/users.info]', () => {
        let infoRoom;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            infoRoom = (yield (0, rooms_helper_1.createRoom)({
                type: 'c',
                name: `channel.test.info.${Date.now()}-${Math.random()}`,
                members: [targetUser.username],
            })).body.channel;
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, permissions_helper_1.updatePermission)('view-other-user-channels', ['admin']),
            (0, permissions_helper_1.updatePermission)('view-full-other-user-info', ['admin']),
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: infoRoom._id }),
        ]));
        (0, mocha_1.it)('should return an error when the user does not exist', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.info'))
                .set(api_data_1.credentials)
                .query({
                username: 'invalid-username',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            })
                .end(done);
        });
        (0, mocha_1.it)('should query information about a user by userId', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.info'))
                .set(api_data_1.credentials)
                .query({
                userId: targetUser._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.username', targetUser.username);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.active', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.name', targetUser.username);
                (0, chai_1.expect)(res.body).to.not.have.nested.property('user.e2e');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return "rooms" property when user request it and the user has the necessary permission (admin, "view-other-user-channels")', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.info'))
                .set(api_data_1.credentials)
                .query({
                userId: targetUser._id,
                includeUserRooms: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.rooms').and.to.be.an('array');
                const createdRoom = res.body.user.rooms.find((room) => room.rid === infoRoom._id);
                (0, chai_1.expect)(createdRoom).to.have.property('unread');
            })
                .end(done);
        });
        (0, mocha_1.it)('should NOT return "rooms" property when user NOT request it but the user has the necessary permission (admin, "view-other-user-channels")', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.info'))
                .set(api_data_1.credentials)
                .query({
                userId: targetUser._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.not.have.nested.property('user.rooms');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the rooms when the user request your own rooms but he does NOT have the necessary permission', (done) => {
            void (0, permissions_helper_1.updatePermission)('view-other-user-channels', []).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('users.info'))
                    .set(api_data_1.credentials)
                    .query({
                    userId: api_data_1.credentials['X-User-Id'],
                    includeUserRooms: true,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.nested.property('user.rooms');
                    (0, chai_1.expect)(res.body.user.rooms).with.lengthOf.at.least(1);
                    (0, chai_1.expect)(res.body.user.rooms[0]).to.have.property('unread');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)("should NOT return the rooms when the user request another user's rooms and he does NOT have the necessary permission", (done) => {
            void (0, permissions_helper_1.updatePermission)('view-other-user-channels', []).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('users.info'))
                    .set(api_data_1.credentials)
                    .query({
                    userId: targetUser._id,
                    fields: JSON.stringify({ userRooms: 1 }),
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.not.have.nested.property('user.rooms');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)("should NOT return any services fields when request to another user's info even if the user has the necessary permission", (done) => {
            void (0, permissions_helper_1.updatePermission)('view-full-other-user-info', ['admin']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('users.info'))
                    .set(api_data_1.credentials)
                    .query({
                    userId: targetUser._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.not.have.nested.property('user.services.emailCode');
                    (0, chai_1.expect)(res.body).to.not.have.nested.property('user.services');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return all services fields when request for myself data even without privileged permission', (done) => {
            void (0, permissions_helper_1.updatePermission)('view-full-other-user-info', []).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('users.info'))
                    .set(api_data_1.credentials)
                    .query({
                    userId: api_data_1.credentials['X-User-Id'],
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.nested.property('user.services.password');
                    (0, chai_1.expect)(res.body).to.have.nested.property('user.services.resume');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should correctly route users that have `ufs` in their username', () => __awaiter(void 0, void 0, void 0, function* () {
            const ufsUsername = `ufs-${Date.now()}`;
            const user = yield (0, users_helper_1.createUser)({
                email: `me-${Date.now()}@email.com`,
                name: 'testuser',
                username: ufsUsername,
                password: '1234',
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('users.info'))
                .set(api_data_1.credentials)
                .query({
                username: ufsUsername,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.user).to.have.property('type', 'user');
                (0, chai_1.expect)(res.body.user).to.have.property('name', 'testuser');
                (0, chai_1.expect)(res.body.user).to.have.property('username', ufsUsername);
                (0, chai_1.expect)(res.body.user).to.have.property('active', true);
            });
            yield (0, users_helper_1.deleteUser)(user);
        }));
    });
    (0, mocha_1.describe)('[/users.getPresence]', () => {
        (0, mocha_1.it)("should query a user's presence by userId", (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.getPresence'))
                .set(api_data_1.credentials)
                .query({
                userId: targetUser._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('presence', 'offline');
            })
                .end(done);
        });
        (0, mocha_1.describe)('Logging in with type: "resume"', () => {
            let user;
            let userCredentials;
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                user = yield (0, users_helper_1.createUser)({ joinDefaultChannels: false });
                userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            }));
            (0, mocha_1.after)(() => (0, users_helper_1.deleteUser)(user));
            (0, mocha_1.it)('should return "offline" after a login type "resume" via REST', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('login'))
                    .send({
                    resume: userCredentials['X-Auth-Token'],
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200);
                yield api_data_1.request
                    .get((0, api_data_1.api)('users.getPresence'))
                    .set(api_data_1.credentials)
                    .query({
                    userId: user._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.nested.property('presence', 'offline');
                });
            }));
        });
    });
    (0, mocha_1.describe)('[/users.presence]', () => {
        (0, mocha_1.describe)('Not logged in:', () => {
            (0, mocha_1.it)('should return 401 unauthorized', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('users.presence'))
                    .expect('Content-Type', 'application/json')
                    .expect(401)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('message');
                })
                    .end(done);
            });
        });
        (0, mocha_1.describe)('Logged in:', () => {
            (0, mocha_1.it)('should return online users full list', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('users.presence'))
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('full', true);
                    const user = res.body.users.find((user) => user.username === 'rocket.cat');
                    (0, chai_1.expect)(user).to.have.all.keys('_id', 'avatarETag', 'username', 'name', 'status', 'utcOffset');
                })
                    .end(done);
            });
            (0, mocha_1.it)('should return no online users updated after now', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('users.presence'))
                    .query({ from: new Date().toISOString() })
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('full', false);
                    (0, chai_1.expect)(res.body).to.have.property('users').that.is.an('array').that.has.lengthOf(0);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should return full list of online users for more than 10 minutes in the past', (done) => {
                const date = new Date();
                date.setMinutes(date.getMinutes() - 11);
                void api_data_1.request
                    .get((0, api_data_1.api)('users.presence'))
                    .query({ from: date.toISOString() })
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('full', true);
                    const user = res.body.users.find((user) => user.username === 'rocket.cat');
                    (0, chai_1.expect)(user).to.have.all.keys('_id', 'avatarETag', 'username', 'name', 'status', 'utcOffset');
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/users.list]', () => {
        let user;
        let deactivatedUser;
        let user2;
        let user2Credentials;
        let user3;
        let user3Credentials;
        let group;
        let inviteToken;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const username = `deactivated_${Date.now()}${api_data_1.apiUsername}`;
            const email = `deactivated_+${Date.now()}${api_data_1.apiEmail}`;
            const userData = {
                email,
                name: username,
                username,
                password: user_1.password,
                active: false,
            };
            deactivatedUser = yield (0, users_helper_1.createUser)(userData);
            (0, chai_1.expect)(deactivatedUser).to.not.be.null;
            (0, chai_1.expect)(deactivatedUser).to.have.nested.property('username', username);
            (0, chai_1.expect)(deactivatedUser).to.have.nested.property('emails[0].address', email);
            (0, chai_1.expect)(deactivatedUser).to.have.nested.property('active', false);
            (0, chai_1.expect)(deactivatedUser).to.have.nested.property('name', username);
            (0, chai_1.expect)(deactivatedUser).to.not.have.nested.property('e2e');
        }));
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield setCustomFields({ customFieldText });
            const username = `customField_${Date.now()}${api_data_1.apiUsername}`;
            const email = `customField_+${Date.now()}${api_data_1.apiEmail}`;
            const customFields = { customFieldText: 'success' };
            const userData = {
                email,
                name: username,
                username,
                password: user_1.password,
                active: true,
                roles: ['user'],
                joinDefaultChannels: true,
                verified: true,
                customFields,
            };
            user = yield (0, users_helper_1.createUser)(userData);
            (0, chai_1.expect)(user).to.not.be.null;
            (0, chai_1.expect)(user).to.have.nested.property('username', username);
            (0, chai_1.expect)(user).to.have.nested.property('emails[0].address', email);
            (0, chai_1.expect)(user).to.have.nested.property('active', true);
            (0, chai_1.expect)(user).to.have.nested.property('name', username);
            (0, chai_1.expect)(user).to.have.nested.property('customFields.customFieldText', 'success');
            (0, chai_1.expect)(user).to.not.have.nested.property('e2e');
        }));
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user2 = yield (0, users_helper_1.createUser)({ joinDefaultChannels: false });
            user2Credentials = yield (0, users_helper_1.login)(user2.username, user_1.password);
            user3 = yield (0, users_helper_1.createUser)({ joinDefaultChannels: false });
            user3Credentials = yield (0, users_helper_1.login)(user3.username, user_1.password);
        }));
        (0, mocha_1.before)('Create a group', () => __awaiter(void 0, void 0, void 0, function* () {
            group = (yield (0, rooms_helper_1.createRoom)({
                type: 'p',
                name: `group.test.${Date.now()}-${Math.random()}`,
            })).body.group;
        }));
        (0, mocha_1.before)('Create invite link', () => __awaiter(void 0, void 0, void 0, function* () {
            inviteToken = (yield api_data_1.request.post((0, api_data_1.api)('findOrCreateInvite')).set(api_data_1.credentials).send({
                rid: group._id,
                days: 0,
                maxUses: 0,
            })).body._id;
        }));
        (0, mocha_1.after)('Remove invite link', () => __awaiter(void 0, void 0, void 0, function* () {
            return api_data_1.request
                .delete((0, api_data_1.api)(`removeInvite/${inviteToken}`))
                .set(api_data_1.credentials)
                .send();
        }));
        (0, mocha_1.after)(() => Promise.all([
            clearCustomFields(),
            (0, users_helper_1.deleteUser)(deactivatedUser),
            (0, users_helper_1.deleteUser)(user),
            (0, users_helper_1.deleteUser)(user2),
            (0, users_helper_1.deleteUser)(user3),
            (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: group._id }),
            (0, permissions_helper_1.updatePermission)('view-outside-room', ['admin', 'owner', 'moderator', 'user']),
            (0, permissions_helper_1.updateSetting)('API_Apply_permission_view-outside-room_on_users-list', false),
        ]));
        (0, mocha_1.it)('should query all users in the system', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.list'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                const myself = res.body.users.find((user) => user.username === user_1.adminUsername);
                (0, chai_1.expect)(myself).to.not.have.property('e2e');
            })
                .end(done);
        });
        (0, mocha_1.it)('should sort for user statuses and check if deactivated user is correctly sorted', (done) => {
            const query = {
                fields: JSON.stringify({
                    username: 1,
                    _id: 1,
                    active: 1,
                    status: 1,
                }),
                sort: JSON.stringify({
                    status: 1,
                }),
            };
            void api_data_1.request
                .get((0, api_data_1.api)('users.list'))
                .query(query)
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('users');
                const firstUser = res.body.users.find((u) => u._id === deactivatedUser._id);
                (0, chai_1.expect)(firstUser).to.have.property('active', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('should query all users in the system by name', (done) => {
            // filtering user list
            void api_data_1.request
                .get((0, api_data_1.api)('users.list'))
                .set(api_data_1.credentials)
                .query({
                name: { $regex: 'g' },
                sort: JSON.stringify({
                    createdAt: -1,
                }),
            })
                .field('username', 1)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
            })
                .end(done);
        });
        (0, mocha_1.it)('should query all users in the system when logged as normal user and `view-outside-room` not granted', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-outside-room', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('users.list'))
                .set(user2Credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('total');
            });
        }));
        (0, mocha_1.it)('should not query users when logged as normal user, `view-outside-room` not granted and temp setting enabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-outside-room', ['admin']);
            yield (0, permissions_helper_1.updateSetting)('API_Apply_permission_view-outside-room_on_users-list', true);
            yield api_data_1.request.get((0, api_data_1.api)('users.list')).set(user2Credentials).expect('Content-Type', 'application/json').expect(403);
        }));
        (0, mocha_1.it)('should exclude inviteToken in the user item for privileged users', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('useInviteToken'))
                .set(user2Credentials)
                .send({ token: inviteToken })
                .expect(200)
                .expect('Content-Type', 'application/json')
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room');
                (0, chai_1.expect)(res.body.room).to.have.property('rid', group._id);
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('users.list'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .query({
                fields: JSON.stringify({ inviteToken: 1 }),
                sort: JSON.stringify({ inviteToken: -1 }),
                count: 100,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('users');
                res.body.users.forEach((user) => {
                    (0, chai_1.expect)(user).to.not.have.property('inviteToken');
                });
            });
        }));
        (0, mocha_1.it)('should exclude inviteToken in the user item for normal users', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('API_Apply_permission_view-outside-room_on_users-list', false);
            yield api_data_1.request
                .post((0, api_data_1.api)('useInviteToken'))
                .set(user3Credentials)
                .send({ token: inviteToken })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room');
                (0, chai_1.expect)(res.body.room).to.have.property('rid', group._id);
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('users.list'))
                .set(user3Credentials)
                .expect('Content-Type', 'application/json')
                .query({
                fields: JSON.stringify({ inviteToken: 1 }),
                sort: JSON.stringify({ inviteToken: -1 }),
                count: 100,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('users');
                res.body.users.forEach((user) => {
                    (0, chai_1.expect)(user).to.not.have.property('inviteToken');
                });
            });
        }));
    });
    (0, mocha_1.describe)('Avatars', () => {
        let user;
        let userCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
            userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield Promise.all([
                (0, permissions_helper_1.updateSetting)('Accounts_AllowUserAvatarChange', true),
                (0, permissions_helper_1.updatePermission)('edit-other-user-avatar', ['admin', 'user']),
            ]);
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, permissions_helper_1.updateSetting)('Accounts_AllowUserAvatarChange', true),
            (0, users_helper_1.deleteUser)(user),
            (0, permissions_helper_1.updatePermission)('edit-other-user-avatar', ['admin']),
        ]));
        (0, mocha_1.describe)('[/users.setAvatar]', () => {
            (0, mocha_1.it)('should set the avatar of the logged user by a local image', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.setAvatar'))
                    .set(userCredentials)
                    .attach('image', interactions_1.imgURL)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should update the avatar of another user by userId when the logged user has the necessary permission (edit-other-user-avatar)', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.setAvatar'))
                    .set(userCredentials)
                    .attach('image', interactions_1.imgURL)
                    .field({ userId: api_data_1.credentials['X-User-Id'] })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should set the avatar of another user by username and local image when the logged user has the necessary permission (edit-other-user-avatar)', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.setAvatar'))
                    .set(api_data_1.credentials)
                    .attach('image', interactions_1.imgURL)
                    .field({ username: user_1.adminUsername })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
            (0, mocha_1.it)("should prevent from updating someone else's avatar when the logged user doesn't have the necessary permission(edit-other-user-avatar)", (done) => {
                void (0, permissions_helper_1.updatePermission)('edit-other-user-avatar', []).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.setAvatar'))
                        .set(userCredentials)
                        .attach('image', interactions_1.imgURL)
                        .field({ userId: api_data_1.credentials['X-User-Id'] })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                    })
                        .end(done);
                });
            });
            (0, mocha_1.it)('should allow users with the edit-other-user-avatar permission to update avatars when the Accounts_AllowUserAvatarChange setting is off', (done) => {
                void (0, permissions_helper_1.updateSetting)('Accounts_AllowUserAvatarChange', false).then(() => {
                    void (0, permissions_helper_1.updatePermission)('edit-other-user-avatar', ['admin']).then(() => {
                        void api_data_1.request
                            .post((0, api_data_1.api)('users.setAvatar'))
                            .set(api_data_1.credentials)
                            .attach('image', interactions_1.imgURL)
                            .field({ userId: userCredentials['X-User-Id'] })
                            .expect('Content-Type', 'application/json')
                            .expect(200)
                            .expect((res) => {
                            (0, chai_1.expect)(res.body).to.have.property('success', true);
                        })
                            .end(done);
                    });
                });
            });
            (0, mocha_1.it)('should prevent users from passing server-side request forgery (SSRF) payloads as avatarUrl', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.setAvatar'))
                    .set(api_data_1.credentials)
                    .send({
                    userId: userCredentials['X-User-Id'],
                    avatarUrl: 'http://169.254.169.254/',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                })
                    .end(done);
            });
        });
        (0, mocha_1.describe)('[/users.resetAvatar]', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield Promise.all([
                    (0, permissions_helper_1.updateSetting)('Accounts_AllowUserAvatarChange', true),
                    (0, permissions_helper_1.updatePermission)('edit-other-user-avatar', ['admin', 'user']),
                ]);
            }));
            (0, mocha_1.it)('should set the avatar of the logged user by a local image', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.setAvatar'))
                    .set(userCredentials)
                    .attach('image', interactions_1.imgURL)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should reset the avatar of the logged user', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.resetAvatar'))
                    .set(userCredentials)
                    .expect('Content-Type', 'application/json')
                    .send({
                    userId: userCredentials['X-User-Id'],
                })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should reset the avatar of another user by userId when the logged user has the necessary permission (edit-other-user-avatar)', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.resetAvatar'))
                    .set(userCredentials)
                    .send({
                    userId: api_data_1.credentials['X-User-Id'],
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should reset the avatar of another user by username and local image when the logged user has the necessary permission (edit-other-user-avatar)', (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.resetAvatar'))
                    .set(api_data_1.credentials)
                    .send({
                    username: user_1.adminUsername,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
            (0, mocha_1.it)("should prevent from resetting someone else's avatar when the logged user doesn't have the necessary permission(edit-other-user-avatar)", (done) => {
                void (0, permissions_helper_1.updatePermission)('edit-other-user-avatar', []).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.resetAvatar'))
                        .set(userCredentials)
                        .send({
                        userId: api_data_1.credentials['X-User-Id'],
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                    })
                        .end(done);
                });
            });
            (0, mocha_1.it)('should allow users with the edit-other-user-avatar permission to reset avatars when the Accounts_AllowUserAvatarChange setting is off', (done) => {
                void (0, permissions_helper_1.updateSetting)('Accounts_AllowUserAvatarChange', false).then(() => {
                    void (0, permissions_helper_1.updatePermission)('edit-other-user-avatar', ['admin']).then(() => {
                        void api_data_1.request
                            .post((0, api_data_1.api)('users.resetAvatar'))
                            .set(api_data_1.credentials)
                            .send({
                            userId: userCredentials['X-User-Id'],
                        })
                            .expect('Content-Type', 'application/json')
                            .expect(200)
                            .expect((res) => {
                            (0, chai_1.expect)(res.body).to.have.property('success', true);
                        })
                            .end(done);
                    });
                });
            });
        });
        (0, mocha_1.describe)('[/users.getAvatar]', () => {
            (0, mocha_1.it)('should get the url of the avatar of the logged user via userId', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('users.getAvatar'))
                    .set(userCredentials)
                    .query({
                    userId: userCredentials['X-User-Id'],
                })
                    .expect(307)
                    .end(done);
            });
            (0, mocha_1.it)('should get the url of the avatar of the logged user via username', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('users.getAvatar'))
                    .set(userCredentials)
                    .query({
                    username: user.username,
                })
                    .expect(307)
                    .end(done);
            });
        });
        (0, mocha_1.describe)('[/users.getAvatarSuggestion]', () => {
            (0, mocha_1.it)('should return 401 unauthorized when user is not logged in', (done) => {
                void api_data_1.request.get((0, api_data_1.api)('users.getAvatarSuggestion')).expect('Content-Type', 'application/json').expect(401).end(done);
            });
            (0, mocha_1.it)('should get avatar suggestion of the logged user via userId', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('users.getAvatarSuggestion'))
                    .set(userCredentials)
                    .query({
                    userId: userCredentials['X-User-Id'],
                })
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('suggestions').and.to.be.an('object');
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/users.update]', () => {
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            return Promise.all([
                (0, permissions_helper_1.updateSetting)('Accounts_AllowUserProfileChange', true),
                (0, permissions_helper_1.updateSetting)('Accounts_AllowUsernameChange', true),
                (0, permissions_helper_1.updateSetting)('Accounts_AllowRealNameChange', true),
                (0, permissions_helper_1.updateSetting)('Accounts_AllowUserStatusMessageChange', true),
                (0, permissions_helper_1.updateSetting)('Accounts_AllowEmailChange', true),
                (0, permissions_helper_1.updateSetting)('Accounts_AllowPasswordChange', true),
                (0, permissions_helper_1.updatePermission)('edit-other-user-info', ['admin']),
            ]);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            return Promise.all([
                (0, permissions_helper_1.updateSetting)('Accounts_AllowUserProfileChange', true),
                (0, permissions_helper_1.updateSetting)('Accounts_AllowUsernameChange', true),
                (0, permissions_helper_1.updateSetting)('Accounts_AllowRealNameChange', true),
                (0, permissions_helper_1.updateSetting)('Accounts_AllowUserStatusMessageChange', true),
                (0, permissions_helper_1.updateSetting)('Accounts_AllowEmailChange', true),
                (0, permissions_helper_1.updateSetting)('Accounts_AllowPasswordChange', true),
                (0, permissions_helper_1.updatePermission)('edit-other-user-info', ['admin']),
            ]);
        }));
        (0, mocha_1.it)("should update a user's info by userId", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.update'))
                .set(api_data_1.credentials)
                .send({
                userId: targetUser._id,
                data: {
                    email: api_data_1.apiEmail,
                    name: `edited${api_data_1.apiUsername}`,
                    username: `edited${api_data_1.apiUsername}`,
                    password: user_1.password,
                    active: true,
                    roles: ['user'],
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.username', `edited${api_data_1.apiUsername}`);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.emails[0].address', api_data_1.apiEmail);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.active', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.name', `edited${api_data_1.apiUsername}`);
                (0, chai_1.expect)(res.body).to.not.have.nested.property('user.e2e');
            })
                .end(done);
        });
        (0, mocha_1.it)("should update a user's email by userId", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.update'))
                .set(api_data_1.credentials)
                .send({
                userId: targetUser._id,
                data: {
                    email: `edited${api_data_1.apiEmail}`,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.emails[0].address', `edited${api_data_1.apiEmail}`);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.emails[0].verified', false);
                (0, chai_1.expect)(res.body).to.not.have.nested.property('user.e2e');
            })
                .end(done);
        });
        (0, mocha_1.it)("should update a user's bio by userId", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.update'))
                .set(api_data_1.credentials)
                .send({
                userId: targetUser._id,
                data: {
                    bio: `edited-bio-test`,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.bio', 'edited-bio-test');
                (0, chai_1.expect)(res.body).to.not.have.nested.property('user.e2e');
            })
                .end(done);
        });
        (0, mocha_1.it)("should update a user's nickname by userId", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.update'))
                .set(api_data_1.credentials)
                .send({
                userId: targetUser._id,
                data: {
                    nickname: `edited-nickname-test`,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.nickname', 'edited-nickname-test');
                (0, chai_1.expect)(res.body).to.not.have.nested.property('user.e2e');
            })
                .end(done);
        });
        (0, mocha_1.it)(`should return an error when trying to set a nickname longer than ${MAX_NICKNAME_LENGTH} characters`, (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.update'))
                .set(api_data_1.credentials)
                .send({
                userId: targetUser._id,
                data: {
                    nickname: random_1.Random.hexString(MAX_NICKNAME_LENGTH + 1),
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', `Nickname size exceeds ${MAX_NICKNAME_LENGTH} characters [error-nickname-size-exceeded]`);
            })
                .end(done);
        });
        (0, mocha_1.it)(`should return an error when trying to set a bio longer than ${MAX_BIO_LENGTH} characters`, (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.update'))
                .set(api_data_1.credentials)
                .send({
                userId: targetUser._id,
                data: {
                    bio: random_1.Random.hexString(MAX_BIO_LENGTH + 1),
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', `Bio size exceeds ${MAX_BIO_LENGTH} characters [error-bio-size-exceeded]`);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when trying to upsert a user by sending an empty userId', () => {
            return api_data_1.request
                .post((0, api_data_1.api)('users.update'))
                .set(api_data_1.credentials)
                .send({
                userId: '',
                data: {},
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
                (0, chai_1.expect)(res.body).to.have.property('error', 'must NOT have fewer than 1 characters [invalid-params]');
            });
        });
        (0, mocha_1.it)('should return an error when trying to use the joinDefaultChannels param, which is not intended for updates', () => {
            return api_data_1.request
                .post((0, api_data_1.api)('users.update'))
                .set(api_data_1.credentials)
                .send({
                userId: targetUser._id,
                data: {
                    joinDefaultChannels: true,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
                (0, chai_1.expect)(res.body).to.have.property('error', 'must NOT have additional properties [invalid-params]');
            });
        });
        (0, mocha_1.it)("should update a bot's email", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.update'))
                .set(api_data_1.credentials)
                .send({
                userId: 'rocket.cat',
                data: { email: 'nouser@rocket.cat' },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)("should verify user's email by userId", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.update'))
                .set(api_data_1.credentials)
                .send({
                userId: targetUser._id,
                data: {
                    verified: true,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.emails[0].verified', true);
                (0, chai_1.expect)(res.body).to.not.have.nested.property('user.e2e');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when trying update username and it is not allowed', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-info', ['user']).then(() => {
                void (0, permissions_helper_1.updateSetting)('Accounts_AllowUsernameChange', false).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.update'))
                        .set(api_data_1.credentials)
                        .send({
                        userId: targetUser._id,
                        data: {
                            username: 'fake.name',
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should update the user name when the required permission is applied', () => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([(0, permissions_helper_1.updatePermission)('edit-other-user-info', ['admin']), (0, permissions_helper_1.updateSetting)('Accounts_AllowUsernameChange', false)]);
            yield api_data_1.request
                .post((0, api_data_1.api)('users.update'))
                .set(api_data_1.credentials)
                .send({
                userId: targetUser._id,
                data: {
                    username: `fake.name.${Date.now()}`,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should return an error when trying update user real name and it is not allowed', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-info', ['user']).then(() => {
                void (0, permissions_helper_1.updateSetting)('Accounts_AllowRealNameChange', false).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.update'))
                        .set(api_data_1.credentials)
                        .send({
                        userId: targetUser._id,
                        data: {
                            name: 'Fake name',
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should update user real name when the required permission is applied', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-info', ['admin']).then(() => {
                void (0, permissions_helper_1.updateSetting)('Accounts_AllowRealNameChange', false).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.update'))
                        .set(api_data_1.credentials)
                        .send({
                        userId: targetUser._id,
                        data: {
                            name: 'Fake name',
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should return an error when trying update user status message and it is not allowed', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-info', ['user']).then(() => {
                void (0, permissions_helper_1.updateSetting)('Accounts_AllowUserStatusMessageChange', false).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.update'))
                        .set(api_data_1.credentials)
                        .send({
                        userId: targetUser._id,
                        data: {
                            statusMessage: 'a new status',
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should update user status message when the required permission is applied', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-info', ['admin']).then(() => {
                void (0, permissions_helper_1.updateSetting)('Accounts_AllowUserStatusMessageChange', false).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.update'))
                        .set(api_data_1.credentials)
                        .send({
                        userId: targetUser._id,
                        data: {
                            name: 'a new status',
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should return an error when trying update user email and it is not allowed', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-info', ['user']).then(() => {
                void (0, permissions_helper_1.updateSetting)('Accounts_AllowEmailChange', false).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.update'))
                        .set(api_data_1.credentials)
                        .send({
                        userId: targetUser._id,
                        data: {
                            email: 'itsnotworking@email.com',
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should update user email when the required permission is applied', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-info', ['admin']).then(() => {
                void (0, permissions_helper_1.updateSetting)('Accounts_AllowEmailChange', false).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.update'))
                        .set(api_data_1.credentials)
                        .send({
                        userId: targetUser._id,
                        data: {
                            email: api_data_1.apiEmail,
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should return an error when trying update user password and it is not allowed', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-password', ['user']).then(() => {
                void (0, permissions_helper_1.updateSetting)('Accounts_AllowPasswordChange', false).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.update'))
                        .set(api_data_1.credentials)
                        .send({
                        userId: targetUser._id,
                        data: {
                            password: 'itsnotworking',
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should update user password when the required permission is applied', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-password', ['admin']).then(() => {
                void (0, permissions_helper_1.updateSetting)('Accounts_AllowPasswordChange', false).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.update'))
                        .set(api_data_1.credentials)
                        .send({
                        userId: targetUser._id,
                        data: {
                            password: 'itsnotworking',
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should return an error when trying update profile and it is not allowed', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-info', ['user']).then(() => {
                void (0, permissions_helper_1.updateSetting)('Accounts_AllowUserProfileChange', false).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.update'))
                        .set(api_data_1.credentials)
                        .send({
                        userId: targetUser._id,
                        data: {
                            verified: true,
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should update profile when the required permission is applied', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-info', ['admin']).then(() => {
                void (0, permissions_helper_1.updateSetting)('Accounts_AllowUserProfileChange', false).then(() => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.update'))
                        .set(api_data_1.credentials)
                        .send({
                        userId: targetUser._id,
                        data: {
                            verified: true,
                        },
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.it)('should delete requirePasswordChangeReason when requirePasswordChange is set to false', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)({
                requirePasswordChange: true,
            });
            yield updateUserInDb(user._id, { requirePasswordChangeReason: 'any_data' });
            yield api_data_1.request
                .post((0, api_data_1.api)('users.update'))
                .set(api_data_1.credentials)
                .send({
                userId: user._id,
                data: {
                    requirePasswordChange: false,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('user');
                (0, chai_1.expect)(res.body.user).to.have.property('requirePasswordChange', false);
                (0, chai_1.expect)(res.body.user).to.not.have.property('requirePasswordChangeReason');
            });
            yield (0, users_helper_1.deleteUser)(user);
        }));
        function failUpdateUser(name) {
            (0, mocha_1.it)(`should not update an user if the new username is the reserved word ${name}`, (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.update'))
                    .set(api_data_1.credentials)
                    .send({
                    userId: targetUser._id,
                    data: {
                        username: name,
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'Could not save user identity [error-could-not-save-identity]');
                })
                    .end(done);
            });
        }
        api_data_1.reservedWords.forEach((name) => {
            failUpdateUser(name);
        });
    });
    (0, mocha_1.describe)('[/users.updateOwnBasicInfo]', () => {
        let user;
        let userCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
            userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, users_helper_1.deleteUser)(user),
            (0, permissions_helper_1.updateSetting)('E2E_Enable', false),
            (0, permissions_helper_1.updateSetting)('Accounts_AllowRealNameChange', true),
            (0, permissions_helper_1.updateSetting)('Accounts_AllowUsernameChange', true),
            (0, permissions_helper_1.updateSetting)('Accounts_AllowUserStatusMessageChange', true),
            (0, permissions_helper_1.updateSetting)('Accounts_AllowEmailChange', true),
            (0, permissions_helper_1.updateSetting)('Accounts_AllowPasswordChange', true),
        ]));
        const newPassword = `${user_1.password}test`;
        const currentPassword = crypto_1.default.createHash('sha256').update(user_1.password, 'utf8').digest('hex');
        const editedUsername = `basicInfo.name${+new Date()}`;
        const editedName = `basic-info-test-name${+new Date()}`;
        const editedEmail = `test${+new Date()}@mail.com`;
        (0, mocha_1.it)('enabling E2E in server and generating keys to user...', (done) => {
            void (0, permissions_helper_1.updateSetting)('E2E_Enable', true).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('e2e.setUserPublicAndPrivateKeys'))
                    .set(userCredentials)
                    .send({
                    private_key: 'test',
                    public_key: 'test',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should update the user own basic information', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                .set(userCredentials)
                .send({
                data: {
                    name: editedName,
                    username: editedUsername,
                    currentPassword,
                    newPassword,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                const { user } = res.body;
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(user.username).to.be.equal(editedUsername);
                (0, chai_1.expect)(user.name).to.be.equal(editedName);
                (0, chai_1.expect)(user).to.not.have.property('e2e');
            })
                .end(done);
        });
        (0, mocha_1.it)('should update the user name only', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                .set(userCredentials)
                .send({
                data: {
                    username: editedUsername,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                const { user } = res.body;
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(user.username).to.be.equal(editedUsername);
                (0, chai_1.expect)(user).to.not.have.property('e2e');
            })
                .end(done);
        });
        (0, mocha_1.it)('should throw an error when user try change email without the password', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                .set(userCredentials)
                .send({
                data: {
                    email: editedEmail,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .end(done);
        });
        (0, mocha_1.it)('should throw an error when user try change password without the actual password', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                .set(api_data_1.credentials)
                .send({
                data: {
                    newPassword: 'the new pass',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .end(done);
        });
        (0, mocha_1.it)('should throw an error when the name is only whitespaces', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                .set(api_data_1.credentials)
                .send({
                data: {
                    name: '  ',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
        (0, mocha_1.it)("should set new email as 'unverified'", (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                .set(userCredentials)
                .send({
                data: {
                    email: editedEmail,
                    currentPassword: crypto_1.default.createHash('sha256').update(newPassword, 'utf8').digest('hex'),
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                const { user } = res.body;
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(user.emails[0].address).to.be.equal(editedEmail);
                (0, chai_1.expect)(user.emails[0].verified).to.be.false;
                (0, chai_1.expect)(user).to.not.have.property('e2e');
            })
                .end(done);
        });
        function failUpdateUserOwnBasicInfo(name) {
            (0, mocha_1.it)(`should not update an user's basic info if the new username is the reserved word ${name}`, (done) => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                    .set(api_data_1.credentials)
                    .send({
                    data: {
                        username: name,
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'Could not save user identity [error-could-not-save-identity]');
                })
                    .end(done);
            });
        }
        api_data_1.reservedWords.forEach((name) => {
            failUpdateUserOwnBasicInfo(name);
        });
        (0, mocha_1.it)('should throw an error if not allowed to change real name', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Accounts_AllowRealNameChange', false);
            yield api_data_1.request
                .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                .set(api_data_1.credentials)
                .send({
                data: {
                    name: 'edited name',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should throw an error if not allowed to change username', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Accounts_AllowUsernameChange', false);
            yield api_data_1.request
                .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                .set(api_data_1.credentials)
                .send({
                data: {
                    username: 'edited.user.name',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should throw an error if not allowed to change statusText', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Accounts_AllowUserStatusMessageChange', false);
            yield api_data_1.request
                .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                .set(api_data_1.credentials)
                .send({
                data: {
                    statusText: 'My custom status',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should throw an error if not allowed to change email', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Accounts_AllowEmailChange', false);
            yield api_data_1.request
                .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                .set(api_data_1.credentials)
                .send({
                data: {
                    email: 'changed@email.com',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.it)('should throw an error if not allowed to change password', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Accounts_AllowPasswordChange', false);
            yield api_data_1.request
                .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                .set(api_data_1.credentials)
                .send({
                data: {
                    newPassword: 'MyNewPassw0rd',
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            });
        }));
        (0, mocha_1.describe)('[Password Policy]', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Accounts_AllowPasswordChange', true);
                yield (0, permissions_helper_1.updateSetting)('Accounts_Password_Policy_Enabled', true);
                yield (0, permissions_helper_1.updateSetting)('Accounts_TwoFactorAuthentication_Enabled', false);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Accounts_AllowPasswordChange', true);
                yield (0, permissions_helper_1.updateSetting)('Accounts_Password_Policy_Enabled', false);
                yield (0, permissions_helper_1.updateSetting)('Accounts_TwoFactorAuthentication_Enabled', true);
            }));
            (0, mocha_1.it)('should throw an error if the password length is less than the minimum length', () => __awaiter(void 0, void 0, void 0, function* () {
                const expectedError = {
                    error: 'error-password-policy-not-met-minLength',
                    message: 'The password does not meet the minimum length password policy.',
                };
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                    .set(userCredentials)
                    .send({
                    data: {
                        currentPassword,
                        newPassword: '2',
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error');
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('error-password-policy-not-met');
                    (0, chai_1.expect)(res.body.details).to.be.an('array').that.deep.includes(expectedError);
                })
                    .expect(400);
            }));
            (0, mocha_1.it)('should throw an error if the password length is greater than the maximum length', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Accounts_Password_Policy_MaxLength', 5);
                const expectedError = {
                    error: 'error-password-policy-not-met-maxLength',
                    message: 'The password does not meet the maximum length password policy.',
                };
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                    .set(userCredentials)
                    .send({
                    data: {
                        currentPassword,
                        newPassword: 'Abc@12345678',
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error');
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('error-password-policy-not-met');
                    (0, chai_1.expect)(res.body.details).to.be.an('array').that.deep.includes(expectedError);
                })
                    .expect(400);
            }));
            (0, mocha_1.it)('should throw an error if the password contains repeating characters', () => __awaiter(void 0, void 0, void 0, function* () {
                const expectedError = {
                    error: 'error-password-policy-not-met-repeatingCharacters',
                    message: 'The password contains repeating characters which is against the password policy.',
                };
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                    .set(userCredentials)
                    .send({
                    data: {
                        currentPassword,
                        newPassword: 'A@123aaaa',
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error');
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('error-password-policy-not-met');
                    (0, chai_1.expect)(res.body.details).to.be.an('array').that.deep.includes(expectedError);
                })
                    .expect(400);
            }));
            (0, mocha_1.it)('should throw an error if the password does not contain at least one lowercase character', () => __awaiter(void 0, void 0, void 0, function* () {
                const expectedError = {
                    error: 'error-password-policy-not-met-oneLowercase',
                    message: 'The password does not contain at least one lowercase character which is against the password policy.',
                };
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                    .set(userCredentials)
                    .send({
                    data: {
                        currentPassword,
                        newPassword: 'PASSWORD@123',
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error');
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('error-password-policy-not-met');
                    (0, chai_1.expect)(res.body.details).to.be.an('array').that.deep.includes(expectedError);
                })
                    .expect(400);
            }));
            (0, mocha_1.it)('should throw an error if the password does not contain at least one uppercase character', () => __awaiter(void 0, void 0, void 0, function* () {
                const expectedError = {
                    error: 'error-password-policy-not-met-oneUppercase',
                    message: 'The password does not contain at least one uppercase character which is against the password policy.',
                };
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                    .set(userCredentials)
                    .send({
                    data: {
                        currentPassword,
                        newPassword: 'password@123',
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error');
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('error-password-policy-not-met');
                    (0, chai_1.expect)(res.body.details).to.be.an('array').that.deep.includes(expectedError);
                })
                    .expect(400);
            }));
            (0, mocha_1.it)('should throw an error if the password does not contain at least one numerical character', () => __awaiter(void 0, void 0, void 0, function* () {
                const expectedError = {
                    error: 'error-password-policy-not-met-oneNumber',
                    message: 'The password does not contain at least one numerical character which is against the password policy.',
                };
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                    .set(userCredentials)
                    .send({
                    data: {
                        currentPassword,
                        newPassword: 'Password@',
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error');
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('error-password-policy-not-met');
                    (0, chai_1.expect)(res.body.details).to.be.an('array').that.deep.includes(expectedError);
                })
                    .expect(400);
            }));
            (0, mocha_1.it)('should throw an error if the password does not contain at least one special character', () => __awaiter(void 0, void 0, void 0, function* () {
                const expectedError = {
                    error: 'error-password-policy-not-met-oneSpecial',
                    message: 'The password does not contain at least one special character which is against the password policy.',
                };
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                    .set(userCredentials)
                    .send({
                    data: {
                        currentPassword,
                        newPassword: 'Password123',
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error');
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('error-password-policy-not-met');
                    (0, chai_1.expect)(res.body.details).to.be.an('array').that.deep.includes(expectedError);
                })
                    .expect(400);
            }));
            (0, mocha_1.it)('should be able to update if the password meets all the validation rules', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updateSetting)('Accounts_Password_Policy_MaxLength', -1);
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.updateOwnBasicInfo'))
                    .set(userCredentials)
                    .send({
                    data: {
                        currentPassword,
                        newPassword: '123Abc@!',
                    },
                })
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('user');
                })
                    .expect(200);
            }));
        });
    });
    // TODO check for all response fields
    (0, mocha_1.describe)('[/users.setPreferences]', () => {
        (0, mocha_1.after)(() => (0, permissions_helper_1.updatePermission)('edit-other-user-info', ['admin']));
        (0, mocha_1.it)('should return an error when the user try to update info of another user and does not have the necessary permission', (done) => {
            const userPreferences = {
                userId: 'rocket.cat',
                data: Object.assign({}, preferences.data),
            };
            void (0, permissions_helper_1.updatePermission)('edit-other-user-info', []).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.setPreferences'))
                    .set(api_data_1.credentials)
                    .send(userPreferences)
                    .expect(400)
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'Editing user is not allowed [error-action-not-allowed]');
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-action-not-allowed');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the user try to update info of an nonexistent user', (done) => {
            const userPreferences = {
                userId: 'invalid-id',
                data: Object.assign({}, preferences.data),
            };
            void (0, permissions_helper_1.updatePermission)('edit-other-user-info', ['admin', 'user']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.setPreferences'))
                    .set(api_data_1.credentials)
                    .send(userPreferences)
                    .expect(400)
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'The optional "userId" param provided does not match any users [error-invalid-user]');
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-user');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should set some preferences of another user successfully', (done) => {
            const userPreferences = {
                userId: 'rocket.cat',
                data: Object.assign({}, preferences.data),
            };
            void (0, permissions_helper_1.updatePermission)('edit-other-user-info', ['admin', 'user']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.setPreferences'))
                    .set(api_data_1.credentials)
                    .send(userPreferences)
                    .expect(200)
                    .expect('Content-Type', 'application/json')
                    .expect((res) => {
                    (0, chai_1.expect)(res.body.user).to.have.property('settings');
                    (0, chai_1.expect)(res.body.user.settings).to.have.property('preferences');
                    (0, chai_1.expect)(res.body.user._id).to.be.equal('rocket.cat');
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should set some preferences by user when execute successfully', (done) => {
            const userPreferences = {
                userId: api_data_1.credentials['X-User-Id'],
                data: Object.assign({}, preferences.data),
            };
            void api_data_1.request
                .post((0, api_data_1.api)('users.setPreferences'))
                .set(api_data_1.credentials)
                .send(userPreferences)
                .expect(200)
                .expect('Content-Type', 'application/json')
                .expect((res) => {
                (0, chai_1.expect)(res.body.user).to.have.property('settings');
                (0, chai_1.expect)(res.body.user.settings).to.have.property('preferences');
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should set some preferences and language preference by user when execute successfully', (done) => {
            const userPreferences = {
                userId: api_data_1.credentials['X-User-Id'],
                data: Object.assign(Object.assign({}, preferences.data), { language: 'en' }),
            };
            void api_data_1.request
                .post((0, api_data_1.api)('users.setPreferences'))
                .set(api_data_1.credentials)
                .send(userPreferences)
                .expect(200)
                .expect('Content-Type', 'application/json')
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.user.settings.preferences).to.have.property('language', 'en');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/users.getPreferences]', () => {
        (0, mocha_1.it)('should return all preferences when execute successfully', (done) => {
            const userPreferences = Object.assign(Object.assign({}, preferences.data), { language: 'en' });
            void api_data_1.request
                .get((0, api_data_1.api)('users.getPreferences'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect('Content-Type', 'application/json')
                .expect((res) => {
                (0, chai_1.expect)(res.body.preferences).to.be.eql(userPreferences);
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/users.forgotPassword]', () => {
        (0, mocha_1.it)('should return an error when "Accounts_PasswordReset" is disabled', (done) => {
            void (0, permissions_helper_1.updateSetting)('Accounts_PasswordReset', false).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.forgotPassword'))
                    .send({
                    email: user_1.adminEmail,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'Password reset is not enabled');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should send email to user (return success), when is a valid email', (done) => {
            void (0, permissions_helper_1.updateSetting)('Accounts_PasswordReset', true).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.forgotPassword'))
                    .send({
                    email: user_1.adminEmail,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should not send email to user(return error), when is a invalid email', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.forgotPassword'))
                .send({
                email: 'invalidEmail',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/users.sendConfirmationEmail]', () => {
        (0, mocha_1.it)('should send email to user (return success), when is a valid email', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.sendConfirmationEmail'))
                .set(api_data_1.credentials)
                .send({
                email: user_1.adminEmail,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should not send email to user(return error), when is a invalid email', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.sendConfirmationEmail'))
                .set(api_data_1.credentials)
                .send({
                email: 'invalidEmail',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/users.getUsernameSuggestion]', () => {
        const testUsername = `test${+new Date()}`;
        let targetUser;
        let userCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            targetUser = yield registerUser({
                email: `${testUsername}.@test.com`,
                username: `${testUsername}test`,
                name: testUsername,
                pass: user_1.password,
            });
            userCredentials = yield (0, users_helper_1.login)(targetUser.username, user_1.password);
        }));
        (0, mocha_1.after)(() => (0, users_helper_1.deleteUser)(targetUser));
        (0, mocha_1.it)('should return an username suggestion', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.getUsernameSuggestion'))
                .set(userCredentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.exist;
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/users.checkUsernameAvailability]', () => {
        let targetUser;
        let userCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            targetUser = yield registerUser();
            userCredentials = yield (0, users_helper_1.login)(targetUser.username, user_1.password);
        }));
        (0, mocha_1.after)(() => (0, users_helper_1.deleteUser)(targetUser));
        (0, mocha_1.it)('should return 401 unauthorized when user is not logged in', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.checkUsernameAvailability'))
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return true if the username is the same user username set', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.checkUsernameAvailability'))
                .set(userCredentials)
                .query({
                username: targetUser.username,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.result).to.be.equal(true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return true if the username is available', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.checkUsernameAvailability'))
                .set(userCredentials)
                .query({
                username: `${targetUser.username}-${+new Date()}`,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body.result).to.be.equal(true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when the username is invalid', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.checkUsernameAvailability'))
                .set(userCredentials)
                .query({})
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/users.deleteOwnAccount]', () => {
        let targetUser;
        let userCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            targetUser = yield registerUser();
            userCredentials = yield (0, users_helper_1.login)(targetUser.username, user_1.password);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () { return (0, users_helper_1.deleteUser)(targetUser); }));
        (0, mocha_1.it)('Enable "Accounts_AllowDeleteOwnAccount" setting...', (done) => {
            void api_data_1.request
                .post('/api/v1/settings/Accounts_AllowDeleteOwnAccount')
                .set(api_data_1.credentials)
                .send({ value: true })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end((0, api_data_1.wait)(done, 200));
        });
        (0, mocha_1.it)('should delete user own account', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.deleteOwnAccount'))
                .set(userCredentials)
                .send({
                password: crypto_1.default.createHash('sha256').update(user_1.password, 'utf8').digest('hex'),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should delete user own account when the SHA256 hash is in upper case', () => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield (0, users_helper_1.createUser)();
            const createdUserCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield api_data_1.request
                .post((0, api_data_1.api)('users.deleteOwnAccount'))
                .set(createdUserCredentials)
                .send({
                password: crypto_1.default.createHash('sha256').update(user_1.password, 'utf8').digest('hex').toUpperCase(),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            yield (0, users_helper_1.deleteUser)(user);
        }));
        (0, mocha_1.describe)('last owner cases', () => {
            let user;
            let createdUserCredentials;
            let room;
            (0, mocha_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
                user = yield (0, users_helper_1.createUser)();
                createdUserCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
                room = (yield (0, rooms_helper_1.createRoom)({
                    type: 'c',
                    name: `channel.test.${Date.now()}-${Math.random()}`,
                    username: user.username,
                    members: [user.username],
                })).body.channel;
                yield addRoomOwner({ type: 'c', roomId: room._id, userId: user._id });
                yield removeRoomOwner({ type: 'c', roomId: room._id, userId: api_data_1.credentials['X-User-Id'] });
            }));
            (0, mocha_1.afterEach)(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: room._id });
                yield (0, users_helper_1.deleteUser)(user);
            }));
            (0, mocha_1.it)('should return an error when trying to delete user own account if user is the last room owner', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.deleteOwnAccount'))
                    .set(createdUserCredentials)
                    .send({
                    password: crypto_1.default.createHash('sha256').update(user_1.password, 'utf8').digest('hex'),
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', '[user-last-owner]');
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'user-last-owner');
                });
            }));
            (0, mocha_1.it)('should delete user own account if the user is the last room owner and `confirmRelinquish` is set to `true`', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.deleteOwnAccount'))
                    .set(createdUserCredentials)
                    .send({
                    password: crypto_1.default.createHash('sha256').update(user_1.password, 'utf8').digest('hex'),
                    confirmRelinquish: true,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
            }));
            (0, mocha_1.it)('should assign a new owner to the room if the last room owner is deleted', () => __awaiter(void 0, void 0, void 0, function* () {
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.deleteOwnAccount'))
                    .set(createdUserCredentials)
                    .send({
                    password: crypto_1.default.createHash('sha256').update(user_1.password, 'utf8').digest('hex'),
                    confirmRelinquish: true,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
                const roles = yield getChannelRoles({ roomId: room._id });
                (0, chai_1.expect)(roles).to.have.lengthOf(1);
                (0, chai_1.expect)(roles[0].roles).to.eql(['owner']);
                (0, chai_1.expect)(roles[0].u).to.have.property('_id', api_data_1.credentials['X-User-Id']);
            }));
        });
    });
    (0, mocha_1.describe)('[/users.delete]', () => {
        let newUser;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            newUser = yield (0, users_helper_1.createUser)();
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(newUser);
            yield (0, permissions_helper_1.updatePermission)('delete-user', ['admin']);
        }));
        (0, mocha_1.it)('should return an error when trying delete user account without "delete-user" permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('delete-user', ['user']);
            yield api_data_1.request
                .post((0, api_data_1.api)('users.delete'))
                .set(api_data_1.credentials)
                .send({
                userId: targetUser._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
        (0, mocha_1.it)('should delete user account when logged user has "delete-user" permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('delete-user', ['admin']);
            yield api_data_1.request
                .post((0, api_data_1.api)('users.delete'))
                .set(api_data_1.credentials)
                .send({
                userId: newUser._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.describe)('last owner cases', () => {
            let targetUser;
            let room;
            (0, mocha_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
                targetUser = yield registerUser();
                room = (yield (0, rooms_helper_1.createRoom)({
                    type: 'c',
                    name: `channel.test.${Date.now()}-${Math.random()}`,
                    members: [targetUser.username],
                })).body.channel;
                yield addRoomOwner({ type: 'c', roomId: room._id, userId: targetUser._id });
                yield removeRoomOwner({ type: 'c', roomId: room._id, userId: api_data_1.credentials['X-User-Id'] });
            }));
            (0, mocha_1.afterEach)(() => Promise.all([(0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: room._id }), (0, users_helper_1.deleteUser)(targetUser, { confirmRelinquish: true })]));
            (0, mocha_1.it)('should return an error when trying to delete user account if the user is the last room owner', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updatePermission)('delete-user', ['admin']);
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.delete'))
                    .set(api_data_1.credentials)
                    .send({
                    userId: targetUser._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', '[user-last-owner]');
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'user-last-owner');
                });
            }));
            (0, mocha_1.it)('should delete user account if the user is the last room owner and `confirmRelinquish` is set to `true`', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updatePermission)('delete-user', ['admin']);
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.delete'))
                    .set(api_data_1.credentials)
                    .send({
                    userId: targetUser._id,
                    confirmRelinquish: true,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
            }));
            (0, mocha_1.it)('should assign a new owner to the room if the last room owner is deleted', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updatePermission)('delete-user', ['admin']);
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.delete'))
                    .set(api_data_1.credentials)
                    .send({
                    userId: targetUser._id,
                    confirmRelinquish: true,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
                const roles = yield getChannelRoles({ roomId: room._id });
                (0, chai_1.expect)(roles).to.have.lengthOf(1);
                (0, chai_1.expect)(roles[0].roles).to.eql(['owner']);
                (0, chai_1.expect)(roles[0].u).to.have.property('_id', api_data_1.credentials['X-User-Id']);
            }));
        });
    });
    (0, mocha_1.describe)('Personal Access Tokens', () => {
        const tokenName = `${Date.now()}token`;
        (0, mocha_1.describe)('successful cases', () => {
            (0, mocha_1.before)(() => (0, permissions_helper_1.updatePermission)('create-personal-access-tokens', ['admin']));
            (0, mocha_1.after)(() => (0, permissions_helper_1.updatePermission)('create-personal-access-tokens', ['admin']));
            (0, mocha_1.describe)('[/users.getPersonalAccessTokens]', () => {
                (0, mocha_1.it)('should return an array when the user does not have personal tokens configured', (done) => {
                    void api_data_1.request
                        .get((0, api_data_1.api)('users.getPersonalAccessTokens'))
                        .set(api_data_1.credentials)
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.property('tokens').and.to.be.an('array');
                    })
                        .end(done);
                });
            });
            (0, mocha_1.describe)('[/users.generatePersonalAccessToken]', () => {
                (0, mocha_1.it)('should return a personal access token to user', (done) => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.generatePersonalAccessToken'))
                        .set(api_data_1.credentials)
                        .send({
                        tokenName,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.property('token');
                    })
                        .end(done);
                });
                (0, mocha_1.it)('should throw an error when user tries generate a token with the same name', (done) => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.generatePersonalAccessToken'))
                        .set(api_data_1.credentials)
                        .send({
                        tokenName,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                    })
                        .end(done);
                });
            });
            (0, mocha_1.describe)('[/users.regeneratePersonalAccessToken]', () => {
                (0, mocha_1.it)('should return a personal access token to user when user regenerates the token', (done) => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.regeneratePersonalAccessToken'))
                        .set(api_data_1.credentials)
                        .send({
                        tokenName,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.property('token');
                    })
                        .end(done);
                });
                (0, mocha_1.it)('should throw an error when user tries regenerate a token that does not exist', (done) => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.regeneratePersonalAccessToken'))
                        .set(api_data_1.credentials)
                        .send({
                        tokenName: 'tokenthatdoesnotexist',
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                    })
                        .end(done);
                });
            });
            (0, mocha_1.describe)('[/users.getPersonalAccessTokens]', () => {
                (0, mocha_1.it)('should return my personal access tokens', (done) => {
                    void api_data_1.request
                        .get((0, api_data_1.api)('users.getPersonalAccessTokens'))
                        .set(api_data_1.credentials)
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                        (0, chai_1.expect)(res.body).to.have.property('tokens').and.to.be.an('array');
                    })
                        .end(done);
                });
            });
            (0, mocha_1.describe)('[/users.removePersonalAccessToken]', () => {
                (0, mocha_1.it)('should return success when user remove a personal access token', (done) => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.removePersonalAccessToken'))
                        .set(api_data_1.credentials)
                        .send({
                        tokenName,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', true);
                    })
                        .end(done);
                });
                (0, mocha_1.it)('should throw an error when user tries remove a token that does not exist', (done) => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.removePersonalAccessToken'))
                        .set(api_data_1.credentials)
                        .send({
                        tokenName: 'tokenthatdoesnotexist',
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                    })
                        .end(done);
                });
            });
        });
        (0, mocha_1.describe)('unsuccessful cases', () => {
            (0, mocha_1.before)(() => (0, permissions_helper_1.updatePermission)('create-personal-access-tokens', []));
            (0, mocha_1.after)(() => (0, permissions_helper_1.updatePermission)('create-personal-access-tokens', ['admin']));
            (0, mocha_1.describe)('should return an error when the user dont have the necessary permission "create-personal-access-tokens"', () => {
                (0, mocha_1.it)('/users.generatePersonalAccessToken', (done) => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.generatePersonalAccessToken'))
                        .set(api_data_1.credentials)
                        .send({
                        tokenName,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                        (0, chai_1.expect)(res.body.errorType).to.be.equal('not-authorized');
                    })
                        .end(done);
                });
                (0, mocha_1.it)('/users.regeneratePersonalAccessToken', (done) => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.regeneratePersonalAccessToken'))
                        .set(api_data_1.credentials)
                        .send({
                        tokenName,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                        (0, chai_1.expect)(res.body.errorType).to.be.equal('not-authorized');
                    })
                        .end(done);
                });
                (0, mocha_1.it)('/users.getPersonalAccessTokens', (done) => {
                    void api_data_1.request
                        .get((0, api_data_1.api)('users.getPersonalAccessTokens'))
                        .set(api_data_1.credentials)
                        .expect('Content-Type', 'application/json')
                        .expect(403)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                        (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
                    })
                        .end(done);
                });
                (0, mocha_1.it)('/users.removePersonalAccessToken', (done) => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.removePersonalAccessToken'))
                        .set(api_data_1.credentials)
                        .send({
                        tokenName,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                        (0, chai_1.expect)(res.body.errorType).to.be.equal('not-authorized');
                    })
                        .end(done);
                });
                (0, mocha_1.it)('should throw an error when user tries remove a token that does not exist', (done) => {
                    void api_data_1.request
                        .post((0, api_data_1.api)('users.removePersonalAccessToken'))
                        .set(api_data_1.credentials)
                        .send({
                        tokenName: 'tokenthatdoesnotexist',
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((res) => {
                        (0, chai_1.expect)(res.body).to.have.property('success', false);
                        (0, chai_1.expect)(res.body.errorType).to.be.equal('not-authorized');
                    })
                        .end(done);
                });
            });
        });
    });
    (0, mocha_1.describe)('[/users.setActiveStatus]', () => {
        let user;
        let agent;
        let agentUser;
        let userCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            agentUser = yield (0, users_helper_1.createUser)();
            const agentUserCredentials = yield (0, users_helper_1.login)(agentUser.username, user_1.password);
            yield (0, rooms_1.createAgent)(agentUser.username);
            yield (0, rooms_1.makeAgentAvailable)(agentUserCredentials);
            agent = {
                user: agentUser,
                credentials: agentUserCredentials,
            };
        }));
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
            userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield Promise.all([
                (0, permissions_helper_1.updatePermission)('edit-other-user-active-status', ['admin', 'user']),
                (0, permissions_helper_1.updatePermission)('manage-moderation-actions', ['admin']),
            ]);
        }));
        (0, mocha_1.after)(() => Promise.all([
            (0, users_helper_1.deleteUser)(user),
            (0, permissions_helper_1.updatePermission)('edit-other-user-active-status', ['admin']),
            (0, permissions_helper_1.updatePermission)('manage-moderation-actions', ['admin']),
        ]));
        (0, mocha_1.after)(() => Promise.all([(0, users_1.removeAgent)(agent.user._id), (0, users_helper_1.deleteUser)(agent.user)]));
        (0, mocha_1.it)('should set other user active status to false when the logged user has the necessary permission(edit-other-user-active-status)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.setActiveStatus'))
                .set(userCredentials)
                .send({
                activeStatus: false,
                userId: targetUser._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.active', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('should set other user active status to true when the logged user has the necessary permission(edit-other-user-active-status)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.setActiveStatus'))
                .set(userCredentials)
                .send({
                activeStatus: true,
                userId: targetUser._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('user.active', true);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when trying to set other user active status and has not the necessary permission(edit-other-user-active-status)', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-active-status', []).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.setActiveStatus'))
                    .set(userCredentials)
                    .send({
                    activeStatus: false,
                    userId: targetUser._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(403)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when trying to set user own active status and has not the necessary permission(edit-other-user-active-status)', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.setActiveStatus'))
                .set(userCredentials)
                .send({
                activeStatus: false,
                userId: user._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            })
                .end(done);
        });
        (0, mocha_1.it)('should set user own active status to false when the user has the necessary permission(edit-other-user-active-status)', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-active-status', ['admin']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.setActiveStatus'))
                    .set(userCredentials)
                    .send({
                    activeStatus: false,
                    userId: user._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(403)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('users should retain their roles when they are deactivated', () => __awaiter(void 0, void 0, void 0, function* () {
            const testUser = yield (0, users_helper_1.createUser)({ roles: ['user', 'livechat-agent'] });
            yield api_data_1.request
                .post((0, api_data_1.api)('users.setActiveStatus'))
                .set(api_data_1.credentials)
                .send({
                activeStatus: false,
                userId: testUser._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            const user = yield (0, users_helper_1.getUserByUsername)(testUser.username);
            (0, chai_1.expect)(user).to.have.property('roles');
            (0, chai_1.expect)(user.roles).to.be.an('array').of.length(2);
            (0, chai_1.expect)(user.roles).to.include('user', 'livechat-agent');
            yield (0, users_helper_1.deleteUser)(testUser);
        }));
        (0, mocha_1.it)('should make agents not-available when the user is deactivated', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, rooms_1.makeAgentAvailable)(agent.credentials);
            yield api_data_1.request
                .post((0, api_data_1.api)('users.setActiveStatus'))
                .set(api_data_1.credentials)
                .send({
                activeStatus: false,
                userId: agent.user._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            const agentInfo = yield (0, users_1.getAgent)(agent.user._id);
            (0, chai_1.expect)(agentInfo).to.have.property('statusLivechat', 'not-available');
        }));
        (0, mocha_1.it)('should not make agents available when the user is activated', () => __awaiter(void 0, void 0, void 0, function* () {
            let agentInfo = yield (0, users_1.getAgent)(agent.user._id);
            (0, chai_1.expect)(agentInfo).to.have.property('statusLivechat', 'not-available');
            yield api_data_1.request
                .post((0, api_data_1.api)('users.setActiveStatus'))
                .set(api_data_1.credentials)
                .send({
                activeStatus: true,
                userId: agent.user._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
            agentInfo = yield (0, users_1.getAgent)(agent.user._id);
            (0, chai_1.expect)(agentInfo).to.have.property('statusLivechat', 'not-available');
        }));
        (0, mocha_1.describe)('last owner cases', () => {
            let room;
            (0, mocha_1.beforeEach)(() => Promise.all([
                (0, permissions_helper_1.updatePermission)('edit-other-user-active-status', ['admin', 'user']),
                (0, permissions_helper_1.updatePermission)('manage-moderation-actions', ['admin', 'user']),
            ]));
            (0, mocha_1.afterEach)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: room._id }));
            (0, mocha_1.it)('should return an error when trying to set other user status to inactive and the user is the last owner of a room', () => __awaiter(void 0, void 0, void 0, function* () {
                room = (yield (0, rooms_helper_1.createRoom)({
                    type: 'c',
                    name: `channel.test.${Date.now()}-${Math.random()}`,
                    username: targetUser.username,
                    members: [targetUser.username],
                })).body.channel;
                yield inviteToChannel({ userId: targetUser._id, roomId: room._id });
                yield addRoomOwner({ type: 'c', userId: targetUser._id, roomId: room._id });
                yield removeRoomOwner({ type: 'c', userId: api_data_1.credentials['X-User-Id'], roomId: room._id });
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.setActiveStatus'))
                    .set(userCredentials)
                    .send({
                    activeStatus: false,
                    userId: targetUser._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', '[user-last-owner]');
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'user-last-owner');
                });
            }));
            (0, mocha_1.it)('should set other user status to inactive if the user is the last owner of a room and `confirmRelinquish` is set to `true`', () => __awaiter(void 0, void 0, void 0, function* () {
                room = (yield (0, rooms_helper_1.createRoom)({
                    type: 'c',
                    name: `channel.test.${Date.now()}-${Math.random()}`,
                    username: targetUser.username,
                    members: [targetUser.username],
                })).body.channel;
                yield inviteToChannel({ userId: targetUser._id, roomId: room._id });
                yield addRoomOwner({ type: 'c', userId: targetUser._id, roomId: room._id });
                yield removeRoomOwner({ type: 'c', userId: api_data_1.credentials['X-User-Id'], roomId: room._id });
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.setActiveStatus'))
                    .set(userCredentials)
                    .send({
                    activeStatus: false,
                    userId: targetUser._id,
                    confirmRelinquish: true,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
            }));
            (0, mocha_1.it)('should set other user as room owner if the last owner of a room is deactivated and `confirmRelinquish` is set to `true`', () => __awaiter(void 0, void 0, void 0, function* () {
                room = (yield (0, rooms_helper_1.createRoom)({
                    type: 'c',
                    name: `channel.test.${Date.now()}-${Math.random()}`,
                    members: [targetUser.username],
                })).body.channel;
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.setActiveStatus'))
                    .set(userCredentials)
                    .send({
                    activeStatus: true,
                    userId: targetUser._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
                yield inviteToChannel({ userId: targetUser._id, roomId: room._id });
                yield addRoomOwner({ type: 'c', userId: targetUser._id, roomId: room._id });
                yield removeRoomOwner({ type: 'c', userId: api_data_1.credentials['X-User-Id'], roomId: room._id });
                yield api_data_1.request
                    .post((0, api_data_1.api)('users.setActiveStatus'))
                    .set(userCredentials)
                    .send({
                    activeStatus: false,
                    userId: targetUser._id,
                    confirmRelinquish: true,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
                const roles = yield getChannelRoles({ roomId: room._id });
                (0, chai_1.expect)(roles).to.have.lengthOf(2);
                const originalCreator = roles.find((role) => role.u._id === api_data_1.credentials['X-User-Id']);
                chai_1.assert.isDefined(originalCreator);
                (0, chai_1.expect)(originalCreator.roles).to.eql(['owner']);
                (0, chai_1.expect)(originalCreator.u).to.have.property('_id', api_data_1.credentials['X-User-Id']);
            }));
        });
    });
    (0, mocha_1.describe)('[/users.deactivateIdle]', () => {
        let testUser;
        const testRoleId = 'guest';
        (0, mocha_1.before)('Create test user', () => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)();
            yield api_data_1.request
                .post((0, api_data_1.api)('roles.addUserToRole'))
                .set(api_data_1.credentials)
                .send({
                roleId: testRoleId,
                username: testUser.username,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.after)(() => Promise.all([(0, users_helper_1.deleteUser)(testUser), (0, permissions_helper_1.updatePermission)('edit-other-user-active-status', ['admin'])]));
        (0, mocha_1.it)('should fail to deactivate if user doesnt have edit-other-user-active-status permission', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-active-status', []).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.deactivateIdle'))
                    .set(api_data_1.credentials)
                    .send({
                    daysIdle: 0,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(403)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should deactivate no users when no users in time range', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-active-status', ['admin']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.deactivateIdle'))
                    .set(api_data_1.credentials)
                    .send({
                    daysIdle: 999999,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('count', 0);
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should deactivate the test user when given its role and daysIdle = 0', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-active-status', ['admin']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.deactivateIdle'))
                    .set(api_data_1.credentials)
                    .send({
                    daysIdle: 0,
                    role: testRoleId,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('count', 1);
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should not deactivate the test user again when given its role and daysIdle = 0', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-active-status', ['admin']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.deactivateIdle'))
                    .set(api_data_1.credentials)
                    .send({
                    daysIdle: 0,
                    role: testRoleId,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('count', 0);
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/users.requestDataDownload]', () => {
        (0, mocha_1.it)('should return the request data with fullExport false when no query parameter was send', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.requestDataDownload'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('requested');
                (0, chai_1.expect)(res.body).to.have.property('exportOperation').and.to.be.an('object');
                (0, chai_1.expect)(res.body.exportOperation).to.have.property('fullExport', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the request data with fullExport false when the fullExport query parameter is false', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.requestDataDownload'))
                .query({ fullExport: 'false' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('requested');
                (0, chai_1.expect)(res.body).to.have.property('exportOperation').and.to.be.an('object');
                (0, chai_1.expect)(res.body.exportOperation).to.have.property('fullExport', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return the request data with fullExport true when the fullExport query parameter is true', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.requestDataDownload'))
                .query({ fullExport: 'true' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('requested');
                (0, chai_1.expect)(res.body).to.have.property('exportOperation').and.to.be.an('object');
                (0, chai_1.expect)(res.body.exportOperation).to.have.property('fullExport', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/users.logoutOtherClients]', function () {
        let user;
        let userCredentials;
        let newCredentials;
        this.timeout(20000);
        (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)({ joinDefaultChannels: false });
            userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            newCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
        }));
        (0, mocha_1.after)(() => (0, users_helper_1.deleteUser)(user));
        (0, mocha_1.it)('should invalidate all active sesions', (done) => {
            /* We want to validate that the login with the "old" credentials fails
                However, the removal of the tokens is done asynchronously.
                Thus, we check that within the next seconds, at least one try to
                access an authentication requiring route fails */
            let counter = 0;
            function checkAuthenticationFails() {
                return __awaiter(this, void 0, void 0, function* () {
                    const result = yield api_data_1.request.get((0, api_data_1.api)('me')).set(userCredentials);
                    return result.statusCode === 401;
                });
            }
            function tryAuthentication() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (yield checkAuthenticationFails()) {
                        done();
                    }
                    else if (++counter < 20) {
                        setTimeout(tryAuthentication, 1000);
                    }
                    else {
                        done('Session did not invalidate in time');
                    }
                });
            }
            void api_data_1.request
                .post((0, api_data_1.api)('users.logoutOtherClients'))
                .set(newCredentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('token').and.to.be.a('string');
                (0, chai_1.expect)(res.body).to.have.property('tokenExpires').and.to.be.a('string');
            })
                .then(tryAuthentication);
        });
    });
    (0, mocha_1.describe)('[/users.autocomplete]', () => {
        (0, mocha_1.after)(() => (0, permissions_helper_1.updatePermission)('view-outside-room', ['admin', 'owner', 'moderator', 'user']));
        (0, mocha_1.describe)('[without permission]', function () {
            let user;
            let userCredentials;
            let user2;
            let user2Credentials;
            let roomId;
            this.timeout(20000);
            (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
                user = yield (0, users_helper_1.createUser)({ joinDefaultChannels: false });
                user2 = yield (0, users_helper_1.createUser)({ joinDefaultChannels: false });
                userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
                user2Credentials = yield (0, users_helper_1.login)(user2.username, user_1.password);
                yield (0, permissions_helper_1.updatePermission)('view-outside-room', []);
                roomId = (yield (0, rooms_helper_1.createRoom)({ type: 'c', credentials: userCredentials, name: `channel.autocomplete.${Date.now()}` })).body.channel
                    ._id;
            }));
            (0, mocha_1.after)(() => __awaiter(this, void 0, void 0, function* () {
                yield (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId });
                yield Promise.all([(0, users_helper_1.deleteUser)(user), (0, users_helper_1.deleteUser)(user2)]);
            }));
            (0, mocha_1.it)('should return an empty list when the user does not have any subscription', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('users.autocomplete'))
                    .query({ selector: '{}' })
                    .set(userCredentials)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('items').and.to.be.an('array').that.has.lengthOf(0);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should return users that are subscribed to the same rooms as the requester', () => __awaiter(this, void 0, void 0, function* () {
                yield joinChannel({ overrideCredentials: user2Credentials, roomId });
                void api_data_1.request
                    .get((0, api_data_1.api)('users.autocomplete'))
                    .query({ selector: '{}' })
                    .set(userCredentials)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('items').and.to.be.an('array').with.lengthOf(1);
                });
            }));
        });
        (0, mocha_1.describe)('[with permission]', () => {
            (0, mocha_1.before)(() => (0, permissions_helper_1.updatePermission)('view-outside-room', ['admin', 'user']));
            (0, mocha_1.it)('should return an error when the required parameter "selector" is not provided', () => {
                void api_data_1.request
                    .get((0, api_data_1.api)('users.autocomplete'))
                    .query({})
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                });
            });
            (0, mocha_1.it)('should return the users to fill auto complete', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('users.autocomplete'))
                    .query({ selector: '{}' })
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('items').and.to.be.an('array');
                })
                    .end(done);
            });
            (0, mocha_1.it)('should filter results when using allowed operators', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('users.autocomplete'))
                    .set(api_data_1.credentials)
                    .query({
                    selector: JSON.stringify({
                        conditions: {
                            $and: [
                                {
                                    active: false,
                                },
                                {
                                    status: 'online',
                                },
                            ],
                        },
                    }),
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('items').and.to.be.an('array').with.lengthOf(0);
                })
                    .end(done);
            });
            (0, mocha_1.it)('should return an error when using forbidden operators', (done) => {
                void api_data_1.request
                    .get((0, api_data_1.api)('users.autocomplete'))
                    .set(api_data_1.credentials)
                    .query({
                    selector: JSON.stringify({
                        conditions: {
                            $nor: [
                                {
                                    username: {
                                        $exists: false,
                                    },
                                },
                                {
                                    status: {
                                        $exists: false,
                                    },
                                },
                            ],
                        },
                    }),
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/users.getStatus]', () => {
        (0, mocha_1.it)('should return my own status', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.getStatus'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('status');
                (0, chai_1.expect)(res.body._id).to.be.equal(api_data_1.credentials['X-User-Id']);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return other user status', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.getStatus'))
                .query({ userId: 'rocket.cat' })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('status');
                (0, chai_1.expect)(res.body._id).to.be.equal('rocket.cat');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/users.setStatus]', () => {
        let user;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
        }));
        (0, mocha_1.after)(() => Promise.all([(0, users_helper_1.deleteUser)(user), (0, permissions_helper_1.updateSetting)('Accounts_AllowUserStatusMessageChange', true)]));
        (0, mocha_1.it)('should return an error when the setting "Accounts_AllowUserStatusMessageChange" is disabled', (done) => {
            void (0, permissions_helper_1.updateSetting)('Accounts_AllowUserStatusMessageChange', false).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.setStatus'))
                    .set(api_data_1.credentials)
                    .send({
                    status: 'busy',
                    message: '',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.errorType).to.be.equal('error-not-allowed');
                    (0, chai_1.expect)(res.body.error).to.be.equal('Change status is not allowed [error-not-allowed]');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should update my own status', (done) => {
            void (0, permissions_helper_1.updateSetting)('Accounts_AllowUserStatusMessageChange', true).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.setStatus'))
                    .set(api_data_1.credentials)
                    .send({
                    status: 'busy',
                    message: 'test',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    void getUserStatus(api_data_1.credentials['X-User-Id']).then((status) => (0, chai_1.expect)(status.status).to.be.equal('busy'));
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when trying to update other user status without the required permission', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-info', []).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.setStatus'))
                    .set(api_data_1.credentials)
                    .send({
                    status: 'busy',
                    message: 'test',
                    userId: user._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(403)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body.error).to.be.equal('unauthorized');
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should update another user status succesfully', (done) => {
            void (0, permissions_helper_1.updatePermission)('edit-other-user-info', ['admin']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.setStatus'))
                    .set(api_data_1.credentials)
                    .send({
                    status: 'busy',
                    message: 'test',
                    userId: user._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    void getUserStatus(api_data_1.credentials['X-User-Id']).then((status) => {
                        (0, chai_1.expect)(status.status).to.be.equal('busy');
                        (0, chai_1.expect)(status.message).to.be.equal('test');
                    });
                })
                    .end(done);
            });
        });
        (0, mocha_1.it)('should return an error when the user try to update user status with an invalid status', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.setStatus'))
                .set(api_data_1.credentials)
                .send({
                status: 'invalid',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('error-invalid-status');
                (0, chai_1.expect)(res.body.error).to.be.equal('Valid status types include online, away, offline, and busy. [error-invalid-status]');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when user changes status to offline and "Accounts_AllowInvisibleStatusOption" is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('Accounts_AllowInvisibleStatusOption', false);
            yield api_data_1.request
                .post((0, api_data_1.api)('users.setStatus'))
                .set(api_data_1.credentials)
                .send({
                status: 'offline',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('error-status-not-allowed');
                (0, chai_1.expect)(res.body.error).to.be.equal('Invisible status is disabled [error-status-not-allowed]');
            });
            yield (0, permissions_helper_1.updateSetting)('Accounts_AllowInvisibleStatusOption', true);
        }));
        (0, mocha_1.it)('should return an error when the payload is missing all supported fields', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('users.setStatus'))
                .set(api_data_1.credentials)
                .send({})
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('Match error: Failed Match.OneOf, Match.Maybe or Match.Optional validation');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/users.removeOtherTokens]', () => {
        let user;
        let userCredentials;
        let newCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
            userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            newCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
        }));
        (0, mocha_1.after)(() => (0, users_helper_1.deleteUser)(user));
        (0, mocha_1.it)('should invalidate all active sesions', (done) => {
            /* We want to validate that the login with the "old" credentials fails
                However, the removal of the tokens is done asynchronously.
                Thus, we check that within the next seconds, at least one try to
                access an authentication requiring route fails */
            let counter = 0;
            function checkAuthenticationFails() {
                return __awaiter(this, void 0, void 0, function* () {
                    const result = yield api_data_1.request.get((0, api_data_1.api)('me')).set(userCredentials);
                    return result.statusCode === 401;
                });
            }
            function tryAuthentication() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (yield checkAuthenticationFails()) {
                        done();
                    }
                    else if (++counter < 20) {
                        setTimeout(tryAuthentication, 1000);
                    }
                    else {
                        done('Session did not invalidate in time');
                    }
                });
            }
            void api_data_1.request.post((0, api_data_1.api)('users.removeOtherTokens')).set(newCredentials).expect(200).then(tryAuthentication);
        });
    });
    (0, mocha_1.describe)('[/users.listTeams]', () => {
        const teamName1 = `team-name-${Date.now()}`;
        const teamName2 = `team-name-2-${Date.now()}`;
        let testUser;
        (0, mocha_1.before)('create team 1', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name: teamName1,
                type: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('team');
                (0, chai_1.expect)(res.body).to.have.nested.property('team._id');
            })
                .end(done);
        });
        (0, mocha_1.before)('create team 2', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name: teamName2,
                type: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('team');
                (0, chai_1.expect)(res.body).to.have.nested.property('team._id');
            })
                .end(done);
        });
        (0, mocha_1.before)('create new user', () => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)({ joinDefaultChannels: false });
        }));
        (0, mocha_1.before)('add test user to team 1', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.addMembers'))
                .set(api_data_1.credentials)
                .send({
                teamName: teamName1,
                members: [
                    {
                        userId: testUser._id,
                        roles: ['member'],
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .then(() => done());
        });
        (0, mocha_1.before)('add test user to team 2', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.addMembers'))
                .set(api_data_1.credentials)
                .send({
                teamName: teamName2,
                members: [
                    {
                        userId: testUser._id,
                        roles: ['member', 'owner'],
                    },
                ],
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .then(() => done());
        });
        (0, mocha_1.after)(() => Promise.all([...[teamName1, teamName2].map((team) => (0, teams_helper_1.deleteTeam)(api_data_1.credentials, team)), (0, users_helper_1.deleteUser)(testUser)]));
        (0, mocha_1.it)('should list both channels', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('users.listTeams'))
                .set(api_data_1.credentials)
                .query({
                userId: testUser._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('teams');
                const { teams } = res.body;
                (0, chai_1.expect)(teams).to.have.length(2);
                (0, chai_1.expect)(teams[0].isOwner).to.not.be.eql(teams[1].isOwner);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/users.logout]', () => {
        let user;
        let otherUser;
        let userCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
            otherUser = yield (0, users_helper_1.createUser)();
            userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
        }));
        (0, mocha_1.after)(() => Promise.all([(0, users_helper_1.deleteUser)(user), (0, users_helper_1.deleteUser)(otherUser), (0, permissions_helper_1.updatePermission)('logout-other-user', ['admin'])]));
        (0, mocha_1.it)('should throw unauthorized error to user w/o "logout-other-user" permission', (done) => {
            void (0, permissions_helper_1.updatePermission)('logout-other-user', []).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.logout'))
                    .set(api_data_1.credentials)
                    .send({ userId: otherUser._id })
                    .expect('Content-Type', 'application/json')
                    .expect(403)
                    .end(done);
            });
        });
        (0, mocha_1.it)('should logout other user', (done) => {
            void (0, permissions_helper_1.updatePermission)('logout-other-user', ['admin']).then(() => {
                void api_data_1.request
                    .post((0, api_data_1.api)('users.logout'))
                    .set(api_data_1.credentials)
                    .send({ userId: otherUser._id })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .end(done);
            });
        });
        (0, mocha_1.it)('should logout the requester', (done) => {
            void (0, permissions_helper_1.updatePermission)('logout-other-user', []).then(() => {
                void api_data_1.request.post((0, api_data_1.api)('users.logout')).set(userCredentials).expect('Content-Type', 'application/json').expect(200).end(done);
            });
        });
    });
    (0, mocha_1.describe)('[/users.listByStatus]', () => {
        let user;
        let otherUser;
        let otherUserCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
            otherUser = yield (0, users_helper_1.createUser)();
            otherUserCredentials = yield (0, users_helper_1.login)(otherUser.username, user_1.password);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(user);
            yield (0, users_helper_1.deleteUser)(otherUser);
            yield (0, permissions_helper_1.updatePermission)('view-outside-room', ['admin', 'owner', 'moderator', 'user']);
            yield (0, permissions_helper_1.updatePermission)('view-d-room', ['admin', 'owner', 'moderator', 'user']);
        }));
        (0, mocha_1.it)('should list pending users', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('users.listByStatus'))
                .set(api_data_1.credentials)
                .query({ hasLoggedIn: false, type: 'user', count: 50 })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('users');
                const { users } = res.body;
                const ids = users.map((user) => user._id);
                (0, chai_1.expect)(ids).to.include(user._id);
            });
        }));
        (0, mocha_1.it)('should list all users', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('users.listByStatus'))
                .query({ searchTerm: user.name })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('users');
                const { users } = res.body;
                const ids = users.map((user) => user._id);
                (0, chai_1.expect)(ids).to.include(user._id);
            });
        }));
        (0, mocha_1.it)('should list active users', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.login)(user.username, user_1.password);
            yield api_data_1.request
                .get((0, api_data_1.api)('users.listByStatus'))
                .set(api_data_1.credentials)
                .query({ hasLoggedIn: true, status: 'active', searchTerm: user.name })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('users');
                const { users } = res.body;
                const ids = users.map((user) => user._id);
                (0, chai_1.expect)(ids).to.include(user._id);
            });
        }));
        (0, mocha_1.it)('should filter users by role', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.login)(user.username, user_1.password);
            yield api_data_1.request
                .get((0, api_data_1.api)('users.listByStatus'))
                .set(api_data_1.credentials)
                .query({ 'roles[]': 'admin' })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('users');
                const { users } = res.body;
                const ids = users.map((user) => user._id);
                (0, chai_1.expect)(ids).to.not.include(user._id);
            });
        }));
        (0, mocha_1.it)('should list deactivated users', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('users.setActiveStatus')).set(api_data_1.credentials).send({
                userId: user._id,
                activeStatus: false,
                confirmRelinquish: false,
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('users.listByStatus'))
                .set(api_data_1.credentials)
                .query({ hasLoggedIn: true, status: 'deactivated' })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('users');
                const { users } = res.body;
                const ids = users.map((user) => user._id);
                (0, chai_1.expect)(ids).to.include(user._id);
            });
        }));
        (0, mocha_1.it)('should filter users by username', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('users.listByStatus'))
                .set(api_data_1.credentials)
                .query({ searchTerm: user.username })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('users');
                const { users } = res.body;
                const ids = users.map((user) => user._id);
                (0, chai_1.expect)(ids).to.include(user._id);
            });
        }));
        (0, mocha_1.it)('should return error for invalid status params', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('users.listByStatus'))
                .set(api_data_1.credentials)
                .query({ status: 'abcd' })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
                (0, chai_1.expect)(res.body.error).to.be.equal('must be equal to one of the allowed values [invalid-params]');
            });
        }));
        (0, mocha_1.it)('should throw unauthorized error to user without "view-d-room" permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-d-room', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('users.listByStatus'))
                .set(otherUserCredentials)
                .query({ status: 'active' })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
        (0, mocha_1.it)('should throw unauthorized error to user without "view-outside-room" permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('view-outside-room', ['admin']);
            yield api_data_1.request
                .get((0, api_data_1.api)('users.listByStatus'))
                .set(otherUserCredentials)
                .query({ status: 'active' })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
    (0, mocha_1.describe)('[/users.sendWelcomeEmail]', () => __awaiter(void 0, void 0, void 0, function* () {
        let user;
        let otherUser;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
            otherUser = yield (0, users_helper_1.createUser)();
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(user);
            yield (0, users_helper_1.deleteUser)(otherUser);
        }));
        (0, mocha_1.it)('should send Welcome Email to user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('SMTP_Host', 'localhost');
            yield api_data_1.request
                .post((0, api_data_1.api)('users.sendWelcomeEmail'))
                .set(api_data_1.credentials)
                .send({ email: user.emails[0].address })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
        }));
        (0, mocha_1.it)('should fail to send Welcome Email due to SMTP settings missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('SMTP_Host', '');
            yield api_data_1.request
                .post((0, api_data_1.api)('users.sendWelcomeEmail'))
                .set(api_data_1.credentials)
                .send({ email: user.emails[0].address })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body.error).to.be.equal('SMTP is not configured [error-email-send-failed]');
            });
        }));
        (0, mocha_1.it)('should fail to send Welcome Email due to missing param', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('SMTP_Host', '');
            yield api_data_1.request
                .post((0, api_data_1.api)('users.sendWelcomeEmail'))
                .set(api_data_1.credentials)
                .send({})
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'invalid-params');
                (0, chai_1.expect)(res.body).to.have.property('error', "must have required property 'email' [invalid-params]");
            });
        }));
        (0, mocha_1.it)('should fail to send Welcome Email due missing user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('SMTP_Host', 'localhost');
            yield api_data_1.request
                .post((0, api_data_1.api)('users.sendWelcomeEmail'))
                .set(api_data_1.credentials)
                .send({ email: 'fake_user32132131231@rocket.chat' })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-user');
                (0, chai_1.expect)(res.body).to.have.property('error', 'Invalid user [error-invalid-user]');
            });
        }));
    }));
});
