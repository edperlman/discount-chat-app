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
exports.findAvailableServiceTimeHistoryAsync = exports.findAllServiceTimeAsync = exports.findAllAverageServiceTimeAsync = void 0;
const models_1 = require("@rocket.chat/models");
const findAllAverageServiceTimeAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, options = {} }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const total = yield models_1.LivechatRooms.findAllAverageServiceTimeByAgents({
        start,
        end,
        onlyCount: true,
    }).toArray();
    return {
        agents: yield models_1.LivechatRooms.findAllAverageServiceTimeByAgents({
            start,
            end,
            options,
        }).toArray(),
        total: total.length ? total[0].total : 0,
    };
});
exports.findAllAverageServiceTimeAsync = findAllAverageServiceTimeAsync;
const findAllServiceTimeAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, options = {} }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const total = yield models_1.LivechatRooms.findAllServiceTimeByAgent({
        start,
        end,
        onlyCount: true,
    }).toArray();
    return {
        agents: yield models_1.LivechatRooms.findAllServiceTimeByAgent({ start, end, options }).toArray(),
        total: total.length ? total[0].total : 0,
    };
});
exports.findAllServiceTimeAsync = findAllServiceTimeAsync;
const findAvailableServiceTimeHistoryAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, fullReport, options = {}, }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const total = yield models_1.LivechatAgentActivity.findAvailableServiceTimeHistory({
        start,
        end,
        fullReport,
        onlyCount: true,
    }).toArray();
    return {
        agents: yield models_1.LivechatAgentActivity.findAvailableServiceTimeHistory({
            start,
            end,
            fullReport,
            options,
        }).toArray(),
        total: total.length ? total[0].total : 0,
    };
});
exports.findAvailableServiceTimeHistoryAsync = findAvailableServiceTimeHistoryAsync;
