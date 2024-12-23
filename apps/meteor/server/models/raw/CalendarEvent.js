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
exports.CalendarEventRaw = void 0;
const BaseRaw_1 = require("./BaseRaw");
class CalendarEventRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'calendar_event', trash);
    }
    modelIndexes() {
        return [
            {
                key: { startTime: -1, uid: 1, externalId: 1 },
            },
            {
                key: { reminderTime: -1, notificationSent: 1 },
            },
        ];
    }
    findOneByExternalIdAndUserId(externalId, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({
                externalId,
                uid,
            });
        });
    }
    findByUserIdAndDate(uid, date) {
        const startTime = new Date(date.toISOString());
        startTime.setHours(0, 0, 0, 0);
        const finalTime = new Date(date.valueOf());
        finalTime.setDate(finalTime.getDate() + 1);
        return this.find({
            uid,
            startTime: { $gte: startTime, $lt: finalTime },
        }, {
            sort: { startTime: 1 },
        });
    }
    updateEvent(eventId_1, _a) {
        return __awaiter(this, arguments, void 0, function* (eventId, { subject, description, startTime, meetingUrl, reminderMinutesBeforeStart, reminderTime }) {
            return this.updateOne({ _id: eventId }, {
                $set: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (subject !== undefined ? { subject } : {})), (description !== undefined ? { description } : {})), (startTime ? { startTime } : {})), (meetingUrl !== undefined ? { meetingUrl } : {})), (reminderMinutesBeforeStart ? { reminderMinutesBeforeStart } : {})), (reminderTime ? { reminderTime } : {})),
            });
        });
    }
    findNextNotificationDate() {
        return __awaiter(this, void 0, void 0, function* () {
            const nextEvent = yield this.findOne({
                reminderTime: {
                    $gt: new Date(),
                },
                notificationSent: false,
            }, {
                sort: {
                    reminderTime: 1,
                },
                projection: {
                    reminderTime: 1,
                },
            });
            return (nextEvent === null || nextEvent === void 0 ? void 0 : nextEvent.reminderTime) || null;
        });
    }
    findEventsToNotify(notificationTime, minutes) {
        // Find all the events between notificationTime and +minutes that have not been notified yet
        const maxDate = new Date(notificationTime.toISOString());
        maxDate.setMinutes(maxDate.getMinutes() + minutes);
        return this.find({
            reminderTime: {
                $gte: notificationTime,
                $lt: maxDate,
            },
            notificationSent: false,
        }, {
            sort: {
                reminderTime: 1,
            },
        });
    }
    flagNotificationSent(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateOne({
                _id: eventId,
            }, {
                $set: {
                    notificationSent: true,
                },
            });
        });
    }
}
exports.CalendarEventRaw = CalendarEventRaw;
