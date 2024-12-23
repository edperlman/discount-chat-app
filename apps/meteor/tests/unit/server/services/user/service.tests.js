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
const models_1 = require("@rocket.chat/models");
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const BaseRaw_1 = require("../../../../../server/models/raw/BaseRaw");
const maxTokens = {
    getMaxLoginTokens: () => 2,
};
const { UserService } = proxyquire_1.default.noCallThru().load('../../../../../server/services/user/service', {
    '../../lib/getMaxLoginTokens': maxTokens,
});
class UsersModel extends BaseRaw_1.BaseRaw {
    findAllResumeTokensByUserId() {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    removeOlderResumeTokensByUserId(_uid, _when) {
        return __awaiter(this, void 0, void 0, function* () {
            // no op
        });
    }
}
const usersModel = new UsersModel({ collection: () => ({}) }, 'user');
(0, mocha_1.describe)('User service', () => {
    (0, mocha_1.before)(() => {
        (0, models_1.registerModel)('IUsersModel', usersModel);
    });
    (0, mocha_1.afterEach)(() => sinon_1.default.restore());
    (0, mocha_1.it)('should do nothing if user has less login tokens than the limit', () => __awaiter(void 0, void 0, void 0, function* () {
        const service = new UserService();
        sinon_1.default.replace(usersModel, 'findAllResumeTokensByUserId', sinon_1.default.fake.returns(Promise.resolve([{ tokens: [{ when: new Date() }] }])));
        const updateFake = sinon_1.default.replace(usersModel, 'removeOlderResumeTokensByUserId', sinon_1.default.fake());
        const result = yield service.ensureLoginTokensLimit('uid');
        (0, chai_1.expect)(result).to.be.undefined;
        (0, chai_1.expect)(updateFake.callCount).to.be.equal(0);
    }));
    (0, mocha_1.it)('should remove the oldest tokens if over the limit', () => __awaiter(void 0, void 0, void 0, function* () {
        const service = new UserService();
        const firstOld = new Date('2023-01-03');
        // the query return the tokens in order so we should do the same here
        const tokens = [
            { when: new Date('2023-01-01') },
            { when: new Date('2023-01-02') },
            { when: firstOld },
            { when: new Date('2023-01-04') },
        ];
        sinon_1.default.replace(usersModel, 'findAllResumeTokensByUserId', sinon_1.default.fake.returns(Promise.resolve([{ tokens }])));
        const updateFake = sinon_1.default.replace(usersModel, 'removeOlderResumeTokensByUserId', sinon_1.default.fake());
        const result = yield service.ensureLoginTokensLimit('uid');
        (0, chai_1.expect)(result).to.be.undefined;
        (0, chai_1.expect)(updateFake.callCount).to.be.equal(1);
        (0, chai_1.expect)(updateFake.lastCall.lastArg).to.be.equal(firstOld);
    }));
});
