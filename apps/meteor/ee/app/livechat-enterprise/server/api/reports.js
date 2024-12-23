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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const moment_1 = __importDefault(require("moment"));
const server_1 = require("../../../../../app/api/server");
const applyRoomRestrictions_1 = require("../hooks/applyRoomRestrictions");
const dashboards_1 = require("./lib/dashboards");
const checkDates = (start, end) => {
    if (!start.isValid()) {
        throw new Error('The "start" query parameter must be a valid date.');
    }
    if (!end.isValid()) {
        throw new Error('The "end" query parameter must be a valid date.');
    }
    // Check dates are no more than 1 year apart using moment
    // 1.01 === "we allow to pass year by some hours/days"
    if ((0, moment_1.default)(end).startOf('day').diff((0, moment_1.default)(start).startOf('day'), 'year', true) > 1.01) {
        throw new Error('The "start" and "end" query parameters must be less than 1 year apart.');
    }
    if (start.isAfter(end)) {
        throw new Error('The "start" query parameter must be before the "end" query parameter.');
    }
};
server_1.API.v1.addRoute('livechat/analytics/dashboards/conversations-by-source', { authRequired: true, permissionsRequired: ['view-livechat-reports'], validateParams: rest_typings_1.isGETDashboardConversationsByType }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { start, end } = this.queryParams;
            const startDate = (0, moment_1.default)(start);
            const endDate = (0, moment_1.default)(end);
            checkDates(startDate, endDate);
            const extraQuery = yield (0, applyRoomRestrictions_1.restrictQuery)();
            const result = yield (0, dashboards_1.findAllConversationsBySourceCached)({ start: startDate.toDate(), end: endDate.toDate(), extraQuery });
            return server_1.API.v1.success(result);
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/dashboards/conversations-by-status', { authRequired: true, permissionsRequired: ['view-livechat-reports'], validateParams: rest_typings_1.isGETDashboardConversationsByType }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { start, end } = this.queryParams;
            const startDate = (0, moment_1.default)(start);
            const endDate = (0, moment_1.default)(end);
            checkDates(startDate, endDate);
            const extraQuery = yield (0, applyRoomRestrictions_1.restrictQuery)();
            const result = yield (0, dashboards_1.findAllConversationsByStatusCached)({ start: startDate.toDate(), end: endDate.toDate(), extraQuery });
            return server_1.API.v1.success(result);
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/dashboards/conversations-by-department', { authRequired: true, permissionsRequired: ['view-livechat-reports'], validateParams: rest_typings_1.isGETDashboardConversationsByType }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { start, end } = this.queryParams;
            const { sort } = yield this.parseJsonQuery();
            const startDate = (0, moment_1.default)(start);
            const endDate = (0, moment_1.default)(end);
            checkDates(startDate, endDate);
            const extraQuery = yield (0, applyRoomRestrictions_1.restrictQuery)();
            const result = yield (0, dashboards_1.findAllConversationsByDepartmentCached)({ start: startDate.toDate(), end: endDate.toDate(), sort, extraQuery });
            return server_1.API.v1.success(result);
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/dashboards/conversations-by-tags', { authRequired: true, permissionsRequired: ['view-livechat-reports'], validateParams: rest_typings_1.isGETDashboardConversationsByType }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { start, end } = this.queryParams;
            const { sort } = yield this.parseJsonQuery();
            const startDate = (0, moment_1.default)(start);
            const endDate = (0, moment_1.default)(end);
            checkDates(startDate, endDate);
            const extraQuery = yield (0, applyRoomRestrictions_1.restrictQuery)();
            const result = yield (0, dashboards_1.findAllConversationsByTagsCached)({ start: startDate.toDate(), end: endDate.toDate(), sort, extraQuery });
            return server_1.API.v1.success(result);
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/dashboards/conversations-by-agent', { authRequired: true, permissionsRequired: ['view-livechat-reports'], validateParams: rest_typings_1.isGETDashboardConversationsByType }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { start, end } = this.queryParams;
            const { sort } = yield this.parseJsonQuery();
            const startDate = (0, moment_1.default)(start);
            const endDate = (0, moment_1.default)(end);
            checkDates(startDate, endDate);
            const extraQuery = yield (0, applyRoomRestrictions_1.restrictQuery)();
            const result = yield (0, dashboards_1.findAllConversationsByAgentsCached)({ start: startDate.toDate(), end: endDate.toDate(), sort, extraQuery });
            return server_1.API.v1.success(result);
        });
    },
});
