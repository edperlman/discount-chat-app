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
exports.AbstractBusinessHourType = exports.AbstractBusinessHourBehavior = void 0;
const models_1 = require("@rocket.chat/models");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
class AbstractBusinessHourBehavior {
    constructor() {
        this.BusinessHourRepository = models_1.LivechatBusinessHours;
        this.UsersRepository = models_1.Users;
    }
    findHoursToCreateJobs() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.BusinessHourRepository.findHoursToScheduleJobs();
        });
    }
    onDisableBusinessHours() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.UsersRepository.removeBusinessHoursFromAllUsers();
        });
    }
    allowAgentChangeServiceStatus(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.UsersRepository.isAgentWithinBusinessHours(agentId);
        });
    }
    changeAgentActiveStatus(agentId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.UsersRepository.setLivechatStatusIf(agentId, status, 
            // Why this works: statusDefault is the property set when a user manually changes their status
            // So if it's set to offline, we can be sure the user will be offline after login and we can skip the update
            { livechatStatusSystemModified: true, statusDefault: { $ne: 'offline' } }, { livechatStatusSystemModified: true });
            if (result.modifiedCount > 0) {
                void (0, notifyListener_1.notifyOnUserChange)({
                    clientAction: 'updated',
                    id: agentId,
                    diff: { statusLivechat: 'available', livechatStatusSystemModified: true },
                });
            }
            return result;
        });
    }
}
exports.AbstractBusinessHourBehavior = AbstractBusinessHourBehavior;
class AbstractBusinessHourType {
    constructor() {
        this.BusinessHourRepository = models_1.LivechatBusinessHours;
        this.UsersRepository = models_1.Users;
    }
    baseSaveBusinessHour(businessHourData) {
        return __awaiter(this, void 0, void 0, function* () {
            businessHourData.active = Boolean(businessHourData.active);
            businessHourData = this.convertWorkHours(businessHourData);
            if (businessHourData._id) {
                yield this.BusinessHourRepository.updateOne({ _id: businessHourData._id }, {
                    $set: businessHourData,
                }); // TODO: Remove this cast when TypeScript is updated
                return businessHourData._id;
            }
            const { insertedId } = yield this.BusinessHourRepository.insertOne(businessHourData);
            return insertedId;
        });
    }
    convertWorkHours(businessHourData) {
        businessHourData.workHours.forEach((hour) => {
            const startUtc = moment_timezone_1.default.tz(`${hour.day}:${hour.start}`, 'dddd:HH:mm', businessHourData.timezone.name).utc();
            const finishUtc = moment_timezone_1.default.tz(`${hour.day}:${hour.finish}`, 'dddd:HH:mm', businessHourData.timezone.name).utc();
            if (hour.open && finishUtc.isBefore(startUtc)) {
                throw new Error('error-business-hour-finish-time-before-start-time');
            }
            if (hour.open && startUtc.isSame(finishUtc)) {
                throw new Error('error-business-hour-finish-time-equals-start-time');
            }
            hour.start = {
                time: hour.start,
                utc: {
                    dayOfWeek: startUtc.clone().format('dddd'),
                    time: startUtc.clone().format('HH:mm'),
                },
                cron: {
                    dayOfWeek: this.formatDayOfTheWeekFromServerTimezoneAndUtcHour(startUtc, 'dddd'),
                    time: this.formatDayOfTheWeekFromServerTimezoneAndUtcHour(startUtc, 'HH:mm'),
                },
            };
            hour.finish = {
                time: hour.finish,
                utc: {
                    dayOfWeek: finishUtc.clone().format('dddd'),
                    time: finishUtc.clone().format('HH:mm'),
                },
                cron: {
                    dayOfWeek: this.formatDayOfTheWeekFromServerTimezoneAndUtcHour(finishUtc, 'dddd'),
                    time: this.formatDayOfTheWeekFromServerTimezoneAndUtcHour(finishUtc, 'HH:mm'),
                },
            };
        });
        return businessHourData;
    }
    getUTCFromTimezone(timezone) {
        if (!timezone) {
            return String((0, moment_timezone_1.default)().utcOffset() / 60);
        }
        return moment_timezone_1.default.tz(timezone).format('Z');
    }
    formatDayOfTheWeekFromServerTimezoneAndUtcHour(utc, format) {
        return (0, moment_timezone_1.default)(utc.format('dddd:HH:mm'), 'dddd:HH:mm')
            .add((0, moment_timezone_1.default)().utcOffset() / 60, 'hours')
            .format(format);
    }
}
exports.AbstractBusinessHourType = AbstractBusinessHourType;
