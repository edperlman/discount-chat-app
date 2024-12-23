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
const core_typings_1 = require("@rocket.chat/core-typings");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const api_data_1 = require("../../data/api-data");
const permissions_helper_1 = require("../../data/permissions.helper");
const rooms_helper_1 = require("../../data/rooms.helper");
const teams_helper_1 = require("../../data/teams.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
const constants_1 = require("../../e2e/config/constants");
(0, mocha_1.describe)('miscellaneous', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.describe)('API default', () => {
        // Required by mobile apps
        (0, mocha_1.describe)('/info', () => {
            let version;
            (0, mocha_1.it)('should return "version", "build", "commit" and "marketplaceApiVersion" when the user is logged in', (done) => {
                void api_data_1.request
                    .get('/api/info')
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('version').and.to.be.a('string');
                    (0, chai_1.expect)(res.body.info).to.have.property('version').and.to.be.a('string');
                    (0, chai_1.expect)(res.body.info).to.have.property('build').and.to.be.an('object');
                    (0, chai_1.expect)(res.body.info).to.have.property('commit').and.to.be.an('object');
                    (0, chai_1.expect)(res.body.info).to.have.property('marketplaceApiVersion').and.to.be.a('string');
                    version = res.body.info.version;
                })
                    .end(done);
            });
            (0, mocha_1.it)('should return only "version" and the version should not have patch info when the user is not logged in', (done) => {
                void api_data_1.request
                    .get('/api/info')
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('version');
                    (0, chai_1.expect)(res.body).to.not.have.property('info');
                    (0, chai_1.expect)(res.body.version).to.be.equal(version.replace(/(\d+\.\d+).*/, '$1'));
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.it)('/login', () => {
        (0, chai_1.expect)(api_data_1.credentials).to.have.property('X-Auth-Token').with.lengthOf.at.least(1);
        (0, chai_1.expect)(api_data_1.credentials).to.have.property('X-User-Id').with.lengthOf.at.least(1);
    });
    (0, mocha_1.it)('/login (wrapper username)', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('login'))
            .send({
            user: {
                username: user_1.adminUsername,
            },
            password: user_1.adminPassword,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('status', 'success');
            (0, chai_1.expect)(res.body).to.have.property('data').and.to.be.an('object');
            (0, chai_1.expect)(res.body.data).to.have.property('userId');
            (0, chai_1.expect)(res.body.data).to.have.property('authToken');
            (0, chai_1.expect)(res.body.data).to.have.property('me');
        })
            .end(done);
    });
    (0, mocha_1.it)('/login (wrapper email)', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('login'))
            .send({
            user: {
                email: user_1.adminEmail,
            },
            password: user_1.adminPassword,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('status', 'success');
            (0, chai_1.expect)(res.body).to.have.property('data').and.to.be.an('object');
            (0, chai_1.expect)(res.body.data).to.have.property('userId');
            (0, chai_1.expect)(res.body.data).to.have.property('authToken');
            (0, chai_1.expect)(res.body.data).to.have.property('me');
        })
            .end(done);
    });
    (0, mocha_1.it)('/login by user', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('login'))
            .send({
            user: user_1.adminEmail,
            password: user_1.adminPassword,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('status', 'success');
            (0, chai_1.expect)(res.body).to.have.property('data').and.to.be.an('object');
            (0, chai_1.expect)(res.body.data).to.have.property('userId');
            (0, chai_1.expect)(res.body.data).to.have.property('authToken');
            (0, chai_1.expect)(res.body.data).to.have.property('me');
        })
            .end(done);
    });
    (0, mocha_1.it)('/login by username', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('login'))
            .send({
            username: user_1.adminUsername,
            password: user_1.adminPassword,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('status', 'success');
            (0, chai_1.expect)(res.body).to.have.property('data').and.to.be.an('object');
            (0, chai_1.expect)(res.body.data).to.have.property('userId');
            (0, chai_1.expect)(res.body.data).to.have.property('authToken');
            (0, chai_1.expect)(res.body.data).to.have.property('me');
        })
            .end(done);
    });
    (0, mocha_1.it)('/me', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, users_helper_1.createUser)();
        const userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
        yield api_data_1.request
            .get((0, api_data_1.api)('me'))
            .set(userCredentials)
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            const allUserPreferencesKeys = [
                'alsoSendThreadToChannel',
                // 'language',
                'newRoomNotification',
                'newMessageNotification',
                'showThreadsInMainChannel',
                // 'clockMode',
                'useEmojis',
                'convertAsciiEmoji',
                'saveMobileBandwidth',
                'collapseMediaByDefault',
                'autoImageLoad',
                'emailNotificationMode',
                'unreadAlert',
                'masterVolume',
                'notificationsSoundVolume',
                'voipRingerVolume',
                'omnichannelTranscriptEmail',
                constants_1.IS_EE ? 'omnichannelTranscriptPDF' : false,
                'desktopNotifications',
                'pushNotifications',
                'enableAutoAway',
                // 'highlights',
                'desktopNotificationRequireInteraction',
                'hideUsernames',
                'hideRoles',
                'displayAvatars',
                'hideFlexTab',
                'sendOnEnter',
                'idleTimeLimit',
                'sidebarShowFavorites',
                'sidebarShowUnread',
                'themeAppearence',
                'sidebarSortby',
                'sidebarViewMode',
                'sidebarDisplayAvatar',
                'sidebarGroupByType',
                'sidebarSectionsOrder',
                'muteFocusedConversations',
                'notifyCalendarEvents',
                'enableMobileRinging',
                'featuresPreview',
            ].filter((p) => Boolean(p));
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('_id', user._id);
            (0, chai_1.expect)(res.body).to.have.property('username', user.username);
            (0, chai_1.expect)(res.body).to.have.property('active');
            (0, chai_1.expect)(res.body).to.have.property('name');
            (0, chai_1.expect)(res.body).to.have.property('roles').and.to.be.an('array');
            (0, chai_1.expect)(res.body).to.have.nested.property('emails[0].address', user.emails[0].address);
            (0, chai_1.expect)(res.body).to.have.nested.property('settings.preferences').and.to.be.an('object');
            (0, chai_1.expect)(res.body.settings.preferences).to.have.all.keys(allUserPreferencesKeys);
            (0, chai_1.expect)(res.body.services).to.not.have.nested.property('password.bcrypt');
        });
        yield (0, users_helper_1.deleteUser)(user);
    }));
    (0, mocha_1.describe)('/directory', () => {
        let user;
        let testChannel;
        let normalUserCredentials;
        const teamName = `new-team-name-${Date.now()}`;
        let teamCreated;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('create-team', ['admin', 'user']);
            user = yield (0, users_helper_1.createUser)();
            normalUserCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            testChannel = (yield (0, rooms_helper_1.createRoom)({ name: `channel.test.${Date.now()}`, type: 'c' })).body.channel;
            teamCreated = yield (0, teams_helper_1.createTeam)(normalUserCredentials, teamName, core_typings_1.TEAM_TYPE.PUBLIC);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                (0, teams_helper_1.deleteTeam)(normalUserCredentials, teamName),
                (0, users_helper_1.deleteUser)(user),
                (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: testChannel._id }),
                (0, permissions_helper_1.updatePermission)('create-team', ['admin', 'user']),
            ]);
        }));
        (0, mocha_1.it)('should return an array(result) when search by user and execute successfully', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('directory'))
                .set(api_data_1.credentials)
                .query({
                text: user.username,
                type: 'users',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('result').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('_id');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('createdAt');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('username');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('emails').and.to.be.an('array');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('name');
            })
                .end(done);
        });
        (0, mocha_1.it)('should not return the emails field for non admins', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('directory'))
                .set(normalUserCredentials)
                .query({
                text: user.username,
                type: 'users',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('result').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('_id');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('createdAt');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('username');
                (0, chai_1.expect)(res.body.result[0]).to.not.have.property('emails');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('name');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an array(result) when search by channel and execute successfully', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('directory'))
                .set(api_data_1.credentials)
                .query({
                text: testChannel.name,
                type: 'channels',
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('result').and.to.be.an('array');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('_id');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('name');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('usersCount').and.to.be.an('number');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('ts');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an array(result) when search by channel with sort params correctly and execute successfully', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('directory'))
                .set(api_data_1.credentials)
                .query({
                text: testChannel.name,
                type: 'channels',
                sort: JSON.stringify({
                    name: 1,
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('offset');
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body).to.have.property('count');
                (0, chai_1.expect)(res.body).to.have.property('result').and.to.be.an('array');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('_id');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('name');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('usersCount').and.to.be.an('number');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('ts');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when send invalid query', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('directory'))
                .set(api_data_1.credentials)
                .query({
                text: 'invalid channel',
                type: 'invalid',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an error when have more than one sort parameter', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('directory'))
                .set(api_data_1.credentials)
                .query({
                text: testChannel.name,
                type: 'channels',
                sort: JSON.stringify({
                    name: 1,
                    test: 1,
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
            })
                .end(done);
        });
        (0, mocha_1.it)('should return an object containing rooms and totalCount from teams', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('directory'))
                .set(normalUserCredentials)
                .query({
                text: '',
                type: 'teams',
                sort: JSON.stringify({
                    name: 1,
                }),
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('result');
                (0, chai_1.expect)(res.body.result).to.be.an(`array`);
                (0, chai_1.expect)(res.body).to.have.property('total');
                (0, chai_1.expect)(res.body.total).to.be.an('number');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('_id', teamCreated.roomId);
                (0, chai_1.expect)(res.body.result[0]).to.have.property('fname');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('teamMain');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('name');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('t');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('usersCount');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('ts');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('teamId');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('default');
                (0, chai_1.expect)(res.body.result[0]).to.have.property('roomsCount');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/spotlight]', () => {
        let user;
        let userCredentials;
        let testChannel;
        let testTeam;
        let testChannelSpecialChars;
        const fnameSpecialCharsRoom = `test ГДΕληνικά-${Date.now()}`;
        const teamName = `team-test-${Date.now()}`;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            user = yield (0, users_helper_1.createUser)();
            userCredentials = yield (0, users_helper_1.login)(user.username, user_1.password);
            yield (0, permissions_helper_1.updateSetting)('UI_Allow_room_names_with_special_chars', true);
            testChannelSpecialChars = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: fnameSpecialCharsRoom, credentials: userCredentials })).body.channel;
            testChannel = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `channel.test.${Date.now()}`, credentials: userCredentials })).body.channel;
            testTeam = yield (0, teams_helper_1.createTeam)(userCredentials, teamName, core_typings_1.TEAM_TYPE.PUBLIC);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                (0, users_helper_1.deleteUser)(user),
                (0, permissions_helper_1.updateSetting)('UI_Allow_room_names_with_special_chars', false),
                (0, teams_helper_1.deleteTeam)(userCredentials, teamName),
            ]);
        }));
        (0, mocha_1.it)('should fail when does not have query param', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('spotlight'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return object inside users array when search by a valid user', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('spotlight'))
                .query({
                query: `@${user_1.adminUsername}`,
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('users').and.to.be.an('array');
                (0, chai_1.expect)(res.body.users[0]).to.have.property('_id');
                (0, chai_1.expect)(res.body.users[0]).to.have.property('name');
                (0, chai_1.expect)(res.body.users[0]).to.have.property('username');
                (0, chai_1.expect)(res.body.users[0]).to.have.property('status');
                (0, chai_1.expect)(res.body).to.have.property('rooms').and.to.be.an('array');
            })
                .end(done);
        });
        (0, mocha_1.it)('must return the object inside the room array when searching for a valid room and that user is not a member of it', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('spotlight'))
                .query({
                query: `#${testChannel.name}`,
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('users').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('rooms').and.to.be.an('array');
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('_id');
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('name');
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('t');
            })
                .end(done);
        });
        (0, mocha_1.it)('must return the teamMain property when searching for a valid team that the user is not a member of', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('spotlight'))
                .query({
                query: `${testTeam.name}`,
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('users').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('rooms').and.to.be.an('array');
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('_id');
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('name');
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('t');
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('teamMain');
            })
                .end(done);
        });
        (0, mocha_1.it)('must return rooms when searching for a valid fname', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('spotlight'))
                .query({
                query: `#${fnameSpecialCharsRoom}`,
            })
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('users').and.to.be.an('array');
                (0, chai_1.expect)(res.body).to.have.property('rooms').and.to.be.an('array');
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('_id', testChannelSpecialChars._id);
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('name', testChannelSpecialChars.name);
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('t', testChannelSpecialChars.t);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/instances.get]', () => {
        let unauthorizedUserCredentials;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const createdUser = yield (0, users_helper_1.createUser)();
            unauthorizedUserCredentials = yield (0, users_helper_1.login)(createdUser.username, user_1.password);
        }));
        (0, mocha_1.it)('should fail if user is logged in but is unauthorized', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('instances.get'))
                .set(unauthorizedUserCredentials)
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            })
                .end(done);
        });
        (0, mocha_1.it)('should fail if not logged in', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('instances.get'))
                .expect('Content-Type', 'application/json')
                .expect(401)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('status', 'error');
                (0, chai_1.expect)(res.body).to.have.property('message');
            })
                .end(done);
        });
        (0, mocha_1.it)('should return instances if user is logged in and is authorized', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('instances.get'))
                .set(api_data_1.credentials)
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('instances').and.to.be.an('array').with.lengthOf(1);
                const instances = res.body.instances;
                const instanceName = constants_1.IS_EE ? 'ddp-streamer' : 'rocket.chat';
                const instance = instances.find((i) => { var _a; return ((_a = i.instanceRecord) === null || _a === void 0 ? void 0 : _a.name) === instanceName; });
                if (!instance)
                    throw new chai_1.AssertionError(`no instance named "${instanceName}"`);
                (0, chai_1.expect)(instance).to.have.property('instanceRecord');
                (0, chai_1.expect)(instance).to.have.property('currentStatus');
                (0, chai_1.expect)(instance.currentStatus).to.have.property('connected');
                (0, chai_1.expect)(instance.instanceRecord).to.have.property('_id');
                (0, chai_1.expect)(instance.instanceRecord).to.have.property('extraInformation');
                (0, chai_1.expect)(instance.instanceRecord).to.have.property('name');
                (0, chai_1.expect)(instance.instanceRecord).to.have.property('pid');
                if (!constants_1.IS_EE) {
                    (0, chai_1.expect)(instance).to.have.property('address');
                    (0, chai_1.expect)(instance.currentStatus).to.have.property('lastHeartbeatTime');
                    (0, chai_1.expect)(instance.currentStatus).to.have.property('local');
                    const { extraInformation } = instance.instanceRecord;
                    (0, chai_1.expect)(extraInformation).to.have.property('host');
                    (0, chai_1.expect)(extraInformation).to.have.property('port');
                    (0, chai_1.expect)(extraInformation).to.have.property('os').and.to.have.property('cpus').to.be.a('number');
                    (0, chai_1.expect)(extraInformation).to.have.property('nodeVersion');
                }
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/shield.svg]', () => {
        (0, mocha_1.before)(() => (0, permissions_helper_1.updateSetting)('API_Enable_Shields', false));
        (0, mocha_1.after)(() => (0, permissions_helper_1.updateSetting)('API_Enable_Shields', true));
        (0, mocha_1.it)('should fail if API_Enable_Shields is disabled', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('shield.svg'))
                .query({
                type: 'online',
                icon: true,
                channel: 'general',
                name: 'Rocket.Chat',
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-endpoint-disabled');
            })
                .end(done);
        });
        (0, mocha_1.it)('should succeed if API_Enable_Shields is enabled', (done) => {
            void (0, permissions_helper_1.updateSetting)('API_Enable_Shields', true).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('shield.svg'))
                    .query({
                    type: 'online',
                    icon: true,
                    channel: 'general',
                    name: 'Rocket.Chat',
                })
                    .expect('Content-Type', 'image/svg+xml;charset=utf-8')
                    .expect(200)
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('/pw.getPolicy', () => {
        (0, mocha_1.it)('should return policies', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('pw.getPolicy'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('enabled');
                (0, chai_1.expect)(res.body).to.have.property('policy').and.to.be.an('array');
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('[/stdout.queue]', () => {
        let testUser;
        let testUsername;
        let testUserPassword;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)();
            testUsername = testUser.username;
            testUserPassword = user_1.password;
            yield (0, permissions_helper_1.updateSetting)('Log_Trace_Methods', true);
            yield (0, permissions_helper_1.updateSetting)('Log_Level', '2');
            // populate the logs by sending method calls
            const populateLogsPromises = [];
            populateLogsPromises.push(api_data_1.request
                .post((0, api_data_1.methodCall)('getRoomRoles'))
                .set(api_data_1.credentials)
                .set('Cookie', `rc_token=${api_data_1.credentials['X-Auth-Token']}`)
                .send({
                message: JSON.stringify({
                    method: 'getRoomRoles',
                    params: ['GENERAL'],
                    id: 'id',
                    msg: 'method',
                }),
            }));
            populateLogsPromises.push(api_data_1.request
                .post((0, api_data_1.methodCall)('private-settings:get'))
                .set(api_data_1.credentials)
                .send({
                message: JSON.stringify({
                    method: 'private-settings/get',
                    params: [
                        {
                            $date: new Date().getTime(),
                        },
                    ],
                    id: 'id',
                    msg: 'method',
                }),
            }));
            populateLogsPromises.push(api_data_1.request.post((0, api_data_1.api)('login')).send({
                user: {
                    username: testUsername,
                },
                password: testUserPassword,
            }));
            yield Promise.all(populateLogsPromises);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([(0, permissions_helper_1.updateSetting)('Log_Trace_Methods', false), (0, permissions_helper_1.updateSetting)('Log_Level', '0'), (0, users_helper_1.deleteUser)(testUser)]);
        }));
        (0, mocha_1.it)('if log trace enabled, x-auth-token should be redacted', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('stdout.queue'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('queue').that.is.an('array');
                const { queue } = res.body;
                let foundRedactedToken = false;
                for (const log of queue) {
                    if (log.string.includes("'x-auth-token': '[redacted]'")) {
                        foundRedactedToken = true;
                        break;
                    }
                }
                (0, chai_1.expect)(foundRedactedToken).to.be.true;
            });
        }));
        (0, mocha_1.it)('if log trace enabled, rc_token should be redacted', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('stdout.queue'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('queue').that.is.an('array');
                const { queue } = res.body;
                let foundRedactedCookie = false;
                for (const log of queue) {
                    if (log.string.includes('rc_token=[redacted]')) {
                        foundRedactedCookie = true;
                        break;
                    }
                }
                (0, chai_1.expect)(foundRedactedCookie).to.be.true;
            });
        }));
        (0, mocha_1.it)('should not return user token anywhere in the log stream', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('stdout.queue'))
                .set(api_data_1.credentials)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('queue').that.is.an('array');
                const { queue } = res.body;
                let foundTokenValue = false;
                for (const log of queue) {
                    if (log.string.includes(api_data_1.credentials['X-Auth-Token'])) {
                        foundTokenValue = true;
                        break;
                    }
                }
                (0, chai_1.expect)(foundTokenValue).to.be.false;
            });
        }));
        (0, mocha_1.describe)('permissions', () => {
            (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
                return (0, permissions_helper_1.updatePermission)('view-logs', ['admin']);
            }));
            (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
                return (0, permissions_helper_1.updatePermission)('view-logs', ['admin']);
            }));
            (0, mocha_1.it)('should return server logs', () => __awaiter(void 0, void 0, void 0, function* () {
                return api_data_1.request
                    .get((0, api_data_1.api)('stdout.queue'))
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('queue').and.to.be.an('array').that.is.not.empty;
                    (0, chai_1.expect)(res.body.queue[0]).to.be.an('object');
                    (0, chai_1.expect)(res.body.queue[0]).to.have.property('id').and.to.be.a('string');
                    (0, chai_1.expect)(res.body.queue[0]).to.have.property('string').and.to.be.a('string');
                    (0, chai_1.expect)(res.body.queue[0]).to.have.property('ts').and.to.be.a('string');
                });
            }));
            (0, mocha_1.it)('should not return server logs if user does NOT have the view-logs permission', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, permissions_helper_1.updatePermission)('view-logs', []);
                return api_data_1.request
                    .get((0, api_data_1.api)('stdout.queue'))
                    .set(api_data_1.credentials)
                    .expect('Content-Type', 'application/json')
                    .expect(403)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
                });
            }));
        });
    });
});
