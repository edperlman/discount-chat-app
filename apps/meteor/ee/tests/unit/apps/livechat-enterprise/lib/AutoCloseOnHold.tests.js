"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const chai_1 = __importStar(require("chai"));
const chai_datetime_1 = __importDefault(require("chai-datetime"));
const mocha_1 = require("mocha");
const moment_1 = __importDefault(require("moment"));
const proxyquire_1 = __importDefault(require("proxyquire"));
const sinon_1 = __importDefault(require("sinon"));
chai_1.default.use(chai_datetime_1.default);
const mockAgendaConstructor = sinon_1.default.stub();
const mockAgendaStart = sinon_1.default.stub();
const mockAgendaScheduler = sinon_1.default.stub();
const mockAgendaCancel = sinon_1.default.stub();
const mockAgendaDefine = sinon_1.default.stub();
const mockLivechatCloseRoom = sinon_1.default.stub();
const mockMeteorStartup = sinon_1.default.stub();
const mockLivechatRooms = {
    findOneById: sinon_1.default.stub(),
};
const mockUsers = {
    findOneById: sinon_1.default.stub(),
};
class MockAgendaClass {
    constructor(opts) {
        mockAgendaConstructor(opts);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            return mockAgendaStart();
        });
    }
    schedule(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return mockAgendaScheduler(...args);
        });
    }
    cancel(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return mockAgendaCancel(...args);
        });
    }
    define(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return mockAgendaDefine(...args);
        });
    }
}
const infoStub = sinon_1.default.stub();
const debugStub = sinon_1.default.stub();
const mockLogger = {
    section: sinon_1.default.stub().returns({
        info: infoStub,
        debug: debugStub,
    }),
};
const mocks = {
    '@rocket.chat/agenda': { Agenda: MockAgendaClass },
    'meteor/meteor': { Meteor: { startup: mockMeteorStartup } },
    'meteor/mongo': {
        MongoInternals: {
            defaultRemoteCollectionDriver: () => {
                return {
                    mongo: { client: { db: sinon_1.default.stub() } },
                };
            },
        },
    },
    '../../../../../app/livechat/server/lib/LivechatTyped': { Livechat: { closeRoom: mockLivechatCloseRoom } },
    './logger': { schedulerLogger: mockLogger },
    '@rocket.chat/models': {
        LivechatRooms: mockLivechatRooms,
        Users: mockUsers,
    },
};
const { AutoCloseOnHoldSchedulerClass } = proxyquire_1.default
    .noCallThru()
    .load('../../../../../app/livechat-enterprise/server/lib/AutoCloseOnHoldScheduler', mocks);
(0, mocha_1.describe)('AutoCloseOnHoldScheduler', () => {
    (0, mocha_1.beforeEach)(() => {
        mockMeteorStartup.resetHistory();
    });
    (0, mocha_1.it)('should call logger.section upon instantiating', () => {
        (0, chai_1.expect)(mockLogger.section.called).to.be.true;
    });
    (0, mocha_1.describe)('init', () => {
        (0, mocha_1.beforeEach)(() => {
            mockAgendaStart.resetHistory();
            mockAgendaScheduler.resetHistory();
        });
        (0, mocha_1.it)('should do nothing if scheduler is already running', () => __awaiter(void 0, void 0, void 0, function* () {
            const scheduler = new AutoCloseOnHoldSchedulerClass();
            scheduler.running = true;
            yield scheduler.init();
            (0, chai_1.expect)(mockAgendaScheduler.called).to.be.false;
        }));
        (0, mocha_1.it)('should succesfully init the scheduler', () => __awaiter(void 0, void 0, void 0, function* () {
            const scheduler = new AutoCloseOnHoldSchedulerClass();
            yield scheduler.init();
            (0, chai_1.expect)(mockAgendaStart.calledOnce).to.be.true;
            (0, chai_1.expect)(scheduler.running).to.be.true;
            (0, chai_1.expect)(infoStub.calledWith('Service started')).to.be.true;
        }));
    });
    (0, mocha_1.describe)('scheduleRoom', () => {
        (0, mocha_1.beforeEach)(() => {
            mockAgendaCancel.resetHistory();
            mockAgendaDefine.resetHistory();
        });
        (0, mocha_1.it)('should fail if scheduler has not been init', () => __awaiter(void 0, void 0, void 0, function* () {
            const scheduler = new AutoCloseOnHoldSchedulerClass();
            try {
                yield scheduler.scheduleRoom('roomId', 5, 'test comment');
            }
            catch (e) {
                (0, chai_1.expect)(e.message).to.equal('AutoCloseOnHoldScheduler is not running');
            }
        }));
        (0, mocha_1.it)('should schedule a room', () => __awaiter(void 0, void 0, void 0, function* () {
            const scheduler = new AutoCloseOnHoldSchedulerClass();
            yield scheduler.init();
            yield scheduler.scheduleRoom('roomId', 5, 'test comment');
            const myScheduleTime = (0, moment_1.default)(new Date()).add(5, 's').toDate();
            (0, chai_1.expect)(mockAgendaCancel.calledBefore(mockAgendaDefine)).to.be.true;
            (0, chai_1.expect)(mockAgendaCancel.calledWith({ name: 'omnichannel_auto_close_on_hold_scheduler-roomId' }));
            (0, chai_1.expect)(mockAgendaDefine.calledWithMatch('omnichannel_auto_close_on_hold_scheduler-roomId'));
            const funcScheduleTime = mockAgendaScheduler.getCall(0).firstArg;
            (0, chai_1.expect)(funcScheduleTime).to.be.closeToTime(myScheduleTime, 5);
            (0, chai_1.expect)(mockAgendaScheduler.calledWithMatch('omnichannel_auto_close_on_hold_scheduler-roomId'));
        }));
    });
    (0, mocha_1.describe)('unscheduleRoom', () => {
        (0, mocha_1.beforeEach)(() => {
            mockAgendaCancel.resetHistory();
        });
        (0, mocha_1.it)('should fail if scheduler has not been init', () => __awaiter(void 0, void 0, void 0, function* () {
            const scheduler = new AutoCloseOnHoldSchedulerClass();
            try {
                yield scheduler.unscheduleRoom('roomId');
            }
            catch (e) {
                (0, chai_1.expect)(e.message).to.equal('AutoCloseOnHoldScheduler is not running');
            }
        }));
        (0, mocha_1.it)('should call .cancel to unschedule a room', () => __awaiter(void 0, void 0, void 0, function* () {
            const scheduler = new AutoCloseOnHoldSchedulerClass();
            yield scheduler.init();
            yield scheduler.unscheduleRoom('roomId');
            (0, chai_1.expect)(mockAgendaCancel.calledWith({ name: 'omnichannel_auto_close_on_hold_scheduler-roomId' }));
        }));
    });
    (0, mocha_1.describe)('executeJob', () => {
        (0, mocha_1.beforeEach)(() => {
            mockLivechatCloseRoom.resetHistory();
            mockLivechatRooms.findOneById.reset();
            mockUsers.findOneById.reset();
        });
        (0, mocha_1.it)('should throw if roomId is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const scheduler = new AutoCloseOnHoldSchedulerClass();
            mockLivechatRooms.findOneById.returns(null);
            mockUsers.findOneById.returns({ _id: 'rocket.cat' });
            try {
                yield scheduler.executeJob({ attrs: { data: { roomId: 'roomId', comment: 'comment' } } });
            }
            catch (e) {
                (0, chai_1.expect)(e.message).to.be.equal('Unable to process AutoCloseOnHoldScheduler job because room or user not found for roomId: roomId and userId: rocket.cat');
            }
        }));
        (0, mocha_1.it)('should throw if user returned from scheduleUser is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const scheduler = new AutoCloseOnHoldSchedulerClass();
            mockLivechatRooms.findOneById.returns({ _id: 'me' });
            mockUsers.findOneById.returns(null);
            try {
                yield scheduler.executeJob({ attrs: { data: { roomId: 'roomId', comment: 'comment' } } });
            }
            catch (e) {
                (0, chai_1.expect)(e.message).to.be.equal('Scheduler user not found');
            }
        }));
        (0, mocha_1.it)('should call Livechat.closeRoom if all data is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            const scheduler = new AutoCloseOnHoldSchedulerClass();
            mockLivechatRooms.findOneById.returns({ _id: 'me' });
            mockUsers.findOneById.returns({ _id: 'rocket.cat' });
            yield scheduler.executeJob({ attrs: { data: { roomId: 'roomId', comment: 'comment' } } });
            (0, chai_1.expect)(mockLivechatCloseRoom.calledWithMatch({ room: { _id: 'me' }, user: { _id: 'rocket.cat' }, comment: 'comment' }));
        }));
    });
    (0, mocha_1.describe)('getSchedulerUser', () => {
        (0, mocha_1.beforeEach)(() => {
            mockUsers.findOneById.reset();
        });
        (0, mocha_1.it)('should do nothing when schedulerUser is already set', () => __awaiter(void 0, void 0, void 0, function* () {
            const scheduler = new AutoCloseOnHoldSchedulerClass();
            scheduler.schedulerUser = { _id: 'me' };
            const user = yield scheduler.getSchedulerUser();
            (0, chai_1.expect)(user).to.be.equal(scheduler.schedulerUser);
        }));
        (0, mocha_1.it)('should fail when rocket.cat does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const scheduler = new AutoCloseOnHoldSchedulerClass();
            mockUsers.findOneById.returns(null);
            try {
                yield scheduler.getSchedulerUser();
            }
            catch (e) {
                (0, chai_1.expect)(e.message).to.be.equal('Scheduler user not found');
            }
        }));
        (0, mocha_1.it)('should return rocket.cat', () => __awaiter(void 0, void 0, void 0, function* () {
            const scheduler = new AutoCloseOnHoldSchedulerClass();
            mockUsers.findOneById.returns({ _id: 'rocket.cat' });
            const u = yield scheduler.getSchedulerUser();
            (0, chai_1.expect)(u).to.be.an('object').with.property('_id', 'rocket.cat');
        }));
    });
});
