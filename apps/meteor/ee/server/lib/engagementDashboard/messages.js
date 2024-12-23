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
exports.findTopFivePopularChannelsByMessageSentQuantity = exports.findMessagesSentOrigin = exports.findWeeklyMessagesSentData = exports.fillFirstDaysOfMessagesIfNeeded = exports.handleMessagesDeleted = exports.handleMessagesSent = void 0;
const models_1 = require("@rocket.chat/models");
const moment_1 = __importDefault(require("moment"));
const date_1 = require("./date");
const roomCoordinator_1 = require("../../../../server/lib/rooms/roomCoordinator");
const handleMessagesSent = (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room }) {
    const roomTypesToShow = roomCoordinator_1.roomCoordinator.getTypesToShowOnDashboard();
    if (!room || !roomTypesToShow.includes(room.t)) {
        return message;
    }
    yield models_1.Analytics.saveMessageSent({
        date: (0, date_1.convertDateToInt)(message.ts),
        room,
    });
    return message;
});
exports.handleMessagesSent = handleMessagesSent;
const handleMessagesDeleted = (message, room) => __awaiter(void 0, void 0, void 0, function* () {
    const roomTypesToShow = roomCoordinator_1.roomCoordinator.getTypesToShowOnDashboard();
    if (!room || !roomTypesToShow.includes(room.t)) {
        return message;
    }
    yield models_1.Analytics.saveMessageDeleted({
        date: (0, date_1.convertDateToInt)(message.ts),
        room,
    });
    return message;
});
exports.handleMessagesDeleted = handleMessagesDeleted;
const fillFirstDaysOfMessagesIfNeeded = (date) => __awaiter(void 0, void 0, void 0, function* () {
    const messagesFromAnalytics = yield models_1.Analytics.findByTypeBeforeDate({
        type: 'messages',
        date: (0, date_1.convertDateToInt)(date),
    }).toArray();
    if (!messagesFromAnalytics.length) {
        const startOfPeriod = (0, moment_1.default)(date).subtract(90, 'days').toDate();
        const messages = yield models_1.Messages.getTotalOfMessagesSentByDate({
            start: startOfPeriod,
            end: date,
        });
        yield Promise.all(messages.map((message) => models_1.Analytics.insertOne(Object.assign(Object.assign({}, message), { date: parseInt(message.date) }))));
    }
});
exports.fillFirstDaysOfMessagesIfNeeded = fillFirstDaysOfMessagesIfNeeded;
const findWeeklyMessagesSentData = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, }) {
    var _b, _c;
    const daysBetweenDates = (0, date_1.diffBetweenDaysInclusive)(end, start);
    const endOfLastWeek = (0, moment_1.default)(start).clone().subtract(1, 'days').toDate();
    const startOfLastWeek = (0, moment_1.default)(endOfLastWeek).clone().subtract(daysBetweenDates, 'days').toDate();
    const today = (0, date_1.convertDateToInt)(end);
    const yesterday = (0, date_1.convertDateToInt)((0, moment_1.default)(end).clone().subtract(1, 'days').toDate());
    const currentPeriodMessages = yield models_1.Analytics.getMessagesSentTotalByDate({
        start: (0, date_1.convertDateToInt)(start),
        end: (0, date_1.convertDateToInt)(end),
        options: { count: daysBetweenDates, sort: { _id: -1 } },
    }).toArray();
    const lastPeriodMessages = yield models_1.Analytics.getMessagesSentTotalByDate({
        start: (0, date_1.convertDateToInt)(startOfLastWeek),
        end: (0, date_1.convertDateToInt)(endOfLastWeek),
        options: { count: daysBetweenDates, sort: { _id: -1 } },
    }).toArray();
    const yesterdayMessages = ((_b = currentPeriodMessages.find((item) => item._id === yesterday)) === null || _b === void 0 ? void 0 : _b.messages) || 0;
    const todayMessages = ((_c = currentPeriodMessages.find((item) => item._id === today)) === null || _c === void 0 ? void 0 : _c.messages) || 0;
    const currentPeriodTotalOfMessages = (0, date_1.getTotalOfWeekItems)(currentPeriodMessages, 'messages');
    const lastPeriodTotalOfMessages = (0, date_1.getTotalOfWeekItems)(lastPeriodMessages, 'messages');
    return {
        days: currentPeriodMessages.map((day) => ({
            day: (0, date_1.convertIntToDate)(day._id),
            messages: day.messages,
        })),
        period: {
            count: currentPeriodTotalOfMessages,
            variation: currentPeriodTotalOfMessages - lastPeriodTotalOfMessages,
        },
        yesterday: {
            count: yesterdayMessages,
            variation: todayMessages - yesterdayMessages,
        },
    };
});
exports.findWeeklyMessagesSentData = findWeeklyMessagesSentData;
const findMessagesSentOrigin = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, }) {
    const origins = yield models_1.Analytics.getMessagesOrigin({
        start: (0, date_1.convertDateToInt)(start),
        end: (0, date_1.convertDateToInt)(end),
    }).toArray();
    const roomTypesToShow = roomCoordinator_1.roomCoordinator.getTypesToShowOnDashboard();
    const responseTypes = origins.map((origin) => origin.t);
    const missingTypes = roomTypesToShow.filter((type) => !responseTypes.includes(type));
    if (missingTypes.length) {
        missingTypes.forEach((type) => origins.push({ messages: 0, t: type }));
    }
    return { origins };
});
exports.findMessagesSentOrigin = findMessagesSentOrigin;
const findTopFivePopularChannelsByMessageSentQuantity = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, }) {
    const channels = yield models_1.Analytics.getMostPopularChannelsByMessagesSentQuantity({
        start: (0, date_1.convertDateToInt)(start),
        end: (0, date_1.convertDateToInt)(end),
        options: { count: 5, sort: { messages: -1 } },
    }).toArray();
    return { channels };
});
exports.findTopFivePopularChannelsByMessageSentQuantity = findTopFivePopularChannelsByMessageSentQuantity;
