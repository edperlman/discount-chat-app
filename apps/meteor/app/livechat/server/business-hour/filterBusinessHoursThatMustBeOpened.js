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
exports.filterBusinessHoursThatMustBeOpened = void 0;
const moment_1 = __importDefault(require("moment"));
const filterBusinessHoursThatMustBeOpened = (businessHours) => __awaiter(void 0, void 0, void 0, function* () {
    const currentTime = (0, moment_1.default)((0, moment_1.default)().format('dddd:HH:mm:ss'), 'dddd:HH:mm:ss');
    return businessHours
        .filter((businessHour) => businessHour.active &&
        businessHour.workHours
            .filter((hour) => hour.open)
            .some((hour) => {
            const localTimeStart = (0, moment_1.default)(`${hour.start.cron.dayOfWeek}:${hour.start.cron.time}:00`, 'dddd:HH:mm:ss');
            const localTimeFinish = (0, moment_1.default)(`${hour.finish.cron.dayOfWeek}:${hour.finish.cron.time}:00`, 'dddd:HH:mm:ss');
            // The way we create the instances sunday will be the first day of the current week not the next one, that way it will never met isBefore
            if (localTimeFinish.isBefore(localTimeStart)) {
                localTimeFinish.add(1, 'week');
            }
            return currentTime.isSameOrAfter(localTimeStart) && currentTime.isBefore(localTimeFinish);
        }))
        .map((businessHour) => ({
        _id: businessHour._id,
        type: businessHour.type,
    }));
});
exports.filterBusinessHoursThatMustBeOpened = filterBusinessHoursThatMustBeOpened;
