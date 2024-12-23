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
exports.findAllChannelsWithNumberOfMessages = exports.findChannelsWithNumberOfMessages = void 0;
const models_1 = require("@rocket.chat/models");
const moment_1 = __importDefault(require("moment"));
const date_1 = require("./date");
const roomCoordinator_1 = require("../../../../server/lib/rooms/roomCoordinator");
const findChannelsWithNumberOfMessages = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, hideRoomsWithNoActivity, options = {}, }) {
    if (!hideRoomsWithNoActivity) {
        return (0, exports.findAllChannelsWithNumberOfMessages)({ start, end, options });
    }
    const daysBetweenDates = (0, date_1.diffBetweenDaysInclusive)(end, start);
    const endOfLastWeek = (0, moment_1.default)(start).subtract(1, 'days').toDate();
    const startOfLastWeek = (0, moment_1.default)(endOfLastWeek).subtract(daysBetweenDates, 'days').toDate();
    const roomTypes = roomCoordinator_1.roomCoordinator.getTypesToShowOnDashboard();
    const aggregationResult = yield models_1.Analytics.findRoomsByTypesWithNumberOfMessagesBetweenDate({
        types: roomTypes,
        start: (0, date_1.convertDateToInt)(start),
        end: (0, date_1.convertDateToInt)(end),
        startOfLastWeek: (0, date_1.convertDateToInt)(startOfLastWeek),
        endOfLastWeek: (0, date_1.convertDateToInt)(endOfLastWeek),
        options,
    }).toArray();
    // The aggregation result may be undefined if there are no matching analytics or corresponding rooms in the period
    if (!aggregationResult.length) {
        return { channels: [], total: 0 };
    }
    const [{ channels, total }] = aggregationResult;
    return {
        channels,
        total,
    };
});
exports.findChannelsWithNumberOfMessages = findChannelsWithNumberOfMessages;
const findAllChannelsWithNumberOfMessages = (_a) => __awaiter(void 0, [_a], void 0, function* ({ start, end, options = {}, }) {
    const daysBetweenDates = (0, date_1.diffBetweenDaysInclusive)(end, start);
    const endOfLastWeek = (0, moment_1.default)(start).subtract(1, 'days').toDate();
    const startOfLastWeek = (0, moment_1.default)(endOfLastWeek).subtract(daysBetweenDates, 'days').toDate();
    const roomTypes = roomCoordinator_1.roomCoordinator.getTypesToShowOnDashboard();
    const channels = yield models_1.Rooms.findChannelsByTypesWithNumberOfMessagesBetweenDate({
        types: roomTypes,
        start: (0, date_1.convertDateToInt)(start),
        end: (0, date_1.convertDateToInt)(end),
        startOfLastWeek: (0, date_1.convertDateToInt)(startOfLastWeek),
        endOfLastWeek: (0, date_1.convertDateToInt)(endOfLastWeek),
        options,
    }).toArray();
    const total = yield models_1.Rooms.countDocuments({ t: { $in: roomTypes } });
    return {
        channels,
        total,
    };
});
exports.findAllChannelsWithNumberOfMessages = findAllChannelsWithNumberOfMessages;
