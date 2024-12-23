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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const server_1 = require("../../../../../app/api/server");
const getPaginationItems_1 = require("../../../../../app/api/server/helpers/getPaginationItems");
const departments_1 = require("../../../../../app/livechat/server/lib/analytics/departments");
server_1.API.v1.addRoute('livechat/analytics/departments/amount-of-chats', { authRequired: true, permissionsRequired: ['view-livechat-manager'], validateParams: rest_typings_1.isLivechatAnalyticsDepartmentsAmountOfChatsProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { start, end } = this.queryParams;
            const { answered, departmentId } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            const startDate = new Date(start);
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const endDate = new Date(end);
            const { departments, total } = yield (0, departments_1.findAllRoomsAsync)({
                start: startDate,
                end: endDate,
                answered: answered === 'true',
                departmentId,
                options: { offset, count },
            });
            return server_1.API.v1.success({
                departments,
                count: departments.length,
                offset,
                total,
            });
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/departments/average-service-time', {
    authRequired: true,
    permissionsRequired: ['view-livechat-manager'],
    validateParams: rest_typings_1.isLivechatAnalyticsDepartmentsAverageServiceTimeProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { start, end } = this.queryParams;
            const { departmentId } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            const startDate = new Date(start);
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const endDate = new Date(end);
            const { departments, total } = yield (0, departments_1.findAllAverageServiceTimeAsync)({
                start: startDate,
                end: endDate,
                departmentId,
                options: { offset, count },
            });
            return server_1.API.v1.success({
                departments,
                count: departments.length,
                offset,
                total,
            });
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/departments/average-chat-duration-time', {
    authRequired: true,
    permissionsRequired: ['view-livechat-manager'],
    validateParams: rest_typings_1.isLivechatAnalyticsDepartmentsAverageChatDurationTimeProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { start, end } = this.queryParams;
            const { departmentId } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            const startDate = new Date(start);
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const endDate = new Date(end);
            const { departments, total } = yield (0, departments_1.findAllAverageOfChatDurationTimeAsync)({
                start: startDate,
                end: endDate,
                departmentId,
                options: { offset, count },
            });
            return server_1.API.v1.success({
                departments,
                count: departments.length,
                offset,
                total,
            });
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/departments/total-service-time', {
    authRequired: true,
    permissionsRequired: ['view-livechat-manager'],
    validateParams: rest_typings_1.isLivechatAnalyticsDepartmentsTotalServiceTimeProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { start, end } = this.queryParams;
            const { departmentId } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            const startDate = new Date(start);
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const endDate = new Date(end);
            const { departments, total } = yield (0, departments_1.findAllServiceTimeAsync)({
                start: startDate,
                end: endDate,
                departmentId,
                options: { offset, count },
            });
            return server_1.API.v1.success({
                departments,
                count: departments.length,
                offset,
                total,
            });
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/departments/average-waiting-time', {
    authRequired: true,
    permissionsRequired: ['view-livechat-manager'],
    validateParams: rest_typings_1.isLivechatAnalyticsDepartmentsAverageWaitingTimeProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { start, end } = this.queryParams;
            const { departmentId } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            const startDate = new Date(start);
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const endDate = new Date(end);
            const { departments, total } = yield (0, departments_1.findAllAverageWaitingTimeAsync)({
                start: startDate,
                end: endDate,
                departmentId,
                options: { offset, count },
            });
            return server_1.API.v1.success({
                departments,
                count: departments.length,
                offset,
                total,
            });
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/departments/total-transferred-chats', {
    authRequired: true,
    permissionsRequired: ['view-livechat-manager'],
    validateParams: rest_typings_1.isLivechatAnalyticsDepartmentsTotalTransferredChatsProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { start, end } = this.queryParams;
            const { departmentId } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            const startDate = new Date(start);
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const endDate = new Date(end);
            const { departments, total } = yield (0, departments_1.findAllNumberOfTransferredRoomsAsync)({
                start: startDate,
                end: endDate,
                departmentId,
                options: { offset, count },
            });
            return server_1.API.v1.success({
                departments,
                count: departments.length,
                offset,
                total,
            });
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/departments/total-abandoned-chats', {
    authRequired: true,
    permissionsRequired: ['view-livechat-manager'],
    validateParams: rest_typings_1.isLivechatAnalyticsDepartmentsTotalAbandonedChatsProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { start, end } = this.queryParams;
            const { departmentId } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            const startDate = new Date(start);
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const endDate = new Date(end);
            const { departments, total } = yield (0, departments_1.findAllNumberOfAbandonedRoomsAsync)({
                start: startDate,
                end: endDate,
                departmentId,
                options: { offset, count },
            });
            return server_1.API.v1.success({
                departments,
                count: departments.length,
                offset,
                total,
            });
        });
    },
});
server_1.API.v1.addRoute('livechat/analytics/departments/percentage-abandoned-chats', {
    authRequired: true,
    permissionsRequired: ['view-livechat-manager'],
    validateParams: rest_typings_1.isLivechatAnalyticsDepartmentsPercentageAbandonedChatsProps,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { start, end } = this.queryParams;
            const { departmentId } = this.queryParams;
            if (isNaN(Date.parse(start))) {
                return server_1.API.v1.failure('The "start" query parameter must be a valid date.');
            }
            const startDate = new Date(start);
            if (isNaN(Date.parse(end))) {
                return server_1.API.v1.failure('The "end" query parameter must be a valid date.');
            }
            const endDate = new Date(end);
            const { departments, total } = yield (0, departments_1.findPercentageOfAbandonedRoomsAsync)({
                start: startDate,
                end: endDate,
                departmentId,
                options: { offset, count },
            });
            return server_1.API.v1.success({
                departments,
                count: departments.length,
                offset,
                total,
            });
        });
    },
});
