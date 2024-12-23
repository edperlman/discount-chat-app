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
const dispatchAgentDelegated = sinon_1.default.stub();
const getConfig = sinon_1.default.stub();
const delegateInquiry = sinon_1.default.stub();
const libSettings = { getInquirySortMechanismSetting: sinon_1.default.stub().returns('timestamp') };
const settings = {
    get: sinon_1.default.stub(),
};
const queueLogger = {
    info: sinon_1.default.stub(),
    debug: sinon_1.default.stub(),
    error: sinon_1.default.stub(),
};
const mockedInquiry = {
    _id: 'inquiryId',
    rid: 'rid',
    department: 'department1',
    ts: new Date(),
};
const models = {
    LivechatInquiry: {
        unlockAll: sinon_1.default.stub(),
        findNextAndLock: sinon_1.default.stub(),
        getDistinctQueuedDepartments: sinon_1.default.stub(),
        unlockAndQueue: sinon_1.default.stub(),
        unlock: sinon_1.default.stub(),
        removeByRoomId: sinon_1.default.stub(),
        takeInquiry: sinon_1.default.stub(),
    },
    LivechatRooms: {
        findOneById: sinon_1.default.stub(),
    },
};
const license = {
    shouldPreventAction: sinon_1.default.stub(),
};
const { OmnichannelQueue } = proxyquire_1.default.noCallThru().load('../../../../../server/services/omnichannel/queue', {
    '../../../app/livechat/server/lib/Helper': {
        dispatchAgentDelegated,
    },
    '../../../app/livechat/server/lib/RoutingManager': {
        RoutingManager: {
            getConfig,
            delegateInquiry,
        },
    },
    '../../../app/livechat/server/lib/settings': libSettings,
    '../../../app/settings/server': { settings },
    './logger': { queueLogger },
    '@rocket.chat/models': models,
    '@rocket.chat/license': { License: license },
});
(0, mocha_1.describe)('Omnichannel Queue processor', () => {
    (0, mocha_1.describe)('isRunning', () => {
        (0, mocha_1.it)('should return the running status', () => {
            const queue = new OmnichannelQueue();
            (0, chai_1.expect)(queue.isRunning()).to.be.false;
        });
        (0, mocha_1.it)('should return the running status', () => {
            const queue = new OmnichannelQueue();
            queue.running = true;
            (0, chai_1.expect)(queue.isRunning()).to.be.true;
        });
    });
    (0, mocha_1.describe)('delay', () => {
        (0, mocha_1.after)(() => {
            settings.get.reset();
        });
        (0, mocha_1.it)('should return 5000 if setting is not set', () => {
            settings.get.returns(undefined);
            const queue = new OmnichannelQueue();
            (0, chai_1.expect)(queue.delay()).to.be.equal(5000);
        });
        (0, mocha_1.it)('should return the right value if setting has a value above 1', () => {
            settings.get.returns(10);
            const queue = new OmnichannelQueue();
            (0, chai_1.expect)(queue.delay()).to.be.equal(10000);
        });
    });
    (0, mocha_1.describe)('getActiveQueues', () => {
        (0, mocha_1.after)(() => {
            models.LivechatInquiry.getDistinctQueuedDepartments.reset();
        });
        (0, mocha_1.it)('should return [undefined] when there is no other queues', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatInquiry.getDistinctQueuedDepartments.returns([]);
            const queue = new OmnichannelQueue();
            (0, chai_1.expect)(yield queue.getActiveQueues()).to.be.eql([undefined]);
        }));
        (0, mocha_1.it)('should return [undefined, department1] when department1 is an active queue', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatInquiry.getDistinctQueuedDepartments.returns(['department1']);
            const queue = new OmnichannelQueue();
            (0, chai_1.expect)(yield queue.getActiveQueues()).to.be.eql([undefined, 'department1']);
        }));
    });
    (0, mocha_1.describe)('nextQueue', () => {
        (0, mocha_1.after)(() => {
            models.LivechatInquiry.getDistinctQueuedDepartments.reset();
        });
        (0, mocha_1.it)('should return undefined when thats the only queue', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatInquiry.getDistinctQueuedDepartments.returns([]);
            const queue = new OmnichannelQueue();
            queue.getActiveQueues = sinon_1.default.stub().returns([undefined]);
            (0, chai_1.expect)(yield queue.nextQueue()).to.be.undefined;
        }));
        (0, mocha_1.it)('should return undefined, and then the following queue', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatInquiry.getDistinctQueuedDepartments.returns(['department1']);
            const queue = new OmnichannelQueue();
            queue.getActiveQueues = sinon_1.default.stub().returns([undefined, 'department1']);
            (0, chai_1.expect)(yield queue.nextQueue()).to.be.undefined;
            (0, chai_1.expect)(yield queue.nextQueue()).to.be.equal('department1');
        }));
        (0, mocha_1.it)('should not call getActiveQueues if there are still queues to process', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatInquiry.getDistinctQueuedDepartments.returns(['department1']);
            const queue = new OmnichannelQueue();
            queue.queues = ['department1'];
            queue.getActiveQueues = sinon_1.default.stub();
            (0, chai_1.expect)(yield queue.nextQueue()).to.be.equal('department1');
            (0, chai_1.expect)(queue.getActiveQueues.notCalled).to.be.true;
        }));
    });
    (0, mocha_1.describe)('checkQueue', () => {
        let clock;
        (0, mocha_1.beforeEach)(() => {
            models.LivechatInquiry.findNextAndLock.resetHistory();
            models.LivechatInquiry.takeInquiry.resetHistory();
            models.LivechatInquiry.unlockAndQueue.resetHistory();
            models.LivechatInquiry.unlock.resetHistory();
            queueLogger.error.resetHistory();
            queueLogger.info.resetHistory();
            clock = sinon_1.default.useFakeTimers();
        });
        afterEach(() => {
            clock.restore();
        });
        (0, mocha_1.after)(() => {
            models.LivechatInquiry.findNextAndLock.reset();
            models.LivechatInquiry.takeInquiry.reset();
            models.LivechatInquiry.unlockAndQueue.reset();
            models.LivechatInquiry.unlock.reset();
            queueLogger.error.reset();
            queueLogger.info.reset();
            clock.reset();
        });
        (0, mocha_1.it)('should return undefined when the queue is empty', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatInquiry.findNextAndLock.returns(null);
            const queue = new OmnichannelQueue();
            queue.execute = sinon_1.default.stub();
            (0, chai_1.expect)(yield queue.checkQueue()).to.be.undefined;
        }));
        (0, mocha_1.it)('should try to process the inquiry when there is one', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatInquiry.findNextAndLock.returns(mockedInquiry);
            const queue = new OmnichannelQueue();
            queue.processWaitingQueue = sinon_1.default.stub().throws('error');
            queue.execute = sinon_1.default.stub();
            yield queue.checkQueue();
            (0, chai_1.expect)(models.LivechatInquiry.findNextAndLock.calledOnce).to.be.true;
            (0, chai_1.expect)(queue.processWaitingQueue.calledOnce).to.be.true;
        }));
        (0, mocha_1.it)('should call unlockAndRequeue when the inquiry could not be processed', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatInquiry.findNextAndLock.returns(mockedInquiry);
            const queue = new OmnichannelQueue();
            queue.processWaitingQueue = sinon_1.default.stub().returns(false);
            queue.execute = sinon_1.default.stub();
            yield queue.checkQueue();
            (0, chai_1.expect)(queue.processWaitingQueue.calledOnce).to.be.true;
            (0, chai_1.expect)(models.LivechatInquiry.unlockAndQueue.calledOnce).to.be.true;
        }));
        (0, mocha_1.it)('should unlock the inquiry when it was processed succesfully', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatInquiry.findNextAndLock.returns(mockedInquiry);
            const queue = new OmnichannelQueue();
            queue.processWaitingQueue = sinon_1.default.stub().returns(true);
            queue.execute = sinon_1.default.stub();
            yield queue.checkQueue();
            (0, chai_1.expect)(queue.processWaitingQueue.calledOnce).to.be.true;
            (0, chai_1.expect)(models.LivechatInquiry.unlock.calledOnce).to.be.true;
        }));
        (0, mocha_1.it)('should print a log when there was an error processing inquiry', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatInquiry.findNextAndLock.throws('error');
            const queue = new OmnichannelQueue();
            queue.execute = sinon_1.default.stub();
            yield queue.checkQueue();
            (0, chai_1.expect)(queueLogger.error.calledOnce).to.be.true;
        }));
        (0, mocha_1.it)('should call execute after finishing', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatInquiry.findNextAndLock.returns(mockedInquiry);
            const queue = new OmnichannelQueue();
            queue.processWaitingQueue = sinon_1.default.stub().returns(true);
            queue.execute = sinon_1.default.stub();
            queue.delay = sinon_1.default.stub().returns(100);
            yield queue.checkQueue();
            clock.tick(100);
            (0, chai_1.expect)(queue.execute.calledOnce).to.be.true;
            (0, chai_1.expect)(models.LivechatInquiry.unlock.calledOnce).to.be.true;
            (0, chai_1.expect)(queue.execute.calledAfter(models.LivechatInquiry.unlock)).to.be.true;
            (0, chai_1.expect)(queue.execute.calledOnce).to.be.true;
        }));
    });
    (0, mocha_1.describe)('shouldStart', () => {
        (0, mocha_1.beforeEach)(() => {
            settings.get.resetHistory();
            getConfig.resetHistory();
        });
        (0, mocha_1.after)(() => {
            settings.get.reset();
            getConfig.reset();
        });
        (0, mocha_1.it)('should call stop if Livechat is not enabled', () => __awaiter(void 0, void 0, void 0, function* () {
            settings.get.returns(false);
            const queue = new OmnichannelQueue();
            queue.stop = sinon_1.default.stub();
            yield queue.shouldStart();
            (0, chai_1.expect)(queue.stop.calledOnce).to.be.true;
        }));
        (0, mocha_1.it)('should call start if routing algorithm supports auto assignment', () => __awaiter(void 0, void 0, void 0, function* () {
            settings.get.returns(true);
            getConfig.returns({ autoAssignAgent: true });
            const queue = new OmnichannelQueue();
            queue.start = sinon_1.default.stub();
            yield queue.shouldStart();
            (0, chai_1.expect)(queue.start.calledOnce).to.be.true;
            (0, chai_1.expect)(queue.start.calledAfter(getConfig)).to.be.true;
        }));
        (0, mocha_1.it)('should call stop if routing algorithm does not support auto assignment', () => __awaiter(void 0, void 0, void 0, function* () {
            settings.get.returns(true);
            getConfig.returns({ autoAssignAgent: false });
            const queue = new OmnichannelQueue();
            queue.stop = sinon_1.default.stub();
            yield queue.shouldStart();
            (0, chai_1.expect)(queue.stop.calledOnce).to.be.true;
            (0, chai_1.expect)(queue.stop.calledAfter(getConfig)).to.be.true;
        }));
    });
    (0, mocha_1.describe)('reconciliation', () => {
        (0, mocha_1.beforeEach)(() => {
            models.LivechatInquiry.removeByRoomId.resetHistory();
            models.LivechatInquiry.takeInquiry.resetHistory();
        });
        (0, mocha_1.it)('should remove inquiries from rooms that do not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new OmnichannelQueue();
            yield queue.reconciliation('missing', { roomId: 'rid', inquiryId: 'inquiryId' });
            (0, chai_1.expect)(models.LivechatInquiry.removeByRoomId.calledOnce).to.be.true;
        }));
        (0, mocha_1.it)('should take an inquiry if the room was taken', () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new OmnichannelQueue();
            yield queue.reconciliation('taken', { roomId: 'rid', inquiryId: 'inquiryId' });
            (0, chai_1.expect)(models.LivechatInquiry.takeInquiry.calledOnce).to.be.true;
        }));
        (0, mocha_1.it)('should remove inquiries from rooms that were closed', () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new OmnichannelQueue();
            yield queue.reconciliation('closed', { roomId: 'rid', inquiryId: 'inquiryId' });
            (0, chai_1.expect)(models.LivechatInquiry.removeByRoomId.calledOnce).to.be.true;
        }));
        (0, mocha_1.it)('should return true for any other case', () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new OmnichannelQueue();
            (0, chai_1.expect)(yield queue.reconciliation('random', { roomId: 'rid', inquiryId: 'inquiryId' })).to.be.true;
            (0, chai_1.expect)(models.LivechatInquiry.removeByRoomId.notCalled).to.be.true;
            (0, chai_1.expect)(models.LivechatInquiry.takeInquiry.notCalled).to.be.true;
        }));
    });
    (0, mocha_1.describe)('processWaitingQueue', () => {
        let clock;
        (0, mocha_1.beforeEach)(() => {
            models.LivechatRooms.findOneById.reset();
            models.LivechatInquiry.takeInquiry.resetHistory();
            models.LivechatInquiry.removeByRoomId.resetHistory();
            delegateInquiry.resetHistory();
            queueLogger.debug.resetHistory();
            clock = sinon_1.default.useFakeTimers();
        });
        afterEach(() => {
            clock.restore();
        });
        (0, mocha_1.after)(() => {
            models.LivechatRooms.findOneById.reset();
            models.LivechatInquiry.takeInquiry.reset();
            delegateInquiry.reset();
            queueLogger.debug.reset();
            clock.reset();
        });
        (0, mocha_1.it)('should process the public queue when department is undefined', () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new OmnichannelQueue();
            (0, chai_1.expect)(yield queue.processWaitingQueue(undefined, mockedInquiry)).to.be.true;
            (0, chai_1.expect)(queueLogger.debug.calledWith('Processing inquiry inquiryId from queue Public'));
            (0, chai_1.expect)(models.LivechatRooms.findOneById.calledOnce).to.be.true;
        }));
        (0, mocha_1.it)('should call removeInquiry when findOneById returns null', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatRooms.findOneById.returns(null);
            const queue = new OmnichannelQueue();
            (0, chai_1.expect)(yield queue.processWaitingQueue('department1', mockedInquiry)).to.be.true;
            (0, chai_1.expect)(queueLogger.debug.calledWith({
                msg: 'Room from inquiry missing. Removing inquiry',
                roomId: 'rid',
                inquiryId: 'inquiryId',
                step: 'reconciliation',
            })).to.be.true;
            (0, chai_1.expect)(models.LivechatInquiry.removeByRoomId.calledOnce).to.be.true;
        }));
        (0, mocha_1.it)('should call takeInquiry when findOneById returns a room thats already being served', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatRooms.findOneById.returns({ _id: 'rid', servedBy: { some: 'thing' } });
            const queue = new OmnichannelQueue();
            queue.reconciliation = sinon_1.default.stub().returns(true);
            (0, chai_1.expect)(yield queue.processWaitingQueue('department1', mockedInquiry)).to.be.true;
            (0, chai_1.expect)(queue.reconciliation.calledOnce).to.be.true;
        }));
        (0, mocha_1.it)('should call removeInquiry when findOneById returns a room that was closed', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatRooms.findOneById.returns({ _id: 'rid', closedAt: new Date() });
            const queue = new OmnichannelQueue();
            queue.reconciliation = sinon_1.default.stub().returns(true);
            (0, chai_1.expect)(yield queue.processWaitingQueue('department1', mockedInquiry)).to.be.true;
            (0, chai_1.expect)(queue.reconciliation.calledOnce).to.be.true;
        }));
        (0, mocha_1.it)('should call delegateInquiry when prechecks are met and return false if inquiry was not served', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatRooms.findOneById.returns({ _id: 'rid' });
            delegateInquiry.returns({});
            const queue = new OmnichannelQueue();
            (0, chai_1.expect)(yield queue.processWaitingQueue('department1', mockedInquiry)).to.be.false;
            (0, chai_1.expect)(delegateInquiry.calledOnce).to.be.true;
        }));
        (0, mocha_1.it)('should call delegateInquiry and return true if inquiry was served', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatRooms.findOneById.returns({ _id: 'rid' });
            delegateInquiry.returns({ _id: 'rid', servedBy: { _id: 'agentId' } });
            const queue = new OmnichannelQueue();
            (0, chai_1.expect)(yield queue.processWaitingQueue('department1', mockedInquiry)).to.be.true;
            (0, chai_1.expect)(delegateInquiry.calledOnce).to.be.true;
        }));
        (0, mocha_1.it)('should call dispatchAgentDelegated if inquiry was served (after 1s)', () => __awaiter(void 0, void 0, void 0, function* () {
            models.LivechatRooms.findOneById.returns({ _id: 'rid' });
            delegateInquiry.returns({ _id: 'rid', servedBy: { _id: 'agentId' } });
            const queue = new OmnichannelQueue();
            (0, chai_1.expect)(yield queue.processWaitingQueue('department1', mockedInquiry)).to.be.true;
            (0, chai_1.expect)(delegateInquiry.calledOnce).to.be.true;
            clock.tick(1000);
            (0, chai_1.expect)(dispatchAgentDelegated.calledOnce).to.be.true;
        }));
    });
    (0, mocha_1.describe)('execute', () => {
        (0, mocha_1.beforeEach)(() => {
            license.shouldPreventAction.reset();
            queueLogger.debug.reset();
        });
        (0, mocha_1.after)(() => {
            license.shouldPreventAction.reset();
            queueLogger.debug.reset();
        });
        (0, mocha_1.it)('should return undefined if service is not running', () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new OmnichannelQueue();
            queue.running = false;
            (0, chai_1.expect)(yield queue.execute()).to.be.undefined;
        }));
        (0, mocha_1.it)('should return undefined if license is over mac limits', () => __awaiter(void 0, void 0, void 0, function* () {
            license.shouldPreventAction.returns(true);
            const queue = new OmnichannelQueue();
            queue.running = true;
            (0, chai_1.expect)(yield queue.execute()).to.be.undefined;
            (0, chai_1.expect)(license.shouldPreventAction.calledOnce).to.be.true;
            (0, chai_1.expect)(queue.running).to.be.false;
        }));
        (0, mocha_1.it)('should try to process a queue if license is not over mac limits', () => __awaiter(void 0, void 0, void 0, function* () {
            license.shouldPreventAction.returns(false);
            const queue = new OmnichannelQueue();
            queue.running = true;
            queue.nextQueue = sinon_1.default.stub();
            yield queue.execute();
            (0, chai_1.expect)(queue.nextQueue.calledOnce).to.be.true;
            (0, chai_1.expect)(queueLogger.debug.calledWith('Executing queue Public with timeout of 5000')).to.be.true;
        }));
    });
    (0, mocha_1.describe)('start', () => {
        (0, mocha_1.beforeEach)(() => {
            queueLogger.info.resetHistory();
            queueLogger.debug.resetHistory();
        });
        (0, mocha_1.after)(() => {
            queueLogger.info.reset();
            queueLogger.debug.reset();
        });
        (0, mocha_1.it)('should do nothing if queue is already running', () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new OmnichannelQueue();
            queue.running = true;
            queue.execute = sinon_1.default.stub();
            yield queue.start();
            (0, chai_1.expect)(queue.execute.notCalled).to.be.true;
        }));
        (0, mocha_1.it)('should fetch active queues and set running to true', () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new OmnichannelQueue();
            queue.running = false;
            queue.getActiveQueues = sinon_1.default.stub().returns(['department1']);
            queue.execute = sinon_1.default.stub();
            yield queue.start();
            (0, chai_1.expect)(queue.running).to.be.true;
            (0, chai_1.expect)(queue.getActiveQueues.calledOnce).to.be.true;
            (0, chai_1.expect)(queueLogger.info.calledOnce).to.be.true;
            (0, chai_1.expect)(queueLogger.info.calledWith('Service started')).to.be.true;
            (0, chai_1.expect)(queue.execute.calledOnce).to.be.true;
        }));
    });
    (0, mocha_1.describe)('stop', () => {
        (0, mocha_1.beforeEach)(() => {
            models.LivechatInquiry.unlockAll.reset();
            queueLogger.info.resetHistory();
        });
        (0, mocha_1.after)(() => {
            models.LivechatInquiry.unlockAll.reset();
            queueLogger.info.reset();
        });
        (0, mocha_1.it)('should unlock all inquiries and set running to false', () => __awaiter(void 0, void 0, void 0, function* () {
            const queue = new OmnichannelQueue();
            queue.running = true;
            yield queue.stop();
            (0, chai_1.expect)(queue.running).to.be.false;
            (0, chai_1.expect)(models.LivechatInquiry.unlockAll.calledOnce).to.be.true;
            (0, chai_1.expect)(queueLogger.info.calledOnce).to.be.true;
            (0, chai_1.expect)(queueLogger.info.calledWith('Service stopped')).to.be.true;
        }));
    });
});
