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
// Create stubs for dependencies
const stubs = {
    findOneUserById: sinon_1.default.stub(),
    updateUsernameAndMessageOfMentionByIdAndOldUsername: sinon_1.default.stub(),
    updateUsernameOfEditByUserId: sinon_1.default.stub(),
    updateAllUsernamesByUserId: sinon_1.default.stub(),
    updateDirectNameAndFnameByName: sinon_1.default.stub(),
    updateUserReferences: sinon_1.default.stub(),
    setUsername: sinon_1.default.stub(),
    setRealName: sinon_1.default.stub(),
    validateName: sinon_1.default.stub(),
    FileUpload: sinon_1.default.stub(),
};
const { saveUserIdentity } = proxyquire_1.default.noCallThru().load('../../../../app/lib/server/functions/saveUserIdentity', {
    '@rocket.chat/models': {
        Users: {
            findOneById: stubs.findOneUserById,
        },
        Messages: {
            updateUsernameAndMessageOfMentionByIdAndOldUsername: stubs.updateUsernameAndMessageOfMentionByIdAndOldUsername,
            updateUsernameOfEditByUserId: stubs.updateUsernameOfEditByUserId,
            updateAllUsernamesByUserId: stubs.updateAllUsernamesByUserId,
        },
        Subscriptions: {
            updateDirectNameAndFnameByName: stubs.updateDirectNameAndFnameByName,
        },
        VideoConference: {
            updateUserReferences: stubs.updateUserReferences,
        },
    },
    'meteor/meteor': {
        'Meteor': sinon_1.default.stub(),
        '@global': true,
    },
    '../../../../app/file-upload/server': {
        FileUpload: stubs.FileUpload,
    },
    '../../../../app/lib/server/functions/setRealName': {
        _setRealName: stubs.setRealName,
    },
    '../../../../app/lib/server/functions/setUsername': {
        _setUsername: stubs.setUsername,
    },
    '../../../../app/lib/server/functions/updateGroupDMsName': {
        updateGroupDMsName: sinon_1.default.stub(),
    },
    '../../../../app/lib/server/functions/validateName': {
        validateName: stubs.validateName,
    },
});
describe('Users - saveUserIdentity', () => {
    beforeEach(() => {
        // Reset stubs before each test
        Object.values(stubs).forEach((stub) => stub.reset());
    });
    it('should return false if _id is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield saveUserIdentity({ _id: undefined });
        (0, chai_1.expect)(stubs.findOneUserById.called).to.be.false;
        (0, chai_1.expect)(result).to.be.false;
    }));
    it('should return false if user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        stubs.findOneUserById.returns(undefined);
        const result = yield saveUserIdentity({ _id: 'valid_id' });
        (0, chai_1.expect)(stubs.findOneUserById.calledWith('valid_id')).to.be.true;
        (0, chai_1.expect)(result).to.be.false;
    }));
    it('should return false if username is not allowed', () => __awaiter(void 0, void 0, void 0, function* () {
        stubs.findOneUserById.returns({ username: 'oldUsername' });
        stubs.validateName.returns(false);
        const result = yield saveUserIdentity({ _id: 'valid_id', username: 'admin' });
        (0, chai_1.expect)(stubs.validateName.calledWith('admin')).to.be.true;
        (0, chai_1.expect)(result).to.be.false;
    }));
    it('should return false if username is invalid or unavailable', () => __awaiter(void 0, void 0, void 0, function* () {
        stubs.findOneUserById.returns({ username: 'oldUsername' });
        stubs.validateName.returns(true);
        stubs.setUsername.returns(false);
        const result = yield saveUserIdentity({ _id: 'valid_id', username: 'invalidUsername' });
        (0, chai_1.expect)(stubs.validateName.calledWith('invalidUsername')).to.be.true;
        (0, chai_1.expect)(stubs.setUsername.calledWith('valid_id', 'invalidUsername', { username: 'oldUsername' })).to.be.true;
        (0, chai_1.expect)(result).to.be.false;
    }));
    it("should not update the username if it's not changed", () => __awaiter(void 0, void 0, void 0, function* () {
        stubs.findOneUserById.returns({ username: 'oldUsername', name: 'oldName' });
        stubs.validateName.returns(true);
        stubs.setUsername.returns(true);
        yield saveUserIdentity({ _id: 'valid_id', username: 'oldUsername', name: 'oldName' });
        (0, chai_1.expect)(stubs.validateName.called).to.be.false;
        (0, chai_1.expect)(stubs.setUsername.called).to.be.false;
        (0, chai_1.expect)(stubs.updateUsernameOfEditByUserId.called).to.be.false;
        (0, chai_1.expect)(stubs.updateAllUsernamesByUserId.called).to.be.false;
        (0, chai_1.expect)(stubs.updateUsernameAndMessageOfMentionByIdAndOldUsername.called).to.be.false;
        (0, chai_1.expect)(stubs.updateDirectNameAndFnameByName.called).to.be.false;
        (0, chai_1.expect)(stubs.updateUserReferences.called).to.be.false;
    }));
    it('should return false if _setName fails', () => __awaiter(void 0, void 0, void 0, function* () {
        stubs.findOneUserById.returns({ name: 'oldName' });
        stubs.setRealName.returns(false);
        const result = yield saveUserIdentity({ _id: 'valid_id', name: 'invalidName' });
        (0, chai_1.expect)(stubs.setRealName.calledWith('valid_id', 'invalidName', { name: 'oldName' })).to.be.true;
        (0, chai_1.expect)(result).to.be.false;
    }));
    it('should update Subscriptions and VideoConference if name changes', () => __awaiter(void 0, void 0, void 0, function* () {
        stubs.findOneUserById.returns({ name: 'oldName', username: 'oldUsername' });
        stubs.setRealName.returns(true);
        const result = yield saveUserIdentity({ _id: 'valid_id', name: 'name', username: 'oldUsername' });
        (0, chai_1.expect)(stubs.setUsername.called).to.be.false;
        (0, chai_1.expect)(stubs.setRealName.called).to.be.true;
        (0, chai_1.expect)(stubs.updateUsernameOfEditByUserId.called).to.be.false;
        (0, chai_1.expect)(stubs.updateDirectNameAndFnameByName.called).to.be.true;
        (0, chai_1.expect)(stubs.updateUserReferences.called).to.be.true;
        (0, chai_1.expect)(result).to.be.true;
    }));
});
