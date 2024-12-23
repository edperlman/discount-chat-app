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
/* eslint-disable @typescript-eslint/no-empty-function */
const chai_1 = require("chai");
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
const formatStub = sinon_1.default.stub().returns('00:00');
const isSameStub = sinon_1.default.stub().returns(true);
const isDSTStub = sinon_1.default.stub().returns(true);
const momentStub = sinon_1.default.stub().returns({
    utc: () => ({
        tz: () => ({
            format: formatStub,
            isSame: isSameStub,
            isDST: isDSTStub,
        }),
    }),
});
const findActiveBusinessHoursStub = sinon_1.default.stub().returns([]);
const LivechatBusinessHoursStub = {
    findActiveBusinessHours: findActiveBusinessHoursStub,
};
const saveBusinessHourStub = sinon_1.default.stub();
const loggerStub = sinon_1.default.stub();
const { BusinessHourManager } = proxyquire_1.default.noCallThru().load('../../../../../../app/livechat/server/business-hour/BusinessHourManager', {
    '../../../settings/server': {},
    '../../../../lib/callbacks': {},
    '../../../../ee/app/livechat-enterprise/server/business-hour/Helper': {},
    './AbstractBusinessHour': {},
    'moment-timezone': momentStub,
    '@rocket.chat/models': {
        LivechatBusinessHours: LivechatBusinessHoursStub,
    },
    '../lib/logger': {
        businessHourLogger: {
            error: loggerStub,
        },
    },
});
const cronAddStub = sinon_1.default.stub();
const cronRemoveStub = sinon_1.default.stub();
describe('[OC] BusinessHourManager', () => {
    afterEach(() => sinon_1.default.restore());
    describe('hasDaylightSavingTimeChanged()', () => {
        const manager = new BusinessHourManager({});
        it('should return false if the provided timezone is equal to the current one (No changes in the timezone)', () => {
            formatStub.returns('00:00');
            (0, chai_1.expect)(manager.hasDaylightSavingTimeChanged({ name: 'test', utc: '00:00' })).to.be.false;
        });
        it('should return false if the provided timezone is different to the current one, the current time is in DST but there is no difference between times (current, stored)', () => {
            isDSTStub.returns(true);
            formatStub.returns('01:00');
            isSameStub.returns(true);
            (0, chai_1.expect)(manager.hasDaylightSavingTimeChanged({ name: 'test', utc: '00:00' })).to.be.false;
        });
        it('should return false if the provided timezone is different to the current one, the current time is NOT in DST but there is no difference between times (current, stored)', () => {
            isDSTStub.returns(false);
            formatStub.returns('01:00');
            isSameStub.returns(true);
            (0, chai_1.expect)(manager.hasDaylightSavingTimeChanged({ name: 'test', utc: '00:00' })).to.be.false;
        });
        it('should return true if the provided timezone is different to the current one, the current time is in DST and the current time is different than the stored one', () => {
            isDSTStub.returns(true);
            formatStub.returns('01:00');
            isSameStub.returns(false);
            (0, chai_1.expect)(manager.hasDaylightSavingTimeChanged({ name: 'test', utc: '00:00' })).to.be.true;
        });
        it('should return true if the provided timezone is different to the current one, the current time is NOT in DST and the current time is different than the stored one', () => {
            isDSTStub.returns(false);
            formatStub.returns('01:00');
            isSameStub.returns(false);
            (0, chai_1.expect)(manager.hasDaylightSavingTimeChanged({ name: 'test', utc: '00:00' })).to.be.true;
        });
    });
    describe('startDaylightSavingTimeVerifier()', () => {
        const cronStub = {
            add: cronAddStub,
            remove: cronRemoveStub,
        };
        const manager = new BusinessHourManager(cronStub);
        manager.registerBusinessHourBehavior({
            onStartBusinessHours: () => { },
            onDisableBusinessHours: () => { },
        });
        afterEach(() => {
            sinon_1.default.restore();
            loggerStub.resetHistory();
        });
        it('should call the verifier when the manager starts', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(manager, 'createCronJobsForWorkHours');
            sinon_1.default.stub(manager, 'setupCallbacks');
            sinon_1.default.stub(manager, 'cleanupDisabledDepartmentReferences');
            sinon_1.default.stub(manager, 'startDaylightSavingTimeVerifier');
            yield manager.startManager();
            (0, chai_1.expect)(manager.startDaylightSavingTimeVerifier.called).to.be.true;
        }));
        it('should register the cron job for the DST verifier when the manager starts', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(manager, 'createCronJobsForWorkHours');
            sinon_1.default.stub(manager, 'setupCallbacks');
            sinon_1.default.stub(manager, 'cleanupDisabledDepartmentReferences');
            sinon_1.default.stub(manager, 'startDaylightSavingTimeVerifier');
            yield manager.startManager();
            (0, chai_1.expect)(cronAddStub.called).to.be.true;
        }));
        it('should remove the cron job for the DST verifier when the manager stops', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(manager, 'removeCronJobs');
            sinon_1.default.stub(manager, 'clearCronJobsCache');
            sinon_1.default.stub(manager, 'removeCallbacks');
            sinon_1.default.stub(manager, 'startDaylightSavingTimeVerifier');
            yield manager.stopManager();
            (0, chai_1.expect)(cronRemoveStub.called).to.be.true;
        }));
        it('should remove and add back the cron job for the DST verifier when the manager restarts', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(manager, 'createCronJobsForWorkHours');
            sinon_1.default.stub(manager, 'setupCallbacks');
            sinon_1.default.stub(manager, 'cleanupDisabledDepartmentReferences');
            sinon_1.default.stub(manager, 'startDaylightSavingTimeVerifier');
            sinon_1.default.stub(manager, 'removeCronJobs');
            sinon_1.default.stub(manager, 'clearCronJobsCache');
            sinon_1.default.stub(manager, 'removeCallbacks');
            yield manager.restartManager();
            (0, chai_1.expect)(cronRemoveStub.called).to.be.true;
            (0, chai_1.expect)(cronAddStub.called).to.be.true;
        }));
        it('should NOT save business hours when there is no active business hours', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(manager, 'getBusinessHourType').returns({ saveBusinessHour: saveBusinessHourStub });
            findActiveBusinessHoursStub.resolves([]);
            yield manager.startDaylightSavingTimeVerifier();
            (0, chai_1.expect)(saveBusinessHourStub.called).to.be.false;
        }));
        it('should NOT save business hours when there is no timezone with DST changes', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(manager, 'getBusinessHourType').returns({ saveBusinessHour: saveBusinessHourStub });
            sinon_1.default.stub(manager, 'hasDaylightSavingTimeChanged').returns(false);
            findActiveBusinessHoursStub.resolves([{ timezone: 'test' }]);
            yield manager.startDaylightSavingTimeVerifier();
            (0, chai_1.expect)(saveBusinessHourStub.called).to.be.false;
        }));
        it('should save business hours AND recreate the cron jobs for the work hours when there is a timezone with DST changes', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(manager, 'getBusinessHourType').returns({ saveBusinessHour: saveBusinessHourStub });
            sinon_1.default.stub(manager, 'createCronJobsForWorkHours');
            sinon_1.default.stub(manager, 'hasDaylightSavingTimeChanged').returns(true);
            findActiveBusinessHoursStub.resolves([
                { timezone: { name: 'timezoneName' }, workHours: [{ start: { time: 'startTime' }, finish: { time: 'finishTime' } }] },
            ]);
            yield manager.startDaylightSavingTimeVerifier();
            (0, chai_1.expect)(saveBusinessHourStub.calledWith({
                timezone: { name: 'timezoneName' },
                timezoneName: 'timezoneName',
                workHours: [{ start: 'startTime', finish: 'finishTime' }],
            })).to.be.true;
            (0, chai_1.expect)(manager.createCronJobsForWorkHours.called).to.be.true;
        }));
        it('should log any error on the updating process', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(manager, 'getBusinessHourType').returns({ saveBusinessHour: saveBusinessHourStub });
            sinon_1.default.stub(manager, 'createCronJobsForWorkHours');
            sinon_1.default.stub(manager, 'hasDaylightSavingTimeChanged').returns(true);
            findActiveBusinessHoursStub.resolves([
                { timezone: { name: 'timezoneName' }, workHours: [{ start: { time: 'startTime' }, finish: { time: 'finishTime' } }] },
                { timezone: { name: 'timezoneName2' }, workHours: [{ start: { time: 'startTime' }, finish: { time: 'finishTime' } }] },
            ]);
            const error = new Error('update error');
            saveBusinessHourStub.onSecondCall().rejects(error);
            yield manager.startDaylightSavingTimeVerifier();
            (0, chai_1.expect)(loggerStub.calledWith('Failed to update business hours with new timezone', error)).to.be.true;
            (0, chai_1.expect)(manager.createCronJobsForWorkHours.called).to.be.true;
        }));
        it('should NOT throw any error even if the business hour has an invalid type', () => __awaiter(void 0, void 0, void 0, function* () {
            sinon_1.default.stub(manager, 'getBusinessHourType').returns({ saveBusinessHour: saveBusinessHourStub });
            sinon_1.default.stub(manager, 'createCronJobsForWorkHours');
            sinon_1.default.stub(manager, 'hasDaylightSavingTimeChanged').returns(true);
            findActiveBusinessHoursStub.resolves([
                {
                    type: 'invalid',
                    timezone: { name: 'timezoneName' },
                    workHours: [{ start: { time: 'startTime' }, finish: { time: 'finishTime' } }],
                },
            ]);
            yield (0, chai_1.expect)(manager.startDaylightSavingTimeVerifier()).not.to.be.rejected;
            (0, chai_1.expect)(loggerStub.called).to.be.false;
        }));
    });
});
