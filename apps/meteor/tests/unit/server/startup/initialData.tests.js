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
const mocha_1 = require("mocha");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const checkUsernameAvailability = sinon_1.default.stub();
const validateEmail = sinon_1.default.stub();
const addUserRolesAsync = sinon_1.default.stub();
const models = {
    Settings: {},
    Rooms: {},
    Users: {
        create: sinon_1.default.stub(),
        findOneByEmailAddress: sinon_1.default.stub(),
    },
    Roles: {
        countUsersInRole: sinon_1.default.stub(),
    },
};
const setPasswordAsync = sinon_1.default.stub();
const settingsGet = sinon_1.default.stub();
const { insertAdminUserFromEnv } = proxyquire_1.default.noCallThru().load('../../../../server/startup/initialData.js', {
    'meteor/accounts-base': {
        Accounts: {
            setPasswordAsync,
        },
    },
    'meteor/meteor': {
        Meteor: {
            startup: sinon_1.default.stub(),
        },
    },
    '../../app/file-upload/server': {},
    '../../app/file/server': {},
    '../../app/lib/server/functions/addUserToDefaultChannels': {},
    '../../app/lib/server/functions/checkUsernameAvailability': {
        checkUsernameAvailability,
    },
    '../../app/settings/server': {
        settings: { get: settingsGet },
    },
    '../../lib/emailValidator': {
        validateEmail,
    },
    '../lib/roles/addUserRoles': {
        addUserRolesAsync,
    },
    '@rocket.chat/models': models,
});
describe('insertAdminUserFromEnv', () => {
    (0, mocha_1.beforeEach)(() => {
        checkUsernameAvailability.reset();
        validateEmail.reset();
        addUserRolesAsync.reset();
        models.Users.create.reset();
        models.Users.findOneByEmailAddress.reset();
        setPasswordAsync.reset();
        settingsGet.reset();
        process.env.ADMIN_PASS = 'pass';
        models.Roles.countUsersInRole.reset();
    });
    (0, mocha_1.it)('should do nothing if process.env.ADMIN_PASS is empty', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.ADMIN_PASS = '';
        const result = yield insertAdminUserFromEnv();
        (0, chai_1.expect)(result).to.be.undefined;
    }));
    (0, mocha_1.it)('should do nothing if theres already an admin user', () => __awaiter(void 0, void 0, void 0, function* () {
        models.Roles.countUsersInRole.resolves(1);
        const result = yield insertAdminUserFromEnv();
        (0, chai_1.expect)(models.Roles.countUsersInRole.called).to.be.true;
        (0, chai_1.expect)(validateEmail.called).to.be.false;
        (0, chai_1.expect)(result).to.be.undefined;
    }));
    (0, mocha_1.it)('should try to validate an email when process.env.ADMIN_EMAIL is set', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.ADMIN_EMAIL = 'email';
        models.Roles.countUsersInRole.resolves(0);
        validateEmail.returns(false);
        models.Users.create.returns({ insertedId: 'newuserid' });
        const result = yield insertAdminUserFromEnv();
        (0, chai_1.expect)(models.Roles.countUsersInRole.called).to.be.true;
        (0, chai_1.expect)(validateEmail.called).to.be.true;
        (0, chai_1.expect)(validateEmail.calledWith('email')).to.be.true;
        (0, chai_1.expect)(models.Users.create.called).to.be.true;
        (0, chai_1.expect)(setPasswordAsync.called).to.be.true;
        (0, chai_1.expect)(result).to.be.undefined;
    }));
    (0, mocha_1.it)('should override the admins name when process.env.ADMIN_NAME is set', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.ADMIN_EMAIL = 'email';
        process.env.ADMIN_NAME = 'name';
        models.Roles.countUsersInRole.resolves(0);
        validateEmail.returns(true);
        validateEmail.returns(false);
        models.Users.create.returns({ insertedId: 'newuserid' });
        yield insertAdminUserFromEnv();
        (0, chai_1.expect)(models.Users.create.calledWith(sinon_1.default.match({
            name: 'name',
            username: 'admin',
            status: 'offline',
            statusDefault: 'online',
            utcOffset: 0,
            active: true,
            type: 'user',
        }))).to.be.true;
    }));
    (0, mocha_1.it)('should ignore the admin email when another user already has it set', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.ADMIN_EMAIL = 'email';
        models.Roles.countUsersInRole.resolves(0);
        validateEmail.returns(true);
        models.Users.create.returns({ insertedId: 'newuserid' });
        models.Users.findOneByEmailAddress.returns({ _id: 'someuser' });
        yield insertAdminUserFromEnv();
        (0, chai_1.expect)(models.Users.create.getCall(0).firstArg).to.not.to.have.property('email');
    }));
    (0, mocha_1.it)('should add the email from env when its valid and no users are using it', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.ADMIN_EMAIL = 'email';
        models.Roles.countUsersInRole.resolves(0);
        validateEmail.returns(true);
        models.Users.create.returns({ insertedId: 'newuserid' });
        models.Users.findOneByEmailAddress.returns(undefined);
        yield insertAdminUserFromEnv();
        (0, chai_1.expect)(models.Users.create.getCall(0).firstArg)
            .to.have.property('emails')
            .to.deep.equal([{ address: 'email', verified: false }]);
    }));
    (0, mocha_1.it)('should mark the admin email as verified when process.env.ADMIN_EMAIL_VERIFIED is set to true', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.ADMIN_EMAIL = 'email';
        process.env.ADMIN_EMAIL_VERIFIED = 'true';
        models.Roles.countUsersInRole.resolves(0);
        validateEmail.returns(true);
        models.Users.create.returns({ insertedId: 'newuserid' });
        models.Users.findOneByEmailAddress.returns(undefined);
        yield insertAdminUserFromEnv();
        (0, chai_1.expect)(models.Users.create.getCall(0).firstArg)
            .to.have.property('emails')
            .to.deep.equal([{ address: 'email', verified: true }]);
    }));
    (0, mocha_1.it)('should validate a username with setting UTF8_User_Names_Validation when process.env.ADMIN_USERNAME is set', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.ADMIN_USERNAME = '1234';
        models.Roles.countUsersInRole.resolves(0);
        validateEmail.returns(true);
        settingsGet.returns('[0-9]+');
        models.Users.create.returns({ insertedId: 'newuserid' });
        yield insertAdminUserFromEnv();
        (0, chai_1.expect)(checkUsernameAvailability.called).to.be.true;
    }));
    (0, mocha_1.it)('should override the username from admin if the env ADMIN_USERNAME is set, is valid and the username is available', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.ADMIN_USERNAME = '1234';
        models.Roles.countUsersInRole.resolves(0);
        validateEmail.returns(true);
        settingsGet.returns('[0-9]+');
        checkUsernameAvailability.returns(true);
        models.Users.create.returns({ insertedId: 'newuserid' });
        yield insertAdminUserFromEnv();
        (0, chai_1.expect)(models.Users.create.calledWith(sinon_1.default.match({ username: '1234' }))).to.be.true;
    }));
    (0, mocha_1.it)('should ignore the username when it does not pass setting regexp validation', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.ADMIN_USERNAME = '1234';
        models.Roles.countUsersInRole.resolves(0);
        validateEmail.returns(true);
        settingsGet.returns('[A-Z]+');
        checkUsernameAvailability.returns(true);
        models.Users.create.returns({ insertedId: 'newuserid' });
        yield insertAdminUserFromEnv();
        (0, chai_1.expect)(models.Users.create.calledWith(sinon_1.default.match({ username: 'admin' }))).to.be.true;
    }));
    (0, mocha_1.it)('should call addUserRolesAsync as the last step when all data is valid and all overrides are valid', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.ADMIN_EMAIL = 'email';
        process.env.ADMIN_NAME = 'name';
        process.env.ADMIN_USERNAME = '1234';
        process.env.ADMIN_EMAIL_VERIFIED = 'true';
        models.Roles.countUsersInRole.resolves(0);
        validateEmail.returns(true);
        settingsGet.returns('[0-9]+');
        checkUsernameAvailability.returns(true);
        models.Users.create.returns({ insertedId: 'newuserid' });
        models.Users.findOneByEmailAddress.returns(undefined);
        yield insertAdminUserFromEnv();
        (0, chai_1.expect)(addUserRolesAsync.called).to.be.true;
        (0, chai_1.expect)(setPasswordAsync.called).to.be.true;
        (0, chai_1.expect)(models.Users.create.calledWith(sinon_1.default.match({ name: 'name', username: '1234', emails: [{ address: 'email', verified: true }] })))
            .to.be.true;
    }));
    (0, mocha_1.it)('should use the default nameValidation regex when the regex on the setting is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.ADMIN_NAME = 'name';
        process.env.ADMIN_USERNAME = '$$$$$$';
        models.Roles.countUsersInRole.resolves(0);
        settingsGet.returns('[');
        checkUsernameAvailability.returns(true);
        models.Users.create.returns({ insertedId: 'newuserid' });
        yield insertAdminUserFromEnv();
        (0, chai_1.expect)(models.Users.create.calledWith(sinon_1.default.match({ username: 'admin' })));
    }));
    (0, mocha_1.it)('should ignore the username when is not available', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.ADMIN_USERNAME = '1234';
        models.Roles.countUsersInRole.resolves(0);
        checkUsernameAvailability.throws('some error');
        models.Users.create.returns({ insertedId: 'newuserid' });
        yield insertAdminUserFromEnv();
        (0, chai_1.expect)(models.Users.create.calledWith(sinon_1.default.match({ username: 'admin' }))).to.be.true;
    }));
});
