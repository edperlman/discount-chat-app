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
exports.AppSchedulerBridge = void 0;
const agenda_1 = require("@rocket.chat/agenda");
const scheduler_1 = require("@rocket.chat/apps-engine/definition/scheduler");
const SchedulerBridge_1 = require("@rocket.chat/apps-engine/server/bridges/SchedulerBridge");
const bson_1 = require("bson");
const mongo_1 = require("meteor/mongo");
function _callProcessor(processor) {
    return (job) => {
        var _a;
        const data = ((_a = job === null || job === void 0 ? void 0 : job.attrs) === null || _a === void 0 ? void 0 : _a.data) || {};
        // This field is for internal use, no need to leak to app processor
        delete data.appId;
        data.jobId = job.attrs._id.toString();
        return processor(data).then(() => __awaiter(this, void 0, void 0, function* () {
            // ensure the 'normal' ('onetime' in our vocab) type job is removed after it is run
            // as Agenda does not remove it from the DB
            if (job.attrs.type === 'normal') {
                yield job.agenda.cancel({ _id: job.attrs._id });
            }
        }));
    };
}
/**
 * Provides the Apps Engine with task scheduling capabilities.
 * It uses {@link agenda:github.com/agenda/agenda} as backend
 */
class AppSchedulerBridge extends SchedulerBridge_1.SchedulerBridge {
    constructor(orch) {
        super();
        this.orch = orch;
        this.scheduler = new agenda_1.Agenda({
            mongo: mongo_1.MongoInternals.defaultRemoteCollectionDriver().mongo.client.db(),
            db: { collection: 'rocketchat_apps_scheduler' },
            // this ensures the same job doesn't get executed multiple times in a cluster
            defaultConcurrency: 1,
        });
        this.isConnected = false;
    }
    /**
     * Register processors that can be scheduled to run
     *
     * @param processors An array of processors
     * @param appId
     *
     * @returns List of task ids run at startup, or void no startup run is set
     */
    registerProcessors() {
        return __awaiter(this, arguments, void 0, function* (processors = [], appId) {
            const runAfterRegister = [];
            this.orch.debugLog(`The App ${appId} is registering job processors`, processors);
            processors.forEach(({ id, processor, startupSetting }) => {
                this.scheduler.define(id, _callProcessor(processor));
                if (!startupSetting) {
                    return;
                }
                switch (startupSetting.type) {
                    case scheduler_1.StartupType.ONETIME:
                        runAfterRegister.push(this.scheduleOnceAfterRegister({ id, when: startupSetting.when, data: startupSetting.data }, appId));
                        break;
                    case scheduler_1.StartupType.RECURRING:
                        runAfterRegister.push(this.scheduleRecurring({
                            id,
                            interval: startupSetting.interval,
                            skipImmediate: startupSetting.skipImmediate,
                            data: startupSetting.data,
                        }, appId));
                        break;
                    default:
                        this.orch
                            .getRocketChatLogger()
                            .error(`Invalid startup setting type (${String(startupSetting.type)}) for the processor ${id}`);
                        break;
                }
            });
            if (runAfterRegister.length) {
                return Promise.all(runAfterRegister);
            }
        });
    }
    /**
     * Schedules a registered processor to run _once_.
     */
    scheduleOnce(_a, appId_1) {
        return __awaiter(this, arguments, void 0, function* ({ id, when, data }, appId) {
            this.orch.debugLog(`The App ${appId} is scheduling an onetime job (processor ${id})`);
            try {
                yield this.startScheduler();
                const job = yield this.scheduler.schedule(when, id, this.decorateJobData(data, appId));
                return job.attrs._id.toString();
            }
            catch (e) {
                this.orch.getRocketChatLogger().error(e);
            }
        });
    }
    scheduleOnceAfterRegister(job, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const scheduledJobs = yield this.scheduler.jobs({ name: job.id, type: 'normal' }, {}, 1);
            if (!scheduledJobs.length) {
                return this.scheduleOnce(job, appId);
            }
        });
    }
    /**
     * Schedules a registered processor to run recurrently according to a given interval.
     *
     * @param {Object} job
     * @param {string} job.id The processor's id
     * @param {string} job.interval When the processor will be re executed
     * @param {boolean} job.skipImmediate=false Whether to let the first iteration to execute as soon as the task is registered
     * @param {Object} [job.data] An optional object that is passed to the processor
     * @param {string} appId
     *
     * @returns {string} taskid
     */
    scheduleRecurring(_a, appId_1) {
        return __awaiter(this, arguments, void 0, function* ({ id, interval, skipImmediate = false, data }, appId) {
            this.orch.debugLog(`The App ${appId} is scheduling a recurring job (processor ${id})`);
            try {
                yield this.startScheduler();
                const job = yield this.scheduler.every(interval, id, this.decorateJobData(data, appId), {
                    skipImmediate,
                });
                return job.attrs._id.toString();
            }
            catch (e) {
                this.orch.getRocketChatLogger().error(e);
            }
        });
    }
    /**
     * Cancels a running job given its jobId
     *
     * @param {string} jobId
     * @param {string} appId
     *
     * @returns Promise<void>
     */
    cancelJob(jobId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`The App ${appId} is canceling a job`, jobId);
            yield this.startScheduler();
            let cancelQuery;
            try {
                cancelQuery = { _id: new bson_1.ObjectID(jobId.split('_')[0]) };
            }
            catch (jobDocIdError) {
                // it is not a valid objectid, so it won't try to cancel by document id
                cancelQuery = { name: jobId };
            }
            try {
                yield this.scheduler.cancel(cancelQuery);
            }
            catch (e) {
                this.orch.getRocketChatLogger().error(e);
            }
        });
    }
    /**
     * Cancels all the running jobs from the app
     *
     * @param {string} appId
     *
     * @returns Promise<void>
     */
    cancelAllJobs(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.orch.debugLog(`Canceling all jobs of App ${appId}`);
            yield this.startScheduler();
            const matcher = new RegExp(`_${appId}$`);
            try {
                yield this.scheduler.cancel({ name: { $regex: matcher } });
            }
            catch (e) {
                this.orch.getRocketChatLogger().error(e);
            }
        });
    }
    startScheduler() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected) {
                yield this.scheduler.start();
                this.isConnected = true;
            }
        });
    }
    decorateJobData(jobData, appId) {
        return Object.assign({}, jobData, { appId });
    }
}
exports.AppSchedulerBridge = AppSchedulerBridge;
