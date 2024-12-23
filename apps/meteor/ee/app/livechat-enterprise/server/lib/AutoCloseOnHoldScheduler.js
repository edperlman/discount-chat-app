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
exports.AutoCloseOnHoldScheduler = exports.AutoCloseOnHoldSchedulerClass = void 0;
const agenda_1 = require("@rocket.chat/agenda");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const mongo_1 = require("meteor/mongo");
const moment_1 = __importDefault(require("moment"));
const logger_1 = require("./logger");
const LivechatTyped_1 = require("../../../../../app/livechat/server/lib/LivechatTyped");
const SCHEDULER_NAME = 'omnichannel_auto_close_on_hold_scheduler';
class AutoCloseOnHoldSchedulerClass {
    constructor() {
        this.logger = logger_1.schedulerLogger.section('AutoCloseOnHoldScheduler');
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
    scheduleRoom(roomId, timeout, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.running) {
                throw new Error('AutoCloseOnHoldScheduler is not running');
            }
            this.logger.debug(`Scheduling room ${roomId} to be closed in ${timeout} seconds`);
            yield this.unscheduleRoom(roomId);
            const jobName = `${SCHEDULER_NAME}-${roomId}`;
            const when = (0, moment_1.default)(new Date()).add(timeout, 's').toDate();
            this.scheduler.define(jobName, this.executeJob.bind(this));
            yield this.scheduler.schedule(when, jobName, { roomId, comment });
        });
    }
    unscheduleRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.running) {
                throw new Error('AutoCloseOnHoldScheduler is not running');
            }
            this.logger.debug(`Unscheduling room ${roomId}`);
            const jobName = `${SCHEDULER_NAME}-${roomId}`;
            yield this.scheduler.cancel({ name: jobName });
        });
    }
    executeJob() {
        return __awaiter(this, arguments, void 0, function* ({ attrs: { data } } = {}) {
            this.logger.debug(`Executing job for room ${data.roomId}`);
            const { roomId, comment } = data;
            const [room, user] = yield Promise.all([models_1.LivechatRooms.findOneById(roomId), this.getSchedulerUser()]);
            if (!room || !user) {
                throw new Error(`Unable to process AutoCloseOnHoldScheduler job because room or user not found for roomId: ${roomId} and userId: rocket.cat`);
            }
            const payload = {
                room,
                user,
                comment,
            };
            yield LivechatTyped_1.Livechat.closeRoom(payload);
        });
    }
    getSchedulerUser() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.schedulerUser) {
                const schedulerUser = yield models_1.Users.findOneById('rocket.cat');
                if (!schedulerUser) {
                    throw new Error('Scheduler user not found');
                }
                this.schedulerUser = schedulerUser;
            }
            return this.schedulerUser;
        });
    }
}
exports.AutoCloseOnHoldSchedulerClass = AutoCloseOnHoldSchedulerClass;
exports.AutoCloseOnHoldScheduler = new AutoCloseOnHoldSchedulerClass();
meteor_1.Meteor.startup(() => {
    void exports.AutoCloseOnHoldScheduler.init();
});
