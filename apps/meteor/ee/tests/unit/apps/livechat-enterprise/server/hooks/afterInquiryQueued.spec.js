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
const moment_1 = __importDefault(require("moment"));
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const settingStub = {
    watch: sinon_1.default.stub(),
    get: sinon_1.default.stub(),
};
const callbackStub = {
    add: sinon_1.default.stub(),
    remove: sinon_1.default.stub(),
    priority: { HIGH: 'high' },
};
const queueMonitorStub = {
    scheduleInquiry: sinon_1.default.stub(),
};
const { afterInquiryQueued } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../../app/livechat-enterprise/server/hooks/afterInquiryQueued.ts', {
    '../../../../../app/settings/server': {
        settings: settingStub,
    },
    '../../../../../lib/callbacks': {
        callbacks: callbackStub,
    },
    '../lib/QueueInactivityMonitor': {
        OmnichannelQueueInactivityMonitor: queueMonitorStub,
    },
    '../lib/logger': {
        cbLogger: { debug: sinon_1.default.stub() },
    },
});
(0, mocha_1.describe)('hooks/afterInquiryQueued', () => {
    beforeEach(() => {
        callbackStub.add.resetHistory();
        callbackStub.remove.resetHistory();
        queueMonitorStub.scheduleInquiry.resetHistory();
        settingStub.get.resetHistory();
    });
    (0, mocha_1.it)('should call settings.watch at first', () => {
        (0, chai_1.expect)(settingStub.watch.callCount).to.be.equal(1);
    });
    (0, mocha_1.it)('should call the callback on settings.watch with proper values', () => {
        const func = settingStub.watch.getCall(0).args[1];
        func(1);
        (0, chai_1.expect)(callbackStub.add.callCount).to.be.equal(1);
        func(2);
        (0, chai_1.expect)(callbackStub.add.callCount).to.be.equal(2);
        func(0);
        (0, chai_1.expect)(callbackStub.remove.callCount).to.be.equal(1);
        func(-1);
        (0, chai_1.expect)(callbackStub.remove.callCount).to.be.equal(2);
        func(3);
        (0, chai_1.expect)(callbackStub.add.callCount).to.be.equal(3);
    });
    (0, mocha_1.it)('should return undefined if no inquiry is passed, or if inquiry doesnt have valid properties', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, chai_1.expect)(yield afterInquiryQueued(null)).to.be.equal(undefined);
        (0, chai_1.expect)(yield afterInquiryQueued({})).to.be.equal(undefined);
        (0, chai_1.expect)(yield afterInquiryQueued({ _id: 'invalid' })).to.be.equal(undefined);
        (0, chai_1.expect)(yield afterInquiryQueued({ _updatedAt: new Date() }));
        (0, chai_1.expect)(yield afterInquiryQueued({ _updatedAt: null, _id: 'afsd34asdX' })).to.be.equal(undefined);
    }));
    (0, mocha_1.it)('should do nothing if timer is set to 0 or less', () => __awaiter(void 0, void 0, void 0, function* () {
        const inquiry = {
            _id: 'afsd34asdX',
            _updatedAt: new Date(),
        };
        settingStub.get.returns(0);
        yield afterInquiryQueued(inquiry);
        (0, chai_1.expect)(queueMonitorStub.scheduleInquiry.callCount).to.be.equal(0);
        settingStub.get.returns(-1);
        yield afterInquiryQueued(inquiry);
        (0, chai_1.expect)(queueMonitorStub.scheduleInquiry.callCount).to.be.equal(0);
    }));
    (0, mocha_1.it)('should call .scheduleInquiry with proper data', () => __awaiter(void 0, void 0, void 0, function* () {
        const inquiry = {
            _id: 'afsd34asdX',
            _updatedAt: new Date(),
        };
        settingStub.get.returns(1);
        yield afterInquiryQueued(inquiry);
        const newQueueTime = (0, moment_1.default)(inquiry._updatedAt).add(1, 'minutes');
        (0, chai_1.expect)(queueMonitorStub.scheduleInquiry.calledWith(inquiry._id, new Date(newQueueTime.format()))).to.be.true;
    }));
    (0, mocha_1.it)('should call .scheduleInquiry with proper data when more than 1 min is passed as param', () => __awaiter(void 0, void 0, void 0, function* () {
        const inquiry = {
            _id: 'afv34avzx',
            _updatedAt: new Date(),
        };
        settingStub.get.returns(3);
        yield afterInquiryQueued(inquiry);
        const newQueueTime = (0, moment_1.default)(inquiry._updatedAt).add(3, 'minutes');
        (0, chai_1.expect)(queueMonitorStub.scheduleInquiry.calledWith(inquiry._id, new Date(newQueueTime.format()))).to.be.true;
    }));
});
