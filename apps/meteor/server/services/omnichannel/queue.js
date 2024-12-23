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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmnichannelQueue = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const logger_1 = require("./logger");
const Helper_1 = require("../../../app/livechat/server/lib/Helper");
const RoutingManager_1 = require("../../../app/livechat/server/lib/RoutingManager");
const settings_1 = require("../../../app/livechat/server/lib/settings");
const server_1 = require("../../../app/settings/server");
const DEFAULT_RACE_TIMEOUT = 5000;
class OmnichannelQueue {
    constructor() {
        this.timeoutHandler = null;
        this.running = false;
        this.queues = [];
        this.serviceStarter = new core_services_1.ServiceStarter(() => this._start(), () => this._stop());
    }
    delay() {
        var _a;
        const timeout = (_a = server_1.settings.get('Omnichannel_queue_delay_timeout')) !== null && _a !== void 0 ? _a : 5;
        return timeout < 1 ? DEFAULT_RACE_TIMEOUT : timeout * 1000;
    }
    isRunning() {
        return this.running;
    }
    _start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.running) {
                return;
            }
            const activeQueues = yield this.getActiveQueues();
            logger_1.queueLogger.debug(`Active queues: ${activeQueues.length}`);
            this.running = true;
            logger_1.queueLogger.info('Service started');
            return this.execute();
        });
    }
    _stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.running) {
                return;
            }
            yield models_1.LivechatInquiry.unlockAll();
            this.running = false;
            if (this.timeoutHandler !== null) {
                clearTimeout(this.timeoutHandler);
                this.timeoutHandler = null;
            }
            logger_1.queueLogger.info('Service stopped');
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.serviceStarter.start();
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.serviceStarter.stop();
        });
    }
    getActiveQueues() {
        return __awaiter(this, void 0, void 0, function* () {
            // undefined = public queue(without department)
            return [undefined].concat(yield models_1.LivechatInquiry.getDistinctQueuedDepartments({}));
        });
    }
    nextQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.queues.length) {
                logger_1.queueLogger.debug('No more registered queues. Refreshing');
                this.queues = yield this.getActiveQueues();
            }
            return this.queues.shift();
        });
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.running) {
                logger_1.queueLogger.debug('Queue stopped. Cannot execute');
                return;
            }
            if (yield license_1.License.shouldPreventAction('monthlyActiveContacts', 1)) {
                logger_1.queueLogger.debug('MAC limit reached. Queue wont execute');
                this.running = false;
                return;
            }
            const queue = yield this.nextQueue();
            const queueDelayTimeout = this.delay();
            logger_1.queueLogger.debug(`Executing queue ${queue || 'Public'} with timeout of ${queueDelayTimeout}`);
            void this.checkQueue(queue).catch((e) => {
                logger_1.queueLogger.error(e);
            });
        });
    }
    checkQueue(queue) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.queueLogger.debug(`Processing items for queue ${queue || 'Public'}`);
            try {
                const nextInquiry = yield models_1.LivechatInquiry.findNextAndLock((0, settings_1.getInquirySortMechanismSetting)(), queue);
                if (!nextInquiry) {
                    logger_1.queueLogger.debug(`No more items for queue ${queue || 'Public'}`);
                    return;
                }
                const result = yield this.processWaitingQueue(queue, nextInquiry);
                if (!result) {
                    // Note: this removes the "one-shot" behavior of queue, allowing it to take a conversation again in the future
                    // And sorting them by _updatedAt: -1 will make it so that the oldest inquiries are taken first
                    // preventing us from playing with the same inquiry over and over again
                    logger_1.queueLogger.debug(`Inquiry ${nextInquiry._id} not taken. Unlocking and re-queueing`);
                    const updatedQueue = yield models_1.LivechatInquiry.unlockAndQueue(nextInquiry._id);
                    return updatedQueue;
                }
                logger_1.queueLogger.debug(`Inquiry ${nextInquiry._id} taken successfully. Unlocking`);
                yield models_1.LivechatInquiry.unlock(nextInquiry._id);
                logger_1.queueLogger.debug({
                    msg: 'Inquiry processed',
                    inquiry: nextInquiry._id,
                    queue: queue || 'Public',
                    result,
                });
            }
            catch (e) {
                logger_1.queueLogger.error({
                    msg: 'Error processing queue',
                    queue: queue || 'Public',
                    err: e,
                });
            }
            finally {
                this.scheduleExecution();
            }
        });
    }
    scheduleExecution() {
        if (this.timeoutHandler !== null) {
            return;
        }
        this.timeoutHandler = setTimeout(() => {
            this.timeoutHandler = null;
            return this.execute();
        }, this.delay());
    }
    shouldStart() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!server_1.settings.get('Livechat_enabled')) {
                void this.stop();
                return;
            }
            const routingSupportsAutoAssign = (_a = RoutingManager_1.RoutingManager.getConfig()) === null || _a === void 0 ? void 0 : _a.autoAssignAgent;
            logger_1.queueLogger.debug({
                msg: 'Routing method supports auto assignment',
                method: server_1.settings.get('Livechat_Routing_Method'),
                status: routingSupportsAutoAssign ? 'Starting' : 'Stopping',
            });
            void (routingSupportsAutoAssign ? this.start() : this.stop());
        });
    }
    reconciliation(reason_1, _a) {
        return __awaiter(this, arguments, void 0, function* (reason, { roomId, inquiryId }) {
            switch (reason) {
                case 'closed': {
                    logger_1.queueLogger.debug({
                        msg: 'Room closed. Removing inquiry',
                        roomId,
                        inquiryId,
                        step: 'reconciliation',
                    });
                    yield models_1.LivechatInquiry.removeByRoomId(roomId);
                    break;
                }
                case 'taken': {
                    logger_1.queueLogger.debug({
                        msg: 'Room taken. Updating inquiry status',
                        roomId,
                        inquiryId,
                        step: 'reconciliation',
                    });
                    // Reconciliate served inquiries, by updating their status to taken after queue tried to pick and failed
                    yield models_1.LivechatInquiry.takeInquiry(inquiryId);
                    break;
                }
                case 'missing': {
                    logger_1.queueLogger.debug({
                        msg: 'Room from inquiry missing. Removing inquiry',
                        roomId,
                        inquiryId,
                        step: 'reconciliation',
                    });
                    yield models_1.LivechatInquiry.removeByRoomId(roomId);
                    break;
                }
                default: {
                    return true;
                }
            }
            return true;
        });
    }
    processWaitingQueue(department, inquiry) {
        return __awaiter(this, void 0, void 0, function* () {
            const queue = department || 'Public';
            logger_1.queueLogger.debug(`Processing inquiry ${inquiry._id} from queue ${queue}`);
            const { defaultAgent } = inquiry;
            const roomFromDb = yield models_1.LivechatRooms.findOneById(inquiry.rid);
            // This is a precaution to avoid taking inquiries tied to rooms that no longer exist.
            // This should never happen.
            if (!roomFromDb) {
                return this.reconciliation('missing', { roomId: inquiry.rid, inquiryId: inquiry._id });
            }
            // This is a precaution to avoid taking the same inquiry multiple times. It should not happen, but it's a safety net
            if (roomFromDb.servedBy) {
                return this.reconciliation('taken', { roomId: inquiry.rid, inquiryId: inquiry._id });
            }
            // This is another precaution. If the room is closed, we should not take it
            if (roomFromDb.closedAt) {
                return this.reconciliation('closed', { roomId: inquiry.rid, inquiryId: inquiry._id });
            }
            const room = yield RoutingManager_1.RoutingManager.delegateInquiry(inquiry, defaultAgent, undefined, roomFromDb);
            if (room === null || room === void 0 ? void 0 : room.servedBy) {
                const { _id: rid, servedBy: { _id: agentId }, } = room;
                logger_1.queueLogger.debug(`Inquiry ${inquiry._id} taken successfully by agent ${agentId}. Notifying`);
                setTimeout(() => {
                    void (0, Helper_1.dispatchAgentDelegated)(rid, agentId);
                }, 1000);
                return true;
            }
            return false;
        });
    }
}
exports.OmnichannelQueue = OmnichannelQueue;
