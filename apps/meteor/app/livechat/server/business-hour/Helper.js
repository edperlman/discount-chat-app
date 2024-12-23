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
exports.createDefaultBusinessHourIfNotExists = exports.openBusinessHourDefault = exports.filterBusinessHoursThatMustBeOpenedByDay = exports.filterBusinessHoursThatMustBeOpened = void 0;
exports.makeAgentsUnavailableBasedOnBusinessHour = makeAgentsUnavailableBasedOnBusinessHour;
exports.makeOnlineAgentsAvailable = makeOnlineAgentsAvailable;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const moment_1 = __importDefault(require("moment"));
const LivechatBusinessHours_1 = require("./LivechatBusinessHours");
const filterBusinessHoursThatMustBeOpened_1 = require("./filterBusinessHoursThatMustBeOpened");
Object.defineProperty(exports, "filterBusinessHoursThatMustBeOpened", { enumerable: true, get: function () { return filterBusinessHoursThatMustBeOpened_1.filterBusinessHoursThatMustBeOpened; } });
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const logger_1 = require("../lib/logger");
const filterBusinessHoursThatMustBeOpenedByDay = (businessHours, day) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, filterBusinessHoursThatMustBeOpened_1.filterBusinessHoursThatMustBeOpened)(businessHours.filter((businessHour) => businessHour.workHours.some((workHour) => workHour.start.utc.dayOfWeek === day || workHour.finish.utc.dayOfWeek === day)));
});
exports.filterBusinessHoursThatMustBeOpenedByDay = filterBusinessHoursThatMustBeOpenedByDay;
const openBusinessHourDefault = () => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.Users.removeBusinessHoursFromAllUsers();
    const currentTime = (0, moment_1.default)((0, moment_1.default)().format('dddd:HH:mm'), 'dddd:HH:mm');
    const day = currentTime.format('dddd');
    const activeBusinessHours = yield models_1.LivechatBusinessHours.findDefaultActiveAndOpenBusinessHoursByDay(day, {
        projection: {
            workHours: 1,
            timezone: 1,
            type: 1,
            active: 1,
        },
    });
    const businessHoursToOpenIds = (yield (0, filterBusinessHoursThatMustBeOpened_1.filterBusinessHoursThatMustBeOpened)(activeBusinessHours)).map((businessHour) => businessHour._id);
    logger_1.businessHourLogger.debug({ msg: 'Opening default business hours', businessHoursToOpenIds });
    yield models_1.Users.openAgentsBusinessHoursByBusinessHourId(businessHoursToOpenIds);
    if (businessHoursToOpenIds.length) {
        yield makeOnlineAgentsAvailable();
    }
    yield makeAgentsUnavailableBasedOnBusinessHour();
});
exports.openBusinessHourDefault = openBusinessHourDefault;
const createDefaultBusinessHourIfNotExists = () => __awaiter(void 0, void 0, void 0, function* () {
    if ((yield models_1.LivechatBusinessHours.col.countDocuments({ type: core_typings_1.LivechatBusinessHourTypes.DEFAULT })) === 0) {
        yield models_1.LivechatBusinessHours.insertOne((0, LivechatBusinessHours_1.createDefaultBusinessHourRow)());
    }
});
exports.createDefaultBusinessHourIfNotExists = createDefaultBusinessHourIfNotExists;
function makeAgentsUnavailableBasedOnBusinessHour() {
    return __awaiter(this, arguments, void 0, function* (agentIds = null) {
        const results = yield models_1.Users.findAgentsAvailableWithoutBusinessHours(agentIds).toArray();
        const update = yield models_1.Users.updateLivechatStatusByAgentIds(results.map(({ _id }) => _id), core_typings_1.ILivechatAgentStatus.NOT_AVAILABLE);
        if (update.modifiedCount === 0) {
            return;
        }
        void (0, notifyListener_1.notifyOnUserChangeAsync)(() => __awaiter(this, void 0, void 0, function* () {
            return results.map(({ _id, openBusinessHours }) => {
                return {
                    id: _id,
                    clientAction: 'updated',
                    diff: {
                        statusLivechat: 'not-available',
                        openBusinessHours,
                    },
                };
            });
        }));
    });
}
function makeOnlineAgentsAvailable() {
    return __awaiter(this, arguments, void 0, function* (agentIds = null) {
        const results = yield models_1.Users.findOnlineButNotAvailableAgents(agentIds).toArray();
        const update = yield models_1.Users.updateLivechatStatusByAgentIds(results.map(({ _id }) => _id), core_typings_1.ILivechatAgentStatus.AVAILABLE);
        if (update.modifiedCount === 0) {
            return;
        }
        void (0, notifyListener_1.notifyOnUserChangeAsync)(() => __awaiter(this, void 0, void 0, function* () {
            return results.map(({ _id, openBusinessHours }) => {
                return {
                    id: _id,
                    clientAction: 'updated',
                    diff: {
                        statusLivechat: 'available',
                        openBusinessHours,
                    },
                };
            });
        }));
    });
}
