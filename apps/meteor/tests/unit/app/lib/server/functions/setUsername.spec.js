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
describe('setUsername', () => {
    const userId = 'userId';
    const username = 'validUsername';
    const stubs = {
        Users: {
            findOneById: sinon_1.default.stub(),
            setUsername: sinon_1.default.stub(),
        },
        Accounts: {
            sendEnrollmentEmail: sinon_1.default.stub(),
        },
        settings: {
            get: sinon_1.default.stub(),
        },
        api: {
            broadcast: sinon_1.default.stub(),
        },
        Invites: {
            findOneById: sinon_1.default.stub(),
        },
        callbacks: {
            run: sinon_1.default.stub(),
        },
        checkUsernameAvailability: sinon_1.default.stub(),
        validateUsername: sinon_1.default.stub(),
        saveUserIdentity: sinon_1.default.stub(),
        joinDefaultChannels: sinon_1.default.stub(),
        getAvatarSuggestionForUser: sinon_1.default.stub(),
        setUserAvatar: sinon_1.default.stub(),
        addUserToRoom: sinon_1.default.stub(),
        notifyOnUserChange: sinon_1.default.stub(),
        RateLimiter: {
            limitFunction: sinon_1.default.stub(),
        },
        underscore: {
            escape: sinon_1.default.stub(),
        },
        SystemLogger: sinon_1.default.stub(),
    };
    const { setUsernameWithValidation, _setUsername } = proxyquire_1.default
        .noCallThru()
        .load('../../../../../../app/lib/server/functions/setUsername', {
        'meteor/meteor': { Meteor: { Error } },
        '@rocket.chat/core-services': { api: stubs.api },
        '@rocket.chat/models': { Users: stubs.Users, Invites: stubs.Invites },
        'meteor/accounts-base': { Accounts: stubs.Accounts },
        'underscore': stubs.underscore,
        '../../../settings/server': { settings: stubs.settings },
        '../lib': { notifyOnUserChange: stubs.notifyOnUserChange, RateLimiter: stubs.RateLimiter },
        './addUserToRoom': { addUserToRoom: stubs.addUserToRoom },
        './checkUsernameAvailability': { checkUsernameAvailability: stubs.checkUsernameAvailability },
        './getAvatarSuggestionForUser': { getAvatarSuggestionForUser: stubs.getAvatarSuggestionForUser },
        './joinDefaultChannels': { joinDefaultChannels: stubs.joinDefaultChannels },
        './saveUserIdentity': { saveUserIdentity: stubs.saveUserIdentity },
        './setUserAvatar': { setUserAvatar: stubs.setUserAvatar },
        './validateUsername': { validateUsername: stubs.validateUsername },
        '../../../../lib/callbacks': { callbacks: stubs.callbacks },
        '../../../../server/lib/logger/system': { SystemLogger: stubs.SystemLogger },
    });
    afterEach(() => {
        stubs.Users.findOneById.reset();
        stubs.Users.setUsername.reset();
        stubs.Accounts.sendEnrollmentEmail.reset();
        stubs.settings.get.reset();
        stubs.api.broadcast.reset();
        stubs.Invites.findOneById.reset();
        stubs.callbacks.run.reset();
        stubs.checkUsernameAvailability.reset();
        stubs.validateUsername.reset();
        stubs.saveUserIdentity.reset();
        stubs.joinDefaultChannels.reset();
        stubs.getAvatarSuggestionForUser.reset();
        stubs.setUserAvatar.reset();
        stubs.addUserToRoom.reset();
        stubs.notifyOnUserChange.reset();
        stubs.RateLimiter.limitFunction.reset();
        stubs.underscore.escape.reset();
        stubs.SystemLogger.reset();
    });
    describe('setUsernameWithValidation', () => {
        it('should throw an error if username is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield setUsernameWithValidation(userId, '');
            }
            catch (error) {
                (0, chai_1.expect)(error.message).to.equal('error-invalid-username');
            }
        }));
        it('should throw an error if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            stubs.Users.findOneById.withArgs(userId).returns(null);
            try {
                yield setUsernameWithValidation(userId, username);
            }
            catch (error) {
                (0, chai_1.expect)(stubs.Users.findOneById.calledOnce).to.be.true;
                (0, chai_1.expect)(error.message).to.equal('error-invalid-user');
            }
        }));
        it('should throw an error if username change is not allowed', () => __awaiter(void 0, void 0, void 0, function* () {
            stubs.Users.findOneById.resolves({ username: 'oldUsername' });
            stubs.settings.get.withArgs('Accounts_AllowUsernameChange').returns(false);
            try {
                yield setUsernameWithValidation(userId, username);
            }
            catch (error) {
                (0, chai_1.expect)(stubs.settings.get.calledOnce).to.be.true;
                (0, chai_1.expect)(error.message).to.equal('error-not-allowed');
            }
        }));
        it('should throw an error if username is not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            stubs.Users.findOneById.resolves({ username: null });
            stubs.validateUsername.returns(false);
            try {
                yield setUsernameWithValidation(userId, 'invalid-username');
            }
            catch (error) {
                (0, chai_1.expect)(stubs.validateUsername.calledOnce).to.be.true;
                (0, chai_1.expect)(error.message).to.equal('username-invalid');
            }
        }));
        it('should throw an error if username is already in use', () => __awaiter(void 0, void 0, void 0, function* () {
            stubs.Users.findOneById.resolves({ username: null });
            stubs.validateUsername.returns(true);
            stubs.checkUsernameAvailability.resolves(false);
            try {
                yield setUsernameWithValidation(userId, 'existingUsername');
            }
            catch (error) {
                (0, chai_1.expect)(stubs.checkUsernameAvailability.calledOnce).to.be.true;
                (0, chai_1.expect)(error.message).to.equal('error-field-unavailable');
            }
        }));
        it('should save the user identity when valid username is set', () => __awaiter(void 0, void 0, void 0, function* () {
            stubs.Users.findOneById.resolves({ _id: userId, username: null });
            stubs.settings.get.withArgs('Accounts_AllowUsernameChange').returns(true);
            stubs.validateUsername.returns(true);
            stubs.checkUsernameAvailability.resolves(true);
            stubs.saveUserIdentity.resolves(true);
            yield setUsernameWithValidation(userId, 'newUsername');
            (0, chai_1.expect)(stubs.saveUserIdentity.calledOnce).to.be.true;
            (0, chai_1.expect)(stubs.joinDefaultChannels.calledOnceWith(userId, undefined)).to.be.true;
        }));
    });
    describe('_setUsername', () => {
        it('should return false if userId or username is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield _setUsername(null, '', {});
            (0, chai_1.expect)(result).to.be.false;
        }));
        it('should return false if username is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            stubs.validateUsername.returns(false);
            const result = yield _setUsername(userId, 'invalid-username', {});
            (0, chai_1.expect)(result).to.be.false;
        }));
        it('should return user if username is already set', () => __awaiter(void 0, void 0, void 0, function* () {
            stubs.validateUsername.returns(true);
            const mockUser = { username };
            const result = yield _setUsername(userId, username, mockUser);
            (0, chai_1.expect)(result).to.equal(mockUser);
        }));
        it('should set username when user has no previous username', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { _id: userId, emails: [{ address: 'test@example.com' }] };
            stubs.validateUsername.returns(true);
            stubs.Users.findOneById.resolves(mockUser);
            stubs.checkUsernameAvailability.resolves(true);
            yield _setUsername(userId, username, mockUser);
            (0, chai_1.expect)(stubs.Users.setUsername.calledOnceWith(userId, username));
            (0, chai_1.expect)(stubs.checkUsernameAvailability.calledOnceWith(username));
            (0, chai_1.expect)(stubs.api.broadcast.calledOnceWith('user.autoupdate', { user: mockUser }));
        }));
        it('should set username when user has and old that is different from new', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { _id: userId, username: 'oldUsername', emails: [{ address: 'test@example.com' }] };
            stubs.validateUsername.returns(true);
            stubs.Users.findOneById.resolves(mockUser);
            stubs.checkUsernameAvailability.resolves(true);
            yield _setUsername(userId, username, mockUser);
            (0, chai_1.expect)(stubs.Users.setUsername.calledOnceWith(userId, username));
            (0, chai_1.expect)(stubs.checkUsernameAvailability.calledOnceWith(username));
            (0, chai_1.expect)(stubs.api.broadcast.calledOnceWith('user.autoupdate', { user: mockUser }));
        }));
        it('should set username when user has and old that is different from new', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { _id: userId, username: 'oldUsername', emails: [{ address: 'test@example.com' }] };
            stubs.validateUsername.returns(true);
            stubs.Users.findOneById.resolves(mockUser);
            stubs.checkUsernameAvailability.resolves(true);
            yield _setUsername(userId, username, mockUser);
            (0, chai_1.expect)(stubs.Users.setUsername.calledOnceWith(userId, username));
            (0, chai_1.expect)(stubs.checkUsernameAvailability.calledOnceWith(username));
            (0, chai_1.expect)(stubs.api.broadcast.calledOnceWith('user.autoupdate', { user: mockUser }));
        }));
        it('should set avatar if Accounts_SetDefaultAvatar is enabled', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { _id: userId, username: null };
            stubs.validateUsername.returns(true);
            stubs.Users.findOneById.resolves(mockUser);
            stubs.checkUsernameAvailability.resolves(true);
            stubs.settings.get.withArgs('Accounts_SetDefaultAvatar').returns(true);
            stubs.getAvatarSuggestionForUser.resolves({ gravatar: { blob: 'blobData', contentType: 'image/png' } });
            yield _setUsername(userId, username, mockUser);
            (0, chai_1.expect)(stubs.setUserAvatar.calledOnceWith(mockUser, 'blobData', 'image/png', 'gravatar')).to.be.true;
        }));
        it('should not set avatar if Accounts_SetDefaultAvatar is disabled', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { _id: userId, username: null };
            stubs.validateUsername.returns(true);
            stubs.Users.findOneById.resolves(mockUser);
            stubs.checkUsernameAvailability.resolves(true);
            stubs.settings.get.withArgs('Accounts_SetDefaultAvatar').returns(false);
            yield _setUsername(userId, username, mockUser);
            (0, chai_1.expect)(stubs.setUserAvatar.called).to.be.false;
        }));
        it('should not set avatar if no avatar suggestions are available', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { _id: userId, username: null };
            stubs.validateUsername.returns(true);
            stubs.Users.findOneById.resolves(mockUser);
            stubs.checkUsernameAvailability.resolves(true);
            stubs.settings.get.withArgs('Accounts_SetDefaultAvatar').returns(true);
            stubs.getAvatarSuggestionForUser.resolves({});
            yield _setUsername(userId, username, mockUser);
            (0, chai_1.expect)(stubs.setUserAvatar.called).to.be.false;
        }));
        it('should add user to room if inviteToken is present', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { _id: userId, username: null, inviteToken: 'invite token' };
            stubs.validateUsername.returns(true);
            stubs.Users.findOneById.resolves(mockUser);
            stubs.checkUsernameAvailability.resolves(true);
            stubs.settings.get.withArgs('Accounts_SetDefaultAvatar').returns(true);
            stubs.getAvatarSuggestionForUser.resolves({ gravatar: { blob: 'blobData', contentType: 'image/png' } });
            stubs.Invites.findOneById.resolves({ rid: 'room id' });
            yield _setUsername(userId, username, mockUser);
            (0, chai_1.expect)(stubs.addUserToRoom.calledOnceWith('room id', mockUser)).to.be.true;
        }));
    });
});
