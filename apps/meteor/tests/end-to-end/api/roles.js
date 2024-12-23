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
const api_data_1 = require("../../data/api-data");
const permissions_helper_1 = require("../../data/permissions.helper");
const user_1 = require("../../data/user");
const users_helper_1 = require("../../data/users.helper");
(0, mocha_1.describe)('[Roles]', function () {
    this.retries(0);
    const isEnterprise = Boolean(process.env.IS_EE);
    (0, mocha_1.before)((done) => (0, api_data_1.getCredentials)(done));
    mocha_1.describe.skip('[/roles.create]', () => {
        const testRoleName = `role.test.${Date.now()}`;
        (0, mocha_1.it)('should throw an error when not running EE to create a role', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO this is not the right way to do it. We're doing this way for now just because we have separate CI jobs for EE and CE,
                // ideally we should have a single CI job that adds a license and runs both CE and EE tests.
                if (isEnterprise) {
                    this.skip();
                    return;
                }
                yield api_data_1.request
                    .post((0, api_data_1.api)('roles.create'))
                    .set(api_data_1.credentials)
                    .send({
                    name: testRoleName,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'This is an enterprise feature [error-action-not-allowed]');
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-action-not-allowed');
                });
            });
        });
        (0, mocha_1.it)('should successfully create a role in EE', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO this is not the right way to do it. We're doing this way for now just because we have separate CI jobs for EE and CE,
                // ideally we should have a single CI job that adds a license and runs both CE and EE tests.
                if (!isEnterprise) {
                    this.skip();
                    return;
                }
                yield api_data_1.request
                    .post((0, api_data_1.api)('roles.create'))
                    .set(api_data_1.credentials)
                    .send({
                    name: testRoleName,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('role');
                    (0, chai_1.expect)(res.body.role).to.have.property('name', testRoleName);
                });
            });
        });
    });
    (0, mocha_1.describe)('[/roles.update]', () => {
        const testRoleName = `role.test.${Date.now()}`;
        const newTestRoleName = `role.test.updated.${Date.now()}`;
        let testRoleId = '';
        (0, mocha_1.before)('Create a new role with Users scope', () => __awaiter(this, void 0, void 0, function* () {
            if (!isEnterprise) {
                return;
            }
            yield api_data_1.request
                .post((0, api_data_1.api)('roles.create'))
                .set(api_data_1.credentials)
                .send({
                name: testRoleName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('role');
                (0, chai_1.expect)(res.body.role).to.have.property('name', testRoleName);
                testRoleId = res.body.role._id;
            });
        }));
        (0, mocha_1.after)(() => __awaiter(this, void 0, void 0, function* () {
            if (!isEnterprise) {
                return;
            }
            yield api_data_1.request.post((0, api_data_1.api)('roles.delete')).set(api_data_1.credentials).send({
                roleId: testRoleId,
            });
        }));
        (0, mocha_1.it)('should throw an error when not running EE to update a role', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO this is not the right way to do it. We're doing this way for now just because we have separate CI jobs for EE and CE,
                // ideally we should have a single CI job that adds a license and runs both CE and EE tests.
                if (isEnterprise) {
                    this.skip();
                    return;
                }
                yield api_data_1.request
                    .post((0, api_data_1.api)('roles.update'))
                    .set(api_data_1.credentials)
                    .send({
                    name: testRoleName,
                    roleId: testRoleId,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'This is an enterprise feature [error-action-not-allowed]');
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-action-not-allowed');
                });
            });
        });
        (0, mocha_1.it)('should successfully update a role in EE', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO this is not the right way to do it. We're doing this way for now just because we have separate CI jobs for EE and CE,
                // ideally we should have a single CI job that adds a license and runs both CE and EE tests.
                if (!isEnterprise) {
                    this.skip();
                    return;
                }
                yield api_data_1.request
                    .post((0, api_data_1.api)('roles.update'))
                    .set(api_data_1.credentials)
                    .send({
                    name: newTestRoleName,
                    roleId: testRoleId,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('role');
                    (0, chai_1.expect)(res.body.role).to.have.property('name', newTestRoleName);
                });
            });
        });
    });
    (0, mocha_1.describe)('[/roles.getUsersInRole]', () => {
        let testUser;
        let testUserCredentials;
        const testRoleName = `role.getUsersInRole.${Date.now()}`;
        let testRoleId = '';
        (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('access-permissions', ['admin']);
            testUser = yield (0, users_helper_1.createUser)();
            testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
            if (!isEnterprise) {
                return;
            }
            yield api_data_1.request
                .post((0, api_data_1.api)('roles.create'))
                .set(api_data_1.credentials)
                .send({
                name: testRoleName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('role');
                (0, chai_1.expect)(res.body.role).to.have.property('name', testRoleName);
                testRoleId = res.body.role._id;
            });
        }));
        (0, mocha_1.after)(() => __awaiter(this, void 0, void 0, function* () {
            yield (0, users_helper_1.deleteUser)(testUser);
            if (!isEnterprise) {
                return;
            }
            yield api_data_1.request.post((0, api_data_1.api)('roles.delete')).set(api_data_1.credentials).send({
                roleId: testRoleId,
            });
        }));
        (0, mocha_1.it)('should successfully get an empty list of users in a role if no user has been assigned to it', function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (!isEnterprise) {
                    this.skip();
                    return;
                }
                yield api_data_1.request
                    .get((0, api_data_1.api)('roles.getUsersInRole'))
                    .set(api_data_1.credentials)
                    .query({
                    role: testRoleId,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('total', 0);
                    (0, chai_1.expect)(res.body).to.have.property('users').that.is.an('array').that.is.empty;
                });
            });
        });
        (0, mocha_1.it)('should successfully get a list of users in a role', function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (!isEnterprise) {
                    this.skip();
                    return;
                }
                yield api_data_1.request
                    .post((0, api_data_1.api)('roles.addUserToRole'))
                    .set(api_data_1.credentials)
                    .send({
                    roleId: testRoleId,
                    username: user_1.adminUsername,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
                yield api_data_1.request
                    .get((0, api_data_1.api)('roles.getUsersInRole'))
                    .set(api_data_1.credentials)
                    .query({
                    role: testRoleId,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('total', 1);
                    (0, chai_1.expect)(res.body).to.have.property('users').that.is.an('array').of.length(1);
                    (0, chai_1.expect)(res.body.users[0]).to.have.property('_id', api_data_1.credentials['X-User-Id']);
                });
            });
        });
        (0, mocha_1.it)('should fail getting a list of users in a role in case an invalid role is provided', function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (!isEnterprise) {
                    this.skip();
                    return;
                }
                yield api_data_1.request
                    .get((0, api_data_1.api)('roles.getUsersInRole'))
                    .set(api_data_1.credentials)
                    .query({
                    role: 'invalid-role',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-roleId');
                });
            });
        });
        (0, mocha_1.it)('should fail when user does NOT have the access-permissions permission', () => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .get((0, api_data_1.api)('roles.getUsersInRole'))
                .set(testUserCredentials)
                .query({
                role: 'admin',
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
    });
    (0, mocha_1.describe)('[/roles.delete]', () => {
        let testUser;
        let testUserCredentials;
        const testRoleName = `role.delete.${Date.now()}`;
        let testRoleId = '';
        (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
            if (!isEnterprise) {
                return;
            }
            testUser = yield (0, users_helper_1.createUser)();
            testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
            yield (0, permissions_helper_1.updatePermission)('access-permissions', ['admin']);
            yield api_data_1.request
                .post((0, api_data_1.api)('roles.create'))
                .set(api_data_1.credentials)
                .send({
                name: testRoleName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('role');
                (0, chai_1.expect)(res.body.role).to.have.property('name', testRoleName);
                testRoleId = res.body.role._id;
            });
        }));
        (0, mocha_1.after)(() => __awaiter(this, void 0, void 0, function* () {
            if (!isEnterprise) {
                return;
            }
            yield (0, users_helper_1.deleteUser)(testUser);
        }));
        (0, mocha_1.it)('should fail deleting a role when user does NOT have the access-permissions permission', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO this is not the right way to do it. We're doing this way for now just because we have separate CI jobs for EE and CE,
                // ideally we should have a single CI job that adds a license and runs both CE and EE tests.
                if (!isEnterprise) {
                    this.skip();
                    return;
                }
                yield api_data_1.request
                    .post((0, api_data_1.api)('roles.delete'))
                    .set(testUserCredentials)
                    .send({
                    roleId: testRoleId,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(403)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
                });
            });
        });
        (0, mocha_1.it)('should fail deleting a role in EE in case an invalid role is provided', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO this is not the right way to do it. We're doing this way for now just because we have separate CI jobs for EE and CE,
                // ideally we should have a single CI job that adds a license and runs both CE and EE tests.
                if (!isEnterprise) {
                    this.skip();
                    return;
                }
                yield api_data_1.request
                    .post((0, api_data_1.api)('roles.delete'))
                    .set(api_data_1.credentials)
                    .send({
                    roleId: 'invalid-role',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-roleId');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'This role does not exist [error-invalid-roleId]');
                });
            });
        });
        (0, mocha_1.it)('should successfully delete a role in EE', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO this is not the right way to do it. We're doing this way for now just because we have separate CI jobs for EE and CE,
                // ideally we should have a single CI job that adds a license and runs both CE and EE tests.
                if (!isEnterprise) {
                    this.skip();
                    return;
                }
                yield api_data_1.request
                    .post((0, api_data_1.api)('roles.delete'))
                    .set(api_data_1.credentials)
                    .send({
                    roleId: testRoleId,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                });
            });
        });
    });
    (0, mocha_1.describe)('[/roles.removeUserFromRole]', () => {
        let testUser;
        let testUserCredentials;
        const testRoleName = `role.removeUsersFromRole.${Date.now()}`;
        let testRoleId = '';
        (0, mocha_1.before)(() => __awaiter(this, void 0, void 0, function* () {
            yield (0, permissions_helper_1.updatePermission)('access-permissions', ['admin']);
            testUser = yield (0, users_helper_1.createUser)();
            testUserCredentials = yield (0, users_helper_1.login)(testUser.username, user_1.password);
            if (!isEnterprise) {
                return;
            }
            yield api_data_1.request
                .post((0, api_data_1.api)('roles.create'))
                .set(api_data_1.credentials)
                .send({
                name: testRoleName,
            })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', true);
                (0, chai_1.expect)(res.body).to.have.property('role');
                (0, chai_1.expect)(res.body.role).to.have.property('name', testRoleName);
                testRoleId = res.body.role._id;
            });
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
        (0, mocha_1.after)(() => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request.post((0, api_data_1.api)('roles.delete')).set(api_data_1.credentials).send({
                roleId: testRoleId,
            });
            yield (0, users_helper_1.deleteUser)(testUser);
        }));
        (0, mocha_1.it)('should fail removing a user from a role when user does NOT have the access-permissions permission', () => __awaiter(this, void 0, void 0, function* () {
            yield api_data_1.request
                .post((0, api_data_1.api)('roles.removeUserFromRole'))
                .set(testUserCredentials)
                .send({
                roleId: testRoleId,
                username: testUser.username,
            })
                .expect('Content-Type', 'application/json')
                .expect(403)
                .expect((res) => {
                (0, chai_1.expect)(res.body).to.have.property('success', false);
                (0, chai_1.expect)(res.body).to.have.property('error', 'User does not have the permissions required for this action [error-unauthorized]');
            });
        }));
        (0, mocha_1.it)('should fail removing an invalid user from a role', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO this is not the right way to do it. We're doing this way for now just because we have separate CI jobs for EE and CE,
                // ideally we should have a single CI job that adds a license and runs both CE and EE tests.
                if (!isEnterprise) {
                    this.skip();
                    return;
                }
                yield api_data_1.request
                    .post((0, api_data_1.api)('roles.removeUserFromRole'))
                    .set(api_data_1.credentials)
                    .send({
                    roleId: testRoleId,
                    username: 'invalid-username',
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-user');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'There is no user with this username [error-invalid-user]');
                });
            });
        });
        (0, mocha_1.it)('should fail removing a user from an invalid role', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO this is not the right way to do it. We're doing this way for now just because we have separate CI jobs for EE and CE,
                // ideally we should have a single CI job that adds a license and runs both CE and EE tests.
                if (!isEnterprise) {
                    this.skip();
                    return;
                }
                yield api_data_1.request
                    .post((0, api_data_1.api)('roles.removeUserFromRole'))
                    .set(api_data_1.credentials)
                    .send({
                    roleId: 'invalid-role',
                    username: testUser.username,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-invalid-roleId');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'This role does not exist [error-invalid-roleId]');
                });
            });
        });
        (0, mocha_1.it)('should fail removing a user from a role they do not have', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO this is not the right way to do it. We're doing this way for now just because we have separate CI jobs for EE and CE,
                // ideally we should have a single CI job that adds a license and runs both CE and EE tests.
                if (!isEnterprise) {
                    this.skip();
                    return;
                }
                yield api_data_1.request
                    .post((0, api_data_1.api)('roles.removeUserFromRole'))
                    .set(api_data_1.credentials)
                    .send({
                    roleId: 'admin',
                    username: testUser.username,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', false);
                    (0, chai_1.expect)(res.body).to.have.property('errorType', 'error-user-not-in-role');
                    (0, chai_1.expect)(res.body).to.have.property('error', 'User is not in this role [error-user-not-in-role]');
                });
            });
        });
        (0, mocha_1.it)('should successfully remove a user from a role', function () {
            return __awaiter(this, void 0, void 0, function* () {
                // TODO this is not the right way to do it. We're doing this way for now just because we have separate CI jobs for EE and CE,
                // ideally we should have a single CI job that adds a license and runs both CE and EE tests.
                if (!isEnterprise) {
                    this.skip();
                    return;
                }
                yield api_data_1.request
                    .post((0, api_data_1.api)('roles.removeUserFromRole'))
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
                yield api_data_1.request
                    .get((0, api_data_1.api)('roles.getUsersInRole'))
                    .set(api_data_1.credentials)
                    .query({
                    role: testRoleId,
                })
                    .expect('Content-Type', 'application/json')
                    .expect(200)
                    .expect((res) => {
                    (0, chai_1.expect)(res.body).to.have.property('success', true);
                    (0, chai_1.expect)(res.body).to.have.property('total', 0);
                    (0, chai_1.expect)(res.body).to.have.property('users');
                    (0, chai_1.expect)(res.body.users).to.be.an('array').that.is.empty;
                });
            });
        });
    });
});
