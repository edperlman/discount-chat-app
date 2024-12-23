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
    Users: {
        findOneAgentById: sinon_1.default.stub(),
    },
};
const { validateContactManager } = proxyquire_1.default.noCallThru().load('./validateContactManager', {
    '@rocket.chat/models': modelsMock,
});
describe('validateContactManager', () => {
    beforeEach(() => {
        modelsMock.Users.findOneAgentById.reset();
    });
    it('should throw an error if the user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        modelsMock.Users.findOneAgentById.resolves(undefined);
        yield (0, chai_1.expect)(validateContactManager('any_id')).to.be.rejectedWith('error-contact-manager-not-found');
    }));
    it('should not throw an error if the user has the "livechat-agent" role', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = { _id: 'userId' };
        modelsMock.Users.findOneAgentById.resolves(user);
        yield (0, chai_1.expect)(validateContactManager('userId')).to.not.be.rejected;
        (0, chai_1.expect)(modelsMock.Users.findOneAgentById.getCall(0).firstArg).to.be.equal('userId');
    }));
});
