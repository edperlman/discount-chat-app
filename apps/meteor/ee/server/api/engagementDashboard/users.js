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
const check_1 = require("meteor/check");
const server_1 = require("../../../../app/api/server");
const date_1 = require("../../lib/engagementDashboard/date");
const users_1 = require("../../lib/engagementDashboard/users");
server_1.API.v1.addRoute('engagement-dashboard/users/new-users', {
    authRequired: true,
    permissionsRequired: ['view-engagement-dashboard'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                start: check_1.Match.Where(date_1.isDateISOString),
                end: check_1.Match.Where(date_1.isDateISOString),
            }));
            const { start, end } = this.queryParams;
            const data = yield (0, users_1.findWeeklyUsersRegisteredData)((0, date_1.transformDatesForAPI)(start, end));
            return server_1.API.v1.success(data);
        });
    },
});
server_1.API.v1.addRoute('engagement-dashboard/users/active-users', {
    authRequired: true,
    permissionsRequired: ['view-engagement-dashboard'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                start: check_1.Match.Where(date_1.isDateISOString),
                end: check_1.Match.Where(date_1.isDateISOString),
            }));
            const { start, end } = this.queryParams;
            const data = yield (0, users_1.findActiveUsersMonthlyData)((0, date_1.transformDatesForAPI)(start, end));
            return server_1.API.v1.success(data);
        });
    },
});
server_1.API.v1.addRoute('engagement-dashboard/users/chat-busier/hourly-data', {
    authRequired: true,
    permissionsRequired: ['view-engagement-dashboard'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                start: check_1.Match.Where(date_1.isDateISOString),
            }));
            const { start } = this.queryParams;
            const data = yield (0, users_1.findBusiestsChatsInADayByHours)((0, date_1.transformDatesForAPI)(start));
            return server_1.API.v1.success(data);
        });
    },
});
server_1.API.v1.addRoute('engagement-dashboard/users/chat-busier/weekly-data', {
    authRequired: true,
    permissionsRequired: ['view-engagement-dashboard'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                start: check_1.Match.Where(date_1.isDateISOString),
            }));
            const { start } = this.queryParams;
            const data = yield (0, users_1.findBusiestsChatsWithinAWeek)((0, date_1.transformDatesForAPI)(start));
            return server_1.API.v1.success(data);
        });
    },
});
server_1.API.v1.addRoute('engagement-dashboard/users/users-by-time-of-the-day-in-a-week', {
    authRequired: true,
    permissionsRequired: ['view-engagement-dashboard'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                start: check_1.Match.Where(date_1.isDateISOString),
                end: check_1.Match.Where(date_1.isDateISOString),
            }));
            const { start, end } = this.queryParams;
            const data = yield (0, users_1.findUserSessionsByHourWithinAWeek)((0, date_1.transformDatesForAPI)(start, end));
            return server_1.API.v1.success(data);
        });
    },
});