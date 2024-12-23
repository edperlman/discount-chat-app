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
const addMembers = (credentials, teamName, members) => __awaiter(void 0, void 0, void 0, function* () {
    yield api_data_1.request
        .post((0, api_data_1.api)('teams.addMembers'))
        .set(credentials)
        .send({
        teamName,
        members: members.map((userId) => ({ userId, roles: ['member'] })),
    });
});
(0, mocha_1.describe)('[Teams]', () => {
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    (0, mocha_1.describe)('/teams.create', () => {
        const name = `test-team-create-${Date.now()}`;
        const createdTeams = [];
        let testUser;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)();
            yield (0, permissions_helper_1.updateSetting)('UTF8_Channel_Names_Validation', '[0-9a-zA-Z-_.]+');
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                ...createdTeams.map((team) => (0, teams_helper_1.deleteTeam)(api_data_1.credentials, team.name)),
                (0, users_helper_1.deleteUser)(testUser),
                (0, permissions_helper_1.updateSetting)('UTF8_Channel_Names_Validation', '[0-9a-zA-Z-_.]+'),
            ]);
        }));
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('create-team', ['admin', 'user']);
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            return (0, permissions_helper_1.updatePermission)('create-team', ['admin', 'user']);
        }));
        (0, mocha_1.it)('should create a public team', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name,
                type: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('team');
                (0, chai_1.expect)(res.body).to.have.nested.property('team._id');
                createdTeams.push(res.body.team);
            })
                .end(done);
        });
        (0, mocha_1.it)('should create a public team with a member', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name: `test-team-${Date.now()}`,
                type: 0,
                members: [testUser.username],
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('team');
                (0, chai_1.expect)(res.body).to.have.nested.property('team._id');
                createdTeams.push(res.body.team);
            })
                .then((response) => {
                const teamId = response.body.team._id;
                return api_data_1.request
                    .get((0, api_data_1.api)('teams.members'))
                    .set(api_data_1.credentials)
                    .query({ teamId })
                    .expect(200)
                    .expect((response) => {
                    (0, chai_1.expect)(response.body).to.have.property('success', true);
                    (0, chai_1.expect)(response.body).to.have.property('members');
                    // remove admin user from members because it's added automatically as owner
                    const members = response.body.members.filter(({ user }) => user.username !== user_1.adminUsername);
                    const [member] = members;
                    (0, chai_1.expect)(member.user.username).to.be.equal(testUser.username);
                });
            })
                .then(() => done())
                .catch(done);
        });
        (0, mocha_1.it)('should create private team with a defined owner', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name: `test-team-private-owner-${Date.now()}`,
                type: 1,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('team');
                (0, chai_1.expect)(res.body).to.have.nested.property('team._id');
                createdTeams.push(res.body.team);
            })
                .then((response) => {
                const teamId = response.body.team._id;
                return api_data_1.request
                    .get((0, api_data_1.api)('teams.members'))
                    .set(api_data_1.credentials)
                    .query({ teamId })
                    .expect(200)
                    .expect((response) => {
                    (0, chai_1.expect)(response.body).to.have.property('success', true);
                    (0, chai_1.expect)(response.body).to.have.property('members');
                    const member = response.body.members[0];
                    (0, chai_1.expect)(member).to.have.property('user');
                    (0, chai_1.expect)(member).to.have.property('roles');
                    (0, chai_1.expect)(member).to.have.property('createdBy');
                    (0, chai_1.expect)(member).to.have.property('createdAt');
                    (0, chai_1.expect)(member.user).to.have.property('_id');
                    (0, chai_1.expect)(member.user).to.have.property('username');
                    (0, chai_1.expect)(member.user).to.have.property('name');
                    (0, chai_1.expect)(member.user).to.have.property('status');
                    (0, chai_1.expect)(member.createdBy).to.have.property('_id');
                    (0, chai_1.expect)(member.createdBy).to.have.property('username');
                    (0, chai_1.expect)(member.roles).to.have.length(1);
                    (0, chai_1.expect)(member.roles[0]).to.be.equal('owner');
                });
            })
                .then(() => done())
                .catch(done);
        });
        (0, mocha_1.it)('should throw an error if the team already exists', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name,
                type: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('team-name-already-exists');
            })
                .end(done);
        });
        (0, mocha_1.it)('should create a team with sidepanel items containing channels', () => __awaiter(void 0, void 0, void 0, function* () {
            const teamName = `test-team-with-sidepanel-${Date.now()}`;
            const sidepanelItems = ['channels'];
            const response = yield api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name: teamName,
                type: 0,
                sidepanel: {
                    items: sidepanelItems,
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('channels.info'))
                .set(api_data_1.credentials)
                .query({ roomId: response.body.team.roomId })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((response) => {
                (0, chai_1.expect)(response.body).to.have.property('success', true);
                (0, chai_1.expect)(response.body.channel).to.have.property('sidepanel');
                (0, chai_1.expect)(response.body.channel.sidepanel).to.have.property('items').that.is.an('array').to.have.deep.members(sidepanelItems);
            });
            yield (0, teams_helper_1.deleteTeam)(api_data_1.credentials, teamName);
        }));
        (0, mocha_1.it)('should throw error when creating a team with sidepanel with more than 2 items', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name: `test-team-with-sidepanel-error-${Date.now()}`,
                type: 0,
                sidepanel: {
                    items: ['channels', 'discussion', 'other'],
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should throw error when creating a team with sidepanel with incorrect items', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name: `test-team-with-sidepanel-error-${Date.now()}`,
                type: 0,
                sidepanel: {
                    items: ['other'],
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should throw error when creating a team with sidepanel with duplicated items', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name: `test-team-with-sidepanel-error-${Date.now()}`,
                type: 0,
                sidepanel: {
                    items: ['channels', 'channels'],
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(400);
        }));
        (0, mocha_1.it)('should not create a team with no associated room', () => __awaiter(void 0, void 0, void 0, function* () {
            const teamName = 'invalid*team*name';
            yield api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name: teamName,
                type: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((response) => {
                (0, chai_1.expect)(response.body).to.have.property('success', false);
                (0, chai_1.expect)(response.body).to.have.property('error');
                (0, chai_1.expect)(response.body.error).to.be.equal('error-team-creation');
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('teams.info'))
                .set(api_data_1.credentials)
                .query({
                teamName,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((response) => {
                (0, chai_1.expect)(response.body).to.have.property('success', false);
                (0, chai_1.expect)(response.body).to.have.property('error', 'Team not found');
            });
            yield api_data_1.request
                .get((0, api_data_1.api)('teams.members'))
                .set(api_data_1.credentials)
                .query({
                teamName,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((response) => {
                (0, chai_1.expect)(response.body).to.have.property('success', false);
                (0, chai_1.expect)(response.body).to.have.property('error', 'team-does-not-exist');
            });
        }));
        (0, mocha_1.it)('should not allow creating a team when the user does NOT have the create-team permission', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('create-team', []);
            yield api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name: `test-team-${Date.now()}`,
                type: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
});
(0, mocha_1.describe)('/teams.convertToChannel', () => {
    let testTeam;
    let channelToEraseId;
    let channelToKeepId;
    const teamName = `test-team-convert-to-channel-${Date.now()}`;
    const channelToEraseName = `${teamName}-channelToErase`;
    const channelToKeepName = `${teamName}-channelToKeep`;
    (0, mocha_1.before)('Create test team', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.create'))
            .set(api_data_1.credentials)
            .send({
            name: teamName,
            type: 1,
        })
            .end((_err, res) => {
            testTeam = res.body.team;
            done();
        });
    });
    (0, mocha_1.before)('create channel (to erase after its team is converted to a channel)', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.create'))
            .set(api_data_1.credentials)
            .send({
            name: channelToEraseName,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            channelToEraseId = res.body.channel._id;
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', channelToEraseName);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.msgs', 0);
        })
            .then(() => done());
    });
    (0, mocha_1.before)('add first channel to team', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.addRooms'))
            .set(api_data_1.credentials)
            .send({
            rooms: [channelToEraseId],
            teamId: testTeam._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('rooms');
            (0, chai_1.expect)(res.body.rooms[0]).to.have.property('teamId', testTeam._id);
            (0, chai_1.expect)(res.body.rooms[0]).to.not.have.property('teamDefault');
        })
            .then(() => done())
            .catch(done);
    });
    (0, mocha_1.before)('create channel (to keep after its team is converted to a channel)', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('channels.create'))
            .set(api_data_1.credentials)
            .send({
            name: channelToKeepName,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            channelToKeepId = res.body.channel._id;
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', channelToKeepName);
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
            (0, chai_1.expect)(res.body).to.have.nested.property('channel.msgs', 0);
        })
            .then(() => done());
    });
    (0, mocha_1.before)('add second channel to team', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.addRooms'))
            .set(api_data_1.credentials)
            .send({
            rooms: [channelToKeepId],
            teamId: testTeam._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('rooms');
            (0, chai_1.expect)(res.body.rooms[0]).to.have.property('teamId', testTeam._id);
            (0, chai_1.expect)(res.body.rooms[0]).to.not.have.property('teamDefault');
        })
            .then(() => done());
    });
    (0, mocha_1.after)(() => Promise.all([
        (0, teams_helper_1.deleteTeam)(api_data_1.credentials, teamName),
        (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: testTeam.roomId }),
        (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: channelToKeepId }),
    ]));
    (0, mocha_1.it)('should convert the team to a channel, delete the specified room and move the other back to the workspace', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.convertToChannel'))
            .set(api_data_1.credentials)
            .send({
            teamName,
            roomsToRemove: [channelToEraseId],
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .then(() => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: channelToEraseId,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((response) => {
                (0, chai_1.expect)(response.body).to.have.property('success', false);
                (0, chai_1.expect)(response.body).to.have.property('error');
                (0, chai_1.expect)(response.body.error).to.include('[error-room-not-found]');
            });
        })
            .then(() => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: channelToKeepId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((response) => {
                (0, chai_1.expect)(response.body).to.have.property('success', true);
                (0, chai_1.expect)(response.body).to.have.property('channel');
                (0, chai_1.expect)(response.body.channel).to.have.property('_id', channelToKeepId);
                (0, chai_1.expect)(response.body.channel).to.not.have.property('teamId');
            });
        })
            .then(() => {
            void api_data_1.request
                .get((0, api_data_1.api)('channels.info'))
                .set(api_data_1.credentials)
                .query({
                roomId: testTeam.roomId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((response) => {
                (0, chai_1.expect)(response.body).to.have.property('success', true);
                (0, chai_1.expect)(response.body).to.have.property('channel');
                (0, chai_1.expect)(response.body.channel).to.have.property('_id', testTeam.roomId);
                (0, chai_1.expect)(response.body.channel).to.not.have.property('teamId');
                (0, chai_1.expect)(response.body.channel).to.not.have.property('teamMain');
            });
        })
            .then(() => done())
            .catch(done);
    });
});
(0, mocha_1.describe)('/teams.addMembers', () => {
    let testTeam;
    const teamName = `test-team-add-members-${Date.now()}`;
    let testUser;
    let testUser2;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        testUser = yield (0, users_helper_1.createUser)();
        testUser2 = yield (0, users_helper_1.createUser)();
    }));
    (0, mocha_1.before)('Create test team', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.create'))
            .set(api_data_1.credentials)
            .send({
            name: teamName,
            type: 0,
        })
            .end((_err, res) => {
            testTeam = res.body.team;
            done();
        });
    });
    (0, mocha_1.after)(() => Promise.all([(0, users_helper_1.deleteUser)(testUser), (0, users_helper_1.deleteUser)(testUser2), (0, teams_helper_1.deleteTeam)(api_data_1.credentials, teamName)]));
    (0, mocha_1.it)('should add members to a public team', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.addMembers'))
            .set(api_data_1.credentials)
            .send({
            teamName: testTeam.name,
            members: [
                {
                    userId: testUser._id,
                    roles: ['member'],
                },
                {
                    userId: testUser2._id,
                    roles: ['member'],
                },
            ],
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .then(() => void api_data_1.request
            .get((0, api_data_1.api)('teams.members'))
            .set(api_data_1.credentials)
            .query({
            teamName: testTeam.name,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((response) => {
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('members');
            (0, chai_1.expect)(response.body.members).to.have.length(3);
            (0, chai_1.expect)(response.body.members[1]).to.have.property('user');
            (0, chai_1.expect)(response.body.members[1]).to.have.property('roles');
            (0, chai_1.expect)(response.body.members[1]).to.have.property('createdBy');
            (0, chai_1.expect)(response.body.members[1]).to.have.property('createdAt');
            const members = response.body.members.map(({ user, roles }) => ({
                _id: user._id,
                username: user.username,
                name: user.name,
                roles,
            }));
            (0, chai_1.expect)(members).to.deep.own.include({
                _id: testUser._id,
                username: testUser.username,
                name: testUser.name,
                roles: ['member'],
            });
            (0, chai_1.expect)(members).to.deep.own.include({
                _id: testUser2._id,
                username: testUser2.username,
                name: testUser2.name,
                roles: ['member'],
            });
        }))
            .then(() => done())
            .catch(done);
    });
});
(0, mocha_1.describe)('/teams.members', () => {
    let testTeam;
    const teamName = `test-team-members-${Date.now()}`;
    let testUser;
    let testUser2;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        testUser = yield (0, users_helper_1.createUser)();
        testUser2 = yield (0, users_helper_1.createUser)();
    }));
    (0, mocha_1.before)('Create test team', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.create'))
            .set(api_data_1.credentials)
            .send({
            name: teamName,
            type: 0,
        })
            .end((_err, res) => {
            testTeam = res.body.team;
            done();
        });
    });
    (0, mocha_1.before)('Add members to team', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.addMembers'))
            .set(api_data_1.credentials)
            .send({
            teamName: testTeam.name,
            members: [
                {
                    userId: testUser._id,
                    roles: ['member'],
                },
                {
                    userId: testUser2._id,
                    roles: ['member'],
                },
            ],
        })
            .end(done);
    });
    (0, mocha_1.after)(() => Promise.all([(0, users_helper_1.deleteUser)(testUser), (0, users_helper_1.deleteUser)(testUser2), (0, teams_helper_1.deleteTeam)(api_data_1.credentials, teamName)]));
    (0, mocha_1.it)('should list all the members from a public team', (done) => {
        void api_data_1.request
            .get((0, api_data_1.api)('teams.members'))
            .set(api_data_1.credentials)
            .query({
            teamName: testTeam.name,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('count', 3);
            (0, chai_1.expect)(res.body).to.have.property('offset', 0);
            (0, chai_1.expect)(res.body).to.have.property('total', 3);
            (0, chai_1.expect)(res.body).to.have.property('members');
            (0, chai_1.expect)(res.body.members).to.have.length(3);
            (0, chai_1.expect)(res.body.members[0]).to.have.property('user');
            (0, chai_1.expect)(res.body.members[0]).to.have.property('roles');
            (0, chai_1.expect)(res.body.members[0]).to.have.property('createdBy');
            (0, chai_1.expect)(res.body.members[0]).to.have.property('createdAt');
            (0, chai_1.expect)(res.body.members[0].user).to.have.property('_id');
            (0, chai_1.expect)(res.body.members[0].user).to.have.property('username');
            (0, chai_1.expect)(res.body.members[0].user).to.have.property('name');
            (0, chai_1.expect)(res.body.members[0].user).to.have.property('status');
            (0, chai_1.expect)(res.body.members[0].createdBy).to.have.property('_id');
            (0, chai_1.expect)(res.body.members[0].createdBy).to.have.property('username');
        })
            .end(done);
    });
});
(0, mocha_1.describe)('/teams.list', () => {
    const teamName = `test-team-list-${Date.now()}`;
    let testUser1;
    let testUser1Credentials;
    let testTeamAdmin;
    let testTeam1;
    (0, mocha_1.before)('Create test team', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.create'))
            .set(api_data_1.credentials)
            .send({
            name: teamName,
            type: 0,
        })
            .end(done);
    });
    (0, mocha_1.before)('Create test users', () => __awaiter(void 0, void 0, void 0, function* () {
        testUser1 = yield (0, users_helper_1.createUser)();
    }));
    (0, mocha_1.before)('login test users', () => __awaiter(void 0, void 0, void 0, function* () {
        testUser1Credentials = yield (0, users_helper_1.login)(testUser1.username, user_1.password);
    }));
    (0, mocha_1.before)('Create test team', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api_data_1.request.post((0, api_data_1.api)('teams.create')).set(api_data_1.credentials).send({
            name: teamName,
            type: 0,
        });
        const team1Name = `test-team-1-${Date.now()}`;
        const teamAdminName = `test-team-admin-${Date.now()}`;
        testTeam1 = (yield api_data_1.request.post((0, api_data_1.api)('teams.create')).set(testUser1Credentials).send({
            name: team1Name,
            type: 0,
        })).body.team;
        testTeamAdmin = (yield api_data_1.request.post((0, api_data_1.api)('teams.create')).set(api_data_1.credentials).send({
            name: teamAdminName,
            type: 0,
        })).body.team;
    }));
    (0, mocha_1.after)(() => Promise.all([
        (0, teams_helper_1.deleteTeam)(api_data_1.credentials, teamName),
        (0, teams_helper_1.deleteTeam)(testUser1Credentials, testTeam1.name),
        (0, teams_helper_1.deleteTeam)(api_data_1.credentials, testTeamAdmin.name),
    ]));
    (0, mocha_1.after)('delete test users', () => (0, users_helper_1.deleteUser)(testUser1));
    (0, mocha_1.it)('should list all teams', (done) => {
        void api_data_1.request
            .get((0, api_data_1.api)('teams.list'))
            .set(api_data_1.credentials)
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('count');
            (0, chai_1.expect)(res.body).to.have.property('offset', 0);
            (0, chai_1.expect)(res.body).to.have.property('total');
            (0, chai_1.expect)(res.body).to.have.property('teams');
            (0, chai_1.expect)(res.body.teams.length).to.be.gte(1);
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('_id');
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('_updatedAt');
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('name');
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('type');
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('roomId');
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('createdBy');
            (0, chai_1.expect)(res.body.teams[0].createdBy).to.have.property('_id');
            (0, chai_1.expect)(res.body.teams[0].createdBy).to.have.property('username');
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('createdAt');
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('rooms');
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('numberOfUsers');
        })
            .end(done);
    });
    (0, mocha_1.it)("should prevent users from accessing unrelated teams via 'query' parameter", () => {
        return api_data_1.request
            .get((0, api_data_1.api)('teams.list'))
            .set(testUser1Credentials)
            .query({
            query: JSON.stringify({ _id: { $regex: '.*' } }),
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body.teams.length).to.be.gte(1);
            (0, chai_1.expect)(res.body.teams)
                .to.be.an('array')
                .and.to.satisfy((teams) => teams.every((team) => team.createdBy._id === testUser1._id), `Expected only user's own teams to be returned, but found unowned teams.\n${JSON.stringify(res.body.teams.filter((team) => team.createdBy._id !== testUser1._id), null, 2)}`);
        });
    });
    (0, mocha_1.it)("should prevent admins from accessing unrelated teams via 'query' parameter", () => {
        return api_data_1.request
            .get((0, api_data_1.api)('teams.list'))
            .set(api_data_1.credentials)
            .query({
            query: JSON.stringify({ _id: { $regex: '.*' } }),
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body.teams.length).to.be.gte(1);
            (0, chai_1.expect)(res.body.teams)
                .to.be.an('array')
                .and.to.satisfy((teams) => teams.every((team) => team.createdBy._id === api_data_1.credentials['X-User-Id']), `Expected only admin's own teams to be returned, but found unowned teams.\n${JSON.stringify(res.body.teams.filter((team) => team.createdBy._id !== api_data_1.credentials['X-User-Id']), null, 2)}`);
        });
    });
});
(0, mocha_1.describe)('/teams.listAll', () => {
    let teamName;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updatePermission)('view-all-teams', ['admin']);
        teamName = `test-team-${Date.now()}`;
        yield api_data_1.request.post((0, api_data_1.api)('teams.create')).set(api_data_1.credentials).send({
            name: teamName,
            type: 0,
        });
    }));
    (0, mocha_1.after)(() => Promise.all([(0, teams_helper_1.deleteTeam)(api_data_1.credentials, teamName), (0, permissions_helper_1.updatePermission)('view-all-teams', ['admin'])]));
    (0, mocha_1.it)('should list all teams', () => __awaiter(void 0, void 0, void 0, function* () {
        yield api_data_1.request
            .get((0, api_data_1.api)('teams.listAll'))
            .set(api_data_1.credentials)
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
            (0, chai_1.expect)(res.body).to.have.property('count');
            (0, chai_1.expect)(res.body).to.have.property('offset', 0);
            (0, chai_1.expect)(res.body).to.have.property('total');
            (0, chai_1.expect)(res.body).to.have.property('teams');
            (0, chai_1.expect)(res.body.teams).to.be.an('array').that.is.not.empty;
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('_id');
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('_updatedAt');
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('name');
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('type');
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('roomId');
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('createdBy');
            (0, chai_1.expect)(res.body.teams[0].createdBy).to.have.property('_id');
            (0, chai_1.expect)(res.body.teams[0].createdBy).to.have.property('username');
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('createdAt');
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('rooms');
            (0, chai_1.expect)(res.body.teams[0]).to.have.property('numberOfUsers');
        });
    }));
    (0, mocha_1.it)('should return an error when the user does NOT have the view-all-teams permission', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, permissions_helper_1.updatePermission)('view-all-teams', []);
        yield api_data_1.request
            .get((0, api_data_1.api)('teams.listAll'))
            .set(api_data_1.credentials)
            .expect('Content-Type', 'application/json')
            .expect(403)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
        });
    }));
});
(0, mocha_1.describe)('/teams.updateMember', () => {
    let testTeam;
    const teamName = `test-team-update-member-${Date.now()}`;
    let testUser;
    let testUser2;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        testUser = yield (0, users_helper_1.createUser)();
        testUser2 = yield (0, users_helper_1.createUser)();
    }));
    (0, mocha_1.before)('Create test team', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.create'))
            .set(api_data_1.credentials)
            .send({
            name: teamName,
            type: 0,
        })
            .end((_err, res) => {
            testTeam = res.body.team;
            done();
        });
    });
    (0, mocha_1.before)('Add members to team', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.addMembers'))
            .set(api_data_1.credentials)
            .send({
            teamName: testTeam.name,
            members: [
                {
                    userId: testUser._id,
                    roles: ['member'],
                },
                {
                    userId: testUser2._id,
                    roles: ['member'],
                },
            ],
        })
            .end(done);
    });
    (0, mocha_1.after)(() => Promise.all([(0, users_helper_1.deleteUser)(testUser), (0, users_helper_1.deleteUser)(testUser2), (0, teams_helper_1.deleteTeam)(api_data_1.credentials, teamName)]));
    (0, mocha_1.it)("should update member's data in a public team", (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.updateMember'))
            .set(api_data_1.credentials)
            .send({
            teamName: testTeam.name,
            member: {
                userId: testUser._id,
                roles: ['member', 'owner'],
            },
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .then(() => void api_data_1.request
            .get((0, api_data_1.api)('teams.members'))
            .set(api_data_1.credentials)
            .query({
            teamName: testTeam.name,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((response) => {
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('members');
            (0, chai_1.expect)(response.body.members).to.have.length(3);
            const members = response.body.members.map(({ user, roles }) => ({
                _id: user._id,
                username: user.username,
                name: user.name,
                roles,
            }));
            (0, chai_1.expect)(members).to.deep.own.include({
                _id: testUser._id,
                username: testUser.username,
                name: testUser.name,
                roles: ['member', 'owner'],
            });
        }))
            .then(() => done())
            .catch(done);
    });
});
(0, mocha_1.describe)('/teams.removeMember', () => {
    let testTeam;
    const teamName = `test-team-remove-member-${Date.now()}`;
    let testUser;
    let testUser2;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        testUser = yield (0, users_helper_1.createUser)();
        testUser2 = yield (0, users_helper_1.createUser)();
    }));
    (0, mocha_1.before)('Create test team', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.create'))
            .set(api_data_1.credentials)
            .send({
            name: teamName,
            type: 0,
        })
            .end((_err, res) => {
            testTeam = res.body.team;
            done();
        });
    });
    (0, mocha_1.after)(() => Promise.all([(0, users_helper_1.deleteUser)(testUser), (0, users_helper_1.deleteUser)(testUser2), (0, teams_helper_1.deleteTeam)(api_data_1.credentials, teamName)]));
    (0, mocha_1.it)('should not be able to remove the last owner', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.removeMember'))
            .set(api_data_1.credentials)
            .send({
            teamName: testTeam.name,
            userId: api_data_1.credentials['X-User-Id'],
        })
            .expect('Content-Type', 'application/json')
            .expect(400)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error');
            (0, chai_1.expect)(res.body.error).to.be.equal('last-owner-can-not-be-removed');
        })
            .then(() => done())
            .catch(done);
    });
    (0, mocha_1.it)('should not be able to remove if rooms is empty', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.removeMember'))
            .set(api_data_1.credentials)
            .send({
            teamName: testTeam.name,
            userId: api_data_1.credentials['X-User-Id'],
            rooms: [],
        })
            .expect('Content-Type', 'application/json')
            .expect(400)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error');
            (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
        })
            .then(() => done())
            .catch(done);
    });
    (0, mocha_1.it)('should remove one member from a public team', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.addMembers'))
            .set(api_data_1.credentials)
            .send({
            teamName: testTeam.name,
            members: [
                {
                    userId: testUser._id,
                    roles: ['member'],
                },
                {
                    userId: testUser2._id,
                    roles: ['member', 'owner'],
                },
            ],
        })
            .then(() => api_data_1.request
            .post((0, api_data_1.api)('teams.removeMember'))
            .set(api_data_1.credentials)
            .send({
            teamName: testTeam.name,
            userId: testUser2._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .then(() => api_data_1.request
            .get((0, api_data_1.api)('teams.members'))
            .set(api_data_1.credentials)
            .query({
            teamName: testTeam.name,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((response) => {
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('members');
            (0, chai_1.expect)(response.body.members).to.have.length(2);
        }))
            .then(() => done()))
            .catch(done);
    });
});
(0, mocha_1.describe)('/teams.leave', () => {
    let testTeam;
    const teamName = `test-team-leave-${Date.now()}`;
    let testUser;
    let testUser2;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        testUser = yield (0, users_helper_1.createUser)();
        testUser2 = yield (0, users_helper_1.createUser)();
    }));
    (0, mocha_1.before)('Create test team', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.create'))
            .set(api_data_1.credentials)
            .send({
            name: teamName,
            type: 0,
        })
            .end((_err, res) => {
            testTeam = res.body.team;
            done();
        });
    });
    (0, mocha_1.after)(() => Promise.all([(0, users_helper_1.deleteUser)(testUser), (0, users_helper_1.deleteUser)(testUser2), (0, teams_helper_1.deleteTeam)(api_data_1.credentials, teamName)]));
    (0, mocha_1.it)('should not be able to remove the last owner', (done) => {
        api_data_1.request
            .post((0, api_data_1.api)('teams.leave'))
            .set(api_data_1.credentials)
            .send({
            teamName: testTeam.name,
        })
            .expect('Content-Type', 'application/json')
            .expect(400)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error');
            (0, chai_1.expect)(res.body.error).to.be.equal('last-owner-can-not-be-removed');
        })
            .then(() => done())
            .catch(done);
    });
    (0, mocha_1.it)('should remove the calling user from the team', (done) => {
        api_data_1.request
            .post((0, api_data_1.api)('teams.addMembers'))
            .set(api_data_1.credentials)
            .send({
            teamName: testTeam.name,
            members: [
                {
                    userId: testUser._id,
                    roles: ['member'],
                },
                {
                    userId: testUser2._id,
                    roles: ['member', 'owner'],
                },
            ],
        })
            .then(() => api_data_1.request
            .post((0, api_data_1.api)('teams.leave'))
            .set(api_data_1.credentials)
            .send({
            teamName: testTeam.name,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .then(() => done()))
            .catch(done);
    });
    (0, mocha_1.it)('should not be able to leave if rooms is empty', (done) => {
        api_data_1.request
            .post((0, api_data_1.api)('teams.leave'))
            .set(api_data_1.credentials)
            .send({
            teamName: testTeam.name,
            userId: api_data_1.credentials['X-User-Id'],
            rooms: [],
        })
            .expect('Content-Type', 'application/json')
            .expect(400)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', false);
            (0, chai_1.expect)(res.body).to.have.property('error');
            (0, chai_1.expect)(res.body.errorType).to.be.equal('invalid-params');
        })
            .then(() => done())
            .catch(done);
    });
});
(0, mocha_1.describe)('/teams.info', () => {
    const teamName = `test-team-info-${Date.now()}`;
    let testTeam;
    let testTeam2;
    let testUser;
    let testUserCredentials;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        testUser = yield (0, users_helper_1.createUser)();
        testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
        testTeam = yield (0, teams_helper_1.createTeam)(api_data_1.credentials, teamName, core_typings_1.TEAM_TYPE.PUBLIC);
        testTeam2 = yield (0, teams_helper_1.createTeam)(api_data_1.credentials, `${teamName}-2`, core_typings_1.TEAM_TYPE.PRIVATE);
    }));
    (0, mocha_1.after)(() => Promise.all([(0, teams_helper_1.deleteTeam)(api_data_1.credentials, testTeam.name), (0, teams_helper_1.deleteTeam)(api_data_1.credentials, testTeam2.name), (0, users_helper_1.deleteUser)(testUser)]));
    (0, mocha_1.it)('should successfully get a team info by name', (done) => {
        api_data_1.request
            .get((0, api_data_1.api)('teams.info'))
            .set(api_data_1.credentials)
            .query({
            teamName: testTeam.name,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((response) => {
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('teamInfo');
            (0, chai_1.expect)(response.body.teamInfo).to.have.property('_id', testTeam._id);
            (0, chai_1.expect)(response.body.teamInfo).to.have.property('name', testTeam.name);
        })
            .then(() => done())
            .catch(done);
    });
    (0, mocha_1.it)('should successfully get a team info by id', (done) => {
        api_data_1.request
            .get((0, api_data_1.api)('teams.info'))
            .set(api_data_1.credentials)
            .query({
            teamId: testTeam._id,
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((response) => {
            (0, chai_1.expect)(response.body).to.have.property('success', true);
            (0, chai_1.expect)(response.body).to.have.property('teamInfo');
            (0, chai_1.expect)(response.body.teamInfo).to.have.property('_id', testTeam._id);
            (0, chai_1.expect)(response.body.teamInfo).to.have.property('name', testTeam.name);
        })
            .then(() => done())
            .catch(done);
    });
    (0, mocha_1.it)('should fail if a team is not found', (done) => {
        api_data_1.request
            .get((0, api_data_1.api)('teams.info'))
            .set(api_data_1.credentials)
            .query({
            teamName: '',
        })
            .expect('Content-Type', 'application/json')
            .expect(400)
            .expect((response) => {
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('error', 'Team not found');
        })
            .then(() => done())
            .catch(done);
    });
    (0, mocha_1.it)('should fail if a user doesnt belong to a team', (done) => {
        api_data_1.request
            .get((0, api_data_1.api)('teams.info'))
            .set(testUserCredentials)
            .query({
            teamName: testTeam2.name,
        })
            .expect('Content-Type', 'application/json')
            .expect(403)
            .expect((response) => {
            (0, chai_1.expect)(response.body).to.have.property('success', false);
            (0, chai_1.expect)(response.body).to.have.property('error', 'unauthorized');
        })
            .then(() => done())
            .catch(done);
    });
});
(0, mocha_1.describe)('/teams.delete', () => {
    (0, mocha_1.describe)('deleting an empty team', () => {
        let roomId;
        const tempTeamName = `temporaryTeam-${Date.now()}`;
        (0, mocha_1.before)('create team', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name: tempTeamName,
                type: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((resp) => {
                (0, chai_1.expect)(resp.body).to.have.property('success', true);
                (0, chai_1.expect)(resp.body).to.have.property('team');
                (0, chai_1.expect)(resp.body.team).to.have.property('name', tempTeamName);
                (0, chai_1.expect)(resp.body.team).to.have.property('_id');
                (0, chai_1.expect)(resp.body.team).to.have.property('roomId');
                roomId = resp.body.team.roomId;
            })
                .then(() => done());
        });
        (0, mocha_1.after)(() => (0, teams_helper_1.deleteTeam)(api_data_1.credentials, tempTeamName));
        (0, mocha_1.it)('should delete the team and the main room', (done) => {
            api_data_1.request
                .post((0, api_data_1.api)('teams.delete'))
                .set(api_data_1.credentials)
                .send({
                teamName: tempTeamName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('teams.info'))
                    .set(api_data_1.credentials)
                    .query({
                    teamName: tempTeamName,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((response) => {
                    (0, chai_1.expect)(response.body).to.have.property('success', false);
                    (0, chai_1.expect)(response.body).to.have.property('error');
                    (0, chai_1.expect)(response.body.error).to.be.equal('Team not found');
                })
                    .then(() => {
                    void api_data_1.request
                        .get((0, api_data_1.api)('channels.info'))
                        .set(api_data_1.credentials)
                        .query({
                        roomId,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(400)
                        .expect((response) => {
                        (0, chai_1.expect)(response.body).to.have.property('success', false);
                        (0, chai_1.expect)(response.body).to.have.property('error');
                        (0, chai_1.expect)(response.body.error).to.include('[error-room-not-found]');
                    })
                        .then(() => done());
                });
            })
                .catch(done);
        });
    });
    (0, mocha_1.describe)('delete team with two rooms', () => {
        const tempTeamName = `temporaryTeam-${Date.now()}`;
        const channel1Name = `${tempTeamName}-channel1`;
        const channel2Name = `${tempTeamName}-channel2`;
        let teamId;
        let channel1Id;
        let channel2Id;
        (0, mocha_1.before)('create team', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.create'))
                .set(api_data_1.credentials)
                .send({
                name: tempTeamName,
                type: 0,
            })
                .then((response) => {
                teamId = response.body.team._id;
            })
                .then(() => done());
        });
        (0, mocha_1.before)('create channel 1', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.create'))
                .set(api_data_1.credentials)
                .send({
                name: channel1Name,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                channel1Id = res.body.channel._id;
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', channel1Name);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.msgs', 0);
            })
                .then(() => done());
        });
        (0, mocha_1.before)('add channel 1 to team', (done) => {
            api_data_1.request
                .post((0, api_data_1.api)('teams.addRooms'))
                .set(api_data_1.credentials)
                .send({
                rooms: [channel1Id],
                teamId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rooms');
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('teamId', teamId);
                (0, chai_1.expect)(res.body.rooms[0]).to.not.have.property('teamDefault');
            })
                .then(() => done())
                .catch(done);
        });
        (0, mocha_1.before)('create channel 2', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('channels.create'))
                .set(api_data_1.credentials)
                .send({
                name: channel2Name,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                channel2Id = res.body.channel._id;
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel._id');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.name', channel2Name);
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.t', 'c');
                (0, chai_1.expect)(res.body).to.have.nested.property('channel.msgs', 0);
            })
                .then(() => done());
        });
        (0, mocha_1.before)('add channel 2 to team', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.addRooms'))
                .set(api_data_1.credentials)
                .send({
                rooms: [channel2Id],
                teamId,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rooms');
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('teamId', teamId);
                (0, chai_1.expect)(res.body.rooms[0]).to.not.have.property('teamDefault');
            })
                .then(() => done());
        });
        (0, mocha_1.after)(() => (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: channel1Id }));
        (0, mocha_1.it)('should delete the specified room and move the other back to the workspace', (done) => {
            api_data_1.request
                .post((0, api_data_1.api)('teams.delete'))
                .set(api_data_1.credentials)
                .send({
                teamName: tempTeamName,
                roomsToRemove: [channel2Id],
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
            })
                .then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('channels.info'))
                    .set(api_data_1.credentials)
                    .query({
                    roomId: channel2Id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((response) => {
                    (0, chai_1.expect)(response.body).to.have.property('success', false);
                    (0, chai_1.expect)(response.body).to.have.property('error');
                    (0, chai_1.expect)(response.body.error).to.include('[error-room-not-found]');
                })
                    .then(() => {
                    void api_data_1.request
                        .get((0, api_data_1.api)('channels.info'))
                        .set(api_data_1.credentials)
                        .query({
                        roomId: channel1Id,
                    })
                        .expect('Content-Type', 'application/json')
                        .expect(200)
                        .expect((response) => {
                        (0, chai_1.expect)(response.body).to.have.property('success', true);
                        (0, chai_1.expect)(response.body).to.have.property('channel');
                        (0, chai_1.expect)(response.body.channel).to.have.property('_id', channel1Id);
                        (0, chai_1.expect)(response.body.channel).to.not.have.property('teamId');
                    })
                        .then(() => done());
                });
            })
                .catch(done);
        });
    });
});
(0, mocha_1.describe)('/teams.addRooms', () => {
    let privateRoom;
    let privateRoom2;
    let privateRoom3;
    let publicRoom;
    let publicRoom2;
    let publicTeam;
    let privateTeam;
    let testUser;
    let testUserCredentials;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        testUser = yield (0, users_helper_1.createUser)();
        testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
        privateRoom = (yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `community-channel-private-1-${Date.now()}` })).body.group;
        privateRoom2 = (yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `community-channel-private-2-${Date.now()}` })).body.group;
        privateRoom3 = (yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `community-channel-private-3-${Date.now()}` })).body.group;
        publicRoom = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `community-channel-public-1-${Date.now()}` })).body.channel;
        publicRoom2 = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `community-channel-public-2-${Date.now()}` })).body.channel;
        publicTeam = yield (0, teams_helper_1.createTeam)(api_data_1.credentials, `team-name-c-${Date.now()}`, core_typings_1.TEAM_TYPE.PUBLIC);
        privateTeam = yield (0, teams_helper_1.createTeam)(api_data_1.credentials, `team-name-p-${Date.now()}`, core_typings_1.TEAM_TYPE.PRIVATE);
    }));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all([(0, teams_helper_1.deleteTeam)(api_data_1.credentials, publicTeam.name), (0, teams_helper_1.deleteTeam)(api_data_1.credentials, privateTeam.name)]);
        yield Promise.all([
            (0, permissions_helper_1.updatePermission)('move-room-to-team', ['admin', 'owner', 'moderator']),
            ...[privateRoom, privateRoom2, privateRoom3, publicRoom, publicRoom2].map((room) => (0, rooms_helper_1.deleteRoom)({ type: room.t, roomId: room._id })),
            (0, users_helper_1.deleteUser)(testUser),
        ]);
    }));
    (0, mocha_1.it)('should throw an error if no permission', (done) => {
        void (0, permissions_helper_1.updatePermission)('move-room-to-team', []).then(() => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.addRooms'))
                .set(api_data_1.credentials)
                .send({
                rooms: [publicRoom._id],
                teamId: publicTeam._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('error-no-permission-team-channel');
            })
                .end(done);
        });
    });
    (0, mocha_1.it)('should add public and private rooms to team', (done) => {
        void (0, permissions_helper_1.updatePermission)('move-room-to-team', ['admin']).then(() => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.addRooms'))
                .set(api_data_1.credentials)
                .send({
                rooms: [publicRoom._id, privateRoom._id],
                teamId: publicTeam._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rooms');
                (0, chai_1.expect)(res.body.rooms).to.have.length(2);
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('_id');
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('teamId', publicTeam._id);
                (0, chai_1.expect)(res.body.rooms[1]).to.have.property('_id');
                (0, chai_1.expect)(res.body.rooms[1]).to.have.property('teamId', publicTeam._id);
                const rids = res.body.rooms.map(({ _id }) => _id);
                (0, chai_1.expect)(rids).to.include(publicRoom._id);
                (0, chai_1.expect)(rids).to.include(privateRoom._id);
            })
                .end(done);
        });
    });
    (0, mocha_1.it)('should add public room to private team', (done) => {
        void (0, permissions_helper_1.updatePermission)('move-room-to-team', ['admin']).then(() => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.addRooms'))
                .set(api_data_1.credentials)
                .send({
                rooms: [publicRoom2._id],
                teamId: privateTeam._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rooms');
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('teamId', privateTeam._id);
                (0, chai_1.expect)(res.body.rooms[0]).to.not.have.property('teamDefault');
            })
                .end(done);
        });
    });
    (0, mocha_1.it)('should add private room to team', (done) => {
        void (0, permissions_helper_1.updatePermission)('move-room-to-team', ['admin']).then(() => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.addRooms'))
                .set(api_data_1.credentials)
                .send({
                rooms: [privateRoom2._id],
                teamId: privateTeam._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rooms');
                (0, chai_1.expect)(res.body.rooms[0]).to.have.property('teamId', privateTeam._id);
                (0, chai_1.expect)(res.body.rooms[0]).to.not.have.property('teamDefault');
            })
                .end(done);
        });
    });
    (0, mocha_1.it)('should fail if the user cannot access the channel', (done) => {
        void (0, permissions_helper_1.updatePermission)('move-room-to-team', ['admin', 'user'])
            .then(() => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.addRooms'))
                .set(testUserCredentials)
                .send({
                rooms: [privateRoom3._id],
                teamId: privateTeam._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('invalid-room');
            })
                .end(done);
        })
            .catch(done);
    });
    (0, mocha_1.it)('should fail if the user is not the owner of the channel', (done) => {
        void api_data_1.request
            .post((0, api_data_1.methodCall)('addUsersToRoom'))
            .set(api_data_1.credentials)
            .send({
            message: JSON.stringify({
                method: 'addUsersToRoom',
                params: [{ rid: privateRoom3._id, users: [testUser.username] }],
                id: 'id',
                msg: 'method',
            }),
        })
            .expect('Content-Type', 'application/json')
            .expect(200)
            .expect((res) => {
            (0, chai_1.expect)(res.body).to.have.property('success', true);
        })
            .then(() => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.addRooms'))
                .set(testUserCredentials)
                .send({
                rooms: [privateRoom3._id],
                teamId: privateTeam._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('error-no-owner-channel');
            })
                .end(done);
        })
            .catch(done);
    });
});
(0, mocha_1.describe)('/teams.listRooms', () => {
    let testUser;
    let testUserCredentials;
    let privateTeam;
    let publicTeam;
    let privateRoom;
    let publicRoom;
    let publicRoom2;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        testUser = yield (0, users_helper_1.createUser)();
        testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
        privateTeam = yield (0, teams_helper_1.createTeam)(api_data_1.credentials, `teamName-private-${Date.now()}`, core_typings_1.TEAM_TYPE.PRIVATE);
        publicTeam = yield (0, teams_helper_1.createTeam)(testUserCredentials, `teamName-public-${Date.now()}`, core_typings_1.TEAM_TYPE.PUBLIC);
        privateRoom = (yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `test-p-${Date.now()}` })).body.group;
        publicRoom = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `test-c-${Date.now()}` })).body.channel;
        publicRoom2 = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `test-c2-${Date.now()}` })).body.channel;
        yield api_data_1.request
            .post((0, api_data_1.api)('teams.addRooms'))
            .set(api_data_1.credentials)
            .send({
            rooms: [privateRoom._id],
            teamId: publicTeam._id,
        });
        yield api_data_1.request
            .post((0, api_data_1.api)('teams.addRooms'))
            .set(api_data_1.credentials)
            .send({
            rooms: [publicRoom._id],
            teamId: publicTeam._id,
        });
        yield api_data_1.request
            .post((0, api_data_1.api)('teams.addRooms'))
            .set(api_data_1.credentials)
            .send({
            rooms: [publicRoom2._id],
            teamId: privateTeam._id,
        });
    }));
    (0, mocha_1.after)(() => Promise.all([
        (0, permissions_helper_1.updatePermission)('view-all-teams', ['admin']),
        (0, permissions_helper_1.updatePermission)('view-all-team-channels', ['admin', 'owner']),
        (0, users_helper_1.deleteUser)(testUser),
        (0, teams_helper_1.deleteTeam)(api_data_1.credentials, privateTeam.name),
        (0, teams_helper_1.deleteTeam)(api_data_1.credentials, publicTeam.name),
        (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: privateRoom._id }),
        (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: publicRoom._id }),
        (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: publicRoom2._id }),
    ]));
    (0, mocha_1.it)('should throw an error if team is private and no permission', (done) => {
        void (0, permissions_helper_1.updatePermission)('view-all-teams', []).then(() => {
            void api_data_1.request
                .get((0, api_data_1.api)('teams.listRooms'))
                .set(testUserCredentials)
                .query({
                teamId: privateTeam._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('user-not-on-private-team');
            })
                .end(done);
        });
    });
    (0, mocha_1.it)('should return only public rooms for public team', (done) => {
        void (0, permissions_helper_1.updatePermission)('view-all-team-channels', []).then(() => {
            void api_data_1.request
                .get((0, api_data_1.api)('teams.listRooms'))
                .set(testUserCredentials)
                .query({
                teamId: publicTeam._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rooms');
                (0, chai_1.expect)(res.body.rooms).to.be.an('array');
                // main room should not be returned here
                (0, chai_1.expect)(res.body.rooms.length).to.equal(1);
            })
                .end(done);
        });
    });
    (0, mocha_1.it)('should return all rooms for public team', (done) => {
        void (0, permissions_helper_1.updatePermission)('view-all-team-channels', ['user']).then(() => {
            void api_data_1.request
                .get((0, api_data_1.api)('teams.listRooms'))
                .set(testUserCredentials)
                .query({
                teamId: publicTeam._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rooms');
                (0, chai_1.expect)(res.body.rooms).to.be.an('array');
                (0, chai_1.expect)(res.body.rooms.length).to.equal(2);
            })
                .end(done);
        });
    });
    (0, mocha_1.it)('should return all rooms for public team even requested with count and offset params', (done) => {
        void (0, permissions_helper_1.updatePermission)('view-all-team-channels', ['user']).then(() => {
            void api_data_1.request
                .get((0, api_data_1.api)('teams.listRooms'))
                .set(testUserCredentials)
                .query({
                teamId: publicTeam._id,
                count: 5,
                offset: 0,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('rooms');
                (0, chai_1.expect)(res.body.rooms).to.be.an('array');
                (0, chai_1.expect)(res.body.rooms.length).to.equal(2);
            })
                .end(done);
        });
    });
    (0, mocha_1.it)('should return public rooms for private team', (done) => {
        void (0, permissions_helper_1.updatePermission)('view-all-team-channels', []).then(() => {
            void (0, permissions_helper_1.updatePermission)('view-all-teams', ['admin']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('teams.listRooms'))
                    .set(api_data_1.credentials)
                    .query({
                    teamId: privateTeam._id,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('rooms');
                    (0, chai_1.expect)(res.body.rooms).to.be.an('array');
                    (0, chai_1.expect)(res.body.rooms.length).to.equal(1);
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.it)('should return public rooms for private team even requested with count and offset params', (done) => {
        void (0, permissions_helper_1.updatePermission)('view-all-team-channels', []).then(() => {
            void (0, permissions_helper_1.updatePermission)('view-all-teams', ['admin']).then(() => {
                void api_data_1.request
                    .get((0, api_data_1.api)('teams.listRooms'))
                    .set(api_data_1.credentials)
                    .query({
                    teamId: privateTeam._id,
                    count: 5,
                    offset: 0,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('rooms');
                    (0, chai_1.expect)(res.body.rooms).to.be.an('array');
                    (0, chai_1.expect)(res.body.rooms.length).to.equal(1);
                })
                    .end(done);
            });
        });
    });
    (0, mocha_1.describe)('[teams.listChildren]', () => {
        const teamName = `team-${Date.now()}`;
        let testTeam;
        let testPrivateTeam;
        let testUser;
        let testUserCredentials;
        let privateRoom;
        let privateRoom2;
        let publicRoom;
        let publicRoom2;
        let discussionOnPrivateRoom;
        let discussionOnPublicRoom;
        let discussionOnMainRoom;
        (0, mocha_1.before)('Create test team', () => __awaiter(void 0, void 0, void 0, function* () {
            testUser = yield (0, users_helper_1.createUser)();
            testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
            const members = testUser.username ? [testUser.username] : [];
            testTeam = yield (0, teams_helper_1.createTeam)(api_data_1.credentials, teamName, 0, members);
            testPrivateTeam = yield (0, teams_helper_1.createTeam)(testUserCredentials, `${teamName}private`, 1, []);
        }));
        (0, mocha_1.before)('make user owner', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('teams.updateMember'))
                .set(api_data_1.credentials)
                .send({
                teamName: testTeam.name,
                member: {
                    userId: testUser._id,
                    roles: ['member', 'owner'],
                },
            })
                .expect('Content-Type', 'application/json')
                .expect(200);
        }));
        (0, mocha_1.before)('create rooms', () => __awaiter(void 0, void 0, void 0, function* () {
            privateRoom = (yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `test-p-${Date.now()}` })).body.group;
            privateRoom2 = (yield (0, rooms_helper_1.createRoom)({ type: 'p', name: `test-p2-${Date.now()}`, credentials: testUserCredentials })).body.group;
            publicRoom = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `test-c-${Date.now()}` })).body.channel;
            publicRoom2 = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `test-c2-${Date.now()}` })).body.channel;
            yield Promise.all([
                api_data_1.request
                    .post((0, api_data_1.api)('teams.addRooms'))
                    .set(api_data_1.credentials)
                    .send({
                    rooms: [privateRoom._id, publicRoom._id, publicRoom2._id],
                    teamId: testTeam._id,
                })
                    .expect(200),
                api_data_1.request
                    .post((0, api_data_1.api)('teams.addRooms'))
                    .set(testUserCredentials)
                    .send({
                    rooms: [privateRoom2._id],
                    teamId: testTeam._id,
                })
                    .expect(200),
            ]);
        }));
        (0, mocha_1.before)('Create discussions', () => __awaiter(void 0, void 0, void 0, function* () {
            discussionOnPrivateRoom = (yield api_data_1.request
                .post((0, api_data_1.api)('rooms.createDiscussion'))
                .set(api_data_1.credentials)
                .send({
                prid: privateRoom._id,
                t_name: `test-d-${Date.now()}`,
            })).body.discussion;
            discussionOnPublicRoom = (yield api_data_1.request
                .post((0, api_data_1.api)('rooms.createDiscussion'))
                .set(api_data_1.credentials)
                .send({
                prid: publicRoom._id,
                t_name: `test-d-${Date.now()}`,
            })).body.discussion;
            discussionOnMainRoom = (yield api_data_1.request
                .post((0, api_data_1.api)('rooms.createDiscussion'))
                .set(api_data_1.credentials)
                .send({
                prid: testTeam.roomId,
                t_name: `test-d-${Date.now()}`,
            })).body.discussion;
        }));
        (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield Promise.all([
                (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: privateRoom._id }),
                (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: privateRoom2._id }),
                (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: publicRoom._id }),
                (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: publicRoom2._id }),
                (0, rooms_helper_1.deleteRoom)({ type: 'p', roomId: discussionOnPrivateRoom._id }),
                (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: discussionOnPublicRoom._id }),
                (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: discussionOnMainRoom._id }),
                (0, teams_helper_1.deleteTeam)(api_data_1.credentials, teamName),
                (0, teams_helper_1.deleteTeam)(api_data_1.credentials, testPrivateTeam.name),
                (0, users_helper_1.deleteUser)({ _id: testUser._id }),
            ]);
        }));
        (0, mocha_1.it)('should fail if user is not logged in', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('teams.listChildren')).expect(401);
        }));
        (0, mocha_1.it)('should fail if teamId is not passed as queryparam', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('teams.listChildren')).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should fail if teamId is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('teams.listChildren')).set(api_data_1.credentials).query({ teamId: 'invalid' }).expect(404);
        }));
        (0, mocha_1.it)('should fail if teamId is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('teams.listChildren')).set(api_data_1.credentials).query({ teamId: '' }).expect(404);
        }));
        (0, mocha_1.it)('should fail if both properties are passed', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('teams.listChildren')).set(api_data_1.credentials).query({ teamId: testTeam._id, teamName: testTeam.name }).expect(400);
        }));
        (0, mocha_1.it)('should fail if teamName is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('teams.listChildren')).set(api_data_1.credentials).query({ teamName: '' }).expect(404);
        }));
        (0, mocha_1.it)('should fail if teamName is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('teams.listChildren')).set(api_data_1.credentials).query({ teamName: 'invalid' }).expect(404);
        }));
        (0, mocha_1.it)('should fail if roomId is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('teams.listChildren')).set(api_data_1.credentials).query({ roomId: '' }).expect(404);
        }));
        (0, mocha_1.it)('should fail if roomId is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('teams.listChildren')).set(api_data_1.credentials).query({ teamName: 'invalid' }).expect(404);
        }));
        (0, mocha_1.it)('should return a list of valid rooms for user', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)('teams.listChildren')).query({ teamId: testTeam._id }).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(res.body).to.have.property('total').to.be.equal(5);
            (0, chai_1.expect)(res.body).to.have.property('data').to.be.an('array');
            (0, chai_1.expect)(res.body.data).to.have.lengthOf(5);
            const mainRoom = res.body.data.find((room) => room._id === testTeam.roomId);
            (0, chai_1.expect)(mainRoom).to.be.an('object');
            const publicChannel1 = res.body.data.find((room) => room._id === publicRoom._id);
            (0, chai_1.expect)(publicChannel1).to.be.an('object');
            const publicChannel2 = res.body.data.find((room) => room._id === publicRoom2._id);
            (0, chai_1.expect)(publicChannel2).to.be.an('object');
            const privateChannel1 = res.body.data.find((room) => room._id === privateRoom._id);
            (0, chai_1.expect)(privateChannel1).to.be.an('object');
            const privateChannel2 = res.body.data.find((room) => room._id === privateRoom2._id);
            (0, chai_1.expect)(privateChannel2).to.be.undefined;
            const discussionOnP = res.body.data.find((room) => room._id === discussionOnPrivateRoom._id);
            (0, chai_1.expect)(discussionOnP).to.be.undefined;
            const discussionOnC = res.body.data.find((room) => room._id === discussionOnPublicRoom._id);
            (0, chai_1.expect)(discussionOnC).to.be.undefined;
            const mainDiscussion = res.body.data.find((room) => room._id === discussionOnMainRoom._id);
            (0, chai_1.expect)(mainDiscussion).to.be.an('object');
        }));
        (0, mocha_1.it)('should return a valid list of rooms for non admin member too', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)('teams.listChildren')).query({ teamName: testTeam.name }).set(testUserCredentials).expect(200);
            (0, chai_1.expect)(res.body).to.have.property('total').to.be.equal(5);
            (0, chai_1.expect)(res.body).to.have.property('data').to.be.an('array');
            (0, chai_1.expect)(res.body.data).to.have.lengthOf(5);
            const mainRoom = res.body.data.find((room) => room._id === testTeam.roomId);
            (0, chai_1.expect)(mainRoom).to.be.an('object');
            const publicChannel1 = res.body.data.find((room) => room._id === publicRoom._id);
            (0, chai_1.expect)(publicChannel1).to.be.an('object');
            const publicChannel2 = res.body.data.find((room) => room._id === publicRoom2._id);
            (0, chai_1.expect)(publicChannel2).to.be.an('object');
            const privateChannel1 = res.body.data.find((room) => room._id === privateRoom._id);
            (0, chai_1.expect)(privateChannel1).to.be.undefined;
            const privateChannel2 = res.body.data.find((room) => room._id === privateRoom2._id);
            (0, chai_1.expect)(privateChannel2).to.be.an('object');
            const discussionOnP = res.body.data.find((room) => room._id === discussionOnPrivateRoom._id);
            (0, chai_1.expect)(discussionOnP).to.be.undefined;
            const discussionOnC = res.body.data.find((room) => room._id === discussionOnPublicRoom._id);
            (0, chai_1.expect)(discussionOnC).to.be.undefined;
            const mainDiscussion = res.body.data.find((room) => room._id === discussionOnMainRoom._id);
            (0, chai_1.expect)(mainDiscussion).to.be.an('object');
        }));
        (0, mocha_1.it)('should return a valid list of rooms for non admin member too when filtering by teams main room id', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)('teams.listChildren')).query({ roomId: testTeam.roomId }).set(testUserCredentials).expect(200);
            (0, chai_1.expect)(res.body).to.have.property('total').to.be.equal(5);
            (0, chai_1.expect)(res.body).to.have.property('data').to.be.an('array');
            (0, chai_1.expect)(res.body.data).to.have.lengthOf(5);
            const mainRoom = res.body.data.find((room) => room._id === testTeam.roomId);
            (0, chai_1.expect)(mainRoom).to.be.an('object');
            const publicChannel1 = res.body.data.find((room) => room._id === publicRoom._id);
            (0, chai_1.expect)(publicChannel1).to.be.an('object');
            const publicChannel2 = res.body.data.find((room) => room._id === publicRoom2._id);
            (0, chai_1.expect)(publicChannel2).to.be.an('object');
            const privateChannel1 = res.body.data.find((room) => room._id === privateRoom._id);
            (0, chai_1.expect)(privateChannel1).to.be.undefined;
            const privateChannel2 = res.body.data.find((room) => room._id === privateRoom2._id);
            (0, chai_1.expect)(privateChannel2).to.be.an('object');
            const discussionOnP = res.body.data.find((room) => room._id === discussionOnPrivateRoom._id);
            (0, chai_1.expect)(discussionOnP).to.be.undefined;
            const discussionOnC = res.body.data.find((room) => room._id === discussionOnPublicRoom._id);
            (0, chai_1.expect)(discussionOnC).to.be.undefined;
            const mainDiscussion = res.body.data.find((room) => room._id === discussionOnMainRoom._id);
            (0, chai_1.expect)(mainDiscussion).to.be.an('object');
        }));
        (0, mocha_1.it)('should return a list of rooms filtered by name using the filter parameter', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .get((0, api_data_1.api)('teams.listChildren'))
                .query({ teamId: testTeam._id, filter: 'test-p' })
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(res.body).to.have.property('total').to.be.equal(1);
            (0, chai_1.expect)(res.body).to.have.property('data').to.be.an('array');
            (0, chai_1.expect)(res.body.data[0]._id).to.be.equal(privateRoom._id);
            (0, chai_1.expect)(res.body.data.find((room) => room._id === privateRoom2._id)).to.be.undefined;
        }));
        (0, mocha_1.it)('should paginate results', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .get((0, api_data_1.api)('teams.listChildren'))
                .query({ teamId: testTeam._id, offset: 1, count: 2 })
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(res.body).to.have.property('total').to.be.equal(5);
            (0, chai_1.expect)(res.body).to.have.property('data').to.be.an('array');
            (0, chai_1.expect)(res.body.data).to.have.lengthOf(2);
        }));
        (0, mocha_1.it)('should return only items of type channel', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .get((0, api_data_1.api)('teams.listChildren'))
                .query({ teamId: testTeam._id, type: 'channels' })
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(res.body).to.have.property('total').to.be.equal(4);
            (0, chai_1.expect)(res.body).to.have.property('data').to.be.an('array');
            (0, chai_1.expect)(res.body.data).to.have.lengthOf(4);
            (0, chai_1.expect)(res.body.data.some((room) => !!room.prid)).to.be.false;
        }));
        (0, mocha_1.it)('should return only items of type discussion', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request
                .get((0, api_data_1.api)('teams.listChildren'))
                .query({ teamId: testTeam._id, type: 'discussions' })
                .set(api_data_1.credentials)
                .expect(200);
            (0, chai_1.expect)(res.body).to.have.property('total').to.be.equal(1);
            (0, chai_1.expect)(res.body).to.have.property('data').to.be.an('array');
            (0, chai_1.expect)(res.body.data).to.have.lengthOf(1);
            (0, chai_1.expect)(res.body.data.every((room) => !!room.prid)).to.be.true;
        }));
        (0, mocha_1.it)('should return both when type is not passed', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)('teams.listChildren')).query({ teamId: testTeam._id }).set(api_data_1.credentials).expect(200);
            (0, chai_1.expect)(res.body).to.have.property('total').to.be.equal(5);
            (0, chai_1.expect)(res.body).to.have.property('data').to.be.an('array');
            (0, chai_1.expect)(res.body.data).to.have.lengthOf(5);
            (0, chai_1.expect)(res.body.data.some((room) => !!room.prid)).to.be.true;
            (0, chai_1.expect)(res.body.data.some((room) => !room.prid)).to.be.true;
        }));
        (0, mocha_1.it)('should fail if type is other than channel or discussion', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('teams.listChildren')).query({ teamId: testTeam._id, type: 'other' }).set(api_data_1.credentials).expect(400);
        }));
        (0, mocha_1.it)('should properly list children of a private team', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield api_data_1.request.get((0, api_data_1.api)('teams.listChildren')).query({ teamId: testPrivateTeam._id }).set(testUserCredentials).expect(200);
            (0, chai_1.expect)(res.body).to.have.property('total').to.be.equal(1);
            (0, chai_1.expect)(res.body).to.have.property('data').to.be.an('array');
            (0, chai_1.expect)(res.body.data).to.have.lengthOf(1);
        }));
        (0, mocha_1.it)('should throw an error when a non member user tries to fetch info for team', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request.get((0, api_data_1.api)('teams.listChildren')).query({ teamId: testPrivateTeam._id }).set(api_data_1.credentials).expect(400);
        }));
    });
});
(0, mocha_1.describe)('/teams.updateRoom', () => {
    let publicRoom;
    let publicTeam;
    const name = `teamName-update-room-${Date.now()}`;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        publicRoom = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `public-update-room-${Date.now()}` })).body.channel;
        publicTeam = yield (0, teams_helper_1.createTeam)(api_data_1.credentials, name, core_typings_1.TEAM_TYPE.PUBLIC);
        yield api_data_1.request
            .post((0, api_data_1.api)('teams.addRooms'))
            .set(api_data_1.credentials)
            .send({
            rooms: [publicRoom._id],
            teamId: publicTeam._id,
        });
    }));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, teams_helper_1.deleteTeam)(api_data_1.credentials, name);
        yield Promise.all([
            (0, permissions_helper_1.updatePermission)('edit-team-channel', ['admin', 'owner', 'moderator']),
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: publicRoom._id }),
        ]);
    }));
    (0, mocha_1.it)('should throw an error if no permission', (done) => {
        void (0, permissions_helper_1.updatePermission)('edit-team-channel', []).then(() => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.updateRoom'))
                .set(api_data_1.credentials)
                .send({
                roomId: publicRoom._id,
                isDefault: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('unauthorized');
            })
                .end(done);
        });
    });
    (0, mocha_1.it)('should set room to team default', (done) => {
        void (0, permissions_helper_1.updatePermission)('edit-team-channel', ['admin']).then(() => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.updateRoom'))
                .set(api_data_1.credentials)
                .send({
                roomId: publicRoom._id,
                isDefault: true,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room');
                (0, chai_1.expect)(res.body.room).to.have.property('teamId', publicTeam._id);
                (0, chai_1.expect)(res.body.room).to.have.property('teamDefault', true);
            })
                .end(done);
        });
    });
    (0, mocha_1.describe)('team auto-join', () => {
        let testTeam;
        let createdRoom;
        let testUser1;
        let testUser2;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            const [testUser1Result, testUser2Result] = yield Promise.all([(0, users_helper_1.createUser)(), (0, users_helper_1.createUser)()]);
            testUser1 = testUser1Result;
            testUser2 = testUser2Result;
        }));
        (0, mocha_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
            const createTeamPromise = (0, teams_helper_1.createTeam)(api_data_1.credentials, `test-team-name${Date.now()}`, 0);
            const createRoomPromise = (0, rooms_helper_1.createRoom)({ name: `test-room-name${Date.now()}`, type: 'c' });
            const [testTeamCreationResult, testRoomCreationResult] = yield Promise.all([createTeamPromise, createRoomPromise]);
            testTeam = testTeamCreationResult;
            createdRoom = testRoomCreationResult.body.channel;
            yield api_data_1.request
                .post((0, api_data_1.api)('teams.addRooms'))
                .set(api_data_1.credentials)
                .expect(200)
                .send({
                rooms: [createdRoom._id],
                teamName: testTeam.name,
            });
        }));
        (0, mocha_1.afterEach)(() => Promise.all([(0, teams_helper_1.deleteTeam)(api_data_1.credentials, testTeam.name), (0, rooms_helper_1.deleteRoom)({ roomId: createdRoom._id, type: 'c' })]));
        (0, mocha_1.after)(() => Promise.all([(0, permissions_helper_1.updateSetting)('API_User_Limit', 500), (0, users_helper_1.deleteUser)(testUser1), (0, users_helper_1.deleteUser)(testUser2)]));
        (0, mocha_1.it)('should add members when the members count is less than or equal to the API_User_Limit setting', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('API_User_Limit', 2);
            yield addMembers(api_data_1.credentials, testTeam.name, [testUser1._id, testUser2._id]);
            yield api_data_1.request
                .post((0, api_data_1.api)('teams.updateRoom'))
                .set(api_data_1.credentials)
                .send({
                roomId: createdRoom._id,
                isDefault: true,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('room.usersCount').and.to.be.equal(3);
            });
        }));
        (0, mocha_1.it)('should not add all members when we update a team channel to be auto-join and the members count is greater than the API_User_Limit setting', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updateSetting)('API_User_Limit', 1);
            yield addMembers(api_data_1.credentials, testTeam.name, [testUser1._id, testUser2._id]);
            yield api_data_1.request
                .post((0, api_data_1.api)('teams.updateRoom'))
                .set(api_data_1.credentials)
                .send({
                roomId: createdRoom._id,
                isDefault: true,
            })
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.nested.property('room.usersCount').and.to.be.equal(2);
            });
        }));
    });
});
(0, mocha_1.describe)('/teams.removeRoom', () => {
    let publicRoom;
    let publicTeam;
    const name = `teamName-remove-room-${Date.now()}`;
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        publicRoom = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `public-remove-room-${Date.now()}` })).body.channel;
        publicTeam = yield (0, teams_helper_1.createTeam)(api_data_1.credentials, name, core_typings_1.TEAM_TYPE.PUBLIC);
        yield api_data_1.request
            .post((0, api_data_1.api)('teams.addRooms'))
            .set(api_data_1.credentials)
            .send({
            rooms: [publicRoom._id],
            teamId: publicTeam._id,
        });
    }));
    (0, mocha_1.after)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, teams_helper_1.deleteTeam)(api_data_1.credentials, name);
        yield Promise.all([
            (0, permissions_helper_1.updatePermission)('edit-team-channel', ['admin', 'owner', 'moderator']),
            (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: publicRoom._id }),
        ]);
    }));
    (0, mocha_1.after)(() => Promise.all([
        (0, permissions_helper_1.updatePermission)('remove-team-channel', ['admin', 'owner', 'moderator']),
        (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: publicRoom._id }),
        (0, teams_helper_1.deleteTeam)(api_data_1.credentials, name),
    ]));
    (0, mocha_1.it)('should throw an error if no permission', (done) => {
        void (0, permissions_helper_1.updatePermission)('remove-team-channel', []).then(() => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.removeRoom'))
                .set(api_data_1.credentials)
                .send({
                roomId: publicRoom._id,
                teamId: publicTeam._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error');
                (0, chai_1.expect)(res.body.error).to.be.equal('unauthorized');
            })
                .end(done);
        });
    });
    (0, mocha_1.it)('should remove room from team', (done) => {
        void (0, permissions_helper_1.updatePermission)('remove-team-channel', ['admin']).then(() => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.removeRoom'))
                .set(api_data_1.credentials)
                .send({
                roomId: publicRoom._id,
                teamId: publicTeam._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('room');
                (0, chai_1.expect)(res.body.room).to.not.have.property('teamId');
                (0, chai_1.expect)(res.body.room).to.not.have.property('teamDefault');
            })
                .end(done);
        });
    });
});
(0, mocha_1.describe)('/teams.update', () => {
    let testTeam;
    let testTeam2;
    let testTeam3;
    const teamName = `test-team-name1${Date.now()}`;
    const teamName2 = `test-team-name2${Date.now()}`;
    const teamName3 = `test-team-name3${Date.now()}`;
    const testTeamName = `test-team-name-changed${Date.now()}-1`;
    const testTeamName2 = `test-team-name-changed${Date.now()}-2`;
    let unauthorizedUser;
    (0, mocha_1.before)('Create test team', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.create'))
            .set(api_data_1.credentials)
            .send({
            name: teamName,
            type: 0,
        })
            .end((_err, res) => {
            testTeam = res.body.team;
            done();
        });
    });
    (0, mocha_1.before)('Create test team', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.create'))
            .set(api_data_1.credentials)
            .send({
            name: teamName2,
            type: 0,
        })
            .end((_err, res) => {
            testTeam2 = res.body.team;
            done();
        });
    });
    (0, mocha_1.before)('Create test team', (done) => {
        void api_data_1.request
            .post((0, api_data_1.api)('teams.create'))
            .set(api_data_1.credentials)
            .send({
            name: teamName3,
            type: 0,
        })
            .end((_err, res) => {
            testTeam3 = res.body.team;
            done();
        });
    });
    (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
        unauthorizedUser = yield (0, users_helper_1.createUser)();
    }));
    (0, mocha_1.after)(() => Promise.all([...[testTeamName, testTeamName2, teamName3].map((name) => (0, teams_helper_1.deleteTeam)(api_data_1.credentials, name)), (0, users_helper_1.deleteUser)(unauthorizedUser)]));
    (0, mocha_1.it)('should update team name', () => __awaiter(void 0, void 0, void 0, function* () {
        const updateResponse = yield api_data_1.request
            .post((0, api_data_1.api)('teams.update'))
            .set(api_data_1.credentials)
            .send({
            teamId: testTeam._id,
            data: {
                name: testTeamName,
            },
        });
        (0, chai_1.expect)(updateResponse.body).to.have.property('success', true);
        const infoResponse = yield api_data_1.request.get((0, api_data_1.api)('teams.info')).set(api_data_1.credentials).query({ teamId: testTeam._id });
        (0, chai_1.expect)(infoResponse.body).to.have.property('success', true);
        const { teamInfo } = infoResponse.body;
        (0, chai_1.expect)(teamInfo).to.have.property('name', testTeamName);
    }));
    (0, mocha_1.it)('should update team type', () => __awaiter(void 0, void 0, void 0, function* () {
        const updateResponse = yield api_data_1.request
            .post((0, api_data_1.api)('teams.update'))
            .set(api_data_1.credentials)
            .send({
            teamId: testTeam._id,
            data: {
                type: 1,
            },
        });
        (0, chai_1.expect)(updateResponse.body).to.have.property('success', true);
        const infoResponse = yield api_data_1.request.get((0, api_data_1.api)('teams.info')).set(api_data_1.credentials).query({ teamId: testTeam._id });
        (0, chai_1.expect)(infoResponse.body).to.have.property('success', true);
        const { teamInfo } = infoResponse.body;
        (0, chai_1.expect)(teamInfo).to.have.property('type', 1);
    }));
    (0, mocha_1.it)('should update team name and type at once', () => __awaiter(void 0, void 0, void 0, function* () {
        const updateResponse = yield api_data_1.request
            .post((0, api_data_1.api)('teams.update'))
            .set(api_data_1.credentials)
            .send({
            teamId: testTeam2._id,
            data: {
                name: testTeamName2,
                type: 1,
            },
        });
        (0, chai_1.expect)(updateResponse.body).to.have.property('success', true);
        const infoResponse = yield api_data_1.request.get((0, api_data_1.api)('teams.info')).set(api_data_1.credentials).query({ teamId: testTeam2._id });
        (0, chai_1.expect)(infoResponse.body).to.have.property('success', true);
        const { teamInfo } = infoResponse.body;
        (0, chai_1.expect)(teamInfo).to.have.property('type', 1);
    }));
    (0, mocha_1.it)('should not update team if permissions are not met', () => __awaiter(void 0, void 0, void 0, function* () {
        const unauthorizedUserCredentials = yield (0, users_helper_1.login)(unauthorizedUser.username, user_1.password);
        const res = yield api_data_1.request
            .post((0, api_data_1.api)('teams.update'))
            .set(unauthorizedUserCredentials)
            .send({
            teamId: testTeam._id,
            data: {
                name: 'anyname',
            },
        })
            .expect('Content-Type', 'application/json')
            .expect(403);
        (0, chai_1.expect)(res.body).to.have.property('success', false);
    }));
    (0, mocha_1.describe)('should update team room to default and invite users with the right notification preferences', () => {
        let userWithPrefs;
        let userCredentials;
        let createdRoom;
        (0, mocha_1.before)(() => __awaiter(void 0, void 0, void 0, function* () {
            userWithPrefs = yield (0, users_helper_1.createUser)();
            userCredentials = yield (0, users_helper_1.login)(userWithPrefs.username, user_1.password);
            createdRoom = (yield (0, rooms_helper_1.createRoom)({ type: 'c', name: `${Date.now()}-testTeam3` })).body.channel;
            yield api_data_1.request
                .post((0, api_data_1.api)('teams.addRooms'))
                .set(api_data_1.credentials)
                .send({
                rooms: [createdRoom._id],
                teamId: testTeam3._id,
            });
        }));
        (0, mocha_1.after)(() => Promise.all([(0, users_helper_1.deleteUser)(userWithPrefs), (0, rooms_helper_1.deleteRoom)({ type: 'c', roomId: createdRoom._id })]));
        (0, mocha_1.it)('should update user prefs', () => __awaiter(void 0, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.methodCall)('saveUserPreferences'))
                .set(userCredentials)
                .send({
                message: JSON.stringify({
                    method: 'saveUserPreferences',
                    params: [{ emailNotificationMode: 'nothing' }],
                    id: 'id',
                    msg: 'method',
                }),
            })
                .expect(200);
        }));
        (0, mocha_1.it)('should add user with prefs to team', (done) => {
            void api_data_1.request
                .post((0, api_data_1.api)('teams.addMembers'))
                .set(api_data_1.credentials)
                .send({
                teamName: testTeam3.name,
                members: [
                    {
                        userId: userWithPrefs._id,
                        roles: ['member'],
                    },
                ],
            })
                .end(done);
        });
        (0, mocha_1.it)('should update team channel to auto-join', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield api_data_1.request.post((0, api_data_1.api)('teams.updateRoom')).set(api_data_1.credentials).send({
                roomId: createdRoom._id,
                isDefault: true,
            });
            (0, chai_1.expect)(response.body).to.have.property('success', true);
        }));
        (0, mocha_1.it)('should return the user subscription with the right notification preferences', (done) => {
            void api_data_1.request
                .get((0, api_data_1.api)('subscriptions.getOne'))
                .set(userCredentials)
                .query({
                roomId: createdRoom._id,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('subscription').and.to.be.an('object');
                (0, chai_1.expect)(res.body).to.have.nested.property('subscription.emailNotifications').and.to.be.equal('nothing');
            })
                .end(done);
        });
    });
});
