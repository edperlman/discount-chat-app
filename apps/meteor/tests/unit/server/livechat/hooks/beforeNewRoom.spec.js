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
const callbacks_1 = require("../../../../../lib/callbacks");
const findStub = sinon_1.default.stub();
proxyquire_1.default.noCallThru().load('../../../../../ee/app/livechat-enterprise/server/hooks/beforeNewRoom.ts', {
    'meteor/meteor': {
        Meteor: {
            Error,
        },
    },
    '@rocket.chat/models': {
        OmnichannelServiceLevelAgreements: {
            findOneByIdOrName: findStub,
        },
    },
});
(0, mocha_1.describe)('livechat.beforeRoom', () => {
    (0, mocha_1.beforeEach)(() => findStub.withArgs('high').resolves({ _id: 'high' }).withArgs('invalid').resolves(null));
    (0, mocha_1.it)('should return roomInfo with customFields when provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const roomInfo = { name: 'test' };
        const extraData = { customFields: { test: 'test' } };
        const result = yield callbacks_1.callbacks.run('livechat.beforeRoom', roomInfo, extraData);
        (0, chai_1.expect)(result).to.deep.equal(Object.assign(Object.assign({}, roomInfo), { customFields: extraData.customFields }));
    }));
    (0, mocha_1.it)('should throw an error when provided with an invalid sla', () => __awaiter(void 0, void 0, void 0, function* () {
        const roomInfo = { name: 'test' };
        const extraData = { customFields: { test: 'test' }, sla: 'invalid' };
        yield (0, chai_1.expect)(callbacks_1.callbacks.run('livechat.beforeRoom', roomInfo, extraData)).to.be.rejectedWith(Error, 'error-invalid-sla');
    }));
    (0, mocha_1.it)('should not include field in roomInfo when extraData has field other than customFields, sla', () => __awaiter(void 0, void 0, void 0, function* () {
        const roomInfo = { name: 'test' };
        const extraData = { customFields: { test: 'test' }, sla: 'high' };
        const result = yield callbacks_1.callbacks.run('livechat.beforeRoom', roomInfo, extraData);
        (0, chai_1.expect)(result).to.deep.equal(Object.assign(Object.assign({}, roomInfo), { customFields: extraData.customFields, slaId: 'high' }));
    }));
    (0, mocha_1.it)('should return roomInfo with no customFields when customFields is not an object', () => __awaiter(void 0, void 0, void 0, function* () {
        const roomInfo = { name: 'test' };
        const extraData = { customFields: 'not an object' };
        const result = yield callbacks_1.callbacks.run('livechat.beforeRoom', roomInfo, extraData);
        (0, chai_1.expect)(result).to.deep.equal(Object.assign({}, roomInfo));
    }));
});
