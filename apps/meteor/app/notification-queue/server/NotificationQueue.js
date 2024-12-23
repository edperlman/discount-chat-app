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
exports.Notification = void 0;
const models_1 = require("@rocket.chat/models");
const tracing_1 = require("@rocket.chat/tracing");
const meteor_1 = require("meteor/meteor");
const system_1 = require("../../../server/lib/logger/system");
const email_1 = require("../../lib/server/functions/notifications/email");
const server_1 = require("../../push-notifications/server");
const { NOTIFICATIONS_WORKER_TIMEOUT = 2000, NOTIFICATIONS_BATCH_SIZE = 100, NOTIFICATIONS_SCHEDULE_DELAY_ONLINE = 120, NOTIFICATIONS_SCHEDULE_DELAY_AWAY = 0, NOTIFICATIONS_SCHEDULE_DELAY_OFFLINE = 0, } = process.env;
class NotificationClass {
    constructor() {
        this.running = false;
        this.cyclePause = Number(NOTIFICATIONS_WORKER_TIMEOUT);
        this.maxBatchSize = Number(NOTIFICATIONS_BATCH_SIZE);
        this.maxScheduleDelaySeconds = {
            online: Number(NOTIFICATIONS_SCHEDULE_DELAY_ONLINE),
            away: Number(NOTIFICATIONS_SCHEDULE_DELAY_AWAY),
            offline: Number(NOTIFICATIONS_SCHEDULE_DELAY_OFFLINE),
        };
    }
    initWorker() {
        this.running = true;
        this.executeWorkerLater();
    }
    stopWorker() {
        this.running = false;
    }
    executeWorkerLater() {
        if (!this.running) {
            return;
        }
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            try {
                const continueLater = yield (0, tracing_1.tracerSpan)('NotificationWorker', {
                    attributes: {
                        workerTime: new Date().toISOString(),
                    },
                }, () => this.worker());
                if (continueLater) {
                    this.executeWorkerLater();
                }
            }
            catch (err) {
                system_1.SystemLogger.error({ msg: 'Error sending notification', err });
                this.executeWorkerLater();
            }
        }), this.cyclePause);
    }
    worker() {
        return __awaiter(this, arguments, void 0, function* (counter = 0) {
            var _a, e_1, _b, _c;
            const notification = yield this.getNextNotification();
            if (!notification) {
                return true;
            }
            // Once we start notifying the user we anticipate all the schedules
            const flush = yield models_1.NotificationQueue.clearScheduleByUserId(notification.uid);
            // start worker again if queue flushed
            if (flush.modifiedCount) {
                yield models_1.NotificationQueue.unsetSendingById(notification._id);
                return this.worker(counter);
            }
            try {
                try {
                    for (var _d = true, _e = __asyncValues(notification.items), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const item = _c;
                        switch (item.type) {
                            case 'push':
                                yield this.push(notification, item);
                                break;
                            case 'email':
                                yield this.email(item);
                                break;
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
                yield models_1.NotificationQueue.removeById(notification._id);
            }
            catch (e) {
                system_1.SystemLogger.error(e);
                yield models_1.NotificationQueue.setErrorById(notification._id, e instanceof Error ? e.message : String(e));
            }
            if (counter >= this.maxBatchSize) {
                return true;
            }
            return this.worker(++counter);
        });
    }
    getNextNotification() {
        const expired = new Date();
        expired.setMinutes(expired.getMinutes() - 5);
        return models_1.NotificationQueue.findNextInQueueOrExpired(expired);
    }
    push(_a, item_1) {
        return __awaiter(this, arguments, void 0, function* ({ uid, rid, mid }, item) {
            yield server_1.PushNotification.send(Object.assign({ rid,
                uid,
                mid }, item.data));
        });
    }
    email(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, email_1.sendEmailFromData)(item.data);
        });
    }
    scheduleItem(_a) {
        return __awaiter(this, arguments, void 0, function* ({ uid, rid, mid, items, user, }) {
            const receiver = user ||
                (yield models_1.Users.findOneById(uid, {
                    projection: {
                        statusConnection: 1,
                    },
                }));
            if (!receiver) {
                return;
            }
            const { statusConnection = 'offline' } = receiver;
            let schedule;
            const delay = this.maxScheduleDelaySeconds[statusConnection];
            if (delay < 0) {
                return;
            }
            if (delay > 0) {
                schedule = new Date();
                schedule.setSeconds(schedule.getSeconds() + delay);
            }
            yield models_1.NotificationQueue.insertOne({
                uid,
                rid,
                mid,
                ts: new Date(),
                schedule,
                items,
            });
        });
    }
}
exports.Notification = new NotificationClass();
meteor_1.Meteor.startup(() => {
    exports.Notification.initWorker();
});
