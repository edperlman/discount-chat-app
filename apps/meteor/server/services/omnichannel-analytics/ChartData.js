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
exports.ChartData = void 0;
class ChartData {
    constructor(roomsModel) {
        this.roomsModel = roomsModel;
    }
    isActionAllowed(action) {
        if (!action) {
            return false;
        }
        return [
            'Total_conversations',
            'Avg_chat_duration',
            'Total_messages',
            'Avg_first_response_time',
            'Avg_reaction_time',
            'Best_first_response_time',
            'Avg_response_time',
        ].includes(action);
    }
    callAction(action, ...args) {
        switch (action) {
            case 'Total_conversations':
                return this.Total_conversations(...args);
            case 'Avg_chat_duration':
                return this.Avg_chat_duration(...args);
            case 'Total_messages':
                return this.Total_messages(...args);
            case 'Avg_first_response_time':
                return this.Avg_first_response_time(...args);
            case 'Avg_reaction_time':
                return this.Avg_reaction_time(...args);
            case 'Best_first_response_time':
                return this.Best_first_response_time(...args);
            case 'Avg_response_time':
                return this.Avg_response_time(...args);
            default:
                throw new Error('Invalid action');
        }
    }
    Total_conversations(date_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (date, departmentId, extraQuery = {}) {
            // @ts-expect-error - Check extraquery usage on this func
            return this.roomsModel.getTotalConversationsBetweenDate('l', date, { departmentId }, extraQuery);
        });
    }
    Avg_chat_duration(date_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (date, departmentId, extraQuery = {}) {
            let total = 0;
            let count = 0;
            yield this.roomsModel.getAnalyticsMetricsBetweenDate('l', date, { departmentId }, extraQuery).forEach(({ metrics }) => {
                if (metrics === null || metrics === void 0 ? void 0 : metrics.chatDuration) {
                    total += metrics.chatDuration;
                    count++;
                }
            });
            const avgCD = count ? total / count : 0;
            return Math.round(avgCD * 100) / 100;
        });
    }
    Total_messages(date_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (date, departmentId, extraQuery = {}) {
            let total = 0;
            // we don't want to count visitor messages
            const extraFilter = { $lte: ['$token', null] };
            yield this.roomsModel
                .getAnalyticsMetricsBetweenDateWithMessages('l', date, { departmentId }, extraFilter, extraQuery)
                .forEach(({ msgs }) => {
                if (msgs) {
                    total += msgs;
                }
            });
            return total;
        });
    }
    Avg_first_response_time(date_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (date, departmentId, extraQuery = {}) {
            let frt = 0;
            let count = 0;
            yield this.roomsModel.getAnalyticsMetricsBetweenDate('l', date, { departmentId }, extraQuery).forEach(({ metrics }) => {
                var _a;
                if ((_a = metrics === null || metrics === void 0 ? void 0 : metrics.response) === null || _a === void 0 ? void 0 : _a.ft) {
                    frt += metrics.response.ft;
                    count++;
                }
            });
            const avgFrt = count ? frt / count : 0;
            return Math.round(avgFrt * 100) / 100;
        });
    }
    Best_first_response_time(date_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (date, departmentId, extraQuery = {}) {
            let maxFrt = 0;
            yield this.roomsModel.getAnalyticsMetricsBetweenDate('l', date, { departmentId }, extraQuery).forEach(({ metrics }) => {
                var _a;
                if ((_a = metrics === null || metrics === void 0 ? void 0 : metrics.response) === null || _a === void 0 ? void 0 : _a.ft) {
                    maxFrt = maxFrt ? Math.min(maxFrt, metrics.response.ft) : metrics.response.ft;
                }
            });
            if (!maxFrt) {
                maxFrt = 0;
            }
            return Math.round(maxFrt * 100) / 100;
        });
    }
    Avg_response_time(date_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (date, departmentId, extraQuery = {}) {
            let art = 0;
            let count = 0;
            yield this.roomsModel.getAnalyticsMetricsBetweenDate('l', date, { departmentId }, extraQuery).forEach(({ metrics }) => {
                var _a;
                if ((_a = metrics === null || metrics === void 0 ? void 0 : metrics.response) === null || _a === void 0 ? void 0 : _a.avg) {
                    art += metrics.response.avg;
                    count++;
                }
            });
            const avgArt = count ? art / count : 0;
            return Math.round(avgArt * 100) / 100;
        });
    }
    Avg_reaction_time(date_1, departmentId_1) {
        return __awaiter(this, arguments, void 0, function* (date, departmentId, extraQuery = {}) {
            let arnt = 0;
            let count = 0;
            yield this.roomsModel.getAnalyticsMetricsBetweenDate('l', date, { departmentId }, extraQuery).forEach(({ metrics }) => {
                var _a;
                if ((_a = metrics === null || metrics === void 0 ? void 0 : metrics.reaction) === null || _a === void 0 ? void 0 : _a.ft) {
                    arnt += metrics.reaction.ft;
                    count++;
                }
            });
            const avgArnt = count ? arnt / count : 0;
            return Math.round(avgArnt * 100) / 100;
        });
    }
}
exports.ChartData = ChartData;
