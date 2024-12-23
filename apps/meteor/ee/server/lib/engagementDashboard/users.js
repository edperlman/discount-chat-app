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
exports.findUserSessionsByHourWithinAWeek = exports.findBusiestsChatsWithinAWeek = exports.findBusiestsChatsInADayByHours = exports.findActiveUsersMonthlyData = exports.findWeeklyUsersRegisteredData = exports.fillFirstDaysOfUsersIfNeeded = exports.handleUserCreated = void 0;
const models_1 = require("@rocket.chat/models");
const moment_1 = __importDefault(require("moment"));
const date_1 = require("./date");
const handleUserCreated = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = user.roles) === null || _a === void 0 ? void 0 : _a.includes('anonymous')) {
        return user;
    }
    yield models_1.Analytics.saveUserData({
        date: (0, date_1.convertDateToInt)(user.createdAt),
    });
    return user;
});
exports.handleUserCreated = handleUserCreated;
const fillFirstDaysOfUsersIfNeeded = (date) => __awaiter(void 0, void 0, void 0, function* () {
    const usersFromAnalytics = yield models_1.Analytics.findByTypeBeforeDate({
        type: 'users',
        date: (0, date_1.convertDateToInt)(date),
    }).toArray();
    if (!usersFromAnalytics.length) {
        const startOfPeriod = (0, moment_1.default)(date).subtract(90, 'days').toDate();
        const users = (yield models_1.Users.getTotalOfRegisteredUsersByDate({
            start: startOfPeriod,
            end: date,
        }));
        users.forEach((user) => models_1.Analytics.insertOne(Object.assign(Object.assign({}, user), { date: parseInt(user.date) })));
    }
});
exports.fillFirstDaysOfUsersIfNeeded = fillFirstDaysOfUsersIfNeeded;
const findWeeklyUsersRegisteredData = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, }) {
    var _b, _c;
    const daysBetweenDates = (0, date_1.diffBetweenDaysInclusive)(end, start);
    const endOfLastWeek = (0, moment_1.default)(start).clone().subtract(1, 'days').toDate();
    const startOfLastWeek = (0, moment_1.default)(endOfLastWeek).clone().subtract(daysBetweenDates, 'days').toDate();
    const today = (0, date_1.convertDateToInt)(end);
    const yesterday = (0, date_1.convertDateToInt)((0, moment_1.default)(end).clone().subtract(1, 'days').toDate());
    const currentPeriodUsers = yield models_1.Analytics.getTotalOfRegisteredUsersByDate({
        start: (0, date_1.convertDateToInt)(start),
        end: (0, date_1.convertDateToInt)(end),
        options: { count: daysBetweenDates, sort: { _id: -1 } },
    }).toArray();
    const lastPeriodUsers = yield models_1.Analytics.getTotalOfRegisteredUsersByDate({
        start: (0, date_1.convertDateToInt)(startOfLastWeek),
        end: (0, date_1.convertDateToInt)(endOfLastWeek),
        options: { count: daysBetweenDates, sort: { _id: -1 } },
    }).toArray();
    const yesterdayUsers = ((_b = currentPeriodUsers.find((item) => item._id === yesterday)) === null || _b === void 0 ? void 0 : _b.users) || 0;
    const todayUsers = ((_c = currentPeriodUsers.find((item) => item._id === today)) === null || _c === void 0 ? void 0 : _c.users) || 0;
    const currentPeriodTotalUsers = (0, date_1.getTotalOfWeekItems)(currentPeriodUsers, 'users');
    const lastPeriodTotalUsers = (0, date_1.getTotalOfWeekItems)(lastPeriodUsers, 'users');
    return {
        days: currentPeriodUsers.map((day) => ({ day: (0, date_1.convertIntToDate)(day._id), users: day.users })),
        period: {
            count: currentPeriodTotalUsers,
            variation: currentPeriodTotalUsers - lastPeriodTotalUsers,
        },
        yesterday: {
            count: yesterdayUsers,
            variation: todayUsers - yesterdayUsers,
        },
    };
});
exports.findWeeklyUsersRegisteredData = findWeeklyUsersRegisteredData;
const createDestructuredDate = (input) => {
    const date = (0, moment_1.default)(input);
    return {
        year: date.year(),
        month: date.month() + 1,
        day: date.date(),
    };
};
const findActiveUsersMonthlyData = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, }) {
    return ({
        month: yield models_1.Sessions.getActiveUsersOfPeriodByDayBetweenDates({
            start: createDestructuredDate(start),
            end: createDestructuredDate(end),
        }),
    });
});
exports.findActiveUsersMonthlyData = findActiveUsersMonthlyData;
const findBusiestsChatsInADayByHours = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, }) {
    return ({
        hours: yield models_1.Sessions.getBusiestTimeWithinHoursPeriod({
            start: (0, moment_1.default)(start).subtract(24, 'hours').toDate(),
            end: start,
            groupSize: 2,
        }),
    });
});
exports.findBusiestsChatsInADayByHours = findBusiestsChatsInADayByHours;
const findBusiestsChatsWithinAWeek = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, }) {
    return ({
        month: yield models_1.Sessions.getTotalOfSessionsByDayBetweenDates({
            start: createDestructuredDate((0, moment_1.default)(start).subtract(7, 'days')),
            end: createDestructuredDate(start),
        }),
    });
});
exports.findBusiestsChatsWithinAWeek = findBusiestsChatsWithinAWeek;
const findUserSessionsByHourWithinAWeek = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, }) {
    return ({
        week: yield models_1.Sessions.getTotalOfSessionByHourAndDayBetweenDates({
            start,
            end,
        }),
    });
});
exports.findUserSessionsByHourWithinAWeek = findUserSessionsByHourWithinAWeek;
