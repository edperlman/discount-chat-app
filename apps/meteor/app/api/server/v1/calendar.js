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
const core_services_1 = require("@rocket.chat/core-services");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const api_1 = require("../api");
api_1.API.v1.addRoute('calendar-events.list', { authRequired: true, validateParams: rest_typings_1.isCalendarEventListProps, rateLimiterOptions: { numRequestsAllowed: 3, intervalTimeInMS: 1000 } }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = this;
            const { date } = this.queryParams;
            const data = yield core_services_1.Calendar.list(userId, new Date(date));
            return api_1.API.v1.success({ data });
        });
    },
});
api_1.API.v1.addRoute('calendar-events.info', { authRequired: true, validateParams: rest_typings_1.isCalendarEventInfoProps, rateLimiterOptions: { numRequestsAllowed: 3, intervalTimeInMS: 1000 } }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = this;
            const { id } = this.queryParams;
            const event = yield core_services_1.Calendar.get(id);
            if (!event || event.uid !== userId) {
                return api_1.API.v1.failure();
            }
            return api_1.API.v1.success({ event });
        });
    },
});
api_1.API.v1.addRoute('calendar-events.create', { authRequired: true, validateParams: rest_typings_1.isCalendarEventCreateProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId: uid } = this;
            const { startTime, externalId, subject, description, meetingUrl, reminderMinutesBeforeStart } = this.bodyParams;
            const id = yield core_services_1.Calendar.create({
                uid,
                startTime: new Date(startTime),
                externalId,
                subject,
                description,
                meetingUrl,
                reminderMinutesBeforeStart,
            });
            return api_1.API.v1.success({ id });
        });
    },
});
api_1.API.v1.addRoute('calendar-events.import', { authRequired: true, validateParams: rest_typings_1.isCalendarEventImportProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId: uid } = this;
            const { startTime, externalId, subject, description, meetingUrl, reminderMinutesBeforeStart } = this.bodyParams;
            const id = yield core_services_1.Calendar.import({
                uid,
                startTime: new Date(startTime),
                externalId,
                subject,
                description,
                meetingUrl,
                reminderMinutesBeforeStart,
            });
            return api_1.API.v1.success({ id });
        });
    },
});
api_1.API.v1.addRoute('calendar-events.update', { authRequired: true, validateParams: rest_typings_1.isCalendarEventUpdateProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = this;
            const { eventId, startTime, subject, description, meetingUrl, reminderMinutesBeforeStart } = this.bodyParams;
            const event = yield core_services_1.Calendar.get(eventId);
            if (!event || event.uid !== userId) {
                throw new Error('invalid-calendar-event');
            }
            yield core_services_1.Calendar.update(eventId, {
                startTime: new Date(startTime),
                subject,
                description,
                meetingUrl,
                reminderMinutesBeforeStart,
            });
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('calendar-events.delete', { authRequired: true, validateParams: rest_typings_1.isCalendarEventDeleteProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = this;
            const { eventId } = this.bodyParams;
            const event = yield core_services_1.Calendar.get(eventId);
            if (!event || event.uid !== userId) {
                throw new Error('invalid-calendar-event');
            }
            yield core_services_1.Calendar.delete(eventId);
            return api_1.API.v1.success();
        });
    },
});
