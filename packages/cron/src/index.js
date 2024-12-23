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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronJobs = exports.AgendaCronJobs = void 0;
const agenda_1 = require("@rocket.chat/agenda");
const models_1 = require("@rocket.chat/models");
const random_1 = require("@rocket.chat/random");
const runCronJobFunctionAndPersistResult = (fn, jobName) => __awaiter(void 0, void 0, void 0, function* () {
    const { insertedId } = yield models_1.CronHistory.insertOne({
        _id: random_1.Random.id(),
        intendedAt: new Date(),
        name: jobName,
        startedAt: new Date(),
    });
    try {
        const result = yield fn();
        yield models_1.CronHistory.updateOne({ _id: insertedId }, {
            $set: {
                finishedAt: new Date(),
                result,
            },
        });
        return result;
    }
    catch (error) {
        yield models_1.CronHistory.updateOne({ _id: insertedId }, {
            $set: {
                finishedAt: new Date(),
                error: (error === null || error === void 0 ? void 0 : error.stack) ? error.stack : error,
            },
        });
        throw error;
    }
});
class AgendaCronJobs {
    constructor() {
        this.reservedJobs = [];
    }
    get started() {
        return Boolean(this.scheduler);
    }
    start(mongo) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            this.scheduler = new agenda_1.Agenda({
                mongo,
                db: { collection: 'rocketchat_cron' },
                defaultConcurrency: 1,
                processEvery: '1 minute',
            });
            yield this.scheduler.start();
            try {
                for (var _d = true, _e = __asyncValues(this.reservedJobs), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const job = _c;
                    if (job.timestamped) {
                        yield this.addAtTimestamp(job.name, job.when, job.callback);
                    }
                    else {
                        yield this.add(job.name, job.schedule, job.callback);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.reservedJobs = [];
        });
    }
    add(name, schedule, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.scheduler) {
                return this.reserve({ name, schedule, callback, timestamped: false });
            }
            yield this.define(name, callback);
            yield this.scheduler.every(schedule, name, {}, {});
        });
    }
    addAtTimestamp(name, when, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.scheduler) {
                return this.reserve({ name, when, callback, timestamped: true });
            }
            yield this.define(name, callback);
            yield this.scheduler.schedule(when, name, {});
        });
    }
    remove(name) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.scheduler) {
                return this.unreserve(name);
            }
            yield this.scheduler.cancel({ name });
        });
    }
    has(jobName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.scheduler) {
                return Boolean(this.reservedJobs.find(({ name }) => name === jobName));
            }
            return this.scheduler.has({ name: jobName });
        });
    }
    reserve(config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.reservedJobs = [...this.reservedJobs, config];
        });
    }
    unreserve(jobName) {
        return __awaiter(this, void 0, void 0, function* () {
            this.reservedJobs = this.reservedJobs.filter(({ name }) => name !== jobName);
        });
    }
    define(jobName, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.scheduler) {
                throw new Error('Scheduler is not running.');
            }
            this.scheduler.define(jobName, () => __awaiter(this, void 0, void 0, function* () {
                yield runCronJobFunctionAndPersistResult(() => __awaiter(this, void 0, void 0, function* () { return callback(); }), jobName);
            }));
        });
    }
}
exports.AgendaCronJobs = AgendaCronJobs;
exports.cronJobs = new AgendaCronJobs();
