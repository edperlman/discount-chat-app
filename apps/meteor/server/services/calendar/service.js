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
exports.CalendarService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const cron_1 = require("@rocket.chat/cron");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../app/settings/server");
const getUserPreference_1 = require("../../../app/utils/server/lib/getUserPreference");
const logger = new logger_1.Logger('Calendar');
const defaultMinutesForNotifications = 5;
class CalendarService extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'calendar';
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, startTime, subject, description, reminderMinutesBeforeStart, meetingUrl } = data;
            const minutes = reminderMinutesBeforeStart !== null && reminderMinutesBeforeStart !== void 0 ? reminderMinutesBeforeStart : defaultMinutesForNotifications;
            const reminderTime = minutes ? this.getShiftedTime(startTime, -minutes) : undefined;
            const insertData = {
                uid,
                startTime,
                subject,
                description,
                meetingUrl,
                reminderMinutesBeforeStart: minutes,
                reminderTime,
                notificationSent: false,
            };
            const insertResult = yield models_1.CalendarEvent.insertOne(insertData);
            yield this.setupNextNotification();
            return insertResult.insertedId;
        });
    }
    import(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { externalId } = data;
            if (!externalId) {
                return this.create(data);
            }
            const { uid, startTime, subject, description, reminderMinutesBeforeStart } = data;
            const meetingUrl = data.meetingUrl ? data.meetingUrl : yield this.parseDescriptionForMeetingUrl(description);
            const reminderTime = reminderMinutesBeforeStart ? this.getShiftedTime(startTime, -reminderMinutesBeforeStart) : undefined;
            const updateData = {
                startTime,
                subject,
                description,
                meetingUrl,
                reminderMinutesBeforeStart,
                reminderTime,
                externalId,
            };
            const event = yield this.findImportedEvent(externalId, uid);
            if (!event) {
                const insertResult = yield models_1.CalendarEvent.insertOne(Object.assign({ uid, notificationSent: false }, updateData));
                yield this.setupNextNotification();
                return insertResult.insertedId;
            }
            const updateResult = yield models_1.CalendarEvent.updateEvent(event._id, updateData);
            if (updateResult.modifiedCount > 0) {
                yield this.setupNextNotification();
            }
            return event._id;
        });
    }
    get(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.CalendarEvent.findOne({ _id: eventId });
        });
    }
    list(uid, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.CalendarEvent.findByUserIdAndDate(uid, date).toArray();
        });
    }
    update(eventId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { startTime, subject, description, reminderMinutesBeforeStart } = data;
            const meetingUrl = data.meetingUrl ? data.meetingUrl : yield this.parseDescriptionForMeetingUrl(description || '');
            const reminderTime = reminderMinutesBeforeStart && startTime ? this.getShiftedTime(startTime, -reminderMinutesBeforeStart) : undefined;
            const updateData = {
                startTime,
                subject,
                description,
                meetingUrl,
                reminderMinutesBeforeStart,
                reminderTime,
            };
            const updateResult = yield models_1.CalendarEvent.updateEvent(eventId, updateData);
            if (updateResult.modifiedCount > 0) {
                yield this.setupNextNotification();
            }
            return updateResult;
        });
    }
    delete(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.CalendarEvent.deleteOne({
                _id: eventId,
            });
        });
    }
    setupNextNotification() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.doSetupNextNotification(false);
        });
    }
    doSetupNextNotification(isRecursive) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = yield models_1.CalendarEvent.findNextNotificationDate();
            if (!date) {
                if (yield cron_1.cronJobs.has('calendar-reminders')) {
                    yield cron_1.cronJobs.remove('calendar-reminders');
                }
                return;
            }
            date.setSeconds(0);
            if (!isRecursive && date.valueOf() < Date.now()) {
                return this.sendCurrentNotifications(date);
            }
            yield cron_1.cronJobs.addAtTimestamp('calendar-reminders', date, () => __awaiter(this, void 0, void 0, function* () { return this.sendCurrentNotifications(date); }));
        });
    }
    sendCurrentNotifications(date) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const events = yield models_1.CalendarEvent.findEventsToNotify(date, 1).toArray();
            try {
                for (var _d = true, events_1 = __asyncValues(events), events_1_1; events_1_1 = yield events_1.next(), _a = events_1_1.done, !_a; _d = true) {
                    _c = events_1_1.value;
                    _d = false;
                    const event = _c;
                    yield this.sendEventNotification(event);
                    yield models_1.CalendarEvent.flagNotificationSent(event._id);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = events_1.return)) yield _b.call(events_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            yield this.doSetupNextNotification(true);
        });
    }
    sendEventNotification(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield (0, getUserPreference_1.getUserPreference)(event.uid, 'notifyCalendarEvents'))) {
                return;
            }
            return core_services_1.api.broadcast('notify.calendar', event.uid, {
                title: event.subject,
                text: event.startTime.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric', dayPeriod: 'narrow' }),
                payload: {
                    _id: event._id,
                },
            });
        });
    }
    findImportedEvent(externalId, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.CalendarEvent.findOneByExternalIdAndUserId(externalId, uid);
        });
    }
    parseDescriptionForMeetingUrl(description) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!description) {
                return;
            }
            const defaultPattern = '(?:[?&]callUrl=([^\n&<]+))|(?:(?:%3F)|(?:%26))callUrl(?:%3D)((?:(?:[^\n&<](?!%26)))+[^\n&<]?)';
            const pattern = (server_1.settings.get('Calendar_MeetingUrl_Regex') || defaultPattern).trim();
            if (!pattern) {
                return;
            }
            const regex = (() => {
                try {
                    return new RegExp(pattern, 'im');
                }
                catch (_a) {
                    logger.error('Failed to parse regular expression for meeting url.');
                }
            })();
            if (!regex) {
                return;
            }
            const results = description.match(regex);
            if (!results) {
                return;
            }
            const [, ...urls] = results;
            for (const encodedUrl of urls) {
                if (!encodedUrl) {
                    continue;
                }
                let url = encodedUrl;
                while (!url.includes('://')) {
                    const decodedUrl = decodeURIComponent(url);
                    if (decodedUrl === url) {
                        break;
                    }
                    url = decodedUrl;
                }
                if (url.includes('://')) {
                    return url;
                }
            }
            return undefined;
        });
    }
    getShiftedTime(time, minutes) {
        const newTime = new Date(time.valueOf());
        newTime.setMinutes(newTime.getMinutes() + minutes);
        return newTime;
    }
}
exports.CalendarService = CalendarService;
