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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const cron_1 = require("cron");
const date_js_1 = __importDefault(require("date.js"));
const debug_1 = __importDefault(require("debug"));
const human_interval_1 = __importDefault(require("human-interval"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const noCallback_1 = require("./lib/noCallback");
const parsePriority_1 = require("./lib/parsePriority");
const debug = (0, debug_1.default)('agenda:job');
class Job {
    constructor(_a) {
        var { agenda, priority } = _a, args = __rest(_a, ["agenda", "priority"]);
        args = args || {};
        this.agenda = agenda;
        this.attrs = Object.assign(Object.assign({ _id: '' }, args), { priority: (0, parsePriority_1.parsePriority)(priority), nextRunAt: args.nextRunAt || new Date(), type: args.type || 'once' });
    }
    toJSON() {
        const _a = this.attrs || {}, { _id, unique, uniqueOpts } = _a, props = __rest(_a, ["_id", "unique", "uniqueOpts"]);
        return props;
    }
    computeNextRunAt() {
        const { repeatInterval: interval, repeatAt } = this.attrs;
        const previousNextRunAt = this.attrs.nextRunAt || new Date();
        this.attrs.nextRunAt = null;
        if (interval) {
            this._computeFromInterval(interval, previousNextRunAt);
        }
        else if (repeatAt) {
            this._computeFromRepeatAt(repeatAt);
        }
        return this;
    }
    dateForTimezone(date, timezone) {
        const newDate = (0, moment_timezone_1.default)(date);
        if (timezone) {
            newDate.tz(timezone);
        }
        return newDate;
    }
    _computeFromInterval(interval, previousNextRunAt) {
        const { repeatTimezone: timezone, name, _id } = this.attrs;
        debug('[%s:%s] computing next run via interval [%s]', name, _id, interval);
        const lastRun = this.dateForTimezone(this.attrs.lastRunAt || new Date(), timezone);
        try {
            const cronTime = new cron_1.CronTime(interval);
            let nextDate = cronTime._getNextDateFrom(lastRun);
            if (nextDate.valueOf() === lastRun.valueOf() || nextDate.valueOf() <= previousNextRunAt.valueOf()) {
                // Handle cronTime giving back the same date for the next run time
                nextDate = cronTime._getNextDateFrom(this.dateForTimezone(new Date(lastRun.valueOf() + 1000), timezone));
            }
            this.attrs.nextRunAt = new Date(nextDate.valueOf());
            debug('[%s:%s] nextRunAt set to [%s]', this.attrs.name, this.attrs._id, this.attrs.nextRunAt.toISOString());
        }
        catch (error) {
            // Nope, humanInterval then!
            try {
                const numberInterval = (typeof interval === 'number' ? interval : (0, human_interval_1.default)(interval)) || 0;
                if (!this.attrs.lastRunAt && numberInterval) {
                    this.attrs.nextRunAt = new Date(lastRun.valueOf());
                    debug('[%s:%s] nextRunAt set to [%s]', this.attrs.name, this.attrs._id, this.attrs.nextRunAt.toISOString());
                }
                else {
                    this.attrs.nextRunAt = new Date(lastRun.valueOf() + numberInterval);
                    debug('[%s:%s] nextRunAt set to [%s]', this.attrs.name, this.attrs._id, this.attrs.nextRunAt.toISOString());
                }
                // Either `xo` linter or Node.js 8 stumble on this line if it isn't just ignored
            }
            catch (error) {
                //
            }
        }
        finally {
            if (!this.attrs.nextRunAt || isNaN(this.attrs.nextRunAt.valueOf())) {
                this.attrs.nextRunAt = null;
                debug('[%s:%s] failed to calculate nextRunAt due to invalid repeat interval', this.attrs.name, this.attrs._id);
                this.fail('failed to calculate nextRunAt due to invalid repeat interval');
            }
        }
    }
    _computeFromRepeatAt(repeatAt) {
        const lastRun = this.attrs.lastRunAt || new Date();
        const nextDate = (0, date_js_1.default)(repeatAt).valueOf();
        // If you do not specify offset date for below test it will fail for ms
        const offset = Date.now();
        if (offset === (0, date_js_1.default)(repeatAt, offset).valueOf()) {
            this.attrs.nextRunAt = null;
            debug('[%s:%s] failed to calculate repeatAt due to invalid format', this.attrs.name, this.attrs._id);
            this.fail('failed to calculate repeatAt time due to invalid format');
        }
        else if (nextDate.valueOf() === lastRun.valueOf()) {
            this.attrs.nextRunAt = (0, date_js_1.default)('tomorrow at ', repeatAt);
            debug('[%s:%s] nextRunAt set to [%s]', this.attrs.name, this.attrs._id, this.attrs.nextRunAt.toISOString());
        }
        else {
            this.attrs.nextRunAt = (0, date_js_1.default)(repeatAt);
            debug('[%s:%s] nextRunAt set to [%s]', this.attrs.name, this.attrs._id, this.attrs.nextRunAt.toISOString());
        }
    }
    repeatEvery(interval, options = {}) {
        this.attrs.repeatInterval = interval;
        this.attrs.repeatTimezone = options.timezone ? options.timezone : null;
        if (options.skipImmediate) {
            // Set the lastRunAt time to the nextRunAt so that the new nextRunAt will be computed in reference to the current value.
            this.attrs.lastRunAt = this.attrs.nextRunAt || new Date();
            this.computeNextRunAt();
            this.attrs.lastRunAt = undefined;
        }
        else {
            this.computeNextRunAt();
        }
        return this;
    }
    repeatAt(time) {
        this.attrs.repeatAt = time;
        return this;
    }
    disable() {
        this.attrs.disabled = true;
        return this;
    }
    enable() {
        this.attrs.disabled = false;
        return this;
    }
    unique(unique, opts) {
        this.attrs.unique = unique;
        this.attrs.uniqueOpts = opts;
        return this;
    }
    schedule(time) {
        const d = new Date(time);
        this.attrs.nextRunAt = Number.isNaN(d.getTime()) ? (0, date_js_1.default)(time) : d;
        return this;
    }
    priority(priority) {
        this.attrs.priority = (0, parsePriority_1.parsePriority)(priority);
        return this;
    }
    fail(reason) {
        if (reason instanceof Error) {
            reason = reason.message;
        }
        this.attrs.failReason = reason;
        this.attrs.failCount = (this.attrs.failCount || 0) + 1;
        const now = new Date();
        this.attrs.failedAt = now;
        this.attrs.lastFinishedAt = now;
        debug('[%s:%s] fail() called [%d] times so far', this.attrs.name, this.attrs._id, this.attrs.failCount);
        return this;
    }
    run() {
        const definition = this.agenda.getDefinition(this.attrs.name);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this.attrs.lastRunAt = new Date();
            debug('[%s:%s] setting lastRunAt to: %s', this.attrs.name, this.attrs._id, this.attrs.lastRunAt.toISOString());
            this.computeNextRunAt();
            yield this.save();
            let finished = false;
            const jobCallback = (err) => __awaiter(this, void 0, void 0, function* () {
                // We don't want to complete the job multiple times
                if (finished) {
                    return;
                }
                finished = true;
                if (err) {
                    this.fail(err);
                }
                else {
                    this.attrs.lastFinishedAt = new Date();
                }
                this.attrs.lockedAt = null;
                yield this.save().catch((error) => {
                    debug('[%s:%s] failed to be saved to MongoDB', this.attrs.name, this.attrs._id);
                    reject(error);
                });
                debug('[%s:%s] was saved successfully to MongoDB', this.attrs.name, this.attrs._id);
                if (err) {
                    this.agenda.emit('fail', err, this);
                    this.agenda.emit(`fail:${this.attrs.name}`, err, this);
                    debug('[%s:%s] has failed [%s]', this.attrs.name, this.attrs._id, err.message);
                }
                else {
                    this.agenda.emit('success', this);
                    this.agenda.emit(`success:${this.attrs.name}`, this);
                    debug('[%s:%s] has succeeded', this.attrs.name, this.attrs._id);
                }
                this.agenda.emit('complete', this);
                this.agenda.emit(`complete:${this.attrs.name}`, this);
                debug('[%s:%s] job finished at [%s] and was unlocked', this.attrs.name, this.attrs._id, this.attrs.lastFinishedAt);
                // Curiously, we still resolve successfully if the job processor failed.
                // Agenda is not equipped to handle errors originating in user code, so, we leave them to inspect the side-effects of job.fail()
                resolve(this);
            });
            try {
                this.agenda.emit('start', this);
                this.agenda.emit(`start:${this.attrs.name}`, this);
                debug('[%s:%s] starting job', this.attrs.name, this.attrs._id);
                if (!definition) {
                    debug('[%s:%s] has no definition, can not run', this.attrs.name, this.attrs._id);
                    throw new Error('Undefined job');
                }
                if (definition.fn.length === 2) {
                    debug('[%s:%s] process function being called', this.attrs.name, this.attrs._id);
                    yield definition.fn(this, jobCallback);
                }
                else {
                    debug('[%s:%s] process function being called', this.attrs.name, this.attrs._id);
                    yield definition.fn(this);
                    yield jobCallback();
                }
            }
            catch (error) {
                debug('[%s:%s] unknown error occurred', this.attrs.name, this.attrs._id);
                yield jobCallback(error);
            }
        }));
    }
    isRunning() {
        if (!this.attrs.lastRunAt) {
            return false;
        }
        if (!this.attrs.lastFinishedAt) {
            return true;
        }
        if (this.attrs.lockedAt && this.attrs.lastRunAt.getTime() > this.attrs.lastFinishedAt.getTime()) {
            return true;
        }
        return false;
    }
    save(...args) {
        (0, noCallback_1.noCallback)(args);
        return this.agenda.saveJob(this);
    }
    remove() {
        return this.agenda.cancel({ _id: this.attrs._id });
    }
    touch(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, noCallback_1.noCallback)(args);
            this.attrs.lockedAt = new Date();
            return this.save();
        });
    }
}
exports.Job = Job;
