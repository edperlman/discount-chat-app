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
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const settingsStub = sinon_1.default.stub();
const modelsMock = {
    Users: {
        findOneByEmailAddress: sinon_1.default.stub(),
        findOneByUsernameIgnoringCase: sinon_1.default.stub(),
        findOneById: sinon_1.default.stub(),
    },
};
const addUserToDefaultChannels = sinon_1.default.stub();
const generateUsernameSuggestion = sinon_1.default.stub();
const insertUserDoc = sinon_1.default.stub();
const callbacks = {
    run: sinon_1.default.stub(),
};
const bcryptHash = sinon_1.default.stub();
const sha = sinon_1.default.stub();
const generateTempPassword = sinon_1.default.stub();
const { UserConverter } = proxyquire_1.default.noCallThru().load('../../../../../app/importer/server/classes/converters/UserConverter', {
    '../../../../../lib/callbacks': {
        callbacks,
    },
    '../../../settings/server': {
        settings: { get: settingsStub },
    },
    '../../../../lib/server/functions/addUserToDefaultChannels': {
        addUserToDefaultChannels,
    },
    '../../../../lib/server/functions/getUsernameSuggestion': {
        generateUsernameSuggestion,
    },
    '../../../../lib/server/functions/saveUserIdentity': {
        saveUserIdentity: sinon_1.default.stub(),
    },
    '../../../../lib/server/functions/setUserActiveStatus': {
        setUserActiveStatus: sinon_1.default.stub(),
    },
    '../../../../lib/server/lib/notifyListener': {
        notifyOnUserChange: sinon_1.default.stub(),
    },
    './generateTempPassword': {
        generateTempPassword,
        '@global': true,
    },
    'bcrypt': {
        'hash': bcryptHash,
        '@global': true,
    },
    'meteor/check': sinon_1.default.stub(),
    'meteor/meteor': sinon_1.default.stub(),
    '@rocket.chat/sha256': {
        SHA256: sha,
    },
    'meteor/accounts-base': {
        Accounts: {
            insertUserDoc,
            _bcryptRounds: () => 10,
        },
    },
    '@rocket.chat/models': Object.assign(Object.assign({}, modelsMock), { '@global': true }),
});
describe('User Converter', () => {
    beforeEach(() => {
        modelsMock.Users.findOneByEmailAddress.reset();
        modelsMock.Users.findOneByUsernameIgnoringCase.reset();
        modelsMock.Users.findOneById.reset();
        callbacks.run.reset();
        insertUserDoc.reset();
        addUserToDefaultChannels.reset();
        generateUsernameSuggestion.reset();
        settingsStub.reset();
    });
    const userToImport = {
        name: 'user1',
        emails: ['user1@domain.com'],
        importIds: ['importId1'],
        username: 'username1',
    };
    describe('[findExistingUser]', () => {
        it('function should be called by the converter', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new UserConverter({ workInMemory: true });
            const findExistingUser = sinon_1.default.stub(converter, 'findExistingUser');
            findExistingUser.throws();
            yield converter.addObject(userToImport);
            yield converter.convertData();
            (0, chai_1.expect)(findExistingUser.getCall(0)).to.not.be.null;
            (0, chai_1.expect)(callbacks.run.getCall(0)).to.not.be.null;
            (0, chai_1.expect)(callbacks.run.getCall(0).args).to.be.deep.equal(['afterUserImport', { inserted: [], updated: [], skipped: 0, failed: 1 }]);
        }));
        it('should search by email address', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new UserConverter({ workInMemory: true });
            yield converter.findExistingUser(userToImport);
            (0, chai_1.expect)(modelsMock.Users.findOneByEmailAddress.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(modelsMock.Users.findOneByEmailAddress.getCall(0).args).to.be.an('array').that.contains('user1@domain.com');
        }));
        it('should search by username', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new UserConverter({ workInMemory: true });
            yield converter.findExistingUser(userToImport);
            (0, chai_1.expect)(modelsMock.Users.findOneByUsernameIgnoringCase.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(modelsMock.Users.findOneByUsernameIgnoringCase.getCall(0).args).to.be.an('array').that.contains('username1');
        }));
        it('should not search by username if an user is found by email', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new UserConverter({ workInMemory: true });
            modelsMock.Users.findOneByEmailAddress.resolves(userToImport);
            yield converter.findExistingUser(userToImport);
            (0, chai_1.expect)(modelsMock.Users.findOneByUsernameIgnoringCase.getCall(0)).to.be.null;
        }));
    });
    describe('[buildNewUserObject]', () => {
        const mappedUser = (expectedData) => (Object.assign({ type: 'user', services: {
                password: {
                    bcrypt: 'hashed=tempPassword',
                },
            } }, expectedData));
        const converter = new UserConverter({ workInMemory: true });
        const hashPassword = sinon_1.default.stub(converter, 'hashPassword');
        generateTempPassword.returns('tempPassword');
        hashPassword.callsFake((pass) => __awaiter(void 0, void 0, void 0, function* () { return `hashed=${pass}`; }));
        bcryptHash.callsFake((pass) => `hashed=${pass}`);
        sha.callsFake((pass) => pass);
        it('should map an empty object', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield converter.buildNewUserObject({
                emails: [],
                importIds: [],
            })).to.be.deep.equal(mappedUser({}));
        }));
        it('should map the name and username', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield converter.buildNewUserObject({
                emails: [],
                importIds: [],
                name: 'name1',
                username: 'username1',
            })).to.be.deep.equal(mappedUser({
                username: 'username1',
                name: 'name1',
            }));
        }));
        it('should map optional fields', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield converter.buildNewUserObject({
                emails: [],
                importIds: [],
                statusText: 'statusText1',
                bio: 'bio1',
                avatarUrl: 'avatarUrl',
                utcOffset: 3,
            })).to.be.deep.equal(mappedUser({
                statusText: 'statusText1',
                bio: 'bio1',
                _pendingAvatarUrl: 'avatarUrl',
                utcOffset: 3,
            }));
        }));
        it('should map custom fields', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield converter.buildNewUserObject({
                emails: [],
                importIds: [],
                customFields: {
                    age: 32,
                    nickname: 'stitch',
                },
            })).to.be.deep.equal(mappedUser({
                customFields: {
                    age: 32,
                    nickname: 'stitch',
                },
            }));
        }));
        it('should not map roles', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield converter.buildNewUserObject({
                emails: [],
                importIds: [],
                roles: ['role1'],
            })).to.be.deep.equal(mappedUser({}));
        }));
        it('should map identifiers', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield converter.buildNewUserObject({
                name: 'user1',
                emails: ['user1@domain.com'],
                importIds: ['importId1'],
                username: 'username1',
            })).to.be.deep.equal(mappedUser({
                username: 'username1',
                name: 'user1',
                importIds: ['importId1'],
                emails: [{ address: 'user1@domain.com', verified: false }],
            }));
        }));
        it('should map password', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield converter.buildNewUserObject({
                emails: [],
                importIds: [],
                password: 'batata',
            })).to.be.deep.equal(mappedUser({
                services: {
                    password: {
                        bcrypt: 'hashed=batata',
                    },
                },
            }));
        }));
        it('should map ldap service data', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield converter.buildNewUserObject({
                emails: [],
                importIds: [],
                services: {
                    ldap: {
                        id: 'id',
                    },
                },
            })).to.be.deep.equal(mappedUser({
                services: {
                    ldap: {
                        id: 'id',
                    },
                },
                ldap: true,
            }));
        }));
        it('should map deleted users', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield converter.buildNewUserObject({
                emails: [],
                importIds: [],
                deleted: true,
            })).to.be.deep.equal(mappedUser({
                active: false,
            }));
        }));
        it('should map restored users', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield converter.buildNewUserObject({
                emails: [],
                importIds: [],
                deleted: false,
            })).to.be.deep.equal(mappedUser({
                active: true,
            }));
        }));
        it('should map user type', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield converter.buildNewUserObject({
                emails: [],
                importIds: [],
                type: 'user',
            })).to.be.deep.equal(mappedUser({}));
        }));
        it('should map bot type', () => __awaiter(void 0, void 0, void 0, function* () {
            (0, chai_1.expect)(yield converter.buildNewUserObject({
                emails: [],
                importIds: [],
                type: 'bot',
            })).to.be.deep.equal(mappedUser({
                type: 'bot',
                services: {
                    password: {
                        bcrypt: 'hashed=tempPassword',
                    },
                },
            }));
        }));
    });
    describe('[insertUser]', () => {
        it('function should be called by the converter', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new UserConverter({ workInMemory: true, skipDefaultChannels: true });
            modelsMock.Users.findOneByEmailAddress.resolves(null);
            modelsMock.Users.findOneByUsernameIgnoringCase.resolves(null);
            sinon_1.default.stub(converter, 'insertUser');
            sinon_1.default.stub(converter, 'updateUser');
            yield converter.addObject(userToImport);
            yield converter.convertData();
            (0, chai_1.expect)(converter.updateUser.getCalls()).to.be.an('array').with.lengthOf(0);
            (0, chai_1.expect)(converter.insertUser.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(converter.insertUser.getCall(0).args).to.be.an('array').that.is.not.empty;
            (0, chai_1.expect)(converter.insertUser.getCall(0).args[0]).to.be.deep.equal(userToImport);
            (0, chai_1.expect)(addUserToDefaultChannels.getCalls()).to.be.an('array').with.lengthOf(0);
        }));
        it('function should not be called when skipNewUsers = true', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new UserConverter({ workInMemory: true, skipNewUsers: true });
            sinon_1.default.stub(converter, 'findExistingUser');
            sinon_1.default.stub(converter, 'insertUser');
            sinon_1.default.stub(converter, 'updateUser');
            sinon_1.default.stub(converter, 'skipMemoryRecord');
            yield converter.addObject(userToImport);
            yield converter.convertData();
            (0, chai_1.expect)(converter.insertUser.getCall(0)).to.be.null;
            (0, chai_1.expect)(converter.skipMemoryRecord.getCall(0)).to.not.be.null;
            (0, chai_1.expect)(callbacks.run.getCall(0)).to.not.be.null;
            (0, chai_1.expect)(callbacks.run.getCall(0).args).to.be.deep.equal(['afterUserImport', { inserted: [], updated: [], skipped: 1, failed: 0 }]);
        }));
        it('function should not be called for existing users', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new UserConverter({ workInMemory: true });
            sinon_1.default.stub(converter, 'findExistingUser');
            converter.findExistingUser.returns({ _id: 'oldId' });
            sinon_1.default.stub(converter, 'insertUser');
            sinon_1.default.stub(converter, 'updateUser');
            yield converter.addObject(userToImport);
            yield converter.convertData();
            (0, chai_1.expect)(converter.insertUser.getCall(0)).to.be.null;
            (0, chai_1.expect)(callbacks.run.getCall(0)).to.not.be.null;
            (0, chai_1.expect)(callbacks.run.getCall(0).args).to.be.deep.equal([
                'afterUserImport',
                { inserted: [], updated: ['oldId'], skipped: 0, failed: 0 },
            ]);
        }));
        it('addUserToDefaultChannels should be called by the converter on successful insert', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new UserConverter({ workInMemory: true, skipDefaultChannels: false });
            modelsMock.Users.findOneByEmailAddress.resolves(null);
            modelsMock.Users.findOneByUsernameIgnoringCase.resolves(null);
            modelsMock.Users.findOneById.withArgs('newId').returns({ newUser: true });
            sinon_1.default.stub(converter, 'insertUser');
            converter.insertUser.callsFake(() => 'newId');
            yield converter.addObject(userToImport);
            yield converter.convertData();
            (0, chai_1.expect)(converter.insertUser.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(converter.insertUser.getCall(0).args).to.be.an('array').that.is.not.empty;
            (0, chai_1.expect)(converter.insertUser.getCall(0).args[0]).to.be.deep.equal(userToImport);
            (0, chai_1.expect)(addUserToDefaultChannels.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(addUserToDefaultChannels.getCall(0).args).to.be.an('array').that.deep.contains({ newUser: true });
        }));
        it('should call insertUserDoc with the mapped data and roles', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new UserConverter({ workInMemory: true });
            let insertedUser = null;
            insertUserDoc.callsFake((_options, data) => {
                insertedUser = Object.assign(Object.assign({}, data), { _id: 'Id1' });
                return 'Id1';
            });
            modelsMock.Users.findOneById.withArgs('Id1').resolves(insertedUser);
            yield converter.insertUser(Object.assign(Object.assign({}, userToImport), { roles: ['role1', 'role2'] }));
            (0, chai_1.expect)(insertUserDoc.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(insertUserDoc.getCall(0).args).to.be.an('array').with.lengthOf(2);
            const usedParams = insertUserDoc.getCall(0).args[1];
            (0, chai_1.expect)(usedParams).to.deep.include({
                type: 'user',
                username: 'username1',
                name: 'user1',
                importIds: ['importId1'],
                emails: [{ address: 'user1@domain.com', verified: false }],
                globalRoles: ['role1', 'role2'],
            });
        }));
    });
    describe('[updateUser]', () => {
        it('function should be called by the converter', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new UserConverter({ workInMemory: true });
            sinon_1.default.stub(converter, 'findExistingUser');
            converter.findExistingUser.returns({ _id: 'oldId' });
            sinon_1.default.stub(converter, 'insertUser');
            sinon_1.default.stub(converter, 'updateUser');
            yield converter.addObject(userToImport);
            yield converter.convertData();
            (0, chai_1.expect)(converter.insertUser.getCalls()).to.be.an('array').with.lengthOf(0);
            (0, chai_1.expect)(converter.updateUser.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(converter.updateUser.getCall(0).args).to.be.an('array').that.is.not.empty;
            (0, chai_1.expect)(converter.updateUser.getCall(0).args[1]).to.be.deep.equal(userToImport);
        }));
        it('function should not be called when skipExistingUsers = true', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new UserConverter({ workInMemory: true, skipExistingUsers: true });
            sinon_1.default.stub(converter, 'findExistingUser');
            converter.findExistingUser.returns({ _id: 'oldId' });
            sinon_1.default.stub(converter, 'insertUser');
            sinon_1.default.stub(converter, 'updateUser');
            sinon_1.default.stub(converter, 'skipMemoryRecord');
            yield converter.addObject(userToImport);
            yield converter.convertData();
            (0, chai_1.expect)(converter.updateUser.getCall(0)).to.be.null;
            (0, chai_1.expect)(converter.skipMemoryRecord.getCall(0)).to.not.be.null;
            (0, chai_1.expect)(callbacks.run.getCall(0)).to.not.be.null;
            (0, chai_1.expect)(callbacks.run.getCall(0).args).to.be.deep.equal(['afterUserImport', { inserted: [], updated: [], skipped: 1, failed: 0 }]);
        }));
        it('function should not be called for new users', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new UserConverter({ workInMemory: true });
            sinon_1.default.stub(converter, 'findExistingUser');
            sinon_1.default.stub(converter, 'insertUser');
            sinon_1.default.stub(converter, 'updateUser');
            yield converter.addObject(userToImport);
            yield converter.convertData();
            (0, chai_1.expect)(converter.updateUser.getCall(0)).to.be.null;
        }));
    });
    // #TODO: Validate batch conversions
    describe('callbacks', () => {
        it('beforeImportFn should be triggered', () => __awaiter(void 0, void 0, void 0, function* () {
            const beforeImportFn = sinon_1.default.stub();
            beforeImportFn.callsFake(() => true);
            const converter = new UserConverter({ workInMemory: true, skipDefaultChannels: true });
            sinon_1.default.stub(converter, 'findExistingUser');
            sinon_1.default.stub(converter, 'insertUser');
            sinon_1.default.stub(converter, 'updateUser');
            yield converter.addObject(userToImport);
            yield converter.convertData({
                beforeImportFn,
            });
            (0, chai_1.expect)(beforeImportFn.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(converter.insertUser.getCalls()).to.be.an('array').with.lengthOf(1);
        }));
        it('afterImportFn should be triggered', () => __awaiter(void 0, void 0, void 0, function* () {
            const afterImportFn = sinon_1.default.stub();
            const converter = new UserConverter({ workInMemory: true, skipDefaultChannels: true });
            sinon_1.default.stub(converter, 'findExistingUser');
            sinon_1.default.stub(converter, 'insertUser');
            sinon_1.default.stub(converter, 'updateUser');
            yield converter.addObject(userToImport);
            yield converter.convertData({
                afterImportFn,
            });
            (0, chai_1.expect)(converter.insertUser.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(afterImportFn.getCalls()).to.be.an('array').with.lengthOf(1);
        }));
        it('should skip record if beforeImportFn returns false', () => __awaiter(void 0, void 0, void 0, function* () {
            let recordId = null;
            const beforeImportFn = sinon_1.default.stub();
            const afterImportFn = sinon_1.default.stub();
            beforeImportFn.callsFake((record) => {
                recordId = record._id;
                return false;
            });
            const converter = new UserConverter({ workInMemory: true, skipDefaultChannels: true });
            sinon_1.default.stub(converter, 'findExistingUser');
            sinon_1.default.stub(converter, 'insertUser');
            sinon_1.default.stub(converter, 'updateUser');
            sinon_1.default.stub(converter, 'skipMemoryRecord');
            yield converter.addObject(userToImport);
            yield converter.convertData({
                beforeImportFn,
                afterImportFn,
            });
            (0, chai_1.expect)(beforeImportFn.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(converter.skipMemoryRecord.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(afterImportFn.getCalls()).to.be.an('array').with.lengthOf(0);
            (0, chai_1.expect)(converter.skipMemoryRecord.getCall(0).args).to.be.an('array').that.is.deep.equal([recordId]);
            (0, chai_1.expect)(callbacks.run.getCall(0)).to.not.be.null;
            (0, chai_1.expect)(callbacks.run.getCall(0).args).to.be.deep.equal(['afterUserImport', { inserted: [], updated: [], skipped: 1, failed: 0 }]);
        }));
        it('should not skip record if beforeImportFn returns true', () => __awaiter(void 0, void 0, void 0, function* () {
            let userId = null;
            const beforeImportFn = sinon_1.default.stub();
            const afterImportFn = sinon_1.default.stub();
            beforeImportFn.callsFake(() => true);
            afterImportFn.callsFake((record) => {
                userId = record.data._id;
            });
            const converter = new UserConverter({ workInMemory: true, skipDefaultChannels: true });
            sinon_1.default.stub(converter, 'findExistingUser');
            sinon_1.default.stub(converter, 'insertUser');
            sinon_1.default.stub(converter, 'updateUser');
            yield converter.addObject(userToImport);
            yield converter.convertData({
                beforeImportFn,
                afterImportFn,
            });
            (0, chai_1.expect)(beforeImportFn.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(converter.insertUser.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(afterImportFn.getCalls()).to.be.an('array').with.lengthOf(1);
            (0, chai_1.expect)(callbacks.run.getCall(0)).to.not.be.null;
            (0, chai_1.expect)(callbacks.run.getCall(0).args).to.be.deep.equal([
                'afterUserImport',
                { inserted: [userId], updated: [], skipped: 0, failed: 0 },
            ]);
        }));
        it('onErrorFn should be triggered if there is no email and no username', () => __awaiter(void 0, void 0, void 0, function* () {
            const converter = new UserConverter({ workInMemory: true, skipDefaultChannels: true });
            const onErrorFn = sinon_1.default.stub();
            sinon_1.default.stub(converter, 'findExistingUser');
            sinon_1.default.stub(converter, 'insertUser');
            sinon_1.default.stub(converter, 'updateUser');
            sinon_1.default.stub(converter, 'saveError');
            yield converter.addObject({
                name: 'user1',
                emails: [],
                importIds: [],
            });
            yield converter.convertData({ onErrorFn });
            (0, chai_1.expect)(converter.insertUser.getCall(0)).to.be.null;
            (0, chai_1.expect)(callbacks.run.getCall(0)).to.not.be.null;
            (0, chai_1.expect)(callbacks.run.getCall(0).args).to.be.deep.equal(['afterUserImport', { inserted: [], updated: [], skipped: 0, failed: 1 }]);
            (0, chai_1.expect)(onErrorFn.getCall(0)).to.not.be.null;
            (0, chai_1.expect)(converter.saveError.getCall(0)).to.not.be.null;
        }));
        // #TODO: Validate afterBatchFn
    });
});
