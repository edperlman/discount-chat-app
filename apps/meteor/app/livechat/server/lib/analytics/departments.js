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
exports.findPercentageOfAbandonedRoomsAsync = exports.findAllNumberOfAbandonedRoomsAsync = exports.findAllNumberOfTransferredRoomsAsync = exports.findAllAverageWaitingTimeAsync = exports.findAllServiceTimeAsync = exports.findAllAverageServiceTimeAsync = exports.findAllAverageOfChatDurationTimeAsync = exports.findAllRoomsAsync = void 0;
const models_1 = require("@rocket.chat/models");
const findAllRoomsAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, answered, departmentId, options = {} }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const total = yield models_1.LivechatRooms.findAllRooms({
        start,
        answered,
        end,
        departmentId,
        onlyCount: true,
    }).toArray();
    return {
        departments: yield models_1.LivechatRooms.findAllRooms({
            start,
            answered,
            end,
            departmentId,
            options,
        }).toArray(),
        total: total.length ? total[0].total : 0,
    };
});
exports.findAllRoomsAsync = findAllRoomsAsync;
const findAllAverageOfChatDurationTimeAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, departmentId, options = {} }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const total = yield models_1.LivechatRooms.findAllAverageOfChatDurationTime({
        start,
        end,
        departmentId,
        onlyCount: true,
    }).toArray();
    return {
        departments: yield models_1.LivechatRooms.findAllAverageOfChatDurationTime({
            start,
            end,
            departmentId,
            options,
        }).toArray(),
        total: total.length ? total[0].total : 0,
    };
});
exports.findAllAverageOfChatDurationTimeAsync = findAllAverageOfChatDurationTimeAsync;
const findAllAverageServiceTimeAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, departmentId, options = {} }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const total = yield models_1.LivechatRooms.findAllAverageOfServiceTime({
        start,
        end,
        departmentId,
        onlyCount: true,
    }).toArray();
    return {
        departments: yield models_1.LivechatRooms.findAllAverageOfServiceTime({
            start,
            end,
            departmentId,
            options,
        }).toArray(),
        total: total.length ? total[0].total : 0,
    };
});
exports.findAllAverageServiceTimeAsync = findAllAverageServiceTimeAsync;
const findAllServiceTimeAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, departmentId, options = {} }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const total = yield models_1.LivechatRooms.findAllServiceTime({
        start,
        end,
        departmentId,
        onlyCount: true,
    }).toArray();
    return {
        departments: yield models_1.LivechatRooms.findAllServiceTime({
            start,
            end,
            departmentId,
            options,
        }).toArray(),
        total: total.length ? total[0].total : 0,
    };
});
exports.findAllServiceTimeAsync = findAllServiceTimeAsync;
const findAllAverageWaitingTimeAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, departmentId, options = {} }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const total = yield models_1.LivechatRooms.findAllAverageWaitingTime({
        start,
        end,
        departmentId,
        onlyCount: true,
    }).toArray();
    return {
        departments: yield models_1.LivechatRooms.findAllAverageWaitingTime({
            start,
            end,
            departmentId,
            options,
        }).toArray(),
        total: total.length ? total[0].total : 0,
    };
});
exports.findAllAverageWaitingTimeAsync = findAllAverageWaitingTimeAsync;
const findAllNumberOfTransferredRoomsAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, departmentId, options = {} }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const total = yield models_1.Messages.findAllNumberOfTransferredRooms({
        start,
        end,
        departmentId,
        onlyCount: true,
    }).toArray();
    return {
        departments: yield models_1.Messages.findAllNumberOfTransferredRooms({
            start,
            end,
            departmentId,
            options,
        }).toArray(),
        total: total.length ? total[0].total : 0,
    };
});
exports.findAllNumberOfTransferredRoomsAsync = findAllNumberOfTransferredRoomsAsync;
const findAllNumberOfAbandonedRoomsAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, departmentId, options = {} }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const total = yield (yield models_1.LivechatRooms.findAllNumberOfAbandonedRooms({ start, end, departmentId, onlyCount: true })).toArray();
    return {
        departments: yield (yield models_1.LivechatRooms.findAllNumberOfAbandonedRooms({ start, end, departmentId, options })).toArray(),
        total: total.length ? total[0].total : 0,
    };
});
exports.findAllNumberOfAbandonedRoomsAsync = findAllNumberOfAbandonedRoomsAsync;
const findPercentageOfAbandonedRoomsAsync = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, departmentId, options = {} }) {
    if (!start || !end) {
        throw new Error('"start" and "end" must be provided');
    }
    const total = yield (yield models_1.LivechatRooms.findPercentageOfAbandonedRooms({
        start,
        end,
        departmentId,
        onlyCount: true,
    })).toArray();
    return {
        departments: yield (yield models_1.LivechatRooms.findPercentageOfAbandonedRooms({ start, end, departmentId, options })).toArray(),
        total: total.length ? total[0].total : 0,
    };
});
exports.findPercentageOfAbandonedRoomsAsync = findPercentageOfAbandonedRoomsAsync;
