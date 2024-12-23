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
const modelsMock = {
    'Users': {
        findOneAgentById: sinon_1.default.stub(),
        findOneByUsername: sinon_1.default.stub(),
    },
    'LivechatContacts': {
        findOneById: sinon_1.default.stub(),
        insertOne: sinon_1.default.stub(),
        upsertContact: sinon_1.default.stub(),
        updateContact: sinon_1.default.stub(),
        findContactMatchingVisitor: sinon_1.default.stub(),
        findOneByVisitorId: sinon_1.default.stub(),
    },
    'LivechatRooms': {
        findNewestByVisitorIdOrToken: sinon_1.default.stub(),
        setContactIdByVisitorIdOrToken: sinon_1.default.stub(),
        findByVisitorId: sinon_1.default.stub(),
    },
    'LivechatVisitors': {
        findOneById: sinon_1.default.stub(),
        updateById: sinon_1.default.stub(),
        updateOne: sinon_1.default.stub(),
        getVisitorByToken: sinon_1.default.stub(),
        findOneGuestByEmailAddress: sinon_1.default.stub(),
    },
    'LivechatCustomField': {
        findByScope: sinon_1.default.stub(),
    },
    '@global': true,
};
const { registerContact } = proxyquire_1.default.noCallThru().load('./registerContact', {
    'meteor/meteor': sinon_1.default.stub(),
    '@rocket.chat/models': modelsMock,
    '@rocket.chat/tools': { wrapExceptions: sinon_1.default.stub() },
    './Helper': { validateEmail: sinon_1.default.stub() },
    './LivechatTyped': {
        Livechat: {
            logger: {
                debug: sinon_1.default.stub(),
            },
        },
    },
});
describe('registerContact', () => {
    beforeEach(() => {
        modelsMock.Users.findOneByUsername.reset();
        modelsMock.LivechatVisitors.getVisitorByToken.reset();
        modelsMock.LivechatVisitors.updateOne.reset();
        modelsMock.LivechatVisitors.findOneGuestByEmailAddress.reset();
        modelsMock.LivechatCustomField.findByScope.reset();
        modelsMock.LivechatRooms.findByVisitorId.reset();
    });
    it(`should throw an error if there's no token`, () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.Users.findOneByUsername.returns(undefined);
        yield (0, chai_1.expect)(registerContact({
            email: 'test@test.com',
            username: 'username',
            name: 'Name',
            contactManager: {
                username: 'unknown',
            },
        })).to.eventually.be.rejectedWith('error-invalid-contact-data');
    }));
    it(`should throw an error if the token is not a string`, () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.Users.findOneByUsername.returns(undefined);
        yield (0, chai_1.expect)(registerContact({
            token: 15,
            email: 'test@test.com',
            username: 'username',
            name: 'Name',
            contactManager: {
                username: 'unknown',
            },
        })).to.eventually.be.rejectedWith('error-invalid-contact-data');
    }));
    it(`should throw an error if there's an invalid manager username`, () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.Users.findOneByUsername.returns(undefined);
        yield (0, chai_1.expect)(registerContact({
            token: 'token',
            email: 'test@test.com',
            username: 'username',
            name: 'Name',
            contactManager: {
                username: 'unknown',
            },
        })).to.eventually.be.rejectedWith('error-contact-manager-not-found');
    }));
    it(`should throw an error if the manager username does not belong to a livechat agent`, () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.Users.findOneByUsername.returns({ roles: ['user'] });
        yield (0, chai_1.expect)(registerContact({
            token: 'token',
            email: 'test@test.com',
            username: 'username',
            name: 'Name',
            contactManager: {
                username: 'username',
            },
        })).to.eventually.be.rejectedWith('error-invalid-contact-manager');
    }));
    it('should register a contact when passing valid data', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.LivechatVisitors.getVisitorByToken.returns({ _id: 'visitor1' });
        modelsMock.LivechatCustomField.findByScope.returns({ toArray: () => [] });
        modelsMock.LivechatRooms.findByVisitorId.returns({ toArray: () => [] });
        modelsMock.LivechatVisitors.updateOne.returns(undefined);
        yield (0, chai_1.expect)(registerContact({
            token: 'token',
            email: 'test@test.com',
            username: 'username',
            name: 'Name',
        })).to.eventually.be.equal('visitor1');
    }));
});
