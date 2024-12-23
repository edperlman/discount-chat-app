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
exports.AutoTransferChatScheduler = void 0;
const agenda_1 = require("@rocket.chat/agenda");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const mongo_1 = require("meteor/mongo");
const logger_1 = require("./logger");
const Helper_1 = require("../../../../../app/livechat/server/lib/Helper");
const LivechatTyped_1 = require("../../../../../app/livechat/server/lib/LivechatTyped");
const RoutingManager_1 = require("../../../../../app/livechat/server/lib/RoutingManager");
const server_1 = require("../../../../../app/settings/server");
const SCHEDULER_NAME = 'omnichannel_scheduler';
class AutoTransferChatSchedulerClass {
    constructor() {
        this.logger = logger_1.schedulerLogger.section('AutoTransferChatScheduler');
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.running) {
                return;
            }
            this.scheduler = new agenda_1.Agenda({
                mongo: mongo_1.MongoInternals.defaultRemoteCollectionDriver().mongo.client.db(),
                db: { collection: SCHEDULER_NAME },
                defaultConcurrency: 1,
                processEvery: process.env.TEST_MODE === 'true' ? '3 seconds' : '1 minute',
            });
            yield this.scheduler.start();
            this.running = true;
            this.logger.info('Service started');
        });
    }
    getSchedulerUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Users.findOneById('rocket.cat');
        });
    }
    scheduleRoom(roomId, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug(`Scheduling room ${roomId} to be transferred in ${timeout} seconds`);
            yield this.unscheduleRoom(roomId);
            const jobName = `${SCHEDULER_NAME}-${roomId}`;
            const when = new Date();
            when.setSeconds(when.getSeconds() + timeout);
            this.scheduler.define(jobName, this.executeJob.bind(this));
            yield this.scheduler.schedule(when, jobName, { roomId });
            yield models_1.LivechatRooms.setAutoTransferOngoingById(roomId);
        });
    }
    unscheduleRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug(`Unscheduling room ${roomId}`);
            const jobName = `${SCHEDULER_NAME}-${roomId}`;
            yield models_1.LivechatRooms.unsetAutoTransferOngoingById(roomId);
            yield this.scheduler.cancel({ name: jobName });
        });
    }
    transferRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.logger.debug(`Transferring room ${roomId}`);
            const room = yield models_1.LivechatRooms.findOneById(roomId, {
                _id: 1,
                v: 1,
                servedBy: 1,
                open: 1,
                departmentId: 1,
            });
            if (!(room === null || room === void 0 ? void 0 : room.open) || !((_a = room === null || room === void 0 ? void 0 : room.servedBy) === null || _a === void 0 ? void 0 : _a._id)) {
                throw new Error('Room is not open or is not being served by an agent');
            }
            const { departmentId, servedBy: { _id: ignoreAgentId }, } = room;
            const timeoutDuration = server_1.settings.get('Livechat_auto_transfer_chat_timeout').toString();
            if (!((_b = RoutingManager_1.RoutingManager.getConfig()) === null || _b === void 0 ? void 0 : _b.autoAssignAgent)) {
                this.logger.debug(`Auto-assign agent is disabled, returning room ${roomId} as inquiry`);
                yield LivechatTyped_1.Livechat.returnRoomAsInquiry(room, departmentId, {
                    scope: 'autoTransferUnansweredChatsToQueue',
                    comment: timeoutDuration,
                    transferredBy: yield this.getSchedulerUser(),
                });
                return;
            }
            const agent = yield RoutingManager_1.RoutingManager.getNextAgent(departmentId, ignoreAgentId);
            if (!agent) {
                this.logger.error(`No agent found to transfer room ${room._id} which hasn't been answered in ${timeoutDuration} seconds`);
                return;
            }
            this.logger.debug(`Transferring room ${roomId} to agent ${agent.agentId}`);
            const transferredBy = yield this.getSchedulerUser();
            if (!transferredBy) {
                this.logger.error(`Error while transferring room ${room._id}: user not found`);
                return;
            }
            yield (0, Helper_1.forwardRoomToAgent)(room, {
                userId: agent.agentId,
                transferredBy: Object.assign(Object.assign({}, transferredBy), { userType: 'user' }),
                transferredTo: agent,
                scope: 'autoTransferUnansweredChatsToAgent',
                comment: timeoutDuration,
            });
        });
    }
    executeJob() {
        return __awaiter(this, arguments, void 0, function* ({ attrs: { data } } = {}) {
            const { roomId } = data;
            try {
                yield this.transferRoom(roomId);
                yield Promise.all([models_1.LivechatRooms.setAutoTransferredAtById(roomId), this.unscheduleRoom(roomId)]);
            }
            catch (error) {
                this.logger.error(`Error while executing job ${SCHEDULER_NAME} for room ${roomId}:`, error);
            }
        });
    }
}
exports.AutoTransferChatScheduler = new AutoTransferChatSchedulerClass();
meteor_1.Meteor.startup(() => {
    void exports.AutoTransferChatScheduler.init();
});
