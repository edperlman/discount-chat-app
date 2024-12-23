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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessHourManager = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const closeBusinessHour_1 = require("./closeBusinessHour");
const callbacks_1 = require("../../../../lib/callbacks");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_1 = require("../../../settings/server");
const logger_1 = require("../lib/logger");
const CRON_EVERY_MIDNIGHT_EXPRESSION = '0 0 * * *';
const CRON_DAYLIGHT_JOB_NAME = 'livechat-business-hour-daylight-saving-time-verifier';
class BusinessHourManager {
    constructor(cronJobs) {
        this.types = new Map();
        this.cronJobsCache = [];
        this.cronJobs = cronJobs;
        this.openWorkHoursCallback = this.openWorkHoursCallback.bind(this);
        this.closeWorkHoursCallback = this.closeWorkHoursCallback.bind(this);
    }
    startManager() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createCronJobsForWorkHours();
            this.setupCallbacks();
            yield this.cleanupDisabledDepartmentReferences();
            yield this.behavior.onStartBusinessHours();
            void this.startDaylightSavingTimeVerifier();
            void this.registerDaylightSavingTimeCronJob();
        });
    }
    stopManager() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.removeCronJobs();
            this.clearCronJobsCache();
            this.removeCallbacks();
            yield this.behavior.onDisableBusinessHours();
            yield this.cronJobs.remove(CRON_DAYLIGHT_JOB_NAME);
        });
    }
    restartManager() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stopManager();
            yield this.startManager();
        });
    }
    cleanupDisabledDepartmentReferences() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            // Get business hours with departments enabled and disabled
            const bhWithDepartments = yield models_1.LivechatDepartment.getBusinessHoursWithDepartmentStatuses();
            if (!bhWithDepartments.length) {
                // If there are no bh, skip
                return;
            }
            try {
                for (var _d = true, bhWithDepartments_1 = __asyncValues(bhWithDepartments), bhWithDepartments_1_1; bhWithDepartments_1_1 = yield bhWithDepartments_1.next(), _a = bhWithDepartments_1_1.done, !_a; _d = true) {
                    _c = bhWithDepartments_1_1.value;
                    _d = false;
                    const { _id: businessHourId, validDepartments, invalidDepartments } = _c;
                    if (!invalidDepartments.length) {
                        continue;
                    }
                    // If there are no enabled departments, close the business hour
                    const allDepsAreDisabled = validDepartments.length === 0 && invalidDepartments.length > 0;
                    if (allDepsAreDisabled) {
                        const businessHour = yield this.getBusinessHour(businessHourId, core_typings_1.LivechatBusinessHourTypes.CUSTOM);
                        if (!businessHour) {
                            continue;
                        }
                        yield (0, closeBusinessHour_1.closeBusinessHour)(businessHour);
                    }
                    // Remove business hour from disabled departments
                    yield models_1.LivechatDepartment.removeBusinessHourFromDepartmentsByIdsAndBusinessHourId(invalidDepartments, businessHourId);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = bhWithDepartments_1.return)) yield _b.call(bhWithDepartments_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    allowAgentChangeServiceStatus(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!server_1.settings.get('Livechat_enable_business_hours')) {
                return true;
            }
            return this.behavior.allowAgentChangeServiceStatus(agentId);
        });
    }
    registerBusinessHourType(businessHourType) {
        this.types.set(businessHourType.name, businessHourType);
    }
    registerBusinessHourBehavior(behavior) {
        this.behavior = behavior;
    }
    getBusinessHour(id, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const businessHourType = this.getBusinessHourType(type || core_typings_1.LivechatBusinessHourTypes.DEFAULT);
            if (!businessHourType) {
                return null;
            }
            return businessHourType.getBusinessHour(id);
        });
    }
    saveBusinessHour(businessHourData) {
        return __awaiter(this, void 0, void 0, function* () {
            const type = this.getBusinessHourType(businessHourData.type || core_typings_1.LivechatBusinessHourTypes.DEFAULT);
            const saved = yield type.saveBusinessHour(businessHourData);
            if (!server_1.settings.get('Livechat_enable_business_hours')) {
                return;
            }
            yield this.behavior.afterSaveBusinessHours(saved);
            yield this.createCronJobsForWorkHours();
        });
    }
    removeBusinessHourByIdAndType(id, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const businessHourType = this.getBusinessHourType(type);
            yield businessHourType.removeBusinessHourById(id);
            if (!server_1.settings.get('Livechat_enable_business_hours')) {
                return;
            }
            yield this.createCronJobsForWorkHours();
        });
    }
    onLogin(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!server_1.settings.get('Livechat_enable_business_hours')) {
                return this.behavior.changeAgentActiveStatus(agentId, 'available');
            }
            const result = yield models_1.Users.setLivechatStatusActiveBasedOnBusinessHours(agentId);
            if (result.updatedCount > 0) {
                void (0, notifyListener_1.notifyOnUserChange)({ clientAction: 'updated', id: agentId, diff: { statusLivechat: 'available ' } });
            }
            return result;
        });
    }
    restartCronJobsIfNecessary() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!server_1.settings.get('Livechat_enable_business_hours')) {
                return;
            }
            yield this.createCronJobsForWorkHours();
        });
    }
    setupCallbacks() {
        callbacks_1.callbacks.add('livechat.removeAgentDepartment', this.behavior.onRemoveAgentFromDepartment.bind(this), callbacks_1.callbacks.priority.HIGH, 'business-hour-livechat-on-remove-agent-department');
        callbacks_1.callbacks.add('livechat.afterRemoveDepartment', this.behavior.onRemoveDepartment.bind(this), callbacks_1.callbacks.priority.HIGH, 'business-hour-livechat-after-remove-department');
        callbacks_1.callbacks.add('livechat.saveAgentDepartment', this.behavior.onAddAgentToDepartment.bind(this), callbacks_1.callbacks.priority.HIGH, 'business-hour-livechat-on-save-agent-department');
        callbacks_1.callbacks.add('livechat.afterDepartmentDisabled', this.behavior.onDepartmentDisabled.bind(this), callbacks_1.callbacks.priority.HIGH, 'business-hour-livechat-on-department-disabled');
        callbacks_1.callbacks.add('livechat.afterDepartmentArchived', this.behavior.onDepartmentArchived.bind(this), callbacks_1.callbacks.priority.HIGH, 'business-hour-livechat-on-department-archived');
        callbacks_1.callbacks.add('livechat.onNewAgentCreated', this.behavior.onNewAgentCreated.bind(this), callbacks_1.callbacks.priority.HIGH, 'business-hour-livechat-on-agent-created');
    }
    removeCallbacks() {
        callbacks_1.callbacks.remove('livechat.removeAgentDepartment', 'business-hour-livechat-on-remove-agent-department');
        callbacks_1.callbacks.remove('livechat.afterRemoveDepartment', 'business-hour-livechat-after-remove-department');
        callbacks_1.callbacks.remove('livechat.saveAgentDepartment', 'business-hour-livechat-on-save-agent-department');
        callbacks_1.callbacks.remove('livechat.afterDepartmentDisabled', 'business-hour-livechat-on-department-disabled');
        callbacks_1.callbacks.remove('livechat.afterDepartmentArchived', 'business-hour-livechat-on-department-archived');
        callbacks_1.callbacks.remove('livechat.onNewAgentCreated', 'business-hour-livechat-on-agent-created');
    }
    createCronJobsForWorkHours() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.removeCronJobs();
            this.clearCronJobsCache();
            const [workHours] = yield this.behavior.findHoursToCreateJobs();
            if (!workHours) {
                return;
            }
            const { start, finish } = workHours;
            yield Promise.all(start.map(({ day, times }) => this.scheduleCronJob(times, day, 'open', this.openWorkHoursCallback)));
            yield Promise.all(finish.map(({ day, times }) => this.scheduleCronJob(times, day, 'close', this.closeWorkHoursCallback)));
        });
    }
    scheduleCronJob(items, day, type, job) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(items.map((hour) => {
                const time = (0, moment_timezone_1.default)(hour, 'HH:mm').day(day);
                const jobName = `${time.format('dddd')}/${time.format('HH:mm')}/${type}`;
                const scheduleAt = `${time.minutes()} ${time.hours()} * * ${time.day()}`;
                this.addToCache(jobName);
                return this.cronJobs.add(jobName, scheduleAt, () => job(day, hour));
            }));
        });
    }
    openWorkHoursCallback(day, hour) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.behavior.openBusinessHoursByDayAndHour(day, hour);
        });
    }
    closeWorkHoursCallback(day, hour) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.behavior.closeBusinessHoursByDayAndHour(day, hour);
        });
    }
    getBusinessHourType(type) {
        return this.types.get(type);
    }
    removeCronJobs() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(this.cronJobsCache.map((jobName) => this.cronJobs.remove(jobName)));
        });
    }
    addToCache(jobName) {
        this.cronJobsCache.push(jobName);
    }
    clearCronJobsCache() {
        this.cronJobsCache = [];
    }
    hasDaylightSavingTimeChanged(timezone) {
        const now = (0, moment_timezone_1.default)().utc().tz(timezone.name);
        const currentUTC = now.format('Z');
        const existingTimezoneUTC = (0, moment_timezone_1.default)(timezone.utc, 'Z').utc().tz(timezone.name);
        const DSTHasChanged = !(0, moment_timezone_1.default)(currentUTC, 'Z').utc().tz(timezone.name).isSame(existingTimezoneUTC);
        return currentUTC !== timezone.utc && DSTHasChanged;
    }
    registerDaylightSavingTimeCronJob() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cronJobs.add(CRON_DAYLIGHT_JOB_NAME, CRON_EVERY_MIDNIGHT_EXPRESSION, this.startDaylightSavingTimeVerifier.bind(this));
        });
    }
    startDaylightSavingTimeVerifier() {
        return __awaiter(this, void 0, void 0, function* () {
            const activeBusinessHours = yield models_1.LivechatBusinessHours.findActiveBusinessHours();
            const timezonesNeedingAdjustment = activeBusinessHours.filter(({ timezone }) => timezone && this.hasDaylightSavingTimeChanged(timezone));
            if (timezonesNeedingAdjustment.length === 0) {
                return;
            }
            const result = yield Promise.allSettled(timezonesNeedingAdjustment.map((businessHour) => {
                const businessHourType = this.getBusinessHourType(businessHour.type);
                if (!businessHourType) {
                    return;
                }
                return businessHourType.saveBusinessHour(Object.assign(Object.assign({}, businessHour), { timezoneName: businessHour.timezone.name, workHours: businessHour.workHours.map((hour) => (Object.assign(Object.assign({}, hour), { start: hour.start.time, finish: hour.finish.time }))) }));
            }));
            const failed = result.filter((r) => r.status === 'rejected');
            if (failed.length > 0) {
                failed.forEach((error) => {
                    logger_1.businessHourLogger.error('Failed to update business hours with new timezone', error.reason);
                });
            }
            yield this.createCronJobsForWorkHours();
        });
    }
}
exports.BusinessHourManager = BusinessHourManager;
