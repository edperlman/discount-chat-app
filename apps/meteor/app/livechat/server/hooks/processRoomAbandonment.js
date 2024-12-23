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
exports.onCloseRoom = exports.getSecondsSinceLastAgentResponse = exports.parseDays = exports.getSecondsWhenOfficeHoursIsDisabled = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const moment_1 = __importDefault(require("moment"));
const callbacks_1 = require("../../../../lib/callbacks");
const server_1 = require("../../../settings/server");
const business_hour_1 = require("../business-hour");
const getSecondsWhenOfficeHoursIsDisabled = (room, agentLastMessage) => (0, moment_1.default)(new Date(room.closedAt || new Date())).diff((0, moment_1.default)(new Date(agentLastMessage.ts)), 'seconds');
exports.getSecondsWhenOfficeHoursIsDisabled = getSecondsWhenOfficeHoursIsDisabled;
const parseDays = (acc, day) => {
    acc[day.day] = {
        start: { day: day.start.utc.dayOfWeek, time: day.start.utc.time },
        finish: { day: day.finish.utc.dayOfWeek, time: day.finish.utc.time },
        open: day.open,
    };
    return acc;
};
exports.parseDays = parseDays;
const getSecondsSinceLastAgentResponse = (room, agentLastMessage) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (!server_1.settings.get('Livechat_enable_business_hours')) {
        return (0, exports.getSecondsWhenOfficeHoursIsDisabled)(room, agentLastMessage);
    }
    let officeDays;
    const department = room.departmentId
        ? yield models_1.LivechatDepartment.findOneById(room.departmentId, {
            projection: { businessHourId: 1 },
        })
        : null;
    if (department === null || department === void 0 ? void 0 : department.businessHourId) {
        const businessHour = yield models_1.LivechatBusinessHours.findOneById(department.businessHourId);
        if (!businessHour) {
            return (0, exports.getSecondsWhenOfficeHoursIsDisabled)(room, agentLastMessage);
        }
        officeDays = (_a = (yield business_hour_1.businessHourManager.getBusinessHour(businessHour._id, businessHour.type))) === null || _a === void 0 ? void 0 : _a.workHours.reduce(exports.parseDays, {});
    }
    else {
        officeDays = (_b = (yield business_hour_1.businessHourManager.getBusinessHour())) === null || _b === void 0 ? void 0 : _b.workHours.reduce(exports.parseDays, {});
    }
    // Empty object we assume invalid config
    if (!officeDays || !Object.keys(officeDays).length) {
        return (0, exports.getSecondsWhenOfficeHoursIsDisabled)(room, agentLastMessage);
    }
    let totalSeconds = 0;
    const endOfConversation = moment_1.default.utc(new Date(room.closedAt || new Date()));
    const startOfInactivity = moment_1.default.utc(new Date(agentLastMessage.ts));
    const daysOfInactivity = endOfConversation.clone().startOf('day').diff(startOfInactivity.clone().startOf('day'), 'days');
    const inactivityDay = moment_1.default.utc(new Date(agentLastMessage.ts));
    for (let index = 0; index <= daysOfInactivity; index++) {
        const today = inactivityDay.clone().format('dddd');
        const officeDay = officeDays[today];
        if (!officeDay) {
            inactivityDay.add(1, 'days');
            continue;
        }
        if (!officeDay.open) {
            inactivityDay.add(1, 'days');
            continue;
        }
        if (!((_c = officeDay === null || officeDay === void 0 ? void 0 : officeDay.start) === null || _c === void 0 ? void 0 : _c.time) || !((_d = officeDay === null || officeDay === void 0 ? void 0 : officeDay.finish) === null || _d === void 0 ? void 0 : _d.time)) {
            inactivityDay.add(1, 'days');
            continue;
        }
        const [officeStartHour, officeStartMinute] = officeDay.start.time.split(':');
        const [officeCloseHour, officeCloseMinute] = officeDay.finish.time.split(':');
        // We should only take in consideration the time where the office is open and the conversation was inactive
        const todayStartOfficeHours = inactivityDay
            .clone()
            .set({ hour: parseInt(officeStartHour, 10), minute: parseInt(officeStartMinute, 10) });
        const todayEndOfficeHours = inactivityDay.clone().set({ hour: parseInt(officeCloseHour, 10), minute: parseInt(officeCloseMinute, 10) });
        // 1: Room was inactive the whole day, we add the whole time BH is inactive
        if (startOfInactivity.isBefore(todayStartOfficeHours) && endOfConversation.isAfter(todayEndOfficeHours)) {
            totalSeconds += todayEndOfficeHours.diff(todayStartOfficeHours, 'seconds');
        }
        // 2: Room was inactive before start but was closed before end of BH, we add the inactive time
        if (startOfInactivity.isBefore(todayStartOfficeHours) && endOfConversation.isBefore(todayEndOfficeHours)) {
            totalSeconds += endOfConversation.diff(todayStartOfficeHours, 'seconds');
        }
        // 3: Room was inactive after start and ended after end of BH, we add the inactive time
        if (startOfInactivity.isAfter(todayStartOfficeHours) && endOfConversation.isAfter(todayEndOfficeHours)) {
            totalSeconds += todayEndOfficeHours.diff(startOfInactivity, 'seconds');
        }
        // 4: Room was inactive after start and before end of BH, we add the inactive time
        if (startOfInactivity.isAfter(todayStartOfficeHours) && endOfConversation.isBefore(todayEndOfficeHours)) {
            totalSeconds += endOfConversation.diff(startOfInactivity, 'seconds');
        }
        inactivityDay.add(1, 'days');
    }
    return totalSeconds;
});
exports.getSecondsSinceLastAgentResponse = getSecondsSinceLastAgentResponse;
const onCloseRoom = (params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { room } = params;
    if (!(0, core_typings_1.isOmnichannelRoom)(room)) {
        return params;
    }
    const closedByAgent = room.closer !== 'visitor';
    const wasTheLastMessageSentByAgent = room.lastMessage && !room.lastMessage.token;
    if (!closedByAgent || !wasTheLastMessageSentByAgent) {
        return params;
    }
    if (!((_a = room.v) === null || _a === void 0 ? void 0 : _a.lastMessageTs)) {
        return params;
    }
    const agentLastMessage = yield models_1.Messages.findAgentLastMessageByVisitorLastMessageTs(room._id, room.v.lastMessageTs);
    if (!agentLastMessage) {
        return params;
    }
    const secondsSinceLastAgentResponse = yield (0, exports.getSecondsSinceLastAgentResponse)(room, agentLastMessage);
    yield models_1.LivechatRooms.setVisitorInactivityInSecondsById(room._id, secondsSinceLastAgentResponse);
    return params;
});
exports.onCloseRoom = onCloseRoom;
callbacks_1.callbacks.add('livechat.closeRoom', exports.onCloseRoom, callbacks_1.callbacks.priority.HIGH, 'process-room-abandonment');
